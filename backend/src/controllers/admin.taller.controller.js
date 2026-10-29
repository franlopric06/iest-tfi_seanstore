import { consulta } from "../db/conexion.js";
import { armarRespuesta } from "./taller.controller.js";

const SQL_EDICION = `
  UPDATE contenido_taller
  SET titulo = $1, parrafo = $2, actualizado_en = NOW()
  WHERE id = 1
  RETURNING titulo, parrafo, foto_1_url, foto_1_alt, foto_2_url, foto_2_alt
`;

const LIMITE_TITULO = 120;

const esTextoValido = (texto) => typeof texto === "string" && texto.trim().length > 0;

const datosValidos = (datos) =>
  datos &&
  typeof datos === "object" &&
  !Array.isArray(datos) &&
  Object.hasOwn(datos, "titulo") &&
  Object.hasOwn(datos, "parrafo") &&
  Object.keys(datos).length === 2 &&
  esTextoValido(datos.titulo) &&
  datos.titulo.trim().length <= LIMITE_TITULO &&
  esTextoValido(datos.parrafo);

export const editarTaller = async (req, res, next) => {
  if (!datosValidos(req.body)) {
    res
      .status(400)
      .json({ error: "El título y el párrafo son obligatorios y el título no puede pasar los 120 caracteres." });
    return;
  }

  try {
    const { rows } = await consulta(SQL_EDICION, [
      req.body.titulo.trim(),
      req.body.parrafo.trim(),
    ]);

    if (rows.length === 0) {
      res.status(404).json({ error: "Todavía no cargamos el contenido del taller." });
      return;
    }

    res.json(armarRespuesta(rows[0]));
  } catch (error) {
    next(error);
  }
};
