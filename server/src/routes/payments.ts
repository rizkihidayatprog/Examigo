import express, { Request, Response } from 'express';
import prisma from '../lib/prisma';
import { authenticateToken, optionalAuthenticateToken } from '../middleware/auth';
import { paymentLimiter } from '../middleware/rateLimiter';
import { sendPaymentReceiptEmail } from '../lib/email';
import midtransClient from 'midtrans-client';
import crypto from 'crypto';
import { getCmsConfig } from './cms';

const router = express.Router();

// Midtrans Configuration & Environment Resolution (Safe getters from environment)
const getIsProduction = () => process.env.MIDTRANS_IS_PRODUCTION === 'true';
const getMidtransServerKey = () => (process.env.MIDTRANS_SERVER_KEY || '').trim();
const getMidtransClientKey = () => (process.env.MIDTRANS_CLIENT_KEY || '').trim();
const getMidtransMerchantId = () => (process.env.MIDTRANS_MERCHANT_ID || '').trim();

function getSnapClient(isProd: boolean) {
  const serverKey = getMidtransServerKey();
  if (!serverKey) {
    console.warn('⚠️ [PAYMENT WARNING] MIDTRANS_SERVER_KEY belum diatur di environment!');
  }
  return new midtransClient.Snap({
    isProduction: isProd,
    serverKey,
    clientKey: getMidtransClientKey(),
  });
}

// Resilient helper: Automatically tries the primary environment, and falls back to alternate environment if 401 occurs
async function createSnapTransactionSafe(parameter: any) {
  const isProd = getIsProduction();
  try {
    const snapClient = getSnapClient(isProd);
    const response = await snapClient.createTransaction(parameter);
    return { token: response.token, redirect_url: response.redirect_url, isProduction: isProd };
  } catch (err: any) {
    if (err.httpStatusCode === '401' || err.message?.includes('401') || err.ApiResponse?.error_messages) {
      console.warn(`[Midtrans] 401 on isProduction=${isProd}. Auto-switching to isProduction=${!isProd}...`);
      const fallbackSnap = getSnapClient(!isProd);
      const fallbackResponse = await fallbackSnap.createTransaction(parameter);
      return { token: fallbackResponse.token, redirect_url: fallbackResponse.redirect_url, isProduction: !isProd };
    }
    throw err;
  }
}

async function getTransactionStatusSafe(orderId: string) {
  const isProd = getIsProduction();
  try {
    const snapClient = getSnapClient(isProd);
    return await (snapClient as any).transaction.status(orderId);
  } catch (err: any) {
    if (err.httpStatusCode === '401' || err.message?.includes('401') || err.ApiResponse?.error_messages) {
      const fallbackSnap = getSnapClient(!isProd);
      return await (fallbackSnap as any).transaction.status(orderId);
    }
    throw err;
  }
}

// Helper: Apply user benefits when payment succeeds
async function fulfillTransaction(transaction: any) {
  if (!transaction || transaction.status === 'PAID') return;

  // Mark transaction as PAID
  await prisma.transaction.update({
    where: { orderId: transaction.orderId },
    data: { status: 'PAID' },
  });

  if (!transaction.userId) return;

  if (transaction.transactionType === 'ADDON') {
    let details = { aiCount: 0, studentCount: 0, examCount: 0 };
    try {
      details = JSON.parse(transaction.addonDetails || '{}');
    } catch (e) {}

    await prisma.user.update({
      where: { id: transaction.userId },
      data: {
        extraAiQuota: { increment: details.aiCount || 0 },
        extraParticipantQuota: { increment: details.studentCount || 0 },
        extraActiveExamQuota: { increment: details.examCount || 0 },
      },
    });
  } else {
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

    // Send receipt email
    if (updatedUser?.email) {
      sendPaymentReceiptEmail(
        updatedUser.email,
        updatedUser.name,
        transaction.plan,
        `Rp ${transaction.amount.toLocaleString('id-ID')}`,
        validUntil.toLocaleDateString('id-ID')
      ).catch((err) => console.error('Failed to send Midtrans receipt email:', err));
    }
  }

  console.log(`✅ Midtrans: Transaction ${transaction.orderId} marked as PAID for Plan ${transaction.plan} (${transaction.transactionType})`);
}

// 1. Create Checkout Session for Subscription Plan (Midtrans Snap)
router.post('/checkout', paymentLimiter, optionalAuthenticateToken, async (req: Request, res: Response) => {
  try {
    const cmsConf = getCmsConfig();
    if (cmsConf.maintenance?.features?.payments) {
      return res.status(503).json({
        success: false,
        inMaintenance: true,
        scope: 'feature',
        feature: 'payments',
        message: 'Layanan checkout & transaksi pembayaran sedang dalam pemeliharaan sementara. Mohon coba beberapa saat lagi.',
      });
    }

    const { plan, userId, userEmail, userName, couponCode, billingCycle = 'MONTHLY' } = req.body;

    // Securely resolve user ID (prefer verified auth token if user is signed in)
    const targetUserId = req.user?.id || userId || null;

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

    const serviceFee = typeof cmsConf.pricing?.serviceFee === 'number' ? Math.max(0, cmsConf.pricing.serviceFee) : 0;
    const originalPlanPrice = amount;
    if (amount > 0 && serviceFee > 0) {
      amount = amount + serviceFee;
    }

    const orderId = `EXM-PAY-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`;

    if (amount <= 0) {
      // Free transaction (e.g. 100% coupon) - requires authenticated user
      if (!targetUserId) {
        return res.status(401).json({
          success: false,
          message: 'Silakan masuk ke akun Examigo Anda terlebih dahulu untuk mengklaim paket ini.',
        });
      }

      const validUntil = new Date();
      if (billingCycle === 'YEARLY') {
        validUntil.setFullYear(validUntil.getFullYear() + 1);
      } else {
        validUntil.setMonth(validUntil.getMonth() + 1);
      }

      await prisma.transaction.create({
        data: {
          orderId,
          userId: targetUserId,
          plan,
          billingCycle,
          amount: 0,
          couponId,
          discountAmt,
          status: 'PAID',
          paymentUrl: `/payment/success?order_id=${orderId}`
        }
      });

      if (couponId) {
        await prisma.coupon.update({
          where: { id: couponId },
          data: { usedCount: { increment: 1 } }
        });
      }

      if (targetUserId) {
        const quotaLimitMap: Record<string, number> = {
          PERSONAL: 100,
          PRO_AI: 300,
        };
        await prisma.user.update({
          where: { id: targetUserId },
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

    // Midtrans Snap Parameters
    const clientUrl = process.env.CLIENT_URL || 'http://localhost:5173';
    const snapParameter = {
      transaction_details: {
        order_id: orderId,
        gross_amount: Math.round(amount),
      },
      customer_details: {
        first_name: userName || 'Pengajar Examigo',
        email: userEmail || 'user@examigo.com',
      },
      item_details: [
        {
          id: `PLAN-${plan}-${billingCycle}`,
          price: Math.round(originalPlanPrice),
          quantity: 1,
          name: `Langganan Examigo ${plan === 'PRO_AI' ? 'Pro' : 'Personal'} (${billingCycle === 'YEARLY' ? 'Tahunan' : 'Bulanan'})`.slice(0, 50),
        },
        ...(serviceFee > 0 ? [{
          id: 'SERVICE_FEE',
          price: Math.round(serviceFee),
          quantity: 1,
          name: 'Biaya Layanan',
        }] : []),
      ],
      callbacks: {
        finish: `${clientUrl}/payment/success?order_id=${orderId}`,
        error: `${clientUrl}/payment/${orderId}`,
        pending: `${clientUrl}/payment/${orderId}`,
      },
    };

    let snapToken = '';
    let paymentUrl = '';
    let isProdEnv = getIsProduction();

    try {
      const snapResponse = await createSnapTransactionSafe(snapParameter);
      snapToken = snapResponse.token;
      paymentUrl = snapResponse.redirect_url;
      isProdEnv = snapResponse.isProduction;
    } catch (midtransError: any) {
      console.error('Midtrans Snap createTransaction error:', midtransError);
      throw new Error(`Gagal membuat sesi pembayaran Midtrans: ${midtransError.message || 'Error koneksi gateway'}`);
    }

    // Save transaction to DB
    await prisma.transaction.create({
      data: {
        orderId,
        userId: targetUserId || null,
        plan,
        billingCycle,
        amount: Math.round(amount),
        couponId,
        discountAmt,
        status: 'PENDING',
        paymentUrl,
      }
    });

    if (couponId) {
      await prisma.coupon.update({
        where: { id: couponId },
        data: { usedCount: { increment: 1 } }
      });
    }

    res.json({
      success: true,
      snapToken,
      paymentUrl,
      orderId,
      amount: Math.round(amount),
      plan,
      isProduction: isProdEnv,
      clientKey: getMidtransClientKey(),
    });
  } catch (error: any) {
    console.error('Checkout error:', error);
    res.status(500).json({ success: false, message: error.message || 'Gagal membuat sesi pembayaran Midtrans' });
  }
});

// 1b. Create Checkout Session for Add-on Top Up (Midtrans Snap)
router.post('/checkout-addon', authenticateToken, paymentLimiter, async (req: Request, res: Response) => {
  try {
    const cmsConf = getCmsConfig();
    if (cmsConf.maintenance?.features?.payments) {
      return res.status(503).json({
        success: false,
        inMaintenance: true,
        scope: 'feature',
        feature: 'payments',
        message: 'Layanan top-up & penambahan kuota sedang dalam pemeliharaan sementara. Mohon coba beberapa saat lagi.',
      });
    }

    const userId = (req as any).user?.id;
    const { aiCount = 0, studentCount = 0, examCount = 0 } = req.body;

    const numAi = Math.max(0, parseInt(aiCount, 10) || 0);
    const numStudent = Math.max(0, parseInt(studentCount, 10) || 0);
    const numExam = Math.max(0, parseInt(examCount, 10) || 0);

    if (numAi === 0 && numStudent === 0 && numExam === 0) {
      return res.status(400).json({ success: false, message: 'Pilih minimal satu kuota untuk ditambahkan.' });
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return res.status(404).json({ success: false, message: 'Pengguna tidak ditemukan.' });
    }

    if (user.plan === 'FREE') {
      return res.status(403).json({
        success: false,
        message: 'Pembelian kuota satuan (add-on) hanya berlaku untuk pengguna paket berbayar (Personal dan Pro). Silakan upgrade paket langganan Anda terlebih dahulu.',
      });
    }

    // Read CMS Addon Pricing
    let addonPricing = {
      enabled: true,
      pricePerAiQuestion: 500,
      pricePerStudent: 200,
      pricePerActiveExam: 5000,
    };

    try {
      const fs = await import('fs');
      const path = await import('path');
      const cmsPath = path.join(process.cwd(), 'cms_config.json');
      if (fs.existsSync(cmsPath)) {
        const cms = JSON.parse(fs.readFileSync(cmsPath, 'utf8'));
        if (cms.addonPricing) {
          addonPricing = { ...addonPricing, ...cms.addonPricing };
        }
      }
    } catch (e) {}

    if (!addonPricing.enabled) {
      return res.status(403).json({ success: false, message: 'Fitur pembelian kuota tambahan saat ini sedang dinonaktifkan oleh Admin.' });
    }

    const totalAmount = 
      (numAi * addonPricing.pricePerAiQuestion) +
      (numStudent * addonPricing.pricePerStudent) +
      (numExam * addonPricing.pricePerActiveExam);

    const orderId = `EXM-ADD-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`;
    const addonDetails = JSON.stringify({ aiCount: numAi, studentCount: numStudent, examCount: numExam });

    const clientUrl = process.env.CLIENT_URL || 'http://localhost:5173';
    const items = [];
    if (numAi > 0) {
      items.push({
        id: 'ADDON-AI',
        price: addonPricing.pricePerAiQuestion,
        quantity: numAi,
        name: `${numAi} Butir Kuota Soal`.slice(0, 50),
      });
    }
    if (numStudent > 0) {
      items.push({
        id: 'ADDON-STUDENT',
        price: addonPricing.pricePerStudent,
        quantity: numStudent,
        name: `${numStudent} Kapasitas Siswa`.slice(0, 50),
      });
    }
    if (numExam > 0) {
      items.push({
        id: 'ADDON-EXAM',
        price: addonPricing.pricePerActiveExam,
        quantity: numExam,
        name: `${numExam} Slot Ujian Aktif`.slice(0, 50),
      });
    }

    const snapParameter = {
      transaction_details: {
        order_id: orderId,
        gross_amount: Math.round(totalAmount),
      },
      customer_details: {
        first_name: user.name || 'Pengajar Examigo',
        email: user.email || 'user@examigo.com',
      },
      item_details: items,
      callbacks: {
        finish: `${clientUrl}/payment/success?order_id=${orderId}`,
        error: `${clientUrl}/payment/${orderId}`,
        pending: `${clientUrl}/payment/${orderId}`,
      },
    };

    let snapToken = '';
    let paymentUrl = '';
    let isProdEnv = getIsProduction();

    try {
      const snapResponse = await createSnapTransactionSafe(snapParameter);
      snapToken = snapResponse.token;
      paymentUrl = snapResponse.redirect_url;
      isProdEnv = snapResponse.isProduction;
    } catch (midtransError: any) {
      console.error('Midtrans Addon createTransaction error:', midtransError);
      throw new Error(`Gagal membuat sesi top-up Midtrans: ${midtransError.message || 'Error koneksi gateway'}`);
    }

    // Save transaction
    await prisma.transaction.create({
      data: {
        orderId,
        userId: user.id,
        plan: user.plan,
        transactionType: 'ADDON',
        addonDetails,
        amount: Math.round(totalAmount),
        status: 'PENDING',
        paymentUrl,
      },
    });

    res.json({
      success: true,
      orderId,
      amount: totalAmount,
      snapToken,
      paymentUrl,
      isProduction: isProdEnv,
      clientKey: getMidtransClientKey(),
    });
  } catch (error: any) {
    console.error('Checkout addon error:', error);
    res.status(500).json({ success: false, message: error.message || 'Gagal memproses pembelian kuota Midtrans' });
  }
});

// 2. Check Payment Status (Queries Midtrans API)
router.get('/status/:orderId', paymentLimiter, async (req: Request, res: Response) => {
  try {
    const { orderId } = req.params;

    const transaction = await prisma.transaction.findUnique({
      where: { orderId },
      include: { user: true },
    });

    if (!transaction) {
      return res.status(404).json({ success: false, message: 'Transaksi tidak ditemukan' });
    }

    let isPaid = transaction.status === 'PAID';

    // Query Midtrans API directly if pending
    if (!isPaid && transaction.status === 'PENDING') {
      try {
        const midtransRes = await getTransactionStatusSafe(orderId);
        const txStatus = midtransRes.transaction_status;
        const fraudStatus = midtransRes.fraud_status;

        if (txStatus === 'settlement' || (txStatus === 'capture' && fraudStatus === 'accept')) {
          isPaid = true;
        } else if (txStatus === 'expire') {
          await prisma.transaction.update({
            where: { orderId },
            data: { status: 'EXPIRED' },
          });
        } else if (txStatus === 'cancel' || txStatus === 'deny') {
          await prisma.transaction.update({
            where: { orderId },
            data: { status: 'FAILED' },
          });
        }
      } catch (err: any) {
        console.warn(`Midtrans status check warning for ${orderId}:`, err?.message || err);
      }
    }

    if (isPaid && transaction.status !== 'PAID') {
      await fulfillTransaction(transaction);

      return res.json({
        success: true,
        status: 'PAID',
        plan: transaction.plan,
        transactionType: transaction.transactionType,
        message: 'Pembayaran Midtrans sukses terverifikasi!',
      });
    }

    // Refresh transaction state
    const currentTx = await prisma.transaction.findUnique({
      where: { orderId },
      select: { status: true, plan: true, transactionType: true, amount: true, paymentUrl: true },
    });

    res.json({
      success: true,
      status: currentTx?.status || transaction.status,
      plan: transaction.plan,
      transactionType: transaction.transactionType,
      amount: transaction.amount,
      paymentUrl: transaction.paymentUrl,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Gagal mengecek status pembayaran' });
  }
});

// 3. Midtrans Webhook / HTTP Notification Handler
const handleMidtransWebhook = async (req: Request, res: Response) => {
  try {
    const notificationJson = req.body;

    if (!notificationJson || !notificationJson.order_id) {
      return res.status(400).json({ success: false, message: 'Invalid notification data' });
    }

    const { order_id, status_code, gross_amount, signature_key, transaction_status, fraud_status } = notificationJson;

    // Signature key is strictly mandatory for webhook verification
    if (!signature_key || typeof signature_key !== 'string') {
      console.warn('⚠️ Midtrans Webhook: Request rejected due to missing signature key.');
      return res.status(403).json({ success: false, message: 'Kunci tanda tangan webhook (signature_key) wajib disertakan' });
    }

    // Verify signature key from Midtrans
    const serverKey = getMidtransServerKey();
    const calculatedSignature = crypto
      .createHash('sha512')
      .update(`${order_id}${status_code}${gross_amount}${serverKey}`)
      .digest('hex');

    if (signature_key !== calculatedSignature) {
      console.warn('⚠️ Midtrans Webhook: Invalid signature key rejected.');
      return res.status(403).json({ success: false, message: 'Tanda tangan otentikasi webhook tidak valid' });
    }

    const transaction = await prisma.transaction.findUnique({
      where: { orderId: order_id },
      include: { user: true },
    });

    if (!transaction) {
      return res.status(404).json({ success: false, message: 'Transaction not found' });
    }

    const isPaid =
      transaction_status === 'settlement' ||
      (transaction_status === 'capture' && fraud_status === 'accept');

    if (isPaid) {
      await fulfillTransaction(transaction);
    } else if (transaction_status === 'expire') {
      await prisma.transaction.update({
        where: { orderId: order_id },
        data: { status: 'EXPIRED' },
      });
    } else if (transaction_status === 'cancel' || transaction_status === 'deny') {
      await prisma.transaction.update({
        where: { orderId: order_id },
        data: { status: 'FAILED' },
      });
    }

    res.json({ success: true, message: 'Midtrans notification processed' });
  } catch (error: any) {
    console.error('Midtrans Webhook Error:', error);
    res.status(500).json({ success: false, message: error.message || 'Webhook processing failed' });
  }
};

// Endpoints for Midtrans Webhook Notification
router.post('/midtrans-webhook', handleMidtransWebhook);
router.post('/notification', handleMidtransWebhook);
router.post('/pakasir-webhook', handleMidtransWebhook); // Alias to prevent broken external webhooks

// 4. Get User Active Subscription & Transactions
router.get('/my-subscription', authenticateToken, async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.id;
    if (!userId) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    // Auto-sync recent PENDING transactions with Midtrans API
    try {
      const pendingTxs = await prisma.transaction.findMany({
        where: {
          userId,
          status: 'PENDING',
          createdAt: { gte: new Date(Date.now() - 24 * 60 * 60 * 1000) }
        },
        take: 3
      });

      for (const pTx of pendingTxs) {
        try {
          const midtransRes = await getTransactionStatusSafe(pTx.orderId);
          const txStatus = midtransRes?.transaction_status;
          const fraudStatus = midtransRes?.fraud_status;
          if (txStatus === 'settlement' || (txStatus === 'capture' && fraudStatus === 'accept')) {
            await fulfillTransaction(pTx);
          } else if (txStatus === 'expire') {
            await prisma.transaction.update({ where: { orderId: pTx.orderId }, data: { status: 'EXPIRED' } });
          } else if (txStatus === 'cancel' || txStatus === 'deny') {
            await prisma.transaction.update({ where: { orderId: pTx.orderId }, data: { status: 'FAILED' } });
          }
        } catch (syncErr) {
          // ignore individual sync failure
        }
      }
    } catch (e) {
      console.warn('Failed auto-syncing pending transactions in my-subscription:', e);
    }

    let user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        plan: true,
        planValidUntil: true,
        aiQuotaUsed: true,
        aiQuotaLimit: true,
        extraAiQuota: true,
        extraParticipantQuota: true,
        extraActiveExamQuota: true,
        createdAt: true,
      },
    });

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Auto-downgrade to FREE if subscription validity has expired
    const isPlanExpired = !!(user.planValidUntil && new Date(user.planValidUntil) <= new Date());
    if (isPlanExpired && (user.plan !== 'FREE' || (user.extraAiQuota || 0) > 0 || (user.extraParticipantQuota || 0) > 0 || (user.extraActiveExamQuota || 0) > 0 || (user.aiQuotaLimit || 0) > 15)) {
      user = await prisma.user.update({
        where: { id: userId },
        data: {
          plan: 'FREE',
          aiQuotaLimit: 15,
          extraAiQuota: 0,
          extraParticipantQuota: 0,
          extraActiveExamQuota: 0,
        },
        select: {
          id: true,
          email: true,
          name: true,
          role: true,
          plan: true,
          planValidUntil: true,
          aiQuotaUsed: true,
          aiQuotaLimit: true,
          extraAiQuota: true,
          extraParticipantQuota: true,
          extraActiveExamQuota: true,
          createdAt: true,
        },
      });
      console.log(`[Auto-Downgrade] User ${user.email} masa aktif habis. Otomatis reset semua benefit ke paket default FREE.`);
    }

    if (isPlanExpired) {
      user.plan = 'FREE';
      user.aiQuotaLimit = 15;
      user.extraAiQuota = 0;
      user.extraParticipantQuota = 0;
      user.extraActiveExamQuota = 0;
    }

    // Question count in question bank
    const realTimeQuestionCount = await prisma.question.count({
      where: { teacherId: userId },
    });

    // For FREE plan, synchronize aiQuotaUsed directly with current questions held/used
    if (user.plan === 'FREE') {
      if (user.aiQuotaUsed !== realTimeQuestionCount) {
        await prisma.user.update({
          where: { id: userId },
          data: { aiQuotaUsed: realTimeQuestionCount },
        });
        user.aiQuotaUsed = realTimeQuestionCount;
      }
    }

    // Active exams count (published exams)
    const activeExamsCount = await prisma.exam.count({
      where: { teacherId: userId, isPublished: true },
    });

    // Total exams count
    const totalExamsCount = await prisma.exam.count({
      where: { teacherId: userId },
    });

    // Total participants count across user's exams
    const totalParticipantsCount = await prisma.participant.count({
      where: { exam: { teacherId: userId } },
    });

    // Materials count
    const totalMaterialsCount = await prisma.material.count({
      where: { teacherId: userId },
    });

    const transactions = await prisma.transaction.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: 15,
    });

    // Determine limits dynamically according to user's plan
    let planKey = 'free';
    if (user.plan === 'PRO_AI') planKey = 'pro_ai';
    else if (user.plan === 'PERSONAL') planKey = 'personal';

    let limits = {
      maxAiQuestions: user.plan === 'PRO_AI' ? 300 : user.plan === 'PERSONAL' ? 100 : 15,
      maxParticipants: user.plan === 'PRO_AI' ? 200 : user.plan === 'PERSONAL' ? 50 : 5,
      maxActiveExams: user.plan === 'PRO_AI' ? 15 : user.plan === 'PERSONAL' ? 5 : 1,
      name: user.plan === 'PRO_AI' ? 'Pro' : user.plan === 'PERSONAL' ? 'Personal' : 'Free',
      badge: user.plan === 'PRO_AI' ? 'Sekolah & Bimbel' : user.plan === 'PERSONAL' ? 'Guru Mandiri' : 'Paket Dasar',
      monthlyPrice: user.plan === 'PRO_AI' ? 149000 : user.plan === 'PERSONAL' ? 49000 : 0,
    };

    let addonPricing = {
      enabled: true,
      pricePerAiQuestion: 500,
      pricePerStudent: 200,
      pricePerActiveExam: 5000,
      minAiQuestions: 10,
      minStudents: 10,
      minActiveExams: 1,
    };

    // If CMS config exists, override with CMS values
    try {
      const fs = await import('fs');
      const path = await import('path');
      const cmsPath = path.join(process.cwd(), 'cms_config.json');
      if (fs.existsSync(cmsPath)) {
        const cms = JSON.parse(fs.readFileSync(cmsPath, 'utf8'));
        if (cms.pricing && cms.pricing[planKey]) {
          const p = cms.pricing[planKey];
          limits = {
            maxAiQuestions: p.maxAiQuestions ?? limits.maxAiQuestions,
            maxParticipants: p.maxParticipants ?? limits.maxParticipants,
            maxActiveExams: p.maxActiveExams ?? limits.maxActiveExams,
            name: p.name ?? limits.name,
            badge: p.badge ?? limits.badge,
            monthlyPrice: p.monthlyPrice ?? limits.monthlyPrice,
          };
        }
        if (cms.addonPricing) {
          addonPricing = { ...addonPricing, ...cms.addonPricing };
        }
      }
    } catch (e) {
      // fallback
    }

    // Add extra quotas purchased to total limits
    const totalLimits = {
      ...limits,
      maxAiQuestions: limits.maxAiQuestions + (user.extraAiQuota || 0),
      maxParticipants: limits.maxParticipants + (user.extraParticipantQuota || 0),
      maxActiveExams: limits.maxActiveExams + (user.extraActiveExamQuota || 0),
      baseAiQuestions: limits.maxAiQuestions,
      baseParticipants: limits.maxParticipants,
      baseActiveExams: limits.maxActiveExams,
    };

    res.json({
      success: true,
      subscription: {
        ...user,
        isExpired: isPlanExpired,
        aiQuotaUsed: user.aiQuotaUsed || 0,
        realTimeQuestionCount,
        activeExamsCount,
        totalExamsCount,
        totalParticipantsCount,
        totalMaterialsCount,
        limits: totalLimits,
        addonPricing,
      },
      transactions,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Failed to fetch subscription details' });
  }
});

export default router;
