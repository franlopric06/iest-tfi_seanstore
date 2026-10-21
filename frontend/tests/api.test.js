import { afterEach, describe, expect, it, vi } from 'vitest'
import { obtenerCategorias, obtenerProducto, obtenerProductos } from '../src/services/api.js'

const fetchSimulado = vi.hoisted(() => vi.fn())

const URL_BASE = import.meta.env.VITE_API_URL

afterEach(() => {
  vi.unstubAllGlobals()
  fetchSimulado.mockReset()
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
})
