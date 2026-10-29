import { consulta } from "../db/conexion.js";

const SQL_OBTENER = `
  SELECT titulo, parrafo, foto_1_url, foto_1_alt, foto_2_url, foto_2_alt
  FROM contenido_taller
  WHERE id = 1
`;

const armarRespuesta = (fila) => ({
  titulo: fila.titulo,
  parrafo: fila.parrafo,
  fotos: [
    { url: fila.foto_1_url, alt: fila.foto_1_alt },
    { url: fila.foto_2_url, alt: fila.foto_2_alt },
  ],
});

export const obtenerTaller = async (_req, res, next) => {
  try {
    const { rows } = await consulta(SQL_OBTENER, []);

    if (rows.length === 0) {
      res.status(404).json({ error: "Todavía no cargamos el contenido del taller." });
      return;
    }

    res.json(armarRespuesta(rows[0]));
  } catch (error) {
    next(error);
  }
};

export { armarRespuesta };
