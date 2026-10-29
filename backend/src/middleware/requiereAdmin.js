import jwt from "jsonwebtoken";

const ERROR_CONFIGURACION = { error: "La autenticación no está configurada." };
const ERROR_AUTENTICACION = { error: "Autenticación requerida." };

export default function requiereAdmin(req, res, next) {
  const secreto = process.env.JWT_SECRET;
  if (!secreto) {
    res.status(503).json(ERROR_CONFIGURACION);
    return;
  }

  const coincidencia = req.get("authorization")?.match(/^Bearer\s+(.+)$/i);
  if (!coincidencia) {
    res.status(401).json(ERROR_AUTENTICACION);
    return;
  }

  try {
    const carga = jwt.verify(coincidencia[1], secreto, { algorithms: ["HS256"] });
    req.administrador = {
      id: carga.sub,
      email: carga.email,
    };
    next();
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      res.status(401).json(ERROR_AUTENTICACION);
      return;
    }

    next(error);
  }
}
