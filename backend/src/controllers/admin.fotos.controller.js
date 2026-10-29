import { consulta } from "../db/conexion.js";
import { validarAlt, validarImagen } from "../validaciones/imagen.js";
import {
  almacenamientoConfigurado,
  borrarFoto,
  subirFoto,
} from "../services/almacenamiento.js";

// Fotos de cada producto desde el panel (004-T32 y T33): listar, subir,
// borrar y elegir la principal. La principal es la de orden 1: la que se ve
// en la tarjeta del catálogo y primera en la galería del detalle.

const SQL_LISTAR = `
  SELECT id, url, alt, generada_con_ia, orden
  FROM producto_fotos WHERE producto_id = $1 ORDER BY orden, id
`;
const SQL_EXISTE_PRODUCTO = "SELECT id FROM productos WHERE id = $1";
const SQL_INSERTAR = `
  INSERT INTO producto_fotos (producto_id, url, alt, generada_con_ia, orden)
  VALUES ($1, $2, $3, $4,
    (SELECT COALESCE(MAX(orden), 0) + 1 FROM producto_fotos WHERE producto_id = $1))
  RETURNING id, url, alt, generada_con_ia, orden
`;
const SQL_BUSCAR_FOTO = "SELECT id, producto_id, url FROM producto_fotos WHERE id = $1";
const SQL_BORRAR_FOTO = "DELETE FROM producto_fotos WHERE id = $1";

// Vuelve a numerar 1, 2, 3… sin huecos. Si se pasa una foto, queda primera.
const SQL_RENUMERAR = `
  WITH nuevo AS (
    SELECT id, ROW_NUMBER() OVER (ORDER BY COALESCE(id = $2, FALSE) DESC, orden, id) AS n
    FROM producto_fotos WHERE producto_id = $1
  )
  UPDATE producto_fotos f SET orden = nuevo.n FROM nuevo WHERE f.id = nuevo.id
`;

const esId = (valor) => /^[1-9]\d{0,9}$/.test(String(valor));

const listar = async (productoId) => (await consulta(SQL_LISTAR, [productoId])).rows;

export const listarFotos = async (req, res, next) => {
  if (!esId(req.params.id)) {
    res.status(400).json({ error: "El producto no es válido." });
    return;
  }
  try {
    res.json(await listar(req.params.id));
  } catch (error) {
    next(error);
  }
};

export const subirFotoProducto = async (req, res, next) => {
  const { id } = req.params;
  const imagen = validarImagen(req.file);
  const errorAlt = validarAlt(req.body?.alt);

  if (!esId(id) || imagen.error || errorAlt) {
    res.status(400).json({ error: imagen.error ?? errorAlt ?? "El producto no es válido." });
    return;
  }
  if (!almacenamientoConfigurado()) {
    res.status(503).json({ error: "La subida de fotos todavía no está configurada." });
    return;
  }

  let url = null;
  try {
    const producto = await consulta(SQL_EXISTE_PRODUCTO, [id]);
    if (producto.rows.length === 0) {
      res.status(404).json({ error: "No encontramos este producto." });
      return;
    }

    url = await subirFoto(`productos/${id}`, req.file.buffer, imagen.tipo);
    const generadaConIA = req.body.generada_con_ia === "true";
    const { rows } = await consulta(SQL_INSERTAR, [id, url, req.body.alt.trim(), generadaConIA]);
    res.status(201).json(rows[0]);
  } catch (error) {
    // Si la foto llegó a Blob pero no se pudo guardar en la base, se borra para no dejar basura.
    if (url) await borrarFoto(url).catch(() => {});
    next(error);
  }
};

export const borrarFotoProducto = async (req, res, next) => {
  if (!esId(req.params.fotoId)) {
    res.status(400).json({ error: "La foto no es válida." });
    return;
  }
  try {
    const { rows } = await consulta(SQL_BUSCAR_FOTO, [req.params.fotoId]);
    if (rows.length === 0) {
      res.status(404).json({ error: "No encontramos esta foto." });
      return;
    }
    const foto = rows[0];

    // Primero se borra el archivo: si falla, la fila queda y la foto se sigue viendo.
    try {
      await borrarFoto(foto.url);
    } catch {
      res.status(502).json({ error: "No pudimos borrar la foto, probá de nuevo." });
      return;
    }

    await consulta(SQL_BORRAR_FOTO, [foto.id]);
    await consulta(SQL_RENUMERAR, [foto.producto_id, null]);
    res.json(await listar(foto.producto_id));
  } catch (error) {
    next(error);
  }
};

export const elegirPrincipal = async (req, res, next) => {
  if (!esId(req.params.fotoId)) {
    res.status(400).json({ error: "La foto no es válida." });
    return;
  }
  try {
    const { rows } = await consulta(SQL_BUSCAR_FOTO, [req.params.fotoId]);
    if (rows.length === 0) {
      res.status(404).json({ error: "No encontramos esta foto." });
      return;
    }
    await consulta(SQL_RENUMERAR, [rows[0].producto_id, rows[0].id]);
    res.json(await listar(rows[0].producto_id));
  } catch (error) {
    next(error);
  }
};
