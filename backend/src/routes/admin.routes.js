import { Router } from "express";
import requiereAdmin from "../middleware/requiereAdmin.js";
import adminProductos from "./admin.productos.routes.js";

const admin = Router();

admin.use(requiereAdmin);
admin.use(adminProductos);

export default admin;
