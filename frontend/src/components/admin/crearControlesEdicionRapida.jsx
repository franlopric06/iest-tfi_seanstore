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
      className="min-h-11 rounded-marca bg-violeta px-4 font-bold text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-magenta focus-visible:ring-offset-2 disabled:opacity-60"
    >
      {resultado?.cargando ? etiquetas.guardando : etiquetas.guardar}
    </button>
    {resultado?.exito && <p role="status">{etiquetas.guardado}</p>}
    {resultado?.error && <p role="alert">{etiquetas.errorGuardar}</p>}
    {resultado?.invalido && <p role="alert">{etiquetas.datosInvalidos}</p>}
  </div>,
]

export default crearControlesEdicionRapida
