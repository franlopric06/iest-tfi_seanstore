import { Router } from "express";
import requiereAdmin from "../middleware/requiereAdmin.js";
import adminProductos from "./admin.productos.routes.js";
import adminTaller from "./admin.taller.routes.js";
import adminFotos from "./admin.fotos.routes.js";

const admin = Router();

admin.use(requiereAdmin);
admin.use(adminProductos);
admin.use(adminTaller);
admin.use(adminFotos);

export default admin;
