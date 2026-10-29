import { Router } from "express";
import { editarTaller } from "../controllers/admin.taller.controller.js";

const adminTaller = Router();

adminTaller.patch("/taller", editarTaller);

export default adminTaller;
