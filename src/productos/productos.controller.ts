import type { Request, Response } from 'express';
import type { ProductosService } from './productos.service.js';

export class ProductosController {
  constructor(private readonly service: ProductosService) {}

  listar = (request: Request, response: Response): void => {
    const page =
      request.query.page === undefined
        ? undefined
        : Number(request.query.page);

    const limit =
      request.query.limit === undefined
        ? undefined
        : Number(request.query.limit);

    const productos = this.service.listar({ page, limit });
    response.status(200).json({ data: productos });
  };
}
