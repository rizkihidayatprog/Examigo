import { Router, Request, Response } from 'express';
import { authenticateToken, requireAdmin } from '../middleware/auth';
import prisma from '../lib/prisma';

const router = Router();



/**
 * 1. POST /api/feedback
 * Submit feedback / kritik & saran / review (Authenticated user)
 */
router.post('/', authenticateToken, async (req: Request, res: Response) => {
  try {
    const userId = req.user!.id;
    const { rating = 5, category = 'REVIEW', message, userRole } = req.body;

    const parsedRating = Math.max(1, Math.min(5, parseInt(rating, 10) || 5));
    const trimmedMessage = typeof message === 'string' ? message.trim() : '';

    if (!trimmedMessage || trimmedMessage.length < 3) {
      return res.status(400).json({
        success: false,
        message: 'Pesan kritik/saran/komentar minimal harus terdiri dari 3 karakter.'
      });
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { name: true, email: true, institution: true, position: true, avatarUrl: true }
    });

    const defaultRole = user?.position 
      ? `${user.position}${user.institution ? ` di ${user.institution}` : ''}`
      : (user?.institution || 'Pengajar');

    const feedback = await prisma.feedback.create({
      data: {
        userId,
        userName: user?.name || 'Pengguna Examigo',
        userEmail: user?.email,
        userRole: userRole ? String(userRole).trim() : defaultRole,
        userAvatar: user?.avatarUrl || null,
        rating: parsedRating,
        category: ['REVIEW', 'SUGGESTION', 'CRITIQUE'].includes(category) ? category : 'REVIEW',
        message: trimmedMessage,
        isPublished: false, // Must be approved by Super Admin even if 5 stars
      }
    });

    res.status(201).json({
      success: true,
      message: parsedRating === 5
        ? 'Terima kasih atas bintang 5 dan ulasan Anda! Ulasan Anda akan ditinjau Super Admin untuk ditampilkan di Landing Page.'
        : 'Terima kasih! Kritik dan saran Anda sangat berharga untuk pengembangan platform Examigo.',
      data: feedback
    });
  } catch (error: any) {
    console.error('Submit feedback error:', error);
    res.status(500).json({ success: false, message: error.message || 'Gagal mengirim kritik dan saran.' });
  }
});

/**
 * 2. GET /api/feedback/my
 * Get feedbacks submitted by current user
 */
router.get('/my', authenticateToken, async (req: Request, res: Response) => {
  try {
    const userId = req.user!.id;
    const feedbacks = await prisma.feedback.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' }
    });
    res.json({ success: true, data: feedbacks });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Gagal memuat riwayat kritik & saran.' });
  }
});

/**
 * 3. GET /api/public/testimonials
 * Public endpoint to fetch published 5-star testimonials for Landing Page
 */
router.get('/testimonials', async (_req: Request, res: Response) => {
  return handleGetTestimonials(res);
});

router.get('/public/testimonials', async (_req: Request, res: Response) => {
  return handleGetTestimonials(res);
});

async function handleGetTestimonials(res: Response) {
  try {
    const dbTestimonials = await prisma.feedback.findMany({
      where: {
        isPublished: true,
        rating: 5,
      },
      orderBy: { createdAt: 'desc' },
      take: 12,
      select: {
        id: true,
        userName: true,
        userRole: true,
        userAvatar: true,
        rating: true,
        message: true,
        createdAt: true,
        user: {
          select: {
            avatarUrl: true,
            institution: true,
            position: true,
          }
        }
      }
    });

    const mapped = dbTestimonials.map(t => ({
      id: t.id,
      userName: t.userName || 'Pengguna Examigo',
      userRole: t.userRole || 'Pendidik',
      userAvatar: t.userAvatar || t.user?.avatarUrl || null,
      rating: t.rating,
      message: t.message,
      createdAt: t.createdAt,
    }));

    res.json({
      success: true,
      data: mapped,
    });
  } catch (error: any) {
    console.error('Fetch testimonials error:', error);
    res.json({ success: true, data: [] });
  }
}

/**
 * 4. GET /api/admin/feedbacks & /api/feedback/admin
 * Super Admin: Get all feedback with filters & summary statistics
 */
const handleAdminGetFeedbacks = async (req: Request, res: Response) => {
  try {
    const { category, rating, published, search } = req.query;

    const whereClause: any = {};

    if (category && category !== 'ALL') {
      whereClause.category = String(category);
    }
    if (rating && rating !== 'ALL') {
      whereClause.rating = parseInt(String(rating), 10);
    }
    if (published !== undefined && published !== 'ALL') {
      whereClause.isPublished = published === 'true';
    }
    if (search) {
      const s = String(search).trim();
      whereClause.OR = [
        { userName: { contains: s } },
        { userEmail: { contains: s } },
        { message: { contains: s } },
        { userRole: { contains: s } },
      ];
    }

    const [feedbacks, totalCount, fiveStarCount, publishedCount, suggestionsCount] = await Promise.all([
      prisma.feedback.findMany({
        where: whereClause,
        orderBy: { createdAt: 'desc' },
        include: {
          user: {
            select: { id: true, name: true, email: true, institution: true, avatarUrl: true, plan: true }
          }
        }
      }),
      prisma.feedback.count(),
      prisma.feedback.count({ where: { rating: 5 } }),
      prisma.feedback.count({ where: { isPublished: true } }),
      prisma.feedback.count({ where: { category: { in: ['SUGGESTION', 'CRITIQUE'] } } }),
    ]);

    res.json({
      success: true,
      data: feedbacks,
      stats: {
        total: totalCount,
        fiveStar: fiveStarCount,
        published: publishedCount,
        suggestions: suggestionsCount,
      }
    });
  } catch (error: any) {
    console.error('Admin fetch feedback error:', error);
    res.status(500).json({ success: false, message: error.message || 'Gagal memuat daftar kritik & saran.' });
  }
};

router.get('/admin', requireAdmin, handleAdminGetFeedbacks);
router.get('/admin/feedbacks', requireAdmin, handleAdminGetFeedbacks);

/**
 * 5. PATCH /api/admin/feedbacks/:id/publish & /api/admin/:id/publish
 * Super Admin: Toggle publish status to Landing Page (Only allowed for 5-star ratings!)
 */
const handleAdminTogglePublish = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { isPublished } = req.body;

    const feedback = await prisma.feedback.findUnique({ where: { id } });
    if (!feedback) {
      return res.status(404).json({ success: false, message: 'Data kritik/saran tidak ditemukan.' });
    }

    if (isPublished && feedback.rating !== 5) {
      return res.status(400).json({
        success: false,
        message: 'Hanya penilaian dengan bintang 5 penuh yang diizinkan untuk ditampilkan di Landing Page.'
      });
    }

    const updated = await prisma.feedback.update({
      where: { id },
      data: { isPublished: Boolean(isPublished) }
    });

    res.json({
      success: true,
      message: updated.isPublished
        ? 'Ulasan berhasil diterbitkan ke Landing Page!'
        : 'Ulasan berhasil ditarik dari Landing Page.',
      data: updated
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Gagal memperbarui status publikasi.' });
  }
};

router.patch('/admin/:id/publish', requireAdmin, handleAdminTogglePublish);
router.patch('/admin/feedbacks/:id/publish', requireAdmin, handleAdminTogglePublish);

/**
 * 6. DELETE /api/admin/feedbacks/:id & /api/admin/:id
 * Super Admin: Delete feedback item
 */
const handleAdminDeleteFeedback = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await prisma.feedback.delete({ where: { id } });
    res.json({ success: true, message: 'Kritik/saran berhasil dihapus.' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Gagal menghapus kritik/saran.' });
  }
};

router.delete('/admin/:id', requireAdmin, handleAdminDeleteFeedback);
router.delete('/admin/feedbacks/:id', requireAdmin, handleAdminDeleteFeedback);

export default router;
