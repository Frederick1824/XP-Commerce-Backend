import type { NextFunction, Request, Response } from 'express';
import { AppError } from '../errors/app-error.js';

function containsSuspiciousKey(value: unknown): boolean {
  if (Array.isArray(value)) return value.some(containsSuspiciousKey);
  if (typeof value !== 'object' || value === null) return false;

  return Object.entries(value).some(([key, nested]) => {
    if (key.startsWith('$') || key.includes('.')) return true;
    return containsSuspiciousKey(nested);
  });
}

export function sanitizeInput(
  request: Request,
  _response: Response,
  next: NextFunction
): void {
  if (containsSuspiciousKey(request.body)) {
    next(
      new AppError(
        400,
        'INVALID_INPUT',
        'Se detectaron claves no permitidas'
      )
    );
    return;
  }

  next();
}
