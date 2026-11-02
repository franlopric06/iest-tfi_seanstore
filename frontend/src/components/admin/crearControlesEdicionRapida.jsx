import { BOTON_ACCION_PRINCIPAL } from '../../utils/clasesBotones.js'

const crearControlesEdicionRapida = ({
  borrador,
  etiquetas,
  resultado,
  alCambiar,
  alGuardar,
}) => [
  <label key="precio" className="flex flex-col gap-1 text-sm text-grafito">
    {etiquetas.precio}
    <input
      aria-label={etiquetas.precio}
      type="number"
      min="0"
      step="0.01"
      required
      value={borrador.precio}
      onChange={(evento) => alCambiar('precio', evento.target.value)}
      className="min-h-11 w-full rounded-marca border border-gris-claro px-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-magenta"
    />
  </label>,
  <label key="stock" className="flex flex-col gap-1 text-sm text-grafito">
    {etiquetas.stock}
    <input
      aria-label={etiquetas.stock}
      type="number"
      min="0"
      step="1"
      required
      value={borrador.stock}
      onChange={(evento) => alCambiar('stock', evento.target.value)}
      className="min-h-11 w-full rounded-marca border border-gris-claro px-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-magenta"
    />
  </label>,
  <label key="destacado" className="flex min-h-11 items-center gap-2 text-sm text-grafito">
    <input
      aria-label={etiquetas.destacado}
      type="checkbox"
      checked={borrador.destacado}
      onChange={(evento) => alCambiar('destacado', evento.target.checked)}
      className="size-5 accent-violeta focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-magenta"
    />
    {etiquetas.destacado}
  </label>,
  <div key="guardar" className="flex flex-col items-start gap-2">
    <button
      type="button"
      disabled={resultado?.cargando}
      onClick={alGuardar}
      className={BOTON_ACCION_PRINCIPAL}
    >
      {resultado?.cargando ? etiquetas.guardando : etiquetas.guardar}
    </button>
    {resultado?.exito && <p role="status" className="w-24 text-xs font-bold text-violeta">{etiquetas.guardado}</p>}
    {resultado?.error && <p role="alert" className="w-24 text-xs font-bold text-error">{etiquetas.errorGuardar}</p>}
    {resultado?.invalido && <p role="alert" className="w-24 text-xs font-bold text-error">{etiquetas.datosInvalidos}</p>}
  </div>,
]

export default crearControlesEdicionRapida
