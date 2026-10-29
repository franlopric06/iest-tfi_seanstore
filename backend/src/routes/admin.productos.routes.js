import { Router } from "express";
import { listarProductosAdmin } from "../controllers/admin.productos.controller.js";

const adminProductos = Router();

adminProductos.get("/productos", listarProductosAdmin);

export default adminProductos;
