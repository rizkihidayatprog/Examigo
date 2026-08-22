import { Router } from 'express';
import { requireAdmin } from '../middleware/auth';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

// Get all coupons
router.get('/', requireAdmin, async (req, res) => {
  try {
    const coupons = await prisma.coupon.findMany({
      orderBy: { createdAt: 'desc' }
    });
    res.json({ success: true, data: coupons });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Create a new coupon
router.post('/', requireAdmin, async (req, res) => {
  try {
    const { code, discountPercent, maxUses, validUntil } = req.body;
    
    // Check if code exists
    const existing = await prisma.coupon.findUnique({ where: { code } });
    if (existing) {
      return res.status(400).json({ success: false, message: 'Kode kupon sudah ada' });
    }

    const coupon = await prisma.coupon.create({
      data: {
        code: code.toUpperCase(),
        discountPercent,
        maxUses: maxUses || null,
        validUntil: validUntil ? new Date(validUntil) : null,
      }
    });
    res.json({ success: true, data: coupon });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Update coupon status
router.put('/:id', requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { isActive, discountPercent, maxUses, validUntil } = req.body;
    
    const coupon = await prisma.coupon.update({
      where: { id },
      data: {
        isActive,
        discountPercent,
        maxUses,
        validUntil: validUntil ? new Date(validUntil) : null,
      }
    });
    res.json({ success: true, data: coupon });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Delete a coupon
router.delete('/:id', requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.coupon.delete({ where: { id } });
    res.json({ success: true, message: 'Kupon berhasil dihapus' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Apply coupon (Public/Authenticated)
router.post('/apply', async (req, res) => {
  try {
    const { code, planAmount } = req.body;
    if (!code) return res.status(400).json({ success: false, message: 'Kode kupon tidak valid' });

    const coupon = await prisma.coupon.findUnique({ where: { code: code.toUpperCase() } });
    
    if (!coupon) {
      return res.status(404).json({ success: false, message: 'Kupon tidak ditemukan' });
    }
    
    if (!coupon.isActive) {
      return res.status(400).json({ success: false, message: 'Kupon sudah tidak aktif' });
    }
    
    if (coupon.validUntil && new Date() > coupon.validUntil) {
      return res.status(400).json({ success: false, message: 'Kupon sudah kedaluwarsa' });
    }
    
    if (coupon.maxUses !== null && coupon.usedCount >= coupon.maxUses) {
      return res.status(400).json({ success: false, message: 'Batas penggunaan kupon telah habis' });
    }

    const discountAmount = Math.floor((planAmount * coupon.discountPercent) / 100);
    const finalAmount = planAmount - discountAmount;

    res.json({ 
      success: true, 
      data: { 
        couponId: coupon.id,
        code: coupon.code,
        discountPercent: coupon.discountPercent,
        discountAmount,
        finalAmount
      } 
    });

  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
