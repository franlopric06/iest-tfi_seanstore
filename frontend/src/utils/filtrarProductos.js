// Filtro de la lista del panel (búsqueda, categoría y estado). Es una función
// pura: recibe la lista y los filtros y devuelve los productos que coinciden.

// Saca tildes y mayúsculas para que "ceramica" encuentre "Cerámica".
const normalizar = (texto) =>
  String(texto ?? '')
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .trim()

export const FILTROS_VACIOS = { texto: '', categoria: '', estado: 'todos' }

export const filtrarProductos = (productos, filtros = FILTROS_VACIOS) => {
  const buscado = normalizar(filtros.texto)
  return productos.filter((producto) => {
    const coincideTexto =
      !buscado ||
      normalizar(producto.nombre).includes(buscado) ||
      normalizar(producto.codigo).includes(buscado)
    const coincideCategoria = !filtros.categoria || producto.categoria?.nombre === filtros.categoria
    const coincideEstado =
      filtros.estado === 'todos' ||
      (filtros.estado === 'activos' && producto.activo) ||
      (filtros.estado === 'ocultos' && !producto.activo)
    return coincideTexto && coincideCategoria && coincideEstado
  })
}

// Las categorías que aparecen en la lista, sin repetir y en el orden en que vienen.
export const categoriasDe = (productos) => [
  ...new Set(productos.map((producto) => producto.categoria?.nombre).filter(Boolean)),
]
