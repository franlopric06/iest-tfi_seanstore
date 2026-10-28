import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import Header from '../src/components/layout/Header.jsx'
import Footer from '../src/components/layout/Footer.jsx'
import textos from '../src/data/textos.js'

const armar = (componente) => render(<MemoryRouter>{componente}</MemoryRouter>)

describe('Layout · Header y Footer de la primera etapa', () => {
  it('El header muestra el logo de la marca y el enlace "Catálogo"', () => {
    armar(<Header />)
    const logo = screen.getByRole('img', { name: textos.header.altLogo })
    expect(logo).toHaveAttribute('src', '/img/logo-seanstore-negativo.png')
    const enlace = screen.getByRole('link', { name: textos.header.enlaceCatalogo })
    expect(enlace).toHaveAttribute('href', '/catalogo')
  })

  it('El header queda fijo arriba sin crecer demasiado en celular', () => {
    armar(<Header />)
    const header = screen.getByRole('banner')

    expect(header).toHaveClass('sticky', 'top-0', 'z-30', 'bg-violeta', 'shadow-tarjeta')
    expect(header.firstElementChild).toHaveClass('h-16', 'md:h-20')
  })

  it('El footer muestra el isotipo, la descripción y el contacto por WhatsApp', () => {
    armar(<Footer />)
    const isotipo = screen.getByRole('img', { name: textos.footer.altIsotipo })
    expect(isotipo).toHaveAttribute('src', '/img/isotipo-seanstore-fondo.png')
    expect(isotipo).toHaveAttribute('loading', 'lazy')
    expect(isotipo).toHaveAttribute('decoding', 'async')
    expect(isotipo).toHaveAttribute('width', '128')
    expect(isotipo).toHaveAttribute('height', '128')
    expect(screen.getByText(textos.footer.descripcion)).toBeInTheDocument()
    expect(screen.getByText(textos.footer.contacto)).toBeInTheDocument()
  })

  it('R19 · El footer muestra el aviso de sitio de demostración', () => {
    armar(<Footer />)
    expect(screen.getByText(textos.footer.aviso)).toBeInTheDocument()
  })
})
