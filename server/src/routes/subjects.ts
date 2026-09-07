import { Router, Request, Response } from 'express';
import { authenticateToken } from '../middleware/auth';
import prisma from '../lib/prisma';
import { z } from 'zod';

const router = Router();

const subjectSchema = z.object({
  name: z.string().min(1, 'Nama mata pelajaran wajib diisi'),
  description: z.string().optional(),
});

import { CURRICULUM_SUBJECTS, JenjangType } from '../lib/curriculum';

// GET /api/subjects/standard
router.get('/standard', (req: Request, res: Response) => {
  const { jenjang } = req.query;
  if (jenjang && typeof jenjang === 'string' && jenjang.toUpperCase() in CURRICULUM_SUBJECTS) {
    const key = jenjang.toUpperCase() as JenjangType;
    return res.json({ success: true, jenjang: key, data: CURRICULUM_SUBJECTS[key] });
  }
  res.json({ success: true, data: CURRICULUM_SUBJECTS });
});

// POST /api/subjects/ensure
// Finds or creates a subject with the given name for the teacher
router.post('/ensure', authenticateToken, async (req: Request, res: Response) => {
  try {
    const { name, description } = req.body;
    if (!name || typeof name !== 'string' || !name.trim()) {
      return res.status(400).json({ success: false, message: 'Nama mata pelajaran wajib diisi' });
    }
    const cleanName = name.trim();
    let subject = await prisma.subject.findFirst({
      where: { name: cleanName, teacherId: req.user!.id },
    });
    if (!subject) {
      subject = await prisma.subject.create({
        data: {
          name: cleanName,
          description: description || 'Mata Pelajaran Kurikulum Standar',
          teacherId: req.user!.id,
        },
      });
    }
    res.json({ success: true, data: subject });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/subjects
router.get('/', authenticateToken, async (req: Request, res: Response) => {
  try {
    const subjects = await prisma.subject.findMany({
      where: { teacherId: req.user!.id },
      include: {
        _count: {
          select: { questions: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
    res.json({ success: true, data: subjects });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST /api/subjects
router.post('/', authenticateToken, async (req: Request, res: Response) => {
  try {
    const data = subjectSchema.parse(req.body);
    const newSubject = await prisma.subject.create({
      data: {
        name: data.name,
        description: data.description,
        teacherId: req.user!.id,
      },
    });
    res.status(201).json({ success: true, data: newSubject });
  } catch (err: any) {
    if (err instanceof z.ZodError) {
      return res.status(400).json({ success: false, message: err.errors[0].message });
    }
    res.status(500).json({ success: false, message: err.message });
  }
});

// DELETE /api/subjects/:id
router.delete('/:id', authenticateToken, async (req: Request, res: Response) => {
  try {
    const subject = await prisma.subject.findFirst({
      where: { id: req.params.id, teacherId: req.user!.id },
    });
    if (!subject) {
      return res.status(404).json({ success: false, message: 'Mata pelajaran tidak ditemukan' });
    }
    await prisma.subject.delete({ where: { id: req.params.id } });
    res.json({ success: true, message: 'Mata pelajaran berhasil dihapus' });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});

export default router;
