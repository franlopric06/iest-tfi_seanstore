import Cargando from '../../components/comunes/Cargando.jsx'
import TarjetaProducto from '../../components/tienda/TarjetaProducto.jsx'
import useObtenerDatos from '../../hooks/useObtenerDatos.js'
import { obtenerProductos } from '../../services/api.js'
import textos from '../../data/textos.js'

const Catalogo = () => {
  const { cargando, datos: productos } = useObtenerDatos(() => obtenerProductos())

  return (
    <section className="mx-auto max-w-6xl px-5 pb-16">
      <h1 className="pb-6 font-titulos text-3xl md:text-4xl">{textos.catalogo.titulo}</h1>
      {cargando ? (
        <Cargando etiqueta={textos.catalogo.cargando} />
      ) : (
        Array.isArray(productos) && (
          <ul className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
            {productos.map((producto) => (
              <li key={producto.slug}>
                <TarjetaProducto producto={producto} />
              </li>
            ))}
          </ul>
        )
      )}
    </section>
  )
}

export default Catalogo
