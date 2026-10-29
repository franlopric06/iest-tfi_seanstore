import { consulta } from "../db/conexion.js";
import { armarRespuesta } from "./taller.controller.js";
import { validarAlt, validarImagen } from "../validaciones/imagen.js";
import {
  almacenamientoConfigurado,
  borrarFoto,
  subirFoto,
} from "../services/almacenamiento.js";

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

// Cambiar una de las dos fotos del taller (004-T40). Primero se sube la nueva
// y se guarda en la base; recién después se intenta borrar la anterior, y solo
// si estaba en Blob. Si esa limpieza falla, la foto nueva queda igual.
const SQL_FOTO_ANTERIOR = {
  1: "SELECT foto_1_url AS url FROM contenido_taller WHERE id = 1",
  2: "SELECT foto_2_url AS url FROM contenido_taller WHERE id = 1",
};
const SQL_GUARDAR_FOTO = {
  1: `UPDATE contenido_taller SET foto_1_url = $1, foto_1_alt = $2, actualizado_en = NOW()
      WHERE id = 1 RETURNING titulo, parrafo, foto_1_url, foto_1_alt, foto_2_url, foto_2_alt`,
  2: `UPDATE contenido_taller SET foto_2_url = $1, foto_2_alt = $2, actualizado_en = NOW()
      WHERE id = 1 RETURNING titulo, parrafo, foto_1_url, foto_1_alt, foto_2_url, foto_2_alt`,
};

export const reemplazarFotoTaller = async (req, res, next) => {
  const numero = req.params.numero;
  const imagen = validarImagen(req.file);
  const errorAlt = validarAlt(req.body?.alt);

  if (!SQL_GUARDAR_FOTO[numero] || imagen.error || errorAlt) {
    res.status(400).json({ error: imagen.error ?? errorAlt ?? "La foto del taller no es válida." });
    return;
  }
  if (!almacenamientoConfigurado()) {
    res.status(503).json({ error: "La subida de fotos todavía no está configurada." });
    return;
  }

  let urlNueva = null;
  try {
    const anterior = await consulta(SQL_FOTO_ANTERIOR[numero], []);
    if (anterior.rows.length === 0) {
      res.status(404).json({ error: "Todavía no cargamos el contenido del taller." });
      return;
    }

    urlNueva = await subirFoto("taller", req.file.buffer, imagen.tipo);
    const { rows } = await consulta(SQL_GUARDAR_FOTO[numero], [urlNueva, req.body.alt.trim()]);
    urlNueva = null; // ya quedó guardada: no se borra aunque falle lo que sigue

    await borrarFoto(anterior.rows[0].url).catch((error) => {
      console.error("No se pudo borrar la foto anterior del taller", error);
    });
    res.json(armarRespuesta(rows[0]));
  } catch (error) {
    if (urlNueva) await borrarFoto(urlNueva).catch(() => {});
    next(error);
  }
};
