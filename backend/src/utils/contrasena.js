import bcrypt from "bcrypt";

const COSTO_BCRYPT = 12;

export function validarContrasena(contrasena) {
  if (typeof contrasena !== "string") {
    return "La contraseña debe ser texto.";
  }

  if (Array.from(contrasena).length < 12) {
    return "La contraseña debe tener al menos 12 caracteres.";
  }

  if (Buffer.byteLength(contrasena, "utf8") > 72) {
    return "La contraseña no puede superar los 72 bytes UTF-8.";
  }

  return null;
}

export async function hashearContrasena(contrasena) {
  const error = validarContrasena(contrasena);

  if (error) {
    throw new Error(error);
  }

  return bcrypt.hash(contrasena, COSTO_BCRYPT);
}
