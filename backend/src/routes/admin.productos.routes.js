import { Router } from "express";
import {
  editarRapidoProducto,
  listarProductosAdmin,
} from "../controllers/admin.productos.controller.js";

const adminProductos = Router();

adminProductos.get("/productos", listarProductosAdmin);
adminProductos.patch(
  "/productos/:id/edicion-rapida",
  editarRapidoProducto,
);

export default adminProductos;
