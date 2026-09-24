import { AppError } from '../errors/app-error.js';

export function parsePositiveInt(value: unknown, field: string): number {
  if (typeof value !== 'string') {
    throw new AppError(400, 'INVALID_PARAM', `El parametro ${field} no es valido`);
  }

  const num = Number(value);
  if (!Number.isInteger(num) || num <= 0) {
    throw new AppError(400, 'INVALID_PARAM', `El parametro ${field} no es valido`);
  }

  return num;
}