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

// export function xssSanitizer(req: Request, res: Response, next: NextFunction) {
//   if (req.body) req.body = sanitizeInput(req.body);
//   if (req.query) req.query = sanitizeInput(req.query);
//   if (req.params) req.params = sanitizeInput(req.params);
//   next();
// }



export const xssSanitizer = (req: Request, _res: Response, next: NextFunction) => {
  if (req.body) {
    // Don't modify headers or response objects
    // Only sanitize the body content
    for (const [key, value] of Object.entries(req.body)) {
      if (typeof value === 'string') {
        req.body[key] = xss(value);
      }
    }
  }
  
  // Don't modify query parameters that might be needed for CORS
  next();
};
