import { useRef, useState } from 'react'
import Cargando from '../../components/comunes/Cargando.jsx'
import EstadoVacio from '../../components/comunes/EstadoVacio.jsx'
import MensajeError from '../../components/comunes/MensajeError.jsx'
import TablaProductos from '../../components/admin/TablaProductos.jsx'
import MetaPagina from '../../components/comunes/MetaPagina.jsx'
import useObtenerDatos from '../../hooks/useObtenerDatos.js'
import { obtenerProductosAdmin } from '../../services/api.js'
import textos from '../../data/textos.js'

const Panel = () => {
  const [pestanaActiva, setPestanaActiva] = useState('productos')
  const botonesPestanas = useRef([])
  const { cargando, datos: productos, error, reintentar } = useObtenerDatos(
    obtenerProductosAdmin,
  )
  const pestañas = [
    { id: 'productos', texto: textos.panel.pestañas.productos },
    { id: 'taller', texto: textos.panel.pestañas.taller },
  ]

  const moverPestana = (evento, indiceActual) => {
    let indiceSiguiente
    if (evento.key === 'ArrowRight') {
      indiceSiguiente = (indiceActual + 1) % pestañas.length
    } else if (evento.key === 'ArrowLeft') {
      indiceSiguiente = (indiceActual - 1 + pestañas.length) % pestañas.length
    } else {
      return
    }

    evento.preventDefault()
    const siguiente = pestañas[indiceSiguiente]
    setPestanaActiva(siguiente.id)
    botonesPestanas.current[indiceSiguiente]?.focus()
  }

  return (
    <section className="mx-auto max-w-7xl px-5 py-8">
      <MetaPagina
        titulo={`${textos.panel.titulo} · Sean's Store`}
        descripcion={textos.panel.descripcion}
        indexar={false}
      />
      <h1 className="mb-6 font-titulos text-2xl text-violeta md:text-3xl">
        {textos.panel.titulo}
      </h1>
      <div className="rounded-marca bg-white p-4 shadow-tarjeta md:p-6">
        <div
          role="tablist"
          aria-label={textos.panel.pestañas.etiqueta}
          className="flex flex-wrap gap-2 border-b border-gris-claro"
        >
          {pestañas.map((pestaña, indice) => {
            const seleccionada = pestanaActiva === pestaña.id
            return (
              <button
                key={pestaña.id}
                ref={(boton) => {
                  botonesPestanas.current[indice] = boton
                }}
                id={`tab-${pestaña.id}`}
                type="button"
                role="tab"
                aria-selected={seleccionada}
                aria-controls={`panel-${pestaña.id}`}
                tabIndex={seleccionada ? 0 : -1}
                onClick={() => setPestanaActiva(pestaña.id)}
                onKeyDown={(evento) => moverPestana(evento, indice)}
                className={`min-h-11 rounded-t-marca border-b-2 px-4 font-bold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-magenta ${
                  seleccionada
                    ? 'border-violeta text-violeta'
                    : 'border-transparent text-grafito'
                }`}
              >
                {pestaña.texto}
              </button>
            );
          })}
        </div>
        {pestañas.map((pestaña) => (
          <div
            key={pestaña.id}
            id={`panel-${pestaña.id}`}
            role="tabpanel"
            aria-labelledby={`tab-${pestaña.id}`}
            tabIndex={0}
            hidden={pestanaActiva !== pestaña.id}
          >
            {pestaña.id === 'productos' &&
              (cargando ? (
                <Cargando etiqueta={textos.panel.productos.cargando} cantidad={3} />
              ) : error ? (
                <MensajeError alReintentar={reintentar} />
              ) : productos.length === 0 ? (
                <EstadoVacio frase={textos.panel.productos.vacio} />
              ) : (
                <TablaProductos productos={productos} />
              ))}
          </div>
        ))}
      </div>
    </section>
  )
}

export default Panel
