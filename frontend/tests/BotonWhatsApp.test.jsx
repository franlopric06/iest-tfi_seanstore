import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { BotonWhatsApp } from '../src/components/tienda/BotonWhatsApp'

beforeEach(() => {
  vi.stubEnv('VITE_WHATSAPP', '543837123456')
})

afterEach(() => {
  cleanup()
  vi.restoreAllMocks()
  vi.unstubAllEnvs()
})

const mensaje = 'Hola! Quiero pedir: Termo, color Blanco, cantidad 1. ¿Cómo seguimos?'

describe('BotonWhatsApp · texto y estilo (R4)', () => {
  it('con stock el texto es "Pedir por WhatsApp"', () => {
    render(<BotonWhatsApp mensaje={mensaje} sinStock={false} />)
    expect(screen.getByRole('button', { name: 'Pedir por WhatsApp' })).toBeInTheDocument()
  })

  it('sin stock el texto es "Consultar por WhatsApp"', () => {
    render(<BotonWhatsApp mensaje={mensaje} sinStock />)
    expect(screen.getByRole('button', { name: 'Consultar por WhatsApp' })).toBeInTheDocument()
  })

  it('usa los tokens de la marca y el ícono del globo de conversación', () => {
    render(<BotonWhatsApp mensaje={mensaje} sinStock={false} />)
    const boton = screen.getByRole('button', { name: /WhatsApp/ })
    expect(boton.className).toContain('bg-whatsapp')
    expect(boton.className).toContain('text-whatsapp-texto')
    expect(boton.className).toContain('ring-magenta')
  })
})

describe('BotonWhatsApp · habilitado y envío (R2, R3, R5)', () => {
  it('deshabilitado si la prop lo manda; el clic no abre nada', () => {
    const abrir = vi.spyOn(window, 'open').mockImplementation(() => {})
    render(<BotonWhatsApp mensaje={mensaje} sinStock={false} deshabilitado />)
    const boton = screen.getByRole('button', { name: 'Pedir por WhatsApp' })
    expect(boton).toBeDisabled()
    fireEvent.click(boton)
    expect(abrir).not.toHaveBeenCalled()
  })

  it('habilitado, el clic abre el enlace del mensaje en pestaña nueva', () => {
    const abrir = vi.spyOn(window, 'open').mockImplementation(() => {})
    render(<BotonWhatsApp mensaje={mensaje} sinStock={false} />)
    fireEvent.click(screen.getByRole('button', { name: 'Pedir por WhatsApp' }))
    const enlace = abrir.mock.calls[0][0]
    expect(enlace).toBe('https://wa.me/543837123456?text=' + encodeURIComponent(mensaje))
    expect(abrir).toHaveBeenCalledWith(enlace, '_blank', 'noopener,noreferrer')
  })

  it('sin la variable el botón no se renderiza (R5)', () => {
    vi.stubEnv('VITE_WHATSAPP', '')
    const { container } = render(<BotonWhatsApp mensaje={mensaje} sinStock={false} />)
    expect(container).toBeEmptyDOMElement()
  })
})
