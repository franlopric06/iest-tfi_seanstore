import { Router } from "express";
import {
  cambiarEstadoProducto,
  crearProducto,
  editarProducto,
  editarRapidoProducto,
  listarProductosAdmin,
} from "../controllers/admin.productos.controller.js";

const adminProductos = Router();

adminProductos.get("/productos", listarProductosAdmin);
adminProductos.post("/productos", crearProducto);
adminProductos.patch("/productos/:id", editarProducto);
adminProductos.patch(
  "/productos/:id/edicion-rapida",
  editarRapidoProducto,
);
adminProductos.patch("/productos/:id/estado", cambiarEstadoProducto);

export default adminProductos;
