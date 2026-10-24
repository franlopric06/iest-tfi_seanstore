import { Link } from 'react-router-dom'
import { SearchX } from 'lucide-react'
import textos from '../../data/textos.js'

const EstadoVacio = ({ frase, enlace, ruta }) => (
  <div className="flex flex-col items-center gap-4 py-10 text-center md:py-14">
    <span className="grid place-items-center rounded-full bg-gris-claro p-6 text-violeta">
      <SearchX aria-hidden="true" size={36} strokeWidth={2} />
    </span>
    <p className="max-w-72 text-base text-grafito">{frase ?? textos.catalogo.vacio.frase}</p>
    {enlace && (
      <Link
        to={ruta ?? '/catalogo'}
        className="flex min-h-11 items-center rounded-marca bg-white px-4 font-titulos text-sm text-violeta shadow-tarjeta transition-colors hover:bg-gris-claro focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-magenta"
      >
        {enlace}
        <span aria-hidden="true" className="text-magenta">
          &nbsp;›
        </span>
      </Link>
    )}
  </div>
)

export default EstadoVacio
