import { consulta } from "../db/conexion.js";

const SQL_CATEGORIAS = "SELECT id, nombre, slug, orden FROM categorias ORDER BY orden";

const listarCategorias = async (_req, res) => {
  const { rows } = await consulta(SQL_CATEGORIAS);
  res.json(rows);
};

export default listarCategorias;
