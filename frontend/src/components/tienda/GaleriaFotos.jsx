import { useState } from 'react'

const GaleriaFotos = ({ fotos }) => {
  const [indice, setIndice] = useState(0)

  if (!fotos || fotos.length === 0) return null

  const fotosOrdenadas = [...fotos].sort((a, b) => a.orden - b.orden)
  const principal = fotosOrdenadas[indice]

  return (
    <div className="flex flex-col gap-3">
      <div className="overflow-hidden rounded-marca bg-gris-claro">
        <img
          src={principal.url}
          alt={principal.alt}
          className="aspect-square w-full object-cover"
        />
      </div>

      {fotosOrdenadas.length > 1 && (
        <div className="flex gap-2">
          {fotosOrdenadas.map((foto, i) => (
            <button
              key={foto.orden}
              aria-label={foto.alt}
              aria-pressed={i === indice}
              onClick={() => setIndice(i)}
              className={`overflow-hidden rounded-marca border-2 transition-colors ${
                i === indice
                  ? 'border-magenta'
                  : 'border-transparent hover:border-gris-claro focus-visible:border-magenta'
              } outline-none focus-visible:ring-2 focus-visible:ring-magenta focus-visible:ring-offset-1`}
            >
              <img
                src={foto.url}
                alt=""
                className="aspect-square w-16 object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

export default GaleriaFotos
