import { Router } from "express";
import estadoSalud from "../controllers/salud.controller.js";

const salud = Router();

salud.get("/salud", estadoSalud);

export default salud;
