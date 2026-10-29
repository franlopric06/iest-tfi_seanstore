import { cleanup, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

const api = vi.hoisted(() => ({
  obtenerTaller: vi.fn(),
  guardarTextoTaller: vi.fn(),
}))

vi.mock('../src/services/api.js', () => api)

import EditorTaller from '../src/components/admin/EditorTaller.jsx'
import textos from '../src/data/textos.js'

afterEach(cleanup)

beforeEach(() => {
  api.obtenerTaller.mockReset()
  api.guardarTextoTaller.mockReset()
})

const contenido = {
  titulo: 'Nuestro taller',
  parrafo: 'Cada pedido se diseña y se estampa en nuestro taller de Tinogasta.',
  fotos: [
    { url: '/img/sitio/nuestro-taller.jpg', alt: 'Interior del taller' },
    { url: '/img/sitio/nuestro-taller-clienta.jpg', alt: 'Clienta con remera' },
  ],
}

const textosTaller = textos.panel.taller

describe('EditorTaller', () => {
  it('B4-R4 · muestra la carga y después el formulario con el contenido actual', async () => {
    api.obtenerTaller.mockReturnValue(new Promise(() => {}))
    const { unmount } = render(<EditorTaller />)

    expect(screen.getByRole('status', { name: textosTaller.cargando })).toHaveAttribute(
      'aria-busy',
      'true',
    )
    unmount()

    api.obtenerTaller.mockResolvedValue(contenido)
    render(<EditorTaller />)

    expect(await screen.findByRole('heading', { name: textosTaller.tituloEditor })).toBeInTheDocument()
    const campoTitulo = await screen.findByDisplayValue(contenido.titulo)
    expect(screen.getByLabelText(textosTaller.labelTitulo)).toBe(campoTitulo)
    expect(screen.getByLabelText(textosTaller.labelParrafo)).toHaveValue(contenido.parrafo)
    expect(screen.getByRole('button', { name: textosTaller.guardar })).toBeInTheDocument()
  })

  it('B4-R4 · guarda Título y Párrafo y anuncia el resultado con role=status', async () => {
    api.obtenerTaller.mockResolvedValue(contenido)
    api.guardarTextoTaller.mockResolvedValue(contenido)
    const usuario = userEvent.setup()
    render(<EditorTaller />)

    await screen.findByLabelText(textosTaller.labelTitulo)
    await usuario.type(screen.getByLabelText(textosTaller.labelTitulo), ' de Tinogasta')
    await usuario.click(screen.getByRole('button', { name: textosTaller.guardar }))

    expect(api.guardarTextoTaller).toHaveBeenCalledWith({
      titulo: 'Nuestro taller de Tinogasta',
      parrafo: contenido.parrafo,
    })
    expect(await screen.findByRole('status')).toHaveTextContent(textosTaller.guardado)
  })

  it('B4-R6 · conserva lo escrito y anuncia el error con role=alert si el guardado falla', async () => {
    api.obtenerTaller.mockResolvedValue(contenido)
    api.guardarTextoTaller.mockRejectedValue(new Error('falla de guardado'))
    const usuario = userEvent.setup()
    render(<EditorTaller />)

    const titulo = await screen.findByLabelText(textosTaller.labelTitulo)
    const parrafo = screen.getByLabelText(textosTaller.labelParrafo)
    await usuario.type(titulo, ' de Tinogasta')
    await usuario.type(parrafo, ' con prensa nueva.')
    await usuario.click(screen.getByRole('button', { name: textosTaller.guardar }))

    expect(await screen.findByRole('alert')).toHaveTextContent(textosTaller.errorGuardar)
    expect(titulo).toHaveValue('Nuestro taller de Tinogasta')
    expect(parrafo).toHaveValue(`${contenido.parrafo} con prensa nueva.`)
  })

  it('B4-R3 · con error de carga muestra el aviso y Reintentar vuelve a pedir el contenido', async () => {
    api.obtenerTaller.mockRejectedValueOnce(new Error('sin conexión')).mockResolvedValueOnce(contenido)
    const usuario = userEvent.setup()
    render(<EditorTaller />)

    expect(await screen.findByRole('alert')).toHaveTextContent('Algo salió mal, probá de nuevo')
    await usuario.click(screen.getByRole('button', { name: textos.errores.boton }))

    expect(await screen.findByLabelText(textosTaller.labelTitulo)).toHaveValue(contenido.titulo)
    expect(api.obtenerTaller).toHaveBeenCalledTimes(2)
  })

  it('B4-R6 · deshabilita el botón mientras guarda', async () => {
    api.obtenerTaller.mockResolvedValue(contenido)
    api.guardarTextoTaller.mockReturnValue(new Promise(() => {}))
    const usuario = userEvent.setup()
    render(<EditorTaller />)

    await screen.findByLabelText(textosTaller.labelTitulo)
    await usuario.click(screen.getByRole('button', { name: textosTaller.guardar }))

    expect(
      await screen.findByRole('button', { name: textosTaller.guardando }),
    ).toBeDisabled()
  })
})
