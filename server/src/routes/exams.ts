import { Router, Request, Response } from 'express';
import { authenticateToken } from '../middleware/auth';
import prisma from '../lib/prisma';
import { z } from 'zod';
import { ParticipantStatus } from '@prisma/client';
import { sendResultEmail } from '../services/emailService';
import { evaluateTextAnswerWithAI } from '../services/aiService';

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
  questionIds: z.array(z.string()).min(1, 'Pilih minimal 1 soal'),
  subjectId: z.string().optional(),
  grade: z.string().optional(),
  password: z.string().optional(),
  startTime: z.string().optional(),
  endTime: z.string().optional(),
});

const joinSchema = z.object({
  studentName: z.string().min(2, 'Nama minimal 2 karakter'),
  studentEmail: z.string().email('Email tidak valid'),
  password: z.string().optional(),
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
router.get('/code/:code', async (req: Request, res: Response) => {
  try {
    const code = req.params.code.toUpperCase();
    const exam = await prisma.exam.findUnique({
      where: { code },
      include: {
        subject: true,
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
      const choices = q.choices.map((c) => ({
        id: c.id,
        text: c.text,
        isCorrect: c.isCorrect,
      }));
      return {
        id: q.id,
        text: q.text,
        type: q.type,
        difficulty: q.difficulty,
        topic: q.topic,
        points: eq.points,
        choices: exam.randomizeChoices ? shuffleArray(choices) : choices,
        explanation: q.explanation,
        material: q.material ? {
          id: q.material.id,
          title: q.material.title,
          extractedText: q.material.extractedText,
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
        grade: exam.grade,
        subject: exam.subject,
        questions,
      },
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST /api/exams/:code/join (Public - student joins exam)
router.post('/code/:code/join', async (req: Request, res: Response) => {
  try {
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

    // Check if participant already joined and is in progress
    let participant = await prisma.participant.findFirst({
      where: {
        examId: exam.id,
        studentEmail: data.studentEmail,
        status: ParticipantStatus.IN_PROGRESS,
      },
      include: {
        answers: true,
      },
    });

    if (!participant) {
      // Create participant entry
      participant = await prisma.participant.create({
        data: {
          examId: exam.id,
          studentName: data.studentName,
          studentEmail: data.studentEmail,
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
        studentEmail: participant.studentEmail,
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

    res.json({ success: true, data: savedAnswer });
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

    // Send email notification asynchronously
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
    const data = examSchema.parse(req.body);

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
        teacherId: req.user!.id,
        subjectId: data.subjectId || null,
        grade: data.grade || null,
        startTime: data.startTime ? new Date(data.startTime) : null,
        endTime: data.endTime ? new Date(data.endTime) : null,
        isPublished: true,
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
        studentEmail: p.studentEmail,
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
