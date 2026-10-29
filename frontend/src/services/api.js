import { borrarSesion, guardarSesion, obtenerSesion } from '../utils/sesion.js'

const URL_BASE = import.meta.env.VITE_API_URL

const pedir = async (ruta, opciones) => {
  let respuesta

  try {
    respuesta = opciones
      ? await fetch(`${URL_BASE}${ruta}`, opciones)
      : await fetch(`${URL_BASE}${ruta}`)
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

export const ingresar = async (email, contrasena) => {
  const resultado = await pedir('/api/auth/ingresar', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, contrasena }),
  })

  if (typeof resultado.token !== 'string' || !resultado.token) {
    throw new Error('No pudimos iniciar sesión.')
  }

  guardarSesion(resultado.token)
  return resultado
}

export const pedirAdmin = async (ruta, opciones = {}) => {
  const token = obtenerSesion()
  const headers = { ...opciones.headers }
  if (token) headers.Authorization = `Bearer ${token}`

  try {
    return await pedir(ruta, { ...opciones, headers })
  } catch (error) {
    if (error.status === 401) {
      borrarSesion()
      window.history.replaceState(null, '', '/ingresar')
      window.dispatchEvent(new PopStateEvent('popstate'))
    }
    throw error
  }
}

export const obtenerProductosAdmin = () => pedirAdmin('/api/admin/productos')

export const editarRapidoProducto = (id, datos) =>
  pedirAdmin(`/api/admin/productos/${encodeURIComponent(id)}/edicion-rapida`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(datos),
  })

// Envía un cuerpo JSON a una ruta del panel con el método indicado.
const enviarAdmin = (ruta, metodo, datos) =>
  pedirAdmin(ruta, {
    method: metodo,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(datos),
  })

export const crearProducto = (datos) => enviarAdmin('/api/admin/productos', 'POST', datos)

export const editarProducto = (id, datos) =>
  enviarAdmin(`/api/admin/productos/${encodeURIComponent(id)}`, 'PATCH', datos)

export const cambiarEstadoProducto = (id, activo) =>
  enviarAdmin(`/api/admin/productos/${encodeURIComponent(id)}/estado`, 'PATCH', { activo })

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

export const obtenerTaller = () => pedir('/api/taller')

export const guardarTextoTaller = (texto) =>
  pedirAdmin('/api/admin/taller', {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(texto),
  })
