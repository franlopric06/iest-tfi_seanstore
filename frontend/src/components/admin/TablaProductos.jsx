import { useState } from 'react'
import { editarRapidoProducto } from '../../services/api.js'
import textos from '../../data/textos.js'
import FotoProductoAdmin from './FotoProductoAdmin.jsx'
import crearControlesEdicionRapida from './crearControlesEdicionRapida.jsx'

const TablaProductos = ({ productos }) => {
  const [borradores, setBorradores] = useState({})
  const [resultados, setResultados] = useState({})
  const etiquetas = textos.panel.productos

  const borradorInicial = (producto) => ({
    precio: String(producto.precio),
    stock: String(producto.stock),
    destacado: producto.destacado,
  })

  const obtenerBorrador = (producto) =>
    borradores[producto.id] ?? borradorInicial(producto)

  const actualizar = (producto, campo, valor) => {
    setBorradores((anteriores) => ({
      ...anteriores,
      [producto.id]: {
        ...(anteriores[producto.id] ?? borradorInicial(producto)),
        [campo]: valor,
      },
    }))
    setResultados((anteriores) => ({ ...anteriores, [producto.id]: null }))
  }

  const guardar = async (producto) => {
    const borrador = obtenerBorrador(producto)
    if (
      borrador.precio.trim() === '' ||
      borrador.stock.trim() === '' ||
      !Number.isFinite(Number(borrador.precio)) ||
      Number(borrador.precio) < 0 ||
      !Number.isInteger(Number(borrador.stock)) ||
      Number(borrador.stock) < 0
    ) {
      setResultados((anteriores) => ({
        ...anteriores,
        [producto.id]: { invalido: true },
      }))
      return
    }

    setResultados((anteriores) => ({
      ...anteriores,
      [producto.id]: { cargando: true },
    }))

    try {
      await editarRapidoProducto(producto.id, {
        precio: Number(borrador.precio),
        stock: Number(borrador.stock),
        destacado: borrador.destacado,
      })
      setResultados((anteriores) => ({
        ...anteriores,
        [producto.id]: { exito: true },
      }))
    } catch {
      setResultados((anteriores) => ({
        ...anteriores,
        [producto.id]: { error: true },
      }))
    }
  }

  const controles = (producto) =>
    crearControlesEdicionRapida({
      borrador: obtenerBorrador(producto),
      etiquetas,
      resultado: resultados[producto.id],
      alCambiar: (campo, valor) => actualizar(producto, campo, valor),
      alGuardar: () => guardar(producto),
    })

  return (
    <div className="space-y-4">
      <div className="hidden overflow-x-auto md:block">
        <table aria-label="Productos" className="w-full border-collapse text-left">
          <thead>
            <tr className="border-b border-gris-claro text-sm text-grafito">
              <th className="p-3" scope="col">{etiquetas.foto}</th>
              <th className="p-3" scope="col">{etiquetas.producto}</th>
              <th className="p-3" scope="col">{etiquetas.codigo}</th>
              <th className="p-3" scope="col">{etiquetas.categoria}</th>
              <th className="p-3" scope="col">{etiquetas.precio}</th>
              <th className="p-3" scope="col">{etiquetas.stock}</th>
              <th className="p-3" scope="col">{etiquetas.destacado}</th>
              <th className="p-3" scope="col">{etiquetas.estado}</th>
              <th className="p-3" scope="col">{etiquetas.accion}</th>
            </tr>
          </thead>
          <tbody>
            {productos.map((producto) => {
              const [precio, stock, destacado, guardar] = controles(producto)
              return (
                <tr key={producto.id} className="border-b border-gris-claro align-middle">
                  <td className="p-3"><FotoProductoAdmin producto={producto} /></td>
                  <th className="p-3" scope="row">{producto.nombre}</th>
                  <td className="p-3">{producto.codigo}</td>
                  <td className="p-3">{producto.categoria?.nombre}</td>
                  <td className="p-3">{precio}</td>
                  <td className="p-3">{stock}</td>
                  <td className="p-3">{destacado}</td>
                  <td className="p-3">{producto.activo ? etiquetas.activo : etiquetas.oculto}</td>
                  <td className="p-3">{guardar}</td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
      <ul aria-label="Productos en tarjetas" className="flex flex-col gap-4 md:hidden">
        {productos.map((producto) => (
          <li key={producto.id}>
            <article
              aria-label={`Tarjeta de ${producto.nombre}`}
              className="flex flex-col gap-3 rounded-marca bg-fondo p-4 shadow-tarjeta"
            >
              <div className="flex items-center gap-3">
                <FotoProductoAdmin producto={producto} />
                <div>
                  <h2 className="font-titulos text-base text-violeta">{producto.nombre}</h2>
                  <p className="text-sm text-grafito">{producto.codigo}</p>
                  <p className="text-sm text-grafito">{producto.categoria?.nombre}</p>
                </div>
              </div>
              <p className="text-sm font-bold text-violeta">
                {producto.activo ? etiquetas.activo : etiquetas.oculto}
              </p>
              <div className="flex flex-col gap-3">{controles(producto)}</div>
            </article>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default TablaProductos
