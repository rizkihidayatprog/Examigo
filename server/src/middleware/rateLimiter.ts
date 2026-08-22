import { Request, Response, NextFunction } from 'express';

interface RateLimitStore {
  count: number;
  resetTime: number;
}

const stores = new Map<string, Map<string, RateLimitStore>>();

export function createRateLimiter(options: { windowMs: number; max: number; message?: string }) {
  const { windowMs, max, message = 'Terlalu banyak permintaan. Silakan coba lagi beberapa saat lagi.' } = options;

  return (req: Request, res: Response, next: NextFunction) => {
    const routeKey = req.baseUrl || req.path;
    if (!stores.has(routeKey)) {
      stores.set(routeKey, new Map());
    }

    const routeStore = stores.get(routeKey)!;
    const clientIp = req.ip || req.headers['x-forwarded-for'] as string || 'unknown-ip';
    const now = Date.now();

    const record = routeStore.get(clientIp);

    if (!record || now > record.resetTime) {
      routeStore.set(clientIp, {
        count: 1,
        resetTime: now + windowMs,
      });
      return next();
    }

    if (record.count >= max) {
      const retryAfterSeconds = Math.ceil((record.resetTime - now) / 1000);
      res.setHeader('Retry-After', retryAfterSeconds);
      return res.status(429).json({
        success: false,
        message,
        retryAfterSeconds,
      });
    }

    record.count += 1;
    next();
  };
}

// AI Endpoint Limiter: Max 10 AI generations per 5 minutes
export const aiLimiter = createRateLimiter({
  windowMs: 5 * 60 * 1000,
  max: 10,
  message: 'Batas penggunaan AI tercapai untuk sementara waktu. Silakan tunggu 5 menit lagi.',
});

// Auth Limiter: Max 15 attempts per 15 minutes
export const authLimiter = createRateLimiter({
  windowMs: 15 * 60 * 1000,
  max: 15,
  message: 'Terlalu banyak percobaan autentikasi. Silakan coba lagi dalam 15 menit.',
});
