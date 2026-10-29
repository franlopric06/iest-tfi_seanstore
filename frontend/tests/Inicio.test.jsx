import { cleanup, fireEvent, render, screen, waitFor, within } from '@testing-library/react'
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

const api = vi.hoisted(() => ({
  obtenerProductos: vi.fn(),
  obtenerTaller: vi.fn().mockRejectedValue(new Error('sin conexión')),
}))

vi.mock('../src/services/api.js', () => api)

const destacados = [
  {
    codigo: 'P01',
    slug: 'taza-ceramica',
    nombre: 'Taza de cerámica',
    categoria: { slug: 'tazas-termos', nombre: 'Tazas y termos' },
    talles: [],
    colores: ['Blanco', 'Negro'],
    precio: '12000.00',
    stock: 10,
    foto: null,
  },
  {
    codigo: 'P03',
    slug: 'termo',
    nombre: 'Termo',
    categoria: { slug: 'tazas-termos', nombre: 'Tazas y termos' },
    talles: [],
    colores: ['Blanco', 'Negro'],
    precio: '35950.00',
    stock: 5,
    foto: null,
  },
  {
    codigo: 'P05',
    slug: 'remera',
    nombre: 'Remera',
    categoria: { slug: 'indumentaria', nombre: 'Indumentaria' },
    talles: ['S', 'M', 'L', 'XL', 'XXL'],
    colores: ['Blanco', 'Negro'],
    precio: '18000.00',
    stock: 8,
    foto: null,
  },
  {
    codigo: 'P09',
    slug: 'canilleras',
    nombre: 'Canilleras',
    categoria: { slug: 'deportes', nombre: 'Deportes' },
    talles: ['S', 'M', 'L'],
    colores: ['Blanco', 'Negro'],
    precio: '24000.00',
    stock: 0,
    foto: null,
  },
]

beforeAll(() => {
  window.IntersectionObserver = class {
    observe() {}
    unobserve() {}
    disconnect() {}
  }
  window.ResizeObserver = class {
    observe() {}
    unobserve() {}
    disconnect() {}
  }
  window.matchMedia = (consulta) => ({
    matches: false,
    media: consulta,
    onchange: null,
    addEventListener: () => {},
    removeEventListener: () => {},
    addListener: () => {},
    removeListener: () => {},
    dispatchEvent: () => false,
  })
})

afterEach(() => {
  cleanup()
  vi.unstubAllEnvs()
  estadoMovimiento.reducido = false
})

const armar = () => render(<MemoryRouter><Inicio /></MemoryRouter>)

describe('Inicio Â· portada de la tienda', () => {
  it('ubica Nuestro taller después de "Así de fácil" y antes de "¿No tenés diseño?"', () => {
    armar()

    const taller = screen.getByRole('heading', { level: 2, name: textos.nuestroTaller.titulo })
    const facil = screen.getByRole('heading', { level: 2, name: textos.facil.titulo })
    const sinDiseno = screen.getByRole('heading', {
      level: 2,
      name: textos.sinDiseno.titulo,
    })

    expect(facil.compareDocumentPosition(taller) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy()
    expect(taller.compareDocumentPosition(sinDiseno) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy()
  })

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

  it('R2 · pide los destacados y muestra "Los más pedidos" con las 4 tarjetas y "Ver todo el catálogo"', async () => {
    api.obtenerProductos.mockResolvedValue(destacados)
    armar()

    expect(api.obtenerProductos).toHaveBeenCalledWith({ destacados: true })
    const titulo = await screen.findByRole('heading', {
      level: 2,
      name: textos.masPedidos.titulo,
    })
    const seccion = titulo.closest('section')
    const enlaceCatalogo = within(seccion).getByRole('link', { name: textos.masPedidos.enlace })
    expect(enlaceCatalogo).toHaveAttribute('href', '/catalogo')
    destacados.forEach(({ nombre, slug }) => {
      const tarjeta = within(seccion).getByRole('link', { name: new RegExp(nombre, 'i') })
      expect(tarjeta).toHaveAttribute('href', `/producto/${slug}`)
    })
  })

  it('R17 · si la API falla, muestra el error y "Reintentar" vuelve a pedir los destacados', async () => {
    api.obtenerProductos.mockRejectedValueOnce(new Error('API caída'))
    api.obtenerProductos.mockResolvedValue(destacados)
    armar()

    const alerta = await screen.findByRole('alert')
    expect(within(alerta).getByText(textos.errores.frase)).toBeInTheDocument()
    const boton = within(alerta).getByRole('button', { name: textos.errores.boton })
    expect(api.obtenerProductos).toHaveBeenCalledTimes(1)

    fireEvent.click(boton)

    expect(
      await screen.findByRole('heading', { level: 2, name: textos.masPedidos.titulo })
    ).toBeInTheDocument()
    expect(api.obtenerProductos).toHaveBeenCalledTimes(2)
  })

  it('R3 · sin destacados la sección "Los más pedidos" no aparece', async () => {
    api.obtenerProductos.mockResolvedValue([])
    armar()

    await waitFor(() => expect(api.obtenerProductos).toHaveBeenCalled())
    expect(
      screen.queryByRole('heading', { level: 2, name: textos.masPedidos.titulo })
    ).not.toBeInTheDocument()
    expect(screen.queryByText(textos.masPedidos.enlace)).not.toBeInTheDocument()
  })
})
