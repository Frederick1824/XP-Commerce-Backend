import type { Request, Response } from 'express';
import { AppError } from '../shared/errors/app-error.js';
import { parsePositiveInt } from '../shared/http/parse-positive-int.js';
import type { CarritoService } from './carrito.service.js';
import type { AgregarItemDto } from './carrito.types.js';

export class CarritoController {
  constructor(private readonly carritoService: CarritoService) {}

  obtener = (request: Request, response: Response): void => {
    const clienteId = parsePositiveInt(request.params.clienteId, 'clienteId');
    const carrito = this.carritoService.obtenerCarrito(clienteId);
    response.status(200).json({ data: carrito });
  };

  agregarItem = (request: Request, response: Response): void => {
    const clienteId = parsePositiveInt(request.params.clienteId, 'clienteId');
    const dto = this.validarAgregarItem(request.body);
    const { carrito, itemCreado } = this.carritoService.agregarItem(clienteId, dto);

    const status = itemCreado ? 201 : 200;
    response.status(status).json({ data: carrito });
  };

  private validarAgregarItem(body: unknown): AgregarItemDto {
    if (typeof body !== 'object' || body === null) {
      throw new AppError(400, 'INVALID_BODY', 'El cuerpo debe ser un objeto JSON');
    }
    const obj = body as Record<string, unknown>;
    const productoId = obj.productoId;
    const cantidad = obj.cantidad;

    if (
      typeof productoId !== 'number' ||
      !Number.isInteger(productoId) ||
      productoId <= 0
    ) {
      throw new AppError(422, 'INVALID_PRODUCT_ID', 'El productoId no es valido');
    }
    if (
      typeof cantidad !== 'number' ||
      !Number.isInteger(cantidad) ||
      cantidad <= 0
    ) {
      throw new AppError(
        422,
        'INVALID_QUANTITY',
        'La cantidad debe ser un entero positivo'
      );
    }

    return { productoId, cantidad };
  }
}