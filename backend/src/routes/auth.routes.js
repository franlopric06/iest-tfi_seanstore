import { Router } from "express";
import { ingresar } from "../controllers/auth.controller.js";
import limiteIngreso from "../middleware/limiteIngreso.js";

const auth = Router();

auth.post("/auth/ingresar", limiteIngreso, ingresar);

export default auth;
