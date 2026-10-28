import { useEffect, useRef, useState } from 'react'
import BotonAsistente from './BotonAsistente.jsx'
import PanelAsistente from './PanelAsistente.jsx'
import textos from '../../data/textos.js'
import { filtrarPreguntas } from '../../utils/filtrarPreguntas.js'

export default function Asistente() {
  const [abierto, setAbierto] = useState(false)
  const [consulta, setConsulta] = useState('')
  const disparadorRef = useRef(null)
  const tituloRef = useRef(null)
  const preguntasFiltradas = filtrarPreguntas(textos.asistente.preguntas, consulta)

  const cerrar = () => {
    setAbierto(false)
    disparadorRef.current?.focus()
  }

  useEffect(() => {
    if (!abierto) return undefined

    tituloRef.current?.focus()
    const manejarTecla = (evento) => {
      if (evento.key === 'Escape') {
        setAbierto(false)
        disparadorRef.current?.focus()
      }
    }

    window.addEventListener('keydown', manejarTecla)
    return () => window.removeEventListener('keydown', manejarTecla)
  }, [abierto])

  return (
    <>
      <BotonAsistente
        ref={disparadorRef}
        abierto={abierto}
        alAbrir={() => setAbierto(true)}
      />
      {abierto && (
        <PanelAsistente
          consulta={consulta}
          alCambiarConsulta={setConsulta}
          alCerrar={cerrar}
          preguntas={preguntasFiltradas}
          tituloRef={tituloRef}
        />
      )}
    </>
  )
}
