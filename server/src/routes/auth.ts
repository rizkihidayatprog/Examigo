import { Router, Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import { z } from 'zod';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { signToken, authenticateToken } from '../middleware/auth';
import { strictLimiter } from '../middleware/rateLimiter';
import prisma from '../lib/prisma';
import { sendPasswordResetEmail } from '../lib/email';
import { getCmsConfig } from './cms';

const uploadsDir = path.join(process.cwd(), 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const avatarStorage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase() || '.jpg';
    cb(null, `avatar_${Date.now()}_${Math.random().toString(36).substring(2, 8)}${ext}`);
  },
});

const avatarUpload = multer({
  storage: avatarStorage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (_req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Hanya berkas gambar (PNG, JPG, WebP) yang diizinkan'));
    }
  },
});

const router = Router();

const registerSchema = z.object({
  name: z.string().min(2, 'Nama minimal 2 karakter'),
  email: z.string().email('Email tidak valid'),
  password: z.string().min(6, 'Password minimal 6 karakter'),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

// POST /api/auth/register
router.post('/register', async (req: Request, res: Response) => {
  try {
    const config = getCmsConfig();
    if (config.maintenance?.enabled) {
      return res.status(503).json({
        success: false,
        inMaintenance: true,
        message: 'Pendaftaran akun baru dinonaktifkan sementara karena sistem sedang dalam mode pemeliharaan.',
      });
    }

    const data = registerSchema.parse(req.body);

    const existingUser = await prisma.user.findUnique({
      where: { email: data.email },
    });

    if (existingUser) {
      return res.status(409).json({ success: false, message: 'Email sudah terdaftar' });
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);
    const newUser = await prisma.user.create({
      data: {
        email: data.email,
        password: hashedPassword,
        name: data.name,
        role: 'TEACHER',
      },
    });

    const token = signToken({ id: newUser.id, email: newUser.email, role: newUser.role });

    res.status(201).json({
      success: true,
      data: {
        token,
        user: { 
          id: newUser.id, 
          name: newUser.name, 
          email: newUser.email, 
          role: newUser.role,
          plan: newUser.plan,
          planValidUntil: newUser.planValidUntil,
          avatarUrl: newUser.avatarUrl,
          institution: newUser.institution,
          phone: newUser.phone,
          position: newUser.position || 'Koordinator Ujian',
          bio: newUser.bio,
          aiQuotaLimit: newUser.aiQuotaLimit,
          aiQuotaUsed: newUser.aiQuotaUsed
        },
      },
    });
  } catch (err: any) {
    if (err instanceof z.ZodError) {
      return res.status(400).json({ success: false, message: err.errors[0].message });
    }
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST /api/auth/login
router.post('/login', async (req: Request, res: Response) => {
  try {
    const data = loginSchema.parse(req.body);
    const user = await prisma.user.findUnique({
      where: { email: data.email },
    });

    if (!user) {
      return res.status(401).json({ success: false, message: 'Email atau password salah' });
    }

    const isMatch = await bcrypt.compare(data.password, user.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Email atau password salah' });
    }

    const config = getCmsConfig();
    if (config.maintenance?.enabled && user.role !== 'ADMIN') {
      return res.status(503).json({
        success: false,
        inMaintenance: true,
        title: config.maintenance.title || 'Sistem Sedang Dalam Pemeliharaan',
        message: config.maintenance.message || 'Sistem sedang dalam mode pemeliharaan. Hanya Super Admin yang diizinkan masuk saat ini.',
        estimatedEndTime: config.maintenance.estimatedEndTime || '',
        allowAdminLogin: config.maintenance.allowAdminLogin ?? true,
      });
    }

    const token = signToken({ id: user.id, email: user.email, role: user.role });

    res.json({
      success: true,
      data: {
        token,
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
          position: user.position || 'Koordinator Ujian',
          bio: user.bio,
          aiQuotaLimit: user.aiQuotaLimit, 
          aiQuotaUsed: user.aiQuotaUsed 
        },
      },
    });
  } catch (err: any) {
    if (err instanceof z.ZodError) {
      return res.status(400).json({ success: false, message: err.errors[0].message });
    }
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST /api/auth/forgot-password
router.post('/forgot-password', strictLimiter, async (req: Request, res: Response) => {
  try {
    const config = getCmsConfig();
    if (config.maintenance?.enabled) {
      return res.status(503).json({
        success: false,
        inMaintenance: true,
        message: 'Layanan pemulihan kata sandi dinonaktifkan sementara karena sistem sedang dalam mode pemeliharaan.',
      });
    }

    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ success: false, message: 'Email wajib diisi' });
    }

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      // Don't disclose user non-existence for security, return success
      return res.json({ success: true, message: 'Jika email terdaftar, tautan atur ulang password telah dikirim ke inbox Anda.' });
    }

    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetPasswordExpires = new Date(Date.now() + 3600000); // 1 hour

    await prisma.user.update({
      where: { id: user.id },
      data: {
        resetPasswordToken: resetToken,
        resetPasswordExpires,
      },
    });

    // Send reset email via Nodemailer
    await sendPasswordResetEmail(user.email, user.name, resetToken);

    res.json({
      success: true,
      message: 'Instruksi atur ulang password telah dikirimkan ke email Anda.',
    });
  } catch (err: any) {
    console.error('Forgot password error:', err);
    res.status(500).json({ success: false, message: 'Gagal memproses permintaan atur ulang password.' });
  }
});

// POST /api/auth/reset-password
router.post('/reset-password', strictLimiter, async (req: Request, res: Response) => {
  try {
    const { token, newPassword } = req.body;
    if (!token || !newPassword || newPassword.length < 6) {
      return res.status(400).json({ success: false, message: 'Token dan password baru (min 6 karakter) wajib diisi' });
    }

    const user = await prisma.user.findFirst({
      where: {
        resetPasswordToken: token,
        resetPasswordExpires: {
          gt: new Date(),
        },
      },
    });

    if (!user) {
      return res.status(400).json({ success: false, message: 'Token tidak valid atau sudah kedaluwarsa.' });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await prisma.user.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
        resetPasswordToken: null,
        resetPasswordExpires: null,
      },
    });

    res.json({
      success: true,
      message: 'Password berhasil diperbarui! Silakan login dengan password baru Anda.',
    });
  } catch (err: any) {
    console.error('Reset password error:', err);
    res.status(500).json({ success: false, message: 'Gagal memperbarui password.' });
  }
});

// POST /api/auth/google (Single Sign-On Login/Register via Google Identity Services)
router.post('/google', async (req: Request, res: Response) => {
  try {
    const { credential } = req.body;

    // Google ID Token (credential) is strictly required to prevent account impersonation
    if (!credential || typeof credential !== 'string' || !credential.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Kredensial token Google (ID Token) wajib disertakan untuk Single Sign-On.',
      });
    }

    let tokenInfo: any;
    try {
      const verifyRes = await fetch(`https://oauth2.googleapis.com/tokeninfo?id_token=${encodeURIComponent(credential.trim())}`);
      if (!verifyRes.ok) {
        return res.status(401).json({
          success: false,
          message: 'Verifikasi token Google gagal atau sesi otentikasi telah kedaluwarsa.',
        });
      }
      tokenInfo = await verifyRes.json();
    } catch (verifyErr: any) {
      console.error('Google tokeninfo verification error:', verifyErr);
      return res.status(401).json({
        success: false,
        message: 'Gagal memverifikasi keabsahan token akun Google dengan server Google.',
      });
    }

    if (!tokenInfo || !tokenInfo.email) {
      return res.status(400).json({
        success: false,
        message: 'Alamat email tidak ditemukan pada profil akun Google Anda.',
      });
    }

    // Verify email verification status by Google
    if (tokenInfo.email_verified !== 'true' && tokenInfo.email_verified !== true) {
      return res.status(400).json({
        success: false,
        message: 'Alamat email akun Google belum terverifikasi oleh Google.',
      });
    }

    // Verify target client ID audience if configured
    const configuredClientId = process.env.GOOGLE_CLIENT_ID;
    if (configuredClientId && tokenInfo.aud && tokenInfo.aud !== configuredClientId) {
      console.warn('⚠️ Google Token Audience Mismatch:', { expected: configuredClientId, received: tokenInfo.aud });
      return res.status(401).json({
        success: false,
        message: 'Token Google tidak ditujukan untuk aplikasi Examigo.',
      });
    }

    const userEmail = String(tokenInfo.email).toLowerCase().trim();
    const userName = tokenInfo.name ? String(tokenInfo.name).trim() : userEmail.split('@')[0];
    const userGoogleId = String(tokenInfo.sub);
    const userAvatarUrl = tokenInfo.picture ? String(tokenInfo.picture).trim() : undefined;

    let user = await prisma.user.findUnique({ where: { email: userEmail } });

    const config = getCmsConfig();
    if (config.maintenance?.enabled) {
      if (!user) {
        return res.status(503).json({
          success: false,
          inMaintenance: true,
          message: 'Pendaftaran akun baru dinonaktifkan sementara karena sistem sedang dalam mode pemeliharaan.',
        });
      }
      if (user.role !== 'ADMIN') {
        return res.status(503).json({
          success: false,
          inMaintenance: true,
          title: config.maintenance.title || 'Sistem Sedang Dalam Pemeliharaan',
          message: config.maintenance.message || 'Sistem sedang dalam mode pemeliharaan. Hanya Super Admin yang diizinkan masuk saat ini.',
          estimatedEndTime: config.maintenance.estimatedEndTime || '',
          allowAdminLogin: config.maintenance.allowAdminLogin ?? true,
        });
      }
    }

    if (!user) {
      // Create user with random secure password
      const randomPassword = crypto.randomBytes(16).toString('hex');
      const hashedPassword = await bcrypt.hash(randomPassword, 10);
      user = await prisma.user.create({
        data: {
          email: userEmail,
          name: userName || userEmail.split('@')[0],
          password: hashedPassword,
          googleId: userGoogleId || `google_${Date.now()}`,
          avatarUrl: userAvatarUrl || undefined,
          role: 'TEACHER',
          plan: 'FREE',
          aiQuotaLimit: 15,
        },
      });
    } else if ((!user.googleId && userGoogleId) || (!user.avatarUrl && userAvatarUrl)) {
      // Link Google ID and update avatar
      user = await prisma.user.update({
        where: { id: user.id },
        data: { 
          googleId: userGoogleId || user.googleId, 
          avatarUrl: userAvatarUrl || user.avatarUrl 
        },
      });
    }

    const token = signToken({ id: user.id, email: user.email, role: user.role });

    res.json({
      success: true,
      data: {
        token,
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
          position: user.position || 'Koordinator Ujian',
          bio: user.bio,
          aiQuotaLimit: user.aiQuotaLimit,
          aiQuotaUsed: user.aiQuotaUsed,
        },
      },
    });
  } catch (err: any) {
    console.error('Google Auth error:', err);
    res.status(500).json({ success: false, message: 'Gagal autentikasi via Google.' });
  }
});

// POST /api/auth/upload-avatar (Upload profile photo)
router.post('/upload-avatar', authenticateToken, avatarUpload.single('avatar'), async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'Tidak ada berkas foto yang diunggah.' });
    }

    const avatarUrl = `/uploads/${req.file.filename}`;
    await prisma.user.update({
      where: { id: req.user!.id },
      data: { avatarUrl },
    });

    res.json({
      success: true,
      message: 'Foto profil berhasil diperbarui!',
      avatarUrl,
    });
  } catch (err: any) {
    console.error('Upload avatar error:', err);
    res.status(500).json({ success: false, message: err.message || 'Gagal mengunggah foto profil' });
  }
});

// PUT /api/auth/profile (Update Profile & Change Password)
router.put('/profile', authenticateToken, async (req: Request, res: Response) => {
  try {
    const userId = req.user!.id;
    const { name, email, avatarUrl, institution, phone, position, bio, currentPassword, newPassword } = req.body;

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      return res.status(404).json({ success: false, message: 'User tidak ditemukan' });
    }

    const updateData: any = {};
    if (name) updateData.name = name.trim();
    if (avatarUrl !== undefined) updateData.avatarUrl = avatarUrl.trim() || null;
    if (institution !== undefined) updateData.institution = institution.trim() || null;
    if (phone !== undefined) updateData.phone = phone.trim() || null;
    if (position !== undefined) updateData.position = position.trim() || 'Koordinator Ujian';
    if (bio !== undefined) updateData.bio = bio.trim() || null;

    // If changing email, check uniqueness
    if (email && email.trim().toLowerCase() !== user.email.toLowerCase()) {
      const cleanEmail = email.trim().toLowerCase();
      const existingEmail = await prisma.user.findUnique({
        where: { email: cleanEmail },
      });
      if (existingEmail && existingEmail.id !== userId) {
        return res.status(400).json({ success: false, message: 'Alamat email ini sudah digunakan oleh akun lain.' });
      }
      updateData.email = cleanEmail;
    }

    if (newPassword) {
      if (!currentPassword) {
        return res.status(400).json({ success: false, message: 'Password saat ini wajib diisi untuk mengubah password.' });
      }
      const isMatch = await bcrypt.compare(currentPassword, user.password);
      if (!isMatch) {
        return res.status(400).json({ success: false, message: 'Password saat ini tidak sesuai.' });
      }
      if (newPassword.length < 6) {
        return res.status(400).json({ success: false, message: 'Password baru minimal 6 karakter.' });
      }
      updateData.password = await bcrypt.hash(newPassword, 10);
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: updateData,
      include: {
        _count: {
          select: { exams: true, questions: true },
        },
      },
    });

    const token = signToken({ id: updatedUser.id, email: updatedUser.email, role: updatedUser.role });

    res.json({
      success: true,
      message: 'Profil berhasil diperbarui!',
      token,
      data: {
        id: updatedUser.id,
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role,
        plan: updatedUser.plan,
        planValidUntil: updatedUser.planValidUntil,
        avatarUrl: updatedUser.avatarUrl,
        institution: updatedUser.institution,
        phone: updatedUser.phone,
        position: updatedUser.position || 'Koordinator Ujian',
        bio: updatedUser.bio,
        createdAt: updatedUser.createdAt,
        aiQuotaLimit: updatedUser.aiQuotaLimit,
        aiQuotaUsed: updatedUser.aiQuotaUsed,
        examsCount: updatedUser._count.exams,
        questionsCount: updatedUser._count.questions,
      },
    });
  } catch (err: any) {
    console.error('Update profile error:', err);
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/auth/me
router.get('/me', authenticateToken, async (req: Request, res: Response) => {
  try {
    let user = await prisma.user.findUnique({
      where: { id: req.user!.id },
      include: {
        _count: {
          select: { exams: true, questions: true },
        },
      },
    });
    if (!user) {
      return res.status(404).json({ success: false, message: 'User tidak ditemukan' });
    }

    // Auto-downgrade to FREE if subscription validity has expired
    const isPlanExpired = !!(user.planValidUntil && new Date(user.planValidUntil) <= new Date());
    if (isPlanExpired && (user.plan !== 'FREE' || (user.extraAiQuota || 0) > 0 || (user.extraParticipantQuota || 0) > 0 || (user.extraActiveExamQuota || 0) > 0 || (user.aiQuotaLimit || 0) > 15)) {
      user = await prisma.user.update({
        where: { id: user.id },
        data: {
          plan: 'FREE',
          aiQuotaLimit: 15,
          extraAiQuota: 0,
          extraParticipantQuota: 0,
          extraActiveExamQuota: 0,
        },
        include: {
          _count: {
            select: { exams: true, questions: true },
          },
        },
      });
      console.log(`[Auto-Downgrade /me] User ${user.email} masa aktif habis. Otomatis reset semua benefit ke paket default FREE.`);
    }
    res.json({
      success: true,
      data: { 
        id: user.id, 
        name: user.name, 
        email: user.email, 
        role: user.role,
        plan: user.plan, 
        planValidUntil: user.planValidUntil,
        avatarUrl: user.avatarUrl,
        institution: user.institution,
        phone: user.phone,
        position: user.position || 'Koordinator Ujian',
        bio: user.bio,
        createdAt: user.createdAt,
        aiQuotaLimit: user.aiQuotaLimit, 
        aiQuotaUsed: user.aiQuotaUsed,
        examsCount: user._count.exams,
        questionsCount: user._count.questions,
      },
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});

export default router;

