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
          fotos: datos.fotos.map(({ url, alt, generada_con_ia }) => ({ src: url, alt, ia: Boolean(generada_con_ia) })),
        }
      : {
          titulo: contenidoLocal.titulo,
          texto: contenidoLocal.texto,
          // Las fotos de respaldo son las del proyecto, hechas con IA.
          fotos: contenidoLocal.fotos.map((foto) => ({ ...foto, ia: true })),
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
        {contenido.fotos.map(({ src, alt, ia }) => (
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
            {/* La leyenda sale si la foto está marcada como generada con IA
                (se marca en el panel al subirla). */}
            {ia && (
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
