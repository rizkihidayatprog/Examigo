import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import multer from 'multer';
import fs from 'fs';
import path from 'path';
import jwt from 'jsonwebtoken';
import { generateQuestionsWithAI, GenerateOptions } from './services/aiService';
import { getAdaptiveLearningContext } from './services/adaptiveMemory';
import { extractTextFromFile } from './services/documentParser';
import prisma from './lib/prisma';
import { PrismaClient } from '@prisma/client';

// Security & Protection Middlewares
import { corsOptions, securityHeadersMiddleware, csrfProtectionMiddleware } from './middleware/security';
import { sanitizeMiddleware } from './middleware/sanitizer';
import { aiLimiter, authLimiter, generalApiLimiter } from './middleware/rateLimiter';
import { AuthPayload, JWT_SECRET, authenticateToken } from './middleware/auth';
import { getCmsConfig } from './routes/cms';
import { sendSubscriptionExpiryWarningEmail } from './lib/email';

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
import cmsRoutes from './routes/cms';
import certificatesRoutes from './routes/certificates';
import feedbackRoutes from './routes/feedback';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Enable proxy trust for accurate client IP resolution behind reverse proxies/load balancers
app.set('trust proxy', 1);

// 1. Security HTTP Headers (X-Content-Type-Options, X-Frame-Options, XSS, Referrer-Policy, Permissions-Policy)
app.use(securityHeadersMiddleware);

// 2. Strict Whitelist-based Cross-Origin Resource Sharing (CORS)
app.use(cors(corsOptions));

// 3. Request Payload Body Parsing with Safe Limits (Prevents memory exhaustion / DoS)
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// 4. Input Sanitization Middleware (Neutralizes XSS, script tags, javascript: protocols)
app.use(sanitizeMiddleware);

// Ensure uploads folder exists
const uploadsDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Serve uploads folder statically
app.use('/uploads', express.static(uploadsDir));

// 5. CSRF Protection Middleware for state-changing HTTP requests (POST, PUT, PATCH, DELETE)
app.use(csrfProtectionMiddleware);

// 6. General API Rate Limiter across all API routes (prevents scraping, brute force & DoS)
app.use('/api', generalApiLimiter);

// Multer Config for document processing
const upload = multer({
  dest: 'uploads/',
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
});

// Global Maintenance Mode Middleware
app.use((req: Request, res: Response, next) => {
  try {
    const config = getCmsConfig();
    if (!config.maintenance?.enabled) {
      return next();
    }

    const reqPath = req.path;

    // Routes that are ALWAYS accessible even during maintenance:
    // 1. Static uploads
    // 2. Admin API routes (/api/admin/*)
    // 3. Public landing & maintenance configs (/api/public/*)
    // 4. Auth login / me / google so Super Admin can still authenticate
    // 5. Payment webhooks so Midtrans settlement is never missed
    // 6. Health check for uptime monitors
    const isExempt = 
      reqPath.startsWith('/uploads') ||
      reqPath.startsWith('/api/admin') ||
      reqPath.startsWith('/api/public') ||
      reqPath === '/api/health' ||
      reqPath === '/api/auth/login' ||
      reqPath === '/api/auth/me' ||
      reqPath === '/api/auth/google' ||
      reqPath === '/api/auth/forgot-password' ||
      reqPath === '/api/payments/midtrans-webhook' ||
      reqPath === '/api/payments/notification' ||
      reqPath === '/api/payments/pakasir-webhook';

    // Check if requester has a valid ADMIN JWT token
    const authHeader = req.headers['authorization'];
    const token = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : null;
    if (token) {
      try {
        const decoded = jwt.verify(token, JWT_SECRET) as AuthPayload;
        if (decoded && decoded.role === 'ADMIN') {
          req.user = decoded;
          return next();
        }
      } catch {
        // Token invalid, proceed to maintenance block
      }
    }

    if (isExempt) {
      return next();
    }

    // Block non-admin requests with 503
    return res.status(503).json({
      success: false,
      inMaintenance: true,
      title: config.maintenance.title || 'Sistem Sedang Dalam Pemeliharaan',
      message: config.maintenance.message || 'Kami sedang melakukan pemeliharaan sistem rutin untuk meningkatkan performa Examigo. Mohon kembali beberapa saat lagi.',
      estimatedEndTime: config.maintenance.estimatedEndTime || '',
      allowAdminLogin: config.maintenance.allowAdminLogin ?? true,
    });
  } catch (err) {
    return next();
  }
});

// Auth Routes (with dedicated authLimiter)
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

// Midtrans Payment Gateway Routes
app.use('/api/payments', paymentRoutes);

// Admin Routes
app.use('/api/admin', adminRoutes);

// Coupons Routes
app.use('/api/coupons', couponsRoutes);

// CMS & Landing Page Configuration Routes
app.use('/api', cmsRoutes);

// Certificates Routes
app.use('/api/certificates', certificatesRoutes);

// Feedback & Testimonials Routes
app.use('/api/feedback', feedbackRoutes);
app.use('/api', feedbackRoutes);

// AI Question Generator Endpoint
app.post('/api/ai/generate', authenticateToken, aiLimiter, async (req: Request, res: Response) => {
  try {
    const cmsConf = getCmsConfig();
    if (cmsConf.maintenance?.features?.aiGeneration && req.user?.role !== 'ADMIN') {
      return res.status(503).json({
        success: false,
        inMaintenance: true,
        scope: 'feature',
        feature: 'aiGeneration',
        message: 'Fitur Generator Soal sedang dalam pemeliharaan rutin. Mohon coba beberapa saat lagi.',
      });
    }

    const { materialText, topic, subject, questionTypes, count, difficulty, subjectId, grade, imageBase64, imageMimeType } = req.body;

    if ((!materialText || materialText.trim().length === 0) && !imageBase64) {
      return res.status(400).json({ success: false, message: 'Silakan masukkan materi teks atau unggah gambar materi' });
    }

      const requestedCount = Number(count) || 5;
      if (requestedCount > 15) {
        return res.status(400).json({ success: false, message: 'Maksimal 15 soal per generasi.' });
      }

      // Check user plan and quota
      let user = await prisma.user.findUnique({ where: { id: req.user!.id } });
      if (!user) return res.status(401).json({ success: false, message: 'User tidak valid' });

      const isPlanExpired = !!(user.planValidUntil && new Date(user.planValidUntil) <= new Date());
      if (isPlanExpired && (user.plan !== 'FREE' || (user.extraAiQuota || 0) > 0 || (user.aiQuotaLimit || 0) > 15)) {
        user = await prisma.user.update({
          where: { id: user.id },
          data: {
            plan: 'FREE',
            aiQuotaLimit: 15,
            extraAiQuota: 0,
            extraParticipantQuota: 0,
            extraActiveExamQuota: 0,
          },
        });
      }

      let quotaLimit = isPlanExpired ? 15 : (user.aiQuotaLimit || 15);
      if (!isPlanExpired && user.plan === 'PERSONAL') quotaLimit = Math.max(quotaLimit, 100);
      if (!isPlanExpired && user.plan === 'PRO_AI') quotaLimit = Math.max(quotaLimit, 300);
      if (!isPlanExpired) quotaLimit += (user.extraAiQuota || 0);

      if (user.plan === 'FREE') {
        const storedCount = await prisma.question.count({
          where: { teacherId: user.id },
        });
        user.aiQuotaUsed = Math.max(user.aiQuotaUsed, storedCount);
      }

      const remainingQuota = Math.max(0, quotaLimit - user.aiQuotaUsed);

      if (user.aiQuotaUsed >= quotaLimit) {
        return res.status(403).json({ 
          success: false, 
          message: `Kapasitas Bank Soal Paket Free Anda (${quotaLimit} butir soal) telah penuh. Silakan hapus beberapa butir soal lama atau upgrade ke paket berbayar untuk menampung lebih banyak soal.` 
        });
      }

      if (requestedCount > remainingQuota) {
        return res.status(400).json({
          success: false,
          message: `Sisa kuota pembuatan soal Anda tinggal ${remainingQuota} butir soal, sedangkan Anda meminta ${requestedCount} butir. Silakan minta maksimal ${remainingQuota} butir soal.`
        });
      }

      let resolvedSubjectName = subject;
      let resolvedSubjectId = subjectId;

      if (subjectId && typeof subjectId === 'string' && subjectId.startsWith('standard:')) {
        resolvedSubjectName = subjectId.replace('standard:', '');
        try {
          let ensured = await prisma.subject.findFirst({
            where: {
              teacherId: user.id,
              name: resolvedSubjectName,
            },
          });
          if (!ensured) {
            ensured = await prisma.subject.create({
              data: {
                teacherId: user.id,
                name: resolvedSubjectName,
                description: 'Kurikulum Standar',
              },
            });
          }
          resolvedSubjectId = ensured.id;
        } catch (e) {
          console.error('Error auto-ensuring subject in /api/ai/generate:', e);
        }
      } else if (subjectId && (!resolvedSubjectName || resolvedSubjectName === 'Umum')) {
        const dbSubj = await prisma.subject.findUnique({ where: { id: subjectId } });
        if (dbSubj) resolvedSubjectName = dbSubj.name;
      }

      // Fetch Adaptive Learning Context (Few-Shot Exemplars, Teacher Style Profile, & Anti-Duplicate Memory)
      const adaptiveContext = await getAdaptiveLearningContext(user.id, {
        subjectId: resolvedSubjectId,
        grade,
        topic,
        difficulty,
        questionTypes,
      });

      const options: GenerateOptions = {
        materialText: materialText || 'Analisis dan buatkan soal dari gambar materi terlampir',
        topic,
        subject: resolvedSubjectName || 'Umum',
        questionTypes: questionTypes || ['MULTIPLE_CHOICE'],
        count: requestedCount,
        difficulty: difficulty || 'MEDIUM',
        existingQuestions: adaptiveContext.existingQuestionTexts,
        referenceExemplars: adaptiveContext.referenceExemplars,
        teacherStyleProfile: adaptiveContext.teacherStyleProfile,
        grade,
        imageBase64,
        imageMimeType,
      };

      const questions = await generateQuestionsWithAI(options);

      // Update user quota by the EXACT number of questions generated
      const incrementAmount = questions.length;

      const updatedUser = await prisma.user.update({
        where: { id: user.id },
        data: { aiQuotaUsed: { increment: incrementAmount } },
        select: { aiQuotaUsed: true },
      });

      res.json({
        success: true,
        count: questions.length,
        data: questions,
        aiQuotaUsed: updatedUser.aiQuotaUsed,
        aiQuotaLimit: quotaLimit,
        remainingQuota: Math.max(0, quotaLimit - updatedUser.aiQuotaUsed),
      });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Failed to generate questions' });
  }
});

// AI Document Upload & Text Extract Route
app.post('/api/ai/upload-extract', authenticateToken, aiLimiter, upload.single('file'), async (req: Request, res: Response) => {
  try {
    const cmsConf = getCmsConfig();
    if (cmsConf.maintenance?.features?.aiGeneration && req.user?.role !== 'ADMIN') {
      return res.status(503).json({
        success: false,
        inMaintenance: true,
        scope: 'feature',
        feature: 'aiGeneration',
        message: 'Fitur ekstraksi dokumen sedang dalam pemeliharaan rutin. Mohon coba beberapa saat lagi.',
      });
    }

    if (!req.file) {
      return res.status(400).json({ success: false, message: 'Tidak ada file yang diunggah' });
    }

    const filePath = req.file.path;
    const originalName = req.file.originalname;
    const ext = path.extname(originalName).toLowerCase() || '.pdf';
    const cleanBase = path.basename(originalName, ext).replace(/[^a-zA-Z0-9_-]/g, '_');
    const uniqueFileName = `doc_${Date.now()}_${cleanBase}${ext}`;
    const destinationPath = path.join(uploadsDir, uniqueFileName);

    // Extract text from uploaded document
    const extractedText = await extractTextFromFile(filePath, originalName);

    // Copy to static persistent uploads folder
    try {
      fs.copyFileSync(filePath, destinationPath);
    } catch (copyErr) {
      console.warn('Gagal menyalin file ke uploads publik:', copyErr);
    }

    // Clean up temporary multer file
    fs.unlink(filePath, (err) => {
      if (err) console.error('Gagal menghapus file sementara:', err);
    });

    const fileUrl = `/uploads/${uniqueFileName}`;
    const fileType = ext.replace('.', '').toUpperCase();

    res.json({
      success: true,
      text: extractedText,
      fileUrl,
      fileName: originalName,
      fileType,
    });
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

// Global Express Error Handler Middleware (Sanitized against leaking stack traces or env variables)
app.use((err: any, req: Request, res: Response, next: any) => {
  console.error('Unhandled Server Error:', err?.message || err);
  const isProd = process.env.NODE_ENV === 'production';
  res.status(err.status || 500).json({
    success: false,
    message: isProd
      ? 'Terjadi kesalahan internal pada server. Permintaan tidak dapat diproses.'
      : (err.message || 'Terjadi kesalahan internal pada server Express'),
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

    // Auto-downgrade expired subscriptions to FREE and reset benefits
    const now = new Date();
    const expiredDowngrade = await prisma.user.updateMany({
      where: {
        planValidUntil: { lte: now },
        OR: [
          { plan: { not: 'FREE' } },
          { extraAiQuota: { gt: 0 } },
          { extraParticipantQuota: { gt: 0 } },
          { extraActiveExamQuota: { gt: 0 } },
          { aiQuotaLimit: { gt: 15 } }
        ]
      },
      data: {
        plan: 'FREE',
        aiQuotaLimit: 15,
        extraAiQuota: 0,
        extraParticipantQuota: 0,
        extraActiveExamQuota: 0,
      }
    });
    if (expiredDowngrade.count > 0) {
      console.log(`[Cleanup] Berhasil mereset ${expiredDowngrade.count} pengguna yang masa aktifnya habis ke paket dasar FREE.`);
    }

    // Check for subscriptions expiring in <= 3 days
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
