import { Router } from 'express';
import { ProductosController } from './productos.controller.js';
import type { ProductosService } from './productos.service.js';

export function crearProductosRouter(
  service: ProductosService
): Router {
  const router = Router();
  const controller = new ProductosController(service);

  router.get('/', controller.listar);

  return router;
}
