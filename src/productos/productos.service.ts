import { AppError } from "../shared/app-error.js";
import { ProductosRepository } from "./productos.repository.js";
import type { ListarProductosQuery, Producto } from "./productos.types.js";

export class ProductosService {
  constructor(private readonly repository: ProductosRepository) {}

  listar(query: ListarProductosQuery = {}): Producto[] {
    const page = query.page ?? 1;
    const limit = query.limit ?? 20;

    if (!Number.isInteger(page) || page < 1) {
      throw new AppError(400, "INVALID_PARAM", "page debe ser un entero positivo");
    }

    if (!Number.isInteger(limit) || limit < 1 || limit > 100) {
      throw new AppError(400, "INVALID_PARAM", "limit debe estar entre 1 y 100");
    }

    const inicio = (page - 1) * limit;
    return this.repository.listar().slice(inicio, inicio + limit);
  }
}
