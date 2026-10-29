import { Router } from "express";
import { editarTaller, reemplazarFotoTaller } from "../controllers/admin.taller.controller.js";
import subirImagen from "../middleware/subirImagen.js";

const adminTaller = Router();

adminTaller.patch("/taller", editarTaller);
adminTaller.put("/taller/fotos/:numero", subirImagen, reemplazarFotoTaller);

export default adminTaller;
