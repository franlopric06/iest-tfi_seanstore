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

export const listarProductosAdmin = async (_req, res, next) => {
  try {
    const { rows } = await consulta(SQL_LISTAR_PRODUCTOS, []);
    res.json(rows);
  } catch (error) {
    next(error);
  }
};
