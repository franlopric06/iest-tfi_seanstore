import { act, cleanup, render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { afterEach, beforeAll, describe, expect, it, vi } from 'vitest'
import CintaProductos from '../src/components/tienda/CintaProductos.jsx'
import textos from '../src/data/textos.js'

const estadoMovimiento = vi.hoisted(() => ({ reducido: false }))

vi.mock('motion/react', async (importOriginal) => {
  const real = await importOriginal()
  return {
    ...real,
    useReducedMotion: () => estadoMovimiento.reducido,
  }
})

beforeAll(() => {
  window.IntersectionObserver = class {
    observe() {}
    unobserve() {}
    disconnect() {}
  }
})

afterEach(() => {
  cleanup()
  vi.useRealTimers()
  estadoMovimiento.reducido = false
})

const armar = () => render(<MemoryRouter><CintaProductos /></MemoryRouter>)

describe('CintaProductos · sección "Elegí qué personalizar"', () => {
  it('R1 · se dibuja con el título, la frase, los 4 botones de categoría y la cinta con el primer producto', () => {
    const { container } = armar()

    expect(
      screen.getByRole('heading', { level: 2, name: textos.cinta.titulo })
    ).toBeInTheDocument()
    expect(screen.getByText(textos.cinta.frase)).toBeInTheDocument()

    textos.franja.categorias.forEach(({ nombre, slug }) => {
      const enlace = screen.getByRole('link', { name: nombre })
      expect(enlace).toHaveAttribute('href', `/catalogo/${slug}`)
    })

    expect(
      screen.getByRole('img', { name: textos.cinta.etiqueta })
    ).toBeInTheDocument()
    expect(screen.getByText(textos.cinta.productos[0].nombre)).toBeInTheDocument()
    expect(
      container.querySelector('[data-testid="efectos-estampado"]')
    ).not.toBeNull()
  })

  it('R1 · los productos de la cinta cambian cada 2,5 segundos', async () => {
    vi.useFakeTimers()
    armar()

    expect(screen.getByText(textos.cinta.productos[0].nombre)).toBeInTheDocument()
    expect(
      screen.queryByText(textos.cinta.productos[1].nombre)
    ).not.toBeInTheDocument()

    await act(async () => {
      vi.advanceTimersByTime(2500)
    })
    expect(screen.getByText(textos.cinta.productos[1].nombre)).toBeInTheDocument()
    expect(
      screen.queryByText(textos.cinta.productos[0].nombre)
    ).not.toBeInTheDocument()

    await act(async () => {
      vi.advanceTimersByTime(2500)
    })
    expect(screen.getByText(textos.cinta.productos[2].nombre)).toBeInTheDocument()
  })

  it('R16 · con movimiento reducido se ve la canillera estampada, sin anillos ni gotas, y no se mueve', async () => {
    estadoMovimiento.reducido = true
    vi.useFakeTimers()
    const { container } = armar()

    expect(
      screen.getByText(textos.cinta.productos[4].nombre)
    ).toBeInTheDocument()
    expect(
      container.querySelector('[data-testid="efectos-estampado"]')
    ).toBeNull()

    await act(async () => {
      vi.advanceTimersByTime(3600)
    })

    expect(
      screen.getByText(textos.cinta.productos[4].nombre)
    ).toBeInTheDocument()
    expect(
      screen.queryByText(textos.cinta.productos[0].nombre)
    ).not.toBeInTheDocument()
  })
})
