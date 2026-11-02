import { ArrowLeft } from 'lucide-react'
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom'
import Cargando from '../../components/comunes/Cargando.jsx'
import MensajeError from '../../components/comunes/MensajeError.jsx'
import MetaPagina from '../../components/comunes/MetaPagina.jsx'
import FormularioProducto from '../../components/admin/FormularioProducto.jsx'
import FotosProducto from '../../components/admin/FotosProducto.jsx'
import useObtenerDatos from '../../hooks/useObtenerDatos.js'
import { crearProducto, editarProducto, obtenerProductoAdmin } from '../../services/api.js'
import textos from '../../data/textos.js'

const etiquetas = textos.panel.productos

// Pantalla propia para crear o editar un producto: /admin/productos/nuevo y
// /admin/productos/:id. Al tener su dirección, el botón «atrás» del navegador
// vuelve a la lista y se puede recargar sin perder el producto abierto.
const EditarProducto = () => {
  const { id } = useParams()
  const esNuevo = id === 'nuevo'
  const navegar = useNavigate()
  const ubicacion = useLocation()
  const { cargando, datos: producto, error, reintentar } = useObtenerDatos(
    () => (esNuevo ? Promise.resolve(null) : obtenerProductoAdmin(id)),
    [id],
  )

  const guardar = async (datos) => {
    if (esNuevo) {
      // Recién creado, se abre su pantalla de edición para agregarle las fotos.
      const nuevo = await crearProducto(datos)
      navegar(`/admin/productos/${nuevo.id}`, {
        replace: true,
        state: { aviso: { tipo: 'status', texto: etiquetas.creado } },
      })
      return
    }
    await editarProducto(producto.id, datos)
    navegar('/admin', { state: { aviso: { tipo: 'status', texto: etiquetas.actualizado } } })
  }

  const aviso = ubicacion.state?.aviso

  const contenido = () => {
    // Justo después de crear se cambia el id de la dirección: hasta que llegan los
    // datos del producto nuevo, se muestra la carga en vez del formulario anterior.
    const esperandoProducto = !esNuevo && !error && String(producto?.id) !== id
    if (cargando || esperandoProducto) return <Cargando etiqueta={etiquetas.cargandoProducto} cantidad={2} />
    if (error?.status === 404) return <p role="alert" className="text-grafito">{etiquetas.noEncontrado}</p>
    if (error) return <MensajeError alReintentar={reintentar} />
    return (
      <FormularioProducto
        key={esNuevo ? 'nuevo' : producto.id}
        producto={producto}
        guardar={guardar}
        onCancelar={() => navegar('/admin')}
        antesDeBotones={producto && <FotosProducto producto={producto} />}
      />
    )
  }

  return (
    <section className="mx-auto flex max-w-5xl flex-col gap-4 px-5 py-8">
      <MetaPagina titulo={`${textos.panel.titulo} · Sean's Store`} descripcion={textos.panel.descripcion} indexar={false} />
      <Link
        to="/admin"
        className="flex min-h-11 items-center gap-2 self-start rounded-marca font-bold text-violeta hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-magenta"
      >
        <ArrowLeft aria-hidden="true" size={20} />
        {etiquetas.volver}
      </Link>
      {aviso && <p role="status" className="font-bold text-violeta">{aviso.texto}</p>}
      <div className="rounded-marca bg-white p-4 shadow-tarjeta md:p-6">{contenido()}</div>
    </section>
  )
}

export default EditarProducto
