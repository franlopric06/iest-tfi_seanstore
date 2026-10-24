import { cleanup, render, screen, within } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
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

const armar = (ruta = '/catalogo') =>
  render(
    <MemoryRouter initialEntries={[ruta]}>
      <Routes>
        <Route path="/catalogo" element={<Catalogo />} />
        <Route path="/catalogo/:slug" element={<Catalogo />} />
      </Routes>
    </MemoryRouter>,
  )

const enlacesProducto = () =>
  screen
    .getAllByRole('link')
    .filter((enlace) => enlace.getAttribute('href')?.startsWith('/producto/'))

const esperarTitulo = async () =>
  screen.findByRole('heading', { level: 1, name: textos.catalogo.titulo })

describe('Catálogo · grilla de productos', () => {
  it('R9 · mientras carga muestra los esqueletos con la forma de la tarjeta, sin tarjetas', () => {
    api.obtenerProductos.mockReturnValue(new Promise(() => {}))
    armar()

    const carga = screen.getByRole('status', { name: textos.catalogo.cargando })
    expect(carga).toHaveAttribute('aria-busy', 'true')
    const esqueletos = screen.getByRole('list', { hidden: true })
    expect(esqueletos).toHaveClass('grid', 'grid-cols-2', 'md:grid-cols-3', 'lg:grid-cols-4')
    expect(screen.getAllByRole('listitem', { hidden: true })).toHaveLength(8)
    expect(screen.queryByRole('img')).not.toBeInTheDocument()
  })

  it('R6 · pide todos los productos y muestra la grilla con las 12 tarjetas', async () => {
    api.obtenerProductos.mockResolvedValue(productos)
    armar()

    await esperarTitulo()
    expect(api.obtenerProductos).toHaveBeenCalledTimes(1)
    expect(api.obtenerProductos).toHaveBeenCalledWith()

    const grilla = within(screen.getByRole('list'))
    productos.forEach(({ nombre }) => {
      expect(grilla.getByRole('link', { name: new RegExp(nombre, 'i') })).toBeInTheDocument()
    })

    expect(enlacesProducto()).toHaveLength(12)
    productos.forEach(({ slug }) => {
      expect(
        enlacesProducto().find((enlace) => enlace.getAttribute('href') === `/producto/${slug}`),
      ).toBeInTheDocument()
    })
    expect(screen.queryByRole('status', { name: textos.catalogo.cargando })).not.toBeInTheDocument()
  })

  it('R6 · la grilla pasa de 2 columnas (celular desde 360 px) a 3 (tablet) y 4 (PC)', async () => {
    api.obtenerProductos.mockResolvedValue(productos)
    armar()

    await esperarTitulo()
    const grilla = screen.getByRole('list')
    expect(grilla).toHaveClass('grid', 'grid-cols-2', 'md:grid-cols-3', 'lg:grid-cols-4')
  })
})

describe('Catálogo · filtro por categoría (R7)', () => {
  it('R7 · /catalogo/indumentaria pide esa categoría, muestra solo sus productos y marca su chip', async () => {
    api.obtenerProductos.mockResolvedValue(
      productos.filter((producto) => producto.categoria === 'indumentaria'),
    )
    armar('/catalogo/indumentaria')

    await esperarTitulo()
    expect(api.obtenerProductos).toHaveBeenCalledWith({ categoria: 'indumentaria' })

    expect(enlacesProducto()).toHaveLength(3)
    expect(enlacesProducto().map((enlace) => enlace.getAttribute('href'))).toEqual([
      '/producto/remera',
      '/producto/buzo',
      '/producto/campera',
    ])
    expect(
      screen.queryByRole('link', { name: /Taza de cerámica/i }),
    ).not.toBeInTheDocument()

    const chip = screen.getByRole('link', { name: 'Indumentaria' })
    expect(chip).toHaveAttribute('aria-current', 'page')
    expect(chip).toHaveClass('bg-magenta')
    textos.franja.categorias
      .filter((categoria) => categoria.slug !== 'indumentaria')
      .forEach(({ nombre }) => {
        expect(screen.getByRole('link', { name: nombre })).not.toHaveAttribute('aria-current')
      })
  })

  it('R7 · sin slug pide todos los productos y ningún chip queda marcado', async () => {
    api.obtenerProductos.mockResolvedValue(productos)
    armar()

    await esperarTitulo()
    expect(api.obtenerProductos).toHaveBeenCalledWith()
    textos.franja.categorias.forEach(({ nombre }) => {
      expect(screen.getByRole('link', { name: nombre })).not.toHaveAttribute('aria-current')
    })
  })

  it("R7 · la página de categoría lleva su propio título y descripción SEO", async () => {
    api.obtenerProductos.mockResolvedValue(
      productos.filter((producto) => producto.categoria === 'indumentaria'),
    )
    armar('/catalogo/indumentaria')

    await esperarTitulo()
    expect(document.title).toBe(textos.catalogo.seoCategorias.indumentaria.titulo)
    expect(document.head.querySelector('meta[name="description"]')).toHaveAttribute(
      'content',
      textos.catalogo.seoCategorias.indumentaria.descripcion,
    )
  })

  it('R15 · las migas del catálogo filtrado llegan hasta la categoría', async () => {
    api.obtenerProductos.mockResolvedValue(
      productos.filter((producto) => producto.categoria === 'indumentaria'),
    )
    armar('/catalogo/indumentaria')

    await esperarTitulo()
    const script = document.getElementById('json-ld')
    const datos = JSON.parse(script.textContent)
    expect(datos['@type']).toBe('BreadcrumbList')
    expect(datos.itemListElement).toEqual([
      { '@type': 'ListItem', position: 1, name: 'Inicio', item: 'https://sean-store.vercel.app/' },
      {
        '@type': 'ListItem',
        position: 2,
        name: textos.catalogo.titulo,
        item: 'https://sean-store.vercel.app/catalogo',
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: 'Indumentaria',
        item: 'https://sean-store.vercel.app/catalogo/indumentaria',
      },
    ])
  })
})

describe('Catálogo · SEO (R15)', () => {
  it('R15 · pone el título y la descripción del catálogo', async () => {
    api.obtenerProductos.mockResolvedValue(productos)
    armar()

    await esperarTitulo()
    expect(document.title).toBe(textos.catalogo.seo.titulo)
    expect(document.head.querySelector('meta[name="description"]')).toHaveAttribute(
      'content',
      textos.catalogo.seo.descripcion,
    )
  })

  it('R15 · la página tiene un solo <h1>', async () => {
    api.obtenerProductos.mockResolvedValue(productos)
    armar()

    await esperarTitulo()
    const h1 = document.querySelectorAll('h1')
    expect(h1).toHaveLength(1)
  })

  it('R15 · deja el JSON-LD de migas de pan (Inicio › Catálogo)', async () => {
    api.obtenerProductos.mockResolvedValue(productos)
    armar()

    await esperarTitulo()
    const script = document.getElementById('json-ld')
    expect(script).not.toBeNull()
    const datos = JSON.parse(script.textContent)
    expect(datos['@context']).toBe('https://schema.org')
    expect(datos['@type']).toBe('BreadcrumbList')
    expect(datos.itemListElement).toEqual([
      { '@type': 'ListItem', position: 1, name: 'Inicio', item: 'https://sean-store.vercel.app/' },
      {
        '@type': 'ListItem',
        position: 2,
        name: textos.catalogo.titulo,
        item: 'https://sean-store.vercel.app/catalogo',
      },
    ])
  })
})
