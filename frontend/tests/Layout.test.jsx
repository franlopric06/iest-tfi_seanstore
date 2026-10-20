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

  it('El footer muestra el isotipo, la descripción y el contacto por WhatsApp', () => {
    armar(<Footer />)
    const isotipo = screen.getByRole('img', { name: textos.footer.altIsotipo })
    expect(isotipo).toHaveAttribute('src', '/img/isotipo-seanstore-fondo.png')
    expect(screen.getByText(textos.footer.descripcion)).toBeInTheDocument()
    expect(screen.getByText(textos.footer.contacto)).toBeInTheDocument()
  })

  it('R19 · El footer muestra el aviso de sitio de demostración', () => {
    armar(<Footer />)
    expect(screen.getByText(textos.footer.aviso)).toBeInTheDocument()
  })
})
