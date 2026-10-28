import { afterEach, describe, expect, it, vi } from 'vitest'
import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { SelectorVariante } from '../src/components/tienda/SelectorVariante'

afterEach(cleanup)

const base = {
  colores: ['Blanco', 'Negro'],
  talles: ['S', 'M', 'L'],
  color: 'Negro',
  talle: 'S',
  cantidad: '1',
  alElegirColor: vi.fn(),
  alElegirTalle: vi.fn(),
  alCambiarCantidad: vi.fn(),
}

describe('SelectorVariante · color (R1)', () => {
  it('un chip por color, solo texto, con el elegido marcado', () => {
    render(<SelectorVariante {...base} />)
    expect(screen.getByRole('button', { name: 'Blanco' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Negro' })).toHaveAttribute('aria-pressed', 'true')
  })

  it('al tocar un color llama la función con su nombre', () => {
    const alElegirColor = vi.fn()
    render(<SelectorVariante {...base} alElegirColor={alElegirColor} />)
    fireEvent.click(screen.getByRole('button', { name: 'Blanco' }))
    expect(alElegirColor).toHaveBeenCalledWith('Blanco')
  })
})

describe('SelectorVariante · talle (R1)', () => {
  it('un chip por talle, con el elegido marcado', () => {
    render(<SelectorVariante {...base} />)
    expect(screen.getByRole('button', { name: 'M' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'S' })).toHaveAttribute('aria-pressed', 'true')
  })

  it('sin talles no aparece la sección de talle', () => {
    render(<SelectorVariante {...base} talles={[]} />)
    expect(screen.queryByRole('button', { name: 'S' })).not.toBeInTheDocument()
  })
})

describe('SelectorVariante · cantidad (R1, R8)', () => {
  it('el campo con etiqueta visible corrige la cantidad al salir del campo', () => {
    const alCambiarCantidad = vi.fn()
    render(<SelectorVariante {...base} cantidad={1} alCambiarCantidad={alCambiarCantidad} />)
    const etiqueta = screen.getByText('Cantidad')
    expect(etiqueta.parentElement).toHaveClass('flex', 'items-center', 'gap-3')
    const campo = screen.getByLabelText('Cantidad')
    expect(campo).toHaveValue(1)
    expect(campo).not.toHaveClass('mt-2')
    fireEvent.change(campo, { target: { value: '3' } })
    expect(alCambiarCantidad).not.toHaveBeenCalled()
    fireEvent.blur(campo)
    expect(alCambiarCantidad).toHaveBeenCalledWith('3')
  })
})
