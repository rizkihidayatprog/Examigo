import { Router, Request, Response } from 'express';
import fs from 'fs';
import path from 'path';
import multer from 'multer';
import { requireAdmin } from '../middleware/auth';

const router = Router();
const CMS_CONFIG_FILE = path.join(__dirname, '../../cms_config.json');

// Storage setup for CMS uploads
const uploadsDir = path.join(process.cwd(), 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase() || '.jpg';
    const unique = `auth_${Date.now()}_${Math.round(Math.random() * 1e4)}${ext}`;
    cb(null, unique);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (_req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Hanya file gambar (JPG, PNG, WebP) yang diperbolehkan.'));
    }
  }
});

// Default initial CMS configuration
const defaultCmsConfig = {
  theme: {
    preset: 'emerald', // emerald | indigo | ocean | purple
    primaryColor: '#064E3B',
    accentColor: '#10B981',
    highlightColor: '#34D399',
  },
  hero: {
    pillText: 'Platform Pembuat Ujian & Kuis Online Cerdas No. 1 di Indonesia',
    headlineMain: 'Bikin Soal & Ujian Online',
    headlineHighlight: '10x Lebih Cepat',
    subtitle: 'Unggah materi pelajaran (PDF, Word, PPTX, atau Foto). Otomatis meracik bank soal, mengacak nomor & opsi, mengunci layar anti-contek, serta menilai hasil siswa secara instan.',
    primaryCtaText: 'Coba Generator Soal Gratis',
  },
  pricing: {
    free: {
      name: 'Free',
      badge: 'Paket Dasar',
      monthlyPrice: 0,
      yearlyPrice: 0,
      maxAiQuestions: 15,
      maxParticipants: 5,
      maxActiveExams: 1,
      features: [
        'Maks. 5 Peserta Ujian',
        'Maks. 1 Ujian Aktif',
        'Maks. 15 Butir Soal Otomatis',
        'Input Soal Manual',
        'Auto-Grading PG'
      ]
    },
    personal: {
      name: 'Personal',
      badge: 'Guru Mandiri',
      monthlyPrice: 49000,
      yearlyPrice: 490000,
      maxAiQuestions: 100,
      maxParticipants: 50,
      maxActiveExams: 5,
      features: [
        '100 Soal /bulan',
        'Maks. 50 Peserta Ujian',
        'Maks. 5 Ujian Aktif',
        'Upload Dokumen (PDF, Word, PPT)',
        'Acak Soal & Basic Anti-Cheat',
        'Export Excel & CSV'
      ]
    },
    pro_ai: {
      name: 'Pro',
      badge: 'Sekolah & Bimbel',
      isPopular: true,
      monthlyPrice: 149000,
      yearlyPrice: 1490000,
      maxAiQuestions: 300,
      maxParticipants: 200,
      maxActiveExams: 15,
      features: [
        '300 Soal /bulan',
        'Maks. 200 Peserta Ujian',
        'Maks. 15 Ujian Aktif',
        'Koreksi Esai & Scan Foto Soal',
        'Fullscreen Lock Anti-Cheat',
        'Ekspor PDF & 3 Akses Guru'
      ]
    }
  },
  faqs: [
    {
      q: 'Bagaimana cara kerja Generator Otomatis dalam membuat soal?',
      a: 'Anda hanya perlu mengunggah dokumen materi dalam format PDF, Word, PowerPoint, atau foto lembar soal. Sistem cerdas akan membaca seluruh konteks materi dan meracik butir soal sesuai tipe dan tingkat kesulitan yang Anda tentukan beserta kunci jawabannya.'
    },
    {
      q: 'Bagaimana cara mencegah siswa mencontek saat ujian online?',
      a: 'Examigo memiliki fitur Acak Soal & Pilihan Otomatis (setiap siswa mendapat urutan nomor dan opsi A/B/C/D yang berbeda), serta Fullscreen Lock Anti-Cheat pada paket Pro yang otomatis mengunci layar ujian.'
    },
    {
      q: 'Apakah hasil ujian bisa langsung diekspor ke Excel?',
      a: 'Ya, seluruh nilai siswa, detail jawaban benar/salah, serta analisis ketuntasan kelas dapat diunduh langsung ke dalam format Excel (.xlsx), CSV murni, ataupun dicetak ke PDF.'
    },
    {
      q: 'Metode pembayaran apa saja yang didukung?',
      a: 'Examigo terintegrasi resmi dengan Pakasir Payment Gateway yang mendukung pembayaran instan via QRIS (GoPay, OVO, Dana, ShopeePay, BCA/Mandiri Mobile), Virtual Account Bank, dan Transfer.'
    }
  ],
  addonPricing: {
    enabled: true,
    pricePerAiQuestion: 500,
    pricePerStudent: 200,
    pricePerActiveExam: 5000,
    minAiQuestions: 10,
    minStudents: 10,
    minActiveExams: 1,
  },
  authPages: {
    login: {
      imageUrl: '/images/auth/login-showcase.jpg',
      images: ['/images/auth/login-showcase.jpg'],
      badge: 'Platform Ujian Online Terpadu',
      headline: 'Platform Pembuat Ujian & Soal Otomatis No. 1',
      subtitle: 'Masuk ke akun Examigo Anda untuk mengelola bank soal terpadu, ujian anti-contek, dan penilaian otomatis instan.',
      formPosition: 'right'
    },
    register: {
      imageUrl: '/images/auth/register-showcase.jpg',
      images: ['/images/auth/register-showcase.jpg'],
      badge: 'Bergabung Bersama 10.000+ Guru & Lembaga',
      headline: 'Mulai Transformasi Ujian Digital Cerdas',
      subtitle: 'Daftar gratis sekarang. Bikin soal dari materi pelajaran hanya dalam hitungan detik dan terbitkan ujian secara instan.',
      formPosition: 'left'
    },
    forgotPassword: {
      imageUrl: '/images/auth/login-showcase.jpg',
      images: ['/images/auth/login-showcase.jpg'],
      badge: 'Keamanan Akun Terjamin',
      headline: 'Pemulihan Akses Akun Examigo',
      subtitle: 'Jangan khawatir, kami akan membantu memulihkan akses akun Anda dengan tautan verifikasi aman ke email terdaftar.',
      formPosition: 'right'
    }
  },
  maintenance: {
    enabled: false,
    title: 'Sistem Sedang Dalam Pemeliharaan',
    message: 'Kami sedang melakukan pemeliharaan sistem rutin dan peningkatan performa server Examigo. Layanan akan segera kembali normal.',
    estimatedEndTime: '',
    allowAdminLogin: true,
    features: {
      payments: false,
      aiGeneration: false,
      examCreation: false,
      studentExams: false,
    }
  }
};

// Helper to read config
export function getCmsConfig() {
  try {
    if (fs.existsSync(CMS_CONFIG_FILE)) {
      const raw = fs.readFileSync(CMS_CONFIG_FILE, 'utf-8');
      const parsed = JSON.parse(raw);
      const merged = { ...defaultCmsConfig, ...parsed };

      // Ensure fallback to default images if empty
      if (merged.authPages) {
        const loginImgs = (Array.isArray(merged.authPages.login?.images) ? merged.authPages.login.images : [merged.authPages.login?.imageUrl])
          .filter((x: any) => typeof x === 'string' && x.trim().length > 0);
        merged.authPages.login = {
          ...merged.authPages.login,
          imageUrl: merged.authPages.login?.imageUrl?.trim() || '/images/auth/login-showcase.jpg',
          images: loginImgs.length > 0 ? loginImgs : ['/images/auth/login-showcase.jpg']
        };

        const regImgs = (Array.isArray(merged.authPages.register?.images) ? merged.authPages.register.images : [merged.authPages.register?.imageUrl])
          .filter((x: any) => typeof x === 'string' && x.trim().length > 0);
        merged.authPages.register = {
          ...merged.authPages.register,
          imageUrl: merged.authPages.register?.imageUrl?.trim() || '/images/auth/register-showcase.jpg',
          images: regImgs.length > 0 ? regImgs : ['/images/auth/register-showcase.jpg']
        };

        const forgotImgs = (Array.isArray(merged.authPages.forgotPassword?.images) ? merged.authPages.forgotPassword.images : [merged.authPages.forgotPassword?.imageUrl])
          .filter((x: any) => typeof x === 'string' && x.trim().length > 0);
        merged.authPages.forgotPassword = {
          ...merged.authPages.forgotPassword,
          imageUrl: merged.authPages.forgotPassword?.imageUrl?.trim() || '/images/auth/login-showcase.jpg',
          images: forgotImgs.length > 0 ? forgotImgs : ['/images/auth/login-showcase.jpg']
        };
      }

      return merged;
    }
  } catch (err) {
    console.error('Error reading CMS config:', err);
  }
  return defaultCmsConfig;
}

// Helper to save config
export function saveCmsConfig(config: any) {
  fs.writeFileSync(CMS_CONFIG_FILE, JSON.stringify(config, null, 2), 'utf-8');
}

// POST /api/admin/cms/upload-auth-image (Upload local image for auth showcase)
router.post('/admin/cms/upload-auth-image', requireAdmin, upload.single('image'), (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'Tidak ada file gambar yang diunggah.' });
    }
    const imageUrl = `/uploads/${req.file.filename}`;
    res.json({
      success: true,
      message: 'Gambar showcase berhasil diunggah!',
      imageUrl
    });
  } catch (err: any) {
    console.error('Upload auth image error:', err);
    res.status(500).json({ success: false, message: err.message || 'Gagal mengunggah gambar.' });
  }
});

// GET /api/public/landing-config (Public endpoint for Landing Page, Checkout & Settings)
router.get('/public/landing-config', (req: Request, res: Response) => {
  const config = getCmsConfig();
  // Strip sensitive credentials before exposing to public consumers
  const { geminiApiKey, ...safeConfig } = config;
  res.json({ success: true, data: safeConfig });
});

// GET /api/admin/cms (Admin only)
router.get('/admin/cms', requireAdmin, (req: Request, res: Response) => {
  const config = getCmsConfig();
  const rawKey = config.geminiApiKey || '';
  const maskedKey = rawKey.length > 8
    ? `${rawKey.slice(0, 4)}••••••••••••${rawKey.slice(-4)}`
    : rawKey ? '••••••••••••' : '';

  res.json({
    success: true,
    data: {
      ...config,
      geminiApiKey: maskedKey,
      hasGeminiApiKey: Boolean(rawKey),
    },
  });
});

// PUT /api/admin/cms (Admin only)
router.put('/admin/cms', requireAdmin, (req: Request, res: Response) => {
  try {
    const newConfig = req.body;
    if (!newConfig || typeof newConfig !== 'object') {
      return res.status(400).json({ success: false, message: 'Format data konfigurasi tidak valid.' });
    }

    const currentConfig = getCmsConfig();

    // Sanitize login images
    const rawLoginImgs = (Array.isArray(newConfig.authPages?.login?.images) ? newConfig.authPages.login.images : currentConfig.authPages?.login?.images || [])
      .filter((x: any) => typeof x === 'string' && x.trim().length > 0);
    const loginImgs = rawLoginImgs.length > 0 ? rawLoginImgs : ['/images/auth/login-showcase.jpg'];
    const loginImageUrl = newConfig.authPages?.login?.imageUrl?.trim() || loginImgs[0] || '/images/auth/login-showcase.jpg';

    // Sanitize register images
    const rawRegImgs = (Array.isArray(newConfig.authPages?.register?.images) ? newConfig.authPages.register.images : currentConfig.authPages?.register?.images || [])
      .filter((x: any) => typeof x === 'string' && x.trim().length > 0);
    const regImgs = rawRegImgs.length > 0 ? rawRegImgs : ['/images/auth/register-showcase.jpg'];
    const regImageUrl = newConfig.authPages?.register?.imageUrl?.trim() || regImgs[0] || '/images/auth/register-showcase.jpg';

    // Sanitize forgot password images
    const rawForgotImgs = (Array.isArray(newConfig.authPages?.forgotPassword?.images) ? newConfig.authPages.forgotPassword.images : currentConfig.authPages?.forgotPassword?.images || [])
      .filter((x: any) => typeof x === 'string' && x.trim().length > 0);
    const forgotImgs = rawForgotImgs.length > 0 ? rawForgotImgs : ['/images/auth/login-showcase.jpg'];
    const forgotImageUrl = newConfig.authPages?.forgotPassword?.imageUrl?.trim() || forgotImgs[0] || '/images/auth/login-showcase.jpg';

    // Preserve existing geminiApiKey if incoming value is masked with ••••
    const incomingKey = typeof newConfig.geminiApiKey === 'string' ? newConfig.geminiApiKey.trim() : undefined;
    if (incomingKey !== undefined && incomingKey.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Kunci API Gemini wajib diisi dan TIDAK BOLEH KOSONG!',
      });
    }

    const resolvedGeminiKey = (incomingKey && !incomingKey.includes('••••'))
      ? incomingKey
      : currentConfig.geminiApiKey;

    if (!resolvedGeminiKey || !resolvedGeminiKey.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Kunci API Gemini wajib diisi dan TIDAK BOLEH KOSONG!',
      });
    }

    const updated = {
      ...currentConfig,
      theme: { ...currentConfig.theme, ...(newConfig.theme || {}) },
      hero: { ...currentConfig.hero, ...(newConfig.hero || {}) },
      pricing: { ...currentConfig.pricing, ...(newConfig.pricing || {}) },
      addonPricing: { ...currentConfig.addonPricing, ...(newConfig.addonPricing || {}) },
      authPages: {
        login: {
          imageUrl: loginImageUrl,
          images: loginImgs,
          badge: newConfig.authPages?.login?.badge !== undefined ? String(newConfig.authPages.login.badge).trim() : (currentConfig.authPages?.login?.badge || 'Platform Ujian Online Terpadu'),
          headline: newConfig.authPages?.login?.headline !== undefined ? String(newConfig.authPages.login.headline).trim() : (currentConfig.authPages?.login?.headline || 'Platform Pembuat Ujian & Soal Otomatis No. 1'),
          subtitle: newConfig.authPages?.login?.subtitle !== undefined ? String(newConfig.authPages.login.subtitle).trim() : (currentConfig.authPages?.login?.subtitle || 'Masuk ke akun Examigo Anda...'),
          formPosition: newConfig.authPages?.login?.formPosition === 'left' ? 'left' : 'right'
        },
        register: {
          imageUrl: regImageUrl,
          images: regImgs,
          badge: newConfig.authPages?.register?.badge !== undefined ? String(newConfig.authPages.register.badge).trim() : (currentConfig.authPages?.register?.badge || 'Bergabung Bersama 10.000+ Guru & Lembaga'),
          headline: newConfig.authPages?.register?.headline !== undefined ? String(newConfig.authPages.register.headline).trim() : (currentConfig.authPages?.register?.headline || 'Mulai Transformasi Ujian Digital Cerdas'),
          subtitle: newConfig.authPages?.register?.subtitle !== undefined ? String(newConfig.authPages.register.subtitle).trim() : (currentConfig.authPages?.register?.subtitle || 'Daftar gratis sekarang...'),
          formPosition: newConfig.authPages?.register?.formPosition === 'right' ? 'right' : 'left'
        },
        forgotPassword: {
          imageUrl: forgotImageUrl,
          images: forgotImgs,
          badge: newConfig.authPages?.forgotPassword?.badge !== undefined ? String(newConfig.authPages.forgotPassword.badge).trim() : (currentConfig.authPages?.forgotPassword?.badge || 'Keamanan Akun Terjamin'),
          headline: newConfig.authPages?.forgotPassword?.headline !== undefined ? String(newConfig.authPages.forgotPassword.headline).trim() : (currentConfig.authPages?.forgotPassword?.headline || 'Pemulihan Akses Akun Examigo'),
          subtitle: newConfig.authPages?.forgotPassword?.subtitle !== undefined ? String(newConfig.authPages.forgotPassword.subtitle).trim() : (currentConfig.authPages?.forgotPassword?.subtitle || 'Jangan khawatir...'),
          formPosition: newConfig.authPages?.forgotPassword?.formPosition === 'left' ? 'left' : 'right'
        }
      },
      faqs: newConfig.faqs || currentConfig.faqs,
      geminiApiKey: resolvedGeminiKey,
      maintenance: {
        ...(currentConfig.maintenance || {}),
        ...(newConfig.maintenance || {}),
        enabled: typeof newConfig.maintenance?.enabled === 'boolean' 
          ? newConfig.maintenance.enabled 
          : (currentConfig.maintenance?.enabled ?? false),
        title: newConfig.maintenance?.title?.trim() || currentConfig.maintenance?.title || 'Sistem Sedang Dalam Pemeliharaan',
        message: newConfig.maintenance?.message?.trim() || currentConfig.maintenance?.message || 'Kami sedang melakukan pemeliharaan sistem rutin dan peningkatan performa server Examigo. Layanan akan segera kembali normal.',
        estimatedEndTime: newConfig.maintenance?.estimatedEndTime !== undefined 
          ? String(newConfig.maintenance.estimatedEndTime).trim() 
          : (currentConfig.maintenance?.estimatedEndTime || ''),
        allowAdminLogin: newConfig.maintenance?.allowAdminLogin !== undefined 
          ? Boolean(newConfig.maintenance.allowAdminLogin) 
          : (currentConfig.maintenance?.allowAdminLogin ?? true),
        features: {
          payments: Boolean(newConfig.maintenance?.features?.payments ?? currentConfig.maintenance?.features?.payments ?? false),
          aiGeneration: Boolean(newConfig.maintenance?.features?.aiGeneration ?? currentConfig.maintenance?.features?.aiGeneration ?? false),
          examCreation: Boolean(newConfig.maintenance?.features?.examCreation ?? currentConfig.maintenance?.features?.examCreation ?? false),
          studentExams: Boolean(newConfig.maintenance?.features?.studentExams ?? currentConfig.maintenance?.features?.studentExams ?? false),
        }
      }
    };

    saveCmsConfig(updated);

    // Return masked data to response
    const maskedUpdated = {
      ...updated,
      geminiApiKey: updated.geminiApiKey ? `${updated.geminiApiKey.slice(0, 4)}••••••••••••${updated.geminiApiKey.slice(-4)}` : '',
      hasGeminiApiKey: Boolean(updated.geminiApiKey),
    };

    res.json({ success: true, message: 'Konfigurasi Landing Page CMS, API Key & Mode Pemeliharaan berhasil disimpan!', data: maskedUpdated });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message || 'Gagal menyimpan konfigurasi CMS.' });
  }
});

// POST /api/admin/cms/maintenance (Quick toggle / update Maintenance Mode)
router.post('/admin/cms/maintenance', requireAdmin, (req: Request, res: Response) => {
  try {
    const { enabled, title, message, estimatedEndTime, allowAdminLogin, features } = req.body;
    const currentConfig = getCmsConfig();
    const currentMaint = currentConfig.maintenance || {
      enabled: false,
      title: 'Sistem Sedang Dalam Pemeliharaan',
      message: 'Kami sedang melakukan pemeliharaan sistem rutin dan peningkatan performa server Examigo. Layanan akan segera kembali normal.',
      estimatedEndTime: '',
      allowAdminLogin: true,
      features: {
        payments: false,
        aiGeneration: false,
        examCreation: false,
        studentExams: false,
      }
    };

    const newEnabled = typeof enabled === 'boolean' ? enabled : currentMaint.enabled;
    const currentFeatures = currentMaint.features || {
      payments: false,
      aiGeneration: false,
      examCreation: false,
      studentExams: false,
    };

    const newFeatures = features && typeof features === 'object' ? {
      payments: features.payments !== undefined ? Boolean(features.payments) : currentFeatures.payments,
      aiGeneration: features.aiGeneration !== undefined ? Boolean(features.aiGeneration) : currentFeatures.aiGeneration,
      examCreation: features.examCreation !== undefined ? Boolean(features.examCreation) : currentFeatures.examCreation,
      studentExams: features.studentExams !== undefined ? Boolean(features.studentExams) : currentFeatures.studentExams,
    } : currentFeatures;

    const updated = {
      ...currentConfig,
      maintenance: {
        ...currentMaint,
        enabled: newEnabled,
        title: title !== undefined ? String(title).trim() : currentMaint.title,
        message: message !== undefined ? String(message).trim() : currentMaint.message,
        estimatedEndTime: estimatedEndTime !== undefined ? String(estimatedEndTime).trim() : currentMaint.estimatedEndTime,
        allowAdminLogin: allowAdminLogin !== undefined ? Boolean(allowAdminLogin) : currentMaint.allowAdminLogin,
        features: newFeatures,
      }
    };

    saveCmsConfig(updated);
    res.json({
      success: true,
      message: `Konfigurasi mode pemeliharaan berhasil diperbarui!`,
      data: updated.maintenance,
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message || 'Gagal mengubah status mode pemeliharaan.' });
  }
});

// GET /api/public/maintenance-status (Public endpoint to query maintenance state)
router.get('/public/maintenance-status', (_req: Request, res: Response) => {
  const config = getCmsConfig();
  res.json({
    success: true,
    data: config.maintenance || {
      enabled: false,
      title: 'Sistem Sedang Dalam Pemeliharaan',
      message: 'Kami sedang melakukan pemeliharaan sistem rutin dan peningkatan performa server Examigo. Layanan akan segera kembali normal.',
      estimatedEndTime: '',
      allowAdminLogin: true,
    }
  });
});

// POST /api/admin/cms/test-ai-key (Admin only)
router.post('/admin/cms/test-ai-key', requireAdmin, async (req: Request, res: Response) => {
  try {
    const { apiKey } = req.body;
    const testKey = (apiKey || '').trim();
    if (!testKey) {
      return res.status(400).json({ success: false, message: 'Kunci API Gemini tidak boleh kosong.' });
    }

    const { GoogleGenAI } = await import('@google/genai');
    const ai = new GoogleGenAI({ apiKey: testKey });

    const candidateModels = ['gemini-flash-latest', 'gemini-2.0-flash', 'gemini-1.5-flash-8b', 'gemini-pro'];
    let workingModel = '';
    let responseText = '';
    let lastErr: any = null;

    for (const modelName of candidateModels) {
      try {
        const result = await ai.models.generateContent({
          model: modelName,
          contents: ['Katakan "OK" dalam 1 kata.'],
        });
        if (result.text) {
          workingModel = modelName;
          responseText = result.text.trim();
          break;
        }
      } catch (err: any) {
        lastErr = err;
      }
    }

    if (workingModel) {
      return res.json({
        success: true,
        message: `Koneksi Google Gemini API Berhasil! Model aktif: ${workingModel}`,
        model: workingModel,
        sampleResponse: responseText,
      });
    } else {
      return res.status(400).json({
        success: false,
        message: `Kunci API tidak valid atau kuota habis: ${lastErr?.message || 'Gagal memanggil Gemini API'}`,
      });
    }
  } catch (err: any) {
    return res.status(500).json({
      success: false,
      message: `Terjadi kesalahan saat memeriksa API Key: ${err.message}`,
    });
  }
});

export default router;
