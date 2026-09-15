import type { Request, Response } from "express";
import { AppError } from "../shared/app-error.js";
import { ProductosService } from "./productos.service.js";

export class ProductosController {
  constructor(private readonly service: ProductosService) {}

  listar = (req: Request, res: Response): void => {
    try {
      const page = req.query.page === undefined ? undefined : Number(req.query.page);
      const limit = req.query.limit === undefined ? undefined : Number(req.query.limit);
      const productos = this.service.listar({ page, limit });
      res.status(200).json({ data: productos });
    } catch (error) {
      if (error instanceof AppError) {
        res.status(error.status).json({ error: { code: error.code, message: error.message } });
        return;
      }

      res.status(500).json({ error: { code: "INTERNAL_ERROR", message: "Error interno" } });
    }
  };
}
