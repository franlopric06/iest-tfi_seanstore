import { motion } from 'motion/react'

const Tinta = ({ extra }) => (
  <>
    <polygon points="0,110 50,10 72,10 22,110" className="fill-magenta" />
    <polygon points="34,110 84,10 100,10 50,110" className="fill-violeta" />
    <polygon points="64,110 110,20 118,20 72,110" className="fill-amarillo" />
    {extra}
  </>
)

const DisenoEstampado = ({ quieto, extra }) =>
  quieto ? (
    <Tinta extra={extra} />
  ) : (
    <motion.g
      initial={{ scaleX: 0 }}
      animate={{ scaleX: 1 }}
      style={{ originX: 0 }}
      transition={{ delay: 1.1, duration: 0.35, ease: 'easeOut' }}
    >
      <Tinta extra={extra} />
    </motion.g>
  )

const DibujoProducto = ({ id, quieto }) => {
  if (id === 'taza') {
    return (
      <svg viewBox="0 0 120 120" aria-hidden="true" className="h-24 w-24 md:h-32 md:w-32">
        <clipPath id="cinta-taza">
          <rect x="26" y="30" width="56" height="66" rx="9" />
        </clipPath>
        <path
          d="M82 44h8c9 0 14 6 14 14s-5 14-14 14h-8"
          className="fill-none stroke-violeta"
          strokeWidth="4"
        />
        <rect x="26" y="30" width="56" height="66" rx="9" className="fill-fondo" />
        <g clipPath="url(#cinta-taza)">
          <DisenoEstampado quieto={quieto} extra={<circle cx="38" cy="42" r="7" className="fill-amarillo" />} />
        </g>
        <rect x="26" y="30" width="56" height="66" rx="9" className="fill-none stroke-violeta" strokeWidth="3" />
      </svg>
    )
  }
  if (id === 'remera') {
    return (
      <svg viewBox="0 0 120 120" aria-hidden="true" className="h-24 w-24 md:h-32 md:w-32">
        <clipPath id="cinta-remera">
          <path d="M40 22 28 28 14 44 26 54 34 48 34 100 86 100 86 48 94 54 106 44 92 28 80 22C76 30 66 34 60 34 54 34 44 30 40 22Z" />
        </clipPath>
        <path
          d="M40 22 28 28 14 44 26 54 34 48 34 100 86 100 86 48 94 54 106 44 92 28 80 22C76 30 66 34 60 34 54 34 44 30 40 22Z"
          className="fill-fondo"
        />
        <g clipPath="url(#cinta-remera)">
          <DisenoEstampado quieto={quieto} />
        </g>
        <path
          d="M40 22 28 28 14 44 26 54 34 48 34 100 86 100 86 48 94 54 106 44 92 28 80 22C76 30 66 34 60 34 54 34 44 30 40 22Z"
          className="fill-none stroke-violeta"
          strokeWidth="3"
          strokeLinejoin="round"
        />
      </svg>
    )
  }
  if (id === 'gorra') {
    return (
      <svg viewBox="0 0 120 120" aria-hidden="true" className="h-24 w-24 md:h-32 md:w-32">
        <clipPath id="cinta-gorra">
          <path d="M20 78C20 48 38 30 60 30S100 48 100 78Z" />
        </clipPath>
        <path d="M60 78H112C110 86 100 90 88 90H60Z" className="fill-fondo stroke-violeta" strokeWidth="3" strokeLinejoin="round" />
        <path d="M20 78C20 48 38 30 60 30S100 48 100 78Z" className="fill-fondo" />
        <g clipPath="url(#cinta-gorra)">
          <DisenoEstampado quieto={quieto} />
        </g>
        <path d="M20 78C20 48 38 30 60 30S100 48 100 78Z" className="fill-none stroke-violeta" strokeWidth="3" />
        <circle cx="60" cy="30" r="4" className="fill-violeta" />
      </svg>
    )
  }
  if (id === 'termo') {
    return (
      <svg viewBox="0 0 120 120" aria-hidden="true" className="h-24 w-24 md:h-32 md:w-32">
        <clipPath id="cinta-termo">
          <rect x="40" y="32" width="40" height="76" rx="11" />
        </clipPath>
        <rect x="45" y="14" width="30" height="18" rx="5" className="fill-violeta" />
        <rect x="40" y="32" width="40" height="76" rx="11" className="fill-fondo" />
        <g clipPath="url(#cinta-termo)">
          <DisenoEstampado quieto={quieto} />
        </g>
        <rect x="40" y="32" width="40" height="76" rx="11" className="fill-none stroke-violeta" strokeWidth="3" />
      </svg>
    )
  }
  if (id === 'canilleras') {
    return (
      <svg viewBox="0 0 120 120" aria-hidden="true" className="h-24 w-24 md:h-32 md:w-32">
        <clipPath id="cinta-canilleras">
          <path d="M38 16H82C88 16 92 20 92 26V68C92 90 76 104 60 108 44 104 28 90 28 68V26C28 20 32 16 38 16Z" />
        </clipPath>
        <path
          d="M38 16H82C88 16 92 20 92 26V68C92 90 76 104 60 108 44 104 28 90 28 68V26C28 20 32 16 38 16Z"
          className="fill-fondo"
        />
        <g clipPath="url(#cinta-canilleras)">
          <DisenoEstampado quieto={quieto} extra={<circle cx="44" cy="36" r="7" className="fill-amarillo" />} />
        </g>
        <path
          d="M38 16H82C88 16 92 20 92 26V68C92 90 76 104 60 108 44 104 28 90 28 68V26C28 20 32 16 38 16Z"
          className="fill-none stroke-violeta"
          strokeWidth="3"
          strokeLinejoin="round"
        />
      </svg>
    )
  }
  return null
}

export default DibujoProducto
