import { Router } from "express";
import salud from "./salud.routes.js";

const rutas = Router();

rutas.use(salud);

export default rutas;
