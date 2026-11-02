import { Search } from 'lucide-react'
import textos from '../../data/textos.js'

const etiquetas = textos.panel.productos

const CLASE_CAMPO =
  'min-h-11 w-full rounded-marca border border-gris-claro bg-white px-3 text-grafito focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-magenta'

// Buscador y filtros arriba de la tabla del panel. No guarda nada: avisa cada
// cambio con alCambiar y la lista se filtra en GestionProductos.
const FiltrosProductos = ({ filtros, categorias, alCambiar }) => {
  const cambiar = (campo) => (evento) => alCambiar({ ...filtros, [campo]: evento.target.value })

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
          onChange={cambiar('texto')}
          className={`${CLASE_CAMPO} pl-10`}
        />
      </div>
      <div>
        <label htmlFor="filtro-categoria" className="sr-only">{etiquetas.filtroCategoria}</label>
        <select id="filtro-categoria" value={filtros.categoria} onChange={cambiar('categoria')} className={CLASE_CAMPO}>
          <option value="">{etiquetas.todasCategorias}</option>
          {categorias.map((categoria) => (
            <option key={categoria} value={categoria}>{categoria}</option>
          ))}
        </select>
      </div>
      <div>
        <label htmlFor="filtro-estado" className="sr-only">{etiquetas.filtroEstado}</label>
        <select id="filtro-estado" value={filtros.estado} onChange={cambiar('estado')} className={CLASE_CAMPO}>
          <option value="todos">{etiquetas.todos}</option>
          <option value="activos">{etiquetas.soloActivos}</option>
          <option value="ocultos">{etiquetas.soloOcultos}</option>
        </select>
      </div>
    </div>
  )
}

export default FiltrosProductos
