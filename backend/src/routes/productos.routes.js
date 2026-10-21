import { Router } from "express";
import listarProductos from "../controllers/productos.controller.js";

const productos = Router();

productos.get("/productos", listarProductos);

export default productos;
