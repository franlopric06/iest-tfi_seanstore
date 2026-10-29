import { useState } from 'react'
import Cargando from '../comunes/Cargando.jsx'
import MensajeError from '../comunes/MensajeError.jsx'
import FotosTaller from './FotosTaller.jsx'
import useObtenerDatos from '../../hooks/useObtenerDatos.js'
import { guardarTextoTaller, obtenerTaller } from '../../services/api.js'
import textos from '../../data/textos.js'

const textosTaller = textos.panel.taller

const FormularioTextoTaller = ({ contenido }) => {
  const [titulo, setTitulo] = useState(contenido.titulo)
  const [parrafo, setParrafo] = useState(contenido.parrafo)
  const [guardando, setGuardando] = useState(false)
  const [aviso, setAviso] = useState(null)

  const guardar = async (evento) => {
    evento.preventDefault()
    setGuardando(true)
    setAviso(null)
    try {
      await guardarTextoTaller({ titulo, parrafo })
      setAviso('guardado')
    } catch {
      setAviso('error')
    } finally {
      setGuardando(false)
    }
  }

  return (
    <form onSubmit={guardar} className="p-4 md:p-6">
      <h2 className="mb-4 font-titulos text-xl text-violeta">
        {textosTaller.tituloEditor}
      </h2>
      <div className="mb-4">
        <label htmlFor="editor-taller-titulo" className="mb-1 block font-bold text-grafito">
          {textosTaller.labelTitulo}
        </label>
        <input
          id="editor-taller-titulo"
          type="text"
          value={titulo}
          maxLength={120}
          onChange={(evento) => {
            setTitulo(evento.target.value)
            setAviso(null)
          }}
          className="min-h-11 w-full rounded-marca border border-gris-claro px-3 text-grafito focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-magenta"
        />
      </div>
      <div className="mb-4">
        <label htmlFor="editor-taller-parrafo" className="mb-1 block font-bold text-grafito">
          {textosTaller.labelParrafo}
        </label>
        <textarea
          id="editor-taller-parrafo"
          rows={5}
          value={parrafo}
          onChange={(evento) => {
            setParrafo(evento.target.value)
            setAviso(null)
          }}
          className="w-full rounded-marca border border-gris-claro px-3 py-2 text-grafito focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-magenta"
        />
      </div>
      {aviso === 'guardado' && (
        <p role="status" className="mb-4 font-bold text-violeta">
          {textosTaller.guardado}
        </p>
      )}
      {aviso === 'error' && (
        <p role="alert" className="mb-4 font-bold text-violeta">
          {textosTaller.errorGuardar}
        </p>
      )}
      <button
        type="submit"
        disabled={guardando}
        className="min-h-11 rounded-marca bg-violeta px-6 font-titulos text-white shadow-tarjeta transition-colors hover:bg-magenta focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-magenta disabled:cursor-not-allowed disabled:opacity-60"
      >
        {guardando ? textosTaller.guardando : textosTaller.guardar}
      </button>
    </form>
  )
}

const EditorTaller = () => {
  const { cargando, datos, error, reintentar } = useObtenerDatos(obtenerTaller)

  if (cargando) {
    return <Cargando etiqueta={textosTaller.cargando} cantidad={2} />
  }

  if (error) {
    return <MensajeError alReintentar={reintentar} />
  }

  return (
    <>
      <FormularioTextoTaller
        contenido={{
          titulo: typeof datos?.titulo === 'string' ? datos.titulo : '',
          parrafo: typeof datos?.parrafo === 'string' ? datos.parrafo : '',
        }}
      />
      {Array.isArray(datos?.fotos) && datos.fotos.length > 0 && (
        <FotosTaller fotosIniciales={datos.fotos} />
      )}
    </>
  )
}

export default EditorTaller
