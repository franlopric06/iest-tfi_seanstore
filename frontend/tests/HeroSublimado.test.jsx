import { act, cleanup, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import HeroSublimado from '../src/components/tienda/HeroSublimado.jsx'
import textos from '../src/data/textos.js'

const estadoMovimiento = vi.hoisted(() => ({ reducido: false }))

vi.mock('motion/react', async (importOriginal) => {
  const real = await importOriginal()
  return {
    ...real,
    useReducedMotion: () => estadoMovimiento.reducido,
  }
})

afterEach(() => {
  cleanup()
  vi.unstubAllEnvs()
  estadoMovimiento.reducido = false
})

describe('HeroSublimado · portada "Tu diseño en vivo"', () => {
  it('R1 · se dibuja con el título, la bajada, los chips, los botones y la remera', () => {
    vi.stubEnv('VITE_WHATSAPP', '5493851234567')
    render(<HeroSublimado />)

    expect(screen.getByRole('heading', { level: 1, name: textos.hero.titulo })).toBeInTheDocument()
    expect(screen.getByText(textos.hero.bajada)).toBeInTheDocument()
    textos.hero.chips.forEach((chip) => expect(screen.getByText(chip)).toBeInTheDocument())

    const verCatalogo = screen.getByRole('link', { name: textos.hero.botones.verCatalogo })
    expect(verCatalogo).toHaveAttribute('href', '/catalogo')

    const pedirPresupuesto = screen.getByRole('link', { name: textos.hero.botones.pedirPresupuesto })
    expect(pedirPresupuesto).toHaveAttribute(
      'href',
      `https://wa.me/5493851234567?text=${encodeURIComponent(textos.hero.botones.mensajePresupuesto)}`
    )

    expect(screen.getByRole('img', { name: textos.hero.disenos[0].altRemera })).toBeInTheDocument()
  })

  it('R16 · con movimiento reducido la remera queda quieta con el primer diseño y el primer chip marcado', async () => {
    estadoMovimiento.reducido = true
    vi.useFakeTimers()
    render(<HeroSublimado />)

    expect(screen.getByRole('img', { name: textos.hero.disenos[0].altRemera })).toBeInTheDocument()
    expect(screen.getByText(textos.hero.chips[0])).toHaveClass('bg-magenta')
    expect(screen.getByText(textos.hero.chips[1])).not.toHaveClass('bg-magenta')

    await act(async () => {
      vi.advanceTimersByTime(3600)
    })

    expect(screen.getByRole('img', { name: textos.hero.disenos[0].altRemera })).toBeInTheDocument()
    expect(screen.getByText(textos.hero.chips[0])).toHaveClass('bg-magenta')
  })
})
