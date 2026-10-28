import textos from '../../data/textos.js'

export default function NuestroTaller() {
  return (
    <section
      aria-labelledby="nuestro-taller-titulo"
      className="mx-auto max-w-6xl px-5 py-16"
    >
      <h2
        id="nuestro-taller-titulo"
        className="mb-3 font-titulos text-3xl md:text-4xl"
      >
        {textos.nuestroTaller.titulo}
      </h2>
      <p className="mb-6 max-w-prose text-grafito">{textos.nuestroTaller.texto}</p>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {textos.nuestroTaller.fotos.map(({ src, alt }) => (
          <figure key={src} className="relative overflow-hidden rounded-marca">
            <img
              src={src}
              alt={alt}
              loading="lazy"
              decoding="async"
              width="1017"
              height="572"
              className="h-auto w-full object-cover"
            />
            <figcaption className="absolute bottom-2 left-2 rounded-marca bg-grafito/70 px-2 py-0.5 text-[10px] font-semibold text-white">
              {textos.generadoConIA}
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  )
}
