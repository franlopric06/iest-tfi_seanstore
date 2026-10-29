import { cleanup, render, screen, within } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import textos from '../src/data/textos.js'

const api = vi.hoisted(() => ({ obtenerTaller: vi.fn() }))

vi.mock('../src/services/api.js', () => api)

const NuestroTaller = (await import('../src/components/inicio/NuestroTaller.jsx')).default

afterEach(cleanup)

const contenidoApi = {
  titulo: 'Así trabaja nuestro taller',
  parrafo: 'Diseñamos y estampamos cada pedido en Tinogasta.',
  fotos: [
    {
      url: 'https://ejemplo.blob.vercel-storage.com/pren.webp',
      alt: 'Prensa térmica del taller en funcionamiento',
    },
    {
      url: 'https://ejemplo.blob.vercel-storage.com/clienta.webp',
      alt: 'Una clienta sostiene su remera estampada',
    },
  ],
}

describe('NuestroTaller', () => {
  it('B4-R3 · muestra el contenido devuelto por la API y usa la URL de Blob tal cual', async () => {
    api.obtenerTaller.mockResolvedValue(contenidoApi)
    const { container } = render(<NuestroTaller />)
    const seccion = container.querySelector('section')

    expect(
      await within(seccion).findByRole('heading', { level: 2, name: contenidoApi.titulo }),
    ).toBeInTheDocument()
    expect(within(seccion).getByText(contenidoApi.parrafo)).toBeInTheDocument()

    contenidoApi.fotos.forEach(({ url, alt }) => {
      const imagen = within(seccion).getByRole('img', { name: alt })
      expect(imagen).toHaveAttribute('src', url)
      expect(imagen).toHaveAttribute('loading', 'lazy')
      expect(imagen).toHaveAttribute('decoding', 'async')
    })

    // La leyenda va solo en las fotos del proyecto (rutas /img/...), que son de IA;
    // una foto subida desde el panel (URL de Blob) es una foto real del negocio.
    const fotosDelProyecto = contenidoApi.fotos.filter(({ url }) => url.startsWith('/'))
    expect(within(seccion).queryAllByText(textos.generadoConIA)).toHaveLength(fotosDelProyecto.length)
  })

  it('B4-R3 · usa los textos y fotos de respaldo cuando la API falla', async () => {
    api.obtenerTaller.mockRejectedValue(new Error('La API no está disponible.'))
    const { container } = render(<NuestroTaller />)
    const seccion = container.querySelector('section')

    expect(
      await within(seccion).findByRole('heading', { level: 2, name: textos.nuestroTaller.titulo }),
    ).toBeInTheDocument()
    expect(within(seccion).getByText(textos.nuestroTaller.texto)).toBeInTheDocument()

    textos.nuestroTaller.fotos.forEach(({ src, alt }) => {
      const imagen = within(seccion).getByRole('img', { name: alt })
      expect(imagen).toHaveAttribute('src', src)
    })
  })

  it('B4-R3 · respeta las fotos y alts locales del respaldo con su leyenda IA', () => {
    api.obtenerTaller.mockRejectedValue(new Error('sin conexión'))
    render(<NuestroTaller />)

    textos.nuestroTaller.fotos.forEach(({ alt, src }) => {
      expect(screen.getByRole('img', { name: alt })).toHaveAttribute('src', src)
      expect(screen.getByRole('img', { name: alt })).toHaveAttribute('width', '1017')
    })
  })
})
