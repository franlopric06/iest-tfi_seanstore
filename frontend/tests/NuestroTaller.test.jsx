import { render, screen, within } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import NuestroTaller from '../src/components/inicio/NuestroTaller.jsx'
import textos from '../src/data/textos.js'

describe('NuestroTaller', () => {
  it('muestra el título, el texto y las dos fotos accesibles con leyenda IA', () => {
    const { container } = render(<NuestroTaller />)
    const seccion = container.querySelector('section')

    expect(
      within(seccion).getByRole('heading', { level: 2, name: textos.nuestroTaller.titulo }),
    ).toBeInTheDocument()
    expect(within(seccion).getByText(textos.nuestroTaller.texto)).toBeInTheDocument()

    textos.nuestroTaller.fotos.forEach(({ alt, src }) => {
      const imagen = within(seccion).getByRole('img', { name: alt })
      expect(imagen).toHaveAttribute('src', src)
      expect(imagen).toHaveAttribute('loading', 'lazy')
      expect(imagen).toHaveAttribute('decoding', 'async')
      expect(imagen).toHaveAttribute('width', '1017')
      expect(imagen).toHaveAttribute('height', '572')
    })

    expect(
      within(seccion).getAllByText(textos.generadoConIA),
    ).toHaveLength(textos.nuestroTaller.fotos.length)
    expect(seccion.querySelector('.grid')).toHaveClass('grid-cols-1', 'md:grid-cols-2')
  })
})
