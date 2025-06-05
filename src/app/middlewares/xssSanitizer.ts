import xss from 'xss';
import { Request, Response, NextFunction } from 'express';

function sanitizeInput(obj: any): any {
  const sanitized: any = {};

  for (const key in obj) {
    if (typeof obj[key] === 'string') {
      sanitized[key] = xss(obj[key]); // sanitize strings only
    } else if (typeof obj[key] === 'object' && obj[key] !== null) {
      sanitized[key] = sanitizeInput(obj[key]); // recurse nested objects
    } else {
      sanitized[key] = obj[key]; // leave other types unchanged
    }
  }

  return sanitized;
}

export function xssSanitizer(req: Request, res: Response, next: NextFunction) {
  if (req.body) req.body = sanitizeInput(req.body);
  if (req.query) req.query = sanitizeInput(req.query);
  if (req.params) req.params = sanitizeInput(req.params);
  next();
}
