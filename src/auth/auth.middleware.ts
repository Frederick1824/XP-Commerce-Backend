import type { NextFunction, Request, Response } from 'express';
import { AppError } from '../shared/errors/app-error.js';
import type { AuthService } from './auth.service.js';
import type { AuthTokenPayload, Role } from './auth.types.js';

export type AuthenticatedRequest = Request & { auth?: AuthTokenPayload };

export function requireAuth(authService: AuthService) {
  return (request: Request, _response: Response, next: NextFunction): void => {
    const header = request.headers.authorization;
    const token = header?.startsWith('Bearer ') ? header.slice(7) : undefined;

    if (!token) {
      next(new AppError(401, 'AUTH_REQUIRED', 'Acceso denegado. Falta token'));
      return;
    }

    try {
      (request as AuthenticatedRequest).auth = authService.verifyAccessToken(token);
      next();
    } catch (error) {
      next(error);
    }
  };
}

export function requireRole(roles: Role[]) {
  return (request: Request, _response: Response, next: NextFunction): void => {
    const auth = (request as AuthenticatedRequest).auth;

    if (!auth || !roles.includes(auth.role)) {
      next(new AppError(403, 'FORBIDDEN', 'No tienes los permisos necesarios'));
      return;
    }

    next();
  };
}

export function requireOwnerOrAdmin(paramName = 'clienteId') {
  return (request: Request, _response: Response, next: NextFunction): void => {
    const auth = (request as AuthenticatedRequest).auth;
    const ownerId = Number(request.params[paramName]);

    if (!auth) {
      next(new AppError(401, 'AUTH_REQUIRED', 'Acceso denegado'));
      return;
    }

    if (auth.role !== 'ADMIN' && auth.sub !== ownerId) {
      next(
        new AppError(
          403,
          'RESOURCE_FORBIDDEN',
          'No puedes acceder a un recurso de otro usuario'
        )
      );
      return;
    }

    next();
  };
}
