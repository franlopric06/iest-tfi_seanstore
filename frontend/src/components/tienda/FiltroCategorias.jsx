import { Link } from 'react-router-dom'
import textos from '../../data/textos.js'

const claseChip = (marcado) =>
  `inline-flex min-h-10 md:min-h-11 items-center rounded-marca border px-3 font-bold text-sm transition-colors md:px-4 md:text-base focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-magenta focus-visible:ring-offset-2 ${
    marcado
      ? 'border-magenta bg-magenta text-white'
      : 'border-grafito/30 bg-white text-violeta hover:border-magenta hover:text-magenta'
  }`

// Chips del catálogo. «Todos» va primero y queda marcado cuando no hay
// categoría elegida, así siempre se puede volver a ver el catálogo completo.
const FiltroCategorias = ({ marcada }) => (
  <nav aria-label={textos.catalogo.filtro} className="mb-6 flex flex-wrap gap-2">
    <Link to="/catalogo" aria-current={!marcada ? 'page' : undefined} className={claseChip(!marcada)}>
      {textos.catalogo.todos}
    </Link>
    {textos.franja.categorias.map((categoria) => (
      <Link
        key={categoria.slug}
        to={`/catalogo/${categoria.slug}`}
        aria-current={categoria.slug === marcada ? 'page' : undefined}
        className={claseChip(categoria.slug === marcada)}
      >
        {categoria.nombre}
      </Link>
    ))}
  </nav>
)

export default FiltroCategorias
