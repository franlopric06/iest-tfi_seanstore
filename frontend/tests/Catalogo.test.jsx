import { cleanup, render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { afterEach, describe, expect, it, vi } from 'vitest'
import Catalogo from '../src/pages/tienda/Catalogo.jsx'
import textos from '../src/data/textos.js'

const api = vi.hoisted(() => ({ obtenerProductos: vi.fn() }))

vi.mock('../src/services/api.js', () => api)

const linea = (codigo, slug, nombre, categoria, precio, stock) => ({
  codigo,
  slug,
  nombre,
  categoria,
  talles: ['Talle único'],
  colores: ['Blanco'],
  precio,
  stock,
  foto: null,
})

const productos = [
  linea('TAZ-001', 'taza-ceramica', 'Taza de cerámica', 'tazas-termos', '12000.00', 8),
  linea('TAZ-002', 'taza-polimero', 'Taza de polímero', 'tazas-termos', '10000.00', 6),
  linea('TER-001', 'termo', 'Termo', 'tazas-termos', '35950.00', 5),
  linea('BOT-001', 'botella', 'Botella', 'tazas-termos', '22000.00', 4),
  linea('REM-001', 'remera', 'Remera', 'indumentaria', '18000.00', 10),
  linea('BUZ-001', 'buzo', 'Buzo', 'indumentaria', '30000.00', 7),
  linea('CAM-001', 'campera', 'Campera', 'indumentaria', '42000.00', 3),
  linea('DEP-001', 'canilleras', 'Canilleras', 'deportes', '24000.00', 0),
  linea('ACC-001', 'gorra', 'Gorra', 'accesorios', '15000.00', 9),
  linea('ACC-002', 'llavero', 'Llavero', 'accesorios', '4500.00', 12),
  linea('ACC-003', 'mousepad', 'Mousepad', 'accesorios', '7500.00', 6),
  linea('ACC-004', 'almohadon', 'Almohadón', 'accesorios', '14000.00', 5),
]

afterEach(() => {
  cleanup()
  api.obtenerProductos.mockReset()
})

const armar = () =>
  render(
    <MemoryRouter>
      <Catalogo />
    </MemoryRouter>,
  )

describe('Catálogo · grilla de productos', () => {
  it('R9 · mientras carga muestra los esqueletos con la forma de la tarjeta, sin tarjetas', () => {
    api.obtenerProductos.mockReturnValue(new Promise(() => {}))
    armar()

    const carga = screen.getByRole('status', { name: textos.catalogo.cargando })
    expect(carga).toHaveAttribute('aria-busy', 'true')
    const esqueletos = screen.getByRole('list', { hidden: true })
    expect(esqueletos).toHaveClass('grid', 'grid-cols-2', 'md:grid-cols-3', 'lg:grid-cols-4')
    expect(
      screen.getAllByRole('listitem', { hidden: true }),
    ).toHaveLength(8)
    expect(screen.queryByRole('img')).not.toBeInTheDocument()
  })

  it('R6 · pide todos los productos y muestra la grilla con las 12 tarjetas', async () => {
    api.obtenerProductos.mockResolvedValue(productos)
    armar()

    await screen.findByRole('heading', { level: 1, name: textos.catalogo.titulo })
    expect(api.obtenerProductos).toHaveBeenCalledTimes(1)
    expect(api.obtenerProductos).toHaveBeenCalledWith()

    productos.forEach(({ nombre }) => {
      expect(screen.getByRole('link', { name: new RegExp(nombre, 'i') })).toBeInTheDocument()
    })

    const enlaces = screen.getAllByRole('link').filter((enlace) => enlace.getAttribute('href'))
    expect(enlaces).toHaveLength(12)
    productos.forEach(({ slug }) => {
      expect(enlaces.find((enlace) => enlace.getAttribute('href') === `/producto/${slug}`)).toBeInTheDocument()
    })
    expect(screen.queryByRole('status', { name: textos.catalogo.cargando })).not.toBeInTheDocument()
  })

  it('R6 · la grilla pasa de 2 columnas (celular desde 360 px) a 3 (tablet) y 4 (PC)', async () => {
    api.obtenerProductos.mockResolvedValue(productos)
    armar()

    await screen.findByRole('heading', { level: 1, name: textos.catalogo.titulo })
    const grilla = screen.getByRole('list')
    expect(grilla).toHaveClass('grid', 'grid-cols-2', 'md:grid-cols-3', 'lg:grid-cols-4')
  })
})
