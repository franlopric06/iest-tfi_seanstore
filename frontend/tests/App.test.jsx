import { cleanup, render, screen } from '@testing-library/react'
import { afterEach, beforeAll, describe, expect, it, vi } from 'vitest'
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
})

afterEach(() => {
  cleanup()
  estadoMovimiento.reducido = false
})

describe('App', () => {
  it('muestra el inicio dentro del layout con el header y el footer', () => {
    render(<App />)
    const titulo = textos.hero.titulo
    const h1 = screen.getByRole('heading', { level: 1 })
    expect(h1).toHaveTextContent(titulo.slice(0, titulo.indexOf(',') + 1))
    expect(h1).toHaveTextContent(titulo.slice(titulo.indexOf(',') + 2))
    expect(screen.getByText('Sitio de demostración: precios y datos de ejemplo.')).toBeInTheDocument()
  })
})
