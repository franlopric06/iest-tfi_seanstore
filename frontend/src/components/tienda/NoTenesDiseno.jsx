import { motion, useReducedMotion } from 'motion/react'
import textos from '../../data/textos.js'

const NoTenesDiseno = () => {
  const quieto = useReducedMotion()

  const numeroWhatsapp = import.meta.env.VITE_WHATSAPP
  const enlaceWhatsapp = numeroWhatsapp
    ? `https://wa.me/${numeroWhatsapp}?text=${encodeURIComponent(textos.sinDiseno.mensaje)}`
    : '/catalogo'

  return (
    <motion.section
      aria-labelledby="titulo-sin-diseno"
      initial={quieto ? false : { y: 16, opacity: 0 }}
      whileInView={{ y: 0, opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className="mx-auto max-w-7xl px-5 py-14 md:py-16"
    >
      <div className="rounded-marca border-2 border-violeta/20 bg-white px-5 py-10 text-center md:px-12 md:py-12">
        <div className="relative inline-block pb-2.5">
          <motion.span
            aria-hidden="true"
            initial={quieto ? false : { scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, ease: 'easeOut', delay: 0.2 }}
            style={{ originX: 0 }}
            className="absolute bottom-0 left-0 h-1.5 w-22 bg-amarillo md:h-2 md:w-30"
          />
          <h2 id="titulo-sin-diseno" className="font-titulos text-3xl text-violeta md:text-4xl">
            {textos.sinDiseno.titulo}
          </h2>
        </div>

        <p className="mx-auto mt-4 max-w-prose text-lg leading-relaxed text-grafito">
          {textos.sinDiseno.texto}
        </p>

        <a
          href={enlaceWhatsapp}
          className="mt-8 inline-flex min-h-11 items-center rounded-marca bg-whatsapp px-6 font-titulos text-whatsapp-texto transition-colors hover:bg-whatsapp/90 focus-visible:ring-2 focus-visible:ring-violeta focus-visible:ring-offset-2 focus-visible:ring-offset-fondo"
        >
          {textos.sinDiseno.boton}
        </a>
      </div>
    </motion.section>
  )
}

export default NoTenesDiseno
