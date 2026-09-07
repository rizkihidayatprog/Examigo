import { Router } from 'express';
import { requireAdmin } from '../middleware/auth';
import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';
import { fulfillTransaction } from './payments';

const router = Router();
const prisma = new PrismaClient();

// ─── Real-time System Health ──────────────────────────────────────────────────
router.get('/health', requireAdmin, async (req, res) => {
  const startTime = Date.now();

  // 1. DB Latency — real ping to MySQL/Postgres
  let dbStatus = 'operational';
  let dbLatencyMs = 0;
  let dbLoad = 0;
  try {
    const dbStart = Date.now();
    await prisma.$queryRaw`SELECT 1`;
    dbLatencyMs = Date.now() - dbStart;
    // Realistic thresholds for LOCAL DB:
    // <5ms   = excellent (0-15%)
    // 5-20ms  = normal    (15-40%)
    // 20-50ms = elevated  (40-70%)
    // 50-200ms = high     (70-90%)
    // >200ms  = critical  (90-99%)
    if (dbLatencyMs < 5)       dbLoad = Math.round((dbLatencyMs / 5) * 15);      // 0-15%
    else if (dbLatencyMs < 20) dbLoad = 15 + Math.round(((dbLatencyMs - 5) / 15) * 25);  // 15-40%
    else if (dbLatencyMs < 50) dbLoad = 40 + Math.round(((dbLatencyMs - 20) / 30) * 30); // 40-70%
    else if (dbLatencyMs < 200) dbLoad = 70 + Math.round(((dbLatencyMs - 50) / 150) * 20); // 70-90%
    else dbLoad = 90 + Math.min(Math.round(((dbLatencyMs - 200) / 800) * 9), 9);           // 90-99%
    dbStatus = dbLatencyMs < 200 ? 'operational' : 'degraded';
  } catch {
    dbStatus = 'down';
    dbLoad = 100;
  }

  // 2. Server / API Gateway uptime
  const uptimeSeconds = process.uptime();
  const uptimePct = Math.min(99.9, parseFloat((100 - (1 / (uptimeSeconds / 3600 + 1))).toFixed(1)));

  // 3. Memory usage as proxy for server load
  const memUsage = process.memoryUsage();
  const heapUsedMB = Math.round(memUsage.heapUsed / 1024 / 1024);
  const heapTotalMB = Math.round(memUsage.heapTotal / 1024 / 1024);
  const memLoadPct = Math.min(Math.round((memUsage.heapUsed / memUsage.heapTotal) * 100), 99);

  // 4. Gemini AI Service — check if key is configured & test connectivity
  let aiStatus = 'not_configured';
  let aiLatencyMs: number | null = null;
  try {
    const cmsConfigPath = path.join(__dirname, '../../cms_config.json');
    const cmsRaw = fs.readFileSync(cmsConfigPath, 'utf-8');
    const cmsConfig = JSON.parse(cmsRaw);
    const geminiKey = cmsConfig.geminiApiKey || process.env.GEMINI_API_KEY || '';

    if (geminiKey && geminiKey.length > 10) {
      const aiStart = Date.now();
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 5000);
      try {
        const testRes = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models?key=${geminiKey}`,
          { signal: controller.signal }
        );
        clearTimeout(timeout);
        aiLatencyMs = Date.now() - aiStart;
        aiStatus = testRes.ok ? 'operational' : 'degraded';
      } catch {
        clearTimeout(timeout);
        aiLatencyMs = Date.now() - aiStart;
        aiStatus = 'degraded';
      }
    }
  } catch {
    aiStatus = 'not_configured';
  }

  const responseMs = Date.now() - startTime;

  res.json({
    success: true,
    data: {
      timestamp: new Date().toISOString(),
      apiGateway: {
        status: 'operational',
        uptimePct,
        responseMs,
        uptimeSeconds: Math.round(uptimeSeconds),
      },
      database: {
        status: dbStatus,
        latencyMs: dbLatencyMs,
        loadPct: dbLoad,
        heapUsedMB,
        heapTotalMB,
        memLoadPct,
      },
      geminiAI: {
        status: aiStatus,
        latencyMs: aiLatencyMs,
      },
    },
  });
});

// Get Dashboard Statistics
router.get('/stats', requireAdmin, async (req, res) => {
  try {
    const totalUsers = await prisma.user.count();
    
    const roleStats = await prisma.user.groupBy({
      by: ['role'],
      _count: { role: true }
    });

    const totalAiUsage = await prisma.user.aggregate({
      _sum: { aiQuotaUsed: true }
    });

    const totalExams = await prisma.exam.count();
    const totalQuestions = await prisma.question.count();
    
    // Total Students / Participants who have taken exams
    const totalParticipants = await prisma.participant.count();
    
    const transactions = await prisma.transaction.aggregate({
      _count: { id: true },
      _sum: { amount: true },
      where: { status: 'PAID' }
    });

    res.json({
      success: true,
      data: {
        totalUsers,
        roleStats,
        totalAiUsage: totalAiUsage._sum.aiQuotaUsed || 0,
        totalExams,
        totalQuestions,
        totalParticipants,
        successfulTransactions: transactions._count.id,
        totalRevenue: transactions._sum.amount || 0
      }
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get All Users
router.get('/users', requireAdmin, async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        plan: true,
        planValidUntil: true,
        institution: true,
        phone: true,
        position: true,
        avatarUrl: true,
        bio: true,
        aiQuotaUsed: true,
        aiQuotaLimit: true,
        extraAiQuota: true,
        extraParticipantQuota: true,
        extraActiveExamQuota: true,
        createdAt: true,
        _count: {
          select: { exams: true, questions: true, materials: true }
        }
      }
    });
    res.json({ success: true, data: users });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get Detailed User Info (Profile, School, Exams, Students/Participants, Transactions)
router.get('/users/:id/details', requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const user = await prisma.user.findUnique({
      where: { id },
      include: {
        _count: {
          select: {
            exams: true,
            questions: true,
            materials: true,
            transactions: true,
          }
        },
        exams: {
          orderBy: { createdAt: 'desc' },
          take: 30,
          include: {
            subject: { select: { name: true } },
            _count: {
              select: { participants: true, examQuestions: true }
            }
          }
        },
        transactions: {
          orderBy: { createdAt: 'desc' },
          take: 20
        }
      }
    });

    if (!user) {
      return res.status(404).json({ success: false, message: 'Pengguna tidak ditemukan' });
    }

    // Get participants across this teacher's exams
    const participants = await prisma.participant.findMany({
      where: {
        exam: { teacherId: id }
      },
      orderBy: { startedAt: 'desc' },
      take: 50,
      include: {
        exam: { select: { id: true, title: true, code: true } },
        result: { select: { totalScore: true, maxScore: true, percentage: true, isPassed: true } }
      }
    });

    const totalStudents = await prisma.participant.count({
      where: {
        exam: { teacherId: id }
      }
    });

    res.json({
      success: true,
      data: {
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          plan: user.plan,
          planValidUntil: user.planValidUntil,
          avatarUrl: user.avatarUrl,
          institution: user.institution,
          phone: user.phone,
          position: user.position,
          bio: user.bio,
          aiQuotaUsed: user.aiQuotaUsed,
          aiQuotaLimit: user.aiQuotaLimit,
          extraAiQuota: user.extraAiQuota,
          extraParticipantQuota: user.extraParticipantQuota,
          extraActiveExamQuota: user.extraActiveExamQuota,
          createdAt: user.createdAt,
          counts: {
            exams: user._count.exams,
            questions: user._count.questions,
            materials: user._count.materials,
            students: totalStudents,
            transactions: user._count.transactions,
          }
        },
        exams: user.exams,
        participants,
        transactions: user.transactions
      }
    });
  } catch (error: any) {
    console.error('Error fetching user details:', error);
    res.status(500).json({ success: false, message: error.message || 'Gagal memuat rincian pengguna' });
  }
});

// Update User (Plan, Role)
router.put('/users/:id', requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { role, plan, aiQuotaLimit, aiQuotaUsed, planValidUntil } = req.body;

    const dataToUpdate: any = {};
    if (role) dataToUpdate.role = role;
    if (plan) dataToUpdate.plan = plan;
    if (planValidUntil !== undefined) dataToUpdate.planValidUntil = planValidUntil ? new Date(planValidUntil) : null;
    if (typeof aiQuotaLimit === 'number') dataToUpdate.aiQuotaLimit = aiQuotaLimit;
    if (typeof aiQuotaUsed === 'number') dataToUpdate.aiQuotaUsed = aiQuotaUsed;

    const updatedUser = await prisma.user.update({
      where: { id },
      data: dataToUpdate,
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        plan: true,
        planValidUntil: true,
        aiQuotaUsed: true,
        aiQuotaLimit: true,
      }
    });
    res.json({ success: true, data: updatedUser });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Delete Single User
router.delete('/users/:id', requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const currentAdminId = req.user?.id;

    if (currentAdminId && currentAdminId === id) {
      return res.status(400).json({ 
        success: false, 
        message: 'Tidak dapat menghapus akun Anda sendiri yang sedang aktif digunakan.' 
      });
    }

    const user = await prisma.user.findUnique({ where: { id } });
    if (!user) {
      return res.status(404).json({ success: false, message: 'Pengguna tidak ditemukan.' });
    }

    // Preserve feedback profile snapshot even when user account is deleted
    await prisma.feedback.updateMany({
      where: { userId: id, userAvatar: null },
      data: {
        userAvatar: user.avatarUrl,
        userName: user.name,
      }
    });

    await prisma.user.delete({ where: { id } });

    res.json({ 
      success: true, 
      message: `Pengguna ${user.name} (${user.email}) berhasil dihapus.` 
    });
  } catch (error: any) {
    console.error('Error deleting user:', error);
    res.status(500).json({ success: false, message: error.message || 'Gagal menghapus pengguna.' });
  }
});

// Bulk Delete Users
router.post('/users/bulk-delete', requireAdmin, async (req, res) => {
  try {
    const { ids } = req.body;
    const currentAdminId = req.user?.id;

    if (!Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ success: false, message: 'Daftar ID pengguna tidak valid.' });
    }

    // Exclude current admin from deletion
    const safeIds = ids.filter((id: string) => id !== currentAdminId);

    if (safeIds.length === 0) {
      return res.status(400).json({ 
        success: false, 
        message: 'Tidak ada pengguna yang dapat dihapus (akun admin aktif dilindungi).' 
      });
    }

    // Preserve feedback snapshots for deleting users
    const usersToDelete = await prisma.user.findMany({
      where: { id: { in: safeIds } },
      select: { id: true, name: true, avatarUrl: true }
    });
    for (const u of usersToDelete) {
      await prisma.feedback.updateMany({
        where: { userId: u.id, userAvatar: null },
        data: { userAvatar: u.avatarUrl, userName: u.name }
      });
    }

    const deleteResult = await prisma.user.deleteMany({
      where: {
        id: { in: safeIds },
      },
    });

    res.json({
      success: true,
      message: `Berhasil menghapus ${deleteResult.count} pengguna.`,
      count: deleteResult.count,
    });
  } catch (error: any) {
    console.error('Error bulk deleting users:', error);
    res.status(500).json({ success: false, message: error.message || 'Gagal menghapus pengguna.' });
  }
});

// Get All Transactions
router.get('/transactions', requireAdmin, async (req, res) => {
  try {
    const transactions = await prisma.transaction.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        user: { select: { name: true, email: true } }
      }
    });
    res.json({ success: true, data: transactions });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Approve Transaction Manually (Super Admin)
router.post('/transactions/:orderId/approve', requireAdmin, async (req, res) => {
  try {
    const { orderId } = req.params;
    const transaction = await prisma.transaction.findUnique({
      where: { orderId },
      include: { user: true },
    });

    if (!transaction) {
      return res.status(404).json({ success: false, message: 'Transaksi tidak ditemukan' });
    }

    if (transaction.status === 'PAID') {
      return res.json({ success: true, message: 'Transaksi ini sudah berstatus PAID sebelumnya.' });
    }

    // Fulfill benefits and mark as PAID
    await fulfillTransaction(transaction);

    res.json({
      success: true,
      message: `Transaksi ${orderId} berhasil disetujui! Benefit pengguna telah diaktifkan.`,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Gagal menyetujui transaksi' });
  }
});

// Approve All Pending Transactions (Super Admin)
router.post('/transactions/approve-all', requireAdmin, async (req, res) => {
  try {
    const pendingTxs = await prisma.transaction.findMany({
      where: { status: 'PENDING' },
      include: { user: true },
    });

    if (pendingTxs.length === 0) {
      return res.json({ success: true, message: 'Tidak ada transaksi berstatus PENDING untuk disetujui.', count: 0 });
    }

    let approvedCount = 0;
    for (const tx of pendingTxs) {
      try {
        await fulfillTransaction(tx);
        approvedCount++;
      } catch (err: any) {
        console.error(`Gagal fulfill transaksi ${tx.orderId}:`, err);
      }
    }

    res.json({
      success: true,
      message: `Berhasil menyetujui ${approvedCount} dari ${pendingTxs.length} transaksi pending! Benefit pengguna telah diaktifkan otomatis.`,
      count: approvedCount,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Gagal menyetujui semua transaksi' });
  }
});

// Reject Transaction (Super Admin)
router.post('/transactions/:orderId/reject', requireAdmin, async (req, res) => {
  try {
    const { orderId } = req.params;
    const transaction = await prisma.transaction.findUnique({
      where: { orderId },
    });

    if (!transaction) {
      return res.status(404).json({ success: false, message: 'Transaksi tidak ditemukan' });
    }

    await prisma.transaction.update({
      where: { orderId },
      data: { status: 'FAILED' },
    });

    res.json({
      success: true,
      message: `Transaksi ${orderId} telah ditandai sebagai GAGAL / DITOLAK.`,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Gagal menolak transaksi' });
  }
});

export default router;
