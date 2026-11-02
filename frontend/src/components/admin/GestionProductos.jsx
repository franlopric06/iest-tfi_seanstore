import { useState } from 'react'
import { Plus } from 'lucide-react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import Cargando from '../comunes/Cargando.jsx'
import EstadoVacio from '../comunes/EstadoVacio.jsx'
import MensajeError from '../comunes/MensajeError.jsx'
import FiltrosProductos from './FiltrosProductos.jsx'
import TablaProductos from './TablaProductos.jsx'
import useObtenerDatos from '../../hooks/useObtenerDatos.js'
import { cambiarEstadoProducto, obtenerProductosAdmin } from '../../services/api.js'
import { FILTROS_VACIOS, categoriasDe, filtrarProductos } from '../../utils/filtrarProductos.js'
import textos from '../../data/textos.js'

const etiquetas = textos.panel.productos

// Pestaña «Productos» del panel: buscador, filtros, botón «Nuevo producto» y
// la tabla. Crear y editar se hacen en su propia pantalla
// (/admin/productos/nuevo y /admin/productos/:id, ver EditarProducto.jsx).
const GestionProductos = () => {
  const { cargando, datos: productos, error, reintentar } = useObtenerDatos(obtenerProductosAdmin)
  const ubicacion = useLocation()
  const navegar = useNavigate()
  // Aviso que deja la pantalla de edición al volver («Producto actualizado.»).
  const [aviso, setAviso] = useState(ubicacion.state?.aviso ?? null)
  const [cambiandoId, setCambiandoId] = useState(null)
  const [filtros, setFiltros] = useState(FILTROS_VACIOS)

  const cambiarEstado = async (producto) => {
    setAviso(null)
    setCambiandoId(producto.id)
    try {
      await cambiarEstadoProducto(producto.id, !producto.activo)
      setAviso({ tipo: 'status', texto: producto.activo ? etiquetas.ocultado : etiquetas.mostrado })
      reintentar()
    } catch {
      setAviso({ tipo: 'alert', texto: etiquetas.errorEstado })
    } finally {
      setCambiandoId(null)
    }
  }

  const contenido = () => {
    if (cargando) return <Cargando etiqueta={etiquetas.cargando} cantidad={3} />
    if (error) return <MensajeError alReintentar={reintentar} />
    if (productos.length === 0) return <EstadoVacio frase={etiquetas.vacio} />

    const visibles = filtrarProductos(productos, filtros)
    return (
      <>
        <FiltrosProductos filtros={filtros} categorias={categoriasDe(productos)} alCambiar={setFiltros} />
        <p className="text-sm text-grafito" aria-live="polite">
          {etiquetas.mostrando.replace('{cantidad}', visibles.length).replace('{total}', productos.length)}
        </p>
        {visibles.length === 0 ? (
          <p className="py-6 text-center text-grafito">{etiquetas.sinResultados}</p>
        ) : (
          <TablaProductos
            productos={visibles}
            cambiandoId={cambiandoId}
            alEditar={(producto) => navegar(`/admin/productos/${producto.id}`)}
            alCambiarEstado={cambiarEstado}
          />
        )}
      </>
    )
  }

  return (
    <div className="flex flex-col gap-4 pt-4">
      <Link
        to="/admin/productos/nuevo"
        className="flex min-h-11 items-center gap-2 self-start rounded-marca bg-violeta px-5 font-bold text-white shadow-tarjeta transition-colors hover:bg-magenta focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-magenta focus-visible:ring-offset-2"
      >
        <Plus aria-hidden="true" size={20} />
        {etiquetas.nuevo}
      </Link>
      {aviso && (
        <p role={aviso.tipo} className={`font-bold ${aviso.tipo === 'alert' ? 'text-error' : 'text-violeta'}`}>
          {aviso.texto}
        </p>
      )}
      {contenido()}
    </div>
  )
}

export default GestionProductos
