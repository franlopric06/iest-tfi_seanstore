import { afterEach, describe, expect, it } from 'vitest'
import { cleanup, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Asistente from '../src/components/atencion/Asistente.jsx'
import textos from '../src/data/textos.js'

afterEach(cleanup)

describe('Asistente (R1, R2, R7)', () => {
  it('abre el panel y lleva el foco a su título', async () => {
    const usuario = userEvent.setup()
    render(<Asistente />)

    await usuario.click(screen.getByRole('button', { name: textos.asistente.boton }))

    expect(screen.getByRole('region', { name: textos.asistente.saludo })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: textos.asistente.saludo })).toHaveFocus()
  })

  it('cierra con el botón y devuelve el foco al disparador', async () => {
    const usuario = userEvent.setup()
    render(<Asistente />)
    const disparador = screen.getByRole('button', { name: textos.asistente.boton })

    await usuario.click(disparador)
    await usuario.click(screen.getByRole('button', { name: textos.asistente.cerrar }))

    expect(screen.queryByRole('region', { name: textos.asistente.saludo })).not.toBeInTheDocument()
    expect(disparador).toHaveFocus()
  })

  it('cierra con Escape y devuelve el foco al disparador', async () => {
    const usuario = userEvent.setup()
    render(<Asistente />)
    const disparador = screen.getByRole('button', { name: textos.asistente.boton })

    await usuario.click(disparador)
    await usuario.keyboard('{Escape}')

    expect(screen.queryByRole('region', { name: textos.asistente.saludo })).not.toBeInTheDocument()
    expect(disparador).toHaveFocus()
  })

  it('no atrapa el foco dentro del panel', async () => {
    const usuario = userEvent.setup()
    render(
      <>
        <Asistente />
        <button type="button">Control externo</button>
      </>,
    )

    await usuario.click(screen.getByRole('button', { name: textos.asistente.boton }))
    for (let indice = 0; indice < 9; indice += 1) {
      await usuario.tab()
    }

    expect(screen.getByRole('button', { name: 'Control externo' })).toHaveFocus()
  })

  it('no se cierra al activar un control fuera del panel', async () => {
    const usuario = userEvent.setup()
    render(
      <>
        <Asistente />
        <button type="button">Control externo</button>
      </>,
    )

    await usuario.click(screen.getByRole('button', { name: textos.asistente.boton }))
    await usuario.click(screen.getByRole('button', { name: 'Control externo' }))

    expect(screen.getByRole('region', { name: textos.asistente.saludo })).toBeInTheDocument()
  })

  it('filtra por la respuesta, ignora mayúsculas y tildes, y restaura la lista al borrar', async () => {
    const usuario = userEvent.setup()
    render(<Asistente />)
    await usuario.click(screen.getByRole('button', { name: textos.asistente.boton }))

    const busqueda = screen.getByRole('searchbox', { name: textos.asistente.etiquetaBusqueda })
    await usuario.type(busqueda, 'transferencia')

    expect(screen.getByRole('button', { name: '¿Cómo pago?' })).toBeInTheDocument()
    expect(screen.getAllByRole('button').filter((boton) =>
      textos.asistente.preguntas.some(({ pregunta }) => pregunta === boton.textContent),
    )).toHaveLength(1)

    await usuario.clear(busqueda)
    await usuario.type(busqueda, 'ENVIOS')

    expect(screen.getByRole('button', { name: '¿Hacen envíos?' })).toBeInTheDocument()
    expect(screen.getAllByRole('button').filter((boton) =>
      textos.asistente.preguntas.some(({ pregunta }) => pregunta === boton.textContent),
    )).toHaveLength(1)

    await usuario.clear(busqueda)
    textos.asistente.preguntas.forEach(({ pregunta }) => {
      expect(screen.getByRole('button', { name: pregunta })).toBeInTheDocument()
    })
  })
})
