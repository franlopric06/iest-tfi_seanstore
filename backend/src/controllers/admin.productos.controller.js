import { consulta } from "../db/conexion.js";

const SQL_LISTAR_PRODUCTOS = `
  SELECT
    p.id,
    p.codigo,
    p.slug,
    p.nombre,
    json_build_object('slug', c.slug, 'nombre', c.nombre) AS categoria,
    p.precio,
    p.stock,
    p.destacado,
    p.activo,
    CASE WHEN f.url IS NULL THEN NULL
         ELSE json_build_object('url', f.url, 'alt', f.alt, 'generada_con_ia', f.generada_con_ia)
    END AS foto
  FROM productos p
  JOIN categorias c ON c.id = p.categoria_id
  LEFT JOIN producto_fotos f ON f.producto_id = p.id AND f.orden = 1
  ORDER BY c.orden, p.nombre
`;

const SQL_EDICION_RAPIDA = `
  UPDATE productos
  SET precio = $1, stock = $2, destacado = $3
  WHERE id = $4
  RETURNING id, codigo, slug, nombre, precio, stock, destacado, activo
`;

export const listarProductosAdmin = async (_req, res, next) => {
  try {
    const { rows } = await consulta(SQL_LISTAR_PRODUCTOS, []);
    res.json(rows);
  } catch (error) {
    next(error);
  }
};

export const editarRapidoProducto = async (req, res, next) => {
  const { id } = req.params;
  const datos = req.body;
  const campos = ["precio", "stock", "destacado"];
  const idValido = /^[1-9]\d*$/.test(id) && Number.isSafeInteger(Number(id));
  const cuerpoValido =
    datos &&
    typeof datos === "object" &&
    !Array.isArray(datos) &&
    Object.keys(datos).length === campos.length &&
    campos.every((campo) => Object.hasOwn(datos, campo));

  if (
    !idValido ||
    !cuerpoValido ||
    typeof datos.precio !== "number" ||
    !Number.isFinite(datos.precio) ||
    datos.precio < 0 ||
    !Number.isInteger(datos.stock) ||
    datos.stock < 0 ||
    typeof datos.destacado !== "boolean"
  ) {
    res.status(400).json({ error: "Los datos de edición rápida no son válidos." });
    return;
  }

  try {
    const { rows } = await consulta(SQL_EDICION_RAPIDA, [
      datos.precio,
      datos.stock,
      datos.destacado,
      id,
    ]);

    if (rows.length === 0) {
      res.status(404).json({ error: "No encontramos este producto." });
      return;
    }

    res.json(rows[0]);
  } catch (error) {
    next(error);
  }
};
