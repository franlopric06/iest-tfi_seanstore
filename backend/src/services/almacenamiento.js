import { del, put } from "@vercel/blob";

// Único archivo que habla con Vercel Blob (004-T31). Las credenciales las lee
// el SDK de las variables de entorno y nunca salen del servidor. Vercel conecta
// el Blob de dos formas: con BLOB_STORE_ID (y el token OIDC que Vercel da a
// cada función) o con la clave BLOB_READ_WRITE_TOKEN. Sirve cualquiera.

const EXTENSIONES = { "image/jpeg": "jpg", "image/png": "png", "image/webp": "webp" };

export const almacenamientoConfigurado = () =>
  Boolean(process.env.BLOB_STORE_ID || process.env.BLOB_READ_WRITE_TOKEN);

// Sube la foto y devuelve su URL pública absoluta (https://...blob.vercel-storage.com/...).
export const subirFoto = async (carpeta, buffer, tipo) => {
  const nombre = `${carpeta}/foto.${EXTENSIONES[tipo]}`;
  const resultado = await put(nombre, buffer, {
    access: "public",
    contentType: tipo,
    addRandomSuffix: true,
  });
  return resultado.url;
};

// Solo las fotos subidas desde el panel viven en Blob. Las del proyecto
// (rutas como /img/productos/...) están en el repo y no se borran de ningún lado.
export const esFotoDeBlob = (url) => {
  try {
    const { protocol, hostname } = new URL(url);
    return protocol === "https:" && hostname.endsWith(".blob.vercel-storage.com");
  } catch {
    return false;
  }
};

export const borrarFoto = async (url) => {
  if (!esFotoDeBlob(url)) return false;
  await del(url);
  return true;
};
