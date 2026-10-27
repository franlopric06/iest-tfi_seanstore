import { AlertCircle } from 'lucide-react'
import textos from '../../data/textos.js'

const MensajeError = ({ alReintentar }) => (
  <div
    role="alert"
    className="flex flex-col items-center gap-4 py-10 text-center md:py-14"
  >
    <span className="grid place-items-center rounded-full bg-gris-claro p-6 text-violeta">
      <AlertCircle aria-hidden="true" size={36} strokeWidth={2} />
    </span>
    <p className="max-w-72 text-base text-grafito">{textos.errores.frase}</p>
    <button
      type="button"
      onClick={alReintentar}
      className="flex min-h-11 items-center justify-center rounded-marca bg-white px-6 font-titulos text-sm text-violeta shadow-tarjeta transition-colors hover:bg-gris-claro focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-magenta"
    >
      {textos.errores.boton}
    </button>
  </div>
)

export default MensajeError
