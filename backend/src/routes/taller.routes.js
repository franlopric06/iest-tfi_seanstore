import { Router } from "express";
import { obtenerTaller } from "../controllers/taller.controller.js";

const taller = Router();

taller.get("/taller", obtenerTaller);

export default taller;
