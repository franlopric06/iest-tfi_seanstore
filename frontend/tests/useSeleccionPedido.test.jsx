import { afterEach, describe, expect, it } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useSeleccionPedido } from '../src/hooks/useSeleccionPedido'

afterEach(() => {
  document.body.innerHTML = ''
})

describe('useSeleccionPedido · cantidad (R8)', () => {
  it('arranca en 1', () => {
    const { result } = renderHook(() =>
      useSeleccionPedido({ nombre: 'Remera', talles: ['S'], colores: ['Blanco', 'Negro'] }),
    )
    expect(result.current.cantidad).toBe(1)
  })

  it('no baja de 1 ni sube de 50: queda en el límite', () => {
    const { result } = renderHook(() =>
      useSeleccionPedido({ nombre: 'Remera', talles: ['S'], colores: ['Blanco', 'Negro'] }),
    )
    act(() => {
      result.current.cambiarCantidad(0)
    })
    expect(result.current.cantidad).toBe(1)
    act(() => {
      result.current.cambiarCantidad(99)
    })
    expect(result.current.cantidad).toBe(50)
  })

  it('corrige un valor inválido al límite más cercano y respeta un valor válido', () => {
    const { result } = renderHook(() =>
      useSeleccionPedido({ nombre: 'Remera', talles: ['S'], colores: ['Blanco', 'Negro'] }),
    )
    act(() => {
      result.current.cambiarCantidad(3)
    })
    expect(result.current.cantidad).toBe(3)
    act(() => {
      result.current.cambiarCantidad(-4)
    })
    expect(result.current.cantidad).toBe(1)
  })
})

describe('useSeleccionPedido · talle (R9, R11)', () => {
  it('sin talles el talle queda en null y no rompe', () => {
    const { result } = renderHook(() =>
      useSeleccionPedido({ nombre: 'Taza', talles: [], colores: ['Blanco'] }),
    )
    expect(result.current.talle).toBeNull()
  })

  it('con un solo talle disponible, viene ya elegido', () => {
    const { result } = renderHook(() =>
      useSeleccionPedido({ nombre: 'Canillera', talles: ['Único'], colores: ['Blanco', 'Negro'] }),
    )
    expect(result.current.talle).toBe('Único')
  })

  it('con varios talles, ninguno viene elegido y elegirTalle lo marca', () => {
    const { result } = renderHook(() =>
      useSeleccionPedido({ nombre: 'Remera', talles: ['S', 'M', 'L', 'XXL'], colores: [] }),
    )
    expect(result.current.talle).toBeNull()
    act(() => {
      result.current.elegirTalle('L')
    })
    expect(result.current.talle).toBe('L')
  })
})

describe('useSeleccionPedido · preselección única (R11)', () => {
  it('con un solo color disponible, viene ya elegido', () => {
    const { result } = renderHook(() =>
      useSeleccionPedido({ nombre: 'Taza', talles: [], colores: ['Blanco'] }),
    )
    expect(result.current.color).toBe('Blanco')
  })

  it('con dos colores, ninguno viene elegido', () => {
    const { result } = renderHook(() =>
      useSeleccionPedido({ nombre: 'Taza', talles: [], colores: ['Blanco', 'Negro'] }),
    )
    expect(result.current.color).toBeNull()
    act(() => {
      result.current.elegirColor('Negro')
    })
    expect(result.current.color).toBe('Negro')
  })

  it('sin colores el color queda vacío y no rompe', () => {
    const { result } = renderHook(() => useSeleccionPedido({ nombre: 'Taza', talles: ['S'], colores: [] }))
    expect(result.current.color).toBeNull()
  })
})

describe('useSeleccionPedido · avisos de faltante (R7, R9)', () => {
  it('con más de un color y ninguno elegido, faltaColor true con el aviso; al elegir, desaparece', () => {
    const { result } = renderHook(() =>
      useSeleccionPedido({ nombre: 'Taza', talles: ['S'], colores: ['Blanco', 'Negro'] }),
    )
    expect(result.current.faltaColor).toBe(true)
    expect(result.current.avisoColor).toBe('Elegí un color para continuar')
    act(() => {
      result.current.elegirColor('Negro')
    })
    expect(result.current.faltaColor).toBe(false)
    expect(result.current.avisoColor).toBeNull()
  })

  it('con un solo color no hay falta ni aviso (R11 preselección)', () => {
    const { result } = renderHook(() =>
      useSeleccionPedido({ nombre: 'Taza', talles: ['S'], colores: ['Blanco'] }),
    )
    expect(result.current.faltaColor).toBe(false)
    expect(result.current.avisoColor).toBeNull()
  })

  it('con más de un talle y ninguno elegido, faltaTalle true con el aviso; al elegir, desaparece', () => {
    const { result } = renderHook(() =>
      useSeleccionPedido({ nombre: 'Remera', talles: ['S', 'M', 'L', 'XXL'], colores: ['Blanco'] }),
    )
    expect(result.current.faltaTalle).toBe(true)
    expect(result.current.avisoTalle).toBe('Elegí un talle para continuar')
    act(() => {
      result.current.elegirTalle('M')
    })
    expect(result.current.faltaTalle).toBe(false)
    expect(result.current.avisoTalle).toBeNull()
  })

  it('con un talle único o sin talles no hay falta ni aviso', () => {
    const unico = renderHook(() =>
      useSeleccionPedido({ nombre: 'Canillera', talles: ['Único'], colores: [] }),
    )
    expect(unico.result.current.faltaTalle).toBe(false)
    expect(unico.result.current.avisoTalle).toBeNull()
    unico.unmount()
    const vacio = renderHook(() =>
      useSeleccionPedido({ nombre: 'Taza', talles: [], colores: ['Blanco'] }),
    )
    expect(vacio.result.current.faltaTalle).toBe(false)
    expect(vacio.result.current.avisoTalle).toBeNull()
  })
})

describe('useSeleccionPedido · cantidad inválida (R8)', () => {
  it('texto vacío y NaN dejan la cantidad en 1', () => {
    const { result } = renderHook(() =>
      useSeleccionPedido({ nombre: 'Remera', talles: ['S'], colores: [] }),
    )
    act(() => {
      result.current.cambiarCantidad('')
    })
    expect(result.current.cantidad).toBe(1)
    act(() => {
      result.current.cambiarCantidad('3')
    })
    act(() => {
      result.current.cambiarCantidad(NaN)
    })
    expect(result.current.cantidad).toBe(1)
  })

  it('un valor con decimales queda como entero', () => {
    const { result } = renderHook(() =>
      useSeleccionPedido({ nombre: 'Remera', talles: ['S'], colores: [] }),
    )
    act(() => {
      result.current.cambiarCantidad(2.7)
    })
    expect(result.current.cantidad).toBe(2)
    expect(Number.isInteger(result.current.cantidad)).toBe(true)
  })
})
