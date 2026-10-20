import { cleanup, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, beforeAll, describe, expect, it, vi } from 'vitest'
import FranjaCategorias from '../src/components/tienda/FranjaCategorias.jsx'
import textos from '../src/data/textos.js'

const estadoMovimiento = vi.hoisted(() => ({ reducido: false }))
const cinta = vi.hoisted(() => ({
  reproducir: vi.fn(),
  detener: vi.fn(),
  pausar: vi.fn(),
  continuar: vi.fn(),
}))

vi.mock('motion/react', async (importOriginal) => {
  const real = await importOriginal()
  const alcanceFalso = (nodo) => {
    alcanceFalso.current = nodo
  }
  alcanceFalso.current = null
  const animarFalso = (...argumentos) => {
    cinta.reproducir(...argumentos)
    return { stop: cinta.detener, pause: cinta.pausar, play: cinta.continuar }
  }
  return {
    ...real,
    useReducedMotion: () => estadoMovimiento.reducido,
    useAnimate: () => [alcanceFalso, animarFalso],
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
  estadoMovimiento.reducido = false
  cinta.reproducir.mockClear()
  cinta.detener.mockClear()
  cinta.pausar.mockClear()
  cinta.continuar.mockClear()
})

describe('FranjaCategorias · franja de categorías y sellos', () => {
  it('R1 · muestra la cinta con las 4 categorías y los 3 sellos', () => {
    render(<FranjaCategorias />)

    textos.franja.categorias.forEach(({ nombre }) => {
      expect(screen.getAllByRole('link', { name: nombre }).length).toBeGreaterThan(0)
    })
    textos.franja.sellos.forEach((sello) => {
      expect(screen.getByText(sello)).toBeInTheDocument()
    })
  })

  it('R4 · cada categoría enlaza a su /catalogo/:slug', () => {
    render(<FranjaCategorias />)

    textos.franja.categorias.forEach(({ nombre, slug }) => {
      screen
        .getAllByRole('link', { name: nombre })
        .forEach((enlace) => expect(enlace).toHaveAttribute('href', `/catalogo/${slug}`))
    })
  })

  it('R1 · la cinta arranca en loop de 32 s, se pausa al pasar el mouse y se detiene al desmontar', async () => {
    const usuario = userEvent.setup()
    const { unmount } = render(<FranjaCategorias />)

    const [, fotogramas, opciones] = cinta.reproducir.mock.calls[0]
    expect(fotogramas).toEqual({ x: ['0%', '-33.333%'] })
    expect(opciones).toEqual({ duration: 32, ease: 'linear', repeat: Infinity })

    await usuario.hover(screen.getByRole('navigation'))
    expect(cinta.pausar).toHaveBeenCalledOnce()

    await usuario.hover(screen.getByText(textos.franja.sellos[1]))
    expect(cinta.continuar).toHaveBeenCalledOnce()

    unmount()
    expect(cinta.detener).toHaveBeenCalledOnce()
  })

  it('R16 · con movimiento reducido la cinta queda quieta', () => {
    estadoMovimiento.reducido = true
    render(<FranjaCategorias />)

    expect(cinta.reproducir).not.toHaveBeenCalled()
    textos.franja.categorias.forEach(({ nombre }) => {
      expect(screen.getAllByRole('link', { name: nombre })[0]).toBeInTheDocument()
    })
    textos.franja.sellos.forEach((sello) => expect(screen.getByText(sello)).toBeInTheDocument())
  })
})
