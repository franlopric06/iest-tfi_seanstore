import { consulta } from "../db/conexion.js";
import { validarProducto } from "../validaciones/producto.js";
import { generarCodigo, prefijoDeNombre } from "../utils/generarCodigo.js";
import { generarSlug } from "../utils/generarSlug.js";

const SQL_LISTAR_PRODUCTOS = `
  SELECT
    p.id,
    p.codigo,
    p.slug,
    p.nombre,
    p.categoria_id,
    json_build_object('slug', c.slug, 'nombre', c.nombre) AS categoria,
    p.precio,
    p.stock,
    p.descripcion,
    p.talles,
    p.colores,
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

const SQL_VERIFICAR_CATEGORIA = "SELECT id FROM categorias WHERE id = $1";

const SQL_CODIGOS_DEL_PREFIJO = `
  SELECT codigo FROM productos WHERE codigo LIKE $1
`;

const SQL_SLUGS_PARECIDOS = `
  SELECT slug FROM productos WHERE slug = $1 OR slug LIKE $2
`;

const SQL_INSERTAR_PRODUCTO = `
  INSERT INTO productos
    (codigo, slug, nombre, categoria_id, precio, stock, descripcion, talles, colores, destacado, activo)
  VALUES
    ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
  RETURNING id, codigo, slug, nombre, precio, stock, destacado, activo
`;

const esIdValido = (id) => /^[1-9]\d*$/.test(id) && Number.isSafeInteger(Number(id));

export const listarProductosAdmin = async (_req, res, next) => {
  try {
    const { rows } = await consulta(SQL_LISTAR_PRODUCTOS, []);
    res.json(rows);
  } catch (error) {
    next(error);
  }
};

export const crearProducto = async (req, res, next) => {
  const datos = req.body;
  const errores = validarProducto(datos);

  if (Object.keys(errores).length > 0) {
    res.status(400).json({ error: "Los datos del producto no son válidos." });
    return;
  }

  try {
    const categoria = await consulta(SQL_VERIFICAR_CATEGORIA, [datos.categoria_id]);
    if (categoria.rows.length === 0) {
      res.status(400).json({ error: "La categoría elegida no existe." });
      return;
    }

    const nombre = datos.nombre.trim();
    const descripcion = typeof datos.descripcion === "string" ? datos.descripcion.trim() : null;
    const activo = datos.activo ?? true;

    // Reintento acotado: si carrera con otra alta choca la restricción única,
    // se vuelven a generar código y slug para volver a intentar (máx. 3 veces).
    for (let intento = 1; intento <= 3; intento += 1) {
      const prefijo = `${prefijoDeNombre(nombre)}-%`;
      const codigos = await consulta(SQL_CODIGOS_DEL_PREFIJO, [prefijo]);
      const codigo = generarCodigo(
        nombre,
        codigos.rows.map((fila) => fila.codigo),
      );

      const base = generarSlug(nombre, []);
      const slugs = await consulta(SQL_SLUGS_PARECIDOS, [base, `${base}-%`]);
      const slug = generarSlug(
        nombre,
        slugs.rows.map((fila) => fila.slug),
      );

      try {
        const resultado = await consulta(SQL_INSERTAR_PRODUCTO, [
          codigo,
          slug,
          nombre,
          datos.categoria_id,
          datos.precio,
          datos.stock,
          descripcion,
          datos.talles,
          datos.colores,
          datos.destacado,
          activo,
        ]);
        res.status(201).json(resultado.rows[0]);
        return;
      } catch (error) {
        if (error?.code !== "23505" || intento === 3) {
          if (error?.code === "23505") {
            res.status(409).json({
              error: "No pudimos generar un código o slug único, probá de nuevo.",
            });
            return;
          }
          throw error;
        }
      }
    }
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

const CAMPOS_EDICION = [
  "nombre",
  "categoria_id",
  "precio",
  "stock",
  "descripcion",
  "talles",
  "colores",
  "destacado",
];

const SQL_EDITAR_PRODUCTO = `
  UPDATE productos
  SET nombre = $1, categoria_id = $2, precio = $3, stock = $4, descripcion = $5, talles = $6, colores = $7, destacado = $8
  WHERE id = $9
  RETURNING id, codigo, slug, nombre, precio, stock, destacado, activo
`;

export const editarProducto = async (req, res, next) => {
  const { id } = req.params;
  const datos = req.body;
  const cuerpoCompleto =
    datos &&
    typeof datos === "object" &&
    !Array.isArray(datos) &&
    Object.keys(datos).length === CAMPOS_EDICION.length &&
    CAMPOS_EDICION.every((campo) => Object.hasOwn(datos, campo));
  const errores = validarProducto(datos);

  if (!esIdValido(id) || !cuerpoCompleto || Object.keys(errores).length > 0) {
    res.status(400).json({ error: "Los datos del producto no son válidos." });
    return;
  }

  try {
    const categoria = await consulta(SQL_VERIFICAR_CATEGORIA, [datos.categoria_id]);
    if (categoria.rows.length === 0) {
      res.status(400).json({ error: "La categoría elegida no existe." });
      return;
    }

    const { rows } = await consulta(SQL_EDITAR_PRODUCTO, [
      datos.nombre.trim(),
      datos.categoria_id,
      datos.precio,
      datos.stock,
      typeof datos.descripcion === "string" ? datos.descripcion.trim() : null,
      datos.talles,
      datos.colores,
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

const SQL_CAMBIAR_ESTADO = `
  UPDATE productos
  SET activo = $1
  WHERE id = $2
  RETURNING id, codigo, slug, nombre, precio, stock, destacado, activo
`;

export const cambiarEstadoProducto = async (req, res, next) => {
  const { id } = req.params;
  const datos = req.body;
  const cuerpoValido =
    datos &&
    typeof datos === "object" &&
    !Array.isArray(datos) &&
    Object.keys(datos).length === 1 &&
    Object.hasOwn(datos, "activo") &&
    typeof datos.activo === "boolean";

  if (!esIdValido(id) || !cuerpoValido) {
    res.status(400).json({ error: "Los datos del estado no son válidos." });
    return;
  }

  try {
    const { rows } = await consulta(SQL_CAMBIAR_ESTADO, [datos.activo, id]);

    if (rows.length === 0) {
      res.status(404).json({ error: "No encontramos este producto." });
      return;
    }

    res.json(rows[0]);
  } catch (error) {
    next(error);
  }
};
