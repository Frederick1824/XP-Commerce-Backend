import express, { type Express } from 'express';
import cors from 'cors';
import { ProductosRepository } from './productos/productos.repository.js';
import { CarritoRepository } from './carrito/carrito.repository.js';
import { CarritoService } from './carrito/carrito.service.js';
import { crearCarritoRouter } from './carrito/carrito.routes.js';
import { crearCarritoSeguroRouter } from './carrito/carrito-secure.routes.js';
import { AuthRepository } from './auth/auth.repository.js';
import { AuthService } from './auth/auth.service.js';
import { crearAuthRouter } from './auth/auth.routes.js';
import { sanitizeInput } from './shared/middlewares/sanitize-input.js';
import { errorHandler } from './shared/middlewares/error-handler.js';
import { notFound } from './shared/middlewares/not-found.js';

export type AppDependencies = {
  productosRepository: ProductosRepository;
  carritoRepository: CarritoRepository;
  carritoService: CarritoService;
  authRepository: AuthRepository;
  authService: AuthService;
};

export function buildDependencies(): AppDependencies {
  const productosRepository = new ProductosRepository();
  const carritoRepository = new CarritoRepository();
  const carritoService = new CarritoService(
    carritoRepository,
    productosRepository
  );

  const authRepository = new AuthRepository();
  const authService = new AuthService(authRepository);

  return {
    productosRepository,
    carritoRepository,
    carritoService,
    authRepository,
    authService
  };
}

export function createApp(deps: AppDependencies): Express {
  const app = express();

  const allowedOrigins = (
    process.env.CORS_ORIGINS ?? 'http://localhost:5173'
  )
    .split(',')
    .map((origin) => origin.trim());

  app.use(cors({ origin: allowedOrigins }));
  app.use(express.json({ limit: '10kb' }));
  app.use(sanitizeInput);

  app.use('/api/auth', crearAuthRouter(deps.authService));

  app.use('/api/v1/carrito', crearCarritoRouter(deps.carritoService));

  app.use(
    '/api/v1/secure/carrito',
    crearCarritoSeguroRouter(deps.carritoService, deps.authService)
  );

  app.use(notFound);
  app.use(errorHandler);

  return app;
}
