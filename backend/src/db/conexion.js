import pg from "pg";

const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL || "",
  ssl: process.env.DATABASE_URL ? true : false,
});

export const consulta = (texto, parametros) => pool.query(texto, parametros);
