import { afterEach, describe, expect, it, vi } from 'vitest'
import {
  editarRapidoProducto,
  ingresar,
  obtenerProductosAdmin,
  obtenerCategorias,
  obtenerProducto,
  obtenerProductos,
  pedirAdmin,
} from '../src/services/api.js'

const { fetchSimulado, sesion } = vi.hoisted(() => ({
  fetchSimulado: vi.fn(),
  sesion: {
    guardarSesion: vi.fn(),
    obtenerSesion: vi.fn(),
    borrarSesion: vi.fn(),
  },
}))

const URL_BASE = import.meta.env.VITE_API_URL

vi.mock('../src/utils/sesion.js', () => sesion)

afterEach(() => {
  window.history.replaceState(null, '', '/')
  vi.unstubAllGlobals()
  fetchSimulado.mockReset()
  vi.resetAllMocks()
})

describe('api.js', () => {
  it('R14 · las categorías salen de /api/categorias', async () => {
    fetchSimulado.mockResolvedValue({ ok: true, json: () => Promise.resolve([]) })
    vi.stubGlobal('fetch', fetchSimulado)

    await obtenerCategorias()

    expect(fetchSimulado).toHaveBeenCalledWith(`${URL_BASE}/api/categorias`)
  })

  it('R14 · los productos van a /api/productos con la categoría como consulta', async () => {
    fetchSimulado.mockResolvedValue({ ok: true, json: () => Promise.resolve([]) })
    vi.stubGlobal('fetch', fetchSimulado)

    await obtenerProductos({ categoria: 'indumentaria' })

    expect(fetchSimulado).toHaveBeenCalledWith(`${URL_BASE}/api/productos?categoria=indumentaria`)
  })

  it('R14 · los productos van a /api/productos sin consulta si no se pide categoría', async () => {
    fetchSimulado.mockResolvedValue({ ok: true, json: () => Promise.resolve([]) })
    vi.stubGlobal('fetch', fetchSimulado)

    await obtenerProductos()

    expect(fetchSimulado).toHaveBeenCalledWith(`${URL_BASE}/api/productos`)
  })

  it('R14 · el detalle arma la dirección con el slug codificado', async () => {
    fetchSimulado.mockResolvedValue({ ok: true, json: () => Promise.resolve([]) })
    vi.stubGlobal('fetch', fetchSimulado)

    await obtenerProducto('canilleras-s/m-l')

    expect(fetchSimulado).toHaveBeenCalledWith(`${URL_BASE}/api/productos/canilleras-s%2Fm-l`)
  })

  it('R11 · si la API responde 404, lanza el error de la API con su status', async () => {
    fetchSimulado.mockResolvedValue({
      ok: false,
      status: 404,
      json: () => Promise.resolve({ error: 'No encontramos este producto.' }),
    })
    vi.stubGlobal('fetch', fetchSimulado)

    let errorRespuesta
    try {
      await obtenerProducto('taza-de-ceramica')
    } catch (error) {
      errorRespuesta = error
    }

    expect(errorRespuesta.message).toBe('No encontramos este producto.')
    expect(errorRespuesta.status).toBe(404)
  })

  it('B1-R9 · ingresa con JSON, guarda el JWT en sessionStorage y devuelve el resultado', async () => {
    fetchSimulado.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ token: 'jwt-de-prueba' }),
    })
    vi.stubGlobal('fetch', fetchSimulado)

    await expect(ingresar('admin@seanstore.com', 'clave')).resolves.toEqual({
      token: 'jwt-de-prueba',
    })

    expect(fetchSimulado).toHaveBeenCalledWith(`${URL_BASE}/api/auth/ingresar`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'admin@seanstore.com', contrasena: 'clave' }),
    })
    expect(sesion.guardarSesion).toHaveBeenCalledWith('jwt-de-prueba')
  })

  it('B1-R9 · envía Bearer en las solicitudes protegidas', async () => {
    sesion.obtenerSesion.mockReturnValue('jwt-de-prueba')
    fetchSimulado.mockResolvedValue({ ok: true, json: () => Promise.resolve({ ok: true }) })
    vi.stubGlobal('fetch', fetchSimulado)

    await pedirAdmin('/api/admin/productos')

    expect(fetchSimulado).toHaveBeenCalledWith(`${URL_BASE}/api/admin/productos`, {
      headers: { Authorization: 'Bearer jwt-de-prueba' },
    })
  })

  it('B1-R10 · ante 401 borra sesión y redirige a /ingresar', async () => {
    sesion.obtenerSesion.mockReturnValue('jwt-vencido')
    fetchSimulado.mockResolvedValue({
      ok: false,
      status: 401,
      json: () => Promise.resolve({ error: 'Autenticación requerida.' }),
    })
    vi.stubGlobal('fetch', fetchSimulado)

    await expect(pedirAdmin('/api/admin/productos')).rejects.toMatchObject({
      message: 'Autenticación requerida.',
      status: 401,
    })

    expect(sesion.borrarSesion).toHaveBeenCalledOnce()
    expect(window.location.pathname).toBe('/ingresar')
  })

  it("B1-R14 · lista productos administrativos con la sesión", async () => {
    sesion.obtenerSesion.mockReturnValue('jwt-de-prueba')
    fetchSimulado.mockResolvedValue({ ok: true, json: () => Promise.resolve([]) })
    vi.stubGlobal('fetch', fetchSimulado)

    await obtenerProductosAdmin()

    expect(fetchSimulado).toHaveBeenCalledWith(`${URL_BASE}/api/admin/productos`, {
      headers: { Authorization: "Bearer jwt-de-prueba" },
    })
  })

  it("B1-R15 · envía la edición rápida al endpoint protegido", async () => {
    sesion.obtenerSesion.mockReturnValue('jwt-de-prueba')
    fetchSimulado.mockResolvedValue({ ok: true, json: () => Promise.resolve({ id: 1 }) })
    vi.stubGlobal('fetch', fetchSimulado)
    const datos = { precio: 12500, stock: 12, destacado: true }

    await editarRapidoProducto(1, datos)

    expect(fetchSimulado).toHaveBeenCalledWith(
      `${URL_BASE}/api/admin/productos/1/edicion-rapida`,
      {
        method: 'PATCH',
        headers: expect.objectContaining({
          Authorization: expect.stringMatching(/^Bearer /),
          'Content-Type': 'application/json',
        }),
        body: JSON.stringify(datos),
      },
    )
  })
})
