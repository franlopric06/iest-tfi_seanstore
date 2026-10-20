import { motion } from 'motion/react'
import DibujoProducto from './DibujoProducto.jsx'

const SelloPieza = ({ cosa, quieto }) => (
  <article className="flex h-50 w-45 flex-col items-center justify-center gap-1.5 rounded-marca bg-white px-3 py-5 shadow-elevada">
    <DibujoProducto id={cosa.id} quieto={quieto} />
    <p className="text-sm font-bold text-violeta">{cosa.nombre}</p>
  </article>
)

const PiezaCinta = ({ cosa, quieto }) => {
  if (quieto) {
    return <SelloPieza cosa={cosa} quieto />
  }
  return (
    <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
      <motion.div
        animate={{
          x: [460, 0, 0, -460],
          y: [-210, 0, 0, 210],
          rotate: [10, 0, 0, -10],
          scale: [0.7, 1.1, 1.1, 0.7],
        }}
        transition={{ duration: 2.5, times: [0, 0.45, 0.55, 1], ease: 'easeInOut' }}
      >
        <motion.div
          animate={{ opacity: [0, 1, 0.9, 0] }}
          transition={{ duration: 2.5, times: [0, 0.12, 0.86, 1], ease: 'linear' }}
        >
          <SelloPieza cosa={cosa} quieto={quieto} />
        </motion.div>
      </motion.div>
    </div>
  )
}

export default PiezaCinta
