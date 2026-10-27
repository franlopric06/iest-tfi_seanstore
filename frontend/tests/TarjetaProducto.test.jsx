import { cleanup, render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { afterEach, describe, expect, it } from 'vitest'
import TarjetaProducto from '../src/components/tienda/TarjetaProducto.jsx'
import formatearPrecio from '../src/utils/formatearPrecio.js'

const producto = {
  codigo: 'TAZ-001',
  slug: 'taza-ceramica',
  nombre: 'Taza de cerámica',
  categoria: { slug: 'tazas-termos', nombre: 'Tazas y termos' },
  talles: ['Talle único'],
  colores: ['Blanco'],
  descripcion: 'Taza para sublimación con tu diseño.',
  precio: '12000.00',
  stock: 5,
  foto: { url: '/img/productos/taza-ceramica.webp', alt: 'Taza de cerámica lista para personalizar', generada_con_ia: true },
}

const armar = (mostrar) =>
  render(
    <MemoryRouter>
      <TarjetaProducto producto={mostrar ?? producto} />
    </MemoryRouter>,
  )

afterEach(cleanup)

describe('TarjetaProducto · tarjeta de producto', () => {
  it('R5 · muestra la foto principal, "Personalizable", el nombre y enlaza al detalle', () => {
    armar()

    expect(screen.getByRole('img', { name: producto.foto.alt })).toHaveAttribute('src', producto.foto.url)
    expect(screen.getByText('Personalizable')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /taza de cerámica/i })).toHaveAttribute('href', '/producto/taza-ceramica')
  })

  it('R5 · muestra el precio con el formato $ 12.000 aunque llegue como texto de la API', () => {
    armar()

    expect(screen.getByText('$ 12.000')).toBeInTheDocument()
  })

  it('R5 · en celular la tarjeta es angosta: dato con p-3, precio text-lg y etiqueta menor, y en compu queda como ahora', () => {
    armar()

    expect(screen.getByText('Personalizable')).toHaveClass(
      'px-2',
      'py-0.5',
      'md:px-3',
      'md:py-1',
    )
    expect(screen.getByText('$ 12.000')).toHaveClass('text-lg', 'md:text-2xl')
    expect(screen.getByText('$ 12.000').closest('div')).toHaveClass('p-3', 'md:p-4')
  })

  it('R18 · con stock 0 muestra la etiqueta "Sin stock"', () => {
    armar({ ...producto, stock: 0 })

    expect(screen.getByText('Sin stock')).toBeInTheDocument()
  })

  it('R18 · con stock mayor a 0 no muestra "Sin stock"', () => {
    armar()

    expect(screen.queryByText('Sin stock')).not.toBeInTheDocument()
  })
})

describe('TarjetaProducto · leyenda generado con IA (R12)', () => {
  it('R12 · con generada_con_ia true muestra la leyenda sobre la foto', () => {
    armar({ ...producto, foto: { ...producto.foto, generada_con_ia: true } })

    expect(screen.getByText('«Generado con IA»')).toBeInTheDocument()
  })

  it('R12 · con generada_con_ia false no muestra la leyenda', () => {
    armar({ ...producto, foto: { ...producto.foto, generada_con_ia: false } })

    expect(screen.queryByText('«Generado con IA»')).not.toBeInTheDocument()
  })
})

describe('formatearPrecio · precio en formato argentino', () => {
  it('convierte el texto "12000.00" que manda la API en $ 12.000', () => {
    expect(formatearPrecio('12000.00')).toBe('$ 12.000')
  })

  it('formatea 12000 numérico como $ 12.000', () => {
    expect(formatearPrecio(12000)).toBe('$ 12.000')
  })

  it('formatea $ 7.500', () => {
    expect(formatearPrecio(7500)).toBe('$ 7.500')
  })

  it('formatea $ 359,50 con los centavos', () => {
    expect(formatearPrecio(359.5)).toBe('$ 359,50')
  })

  it('sin precio devuelve null', () => {
    expect(formatearPrecio(null)).toBeNull()
  })
})
