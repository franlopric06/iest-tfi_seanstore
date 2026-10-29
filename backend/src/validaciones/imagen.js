// Revisa que el archivo subido sea de verdad una imagen JPG, PNG o WebP (004-T29).
// No confía en el nombre ni en el tipo que manda el navegador: lee los primeros
// bytes del archivo, que cada formato tiene fijos ("número mágico").

export const TAMANO_MAXIMO = 2 * 1024 * 1024; // 2 MB
const LIMITE_ALT = 160;

const empiezaCon = (buffer, bytes, desde = 0) =>
  bytes.every((byte, i) => buffer[desde + i] === byte);

export const detectarTipoImagen = (buffer) => {
  if (!buffer || buffer.length < 12) return null;
  if (empiezaCon(buffer, [0xff, 0xd8, 0xff])) return "image/jpeg";
  if (empiezaCon(buffer, [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a])) return "image/png";
  const riff = buffer.toString("ascii", 0, 4) === "RIFF";
  const webp = buffer.toString("ascii", 8, 12) === "WEBP";
  if (riff && webp) return "image/webp";
  return null;
};

// Devuelve { tipo } si la imagen sirve, o { error } con un mensaje para el panel.
export const validarImagen = (archivo) => {
  if (!archivo || !archivo.buffer || archivo.buffer.length === 0) {
    return { error: "Elegí una foto para subir." };
  }
  if (archivo.buffer.length > TAMANO_MAXIMO) {
    return { error: "La foto pesa más de 2 MB." };
  }
  const tipo = detectarTipoImagen(archivo.buffer);
  if (!tipo) {
    return { error: "La foto tiene que ser JPG, PNG o WebP." };
  }
  return { tipo };
};

export const validarAlt = (alt) => {
  if (typeof alt !== "string" || alt.trim().length === 0) {
    return "Escribí una descripción corta de la foto (texto alternativo).";
  }
  if (alt.trim().length > LIMITE_ALT) {
    return "La descripción de la foto puede tener hasta 160 caracteres.";
  }
  return null;
};
