import { Router, Request, Response } from 'express';
import { authenticateToken } from '../middleware/auth';
import { examJoinLimiter } from '../middleware/rateLimiter';
import prisma from '../lib/prisma';
import { z } from 'zod';
import { ParticipantStatus } from '@prisma/client';
import { sendResultEmail } from '../services/emailService';
import { evaluateTextAnswerWithAI } from '../services/aiService';
import { defaultCertificateSettings } from './certificates';
import { getCmsConfig } from './cms';

function shuffleArray<T>(array: T[]): T[] {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

const router = Router();

const examSchema = z.object({
  title: z.string().min(1, 'Judul ujian wajib diisi'),
  description: z.string().optional(),
  durationMinutes: z.number().min(1).default(60),
  minPassingScore: z.number().min(0).max(100).default(70),
  randomizeQuestions: z.boolean().default(true),
  randomizeChoices: z.boolean().default(true),
  hasCertificate: z.boolean().default(true),
  questionIds: z.array(z.string()).min(1, 'Pilih minimal 1 soal'),
  subjectId: z.string().optional(),
  grade: z.string().optional(),
  password: z.string().optional(),
  startTime: z.string().optional(),
  endTime: z.string().optional(),
  participantFields: z.any().optional(),
});

const joinSchema = z.object({
  studentName: z.string().min(1, 'Nama lengkap wajib diisi'),
  studentEmail: z.string().optional().or(z.literal('')),
  password: z.string().optional(),
  customFields: z.record(z.any()).optional(),
});

const answerSchema = z.object({
  participantId: z.string(),
  questionId: z.string(),
  selectedChoiceId: z.string().optional(),
  textAnswer: z.string().optional(),
});

// GET /api/exams
router.get('/', authenticateToken, async (req: Request, res: Response) => {
  try {
    const exams = await prisma.exam.findMany({
      where: { teacherId: req.user!.id },
      include: {
        subject: true,
        examQuestions: {
          include: { question: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    const formatted = exams.map((e) => ({
      id: e.id,
      title: e.title,
      description: e.description,
      code: e.code,
      durationMinutes: e.durationMinutes,
      minPassingScore: e.minPassingScore,
      isPublished: e.isPublished,
      randomizeQuestions: e.randomizeQuestions,
      randomizeChoices: e.randomizeChoices,
      questionsCount: e.examQuestions.length,
      grade: e.grade,
      subject: e.subject,
      createdAt: e.createdAt,
    }));

    res.json({ success: true, count: formatted.length, data: formatted });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/exams/code/:code (Public - used by Exam Room for students)
router.get('/code/:code', examJoinLimiter, async (req: Request, res: Response) => {
  try {
    const code = req.params.code.toUpperCase();
    const exam = await prisma.exam.findUnique({
      where: { code },
      include: {
        subject: true,
        teacher: {
          select: {
            id: true,
            name: true,
            plan: true,
            planValidUntil: true,
            certificateSettings: true,
          },
        },
        examQuestions: {
          include: {
            question: {
              include: { choices: true, material: true },
            },
          },
        },
      },
    });

    if (!exam) {
      return res.status(404).json({ success: false, message: 'Kode Ujian tidak ditemukan' });
    }

    const now = new Date();
    if (exam.startTime && now < exam.startTime) {
      return res.status(403).json({ success: false, message: `Ujian ini baru dapat diakses pada ${exam.startTime.toLocaleString('id-ID')}` });
    }
    if (exam.endTime && now > exam.endTime) {
      return res.status(403).json({ success: false, message: 'Ujian ini sudah berakhir dan tidak dapat diakses lagi' });
    }

    let questions = exam.examQuestions.map((eq) => {
      const q = eq.question;
      // Do NOT expose isCorrect to students to prevent inspecting answers in DevTools
      const choices = q.choices.map((c) => ({
        id: c.id,
        text: c.text,
      }));
      return {
        id: q.id,
        text: q.text,
        type: q.type,
        difficulty: q.difficulty,
        topic: q.topic,
        points: eq.points,
        choices: exam.randomizeChoices ? shuffleArray(choices) : choices,
        // Do NOT expose question explanation before completion
        material: q.material ? {
          id: q.material.id,
          title: q.material.title,
          extractedText: q.material.extractedText,
          fileUrl: q.material.fileUrl,
          fileType: q.material.fileType,
        } : null,
      };
    });

    if (exam.randomizeQuestions) {
      questions = shuffleArray(questions);
    }

    res.json({
      success: true,
      data: {
        id: exam.id,
        title: exam.title,
        description: exam.description,
        code: exam.code,
        durationMinutes: exam.durationMinutes,
        minPassingScore: exam.minPassingScore,
        isPublished: exam.isPublished,
        randomizeQuestions: exam.randomizeQuestions,
        randomizeChoices: exam.randomizeChoices,
        hasPassword: !!exam.password,
        hasCertificate: exam.hasCertificate,
        grade: exam.grade,
        subject: exam.subject,
        questions,
        participantFields: (() => {
          try {
            if (exam.participantFields) {
              return typeof exam.participantFields === 'string'
                ? JSON.parse(exam.participantFields)
                : exam.participantFields;
            }
          } catch (e) {
            console.error('Failed to parse participantFields:', e);
          }
          return null;
        })(),
        certificateSettings: (() => {
          try {
            const isTeacherPaid = exam.teacher?.plan && exam.teacher.plan !== 'FREE' && (!exam.teacher.planValidUntil || new Date(exam.teacher.planValidUntil) > new Date());
            if (!isTeacherPaid) {
              // FREE teacher always produces the default official Examigo certificate
              return {
                ...defaultCertificateSettings,
                institutionName: 'Examigo Examination System',
                certificateTitle: 'SERTIFIKAT KELULUSAN',
                subtitle: 'Dengan ini menerangkan bahwa peserta ujian:',
                completionText: 'Telah menyelesaikan rangkaian evaluasi dan dinyatakan LULUS dalam ujian:',
                theme: 'emerald_gold',
                borderStyle: 'double_gold',
                fontFamily: 'times',
                watermarkStyle: 'none',
                signer1: {
                  name: 'Direktur Akademik',
                  title: 'Examigo Certification Board',
                  signatureUrl: null,
                  scale: 1.0,
                  yOffset: 0,
                  xOffset: 0,
                  colorMode: 'match_text',
                },
                signer2: {
                  name: exam.teacher?.name || 'Penguji Ujian',
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
              };
            }
            if (exam.certificateSettings) return JSON.parse(exam.certificateSettings);
            if (exam.teacher?.certificateSettings) return JSON.parse(exam.teacher.certificateSettings);
          } catch (e) {
            console.error('Failed to parse certificateSettings:', e);
          }
          return defaultCertificateSettings;
        })(),
      },
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST /api/exams/:code/join (Public - student joins exam)
router.post('/code/:code/join', examJoinLimiter, async (req: Request, res: Response) => {
  try {
    const cmsConf = getCmsConfig();
    if (cmsConf.maintenance?.features?.studentExams) {
      return res.status(503).json({
        success: false,
        inMaintenance: true,
        scope: 'feature',
        feature: 'studentExams',
        message: 'Pelaksanaan ujian sedang dalam pemeliharaan server sementara. Mohon hubungi pengajar Anda atau coba beberapa saat lagi.',
      });
    }

    const code = req.params.code.toUpperCase();
    const data = joinSchema.parse(req.body);

    const exam = await prisma.exam.findUnique({
      where: { code },
    });

    if (!exam) {
      return res.status(404).json({ success: false, message: 'Ujian tidak ditemukan' });
    }

    const now = new Date();
    if (exam.startTime && now < exam.startTime) {
      return res.status(403).json({ success: false, message: `Ujian ini baru dapat diakses pada ${exam.startTime.toLocaleString('id-ID')}` });
    }
    if (exam.endTime && now > exam.endTime) {
      return res.status(403).json({ success: false, message: 'Ujian ini sudah berakhir dan tidak dapat diakses lagi' });
    }

    // Verify password if exam has one
    if (exam.password && exam.password !== data.password) {
      return res.status(401).json({ success: false, message: 'Password ujian salah' });
    }

    // Fallback email if studentEmail is omitted or optional
    const cleanName = data.studentName.trim();
    const fallbackEmail = `${(cleanName.toLowerCase().replace(/[^a-z0-9]/g, '') || 'siswa')}_${Date.now()}@student.examigo.id`;
    const emailToUse = (data.studentEmail && data.studentEmail.trim()) || fallbackEmail;

    // Check if participant already joined and is in progress
    let participant = await prisma.participant.findFirst({
      where: {
        examId: exam.id,
        ...(data.studentEmail && data.studentEmail.trim()
          ? { studentEmail: data.studentEmail.trim() }
          : { studentName: cleanName }),
        status: ParticipantStatus.IN_PROGRESS,
      },
      include: {
        answers: true,
      },
    });

    if (!participant) {
      // Check teacher's student capacity limit
      const teacher = await prisma.user.findUnique({
        where: { id: exam.teacherId },
        select: { id: true, plan: true, planValidUntil: true, extraParticipantQuota: true },
      });

      const isTeacherPlanExpired = !!(teacher?.planValidUntil && new Date(teacher.planValidUntil) <= new Date());
      let maxParticipants = 25; // FREE
      if (!isTeacherPlanExpired && teacher?.plan === 'PERSONAL') maxParticipants = 100;
      if (!isTeacherPlanExpired && teacher?.plan === 'PRO_AI') maxParticipants = 500;
      if (!isTeacherPlanExpired) maxParticipants += (teacher?.extraParticipantQuota || 0);

      const currentCount = await prisma.participant.count({
        where: { examId: exam.id },
      });

      if (currentCount >= maxParticipants) {
        return res.status(403).json({
          success: false,
          message: `Kapasitas peserta ujian ini telah penuh (${maxParticipants} peserta). Silakan hubungi guru/penyelenggara ujian.`,
        });
      }

      // Create participant entry
      participant = await prisma.participant.create({
        data: {
          examId: exam.id,
          studentName: cleanName,
          studentEmail: emailToUse,
          customFields: data.customFields ? JSON.stringify(data.customFields) : null,
          status: ParticipantStatus.IN_PROGRESS,
        },
        include: {
          answers: true,
        },
      });
    }

    res.status(200).json({
      success: true,
      data: {
        participantId: participant.id,
        studentName: participant.studentName,
        studentEmail: (participant.studentEmail && !participant.studentEmail.includes('@student.examigo.id')) ? participant.studentEmail : null,
        customFields: (() => {
          try {
            return participant.customFields ? JSON.parse(participant.customFields) : null;
          } catch {
            return null;
          }
        })(),
        answers: participant.answers.map((a) => ({
          questionId: a.questionId,
          selectedChoiceId: a.selectedChoiceId,
          textAnswer: a.textAnswer,
        })),
      },
    });
  } catch (err: any) {
    if (err instanceof z.ZodError) {
      return res.status(400).json({ success: false, message: err.errors[0].message });
    }
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST /api/exams/answers/save (Public - auto-saves single answer)
router.post('/answers/save', async (req: Request, res: Response) => {
  try {
    const data = answerSchema.parse(req.body);

    // Verify participant is still in progress
    const participant = await prisma.participant.findUnique({
      where: { id: data.participantId },
    });

    if (!participant || participant.status !== ParticipantStatus.IN_PROGRESS) {
      return res.status(403).json({ success: false, message: 'Ujian sudah selesai atau kadaluarsa' });
    }

    // Check if question exists in exam
    const examQuestion = await prisma.examQuestion.findFirst({
      where: {
        examId: participant.examId,
        questionId: data.questionId,
      },
      include: {
        question: {
          include: { choices: true },
        },
      },
    });

    if (!examQuestion) {
      return res.status(404).json({ success: false, message: 'Soal tidak ditemukan pada ujian ini' });
    }

    // Grade immediately for auto grading later if choice question
    let isCorrect: boolean | null = null;
    let score = 0;

    const q = examQuestion.question;
    if (q.type === 'MULTIPLE_CHOICE' || q.type === 'TRUE_FALSE') {
      if (data.selectedChoiceId) {
        const selected = q.choices.find((c) => c.id === data.selectedChoiceId);
        isCorrect = selected ? selected.isCorrect : false;
        score = isCorrect ? examQuestion.points : 0;
      }
    } else if (q.type === 'SHORT_ANSWER' || q.type === 'ESSAY') {
      if (data.textAnswer && data.textAnswer.trim()) {
        const correctChoice = q.choices.find((c) => c.isCorrect);
        const targetText = correctChoice ? correctChoice.text : (q.explanation || '');
        const evalRes = await evaluateTextAnswerWithAI(
          q.text,
          targetText,
          data.textAnswer,
          examQuestion.points
        );
        isCorrect = evalRes.isCorrect;
        score = evalRes.score;
      }
    }

    // Upsert answer
    const existingAnswer = await prisma.answer.findFirst({
      where: {
        participantId: data.participantId,
        questionId: data.questionId,
      },
    });

    let savedAnswer;
    if (existingAnswer) {
      savedAnswer = await prisma.answer.update({
        where: { id: existingAnswer.id },
        data: {
          selectedChoiceId: data.selectedChoiceId || null,
          textAnswer: data.textAnswer || null,
          isCorrect,
          score,
        },
      });
    } else {
      savedAnswer = await prisma.answer.create({
        data: {
          participantId: data.participantId,
          questionId: data.questionId,
          selectedChoiceId: data.selectedChoiceId || null,
          textAnswer: data.textAnswer || null,
          isCorrect,
          score,
        },
      });
    }

    res.json({
      success: true,
      message: 'Jawaban berhasil disimpan',
      data: {
        participantId: data.participantId,
        questionId: data.questionId,
        savedAt: new Date().toISOString(),
      },
    });
  } catch (err: any) {
    if (err instanceof z.ZodError) {
      return res.status(400).json({ success: false, message: err.errors[0].message });
    }
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST /api/exams/code/:code/submit (Public - submits whole exam & grades)
router.post('/code/:code/submit', async (req: Request, res: Response) => {
  try {
    const { participantId } = req.body;

    if (!participantId) {
      return res.status(400).json({ success: false, message: 'Participant ID is required' });
    }

    const participant = await prisma.participant.findUnique({
      where: { id: participantId },
      include: {
        exam: {
          include: {
            examQuestions: true,
          },
        },
        answers: true,
      },
    });

    if (!participant || participant.status !== ParticipantStatus.IN_PROGRESS) {
      return res.status(400).json({ success: false, message: 'Ujian tidak aktif atau sudah dikumpulkan' });
    }

    // Ensure all essay and short answer responses are auto-graded if score is zero/null
    for (const ans of participant.answers) {
      if ((ans.score === null || ans.score === undefined || ans.score === 0) && ans.textAnswer && ans.textAnswer.trim()) {
        const eq = participant.exam.examQuestions.find((item) => item.questionId === ans.questionId);
        if (eq) {
          const question = await prisma.question.findUnique({
            where: { id: ans.questionId },
            include: { choices: true },
          });
          if (question && (question.type === 'SHORT_ANSWER' || question.type === 'ESSAY')) {
            const correctChoice = question.choices.find((c) => c.isCorrect);
            const targetText = correctChoice ? correctChoice.text : (question.explanation || '');
            const evalRes = await evaluateTextAnswerWithAI(
              question.text,
              targetText,
              ans.textAnswer,
              eq.points
            );
            ans.score = evalRes.score;
            ans.isCorrect = evalRes.isCorrect;
            await prisma.answer.update({
              where: { id: ans.id },
              data: { score: evalRes.score, isCorrect: evalRes.isCorrect },
            });
          }
        }
      }
    }

    // Update status to COMPLETED
    await prisma.participant.update({
      where: { id: participantId },
      data: {
        status: ParticipantStatus.COMPLETED,
        submittedAt: new Date(),
      },
    });

    // Calculate grades from answers
    const totalPointsObtained = participant.answers.reduce((sum, ans) => sum + (ans.score || 0), 0);
    const maxPointsPossible = participant.exam.examQuestions.reduce((sum, eq) => sum + eq.points, 0);

    const percentage = maxPointsPossible > 0 ? Math.round((totalPointsObtained / maxPointsPossible) * 100) : 0;
    const isPassed = percentage >= participant.exam.minPassingScore;

    // Save result
    const result = await prisma.result.create({
      data: {
        participantId,
        examId: participant.examId,
        totalScore: totalPointsObtained,
        maxScore: maxPointsPossible,
        percentage,
        isPassed,
      },
    });

    // Send email notification asynchronously if real email provided
    if (participant.studentEmail && !participant.studentEmail.includes('@student.examigo.id')) {
      sendResultEmail({
        studentName: participant.studentName,
        studentEmail: participant.studentEmail,
        examTitle: participant.exam.title,
        score: totalPointsObtained,
        maxScore: maxPointsPossible,
        percentage,
        isPassed,
        minPassingScore: participant.exam.minPassingScore,
      }).catch((err) => console.error('Failed to send result email:', err));
    }

    res.json({
      success: true,
      data: {
        score: totalPointsObtained,
        maxScore: maxPointsPossible,
        percentage,
        isPassed,
      },
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST /api/exams
router.post('/', authenticateToken, async (req: Request, res: Response) => {
  try {
    const cmsConf = getCmsConfig();
    if (cmsConf.maintenance?.features?.examCreation && req.user?.role !== 'ADMIN') {
      return res.status(503).json({
        success: false,
        inMaintenance: true,
        scope: 'feature',
        feature: 'examCreation',
        message: 'Fitur pembuatan dan publikasi ujian baru sedang dalam pemeliharaan sementara. Mohon coba beberapa saat lagi.',
      });
    }

    const data = examSchema.parse(req.body);

    // Check teacher active exam quota
    const user = await prisma.user.findUnique({
      where: { id: req.user!.id },
      select: { id: true, plan: true, planValidUntil: true, extraActiveExamQuota: true },
    });

    const isUserPlanExpired = !!(user?.planValidUntil && new Date(user.planValidUntil) <= new Date());
    let maxActiveExams = 1; // FREE
    if (!isUserPlanExpired && user?.plan === 'PERSONAL') maxActiveExams = 5;
    if (!isUserPlanExpired && user?.plan === 'PRO_AI') maxActiveExams = 20;
    if (!isUserPlanExpired) maxActiveExams += (user?.extraActiveExamQuota || 0);

    const activeExamCount = await prisma.exam.count({
      where: { teacherId: req.user!.id, isPublished: true },
    });

    if (activeExamCount >= maxActiveExams) {
      return res.status(403).json({
        success: false,
        message: `Batas ujian aktif Anda (${maxActiveExams} ujian) telah tercapai. Silakan nonaktifkan atau hapus ujian lain, atau beli kuota tambahan ujian aktif.`,
      });
    }

    const examCode = `EXAM-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;

    const exam = await prisma.exam.create({
      data: {
        title: data.title,
        description: data.description || null,
        code: examCode,
        durationMinutes: data.durationMinutes,
        minPassingScore: data.minPassingScore,
        password: data.password || null,
        randomizeQuestions: data.randomizeQuestions,
        randomizeChoices: data.randomizeChoices,
        hasCertificate: data.hasCertificate,
        teacherId: req.user!.id,
        subjectId: data.subjectId || null,
        grade: data.grade || null,
        startTime: data.startTime ? new Date(data.startTime) : null,
        endTime: data.endTime ? new Date(data.endTime) : null,
        isPublished: true,
        participantFields: data.participantFields
          ? (typeof data.participantFields === 'string' ? data.participantFields : JSON.stringify(data.participantFields))
          : null,
        examQuestions: {
          create: data.questionIds.map((qId, idx) => ({
            questionId: qId,
            order: idx + 1,
            points: 1,
          })),
        },
      },
      include: {
        examQuestions: true,
      },
    });

    res.status(201).json({ success: true, data: exam });
  } catch (err: any) {
    if (err instanceof z.ZodError) {
      return res.status(400).json({ success: false, message: err.errors[0].message });
    }
    res.status(500).json({ success: false, message: err.message });
  }
});

// DELETE /api/exams/:id
router.delete('/:id', authenticateToken, async (req: Request, res: Response) => {
  try {
    const exam = await prisma.exam.findFirst({
      where: { id: req.params.id, teacherId: req.user!.id },
    });

    if (!exam) {
      return res.status(404).json({ success: false, message: 'Ujian tidak ditemukan' });
    }

    await prisma.exam.delete({ where: { id: req.params.id } });
    res.json({ success: true, message: 'Ujian berhasil dihapus' });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});

export default router;

// POST /api/exams/participant/:id/cheating (Public - increment cheating count)
router.post('/participant/:id/cheating', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const participant = await prisma.participant.update({
      where: { id },
      data: {
        cheatingCount: {
          increment: 1,
        },
      },
    });
    res.json({ success: true, cheatingCount: participant.cheatingCount });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/exams/:id/monitoring (Private - teacher live monitoring)
router.get('/:id/monitoring', authenticateToken, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const exam = await prisma.exam.findFirst({
      where: { id, teacherId: req.user!.id },
    });

    if (!exam) {
      return res.status(404).json({ success: false, message: 'Ujian tidak ditemukan atau Anda tidak berwenang' });
    }

    const participants = await prisma.participant.findMany({
      where: { examId: id },
      include: {
        answers: true,
        result: true,
      },
      orderBy: { startedAt: 'desc' },
    });

    const totalQuestions = await prisma.examQuestion.count({
      where: { examId: id },
    });

    const data = participants.map((p) => {
      const answeredCount = p.answers.length;
      return {
        id: p.id,
        studentName: p.studentName,
        studentEmail: (p.studentEmail && !p.studentEmail.includes('@student.examigo.id')) ? p.studentEmail : null,
        customFields: (() => {
          try {
            return p.customFields ? JSON.parse(p.customFields) : null;
          } catch {
            return null;
          }
        })(),
        status: p.status,
        startedAt: p.startedAt,
        submittedAt: p.submittedAt,
        cheatingCount: p.cheatingCount,
        progress: totalQuestions > 0 ? Math.round((answeredCount / totalQuestions) * 100) : 0,
        score: p.result ? p.result.percentage : null,
        isPassed: p.result ? p.result.isPassed : null,
      };
    });

    res.json({ success: true, data });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});
