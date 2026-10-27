import { cleanup, render, screen } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { afterEach, describe, expect, it, vi } from 'vitest'
import NoEncontrada from '../src/pages/tienda/NoEncontrada.jsx'
import DetalleProducto from '../src/pages/tienda/DetalleProducto.jsx'
import textos from '../src/data/textos.js'

const api = vi.hoisted(() => ({ obtenerProducto: vi.fn() }))

vi.mock('../src/services/api.js', () => api)

afterEach(() => {
  cleanup()
  api.obtenerProducto.mockReset()
})

describe('NoEncontrada · ruta * (R11)', () => {
  it('R11 · muestra el texto y el botón al catálogo', () => {
    render(
      <MemoryRouter initialEntries={['/pagina-que-no-existe']}>
        <Routes>
          <Route path="*" element={<NoEncontrada />} />
        </Routes>
      </MemoryRouter>,
    )

    expect(
      screen.getByRole('heading', { level: 1, name: textos.noEncontrada.titulo }),
    ).toBeInTheDocument()
    const boton = screen.getByRole('link', { name: textos.noEncontrada.enlace })
    expect(boton).toHaveAttribute('href', '/catalogo')
    expect(boton).toHaveClass('rounded-marca')
  })
})

describe('NoEncontrada · SEO (R15)', () => {
  it('R15 · el título de la página es el de la spec y el robots pide que no se indexe', () => {
    render(
      <MemoryRouter initialEntries={['/pagina-que-no-existe']}>
        <Routes>
          <Route path="*" element={<NoEncontrada />} />
        </Routes>
      </MemoryRouter>,
    )

    expect(document.title).toBe(textos.noEncontrada.seo.titulo)
    const robots = document.head.querySelector('meta[name="robots"]')
    expect(robots).toHaveAttribute('content', 'noindex, nofollow')
  })
})

describe('NoEncontrada · slug inexistente en el detalle (R11)', () => {
  it('R11 · cuando la API responde 404 el detalle muestra la página', async () => {
    api.obtenerProducto.mockRejectedValue(
      Object.assign(new Error('No encontramos este producto.'), { status: 404 }),
    )
    render(
      <MemoryRouter initialEntries={['/producto/no-existe']}>
        <Routes>
          <Route path="/producto/:slug" element={<DetalleProducto />} />
        </Routes>
      </MemoryRouter>,
    )

    expect(
      await screen.findByRole('heading', { level: 1, name: textos.noEncontrada.titulo }),
    ).toBeInTheDocument()
    expect(
      screen.queryByRole('link', { name: textos.detalle.volver }),
    ).not.toBeInTheDocument()
  })
})
