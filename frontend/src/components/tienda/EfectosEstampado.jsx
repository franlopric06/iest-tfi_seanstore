import { motion } from 'motion/react'

const ANILLOS = [
  { medida: 'h-70 w-70 -ml-35 -mt-35', borde: 'border-4 border-amarillo', demora: 0 },
  { medida: 'h-60 w-60 -ml-30 -mt-30', borde: 'border-2 border-magenta', demora: 0.15 },
]

const GOTAS = [
  { pos: '-ml-15', tinta: 'h-3 w-3 bg-magenta', salto: -40, demora: 0 },
  { pos: 'ml-12.5', tinta: 'h-2.5 w-2.5 bg-amarillo', salto: 36, demora: 0.1 },
  { pos: '-ml-2.5 -mt-7.5', tinta: 'h-3.5 w-3.5 bg-white', salto: 10, demora: 0.2 },
  { pos: 'ml-22.5 mt-5', tinta: 'h-2 w-2 bg-magenta', salto: 50, demora: 0.05 },
  { pos: '-ml-25 mt-2.5', tinta: 'h-2.25 w-2.25 bg-amarillo', salto: -55, demora: 0.15 },
]

const EfectosEstampado = () => (
  <div aria-hidden="true" data-testid="efectos-estampado" className="absolute inset-0 pointer-events-none">
    {ANILLOS.map((anillo) => (
      <motion.span
        key={anillo.medida}
        className={`absolute left-1/2 top-1/2 rounded-full ${anillo.medida} ${anillo.borde}`}
        initial={{ scale: 0.85, opacity: 0 }}
        animate={{ scale: [0.85, 1.05, 1.25], opacity: [0, 1, 0] }}
        transition={{ duration: 2.5, times: [0, 0.42, 0.75], ease: 'easeOut', delay: anillo.demora }}
      />
    ))}
    {GOTAS.map((gota) => (
      <motion.span
        key={gota.pos}
        className={`absolute left-1/2 top-1/2 rounded-full ${gota.pos} ${gota.tinta}`}
        initial={{ opacity: 0, scale: 0.4 }}
        animate={{
          x: [0, gota.salto * 0.3, gota.salto],
          y: [0, -70, -130],
          scale: [0.4, 1.2, 1],
          opacity: [0, 1, 0],
        }}
        transition={{ duration: 2.5, times: [0.4, 0.5, 1], ease: 'easeOut', delay: gota.demora }}
      />
    ))}
  </div>
)

export default EfectosEstampado
