import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import BotonWhatsAppFlotante from '../src/components/atencion/BotonWhatsAppFlotante.jsx'
import textos from '../src/data/textos.js'

beforeEach(() => {
  vi.stubEnv('VITE_WHATSAPP', '543837123456')
})

afterEach(() => {
  cleanup()
  vi.restoreAllMocks()
  vi.unstubAllEnvs()
})

describe('BotonWhatsAppFlotante (R5, R6)', () => {
  it('muestra el botón flotante accesible con área táctil de al menos 44 × 44 px', () => {
    render(<BotonWhatsAppFlotante />)
    const boton = screen.getByRole('button', { name: textos.whatsapp.ariaFlotante })

    expect(boton).toHaveClass('fixed', 'min-h-11', 'min-w-11', 'shadow-elevada')
  })

  it('abre WhatsApp con el mensaje genérico en pestaña nueva y aislada', () => {
    const abrir = vi.spyOn(window, 'open').mockImplementation(() => {})
    render(<BotonWhatsAppFlotante />)
    fireEvent.click(screen.getByRole('button', { name: textos.whatsapp.ariaFlotante }))

    const mensaje = textos.whatsapp.mensajeFlotante
    expect(abrir).toHaveBeenCalledWith(
      `https://wa.me/543837123456?text=${encodeURIComponent(mensaje)}`,
      '_blank',
      'noopener,noreferrer',
    )
  })

  it('no se renderiza si VITE_WHATSAPP está vacía', () => {
    vi.stubEnv('VITE_WHATSAPP', '')
    const { container } = render(<BotonWhatsAppFlotante />)

    expect(container).toBeEmptyDOMElement()
  })
})
