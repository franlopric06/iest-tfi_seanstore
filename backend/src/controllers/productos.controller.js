import { consulta } from "../db/conexion.js";

const CAMPOS = `
  p.codigo, p.slug, p.nombre,
  json_build_object('slug', c.slug, 'nombre', c.nombre) AS categoria,
  p.talles, p.colores, p.precio, p.stock,
  CASE WHEN f.url IS NULL THEN NULL
       ELSE json_build_object('url', f.url, 'alt', f.alt, 'generada_con_ia', f.generada_con_ia)
  END AS foto
`;

const BASE = `
  FROM productos p
  JOIN categorias c ON c.id = p.categoria_id
  LEFT JOIN producto_fotos f ON f.producto_id = p.id AND f.orden = 1
`;

const TODAS_LAS_FOTOS = `
  (SELECT COALESCE(
    json_agg(
      json_build_object('url', g.url, 'alt', g.alt, 'generada_con_ia', g.generada_con_ia, 'orden', g.orden)
      ORDER BY g.orden
    ), '[]'::json)
   FROM producto_fotos g
   WHERE g.producto_id = p.id) AS fotos
`;

export const listarProductos = async (req, res) => {
  const { categoria, destacados } = req.query;
  const condiciones = ["p.activo = TRUE"];
  const parametros = [];

  if (categoria) {
    parametros.push(categoria);
    condiciones.push(`c.slug = $${parametros.length}`);
  }
  if (destacados === "1") {
    condiciones.push("p.destacado = TRUE");
  }

  let sql = `SELECT ${CAMPOS} ${BASE} WHERE ${condiciones.join(" AND ")}`;

  if (destacados === "1") {
    sql += " ORDER BY p.id LIMIT 4";
  } else {
    sql += " ORDER BY c.orden, p.nombre";
  }

  const { rows } = await consulta(sql, parametros);
  res.json(rows);
};

export const obtenerProducto = async (req, res) => {
  const { slug } = req.params;

  const sql = `
    SELECT ${CAMPOS}, p.descripcion, ${TODAS_LAS_FOTOS} ${BASE}
    WHERE p.activo = TRUE AND p.slug = $1
  `;

  const { rows } = await consulta(sql, [slug]);

  if (rows.length === 0) {
    return res.status(404).json({ error: "No encontramos este producto." });
  }

  res.json(rows[0]);
};
