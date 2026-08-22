import { Router, Request, Response } from 'express';
import { authenticateToken } from '../middleware/auth';
import prisma from '../lib/prisma';
import { z } from 'zod';

const router = Router();

const materialSchema = z.object({
  title: z.string().min(1, 'Judul materi wajib diisi'),
  extractedText: z.string().min(1, 'Isi materi tidak boleh kosong'),
  subjectId: z.string().optional(),
});

// GET /api/materials
router.get('/', authenticateToken, async (req: Request, res: Response) => {
  try {
    const materials = await prisma.material.findMany({
      where: { teacherId: req.user!.id },
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        title: true,
        createdAt: true,
        subjectId: true,
        subject: {
          select: { name: true }
        }
      }
    });
    res.json({ success: true, data: materials });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/materials/:id
router.get('/:id', authenticateToken, async (req: Request, res: Response) => {
  try {
    const material = await prisma.material.findFirst({
      where: { id: req.params.id, teacherId: req.user!.id },
    });
    if (!material) {
      return res.status(404).json({ success: false, message: 'Materi tidak ditemukan' });
    }
    res.json({ success: true, data: material });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST /api/materials
router.post('/', authenticateToken, async (req: Request, res: Response) => {
  try {
    const data = materialSchema.parse(req.body);
    const newMaterial = await prisma.material.create({
      data: {
        title: data.title,
        extractedText: data.extractedText,
        subjectId: data.subjectId || null,
        teacherId: req.user!.id,
      },
    });
    res.status(201).json({ success: true, data: newMaterial });
  } catch (err: any) {
    if (err instanceof z.ZodError) {
      return res.status(400).json({ success: false, message: err.errors[0].message });
    }
    res.status(500).json({ success: false, message: err.message });
  }
});

// DELETE /api/materials/:id
router.delete('/:id', authenticateToken, async (req: Request, res: Response) => {
  try {
    const material = await prisma.material.findFirst({
      where: { id: req.params.id, teacherId: req.user!.id },
    });
    if (!material) {
      return res.status(404).json({ success: false, message: 'Materi tidak ditemukan' });
    }
    await prisma.material.delete({ where: { id: req.params.id } });
    res.json({ success: true, message: 'Materi berhasil dihapus' });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});

export default router;
