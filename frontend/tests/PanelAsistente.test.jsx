import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import PanelAsistente from '../src/components/atencion/PanelAsistente.jsx'
import textos from '../src/data/textos.js'

beforeEach(() => {
  vi.stubEnv('VITE_WHATSAPP', '543837123456')
})

afterEach(() => {
  cleanup()
  vi.restoreAllMocks()
  vi.unstubAllEnvs()
})

describe('PanelAsistente', () => {
  it('muestra el saludo, la búsqueda y las seis preguntas frecuentes', () => {
    render(
      <PanelAsistente
        consulta=""
        alCambiarConsulta={vi.fn()}
        alCerrar={vi.fn()}
      />,
    )

    expect(screen.getByRole('region', { name: textos.asistente.saludo })).toHaveAttribute(
      'id',
      'asistente-panel',
    )
    expect(screen.getByRole('heading', { name: textos.asistente.saludo })).toBeInTheDocument()
    expect(screen.getByRole('searchbox', { name: textos.asistente.etiquetaBusqueda })).toBeInTheDocument()
    textos.asistente.preguntas.forEach(({ pregunta }) => {
      expect(screen.getByRole('button', { name: pregunta })).toBeInTheDocument()
    })
  })

  it('muestra la respuesta al activar una pregunta', async () => {
    const usuario = userEvent.setup()
    render(
      <PanelAsistente
        consulta=""
        alCambiarConsulta={vi.fn()}
        alCerrar={vi.fn()}
      />,
    )

    const { pregunta, respuesta } = textos.asistente.preguntas[0]
    await usuario.click(screen.getByRole('button', { name: pregunta }))

    expect(screen.getByText(respuesta)).toBeVisible()
    expect(screen.getByRole('button', { name: pregunta })).toHaveAttribute('aria-expanded', 'true')
  })

  it('mantiene una sola respuesta abierta a la vez', async () => {
    const usuario = userEvent.setup()
    render(
      <PanelAsistente
        consulta=""
        alCambiarConsulta={vi.fn()}
        alCerrar={vi.fn()}
      />,
    )
    const [primera, segunda] = textos.asistente.preguntas

    await usuario.click(screen.getByRole('button', { name: primera.pregunta }))
    expect(screen.getByText(primera.respuesta)).toBeVisible()

    await usuario.click(screen.getByRole('button', { name: segunda.pregunta }))
    expect(screen.getByText(segunda.respuesta)).toBeVisible()
    expect(screen.queryByText(primera.respuesta)).not.toBeVisible()
  })

  it('notifica al controlador cuando cambia la búsqueda o se pide cerrar', async () => {
    const usuario = userEvent.setup()
    const alCambiarConsulta = vi.fn()
    const alCerrar = vi.fn()
    render(
      <PanelAsistente
        consulta=""
        alCambiarConsulta={alCambiarConsulta}
        alCerrar={alCerrar}
      />,
    )

    fireEvent.change(screen.getByRole('searchbox'), { target: { value: 'transferencia' } })
    expect(alCambiarConsulta).toHaveBeenLastCalledWith('transferencia')
    await usuario.click(screen.getByRole('button', { name: textos.asistente.cerrar }))
    expect(alCerrar).toHaveBeenCalledOnce()
  })

  it('muestra el estado vacío y el enlace contextual codificado en WhatsApp', () => {
    const consulta = '¿Puedo pagar por transferencia? & hoy'
    render(
      <PanelAsistente
        consulta={consulta}
        alCambiarConsulta={vi.fn()}
        alCerrar={vi.fn()}
        preguntas={[]}
      />,
    )

    expect(screen.getByRole('status')).toHaveTextContent(
      'No encontramos una respuesta para esa búsqueda.',
    )
    const enlace = screen.getByRole('link', { name: textos.asistente.enlaceDerivacion })
    const mensaje = `Hola! Te escribo desde la tienda. Busqué "${consulta}" y no encontré la respuesta.`
    expect(enlace).toHaveAttribute(
      'href',
      `https://wa.me/543837123456?text=${encodeURIComponent(mensaje)}`,
    )
    expect(enlace).toHaveAttribute('target', '_blank')
    expect(enlace).toHaveAttribute('rel', 'noopener noreferrer')
  })

  it.each([
    ['variable ausente', undefined],
    ['variable vacía', ''],
  ])('mantiene el panel y oculta el enlace con la %s', (_caso, numero) => {
    vi.stubEnv('VITE_WHATSAPP', numero)
    render(
      <PanelAsistente
        consulta="sin coincidencias"
        alCambiarConsulta={vi.fn()}
        alCerrar={vi.fn()}
        preguntas={[]}
      />,
    )

    expect(screen.getByRole('heading', { name: textos.asistente.saludo })).toBeInTheDocument()
    expect(screen.getByRole('status')).toHaveTextContent(
      'No encontramos una respuesta para esa búsqueda.',
    )
    expect(screen.queryByRole('link', { name: textos.asistente.enlaceDerivacion })).not.toBeInTheDocument()
  })
})
