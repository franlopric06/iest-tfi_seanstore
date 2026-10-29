import { Router } from "express";
import salud from "./salud.routes.js";
import categorias from "./categorias.routes.js";
import productos from "./productos.routes.js";
import auth from "./auth.routes.js";

const rutas = Router();

rutas.use(salud);
rutas.use(categorias);
rutas.use(productos);
rutas.use(auth);

export default rutas;
