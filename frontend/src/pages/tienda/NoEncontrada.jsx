import { Link } from 'react-router-dom'
import { SearchX } from 'lucide-react'
import MetaPagina from '../../components/comunes/MetaPagina.jsx'
import textos from '../../data/textos.js'

const NoEncontrada = () => (
  <>
    <MetaPagina
      titulo={textos.noEncontrada.seo.titulo}
      descripcion={textos.noEncontrada.seo.descripcion}
      indexar={false}
    />
    <div className="flex flex-col items-center gap-4 px-5 py-10 text-center md:py-14">
    <span className="grid place-items-center rounded-full bg-gris-claro p-6 text-violeta">
      <SearchX aria-hidden="true" size={36} strokeWidth={2} />
    </span>
    <h1 className="font-titulos text-xl md:text-2xl">{textos.noEncontrada.titulo}</h1>
    <Link
      to="/catalogo"
      className="flex min-h-11 items-center rounded-marca bg-white px-4 font-titulos text-sm text-violeta shadow-tarjeta transition-colors hover:bg-gris-claro focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-magenta"
    >
      {textos.noEncontrada.enlace}
      <span aria-hidden="true" className="text-magenta">
        &nbsp;›
      </span>
    </Link>
    </div>
  </>
)

export default NoEncontrada
