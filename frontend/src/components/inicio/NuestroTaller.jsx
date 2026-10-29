import textos from '../../data/textos.js'
import useObtenerDatos from '../../hooks/useObtenerDatos.js'
import { obtenerTaller } from '../../services/api.js'

const contenidoLocal = textos.nuestroTaller

const NuestroTaller = () => {
  const { datos } = useObtenerDatos(obtenerTaller)

  const contenido =
    datos && Array.isArray(datos.fotos) && datos.fotos.length > 0
      ? {
          titulo: datos.titulo,
          texto: datos.parrafo,
          fotos: datos.fotos.map(({ url, alt }) => ({ src: url, alt })),
        }
      : {
          titulo: contenidoLocal.titulo,
          texto: contenidoLocal.texto,
          fotos: contenidoLocal.fotos,
        }

  return (
    <section
      aria-labelledby="nuestro-taller-titulo"
      className="mx-auto max-w-6xl px-5 py-16"
    >
      <h2
        id="nuestro-taller-titulo"
        className="mb-3 font-titulos text-3xl md:text-4xl"
      >
        {contenido.titulo}
      </h2>
      <p className="mb-6 max-w-prose text-grafito">{contenido.texto}</p>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {contenido.fotos.map(({ src, alt }) => (
          <figure key={src} className="relative overflow-hidden rounded-marca">
            <img
              src={src}
              alt={alt}
              loading="lazy"
              decoding="async"
              width="1017"
              height="572"
              className="aspect-video h-auto w-full object-cover"
            />
            {/* Las fotos del proyecto (/img/...) se hicieron con IA; las que sube
                el negocio desde el panel son fotos reales y no llevan la leyenda. */}
            {src.startsWith('/') && (
              <figcaption className="absolute bottom-2 left-2 rounded-marca bg-grafito/70 px-2 py-0.5 text-[10px] font-semibold text-white">
                {textos.generadoConIA}
              </figcaption>
            )}
          </figure>
        ))}
      </div>
    </section>
  )
}

export default NuestroTaller
