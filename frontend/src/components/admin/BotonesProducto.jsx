import textos from '../../data/textos.js'

const etiquetas = textos.panel.productos

const CLASE_BOTON =
  'min-h-11 rounded-marca border border-violeta bg-white px-4 text-sm font-bold text-violeta transition-colors hover:bg-gris-claro focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-magenta disabled:opacity-60'

// Botones «Editar» y «Ocultar»/«Mostrar» de cada producto (004-T28).
// El nombre del producto va en aria-label para que el lector de pantalla
// sepa a qué fila corresponde cada botón.
const BotonesProducto = ({ producto, ocupado, alEditar, alCambiarEstado }) => {
  const textoEstado = producto.activo ? etiquetas.ocultar : etiquetas.mostrar

  return (
    <div className="flex flex-wrap gap-2">
      <button
        type="button"
        aria-label={`${etiquetas.editar} ${producto.nombre}`}
        onClick={() => alEditar(producto)}
        className={CLASE_BOTON}
      >
        {etiquetas.editar}
      </button>
      <button
        type="button"
        aria-label={`${textoEstado} ${producto.nombre}`}
        disabled={ocupado}
        onClick={() => alCambiarEstado(producto)}
        className={CLASE_BOTON}
      >
        {textoEstado}
      </button>
    </div>
  )
}

export default BotonesProducto
