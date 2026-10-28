import { cleanup, fireEvent, render, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Route, Routes, Link } from 'react-router-dom'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import DetalleProducto from '../src/pages/tienda/DetalleProducto.jsx'
import textos from '../src/data/textos.js'

const api = vi.hoisted(() => ({ obtenerProducto: vi.fn() }))

vi.mock('../src/services/api.js', () => api)

const altUno = 'Remera blanca con un diseño de gato astronauta estampado en el pecho'
const altDos = 'Remera negra con el número 10 estampado en la espalda'

const producto = {
  codigo: 'REM-001',
  slug: 'remera',
  nombre: 'Remera',
  categoria: { slug: 'indumentaria', nombre: 'Indumentaria' },
  talles: ['S', 'M', 'L', 'XL'],
  colores: ['Blanco', 'Negro'],
  descripcion: 'Remera de algodón primera calidad, ideal para un estampado full print.',
  precio: '18000.00',
  stock: 10,
  foto: {
    url: '/img/productos/remera-frontal.webp',
    alt: altUno,
    generada_con_ia: true,
  },
  fotos: [
    { url: '/img/productos/remera-frontal.webp', alt: altUno, generada_con_ia: true, orden: 1 },
    { url: '/img/productos/remera-atras.webp', alt: altDos, generada_con_ia: true, orden: 2 },
  ],
}

const clonar = () => JSON.parse(JSON.stringify(producto))

const URL_SITIO = 'https://sean-store.vercel.app'

const armar = (ruta = '/producto/remera', conLinkOtro = false) =>
  render(
    <MemoryRouter initialEntries={[ruta]}>
      {conLinkOtro && <Link to="/producto/taza-ceramica">otro producto</Link>}
      <Routes>
        <Route path="/producto/:slug" element={<DetalleProducto />} />
      </Routes>
    </MemoryRouter>,
  )

const esperarTitulo = async () =>
  screen.findByRole('heading', { level: 1, name: producto.nombre })

afterEach(() => {
  cleanup()
  api.obtenerProducto.mockReset()
  document.getElementById('json-ld')?.remove()
  document.title = ''
})

describe('Detalle · SEO (R15)', () => {
  it('R15 · pone el título y la descripción del producto', async () => {
    api.obtenerProducto.mockResolvedValue(clonar())
    armar()

    await esperarTitulo()
    await waitFor(() => expect(document.title).toBe("Remera · Sean's Store"))
    const descripcion = document.head.querySelector('meta[name="description"]')
    expect(descripcion?.getAttribute('content')).toBe(
      'Remera con tu diseño estampado. Retiro en el local o envío.',
    )
  })

  it('R15 · el JSON-LD trae el producto sin offers y las migas de pan', async () => {
    api.obtenerProducto.mockResolvedValue(clonar())
    armar()

    await esperarTitulo()
    await waitFor(() => expect(document.getElementById('json-ld')).not.toBeNull())
    const datos = JSON.parse(document.getElementById('json-ld').textContent)
    expect(datos).toHaveLength(2)

    const productoLd = datos.find((item) => item['@type'] === 'Product')
    expect(productoLd.name).toBe(producto.nombre)
    expect(productoLd.sku).toBe(producto.codigo)
    expect(productoLd.brand).toEqual({ '@type': 'Brand', name: "Sean's Store" })
    expect(productoLd.image).toEqual([
      `${URL_SITIO}/img/productos/remera-frontal.webp`,
      `${URL_SITIO}/img/productos/remera-atras.webp`,
    ])
    expect(productoLd.description).toBe(producto.descripcion)
    expect('offers' in productoLd).toBe(false)

    const migasLd = datos.find((item) => item['@type'] === 'BreadcrumbList')
    expect(migasLd.itemListElement).toEqual([
      { '@type': 'ListItem', position: 1, name: 'Inicio', item: `${URL_SITIO}/` },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Indumentaria',
        item: `${URL_SITIO}/catalogo/indumentaria`,
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: 'Remera',
        item: `${URL_SITIO}/producto/remera`,
      },
    ])
  })

  it('R15 · hay un solo <h1>', async () => {
    api.obtenerProducto.mockResolvedValue(clonar())
    armar()

    await esperarTitulo()
    expect(screen.getAllByRole('heading', { level: 1 })).toHaveLength(1)
  })
})

describe('Detalle · datos del producto (R10)', () => {
  it('R10 · pide el producto del slug y muestra el nombre y el precio formateado', async () => {
    api.obtenerProducto.mockResolvedValue(clonar())
    armar()

    await esperarTitulo()
    expect(api.obtenerProducto).toHaveBeenCalledWith('remera')

    const precio = screen.getByText('$ 18.000')
    expect(precio).toHaveTextContent('18.000')
  })

  it('R10 · muestra los talles y colores como opciones del selector y la descripción', async () => {
    api.obtenerProducto.mockResolvedValue(clonar())
    armar()

    await esperarTitulo()
    expect(screen.getByText(producto.descripcion)).toBeInTheDocument()

    producto.talles.forEach((talle) => {
      expect(screen.getByRole('button', { name: talle })).toBeInTheDocument()
    })
    producto.colores.forEach((color) => {
      expect(screen.getByRole('button', { name: color })).toBeInTheDocument()
    })
    expect(screen.queryByText(textos.detalle.talles)).not.toBeInTheDocument()
    expect(screen.queryByText(textos.detalle.colores)).not.toBeInTheDocument()
  })

  it('R10 · si la descripción es null, el bloque no aparece y no se rellena', async () => {
    const sinDescripcion = clonar()
    sinDescripcion.descripcion = null
    api.obtenerProducto.mockResolvedValue(sinDescripcion)
    armar()

    await esperarTitulo()
    expect(screen.queryByText(producto.descripcion)).not.toBeInTheDocument()
  })
})

describe('Detalle · estados del skeleton', () => {
  it('R9 · mientras carga muestra el esqueleto con la forma del detalle, sin datos', () => {
    api.obtenerProducto.mockReturnValue(new Promise(() => {}))
    armar()

    const carga = screen.getByRole('status', { name: textos.detalle.cargando })
    expect(carga).toHaveAttribute('aria-busy', 'true')
    expect(carga.querySelectorAll('[data-testid="esqueleto-detalle"]').length).toBeGreaterThan(0)
    expect(screen.queryByRole('heading', { level: 1 })).not.toBeInTheDocument()
    expect(screen.queryByRole('img')).not.toBeInTheDocument()
  })

  it('R10 · con talles vacíos muestra "Talle único"', async () => {
    const sinTalles = clonar()
    sinTalles.talles = []
    api.obtenerProducto.mockResolvedValue(sinTalles)
    armar()

    await esperarTitulo()
    expect(screen.getByText(textos.detalle.talleUnico)).toBeInTheDocument()
  })
})

describe('Detalle · sin stock (R18)', () => {
  it('R18 · con stock 0 muestra la etiqueta "Sin stock" con el tema de la tarjeta', async () => {
    const agotado = clonar()
    agotado.stock = 0
    api.obtenerProducto.mockResolvedValue(agotado)
    armar()

    await esperarTitulo()
    const chip = screen.getByText(textos.detalle.sinStock)
    expect(chip).toHaveClass('bg-error')
    expect(chip).toHaveClass('rounded-marca')
  })

  it('R18 · con stock disponible no muestra la etiqueta', async () => {
    api.obtenerProducto.mockResolvedValue(clonar())
    armar()

    await esperarTitulo()
    expect(screen.queryByText(textos.detalle.sinStock)).not.toBeInTheDocument()
  })
})

describe('Detalle · sin fotos (R13)', () => {
  it('R13 · sin fotos muestra un recuadro con el nombre del producto', async () => {
    const sinFotos = clonar()
    sinFotos.fotos = []
    api.obtenerProducto.mockResolvedValue(sinFotos)
    armar()

    await esperarTitulo()
    expect(screen.queryByRole('img')).not.toBeInTheDocument()
    expect(screen.getByTestId('sin-foto-detalle')).toHaveTextContent(producto.nombre)
  })
})

describe('Detalle · galería de fotos (R10)', () => {
  it('R10 · la foto de orden = 1 es la principal y las demás son miniaturas', async () => {
    api.obtenerProducto.mockResolvedValue(clonar())
    armar()

    await esperarTitulo()
    const principal = screen.getByRole('img', { name: altUno })
    expect(principal).toHaveAttribute('src', '/img/productos/remera-frontal.webp')

    // Las miniaturas son botones; la segunda foto aparece como botón no presionado
    const botonDos = screen.getByRole('button', { name: altDos })
    expect(botonDos).toHaveAttribute('aria-pressed', 'false')
    const miniatura = botonDos.querySelector('img')
    expect(miniatura).toHaveAttribute('loading', 'lazy')
    expect(miniatura).toHaveAttribute('decoding', 'async')
    expect(miniatura).toHaveAttribute('width', '1024')
    expect(miniatura).toHaveAttribute('height', '1024')
  })

  it('R10 · al tocar una miniatura pasas a verla como foto principal', async () => {
    const usuario = userEvent.setup()
    api.obtenerProducto.mockResolvedValue(clonar())
    armar()

    await esperarTitulo()
    await usuario.click(screen.getByRole('button', { name: altDos }))

    const principal = screen.getByRole('img', { name: altDos })
    expect(principal).toHaveAttribute('src', '/img/productos/remera-atras.webp')
  })

  it('R10 · al cambiar de producto la galería vuelve a la primera foto', async () => {
    const usuario = userEvent.setup()
    api.obtenerProducto.mockResolvedValue(clonar())
    armar('/producto/remera', true)

    await esperarTitulo()

    // Seleccionar la segunda foto en la remera
    await usuario.click(screen.getByRole('button', { name: altDos }))
    expect(screen.getByRole('img', { name: altDos })).toHaveAttribute(
      'src',
      '/img/productos/remera-atras.webp',
    )

    // Navegar a otro producto con una sola foto
    const altTaza = 'Taza de cerámica blanca con diseño personalizado'
    api.obtenerProducto.mockResolvedValue({
      ...clonar(),
      slug: 'taza-ceramica',
      nombre: 'Taza de cerámica',
      precio: '12000.00',
      fotos: [{ url: '/img/productos/taza-ceramica.webp', alt: altTaza, generada_con_ia: true, orden: 1 }],
    })
    await usuario.click(screen.getByRole('link', { name: 'otro producto' }))

    // La galería muestra la única foto disponible (índice 0), sin romper la página
    expect(await screen.findByRole('img', { name: altTaza })).toHaveAttribute(
      'src',
      '/img/productos/taza-ceramica.webp',
    )
    expect(screen.queryByRole('img', { name: altDos })).not.toBeInTheDocument()
  })
})

describe('Detalle · leyenda generado con IA (R12)', () => {
  it('R12 · cuando la foto principal tiene generada_con_ia true muestra la leyenda', async () => {
    api.obtenerProducto.mockResolvedValue(clonar())
    armar()

    await esperarTitulo()
    expect(screen.getByText('«Generado con IA»')).toBeInTheDocument()
  })

  it('R12 · cuando la foto principal tiene generada_con_ia false no muestra la leyenda', async () => {
    const sinLeyenda = clonar()
    sinLeyenda.fotos = sinLeyenda.fotos.map((f) => ({ ...f, generada_con_ia: false }))
    api.obtenerProducto.mockResolvedValue(sinLeyenda)
    armar()

    await esperarTitulo()
    expect(screen.queryByText('«Generado con IA»')).not.toBeInTheDocument()
  })
})

describe('Detalle · estado de error (R17)', () => {
  it('R17 · si la API falla, muestra el error y "Reintentar" vuelve a pedir el producto', async () => {
    api.obtenerProducto.mockRejectedValueOnce(new Error('API caída'))
    api.obtenerProducto.mockResolvedValue(clonar())
    armar()

    const alerta = await screen.findByRole('alert')
    expect(within(alerta).getByText(textos.errores.frase)).toBeInTheDocument()
    const boton = within(alerta).getByRole('button', { name: textos.errores.boton })
    expect(api.obtenerProducto).toHaveBeenCalledTimes(1)

    fireEvent.click(boton)

    expect(
      await screen.findByRole('heading', { level: 1, name: producto.nombre })
    ).toBeInTheDocument()
    expect(api.obtenerProducto).toHaveBeenCalledTimes(2)
    expect(screen.queryByRole('alert')).not.toBeInTheDocument()
  })
})

describe('Detalle · volver al catálogo y cambio de producto', () => {
  it('R10 · el enlace "Volver al catálogo" lleva a /catalogo, con estilo del tema', async () => {
    api.obtenerProducto.mockResolvedValue(clonar())
    armar()

    await esperarTitulo()
    const enlace = screen.getByRole('link', { name: textos.detalle.volver })
    expect(enlace).toHaveAttribute('href', '/catalogo')
    expect(enlace).toHaveClass('rounded-marca')
  })

  it('R10 · al pasar de un producto a otro vuelve a pedir los datos (dependencia slug)', async () => {
    const usuario = userEvent.setup()
    api.obtenerProducto.mockResolvedValue(clonar())
    armar('/producto/remera', true)

    await esperarTitulo()
    expect(api.obtenerProducto).toHaveBeenCalledTimes(1)

    api.obtenerProducto.mockResolvedValue({
      ...clonar(),
      slug: 'taza-ceramica',
      nombre: 'Taza de cerámica',
      precio: '959.00',
    })
    await usuario.click(screen.getByRole('link', { name: 'otro producto' }))

    expect(await screen.findByRole('heading', { level: 1, name: 'Taza de cerámica' })).toBeInTheDocument()
    expect(api.obtenerProducto).toHaveBeenNthCalledWith(2, 'taza-ceramica')
  })
})

describe('Detalle · pedido por WhatsApp (R1, R2, R7, R9, R11)', () => {
  beforeEach(() => {
    vi.stubEnv('VITE_WHATSAPP', '543837123456')
  })

  afterEach(() => {
    vi.unstubAllEnvs()
    vi.restoreAllMocks()
  })

  it('deshabilita el botón y muestra los avisos hasta elegir color y talle', async () => {
    api.obtenerProducto.mockResolvedValue(clonar())
    armar()

    await esperarTitulo()
    const boton = screen.getByRole('button', { name: 'Pedir por WhatsApp' })
    expect(boton).toBeDisabled()
    const avisoColor = screen.getByText('Elegí un color para continuar')
    const avisoTalle = screen.getByText('Elegí un talle para continuar')
    expect(avisoColor).toHaveClass('text-grafito')
    expect(avisoTalle).toHaveClass('text-grafito')

    fireEvent.click(screen.getByRole('button', { name: 'Negro' }))
    fireEvent.click(screen.getByRole('button', { name: 'M' }))

    expect(boton).toBeEnabled()
    expect(screen.queryByText('Elegí un color para continuar')).not.toBeInTheDocument()
    expect(screen.queryByText('Elegí un talle para continuar')).not.toBeInTheDocument()
  })

  it('abre WhatsApp con el mensaje armado después de elegir las variantes', async () => {
    const abrir = vi.spyOn(window, 'open').mockImplementation(() => {})
    api.obtenerProducto.mockResolvedValue(clonar())
    armar()

    await esperarTitulo()
    fireEvent.click(screen.getByRole('button', { name: 'Negro' }))
    fireEvent.click(screen.getByRole('button', { name: 'M' }))
    fireEvent.click(screen.getByRole('button', { name: 'Pedir por WhatsApp' }))

    const mensaje =
      'Hola! Quiero pedir: Remera, color Negro, talle M, cantidad 1. ¿Cómo seguimos?'
    expect(abrir).toHaveBeenCalledWith(
      `https://wa.me/543837123456?text=${encodeURIComponent(mensaje)}`,
      '_blank',
      'noopener,noreferrer',
    )
  })

  it('preselecciona el color y talle únicos sin mostrar avisos', async () => {
    api.obtenerProducto.mockResolvedValue({
      ...clonar(),
      colores: ['Blanco'],
      talles: ['Único'],
    })
    armar()

    await esperarTitulo()
    expect(screen.getByRole('button', { name: 'Blanco' })).toHaveAttribute(
      'aria-pressed',
      'true',
    )
    expect(screen.getByRole('button', { name: 'Único' })).toHaveAttribute(
      'aria-pressed',
      'true',
    )
    expect(screen.getByRole('button', { name: 'Pedir por WhatsApp' })).toBeEnabled()
    expect(screen.queryByText('Elegí un color para continuar')).not.toBeInTheDocument()
    expect(screen.queryByText('Elegí un talle para continuar')).not.toBeInTheDocument()
  })

  it('reinicia la selección al cambiar de producto', async () => {
    const usuario = userEvent.setup()
    api.obtenerProducto.mockResolvedValue(clonar())
    armar('/producto/remera', true)

    await esperarTitulo()
    await usuario.click(screen.getByRole('button', { name: 'Negro' }))
    await usuario.click(screen.getByRole('button', { name: 'M' }))

    api.obtenerProducto.mockResolvedValue({
      ...clonar(),
      slug: 'buzo',
      nombre: 'Buzo',
    })
    await usuario.click(screen.getByRole('link', { name: 'otro producto' }))

    expect(await screen.findByRole('heading', { level: 1, name: 'Buzo' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Negro' })).toHaveAttribute(
      'aria-pressed',
      'false',
    )
    expect(screen.getByRole('button', { name: 'M' })).toHaveAttribute('aria-pressed', 'false')
    expect(screen.getByRole('button', { name: 'Pedir por WhatsApp' })).toBeDisabled()
    expect(screen.getByLabelText('Cantidad')).toHaveValue(1)
  })
})
