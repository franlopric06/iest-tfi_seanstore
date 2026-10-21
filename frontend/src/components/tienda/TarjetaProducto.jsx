import { motion, useReducedMotion } from 'motion/react'
import { Link } from 'react-router-dom'
import formatearPrecio from '../../utils/formatearPrecio.js'

const PasadaTinta = () => (
  <span aria-hidden="true" className="pointer-events-none absolute inset-y-0 left-0 flex w-1/2 gap-2.5 -skew-x-12 -translate-x-full opacity-85 transition-transform duration-500 ease-out group-hover:translate-x-[300%]">
    <span className="flex-1 basis-2/5 bg-magenta" />
    <span className="flex-1 basis-2/5 bg-violeta" />
    <span className="flex-1 basis-1/5 bg-amarillo opacity-90" />
  </span>
)

const TarjetaProducto = ({ producto }) => {
  const quieto = useReducedMotion()

  return (
    <motion.article
      whileHover={quieto ? undefined : { y: -6 }}
      transition={{ type: 'spring', stiffness: 300, damping: 22 }}
      className="group bg-white rounded-marca shadow-tarjeta hover:shadow-elevada"
    >
      <Link
        to={`/producto/${producto.slug}`}
        className="block rounded-marca outline-none focus-visible:ring-2 focus-visible:ring-magenta focus-visible:ring-offset-2"
      >
        {producto.foto && (
          <div className="relative overflow-hidden rounded-t-marca">
            <img
              src={producto.foto.url}
              alt={producto.foto.alt}
              loading="lazy"
              className={`aspect-square w-full object-cover ${quieto ? '' : 'duration-500 transition-transform group-hover:scale-[1.04]'}`}
            />
            {!quieto && <PasadaTinta />}
          </div>
        )}
        <div className="flex flex-col gap-2.5 p-4">
          <span className="bg-amarillo px-3 py-1 rounded-full self-start text-violeta text-xs font-extrabold">
            Personalizable
          </span>
          <h3 className="truncate">{producto.nombre}</h3>
          <p className="text-magenta text-xl font-bold md:text-2xl">
            {formatearPrecio(producto.precio)}
          </p>
          {producto.stock === 0 && (
            <span className="bg-error px-3 py-1 rounded-full self-start text-white text-xs font-extrabold">
              Sin stock
            </span>
          )}
        </div>
      </Link>
    </motion.article>
  )
}

export default TarjetaProducto
