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
    res.json({ success: true, message: 'Soal berhasil dihapus' });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST /api/questions/import
router.post('/import', authenticateToken, async (req: Request, res: Response) => {
  try {
    const questionsArray = z.array(questionSchema).parse(req.body.questions);

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

    res.status(201).json({ success: true, count: createdQuestions.length });
  } catch (err: any) {
    if (err instanceof z.ZodError) {
      return res.status(400).json({ success: false, message: err.errors[0].message });
    }
    res.status(500).json({ success: false, message: err.message });
  }
});

export default router;
