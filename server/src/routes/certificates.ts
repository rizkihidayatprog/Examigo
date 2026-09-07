import { Router, Request, Response } from 'express';
import { authenticateToken } from '../middleware/auth';
import prisma from '../lib/prisma';
import { z } from 'zod';

const router = Router();

export interface CertificateSettings {
  institutionName: string;
  certificateTitle: string;
  subtitle: string;
  completionText: string;
  logoUrl?: string | null;
  theme: string;
  borderStyle: string;
  fontFamily: string;
  watermarkStyle: 'none' | 'center_logo' | 'security_seal' | 'guilloche_frame';
  signer1: {
    name: string;
    title: string;
    signatureUrl?: string | null;
    scale?: number;
    yOffset?: number;
    xOffset?: number;
    colorMode?: 'match_text' | 'theme_accent' | 'original';
  };
  signer2: {
    name: string;
    title: string;
    signatureUrl?: string | null;
    scale?: number;
    yOffset?: number;
    xOffset?: number;
    colorMode?: 'match_text' | 'theme_accent' | 'original';
  };
  showScore: boolean;
  showPassingScore: boolean;
  showDate: boolean;
  showCertificateId: boolean;
  showQrCode: boolean;
  enableCertificate: boolean;
  customNotes?: string | null;
}

export const defaultCertificateSettings: CertificateSettings = {
  institutionName: 'Examigo Academy',
  certificateTitle: 'SERTIFIKAT KELULUSAN',
  subtitle: 'Dengan ini menerangkan bahwa peserta ujian:',
  completionText: 'Telah menyelesaikan rangkaian evaluasi dan dinyatakan LULUS dalam ujian:',
  logoUrl: null,
  theme: 'emerald_gold',
  borderStyle: 'double_gold',
  fontFamily: 'times',
  watermarkStyle: 'none',
  signer1: {
    name: 'Direktur Pendidikan',
    title: 'Kepala Lembaga / Sekolah',
    signatureUrl: null,
    scale: 1.0,
    yOffset: 0,
    xOffset: 0,
    colorMode: 'match_text',
  },
  signer2: {
    name: 'Ketua Tim Evaluasi',
    title: 'Koordinator Ujian',
    signatureUrl: null,
    scale: 1.0,
    yOffset: 0,
    xOffset: 0,
    colorMode: 'match_text',
  },
  showScore: true,
  showPassingScore: true,
  showDate: true,
  showCertificateId: true,
  showQrCode: true,
  enableCertificate: true,
  customNotes: 'Sertifikat ini sah dan diterbitkan secara digital oleh sistem Examigo.',
};

const certificateSettingsSchema = z.object({
  institutionName: z.string().min(1, 'Nama institusi wajib diisi'),
  certificateTitle: z.string().min(1, 'Judul sertifikat wajib diisi'),
  subtitle: z.string().min(1, 'Sub-judul wajib diisi'),
  completionText: z.string().min(1, 'Teks kelulusan wajib diisi'),
  logoUrl: z.string().nullable().optional(),
  theme: z.string().default('emerald_gold'),
  borderStyle: z.string().default('double_gold'),
  fontFamily: z.string().default('times'),
  watermarkStyle: z.enum(['none', 'center_logo', 'security_seal', 'guilloche_frame']).default('none'),
  signer1: z.object({
    name: z.string().min(1, 'Nama penandatangan 1 wajib diisi'),
    title: z.string().min(1, 'Jabatan penandatangan 1 wajib diisi'),
    signatureUrl: z.string().nullable().optional(),
    scale: z.number().min(0.2).max(3.0).default(1.0).optional(),
    yOffset: z.number().min(-50).max(50).default(0).optional(),
    xOffset: z.number().min(-50).max(50).default(0).optional(),
    colorMode: z.enum(['match_text', 'theme_accent', 'original']).default('match_text').optional(),
  }),
  signer2: z.object({
    name: z.string().min(1, 'Nama penandatangan 2 wajib diisi'),
    title: z.string().min(1, 'Jabatan penandatangan 2 wajib diisi'),
    signatureUrl: z.string().nullable().optional(),
    scale: z.number().min(0.2).max(3.0).default(1.0).optional(),
    yOffset: z.number().min(-50).max(50).default(0).optional(),
    xOffset: z.number().min(-50).max(50).default(0).optional(),
    colorMode: z.enum(['match_text', 'theme_accent', 'original']).default('match_text').optional(),
  }),
  showScore: z.boolean().default(true),
  showPassingScore: z.boolean().default(true),
  showDate: z.boolean().default(true),
  showCertificateId: z.boolean().default(true),
  showQrCode: z.boolean().default(true),
  enableCertificate: z.boolean().default(true),
  customNotes: z.string().nullable().optional(),
});

// GET /api/certificates/settings (Get user's certificate settings)
router.get('/settings', authenticateToken, async (req: Request, res: Response) => {
  try {
    const userId = req.user!.id;
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { certificateSettings: true, name: true, position: true, plan: true, planValidUntil: true },
    });

    if (!user) {
      return res.status(404).json({ success: false, message: 'User tidak ditemukan' });
    }

    const isPaid = user.plan && user.plan !== 'FREE' && (!user.planValidUntil || new Date(user.planValidUntil) > new Date());

    let settings: CertificateSettings = defaultCertificateSettings;
    if (isPaid && user.certificateSettings) {
      try {
        const parsed = JSON.parse(user.certificateSettings);
        settings = { ...defaultCertificateSettings, ...parsed };
      } catch (e) {
        console.error('Error parsing certificateSettings:', e);
      }
    } else {
      if (user.name) {
        settings.signer2.name = user.name;
        settings.signer2.title = user.position || 'Koordinator Ujian';
      }
    }

    res.json({ 
      success: true, 
      data: settings,
      isPaid: !!isPaid,
      message: isPaid 
        ? 'Pengaturan sertifikat berhasil dimuat.' 
        : 'Akun paket Free menggunakan template sertifikat resmi default dari Examigo.',
    });
  } catch (err: any) {
    console.error('Error getting certificate settings:', err);
    res.status(500).json({ success: false, message: err.message });
  }
});

// PUT /api/certificates/settings (Update user's certificate settings)
router.put('/settings', authenticateToken, async (req: Request, res: Response) => {
  try {
    const userId = req.user!.id;

    // Check plan: only paid users can customize certificate
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, plan: true, planValidUntil: true },
    });

    const isPaid = user?.plan && user.plan !== 'FREE' && (!user.planValidUntil || new Date(user.planValidUntil) > new Date());
    if (!isPaid) {
      return res.status(403).json({
        success: false,
        message: 'Fitur kustomisasi desain sertifikat hanya tersedia pada paket berbayar (Personal / Pro). Pengguna paket Free menggunakan template sertifikat resmi default dari Examigo.',
      });
    }

    const validatedData = certificateSettingsSchema.parse(req.body);

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        certificateSettings: JSON.stringify(validatedData),
      },
      select: { id: true, certificateSettings: true },
    });

    const parsed = JSON.parse(updatedUser.certificateSettings || '{}');
    res.json({
      success: true,
      message: 'Desain sertifikat berhasil disimpan!',
      data: parsed,
    });
  } catch (err: any) {
    if (err instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        message: err.errors.map((e) => e.message).join(', '),
      });
    }
    console.error('Error updating certificate settings:', err);
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/certificates/verify/:code (Public - verify certificate authenticity)
router.get('/verify/:code', async (req: Request, res: Response) => {
  try {
    const rawCode = (req.params.code || '').trim();

    if (!rawCode) {
      return res.status(400).json({
        success: false,
        message: 'Kode verifikasi sertifikat wajib diisi.',
      });
    }

    // 1. Check if demo / test code
    if (rawCode.toUpperCase().startsWith('EXM-DEMO')) {
      return res.json({
        success: true,
        data: {
          isAuthentic: true,
          isDemo: true,
          certificateId: rawCode.toUpperCase(),
          studentName: 'Ahmad Fadhilah, S.T.',
          examTitle: 'Evaluasi Akhir Semester - Simulasi',
          examCode: 'EXM-DEMO-01',
          institutionName: 'Examigo Academy',
          score: 95,
          minPassingScore: 75,
          isPassed: true,
          completionDate: new Date().toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' }),
          certificateTitle: 'SERTIFIKAT KELULUSAN',
          signer1: { name: 'Direktur Pendidikan', title: 'Kepala Lembaga / Sekolah' },
          signer2: { name: 'Ketua Tim Evaluasi', title: 'Koordinator Ujian' },
          digitalSignature: `SHA256-AUTHENTIC-VERIFIED-${rawCode.toUpperCase()}`,
        },
      });
    }

    // 2. Query Result & Participant from Database
    let result = await prisma.result.findFirst({
      where: {
        OR: [
          { id: rawCode },
          { participantId: rawCode },
          { participant: { id: { startsWith: rawCode.replace(/^EXM-[A-Z0-9]+-/, '') } } },
        ],
      },
      include: {
        participant: true,
        exam: {
          include: {
            teacher: {
              select: { name: true, certificateSettings: true },
            },
          },
        },
      },
    });

    // If not found, try to extract exam code and participant prefix (format: EXM-{EXAMCODE}-{PARTPREFIX})
    if (!result && rawCode.includes('-')) {
      const parts = rawCode.split('-');
      if (parts.length >= 3) {
        const potentialExamCode = parts[1];
        const potentialPartPrefix = parts[2];
        result = await prisma.result.findFirst({
          where: {
            exam: { code: potentialExamCode },
            participantId: { startsWith: potentialPartPrefix },
          },
          include: {
            participant: true,
            exam: {
              include: {
                teacher: {
                  select: { name: true, certificateSettings: true },
                },
              },
            },
          },
        });
      }
    }

    if (!result) {
      return res.status(404).json({
        success: false,
        message: 'Sertifikat tidak ditemukan dalam pangkalan data resmi Examigo.',
      });
    }

    // Parse teacher or exam certificate settings
    let teacherCert: any = {};
    try {
      if (result.exam.certificateSettings) {
        teacherCert = JSON.parse(result.exam.certificateSettings);
      } else if (result.exam.teacher?.certificateSettings) {
        teacherCert = JSON.parse(result.exam.teacher.certificateSettings);
      }
    } catch (e) {
      console.error('Failed to parse teacher certificateSettings:', e);
    }

    const isEnabled = result.exam.hasCertificate !== false && teacherCert.enableCertificate !== false;

    if (!isEnabled) {
      return res.status(403).json({
        success: false,
        message: 'Penerbitan sertifikat untuk ujian ini dinonaktifkan oleh penyelenggara ujian.',
      });
    }

    res.json({
      success: true,
      data: {
        isAuthentic: true,
        isDemo: false,
        certificateId: `EXM-${result.exam.code}-${result.participantId.substring(0, 6).toUpperCase()}`,
        studentName: result.participant.studentName,
        studentEmail: (result.participant.studentEmail && !result.participant.studentEmail.includes('@student.examigo.id')) ? result.participant.studentEmail : null,
        examTitle: result.exam.title,
        examCode: result.exam.code,
        institutionName: teacherCert.institutionName || 'Lembaga Pendidikan Terdaftar',
        score: result.percentage,
        minPassingScore: result.exam.minPassingScore,
        isPassed: result.isPassed,
        completionDate: result.gradedAt ? new Date(result.gradedAt).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' }) : '-',
        certificateTitle: teacherCert.certificateTitle || 'SERTIFIKAT KELULUSAN',
        signer1: teacherCert.signer1 || { name: result.exam.teacher?.name || 'Kepala Penyelenggara', title: 'Pimpinan Lembaga' },
        signer2: teacherCert.signer2 || { name: 'Sistem Ujian Terpadu', title: 'Koordinator Evaluasi' },
        digitalSignature: `EXM-VERIFIED-AUTH-${result.id.substring(0, 16).toUpperCase()}`,
      },
    });
  } catch (err: any) {
    console.error('Error verifying certificate:', err);
    res.status(500).json({ success: false, message: err.message });
  }
});

export default router;
