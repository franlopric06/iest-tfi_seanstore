import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { consulta } from "../db/conexion.js";

const ERROR_CREDENCIALES = { error: "Email o contraseña incorrectos" };
const ERROR_CONFIGURACION = { error: "La autenticación no está configurada." };
const HASH_FALSO = "$2b$12$6jfiio/JvVUzYof5CQ3.Qe8E4HVnC5kqRpiPZ8xtfG3j4itsQRYpW";

export async function ingresar(req, res, next) {
  const secreto = process.env.JWT_SECRET;
  if (!secreto) {
    res.status(503).json(ERROR_CONFIGURACION);
    return;
  }

  const email = typeof req.body?.email === "string" ? req.body.email.trim().toLowerCase() : "";
  const contrasena = req.body?.contrasena;
  if (!email || typeof contrasena !== "string" || !contrasena) {
    res.status(401).json(ERROR_CREDENCIALES);
    return;
  }

  try {
    const resultado = await consulta(
      "SELECT id, email, contrasena_hash FROM administradores WHERE email = $1 LIMIT 1",
      [email],
    );
    const administrador = resultado.rows[0];
    const hash = administrador?.contrasena_hash ?? HASH_FALSO;
    const coincide = await bcrypt.compare(contrasena, hash);

    if (!administrador || !coincide) {
      res.status(401).json(ERROR_CREDENCIALES);
      return;
    }

    const token = jwt.sign(
      { email: administrador.email },
      secreto,
      { algorithm: "HS256", subject: String(administrador.id), expiresIn: "2h" },
    );
    res.json({ token });
  } catch (error) {
    next(error);
  }
}
