import { useState } from 'react'
import textos from '../../data/textos.js'
import { TIPOS_FOTO, mensajeDeErrorFoto, problemaDeArchivo } from '../../utils/archivoFoto.js'

const etiquetas = textos.panel.fotos

const CLASE_CAMPO =
  'min-h-11 w-full rounded-marca border border-gris-claro bg-white px-3 text-grafito focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-magenta'

// Formulario para elegir una foto y escribir su texto alternativo (004-T36 y T41).
// Lo usan las fotos de productos y las del taller; el componente que lo usa
// decide a dónde se manda con alSubir.
const FormularioSubirFoto = ({ idBase, textoBoton = etiquetas.subir, altInicial = '', conMarcaIA = false, alSubir }) => {
  const [archivo, setArchivo] = useState(null)
  const [alt, setAlt] = useState(altInicial)
  const [generadaConIA, setGeneradaConIA] = useState(false)
  const [enviando, setEnviando] = useState(false)
  const [aviso, setAviso] = useState(null)
  const [vuelta, setVuelta] = useState(0) // cambia la key del input para vaciarlo

  const enviar = async (evento) => {
    evento.preventDefault()
    const problema = problemaDeArchivo(archivo, etiquetas) ?? (alt.trim() ? null : etiquetas.faltaAlt)
    if (problema) {
      setAviso({ tipo: 'alert', texto: problema })
      return
    }

    setEnviando(true)
    setAviso(null)
    try {
      await alSubir({ archivo, alt: alt.trim(), ...(conMarcaIA && { generadaConIA }) })
      setArchivo(null)
      setVuelta((numero) => numero + 1)
      if (!altInicial) setAlt('')
      setGeneradaConIA(false)
      setAviso({ tipo: 'status', texto: etiquetas.subida })
    } catch (error) {
      setAviso({ tipo: 'alert', texto: mensajeDeErrorFoto(error, etiquetas.error) })
    } finally {
      setEnviando(false)
    }
  }

  return (
    <form onSubmit={enviar} noValidate className="flex flex-col gap-3">
      <div className="flex flex-col gap-1 text-sm text-grafito">
        <label htmlFor={`${idBase}-archivo`} className="font-bold">{etiquetas.archivo}</label>
        <input
          key={vuelta}
          id={`${idBase}-archivo`}
          type="file"
          accept={TIPOS_FOTO.join(',')}
          onChange={(evento) => {
            setArchivo(evento.target.files?.[0] ?? null)
            setAviso(null)
          }}
          className="text-sm file:mr-3 file:min-h-11 file:rounded-marca file:border-0 file:bg-gris-claro file:px-4 file:font-bold file:text-violeta"
        />
      </div>
      <div className="flex flex-col gap-1 text-sm text-grafito">
        <label htmlFor={`${idBase}-alt`} className="font-bold">{etiquetas.alt}</label>
        <input
          id={`${idBase}-alt`}
          type="text"
          maxLength={160}
          value={alt}
          aria-describedby={`${idBase}-alt-ayuda`}
          onChange={(evento) => setAlt(evento.target.value)}
          className={CLASE_CAMPO}
        />
        <p id={`${idBase}-alt-ayuda`} className="text-xs">{etiquetas.ayudaAlt}</p>
      </div>
      {conMarcaIA && (
        <label className="flex min-h-11 items-center gap-2 text-sm text-grafito">
          <input
            type="checkbox"
            checked={generadaConIA}
            onChange={(evento) => setGeneradaConIA(evento.target.checked)}
            className="size-5 accent-violeta focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-magenta"
          />
          {etiquetas.generadaConIA}
        </label>
      )}
      {aviso && (
        <p role={aviso.tipo} className={`text-sm font-bold ${aviso.tipo === 'alert' ? 'text-error' : 'text-violeta'}`}>
          {aviso.texto}
        </p>
      )}
      <button
        type="submit"
        disabled={enviando}
        className="min-h-11 self-start rounded-marca bg-violeta px-5 font-bold text-white transition-colors hover:bg-magenta focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-magenta focus-visible:ring-offset-2 disabled:opacity-60"
      >
        {enviando ? etiquetas.subiendo : textoBoton}
      </button>
    </form>
  )
}

export default FormularioSubirFoto
