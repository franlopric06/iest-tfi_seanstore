import { CirclePlay } from 'lucide-react'
import textos from '../../data/textos.js'

const Footer = () => (
  <footer className="bg-violeta text-white">
    <div className="mx-auto max-w-7xl space-y-6 px-5 py-10">
      <img
        src="/img/isotipo-seanstore-fondo.webp"
        alt={textos.footer.altIsotipo}
        loading="lazy"
        decoding="async"
        width="128"
        height="128"
        className="h-16 w-auto"
      />
      <p className="font-titulos text-xl">{textos.footer.descripcion}</p>
      <div>
        <h2 className="text-lg">{textos.footer.contactoTitulo}</h2>
        <p className="text-white/80">{textos.footer.contacto}</p>
      </div>
      {/* Enlace al video promocional en YouTube (consigna 4.2: el link va en el sitio). */}
      <a
        href={textos.footer.urlVideo}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={textos.footer.videoAccesible}
        className="inline-flex min-h-11 items-center gap-2 rounded-marca font-bold text-amarillo underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-magenta focus-visible:ring-offset-2 focus-visible:ring-offset-violeta"
      >
        <CirclePlay aria-hidden="true" size={22} />
        {textos.footer.video}
      </a>
      <p className="border-t border-white/30 pt-6 text-sm text-white/80">
        {textos.footer.aviso}
      </p>
    </div>
  </footer>
)

export default Footer
