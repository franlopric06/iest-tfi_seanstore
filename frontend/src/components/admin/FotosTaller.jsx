import { useState } from 'react'
import FormularioSubirFoto from './FormularioSubirFoto.jsx'
import { cambiarFotoTaller } from '../../services/api.js'
import textos from '../../data/textos.js'

const etiquetas = textos.panel.fotos

// Las dos fotos de «Nuestro taller» en el panel (004-T41, parte de fotos).
// Cada una se reemplaza por separado; la descripción viene cargada con la
// actual para no tener que escribirla de nuevo si no cambia.
const FotosTaller = ({ fotosIniciales }) => {
  const [fotos, setFotos] = useState(fotosIniciales)

  const cambiar = async (numero, foto) => {
    const respuesta = await cambiarFotoTaller(numero, foto)
    if (Array.isArray(respuesta?.fotos)) setFotos(respuesta.fotos)
  }

  return (
    <section aria-labelledby="fotos-taller-titulo" className="flex flex-col gap-4 border-t border-gris-claro p-4 md:p-6">
      <div>
        <h2 id="fotos-taller-titulo" className="font-titulos text-xl text-violeta">{etiquetas.tituloTaller}</h2>
        <p className="text-sm text-grafito">{etiquetas.ayudaTaller}</p>
      </div>
      <div className="grid gap-6 md:grid-cols-2">
        {fotos.map((foto, indice) => {
          const numero = indice + 1
          return (
            <article key={numero} aria-label={etiquetas.fotoTaller.replace('{numero}', numero)} className="flex flex-col gap-3">
              <h3 className="font-bold text-grafito">{etiquetas.fotoTaller.replace('{numero}', numero)}</h3>
              {foto.url && (
                <img src={foto.url} alt={foto.alt} loading="lazy" className="aspect-video w-full rounded-marca object-cover" />
              )}
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
