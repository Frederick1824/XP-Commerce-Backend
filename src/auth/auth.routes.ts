import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import type { AuthService } from './auth.service.js';
import { AuthController } from './auth.controller.js';
import { requireAuth, requireRole } from './auth.middleware.js';

export function crearAuthRouter(service: AuthService): Router {
  const router = Router();
  const controller = new AuthController(service);

  const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 5,
    standardHeaders: true,
    legacyHeaders: false,
    message: {
      error: {
        code: 'RATE_LIMITED',
        message: 'Demasiados intentos de inicio de sesion. Intenta mas tarde.'
      }
    }
  });

  router.post('/register', controller.register);
  router.post('/login', loginLimiter, controller.login);
  router.post('/refresh', controller.refresh);

  router.get('/profile', requireAuth(service), controller.perfil);
  router.get(
    '/admin/users',
    requireAuth(service),
    requireRole(['ADMIN']),
    controller.usuarios
  );

  return router;
}
