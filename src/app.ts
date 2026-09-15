import express from "express";
import { productosRouter } from "./productos/productos.routes.js";

export const app = express();

app.use(express.json());
app.use("/api/v1/productos", productosRouter);
