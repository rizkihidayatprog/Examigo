import { Request, Response, NextFunction } from 'express';
import cors from 'cors';

const ALLOWED_ORIGIN_PATTERNS = [
  /^http:\/\/localhost:\d+$/,
  /^http:\/\/127\.0\.0\.1:\d+$/,
  /^https:\/\/[a-z0-9-]+\.examigo\.id$/,
  /^https:\/\/examigo\.id$/,
];

export function isAllowedOrigin(origin?: string | null): boolean {
  if (!origin) return true; // Non-browser clients (curl, mobile, server webhooks)

  try {
    const originUrl = new URL(origin);
    const originHost = `${originUrl.protocol}//${originUrl.host}`;

    // 1. Check regex patterns (localhost, 127.0.0.1, examigo.id domains)
    if (ALLOWED_ORIGIN_PATTERNS.some((pattern) => pattern.test(originHost))) {
      return true;
    }

    // 2. Check environment-configured CLIENT_URL and ALLOWED_ORIGINS
    const configuredOrigins = [
      process.env.CLIENT_URL,
      ...(process.env.ALLOWED_ORIGINS ? process.env.ALLOWED_ORIGINS.split(',').map((s) => s.trim()) : []),
    ].filter(Boolean) as string[];

    for (const allowed of configuredOrigins) {
      if (allowed === originHost || allowed === origin) {
        return true;
      }
    }

    return false;
  } catch {
    return false;
  }
}

/**
 * Strict Whitelist-Based CORS Configuration
 */
export const corsOptions: cors.CorsOptions = {
  origin: (origin, callback) => {
    // Allow non-browser requests (no origin header, e.g. server-to-server webhooks, mobile apps, curl)
    if (!origin) {
      return callback(null, true);
    }

    if (isAllowedOrigin(origin)) {
      return callback(null, true);
    }

    // Reject cross-origin requests from unauthorized origins
    return callback(new Error(`CORS blocked: Asal domain ${origin} tidak diizinkan oleh kebijakan keamanan Examigo.`));
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: [
    'Content-Type',
    'Authorization',
    'X-Requested-With',
    'Accept',
    'Origin',
    'X-CSRF-Token',
  ],
  exposedHeaders: [
    'Retry-After',
    'X-RateLimit-Limit',
    'X-RateLimit-Remaining',
    'X-RateLimit-Reset',
  ],
  credentials: true,
  maxAge: 86400, // 24 hours preflight cache to optimize performance
};

/**
 * Applies essential HTTP Security Headers without third-party overhead
 */
export function securityHeadersMiddleware(req: Request, res: Response, next: NextFunction) {
  // Prevent MIME-type sniffing
  res.setHeader('X-Content-Type-Options', 'nosniff');

  // Prevent Clickjacking in iframes
  res.setHeader('X-Frame-Options', 'SAMEORIGIN');

  // Enable legacy browser XSS filters
  res.setHeader('X-XSS-Protection', '1; mode=block');

  // Referrer Policy: Send full URL on same origin, only domain on cross origin
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');

  // Permissions Policy: Disable invasive sensor/hardware access
  res.setHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=(), payment=()');

  // Strip server stack info
  res.removeHeader('X-Powered-By');

  next();
}

/**
 * CSRF Protection Middleware for state-changing requests (POST, PUT, PATCH, DELETE)
 */
export function csrfProtectionMiddleware(req: Request, res: Response, next: NextFunction) {
  const method = req.method.toUpperCase();

  // Safe read-only HTTP methods do not change state
  if (['GET', 'HEAD', 'OPTIONS'].includes(method)) {
    return next();
  }

  const reqPath = req.baseUrl ? `${req.baseUrl}${req.path}` : req.path;

  // Exempt external server-to-server webhooks (Midtrans notifications)
  if (
    reqPath.startsWith('/api/payments/midtrans-webhook') ||
    reqPath.startsWith('/api/payments/notification') ||
    reqPath.startsWith('/api/payments/pakasir-webhook') ||
    reqPath.startsWith('/uploads')
  ) {
    return next();
  }

  // If request contains Bearer token in Authorization header,
  // it is intrinsically protected from classical browser CSRF (HTML forms cannot set custom headers).
  const authHeader = req.headers['authorization'];
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return next();
  }

  // Check Sec-Fetch-Site browser security header
  const secFetchSite = req.headers['sec-fetch-site'];
  if (secFetchSite === 'cross-site') {
    return res.status(403).json({
      success: false,
      message: 'Akses Ditolak: Permintaan lintas situs tidak sah (CSRF cross-site blocked).',
    });
  }

  // Check Origin or Referer header for browser requests
  const origin = req.headers['origin'] || req.headers['referer'];
  if (!origin) {
    // Non-browser clients (e.g. native mobile app, curl, server) with valid API access
    return next();
  }

  const allowed = isAllowedOrigin(String(origin));
  if (!allowed) {
    return res.status(403).json({
      success: false,
      message: 'Akses Ditolak: Pelanggaran Kebijakan Keamanan Cross-Site (CSRF Forbidden).',
    });
  }

  next();
}
