import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import multer from 'multer';
import fs from 'fs';
import path from 'path';
import { generateQuestionsWithAI, GenerateOptions } from './services/aiService';
import { extractTextFromFile } from './services/documentParser';
import prisma from './lib/prisma';
import { PrismaClient } from '@prisma/client';

// Router Imports
import authRoutes from './routes/auth';
import subjectRoutes from './routes/subjects';
import questionRoutes from './routes/questions';
import examRoutes from './routes/exams';
import analyticsRoutes from './routes/analytics';
import materialRoutes from './routes/materials';
import paymentRoutes from './routes/payments';
import adminRoutes from './routes/admin';
import couponsRoutes from './routes/coupons';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Ensure uploads folder exists
const uploadsDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Serve uploads folder statically
app.use('/uploads', express.static(uploadsDir));

// Multer Config
const upload = multer({
  dest: 'uploads/',
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
});

import { aiLimiter, authLimiter } from './middleware/rateLimiter';
import { sendSubscriptionExpiryWarningEmail } from './lib/email';

// Auth Routes
app.use('/api/auth', authLimiter, authRoutes);

// Subjects Routes
app.use('/api/subjects', subjectRoutes);

// Materials Routes
app.use('/api/materials', materialRoutes);

// Questions (Bank Soal) Routes
app.use('/api/questions', questionRoutes);

// Exams Routes
app.use('/api/exams', examRoutes);

// Analytics Routes
app.use('/api/analytics', analyticsRoutes);

// Pakasir Payment Gateway Routes
app.use('/api/payments', paymentRoutes);

// Admin Routes
app.use('/api/admin', adminRoutes);

// Coupons Routes
app.use('/api/coupons', couponsRoutes);

import { authenticateToken } from './middleware/auth';

// AI Question Generator Endpoint
app.post('/api/ai/generate', authenticateToken, aiLimiter, async (req: Request, res: Response) => {
  try {
    const { materialText, topic, subject, questionTypes, count, difficulty, subjectId, grade, imageBase64, imageMimeType } = req.body;

    if ((!materialText || materialText.trim().length === 0) && !imageBase64) {
      return res.status(400).json({ success: false, message: 'Silakan masukkan materi teks atau unggah gambar materi' });
    }

    const requestedCount = Number(count) || 5;
    if (requestedCount > 15) {
      return res.status(400).json({ success: false, message: 'Maksimal 15 soal per generasi.' });
    }

    // Check user plan and quota
    const user = await prisma.user.findUnique({ where: { id: req.user!.id } });
    if (!user) return res.status(401).json({ success: false, message: 'User tidak valid' });

    let quotaLimit = 1; // FREE
    if (user.plan === 'PERSONAL') quotaLimit = 100;
    if (user.plan === 'PRO_AI') quotaLimit = 300;

    if (user.aiQuotaUsed >= quotaLimit) {
      return res.status(403).json({ success: false, message: `Batas kuota AI paket ${user.plan} telah tercapai.` });
    }

    // Fetch existing question texts for this subject and grade
    let existingQuestions: string[] = [];
    if (subjectId || grade) {
      const whereClause: any = {};
      if (subjectId) whereClause.subjectId = subjectId;
      if (grade) whereClause.grade = grade;

      const dbQuestions = await prisma.question.findMany({
        where: whereClause,
        select: { text: true },
      });
      existingQuestions = dbQuestions.map((q) => q.text);
    }

    const options: GenerateOptions = {
      materialText: materialText || 'Analisis dan buatkan soal dari gambar materi terlampir',
      topic,
      subject,
      questionTypes: questionTypes || ['MULTIPLE_CHOICE'],
      count: Number(count) || 5,
      difficulty: difficulty || 'MEDIUM',
      existingQuestions,
      grade,
      imageBase64,
      imageMimeType,
    };

    const questions = await generateQuestionsWithAI(options);

    // Update user quota
    let incrementAmount = 1; // For FREE, just mark as 1 used (since it's a 1-time generate)
    if (user.plan !== 'FREE') incrementAmount = questions.length; // Pro / Personal counts per question

    await prisma.user.update({
      where: { id: user.id },
      data: { aiQuotaUsed: { increment: incrementAmount } },
    });

    res.json({ success: true, count: questions.length, data: questions });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Failed to generate questions' });
  }
});

// AI Document Upload & Text Extract Route
app.post('/api/ai/upload-extract', authenticateToken, upload.single('file'), async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'Tidak ada file yang diunggah' });
    }

    const filePath = req.file.path;
    const originalName = req.file.originalname;

    const extractedText = await extractTextFromFile(filePath, originalName);

    // Clean up uploaded file
    fs.unlink(filePath, (err) => {
      if (err) console.error('Gagal menghapus file sementara:', err);
    });

    res.json({ success: true, text: extractedText });
  } catch (error: any) {
    // Clean up file on failure
    if (req.file) {
      fs.unlink(req.file.path, () => {});
    }
    console.error('Extraction error:', error);
    res.status(500).json({ success: false, message: error.message || 'Gagal mengekstrak teks dari dokumen' });
  }
});

// Health Check
app.get('/api/health', (req: Request, res: Response) => {
  res.json({ status: 'ok', service: 'Examigo Backend API', version: '1.0.0' });
});

// Global Express Error Handler Middleware
app.use((err: any, req: Request, res: Response, next: any) => {
  console.error('Unhandled Server Error:', err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Terjadi kesalahan internal pada server Express',
  });
});

// Background Task: Cleanup expired pending transactions & send plan expiration warning emails
setInterval(async () => {
  try {
    const threeHoursAgo = new Date(Date.now() - 3 * 60 * 60 * 1000);
    const deleted = await prisma.transaction.deleteMany({
      where: {
        status: 'PENDING',
        createdAt: {
          lt: threeHoursAgo
        }
      }
    });
    if (deleted.count > 0) {
      console.log(`[Cleanup] Berhasil menghapus ${deleted.count} transaksi pending yang kadaluarsa (lebih dari 3 jam).`);
    }

    // Check for subscriptions expiring in <= 3 days
    const now = new Date();
    const threeDaysFromNow = new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000);

    const expiringUsers = await prisma.user.findMany({
      where: {
        plan: { not: 'FREE' },
        planValidUntil: {
          gte: now,
          lte: threeDaysFromNow,
        },
      },
    });

    for (const u of expiringUsers) {
      if (u.planValidUntil) {
        sendSubscriptionExpiryWarningEmail(
          u.email,
          u.name,
          u.plan,
          u.planValidUntil.toLocaleDateString('id-ID')
        ).catch((e) => console.error(`[Warning Email Error] Failed for ${u.email}:`, e));
      }
    }
  } catch (err) {
    console.error('[Cleanup] Error running background tasks:', err);
  }
}, 60 * 60 * 1000); // Check every 1 hour

app.listen(PORT, () => {
  console.log(`🚀 Examigo Server is running on port ${PORT}`);
});
