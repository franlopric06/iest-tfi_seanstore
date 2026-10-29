import multer from "multer";
import { TAMANO_MAXIMO } from "../validaciones/imagen.js";

// Recibe una sola foto en el campo "foto" y la deja en memoria (req.file.buffer),
// sin escribir nada en disco: en Vercel el disco no se puede usar (004-T30).
// Va después de requiereAdmin, así nadie sin sesión llega a subir un archivo.
const recibir = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: TAMANO_MAXIMO, files: 1, fields: 5 },
}).single("foto");

const subirImagen = (req, res, next) => {
  recibir(req, res, (error) => {
    if (!error) {
      next();
      return;
    }
    if (error.code === "LIMIT_FILE_SIZE") {
      res.status(413).json({ error: "La foto pesa más de 2 MB." });
      return;
    }
    res.status(400).json({ error: "No pudimos leer la foto enviada." });
  });
};

export default subirImagen;
