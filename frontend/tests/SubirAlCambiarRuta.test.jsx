import { afterEach, describe, expect, it, vi } from 'vitest'
import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { Link, MemoryRouter, Route, Routes } from 'react-router-dom'
import SubirAlCambiarRuta from '../src/components/layout/SubirAlCambiarRuta.jsx'

afterEach(() => {
  cleanup()
  vi.restoreAllMocks()
})

describe('SubirAlCambiarRuta', () => {
  it('sube al inicio al cambiar de ruta', () => {
    const scrollTo = vi.spyOn(window, 'scrollTo').mockImplementation(() => {})

    render(
      <MemoryRouter initialEntries={['/']}>
        <SubirAlCambiarRuta />
        <nav>
          <Link to="/catalogo">Ir al catálogo</Link>
        </nav>
        <Routes>
          <Route path="/" element={<h1>Inicio</h1>} />
          <Route path="/catalogo" element={<h1>Catálogo</h1>} />
        </Routes>
      </MemoryRouter>,
    )

    expect(scrollTo).toHaveBeenCalledWith(0, 0)
    scrollTo.mockClear()

    fireEvent.click(screen.getByRole('link', { name: 'Ir al catálogo' }))

    expect(screen.getByRole('heading', { name: 'Catálogo' })).toBeInTheDocument()
    expect(scrollTo).toHaveBeenCalledWith(0, 0)
  })
})
