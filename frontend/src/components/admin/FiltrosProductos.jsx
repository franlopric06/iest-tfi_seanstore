import { Search } from 'lucide-react'
import ListaDesplegable from '../comunes/ListaDesplegable.jsx'
import textos from '../../data/textos.js'

const etiquetas = textos.panel.productos

const CLASE_CAMPO =
  'min-h-11 w-full rounded-marca border border-gris-claro bg-white px-3 text-grafito focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-magenta'

// Buscador y filtros arriba de la tabla del panel. No guarda nada: avisa cada
// cambio con alCambiar y la lista se filtra en GestionProductos.
const FiltrosProductos = ({ filtros, categorias, alCambiar }) => {
  const cambiar = (campo) => (valor) => alCambiar({ ...filtros, [campo]: valor })

  return (
    <div role="search" className="grid gap-3 md:grid-cols-[2fr_1fr_1fr]">
      <div className="relative">
        <label htmlFor="filtro-texto" className="sr-only">{etiquetas.buscar}</label>
        <Search aria-hidden="true" size={18} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-grafito" />
        <input
          id="filtro-texto"
          type="search"
          placeholder={etiquetas.buscar}
          value={filtros.texto}
          onChange={(evento) => cambiar('texto')(evento.target.value)}
          className={`${CLASE_CAMPO} pl-10`}
        />
      </div>
      <div>
        <label htmlFor="filtro-categoria" className="sr-only">{etiquetas.filtroCategoria}</label>
        <ListaDesplegable
          id="filtro-categoria"
          valor={filtros.categoria}
          alCambiar={cambiar('categoria')}
          opciones={[
            { valor: '', texto: etiquetas.todasCategorias },
            ...categorias.map((categoria) => ({ valor: categoria, texto: categoria })),
          ]}
        />
      </div>
      <div>
        <label htmlFor="filtro-estado" className="sr-only">{etiquetas.filtroEstado}</label>
        <ListaDesplegable
          id="filtro-estado"
          valor={filtros.estado}
          alCambiar={cambiar('estado')}
          opciones={[
            { valor: 'todos', texto: etiquetas.todos },
            { valor: 'activos', texto: etiquetas.soloActivos },
            { valor: 'ocultos', texto: etiquetas.soloOcultos },
          ]}
        />
      </div>
    </div>
  )
}

export default FiltrosProductos
