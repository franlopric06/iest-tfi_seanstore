import { Router } from "express";
import listarCategorias from "../controllers/categorias.controller.js";

const categorias = Router();

categorias.get("/categorias", listarCategorias);

export default categorias;
