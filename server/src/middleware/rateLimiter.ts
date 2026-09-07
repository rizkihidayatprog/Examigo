import { Request, Response, NextFunction } from 'express';
import { getCmsConfig } from '../routes/cms';

interface RateLimitStore {
  count: number;
  resetTime: number;
}

const stores = new Map<string, Map<string, RateLimitStore>>();

/**
 * Reset / Flush all in-memory rate limit stores
 * Digunakan oleh Admin CMS untuk membersihkan antrean jika pengguna terkena blokir saat testing
 */
export function resetAllRateLimits(): void {
  for (const store of stores.values()) {
    store.clear();
  }
}

/**
 * In-memory sliding window rate limiter generator with dynamic CMS configuration
 */
export function createRateLimiter(options: {
  windowMs: number;
  max: number;
  message?: string;
  name?: string;
}) {
  const {
    windowMs: defaultWindowMs,
    max: defaultMax,
    message = 'Terlalu banyak permintaan dari perangkat Anda. Silakan tunggu beberapa saat lagi.',
    name = 'default',
  } = options;

  if (!stores.has(name)) {
    stores.set(name, new Map());
  }

  // Periodic cleanup of expired entries every 10 minutes to prevent memory leaks
  setInterval(() => {
    const store = stores.get(name);
    if (!store) return;
    const now = Date.now();
    for (const [key, record] of store.entries()) {
      if (now > record.resetTime) {
        store.delete(key);
      }
    }
  }, 10 * 60 * 1000);

  return (req: Request, res: Response, next: NextFunction) => {
    // 1. Dynamic Check from CMS Config
    let isRateLimitActive = true;
    let max = defaultMax;
    let windowMs = defaultWindowMs;

    try {
      const cms = getCmsConfig();
      const rl = cms?.rateLimit;
      if (rl) {
        // Jika mode developer aktif / rate limiter dinonaktifkan: bypass langsung
        if (rl.enabled === false) {
          isRateLimitActive = false;
        }

        if (name === 'payments' && rl.paymentsMax) {
          max = Math.max(1, Number(rl.paymentsMax) || defaultMax);
          if (rl.paymentsWindowMinutes) {
            windowMs = Math.max(1, Number(rl.paymentsWindowMinutes)) * 60 * 1000;
          }
        } else if (name === 'payment-status') {
          // Status polling selalu diberikan kelonggaran 3x lipat batas transaksi
          const base = Math.max(1, Number(rl.paymentsMax) || defaultMax);
          max = base * 3;
        } else if (name === 'auth' && rl.authMax) {
          max = Math.max(1, Number(rl.authMax) || defaultMax);
        } else if (name === 'strict' && rl.strictMax) {
          max = Math.max(1, Number(rl.strictMax) || defaultMax);
        } else if (name === 'ai-gen' && rl.aiMax) {
          max = Math.max(1, Number(rl.aiMax) || defaultMax);
        } else if (name === 'general-api' && rl.generalApiMax) {
          max = Math.max(1, Number(rl.generalApiMax) || defaultMax);
        }
      }
    } catch {
      // Abaikan error pembacaan config & gunakan fallback default
    }

    // Bypass jika dinonaktifkan di CMS (Mode Developer)
    if (!isRateLimitActive) {
      res.setHeader('X-RateLimit-Bypassed', 'true');
      return next();
    }

    const store = stores.get(name)!;

    // Use X-Forwarded-For if behind a proxy, or socket remoteAddress
    const forwarded = req.headers['x-forwarded-for'];
    const clientIp = typeof forwarded === 'string'
      ? forwarded.split(',')[0].trim()
      : req.ip || req.socket.remoteAddress || 'unknown-client';

    const now = Date.now();
    let record = store.get(clientIp);

    if (!record || now > record.resetTime) {
      record = {
        count: 1,
        resetTime: now + windowMs,
      };
      store.set(clientIp, record);

      res.setHeader('X-RateLimit-Limit', max);
      res.setHeader('X-RateLimit-Remaining', Math.max(0, max - 1));
      res.setHeader('X-RateLimit-Reset', Math.ceil(record.resetTime / 1000));

      return next();
    }

    // Set rate limit headers
    res.setHeader('X-RateLimit-Limit', max);
    res.setHeader('X-RateLimit-Remaining', Math.max(0, max - record.count));
    res.setHeader('X-RateLimit-Reset', Math.ceil(record.resetTime / 1000));

    if (record.count >= max) {
      const retryAfterSeconds = Math.ceil((record.resetTime - now) / 1000);
      res.setHeader('Retry-After', retryAfterSeconds);
      return res.status(429).json({
        success: false,
        error: 'RATE_LIMIT_EXCEEDED',
        message,
        retryAfterSeconds,
      });
    }

    record.count += 1;
    res.setHeader('X-RateLimit-Remaining', Math.max(0, max - record.count));
    next();
  };
}

// 1. Auth Endpoint Limiter: 100 attempts per 1 minute
export const authLimiter = createRateLimiter({
  name: 'auth',
  windowMs: 60 * 1000,
  max: 100,
  message: 'Batas percobaan login/pendaftaran tercapai. Demi keamanan akun, mohon tunggu beberapa menit lagi.',
});

// 2. Strict Limiter: 15 attempts per 15 minutes (for critical actions like forgot-password)
export const strictLimiter = createRateLimiter({
  name: 'strict',
  windowMs: 15 * 60 * 1000,
  max: 15,
  message: 'Terlalu banyak permintaan untuk aksi ini. Silakan tunggu 15 menit lagi demi keamanan akun.',
});

// 3. Exam Access Limiter: 60 attempts per 5 minutes (prevents brute-forcing exam codes & passwords)
export const examJoinLimiter = createRateLimiter({
  name: 'exam-join',
  windowMs: 5 * 60 * 1000,
  max: 60,
  message: 'Terlalu banyak percobaan masuk ujian. Mohon tunggu 5 menit lagi.',
});

// 4. AI Question Generator Limiter: 30 generations per 5 minutes
export const aiLimiter = createRateLimiter({
  name: 'ai-gen',
  windowMs: 5 * 60 * 1000,
  max: 30,
  message: 'Batas penggunaan generator soal tercapai sementara. Silakan tunggu beberapa saat lagi.',
});

// 5. Payment & Coupon Limiter: default 100 attempts per 5 minutes (prevents coupon enumeration & transaction flooding)
export const paymentLimiter = createRateLimiter({
  name: 'payments',
  windowMs: 5 * 60 * 1000,
  max: 100,
  message: 'Terlalu banyak percobaan transaksi/kupon. Harap tunggu beberapa menit sebelum mencoba lagi atau hubungi Admin.',
});

// 6. Payment Status Polling Limiter: default 200 attempts per 1 minute (allows smooth status check & polling without false blocks)
export const paymentStatusLimiter = createRateLimiter({
  name: 'payment-status',
  windowMs: 60 * 1000,
  max: 200,
  message: 'Terlalu sering memeriksa status pembayaran. Mohon tunggu sebentar.',
});

// 7. General API Limiter: 500 requests per 1 minute (prevents DDoS & scraping)
export const generalApiLimiter = createRateLimiter({
  name: 'general-api',
  windowMs: 60 * 1000,
  max: 500,
  message: 'Terlalu banyak permintaan API. Harap perlambat akses Anda.',
});
