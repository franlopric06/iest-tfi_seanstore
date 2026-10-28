import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import BotonAsistente from '../src/components/atencion/BotonAsistente.jsx'
import textos from '../src/data/textos.js'

describe('BotonAsistente (R1)', () => {
  it('muestra el disparador accesible con posición, tamaño y foco visibles', () => {
    render(<BotonAsistente abierto={false} alAbrir={vi.fn()} />)
    const boton = screen.getByRole('button', { name: textos.asistente.boton })

    expect(boton).toHaveClass(
      'fixed',
      'bottom-4',
      'left-4',
      'min-h-11',
      'min-w-11',
      'focus-visible:ring-2',
      'focus-visible:ring-magenta',
    )
    expect(boton).toHaveAttribute('aria-expanded', 'false')
    expect(boton).toHaveAttribute('aria-controls', 'asistente-panel')
  })

  it('al activarlo llama el callback recibido', () => {
    const alAbrir = vi.fn()
    render(<BotonAsistente abierto={false} alAbrir={alAbrir} />)

    fireEvent.click(screen.getByRole('button', { name: textos.asistente.boton }))

    expect(alAbrir).toHaveBeenCalledOnce()
  })
})
