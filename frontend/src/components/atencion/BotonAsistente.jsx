import { HelpCircle } from 'lucide-react'
import textos from '../../data/textos.js'

export default function BotonAsistente({ abierto, alAbrir, ref }) {
  return (
    <button
      type="button"
      ref={ref}
      aria-expanded={abierto}
      aria-controls="asistente-panel"
      onClick={alAbrir}
      className="fixed bottom-4 left-4 z-50 flex min-h-11 min-w-11 items-center justify-center gap-2 rounded-marca bg-amarillo px-4 font-titulos text-sm text-violeta shadow-elevada hover:bg-amarillo/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-magenta focus-visible:ring-offset-2"
    >
      <HelpCircle aria-hidden="true" size={18} />
      {textos.asistente.boton}
    </button>
  )
}
