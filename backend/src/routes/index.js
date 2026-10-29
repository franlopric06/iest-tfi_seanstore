import { Router } from "express";
import salud from "./salud.routes.js";
import categorias from "./categorias.routes.js";
import productos from "./productos.routes.js";
import auth from "./auth.routes.js";
import taller from "./taller.routes.js";
import admin from "./admin.routes.js";

const rutas = Router();

rutas.use(salud);
rutas.use(categorias);
rutas.use(productos);
rutas.use(auth);
rutas.use(taller);
rutas.use("/admin", admin);

export default rutas;
