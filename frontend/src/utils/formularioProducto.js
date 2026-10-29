// Funciones puras del formulario de producto del panel (004-T27).
// Están separadas del componente para que se puedan leer y probar solas.

export const BORRADOR_VACIO = {
  nombre: '',
  categoria_id: '',
  precio: '',
  stock: '',
  descripcion: '',
  talles: '',
  colores: '',
  destacado: false,
}

// Convierte "S, M, , L" en ["S", "M", "L"]: corta por comas, saca espacios y vacíos.
export const listaDesdeTexto = (texto) =>
  texto
    .split(',')
    .map((parte) => parte.trim())
    .filter(Boolean)

// Al editar, pasa el producto de la API a textos que entienden los campos.
export const borradorDesdeProducto = (producto) => ({
  nombre: producto.nombre ?? '',
  categoria_id: producto.categoria_id ? String(producto.categoria_id) : '',
  precio: producto.precio === null || producto.precio === undefined ? '' : String(Number(producto.precio)),
  stock: producto.stock === null || producto.stock === undefined ? '' : String(producto.stock),
  descripcion: producto.descripcion ?? '',
  talles: (producto.talles ?? []).join(', '),
  colores: (producto.colores ?? []).join(', '),
  destacado: Boolean(producto.destacado),
})

const esPrecioValido = (texto) =>
  texto.trim() !== '' && Number.isFinite(Number(texto)) && Number(texto) >= 0

const esStockValido = (texto) =>
  texto.trim() !== '' && Number.isInteger(Number(texto)) && Number(texto) >= 0

// Devuelve un aviso por cada campo con problema; vacío si está todo bien.
// El servidor vuelve a validar todo: esto es solo para avisar antes de enviar.
export const validarBorrador = (borrador, etiquetas) => {
  const avisos = {}
  if (borrador.nombre.trim() === '') avisos.nombre = etiquetas.nombreVacio
  if (borrador.categoria_id === '') avisos.categoria_id = etiquetas.categoriaVacia
  if (!esPrecioValido(borrador.precio)) avisos.precio = etiquetas.precioInvalido
  if (!esStockValido(borrador.stock)) avisos.stock = etiquetas.stockInvalido
  if (listaDesdeTexto(borrador.colores).length === 0) {
    avisos.colores = etiquetas.coloresInvalidos
  }
  return avisos
}

// Arma el cuerpo que espera la API: solo campos editables, nunca código ni slug.
export const datosDesdeBorrador = (borrador) => ({
  nombre: borrador.nombre.trim(),
  categoria_id: Number(borrador.categoria_id),
  precio: Number(borrador.precio),
  stock: Number(borrador.stock),
  descripcion: borrador.descripcion.trim() || null,
  talles: listaDesdeTexto(borrador.talles),
  colores: listaDesdeTexto(borrador.colores),
  destacado: borrador.destacado,
})
