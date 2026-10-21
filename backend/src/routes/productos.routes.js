import { Router } from "express";
import { listarProductos, obtenerProducto } from "../controllers/productos.controller.js";

const productos = Router();

productos.get("/productos", listarProductos);
productos.get("/productos/:slug", obtenerProducto);

export default productos;
