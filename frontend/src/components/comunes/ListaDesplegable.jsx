import { useEffect, useId, useRef, useState } from 'react'
import { Check, ChevronDown } from 'lucide-react'

// Lista desplegable con el estilo de la tienda, en lugar del <select> del
// navegador (que se ve distinto en cada sistema). Sigue el patrón accesible
// «combobox de solo selección»: se abre con clic, Enter, espacio o flechas;
// se recorre con flechas, Inicio y Fin; Enter elige y Escape cierra. El foco
// queda siempre en el botón y aria-activedescendant indica la opción marcada.
//
// opciones: [{ valor, texto }]. textoVacio se muestra cuando no hay nada elegido.
const ListaDesplegable = ({
  id,
  opciones,
  valor,
  alCambiar,
  textoVacio = '',
  deshabilitada = false,
  invalida = false,
  describedBy,
}) => {
  const [abierta, setAbierta] = useState(false)
  const [activa, setActiva] = useState(0)
  const contenedor = useRef(null)
  const idLista = `${useId()}-lista`
  const elegida = opciones.find((opcion) => opcion.valor === valor)
  const indiceElegida = Math.max(0, opciones.indexOf(elegida))

  // Cierra si se hace clic afuera.
  useEffect(() => {
    if (!abierta) return undefined
    const alTocarAfuera = (evento) => {
      if (!contenedor.current?.contains(evento.target)) setAbierta(false)
    }
    document.addEventListener('mousedown', alTocarAfuera)
    return () => document.removeEventListener('mousedown', alTocarAfuera)
  }, [abierta])

  const abrir = () => {
    setActiva(indiceElegida)
    setAbierta(true)
  }

  const elegir = (indice) => {
    alCambiar(opciones[indice].valor)
    setAbierta(false)
  }

  const alTeclear = (evento) => {
    const ultima = opciones.length - 1
    const mover = { ArrowDown: Math.min(activa + 1, ultima), ArrowUp: Math.max(activa - 1, 0), Home: 0, End: ultima }
    if (!abierta) {
      if (['ArrowDown', 'ArrowUp', 'Enter', ' '].includes(evento.key)) {
        evento.preventDefault()
        abrir()
      }
      return
    }
    if (evento.key in mover) {
      evento.preventDefault()
      setActiva(mover[evento.key])
    } else if (evento.key === 'Enter' || evento.key === ' ') {
      evento.preventDefault()
      elegir(activa)
    } else if (evento.key === 'Escape' || evento.key === 'Tab') {
      setAbierta(false)
    }
  }

  return (
    <div ref={contenedor} className="relative">
      <button
        id={id}
        type="button"
        role="combobox"
        aria-haspopup="listbox"
        aria-expanded={abierta}
        aria-controls={idLista}
        aria-activedescendant={abierta ? `${idLista}-${activa}` : undefined}
        aria-invalid={invalida || undefined}
        aria-describedby={describedBy}
        disabled={deshabilitada}
        onClick={() => (abierta ? setAbierta(false) : abrir())}
        onKeyDown={alTeclear}
        className="flex min-h-11 w-full items-center justify-between gap-2 rounded-marca border border-gris-claro bg-white px-3 text-left text-grafito transition-colors hover:border-violeta focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-magenta disabled:cursor-not-allowed disabled:opacity-60"
      >
        <span className={`truncate ${elegida ? '' : 'text-grafito/60'}`}>{elegida?.texto ?? textoVacio}</span>
        <ChevronDown aria-hidden="true" size={18} className={`shrink-0 text-violeta transition-transform ${abierta ? 'rotate-180' : ''}`} />
      </button>
      {abierta && (
        <ul
          id={idLista}
          role="listbox"
          aria-labelledby={id}
          className="absolute z-20 mt-1 max-h-64 w-full overflow-auto rounded-marca border border-gris-claro bg-white py-1 shadow-elevada"
        >
          {opciones.map((opcion, indice) => {
            const seleccionada = opcion.valor === valor
            return (
              <li
                key={opcion.valor}
                id={`${idLista}-${indice}`}
                role="option"
                aria-selected={seleccionada}
                onMouseDown={(evento) => evento.preventDefault()}
                onMouseEnter={() => setActiva(indice)}
                onClick={() => elegir(indice)}
                className={`flex min-h-11 cursor-pointer items-center justify-between gap-2 px-3 text-grafito ${
                  indice === activa ? 'bg-gris-claro' : ''
                } ${seleccionada ? 'font-bold text-violeta' : ''}`}
              >
                {opcion.texto}
                {seleccionada && <Check aria-hidden="true" size={16} className="shrink-0 text-magenta" />}
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}

export default ListaDesplegable
