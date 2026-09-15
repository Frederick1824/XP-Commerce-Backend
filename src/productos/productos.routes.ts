import { Router } from "express";
import { ProductosController } from "./productos.controller.js";
import { ProductosRepository } from "./productos.repository.js";
import { ProductosService } from "./productos.service.js";

const repository = new ProductosRepository();
const service = new ProductosService(repository);
const controller = new ProductosController(service);

export const productosRouter = Router();
productosRouter.get("/", controller.listar);
