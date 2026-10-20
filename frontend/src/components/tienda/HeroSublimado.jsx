import { useEffect, useState } from 'react'
import { motion, useReducedMotion } from 'motion/react'
import textos from '../../data/textos.js'
import RemeraHero from './RemeraHero.jsx'

const ALTURAS_GOTAS = ['h-4', 'h-7', 'h-5', 'h-8', 'h-3', 'h-6']

const HeroSublimado = () => {
  const quieto = useReducedMotion()
  const [diseno, setDiseno] = useState(0)

  useEffect(() => {
    if (quieto) return undefined
    const ciclo = setInterval(() => {
      setDiseno((actual) => (actual + 1) % textos.hero.chips.length)
    }, 3000)
    return () => clearInterval(ciclo)
  }, [quieto])

  const numeroWhatsapp = import.meta.env.VITE_WHATSAPP
  const enlacePresupuesto = numeroWhatsapp
    ? `https://wa.me/${numeroWhatsapp}?text=${encodeURIComponent(textos.hero.botones.mensajePresupuesto)}`
    : '/catalogo'

  return (
    <section className="relative overflow-hidden bg-violeta text-white">
      <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0">
        <div className="h-2 bg-magenta" />
        <div className="absolute inset-x-0 top-2 mx-auto flex max-w-7xl justify-between px-10">
          {ALTURAS_GOTAS.map((alto, indice) => (
            <motion.span
              key={`${alto}-${indice}`}
              style={{ originY: 0 }}
              className={`w-6 rounded-b-full bg-magenta ${alto}`}
              animate={quieto ? { scaleY: 1 } : { scaleY: [0.55, 1.15] }}
              transition={
                quieto
                  ? { duration: 0 }
                  : {
                      duration: 3.2,
                      ease: 'easeInOut',
                      repeat: Infinity,
                      repeatType: 'mirror',
                      delay: indice * 0.4,
                    }
              }
            />
          ))}
        </div>
      </div>

      <div className="mx-auto flex max-w-7xl flex-col gap-10 px-5 pb-12 pt-12 md:flex-row md:items-center md:gap-10 md:pb-20 md:pt-16">
        <div className="flex-1">
          <motion.h1
            initial={quieto ? false : { y: 16, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className="-skew-x-6 font-titulos text-5xl leading-none md:text-7xl lg:text-8xl"
          >
            {textos.hero.titulo}
          </motion.h1>

          <motion.p
            initial={quieto ? false : { y: 16, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, ease: 'easeOut', delay: 0.15 }}
            className="mt-5 max-w-xl text-lg text-white/90 md:text-xl"
          >
            {textos.hero.bajada}
          </motion.p>

          <ul className="mt-8 flex flex-wrap gap-3">
            {textos.hero.chips.map((chip, indice) => (
              <li
                key={chip}
                aria-current={indice === diseno ? 'true' : undefined}
                className={`rounded-full border px-4 py-1.5 text-base font-bold ${
                  indice === diseno
                    ? 'border-magenta bg-magenta text-white'
                    : 'border-white/40 text-white/90'
                }`}
              >
                {chip}
              </li>
            ))}
          </ul>

          <div className="mt-10 flex flex-wrap gap-4">
            <a
              href="/catalogo"
              className="inline-flex min-h-11 items-center rounded-marca bg-magenta px-6 font-titulos text-white transition-colors hover:bg-magenta/90 focus-visible:ring-2 focus-visible:ring-magenta focus-visible:ring-offset-2 focus-visible:ring-offset-violeta"
            >
              {textos.hero.botones.verCatalogo}
            </a>
            <a
              href={enlacePresupuesto}
              className="inline-flex min-h-11 items-center rounded-marca border-2 border-white px-6 font-titulos text-white transition-colors hover:bg-white/10 focus-visible:ring-2 focus-visible:ring-magenta focus-visible:ring-offset-2 focus-visible:ring-offset-violeta"
            >
              {textos.hero.botones.pedirPresupuesto}
            </a>
          </div>
        </div>

        <RemeraHero diseno={diseno} quieto={quieto} />
      </div>
    </section>
  )
}

export default HeroSublimado
