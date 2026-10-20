import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, useReducedMotion } from 'motion/react'
import textos from '../../data/textos.js'
import PiezaCinta from './PiezaCinta.jsx'
import EfectosEstampado from './EfectosEstampado.jsx'

const CintaProductos = () => {
  const quieto = useReducedMotion()
  const [indice, setIndice] = useState(0)

  useEffect(() => {
    if (quieto) return undefined
    const ciclo = setInterval(() => {
      setIndice((actual) => (actual + 1) % textos.cinta.productos.length)
    }, 2500)
    return () => clearInterval(ciclo)
  }, [quieto])

  const piezaActual = quieto
    ? textos.cinta.productos[textos.cinta.productos.length - 1]
    : textos.cinta.productos[indice]

  return (
    <motion.section
      initial={quieto ? false : { y: 16, opacity: 0 }}
      whileInView={{ y: 0, opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className="mx-auto max-w-7xl px-5"
    >
      <div className="flex flex-col items-center gap-10 pb-10 pt-16 md:flex-row md:pb-6 md:pt-22">
        <div className="flex-1">
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
            <h2 className="font-titulos text-3xl md:text-4xl">{textos.cinta.titulo}</h2>
          </div>

          <p className="mt-4 max-w-prose text-lg leading-relaxed text-grafito">
            {textos.cinta.frase}
          </p>

          <nav aria-label="Ir a las categorías" className="mt-4 grid grid-cols-2 gap-2.5">
            {textos.franja.categorias.map(({ nombre, slug }) => (
              <Link
                key={slug}
                to={`/catalogo/${slug}`}
                className="flex min-h-11 items-center justify-between gap-2 rounded-marca bg-white px-3.5 font-titulos text-sm text-violeta shadow-tarjeta transition-colors hover:bg-gris-claro focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-magenta md:min-h-12"
              >
                {nombre}
                <span aria-hidden="true" className="text-magenta">
                  ›
                </span>
              </Link>
            ))}
          </nav>
        </div>

        <div
          role="img"
          aria-label={textos.cinta.etiqueta}
          className="relative h-100 w-full md:h-135 md:flex-[1.7]"
        >
          <div aria-hidden="true" className="absolute bottom-18 left-1/6 h-3 w-30 -skew-x-12 bg-amarillo" />
          <div className="absolute inset-x-8 inset-y-6 overflow-hidden rounded-marca bg-violeta -skew-x-12 md:inset-x-18 md:inset-y-7">
            <div className="absolute inset-0 skew-x-12">
              {!quieto && <EfectosEstampado key={`efectos-${indice}`} />}
              <PiezaCinta key={`pieza-${indice}`} cosa={piezaActual} quieto={quieto} />
            </div>
          </div>
        </div>
      </div>
    </motion.section>
  )
}

export default CintaProductos
