import { useState } from 'react'
import FormularioSubirFoto from './FormularioSubirFoto.jsx'
import { cambiarFotoTaller } from '../../services/api.js'
import textos from '../../data/textos.js'

const etiquetas = textos.panel.fotos

// Las dos fotos de «Nuestro taller» en el panel. Cada una se reemplaza por
// separado con «Cambiar foto». La casilla «Generado con IA» muestra cómo está
// guardada cada foto: se cambia acá y se guarda con el botón Guardar de abajo
// (o junto con la foto nueva, si se sube una).
const FotosTaller = ({ fotosIniciales, marcas, alMarcar }) => {
  const [fotos, setFotos] = useState(fotosIniciales)

  const cambiar = async (numero, foto) => {
    const respuesta = await cambiarFotoTaller(numero, { ...foto, generadaConIA: marcas[numero - 1] })
    if (Array.isArray(respuesta?.fotos)) setFotos(respuesta.fotos)
  }

  return (
    <section aria-labelledby="fotos-taller-titulo" className="my-6 flex flex-col gap-4 border-y border-gris-claro py-6">
      <div>
        <h2 id="fotos-taller-titulo" className="font-titulos text-xl text-violeta">{etiquetas.tituloTaller}</h2>
        <p className="text-sm text-grafito">{etiquetas.ayudaTaller}</p>
      </div>
      <div className="grid gap-6 md:grid-cols-2">
        {fotos.map((foto, indice) => {
          const numero = indice + 1
          const titulo = etiquetas.fotoTaller.replace('{numero}', numero)
          return (
            <article key={numero} aria-label={titulo} className="flex flex-col gap-3">
              <h3 className="font-bold text-grafito">{titulo}</h3>
              {foto.url && (
                <div className="relative">
                  <img src={foto.url} alt={foto.alt} loading="lazy" className="aspect-video w-full rounded-marca object-cover" />
                  {marcas[indice] && (
                    <span className="absolute bottom-2 left-2 rounded-marca bg-grafito/70 px-2 py-0.5 text-[10px] font-semibold text-white">
                      {textos.generadoConIA}
                    </span>
                  )}
                </div>
              )}
              <label className="flex min-h-11 items-center gap-2 text-sm text-grafito">
                <input
                  type="checkbox"
                  checked={marcas[indice]}
                  onChange={(evento) => alMarcar(indice, evento.target.checked)}
                  className="size-5 accent-violeta focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-magenta"
                />
                {etiquetas.generadaConIA}
              </label>
              <FormularioSubirFoto
                idBase={`foto-taller-${numero}`}
                textoBoton={etiquetas.cambiar}
                altInicial={foto.alt ?? ''}
                alSubir={(nueva) => cambiar(numero, nueva)}
              />
            </article>
          )
        })}
      </div>
    </section>
  )
}

export default FotosTaller
