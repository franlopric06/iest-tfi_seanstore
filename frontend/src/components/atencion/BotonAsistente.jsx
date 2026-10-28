import textos from '../../data/textos.js'

export default function BotonAsistente({ abierto, alAbrir, ref }) {
  return (
    <button
      type="button"
      ref={ref}
      aria-expanded={abierto}
      aria-controls="asistente-panel"
      onClick={alAbrir}
      className="fixed bottom-4 left-4 z-50 flex min-h-11 min-w-11 items-center justify-center rounded-marca bg-violeta px-4 font-titulos text-sm text-white shadow-tarjeta hover:bg-violeta/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-magenta focus-visible:ring-offset-2"
    >
      {textos.asistente.boton}
    </button>
  )
}
