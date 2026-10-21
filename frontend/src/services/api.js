const URL_BASE = import.meta.env.VITE_API_URL

const pedir = async (ruta) => {
  let respuesta

  try {
    respuesta = await fetch(`${URL_BASE}${ruta}`)
  } catch {
    throw new Error("No pudimos conectar con la tienda.")
  }

  if (!respuesta.ok) {
    const cuerpo = await respuesta.json().catch(() => ({}))
    const errorPedido = new Error(cuerpo.error ?? "No pudimos conectar con la tienda.")
    errorPedido.status = respuesta.status
    throw errorPedido
  }

  return respuesta.json()
}

export const obtenerCategorias = () => pedir("/api/categorias")

export const obtenerProductos = (opciones = {}) => {
  const parametros = new URLSearchParams()

  if (opciones.categoria) {
    parametros.set("categoria", opciones.categoria)
  }
  if (opciones.destacados) {
    parametros.set("destacados", "1")
  }

  const consulta = parametros.toString()
  return pedir(`/api/productos${consulta ? `?${consulta}` : ""}`)
}

export const obtenerProducto = (slug) => pedir(`/api/productos/${encodeURIComponent(slug)}`)
