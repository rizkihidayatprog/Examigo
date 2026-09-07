import { Request, Response, NextFunction } from 'express';

interface RateLimitStore {
  count: number;
  resetTime: number;
}

const stores = new Map<string, Map<string, RateLimitStore>>();

/**
 * In-memory sliding window rate limiter generator
 */
export function createRateLimiter(options: {
  windowMs: number;
  max: number;
  message?: string;
  name?: string;
}) {
  const {
    windowMs,
    max,
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

// 2. Strict Limiter: 5 attempts per 15 minutes (for critical actions like forgot-password)
export const strictLimiter = createRateLimiter({
  name: 'strict',
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: 'Terlalu banyak permintaan untuk aksi ini. Silakan tunggu 15 menit lagi demi keamanan akun.',
});

// 3. Exam Access Limiter: 30 attempts per 5 minutes (prevents brute-forcing exam codes & passwords)
export const examJoinLimiter = createRateLimiter({
  name: 'exam-join',
  windowMs: 5 * 60 * 1000,
  max: 30,
  message: 'Terlalu banyak percobaan masuk ujian. Mohon tunggu 5 menit lagi.',
});

// 4. AI Question Generator Limiter: 15 generations per 5 minutes
export const aiLimiter = createRateLimiter({
  name: 'ai-gen',
  windowMs: 5 * 60 * 1000,
  max: 15,
  message: 'Batas penggunaan generator soal tercapai sementara. Silakan tunggu beberapa saat lagi.',
});

// 5. Payment & Coupon Limiter: 20 attempts per 10 minutes (prevents coupon enumeration & transaction flooding)
export const paymentLimiter = createRateLimiter({
  name: 'payments',
  windowMs: 10 * 60 * 1000,
  max: 20,
  message: 'Terlalu banyak percobaan transaksi/kupon. Harap tunggu beberapa menit sebelum mencoba lagi.',
});

// 6. General API Limiter: 300 requests per 1 minute (prevents DDoS & scraping)
export const generalApiLimiter = createRateLimiter({
  name: 'general-api',
  windowMs: 60 * 1000,
  max: 300,
  message: 'Terlalu banyak permintaan API. Harap perlambat akses Anda.',
});
