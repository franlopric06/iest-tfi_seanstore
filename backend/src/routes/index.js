import { Router } from "express";
import salud from "./salud.routes.js";
import categorias from "./categorias.routes.js";

const rutas = Router();

rutas.use(salud);
rutas.use(categorias);

export default rutas;
