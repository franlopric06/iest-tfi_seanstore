import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest'
import App from '../src/App.jsx'
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

beforeEach(() => {
  vi.spyOn(window, 'scrollTo').mockImplementation(() => {})
})

afterEach(() => {
  cleanup()
  vi.restoreAllMocks()
  vi.unstubAllEnvs()
  estadoMovimiento.reducido = false
  sessionStorage.clear()
  window.history.replaceState(null, '', '/')
})

describe('App', () => {
  it('muestra el inicio dentro del layout con el header y el footer', async () => {
    render(<App />)
    const titulo = textos.hero.titulo
    const h1 = await screen.findByRole('heading', { level: 1 })
    expect(h1).toHaveTextContent(titulo.slice(0, titulo.indexOf(',') + 1))
    expect(h1).toHaveTextContent(titulo.slice(titulo.indexOf(',') + 2))
    expect(await screen.findByText('Sitio de demostración: precios y datos de ejemplo.')).toBeInTheDocument()
  })

  it('muestra el botón flotante de WhatsApp en el layout de la tienda', async () => {
    vi.stubEnv('VITE_WHATSAPP', '543837123456')
    render(<App />)

    expect(
      await screen.findByRole('button', { name: textos.whatsapp.ariaFlotante }),
    ).toBeInTheDocument()
    expect(screen.getByRole('button', { name: textos.asistente.boton })).toBeInTheDocument()
  })

  it('carga el catálogo al navegar desde la portada', async () => {
    render(<App />)

    fireEvent.click(screen.getByRole('link', { name: textos.header.enlaceCatalogo }))

    expect(
      await screen.findByRole('heading', { level: 1, name: textos.catalogo.titulo }),
    ).toBeInTheDocument()
  })

  it('redirige de /admin a /ingresar cuando no hay sesión', async () => {
    window.history.replaceState(null, '', '/admin')
    render(<App />)

    expect(await screen.findByRole('heading', { name: 'Ingresar al panel' })).toBeInTheDocument()
  })

  it('redirige de /ingresar al panel cuando ya hay sesión', async () => {
    sessionStorage.setItem('seanstore_admin_token', 'jwt-de-prueba')
    window.history.replaceState(null, '', '/ingresar')
    render(<App />)

    expect(
      await screen.findByRole('heading', { name: 'Panel de administración' }),
    ).toBeInTheDocument()
  })
})
