import express, { Request, Response } from 'express'; // Trigger TS recheck
import prisma from '../lib/prisma';
import { authenticateToken } from '../middleware/auth';
import { sendPaymentReceiptEmail } from '../lib/email';

const router = express.Router();

const PAKASIR_API_KEY = process.env.PAKASIR_API_KEY || '';
const PAKASIR_SLUG = process.env.PAKASIR_SLUG || '';
const PAKASIR_BASE_URL = (process.env.PAKASIR_BASE_URL || 'https://pakasir.com').replace(/\/$/, '');

// 1. Create Checkout Session for Plan Purchase
router.post('/checkout', async (req: Request, res: Response) => {
  try {
    const { plan, userId, userEmail, userName, couponCode, billingCycle = 'MONTHLY' } = req.body;

    if (!plan || !['PERSONAL', 'PRO_AI'].includes(plan)) {
      return res.status(400).json({ success: false, message: 'Pilihan paket tidak valid. Pilih PERSONAL atau PRO_AI' });
    }

    const basePrices: Record<string, Record<string, number>> = {
      PERSONAL: { MONTHLY: 49000, YEARLY: 490000 },
      PRO_AI: { MONTHLY: 149000, YEARLY: 1490000 },
    };

    let amount = basePrices[plan][billingCycle] || basePrices[plan]['MONTHLY'];
    let discountAmt = 0;
    let couponId = null;

    // Apply Coupon Logic
    if (couponCode) {
      const coupon = await prisma.coupon.findUnique({ where: { code: couponCode.toUpperCase() } });
      if (coupon && coupon.isActive) {
        let isValid = true;
        if (coupon.validUntil && new Date() > coupon.validUntil) isValid = false;
        if (coupon.maxUses !== null && coupon.usedCount >= coupon.maxUses) isValid = false;
        
        if (isValid) {
          discountAmt = Math.floor((amount * coupon.discountPercent) / 100);
          amount = amount - discountAmt;
          couponId = coupon.id;
        }
      }
    }

    const orderId = `EXM-PAY-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`;

    if (amount === 0) {
      // Auto-complete transaction if amount is 0 (100% discount)
      const validUntil = new Date();
      if (billingCycle === 'YEARLY') {
        validUntil.setFullYear(validUntil.getFullYear() + 1);
      } else {
        validUntil.setMonth(validUntil.getMonth() + 1);
      }

      await prisma.transaction.create({
        data: {
          orderId,
          userId: userId || null,
          plan,
          billingCycle,
          amount,
          couponId,
          discountAmt,
          status: 'PAID', // Directly marked as paid
          paymentUrl: `/payment/success?order_id=${orderId}`
        }
      });

      if (couponId) {
        await prisma.coupon.update({
          where: { id: couponId },
          data: { usedCount: { increment: 1 } }
        });
      }

      // Upgrade user subscription & quota limits immediately
      if (userId) {
        const quotaLimitMap: Record<string, number> = {
          PERSONAL: 100,
          PRO_AI: 300,
        };
        await prisma.user.update({
          where: { id: userId },
          data: {
            plan,
            planValidUntil: validUntil,
            aiQuotaLimit: quotaLimitMap[plan] || 100,
          },
        });
      }

      return res.json({ 
        success: true, 
        paymentUrl: `/payment/success?order_id=${orderId}`, 
        orderId,
        autoPaid: true
      });
    }

    // Create Pakasir Payment Link
    const encodedName = encodeURIComponent(userName || 'Pengajar Examigo');
    const encodedEmail = encodeURIComponent(userEmail || 'user@examigo.com');
    
    // Pakasir Dynamic Payment URL
    let paymentUrl = `${PAKASIR_BASE_URL}/pay/${PAKASIR_SLUG}?amount=${amount}&order_id=${orderId}&name=${encodedName}&email=${encodedEmail}`;

    // Try calling Pakasir API to create dynamic transaction
    try {
      const apiResponse = await fetch(`${PAKASIR_BASE_URL}/api/v1/transaction/create`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          api_key: PAKASIR_API_KEY,
          slug: PAKASIR_SLUG,
          amount: amount,
          order_id: orderId,
          title: `Langganan Examigo ${plan}`,
          description: `Upgrade akun ke paket ${plan}`,
          customer_name: userName || 'Pengajar Examigo',
          customer_email: userEmail || 'user@examigo.com',
          return_url: `${process.env.CLIENT_URL || 'http://localhost:5173'}/payment/success`
        })
      });

      if (apiResponse.ok) {
        const result = await apiResponse.json();
        if (result.success && result.data?.payment_url) {
          paymentUrl = result.data.payment_url;
        }
      } else {
        console.warn('Pakasir API returned non-OK status, falling back to dynamic URL');
      }
    } catch (apiError) {
      console.warn('Failed to call Pakasir API, falling back to dynamic URL', apiError);
    }

    // Save transaction to DB
    await prisma.transaction.create({
      data: {
        orderId,
        userId: userId || null,
        plan,
        billingCycle,
        amount,
        couponId,
        discountAmt,
        status: 'PENDING',
        paymentUrl
      }
    });

    if (couponId) {
      // Increment used count
      await prisma.coupon.update({
        where: { id: couponId },
        data: { usedCount: { increment: 1 } }
      });
    }

    res.json({ success: true, paymentUrl, orderId });
  } catch (error: any) {
    console.error('Checkout error:', error);
    res.status(500).json({ success: false, message: 'Gagal membuat sesi pembayaran' });
  }
});

// 2. Check Payment Status
router.get('/status/:orderId', async (req: Request, res: Response) => {
  try {
    const { orderId } = req.params;

    const transaction = await prisma.transaction.findUnique({
      where: { orderId },
      include: { user: true },
    });

    if (!transaction) {
      return res.status(404).json({ success: false, message: 'Transaksi tidak ditemukan' });
    }

    // Try fetching latest status from Pakasir API if pending
    if (transaction.status === 'PENDING') {
      try {
        const response = await fetch(
          `https://pakasir.com/api/v1/transaction/detail?api_key=${PAKASIR_API_KEY}&order_id=${orderId}`
        );
        if (response.ok) {
          const data = await response.json();
          if (data && (data.status === 'PAID' || data.status === 'SUCCESS' || data.is_paid === true)) {
            // Update transaction to PAID
            await prisma.transaction.update({
              where: { orderId },
              data: { status: 'PAID' },
            });

            // Upgrade User Plan
            if (transaction.userId) {
              const quotaLimitMap: Record<string, number> = {
                PERSONAL: 100,
                PRO_AI: 300,
              };

              await prisma.user.update({
                where: { id: transaction.userId },
                data: {
                  plan: transaction.plan,
                  aiQuotaLimit: quotaLimitMap[transaction.plan] || 100,
                },
              });
            }

            return res.json({
              success: true,
              status: 'PAID',
              plan: transaction.plan,
              message: 'Pembayaran sukses terverifikasi via Pakasir!',
            });
          }
        }
      } catch (err) {
        console.warn('Failed to query Pakasir API status:', err);
      }
    }

    res.json({
      success: true,
      status: transaction.status,
      plan: transaction.plan,
      amount: transaction.amount,
      paymentUrl: transaction.paymentUrl,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Gagal mengecek status pembayaran' });
  }
});

// 3. Pakasir Webhook Endpoint (Receives payment status notifications from Pakasir)
router.post('/pakasir-webhook', async (req: Request, res: Response) => {
  try {
    const data = { ...req.query, ...req.body };
    const targetOrderId = data.order_id || data.orderId || data.id;
    const status = (data.status || '').toUpperCase();
    const isPaid = status === 'PAID' || status === 'SUCCESS' || data.is_paid === true || data.is_paid === 'true';

    if (!targetOrderId) {
      return res.status(400).json({ success: false, message: 'order_id required' });
    }

    const transaction = await prisma.transaction.findUnique({
      where: { orderId: targetOrderId },
    });

    if (!transaction) {
      return res.status(404).json({ success: false, message: 'Transaction not found' });
    }

    if (isPaid) {
      // Update transaction status
      await prisma.transaction.update({
        where: { orderId: targetOrderId },
        data: { status: 'PAID' },
      });

      // Upgrade user subscription & quota limits
      if (transaction.userId) {
        const quotaLimitMap: Record<string, number> = {
          PERSONAL: 100,
          PRO_AI: 300,
        };

        const validUntil = new Date();
        if (transaction.billingCycle === 'YEARLY') {
          validUntil.setFullYear(validUntil.getFullYear() + 1);
        } else {
          validUntil.setMonth(validUntil.getMonth() + 1);
        }

        const updatedUser = await prisma.user.update({
          where: { id: transaction.userId },
          data: {
            plan: transaction.plan,
            planValidUntil: validUntil,
            aiQuotaLimit: quotaLimitMap[transaction.plan] || 100,
          },
        });

        // Trigger payment receipt email
        sendPaymentReceiptEmail(
          updatedUser.email,
          updatedUser.name,
          transaction.plan,
          `Rp ${transaction.amount.toLocaleString('id-ID')}`,
          validUntil.toLocaleDateString('id-ID')
        ).catch((err) => console.error('Failed to send receipt email:', err));
      }

      console.log(`✅ Pakasir Webhook: Transaction ${targetOrderId} marked as PAID for Plan ${transaction.plan}`);
    }

    res.json({ success: true, message: 'Webhook processed successfully' });
  } catch (error: any) {
    console.error('Pakasir Webhook Error:', error);
    res.status(500).json({ success: false, message: error.message || 'Webhook processing failed' });
  }
});

// 4. Get User Active Subscription & Transactions
router.get('/my-subscription', authenticateToken, async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.id;
    if (!userId) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        plan: true,
        aiQuotaUsed: true,
        aiQuotaLimit: true,
      },
    });

    const realTimeQuestionCount = await prisma.question.count({
      where: { teacherId: userId },
    });

    const transactions = await prisma.transaction.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: 10,
    });

    res.json({
      success: true,
      subscription: {
        ...user,
        aiQuotaUsed: Math.max(user?.aiQuotaUsed || 0, realTimeQuestionCount),
      },
      transactions,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Failed to fetch subscription details' });
  }
});

export default router;
