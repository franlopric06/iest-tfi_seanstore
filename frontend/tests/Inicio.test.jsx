import { cleanup, render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { afterEach, beforeAll, describe, expect, it, vi } from 'vitest'
import Inicio from '../src/pages/tienda/Inicio.jsx'
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
  vi.unstubAllEnvs()
  estadoMovimiento.reducido = false
})

const armar = () => render(<MemoryRouter><Inicio /></MemoryRouter>)

describe('Inicio Â· portada de la tienda', () => {
  it('R1 Â· muestra la portada, la franja, la cinta, "AsÃ­ de fÃ¡cil" y "Â¿No tenÃ©s diseÃ±o?"', () => {
    vi.stubEnv('VITE_WHATSAPP', '5493851234567')
    armar()

    expect(screen.getByRole('heading', { level: 1, name: textos.hero.titulo })).toBeInTheDocument()
    expect(screen.getByText(textos.hero.bajada)).toBeInTheDocument()
    textos.hero.chips.forEach((chip) => expect(screen.getByText(chip)).toBeInTheDocument())

    textos.franja.categorias.forEach(({ nombre }) => {
      expect(screen.getAllByRole('link', { name: nombre }).length).toBeGreaterThan(0)
    })
    textos.franja.sellos.forEach((sello) => {
      expect(screen.getByText(sello)).toBeInTheDocument()
    })

    expect(screen.getByRole('heading', { level: 2, name: textos.cinta.titulo })).toBeInTheDocument()
    expect(screen.getByText(textos.cinta.frase)).toBeInTheDocument()

    expect(screen.getByRole('heading', { level: 2, name: textos.facil.titulo })).toBeInTheDocument()
    textos.facil.pasos.forEach((paso) => {
      expect(screen.getByRole('heading', { level: 3, name: paso.titulo })).toBeInTheDocument()
    })

    expect(
      screen.getByRole('heading', { level: 2, name: textos.sinDiseno.titulo })
    ).toBeInTheDocument()
    expect(screen.getByText(textos.sinDiseno.texto)).toBeInTheDocument()
    const whatsapp = screen.getByRole('link', { name: textos.sinDiseno.boton })
    expect(whatsapp).toHaveAttribute(
      'href',
      `https://wa.me/5493851234567?text=${encodeURIComponent(textos.sinDiseno.mensaje)}`
    )
  })

  it('R15 Â· pone el tÃ­tulo y la descripciÃ³n del inicio y hay un solo h1', () => {
    armar()

    expect(document.title).toBe(textos.inicio.seo.titulo)
    expect(document.querySelector('meta[name="description"]')).toHaveAttribute(
      'content',
      textos.inicio.seo.descripcion
    )
    expect(screen.getAllByRole('heading', { level: 1 })).toHaveLength(1)
  })
})

