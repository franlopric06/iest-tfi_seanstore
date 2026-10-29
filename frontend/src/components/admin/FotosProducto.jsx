import { useState } from 'react'
import Cargando from '../comunes/Cargando.jsx'
import MensajeError from '../comunes/MensajeError.jsx'
import FormularioSubirFoto from './FormularioSubirFoto.jsx'
import useObtenerDatos from '../../hooks/useObtenerDatos.js'
import {
  borrarFotoProducto,
  elegirFotoPrincipal,
  obtenerFotosProducto,
  subirFotoProducto,
} from '../../services/api.js'
import textos from '../../data/textos.js'

const etiquetas = textos.panel.fotos

const CLASE_BOTON =
  'min-h-11 rounded-marca border border-violeta bg-white px-3 text-sm font-bold text-violeta hover:bg-gris-claro focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-magenta disabled:opacity-60'

// Fotos de un producto en el panel (004-T36): ver las que tiene, subir una
// nueva, borrar y elegir la principal. Borrar pide confirmar en la misma
// tarjeta, sin ventanas emergentes del navegador.
const FotosProducto = ({ producto, alCambiar }) => {
  const { cargando, datos: fotos, error, reintentar } = useObtenerDatos(
    () => obtenerFotosProducto(producto.id),
    [producto.id],
  )
  const [confirmando, setConfirmando] = useState(null)
  const [ocupado, setOcupado] = useState(false)
  const [aviso, setAviso] = useState(null)

  const hacer = async (accion, textoExito) => {
    setOcupado(true)
    setAviso(null)
    try {
      await accion()
      setAviso({ tipo: 'status', texto: textoExito })
      reintentar()
      alCambiar?.()
    } catch {
      setAviso({ tipo: 'alert', texto: etiquetas.error })
    } finally {
      setOcupado(false)
      setConfirmando(null)
    }
  }

  const subir = async (foto) => {
    await subirFotoProducto(producto.id, foto)
    reintentar()
    alCambiar?.()
  }

  return (
    <section aria-labelledby="fotos-producto-titulo" className="flex flex-col gap-4 rounded-marca border border-gris-claro p-4 md:p-6">
      <div>
        <h2 id="fotos-producto-titulo" className="font-titulos text-lg text-violeta">
          {etiquetas.titulo}: {producto.nombre}
        </h2>
        <p className="text-sm text-grafito">{etiquetas.ayuda}</p>
      </div>
      {cargando && <Cargando etiqueta={etiquetas.cargando} cantidad={1} />}
      {error && <MensajeError alReintentar={reintentar} />}
      {!cargando && !error && fotos.length === 0 && <p className="text-sm text-grafito">{etiquetas.sinFotos}</p>}
      {!cargando && !error && fotos.length > 0 && (
        <ul aria-label={etiquetas.titulo} className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          {fotos.map((foto) => (
            <li key={foto.id} className="flex flex-col gap-2 rounded-marca bg-white p-2 shadow-tarjeta">
              <div className="relative">
                <img src={foto.url} alt={foto.alt} loading="lazy" className="aspect-square w-full rounded-marca object-cover" />
                {foto.generada_con_ia && (
                  <span className="absolute bottom-1 left-1 rounded-marca bg-grafito/70 px-1.5 text-[10px] font-semibold text-white">
                    {textos.generadoConIA}
                  </span>
                )}
              </div>
              {foto.orden === 1 ? (
                <p className="text-sm font-bold text-violeta">{etiquetas.principal}</p>
              ) : (
                <button type="button" disabled={ocupado} onClick={() => hacer(() => elegirFotoPrincipal(foto.id), etiquetas.cambiada)} className={CLASE_BOTON}>
                  {etiquetas.hacerPrincipal}
                </button>
              )}
              {confirmando === foto.id ? (
                <div className="flex flex-wrap gap-2">
                  <button type="button" disabled={ocupado} onClick={() => hacer(() => borrarFotoProducto(foto.id), etiquetas.borrada)} className="min-h-11 rounded-marca bg-error px-3 text-sm font-bold text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-magenta disabled:opacity-60">
                    {etiquetas.confirmarBorrar}
                  </button>
                  <button type="button" onClick={() => setConfirmando(null)} className={CLASE_BOTON}>{etiquetas.cancelar}</button>
                </div>
              ) : (
                <button type="button" aria-label={`${etiquetas.borrar}: ${foto.alt}`} onClick={() => setConfirmando(foto.id)} className={CLASE_BOTON}>
                  {etiquetas.borrar}
                </button>
              )}
            </li>
          ))}
        </ul>
      )}
      {aviso && (
        <p role={aviso.tipo} className={`text-sm font-bold ${aviso.tipo === 'alert' ? 'text-error' : 'text-violeta'}`}>
          {aviso.texto}
        </p>
      )}
      <FormularioSubirFoto idBase={`foto-producto-${producto.id}`} conMarcaIA alSubir={subir} />
    </section>
  )
}

export default FotosProducto
