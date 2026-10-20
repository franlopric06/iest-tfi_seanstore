import { AnimatePresence, motion } from 'motion/react'
import textos from '../../data/textos.js'

const RemeraHero = ({ diseno, quieto }) => (
  <div className="flex flex-1 items-center justify-center">
    <div className="flex aspect-square w-72 items-center justify-center rounded-full bg-white/10 md:w-96">
      <motion.div
        initial={false}
        animate={quieto ? { y: 0, rotate: 0 } : { y: [-5, 5, -5], rotate: [-2, 2, -2] }}
        transition={quieto ? { duration: 0 } : { duration: 6, ease: 'easeInOut', repeat: Infinity }}
        className="h-56 md:h-80"
      >
        <svg
          role="img"
          aria-label={textos.hero.disenos[diseno].altRemera}
          viewBox="0 0 220 200"
          className="h-full w-auto"
        >
          <path
            className="fill-white"
            d="M 78 30 L 40 48 L 26 84 L 58 96 L 62 84 L 62 178 Q 110 190 158 178 L 158 84 L 162 96 L 194 84 L 180 48 L 142 30 Q 110 44 78 30 Z"
          />
          <path
            className="fill-none stroke-violeta/15"
            strokeWidth="3"
            d="M 84 33 Q 110 47 136 33"
          />
          <AnimatePresence mode="wait" initial={false}>
            <motion.g
              key={diseno}
              initial={quieto ? false : { y: -10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={quieto ? { opacity: 1 } : { opacity: 0 }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
            >
              {diseno === 0 && (
                <>
                  <rect x="84" y="74" width="52" height="48" rx="4" className="fill-violeta/10" />
                  <circle cx="97" cy="89" r="5" className="fill-amarillo" />
                  <path
                    className="fill-violeta/50"
                    d="M 84 108 Q 96 96 110 104 Q 124 112 136 100 L 136 122 L 84 122 Z"
                  />
                  <path
                    className="fill-magenta/60"
                    d="M 100 122 Q 118 108 136 116 L 136 122 Z"
                  />
                  <rect
                    x="84"
                    y="74"
                    width="52"
                    height="48"
                    rx="4"
                    className="fill-none stroke-violeta/30"
                    strokeWidth="1.5"
                  />
                </>
              )}
              {diseno === 1 && (
                <>
                  <text
                    x="110"
                    y="102"
                    textAnchor="middle"
                    fontSize="26"
                    className="fill-violeta font-titulos"
                  >
                    10
                  </text>
                  <text
                    x="110"
                    y="118"
                    textAnchor="middle"
                    fontSize="8"
                    className="fill-magenta font-titulos"
                  >
                    Tu nombre
                  </text>
                </>
              )}
              {diseno === 2 && (
                <>
                  <text
                    x="110"
                    y="92"
                    textAnchor="middle"
                    fontSize="9.5"
                    className="fill-violeta font-titulos"
                  >
                    Feliz día,
                  </text>
                  <text
                    x="110"
                    y="106"
                    textAnchor="middle"
                    fontSize="9.5"
                    className="fill-violeta font-titulos"
                  >
                    ma
                  </text>
                  <rect
                    x="88"
                    y="110"
                    width="44"
                    height="3"
                    rx="1.5"
                    className="fill-amarillo"
                  />
                </>
              )}
              {diseno === 3 && (
                <>
                  <rect
                    x="88"
                    y="84"
                    width="44"
                    height="28"
                    rx="4"
                    className="fill-none stroke-violeta"
                    strokeWidth="1.5"
                    strokeDasharray="5 4"
                  />
                  <text
                    x="110"
                    y="102"
                    textAnchor="middle"
                    fontSize="10"
                    className="fill-violeta font-titulos"
                  >
                    Tu logo
                  </text>
                </>
              )}
            </motion.g>
          </AnimatePresence>
        </svg>
      </motion.div>
    </div>
  </div>
)

export default RemeraHero
