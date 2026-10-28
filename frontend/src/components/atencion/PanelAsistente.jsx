import { useState } from 'react'
import { motion, useReducedMotion } from 'motion/react'
import { ChevronDown, Search, X } from 'lucide-react'
import textos from '../../data/textos.js'
import { armarEnlaceWhatsApp } from '../../utils/whatsapp.js'

export default function PanelAsistente({
  consulta,
  alCambiarConsulta,
  alCerrar,
  preguntas = textos.asistente.preguntas,
  tituloRef,
}) {
  const [preguntaAbierta, setPreguntaAbierta] = useState(null)
  const movimientoReducido = useReducedMotion()
  const enlaceDerivacion =
    preguntas.length === 0
      ? armarEnlaceWhatsApp(
          textos.asistente.plantillaDerivacion.replace('{consulta}', consulta),
        )
      : null

  return (
    <motion.section
      id="asistente-panel"
      aria-labelledby="asistente-titulo"
      initial={movimientoReducido ? false : { opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className="fixed bottom-20 left-4 z-40 max-h-[calc(100dvh-7rem)] w-[calc(100vw-2rem)] max-w-sm overflow-y-auto rounded-marca bg-white p-4 shadow-elevada"
    >
      <header className="mb-4 flex items-start justify-between gap-3">
        <h2
          id="asistente-titulo"
          ref={tituloRef}
          tabIndex="-1"
          className="font-titulos text-lg text-violeta focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-magenta"
        >
          {textos.asistente.saludo}
        </h2>
        <button
          type="button"
          aria-label={textos.asistente.cerrar}
          onClick={alCerrar}
          className="flex min-h-11 min-w-11 items-center justify-center rounded-marca text-violeta focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-magenta"
        >
          <X aria-hidden="true" size={20} />
        </button>
      </header>

      <label htmlFor="asistente-busqueda" className="sr-only">
        {textos.asistente.etiquetaBusqueda}
      </label>
      <div className="relative mb-4">
        <Search aria-hidden="true" className="absolute left-3 top-3 h-5 w-5 text-grafito" />
        <input
          id="asistente-busqueda"
          type="search"
          value={consulta}
          onChange={(evento) => alCambiarConsulta(evento.target.value)}
          placeholder={textos.asistente.placeholderBusqueda}
          className="min-h-11 w-full rounded-marca border border-gris-claro pl-10 pr-3 text-violeta focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-magenta"
        />
      </div>

      {preguntas.length === 0 ? (
        <div className="space-y-2">
          <p role="status" className="text-sm text-grafito">
            {textos.asistente.sinResultados}
          </p>
          {enlaceDerivacion && (
            <a
              href={enlaceDerivacion}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-11 items-center rounded-marca text-magenta underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-magenta"
            >
              {textos.asistente.enlaceDerivacion}
            </a>
          )}
        </div>
      ) : (
        <ul className="space-y-2">
          {preguntas.map(({ pregunta, respuesta }, indice) => {
            const abierta = preguntaAbierta === pregunta
            const respuestaId = `asistente-respuesta-${indice}`

            return (
              <li key={pregunta} className="rounded-marca border border-gris-claro">
                <button
                  type="button"
                  aria-expanded={abierta}
                  aria-controls={respuestaId}
                  onClick={() => setPreguntaAbierta(abierta ? null : pregunta)}
                  className="flex min-h-11 w-full items-center justify-between gap-3 rounded-marca px-3 py-2 text-left font-titulos text-sm text-violeta focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-magenta"
                >
                  {pregunta}
                  <ChevronDown
                    aria-hidden="true"
                    className={`h-4 w-4 shrink-0 transition-transform ${abierta ? 'rotate-180' : ''}`}
                  />
                </button>
                <div id={respuestaId} hidden={!abierta} className="px-3 pb-3 text-sm text-grafito">
                  <p>{respuesta}</p>
                </div>
              </li>
            )
          })}
        </ul>
      )}
    </motion.section>
  )
}
