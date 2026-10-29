import { Router } from "express";
import {
  borrarFotoProducto,
  elegirPrincipal,
  listarFotos,
  subirFotoProducto,
} from "../controllers/admin.fotos.controller.js";
import subirImagen from "../middleware/subirImagen.js";

const adminFotos = Router();

adminFotos.get("/productos/:id/fotos", listarFotos);
adminFotos.post("/productos/:id/fotos", subirImagen, subirFotoProducto);
adminFotos.delete("/fotos/:fotoId", borrarFotoProducto);
adminFotos.patch("/fotos/:fotoId/principal", elegirPrincipal);

export default adminFotos;
