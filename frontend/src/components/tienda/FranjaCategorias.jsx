import { Fragment, useEffect, useRef } from 'react'
import { MessageCircle, ShieldCheck, Truck } from 'lucide-react'
import { motion, useAnimate, useReducedMotion } from 'motion/react'
import textos from '../../data/textos.js'

const DURACION_CINTA = 32
const MEDIAS_CINTA = 3

const ICONO_SELLOS = [ShieldCheck, Truck, MessageCircle]

const MitadCinta = ({ oculta }) => (
  <div
    aria-hidden={oculta ? 'true' : undefined}
    className="flex shrink-0 items-center"
  >
    {[...textos.franja.categorias, ...textos.franja.categorias].map(({ nombre, slug }, indice) => (
      <Fragment key={`${nombre}-${indice}`}>
        <a
          href={`/catalogo/${slug}`}
          tabIndex={oculta ? -1 : undefined}
          className="whitespace-nowrap px-5 text-white transition-colors hover:bg-magenta/90 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violeta"
        >
          {nombre}
        </a>
        <span aria-hidden="true" className="text-amarillo">
          /
        </span>
      </Fragment>
    ))}
  </div>
)

const FranjaCategorias = () => {
  const quieto = useReducedMotion()
  const [referenciaCinta, animarCinta] = useAnimate()
  const controlesCinta = useRef(null)

  useEffect(() => {
    if (quieto) return undefined
    const controles = animarCinta(
      referenciaCinta.current,
      { x: ['0%', '-33.333%'] },
      { duration: DURACION_CINTA, ease: 'linear', repeat: Infinity },
    )
    controlesCinta.current = controles
    return () => controles.stop()
  }, [animarCinta, quieto, referenciaCinta])

  const pausarCinta = () => controlesCinta.current?.pause()
  const continuarCinta = () => controlesCinta.current?.play()

  return (
    <motion.section
      initial={quieto ? false : { y: 16, opacity: 0 }}
      whileInView={{ y: 0, opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className="bg-linear-to-b from-violeta from-50% to-fondo to-50%"
    >
      <nav
        aria-label="Categorías del catálogo"
        onPointerEnter={pausarCinta}
        onPointerLeave={continuarCinta}
        onFocus={pausarCinta}
        onBlur={continuarCinta}
        className="font-titulos text-lg md:text-2xl"
      >
        <div className="-skew-y-3 overflow-hidden bg-magenta py-3 md:-skew-y-2 md:py-5">
          <div ref={referenciaCinta} className="flex w-max items-center">
            {Array.from({ length: MEDIAS_CINTA }, (_, media) => (
              <MitadCinta key={media} oculta={media > 0} />
            ))}
          </div>
        </div>
      </nav>

      <ul className="-skew-y-3 md:-skew-y-2 grid grid-cols-3 gap-2 bg-white px-5 py-3 text-violeta md:flex md:flex-wrap md:items-center md:justify-center md:gap-x-10 md:gap-y-4 md:py-6">
        {textos.franja.sellos.map((sello, indice) => {
          const Icono = ICONO_SELLOS[indice]
          return (
            <li
              key={sello}
              className="flex flex-col items-center gap-1 text-center md:flex-row md:gap-2 md:text-left"
            >
              <Icono aria-hidden="true" className="h-4 w-4 shrink-0 md:h-6 md:w-6" />
              <span className="text-[10px] font-bold leading-tight md:text-base md:leading-normal">
                {sello}
              </span>
            </li>
          )
        })}
      </ul>
    </motion.section>
  )
}

export default FranjaCategorias
