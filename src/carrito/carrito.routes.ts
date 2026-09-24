import { Router } from 'express';
import type { CarritoService } from './carrito.service.js';
import { CarritoController } from './carrito.controller.js';

export function crearCarritoRouter(service: CarritoService): Router {
  const router = Router();
  const controller = new CarritoController(service);

  router.get('/:clienteId', controller.obtener);
  router.post('/:clienteId/items', controller.agregarItem);

  return router;
}