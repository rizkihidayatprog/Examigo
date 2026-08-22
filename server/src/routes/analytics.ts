import { Router, Request, Response } from 'express';
import { authenticateToken } from '../middleware/auth';
import prisma from '../lib/prisma';

const router = Router();

// GET /api/analytics
router.get('/', authenticateToken, async (req: Request, res: Response) => {
  try {
    const teacherId = req.user!.id;
    const subjectId = req.query.subjectId ? String(req.query.subjectId) : undefined;
    const grade = req.query.grade ? String(req.query.grade) : undefined;

    const examWhere: any = { teacherId };
    if (subjectId) examWhere.subjectId = subjectId;
    if (grade) examWhere.grade = grade;

    const questionWhere: any = { teacherId };
    if (subjectId) questionWhere.subjectId = subjectId;
    if (grade) questionWhere.grade = grade;

    // Run parallel aggregation queries
    const [examsCount, questionsCount, participants, results] = await Promise.all([
      prisma.exam.count({ where: examWhere }),
      prisma.question.count({ where: questionWhere }),
      prisma.participant.findMany({
        where: {
          exam: examWhere,
        },
        include: {
          exam: {
            include: { subject: true },
          },
          result: true,
        },
        orderBy: {
          startedAt: 'desc',
        },
        take: 100,
      }),
      prisma.result.aggregate({
        where: {
          exam: examWhere,
        },
        _avg: {
          percentage: true,
        },
        _count: {
          id: true,
        },
      }),
    ]);

    // Calculate passing rate
    const passedCount = await prisma.result.count({
      where: {
        exam: examWhere,
        isPassed: true,
      },
    });

    const totalParticipants = results._count.id;
    const averageScore = results._avg.percentage ? Math.round(results._avg.percentage * 10) / 10 : 0;
    const passingRatePercentage = totalParticipants > 0 ? Math.round((passedCount / totalParticipants) * 100) : 0;

    // Difficulty distribution
    const easyCount = await prisma.question.count({ where: { ...questionWhere, difficulty: 'EASY' } });
    const mediumCount = await prisma.question.count({ where: { ...questionWhere, difficulty: 'MEDIUM' } });
    const hardCount = await prisma.question.count({ where: { ...questionWhere, difficulty: 'HARD' } });

    // Recent results map
    const recentResults = participants
      .filter((p) => p.result !== null)
      .map((p) => ({
        id: p.id,
        studentName: p.studentName,
        studentEmail: p.studentEmail,
        examTitle: p.exam.title,
        subjectName: p.exam.subject ? p.exam.subject.name : 'Umum',
        grade: p.exam.grade || 'Umum',
        score: p.result!.percentage,
        status: p.result!.isPassed ? 'LULUS' : 'TIDAK LULUS',
        submittedAt: p.submittedAt ? new Date(p.submittedAt).toLocaleDateString('id-ID') : '-',
      }));

    // Item Analysis Calculation
    const answersGrouped = await prisma.answer.groupBy({
      by: ['questionId', 'isCorrect'],
      where: {
        participant: {
          exam: examWhere,
          status: 'COMPLETED'
        }
      },
      _count: { id: true }
    });

    const questionIds = Array.from(new Set(answersGrouped.map((a) => a.questionId)));
    const analysisQuestions = await prisma.question.findMany({
      where: { id: { in: questionIds } },
      select: { id: true, text: true, type: true }
    });

    const itemAnalysis = analysisQuestions.map(q => {
      const correctCount = answersGrouped.find(a => a.questionId === q.id && a.isCorrect)?._count.id || 0;
      const incorrectCount = answersGrouped.find(a => a.questionId === q.id && !a.isCorrect)?._count.id || 0;
      const totalAnswers = correctCount + incorrectCount;
      const accuracy = totalAnswers > 0 ? Math.round((correctCount / totalAnswers) * 100) : 0;
      
      return {
        questionId: q.id,
        questionText: q.text,
        type: q.type,
        correctCount,
        incorrectCount,
        totalAnswers,
        accuracy
      };
    }).sort((a, b) => a.accuracy - b.accuracy); // Sort from hardest to easiest

    res.json({
      success: true,
      data: {
        totalExams: examsCount,
        totalQuestions: questionsCount,
        totalParticipants,
        averageScore,
        passingRatePercentage,
        difficultyDistribution: [
          { name: 'Mudah (Easy)', count: easyCount },
          { name: 'Sedang (Medium)', count: mediumCount },
          { name: 'Sulit (Hard)', count: hardCount },
        ],
        recentResults,
        itemAnalysis,
      },
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/analytics/participant/:id (Private - get detailed participant answer review)
router.get('/participant/:id', authenticateToken, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const participant = await prisma.participant.findFirst({
      where: {
        id,
        exam: { teacherId: req.user!.id },
      },
      include: {
        exam: {
          include: {
            subject: true,
            examQuestions: {
              include: {
                question: {
                  include: { choices: true },
                },
              },
              orderBy: { order: 'asc' },
            },
          },
        },
        answers: true,
        result: true,
      },
    });

    if (!participant) {
      return res.status(404).json({ success: false, message: 'Data peserta tidak ditemukan' });
    }

    const questionDetails = participant.exam.examQuestions.map((eq) => {
      const q = eq.question;
      const ans = participant.answers.find((a) => a.questionId === q.id);
      const selectedChoice = ans?.selectedChoiceId
        ? q.choices.find((c) => c.id === ans.selectedChoiceId)
        : null;

      return {
        questionId: q.id,
        questionText: q.text,
        type: q.type,
        difficulty: q.difficulty,
        imageUrl: q.imageUrl,
        explanation: q.explanation,
        pointsPossible: eq.points,
        choices: q.choices.map((c) => ({
          id: c.id,
          text: c.text,
          isCorrect: c.isCorrect,
        })),
        studentAnswer: {
          selectedChoiceId: ans?.selectedChoiceId || null,
          selectedChoiceText: selectedChoice ? selectedChoice.text : null,
          textAnswer: ans?.textAnswer || null,
          isCorrect: ans?.isCorrect ?? null,
          score: ans?.score ?? 0,
        },
      };
    });

    res.json({
      success: true,
      data: {
        id: participant.id,
        studentName: participant.studentName,
        studentEmail: participant.studentEmail,
        examTitle: participant.exam.title,
        examCode: participant.exam.code,
        subjectName: participant.exam.subject ? participant.exam.subject.name : 'Umum',
        grade: participant.exam.grade || 'Umum',
        status: participant.status,
        cheatingCount: participant.cheatingCount,
        startedAt: participant.startedAt,
        submittedAt: participant.submittedAt,
        result: participant.result ? {
          totalScore: participant.result.totalScore,
          maxScore: participant.result.maxScore,
          percentage: participant.result.percentage,
          isPassed: participant.result.isPassed,
        } : null,
        questions: questionDetails,
      },
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/analytics/live/:examId (Private - Real-time monitoring)
router.get('/live/:examId', authenticateToken, async (req: Request, res: Response) => {
  try {
    const { examId } = req.params;

    // Verify teacher owns the exam
    const exam = await prisma.exam.findFirst({
      where: { id: examId, teacherId: req.user!.id },
      select: { id: true, title: true, durationMinutes: true, examQuestions: { select: { id: true } } }
    });

    if (!exam) {
      return res.status(404).json({ success: false, message: 'Ujian tidak ditemukan' });
    }

    const totalQuestions = exam.examQuestions.length;

    const participants = await prisma.participant.findMany({
      where: { examId },
      include: {
        answers: { select: { id: true } },
        result: { select: { percentage: true } }
      },
      orderBy: { startedAt: 'desc' }
    });

    const liveData = participants.map(p => ({
      id: p.id,
      studentName: p.studentName,
      studentEmail: p.studentEmail,
      status: p.status,
      startedAt: p.startedAt,
      submittedAt: p.submittedAt,
      cheatingCount: p.cheatingCount,
      answersCount: p.answers.length,
      totalQuestions,
      progress: totalQuestions > 0 ? Math.round((p.answers.length / totalQuestions) * 100) : 0,
      score: p.result?.percentage || null
    }));

    res.json({
      success: true,
      data: liveData
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});

export default router;
