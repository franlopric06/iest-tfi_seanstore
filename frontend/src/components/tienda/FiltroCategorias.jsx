import { Link } from 'react-router-dom'
import textos from '../../data/textos.js'

const FiltroCategorias = ({ marcada }) => (
  <nav aria-label={textos.catalogo.filtro} className="mb-6 flex flex-wrap gap-2">
    {textos.franja.categorias.map((categoria) => (
      <Link
        key={categoria.slug}
        to={`/catalogo/${categoria.slug}`}
        aria-current={categoria.slug === marcada ? 'page' : undefined}
        className={`inline-flex min-h-10 md:min-h-11 items-center rounded-marca border px-3 font-bold text-sm transition-colors md:px-4 md:text-base focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-magenta focus-visible:ring-offset-2 ${
          categoria.slug === marcada
            ? 'border-magenta bg-magenta text-white'
            : 'border-grafito/30 bg-white text-violeta hover:border-magenta hover:text-magenta'
        }`}
      >
        {categoria.nombre}
      </Link>
    ))}
  </nav>
)

export default FiltroCategorias
