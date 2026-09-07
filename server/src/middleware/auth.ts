import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export interface AuthPayload {
  id: string;
  email: string;
  role: string;
}

declare global {
  namespace Express {
    interface Request {
      user?: AuthPayload;
    }
  }
}

export const JWT_SECRET = process.env.JWT_SECRET || 'examigo-secret-key-2026-super-secure';

if (process.env.NODE_ENV === 'production' && (!process.env.JWT_SECRET || process.env.JWT_SECRET.includes('super-secure'))) {
  console.error('⚠️ [SECURITY CRITICAL] JWT_SECRET tidak aman atau menggunakan nilai bawaan di lingkungan produksi! Mohon tentukan string acak unik pada server/.env');
}

export function signToken(payload: AuthPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
}

export function authenticateToken(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers['authorization'];
  const token = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : null;

  if (!token) {
    return res.status(401).json({ success: false, message: 'Token otentikasi tidak ditemukan' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as AuthPayload;
    req.user = decoded;
    next();
  } catch {
    return res.status(403).json({ success: false, message: 'Token otentikasi tidak valid atau sudah kadaluarsa' });
  }
}

/**
 * Optional authentication middleware: attaches req.user if valid token provided, but doesn't block if missing
 */
export function optionalAuthenticateToken(req: Request, _res: Response, next: NextFunction) {
  const authHeader = req.headers['authorization'];
  const token = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : null;

  if (token) {
    try {
      const decoded = jwt.verify(token, JWT_SECRET) as AuthPayload;
      req.user = decoded;
    } catch {
      // Ignore invalid optional token
    }
  }
  next();
}

export function requireAdmin(req: Request, res: Response, next: NextFunction) {
  authenticateToken(req, res, () => {
    if (req.user?.role !== 'ADMIN') {
      return res.status(403).json({ success: false, message: 'Akses ditolak: Hanya Super Admin yang diizinkan' });
    }
    next();
  });
}

export function requireRole(allowedRoles: string[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    authenticateToken(req, res, () => {
      if (!req.user || !allowedRoles.includes(req.user.role)) {
        return res.status(403).json({
          success: false,
          message: `Akses ditolak: Peran akun Anda (${req.user?.role || 'tidak dikenal'}) tidak memiliki hak akses.`,
        });
      }
      next();
    });
  };
}
