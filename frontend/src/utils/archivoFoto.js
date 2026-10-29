// Revisión rápida de la foto antes de enviarla (el servidor la vuelve a revisar
// leyendo sus bytes): tipo permitido y tamaño máximo de 2 MB.

export const TIPOS_FOTO = ['image/jpeg', 'image/png', 'image/webp']
export const TAMANO_MAXIMO_FOTO = 2 * 1024 * 1024

export const problemaDeArchivo = (archivo, avisos) => {
  if (!archivo) return avisos.faltaArchivo
  if (!TIPOS_FOTO.includes(archivo.type)) return avisos.archivoTipo
  if (archivo.size > TAMANO_MAXIMO_FOTO) return avisos.archivoGrande
  return null
}

// Mensaje del servidor si es un rechazo explicable; si no, el genérico.
export const mensajeDeErrorFoto = (error, generico) =>
  [400, 404, 413, 503].includes(error?.status) ? error.message : generico
