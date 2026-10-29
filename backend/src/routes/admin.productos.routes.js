import { Router } from "express";
import {
  crearProducto,
  editarRapidoProducto,
  listarProductosAdmin,
} from "../controllers/admin.productos.controller.js";

const adminProductos = Router();

adminProductos.get("/productos", listarProductosAdmin);
adminProductos.post("/productos", crearProducto);
adminProductos.patch(
  "/productos/:id/edicion-rapida",
  editarRapidoProducto,
);

export default adminProductos;
