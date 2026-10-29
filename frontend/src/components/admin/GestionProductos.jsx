import { useEffect, useRef, useState } from 'react'
import { Plus } from 'lucide-react'
import Cargando from '../comunes/Cargando.jsx'
import EstadoVacio from '../comunes/EstadoVacio.jsx'
import MensajeError from '../comunes/MensajeError.jsx'
import FormularioProducto from './FormularioProducto.jsx'
import TablaProductos from './TablaProductos.jsx'
import useObtenerDatos from '../../hooks/useObtenerDatos.js'
import {
  cambiarEstadoProducto,
  crearProducto,
  editarProducto,
  obtenerProductosAdmin,
} from '../../services/api.js'
import textos from '../../data/textos.js'

const etiquetas = textos.panel.productos

// Pestaña «Productos» del panel (004-T28): botón «Nuevo producto», formulario
// de alta o edición y la tabla. Después de cada cambio vuelve a pedir la lista
// para que el panel muestre lo mismo que quedó guardado en la base.
const GestionProductos = () => {
  const { cargando, datos: productos, error, reintentar } = useObtenerDatos(obtenerProductosAdmin)
  const [formulario, setFormulario] = useState(null)
  const [aviso, setAviso] = useState(null)
  const [cambiandoId, setCambiandoId] = useState(null)
  const zonaFormulario = useRef(null)

  // Al abrir el formulario lo lleva a la vista; si se abre desde una fila de abajo no queda escondido.
  useEffect(() => {
    if (formulario) zonaFormulario.current?.scrollIntoView?.({ behavior: 'smooth', block: 'start' })
  }, [formulario])

  const abrir = (producto = null) => {
    setAviso(null)
    setFormulario({ producto, clave: producto?.id ?? 'nuevo' })
  }

  const guardar = async (datos) => {
    const producto = formulario.producto
    if (producto) await editarProducto(producto.id, datos)
    else await crearProducto(datos)
    setFormulario(null)
    setAviso({ tipo: 'status', texto: producto ? etiquetas.actualizado : etiquetas.creado })
    reintentar()
  }

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
    return (
      <TablaProductos
        productos={productos}
        cambiandoId={cambiandoId}
        alEditar={abrir}
        alCambiarEstado={cambiarEstado}
      />
    )
  }

  return (
    <div className="flex flex-col gap-4 pt-4">
      <div ref={zonaFormulario} className="flex scroll-mt-24 flex-col gap-4">
        {!formulario && (
          <button
            type="button"
            onClick={() => abrir()}
            className="flex min-h-11 items-center gap-2 self-start rounded-marca bg-violeta px-5 font-bold text-white shadow-tarjeta transition-colors hover:bg-magenta focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-magenta focus-visible:ring-offset-2"
          >
            <Plus aria-hidden="true" size={20} />
            {etiquetas.nuevo}
          </button>
        )}
        {formulario && (
          <FormularioProducto
            key={formulario.clave}
            producto={formulario.producto}
            guardar={guardar}
            onCancelar={() => setFormulario(null)}
          />
        )}
        {aviso && (
          <p role={aviso.tipo} className={`font-bold ${aviso.tipo === 'alert' ? 'text-error' : 'text-violeta'}`}>
            {aviso.texto}
          </p>
        )}
      </div>
      {contenido()}
    </div>
  )
}

export default GestionProductos
