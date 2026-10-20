import { motion, useReducedMotion } from 'motion/react'
import textos from '../../data/textos.js'

const AsiDeFacil = () => {
  const quieto = useReducedMotion()

  return (
    <motion.section
      aria-labelledby="titulo-facil"
      initial={quieto ? false : { y: 16, opacity: 0 }}
      whileInView={{ y: 0, opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
    >
      <div className="-skew-y-3 bg-violeta text-white md:-skew-y-2">
        <div className="mx-auto max-w-7xl skew-y-3 px-5 py-12 md:skew-y-2 md:py-16">
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
            <h2 id="titulo-facil" className="font-titulos text-3xl md:text-4xl">
              {textos.facil.titulo}
            </h2>
          </div>

          <ol className="mt-8 grid grid-cols-2 gap-x-4 gap-y-6 md:grid-cols-4 md:gap-x-8 md:mt-10">
            {textos.facil.pasos.map((paso, indice) => (
              <li key={paso.titulo}>
                <span
                  aria-hidden="true"
                  className="font-titulos text-4xl leading-none text-amarillo md:text-5xl"
                >
                  {indice + 1}
                </span>
                <h3 className="mt-3 font-titulos text-lg md:text-xl">{paso.titulo}</h3>
                <p className="mt-2 text-sm text-white/90 md:hidden">
                  {textos.facil.pasoscorto[indice].texto}
                </p>
                <p className="mt-2 hidden text-sm text-white/90 md:block">{paso.texto}</p>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </motion.section>
  )
}

export default AsiDeFacil
