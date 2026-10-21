import { act, cleanup, renderHook, waitFor } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'

const api = vi.hoisted(() => ({
  obtenerCategorias: vi.fn(),
  obtenerProductos: vi.fn(),
  obtenerProducto: vi.fn(),
}))

vi.mock('../src/services/api.js', () => api)

const useObtenerDatos = (await import('../src/hooks/useObtenerDatos.js')).default

const filas = [
  { slug: 'taza-de-ceramica', nombre: 'Taza de cerámica', precio: 12000, stock: 40 },
  { slug: 'remera', nombre: 'Remera', precio: 16000, stock: 50 },
]

const otrasFilas = [
  { slug: 'buzo', nombre: 'Buzo', precio: 38000, stock: 20 },
]

afterEach(() => {
  cleanup()
  vi.clearAllMocks()
})

describe('useObtenerDatos', () => {
  it('R14 · al montar pide los datos por api.js y termina con el dato', async () => {
    api.obtenerProductos.mockResolvedValueOnce(filas)

    const { result } = renderHook(() =>
      useObtenerDatos(() => api.obtenerProductos({ categoria: 'tazas-termos' })),
    )

    expect(result.current.cargando).toBe(true)
    expect(result.current.datos).toBeNull()
    expect(result.current.error).toBeNull()

    await waitFor(() => expect(result.current.cargando).toBe(false))

    expect(api.obtenerProductos).toHaveBeenCalledTimes(1)
    expect(api.obtenerProductos).toHaveBeenCalledWith({ categoria: 'tazas-termos' })
    expect(result.current.datos).toEqual(filas)
    expect(result.current.error).toBeNull()
  })

  it('R17 · cuando la API falla guarda el error y deja de cargar', async () => {
    api.obtenerProductos.mockRejectedValueOnce(new Error('falló la conexión'))

    const { result } = renderHook(() => useObtenerDatos(() => api.obtenerProductos()))

    await waitFor(() => expect(result.current.error).not.toBeNull())

    expect(result.current.error.message).toBe('falló la conexión')
    expect(result.current.cargando).toBe(false)
    expect(result.current.datos).toBeNull()
  })

  it('R17 · reintentar vuelve a pedir lo mismo: pasa por carga otra vez y trae el dato', async () => {
    api.obtenerProductos
      .mockRejectedValueOnce(new Error('salió mal'))
      .mockResolvedValueOnce(filas)

    const { result } = renderHook(() => useObtenerDatos(() => api.obtenerProductos()))

    await waitFor(() => expect(result.current.error).not.toBeNull())

    act(() => {
      result.current.reintentar()
    })

    expect(result.current.cargando).toBe(true)
    expect(result.current.error).toBeNull()

    await waitFor(() => expect(result.current.datos).toEqual(filas))

    expect(api.obtenerProductos).toHaveBeenCalledTimes(2)
    expect(result.current.cargando).toBe(false)
    expect(result.current.error).toBeNull()
  })

  it('R14 · cuando cambia una dependencia (ej. la categoría) vuelve a pedir los datos', async () => {
    api.obtenerProductos.mockResolvedValueOnce(filas).mockResolvedValueOnce(otrasFilas)

    let categoria = 'tazas-termos'
    const { result, rerender } = renderHook(() =>
      useObtenerDatos(() => api.obtenerProductos({ categoria }), [categoria]),
    )

    await waitFor(() => expect(result.current.datos).toEqual(filas))

    categoria = 'indumentaria'
    rerender(() => useObtenerDatos(() => api.obtenerProductos({ categoria }), [categoria]))

    await waitFor(() => expect(result.current.datos).toEqual(otrasFilas))

    expect(api.obtenerProductos).toHaveBeenCalledTimes(2)
    expect(api.obtenerProductos).toHaveBeenLastCalledWith({ categoria: 'indumentaria' })
    expect(result.current.error).toBeNull()
  })
})
