import { Router } from 'express';
import type { AuthService } from '../auth/auth.service.js';
import {
  requireAuth,
  requireOwnerOrAdmin
} from '../auth/auth.middleware.js';
import type { CarritoService } from './carrito.service.js';
import { CarritoController } from './carrito.controller.js';

export function crearCarritoSeguroRouter(
  carritoService: CarritoService,
  authService: AuthService
): Router {
  const router = Router();
  const controller = new CarritoController(carritoService);

  router.use(requireAuth(authService));
  router.use('/:clienteId', requireOwnerOrAdmin('clienteId'));

  router.get('/:clienteId', controller.obtener);
  router.post('/:clienteId/items', controller.agregarItem);
  router.patch('/:clienteId/items/:productoId', controller.modificarCantidad);
  router.delete('/:clienteId/items/:productoId', controller.eliminarItem);

  return router;
}
