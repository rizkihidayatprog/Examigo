import { Router } from 'express';
import { requireAdmin } from '../middleware/auth';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

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
        aiQuotaUsed: true,
        aiQuotaLimit: true,
        createdAt: true,
        _count: {
          select: { exams: true, questions: true }
        }
      }
    });
    res.json({ success: true, data: users });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
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
        aiQuotaUsed: true,
        aiQuotaLimit: true,
      }
    });
    res.json({ success: true, data: updatedUser });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
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

export default router;
