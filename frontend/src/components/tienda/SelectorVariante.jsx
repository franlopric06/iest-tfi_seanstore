import textos from '../../data/textos'

function Chip({ nombre, elegido, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={elegido}
      className={`min-h-11 rounded-marca border px-3 text-sm font-titulos focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-magenta ${
        elegido ? 'border-magenta bg-magenta text-white' : 'border-gris-claro bg-white text-violeta'
      }`}
    >
      {nombre}
    </button>
  )
}

export function SelectorVariante({
  colores = [],
  talles = [],
  color,
  talle,
  cantidad,
  alElegirColor,
  alElegirTalle,
  alCambiarCantidad,
}) {
  return (
    <div className="grid gap-6">
      <fieldset>
        <legend className="font-titulos text-violeta">{textos.whatsapp.seccionColor}</legend>
        <div className="mt-2 flex flex-wrap gap-2">
          {colores.map((nombre) => (
            <Chip key={nombre} nombre={nombre} elegido={nombre === color} onClick={() => alElegirColor(nombre)} />
          ))}
        </div>
      </fieldset>

      {talles.length > 0 && (
        <fieldset>
          <legend className="font-titulos text-violeta">{textos.whatsapp.seccionTalle}</legend>
          <div className="mt-2 flex flex-wrap gap-2">
            {talles.map((nombre) => (
              <Chip key={nombre} nombre={nombre} elegido={nombre === talle} onClick={() => alElegirTalle(nombre)} />
            ))}
          </div>
        </fieldset>
      )}

      <div className="flex items-center gap-3">
        <label htmlFor="cantidad" className="font-titulos text-violeta">
          {textos.whatsapp.seccionCantidad}
        </label>
        <input
          id="cantidad"
          type="number"
          min="1"
          max="50"
          defaultValue={cantidad}
          key={cantidad}
          onBlur={(e) => alCambiarCantidad(e.target.value)}
          className="min-h-11 w-20 rounded-marca border border-gris-claro px-3 text-violeta focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-magenta"
        />
      </div>
    </div>
  )
}
