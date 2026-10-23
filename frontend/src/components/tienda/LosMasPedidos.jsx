import useEmblaCarousel from 'embla-carousel-react'
import { Link } from 'react-router-dom'
import { motion, useReducedMotion } from 'motion/react'
import textos from '../../data/textos.js'
import TarjetaProducto from './TarjetaProducto.jsx'

const LosMasPedidos = ({ destacados }) => {
  const quieto = useReducedMotion()
  const [referenciaVista] = useEmblaCarousel({ align: 'start' })

  return (
    <motion.section
      initial={quieto ? false : { y: 16, opacity: 0 }}
      whileInView={{ y: 0, opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className="mx-auto max-w-6xl px-5 pb-16"
    >
      <div className="flex flex-wrap items-end justify-between gap-3 pb-6">
        <div className="relative self-start pb-2.5">
          <motion.span
            aria-hidden="true"
            initial={quieto ? false : { scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, ease: 'easeOut', delay: 0.2 }}
            style={{ originX: 0 }}
            className="absolute bottom-0 left-0 h-1.5 w-22 bg-amarillo md:h-2 md:w-30"
          />
          <h2 className="font-titulos text-3xl md:text-4xl">{textos.masPedidos.titulo}</h2>
        </div>

        <Link
          to="/catalogo"
          className="flex min-h-11 items-center rounded-marca bg-white px-4 font-titulos text-sm text-violeta shadow-tarjeta transition-colors hover:bg-gris-claro focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-magenta"
        >
          {textos.masPedidos.enlace}
          <span aria-hidden="true" className="text-magenta">
            &nbsp;›
          </span>
        </Link>
      </div>

      <div ref={referenciaVista} className="overflow-hidden">
        <div className="flex gap-4">
          {destacados.map((producto) => (
            <div
              key={producto.slug}
              className="min-w-0 flex-[0_0_100%] md:flex-[0_0_calc(50%-0.5rem)] lg:flex-[0_0_calc(25%-0.75rem)]"
            >
              <TarjetaProducto producto={producto} />
            </div>
          ))}
        </div>
      </div>
    </motion.section>
  )
}

export default LosMasPedidos
