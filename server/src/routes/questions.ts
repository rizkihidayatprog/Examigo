import { Router, Request, Response } from 'express';
import { authenticateToken } from '../middleware/auth';
import prisma from '../lib/prisma';
import { z } from 'zod';
import { QuestionType, Difficulty } from '@prisma/client';

const router = Router();

const questionSchema = z.object({
  text: z.string().min(1, 'Isi soal wajib diisi'),
  type: z.nativeEnum(QuestionType),
  difficulty: z.nativeEnum(Difficulty),
  topic: z.string().optional(),
  points: z.number().default(1),
  subjectId: z.string().optional(),
  materialId: z.string().optional(),
  grade: z.string().optional(),
  explanation: z.string().optional(),
  imageUrl: z.string().optional(),
  choices: z.array(
    z.object({
      text: z.string().min(1, 'Teks pilihan tidak boleh kosong'),
      isCorrect: z.boolean(),
    })
  ).optional(),
});

// GET /api/questions
router.get('/', authenticateToken, async (req: Request, res: Response) => {
  try {
    const { search, subjectId, difficulty, grade } = req.query;

    const where: any = { teacherId: req.user!.id };

    if (search) {
      where.OR = [
        { text: { contains: String(search), mode: 'insensitive' } },
        { topic: { contains: String(search), mode: 'insensitive' } },
      ];
    }

    if (subjectId) {
      where.subjectId = String(subjectId);
    }

    if (grade) {
      where.grade = String(grade);
    }

    if (difficulty) {
      where.difficulty = difficulty as Difficulty;
    }

    const questions = await prisma.question.findMany({
      where,
      include: { choices: true, material: true },
      orderBy: { createdAt: 'desc' },
    });

    res.json({ success: true, count: questions.length, data: questions });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST /api/questions
router.post('/', authenticateToken, async (req: Request, res: Response) => {
  try {
    const data = questionSchema.parse(req.body);

    // Enforce Free plan question bank capacity limit (max 15 questions)
    const user = await prisma.user.findUnique({
      where: { id: req.user!.id },
      select: { plan: true, planValidUntil: true, aiQuotaUsed: true },
    });

    const isPlanExpired = !!(user?.planValidUntil && new Date(user.planValidUntil) <= new Date());
    const effectivePlan = isPlanExpired ? 'FREE' : (user?.plan || 'FREE');

    const currentCount = await prisma.question.count({
      where: { teacherId: req.user!.id },
    });

    if (effectivePlan === 'FREE' && currentCount >= 15) {
      return res.status(403).json({
        success: false,
        message: 'Kapasitas Bank Soal Paket Free Anda (maksimal 15 butir soal) telah penuh. Silakan hapus beberapa butir soal lama atau Upgrade ke paket Personal/Pro untuk menambah kapasitas penyimpanan.',
      });
    }

    const question = await prisma.question.create({
      data: {
        text: data.text,
        type: data.type,
        difficulty: data.difficulty,
        topic: data.topic || 'Umum',
        points: data.points,
        grade: data.grade || null,
        subjectId: data.subjectId || null,
        materialId: data.materialId || null,
        imageUrl: data.imageUrl || null,
        teacherId: req.user!.id,
        explanation: data.explanation || null,
        choices: data.choices && data.choices.length > 0 ? {
          create: data.choices.map((c) => ({
            text: c.text,
            isCorrect: c.isCorrect,
          })),
        } : undefined,
      },
      include: { choices: true, material: true },
    });

    // Synchronize aiQuotaUsed to match stored questions for Free plan
    if (effectivePlan === 'FREE') {
      await prisma.user.update({
        where: { id: req.user!.id },
        data: { aiQuotaUsed: currentCount + 1 },
      });
    }

    res.status(201).json({ success: true, data: question });
  } catch (err: any) {
    if (err instanceof z.ZodError) {
      return res.status(400).json({ success: false, message: err.errors[0].message });
    }
    res.status(500).json({ success: false, message: err.message });
  }
});

// PUT /api/questions/:id
router.put('/:id', authenticateToken, async (req: Request, res: Response) => {
  try {
    const data = questionSchema.parse(req.body);

    const existing = await prisma.question.findFirst({
      where: { id: req.params.id, teacherId: req.user!.id },
    });

    if (!existing) {
      return res.status(404).json({ success: false, message: 'Soal tidak ditemukan' });
    }

    // Delete existing choices first then recreate (cleanest route)
    await prisma.choice.deleteMany({ where: { questionId: req.params.id } });

    const updated = await prisma.question.update({
      where: { id: req.params.id },
      data: {
        text: data.text,
        type: data.type,
        difficulty: data.difficulty,
        topic: data.topic || 'Umum',
        points: data.points,
        grade: data.grade || null,
        subjectId: data.subjectId || null,
        materialId: data.materialId || null,
        imageUrl: data.imageUrl || null,
        explanation: data.explanation || null,
        choices: data.choices && data.choices.length > 0 ? {
          create: data.choices.map((c) => ({
            text: c.text,
            isCorrect: c.isCorrect,
          })),
        } : undefined,
      },
      include: { choices: true, material: true },
    });

    res.json({ success: true, data: updated });
  } catch (err: any) {
    if (err instanceof z.ZodError) {
      return res.status(400).json({ success: false, message: err.errors[0].message });
    }
    res.status(500).json({ success: false, message: err.message });
  }
});

// DELETE /api/questions/:id
router.delete('/:id', authenticateToken, async (req: Request, res: Response) => {
  try {
    const existing = await prisma.question.findFirst({
      where: { id: req.params.id, teacherId: req.user!.id },
    });

    if (!existing) {
      return res.status(404).json({ success: false, message: 'Soal tidak ditemukan' });
    }

    await prisma.question.delete({ where: { id: req.params.id } });

    // Sync Free plan aiQuotaUsed with new question count
    const user = await prisma.user.findUnique({
      where: { id: req.user!.id },
      select: { plan: true },
    });
    if (user?.plan === 'FREE') {
      const newCount = await prisma.question.count({
        where: { teacherId: req.user!.id },
      });
      await prisma.user.update({
        where: { id: req.user!.id },
        data: { aiQuotaUsed: newCount },
      });
    }

    res.json({ success: true, message: 'Soal berhasil dihapus' });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST /api/questions/bulk-delete
router.post('/bulk-delete', authenticateToken, async (req: Request, res: Response) => {
  try {
    const { ids } = req.body;
    if (!Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ success: false, message: 'Daftar ID soal tidak valid atau kosong' });
    }

    const result = await prisma.question.deleteMany({
      where: {
        id: { in: ids },
        teacherId: req.user!.id,
      },
    });

    // Sync Free plan aiQuotaUsed with new question count
    const user = await prisma.user.findUnique({
      where: { id: req.user!.id },
      select: { plan: true },
    });
    if (user?.plan === 'FREE') {
      const newCount = await prisma.question.count({
        where: { teacherId: req.user!.id },
      });
      await prisma.user.update({
        where: { id: req.user!.id },
        data: { aiQuotaUsed: newCount },
      });
    }

    res.json({
      success: true,
      message: `Berhasil menghapus ${result.count} butir soal.`,
      count: result.count,
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST /api/questions/import
router.post('/import', authenticateToken, async (req: Request, res: Response) => {
  try {
    const questionsArray = z.array(questionSchema).parse(req.body.questions);

    // Enforce Free plan question bank capacity limit (max 15 questions)
    const user = await prisma.user.findUnique({
      where: { id: req.user!.id },
      select: { plan: true, planValidUntil: true },
    });

    const isPlanExpired = !!(user?.planValidUntil && new Date(user.planValidUntil) <= new Date());
    const effectivePlan = isPlanExpired ? 'FREE' : (user?.plan || 'FREE');

    const currentCount = await prisma.question.count({
      where: { teacherId: req.user!.id },
    });

    if (effectivePlan === 'FREE' && currentCount + questionsArray.length > 15) {
      const remaining = Math.max(0, 15 - currentCount);
      return res.status(403).json({
        success: false,
        message: `Kapasitas Bank Soal Paket Free Anda hanya tersisa ${remaining} butir soal (maksimal 15 butir soal). Tidak dapat mengimpor ${questionsArray.length} butir soal sekaligus. Silakan kurangi jumlah soal atau Upgrade Paket!`,
      });
    }

    // Filter and map to Prisma structure
    const createdQuestions = [];
    for (const q of questionsArray) {
      const question = await prisma.question.create({
        data: {
          text: q.text,
          type: q.type,
          difficulty: q.difficulty,
          topic: q.topic || 'Umum',
          points: q.points,
          grade: q.grade || null,
          subjectId: q.subjectId || null,
          teacherId: req.user!.id,
          explanation: q.explanation || null,
          choices: q.choices && q.choices.length > 0 ? {
            create: q.choices.map((c) => ({
              text: c.text,
              isCorrect: c.isCorrect,
            })),
          } : undefined,
        },
      });
      createdQuestions.push(question);
    }

    // Sync Free plan aiQuotaUsed with new question count
    if (effectivePlan === 'FREE') {
      const newCount = await prisma.question.count({
        where: { teacherId: req.user!.id },
      });
      await prisma.user.update({
        where: { id: req.user!.id },
        data: { aiQuotaUsed: newCount },
      });
    }

    res.status(201).json({ success: true, count: createdQuestions.length });
  } catch (err: any) {
    if (err instanceof z.ZodError) {
      return res.status(400).json({ success: false, message: err.errors[0].message });
    }
    res.status(500).json({ success: false, message: err.message });
  }
});

export default router;
