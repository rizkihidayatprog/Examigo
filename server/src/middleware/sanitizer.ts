import { Request, Response, NextFunction } from 'express';

// Regular expressions to detect and neutralize malicious payload vectors
const SCRIPT_TAG_REGEX = /<\s*script[^>]*>[\s\S]*?<\s*\/\s*script\s*>/gi;
const DANGEROUS_TAGS_REGEX = /<\s*(iframe|embed|object|base|link|meta)[^>]*>/gi;
const INLINE_EVENT_REGEX = /\bon\w+\s*=\s*(?:'[^']*'|"[^"]*"|[^\s>]+)/gi;
const JAVASCRIPT_PROTOCOL_REGEX = /javascript\s*:\s*/gi;
const DATA_HTML_REGEX = /data\s*:\s*text\/html/gi;

/**
 * Deep sanitization for strings to prevent XSS and injection
 */
export function sanitizeString(val: string): string {
  if (typeof val !== 'string') return val;

  let cleaned = val
    .replace(SCRIPT_TAG_REGEX, '')
    .replace(DANGEROUS_TAGS_REGEX, '')
    .replace(INLINE_EVENT_REGEX, '')
    .replace(JAVASCRIPT_PROTOCOL_REGEX, '')
    .replace(DATA_HTML_REGEX, '');

  return cleaned;
}

/**
 * Recursively traverse objects/arrays and sanitize all string values
 */
export function sanitizeDeep(target: any): any {
  if (target === null || target === undefined) return target;

  if (typeof target === 'string') {
    return sanitizeString(target);
  }

  if (Array.isArray(target)) {
    return target.map((item) => sanitizeDeep(item));
  }

  if (typeof target === 'object' && !(target instanceof Date)) {
    const cleanObj: Record<string, any> = {};
    for (const [key, value] of Object.entries(target)) {
      // Don't modify raw passwords or binary data
      if (key === 'password' || key === 'currentPassword' || key === 'newPassword') {
        cleanObj[key] = value;
      } else {
        cleanObj[key] = sanitizeDeep(value);
      }
    }
    return cleanObj;
  }

  return target;
}

/**
 * Express middleware to sanitize req.body, req.query, and req.params
 */
export function sanitizeMiddleware(req: Request, _res: Response, next: NextFunction) {
  if (req.body && typeof req.body === 'object') {
    req.body = sanitizeDeep(req.body);
  }
  if (req.query && typeof req.query === 'object') {
    req.query = sanitizeDeep(req.query);
  }
  if (req.params && typeof req.params === 'object') {
    req.params = sanitizeDeep(req.params);
  }
  next();
}
