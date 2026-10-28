import { BotonWhatsApp } from './BotonWhatsApp'
import { SelectorVariante } from './SelectorVariante'
import { useSeleccionPedido } from '../../hooks/useSeleccionPedido'
import { armarMensajePedido } from '../../utils/whatsapp'

export default function PedidoWhatsApp({ producto }) {
  const seleccion = useSeleccionPedido(producto)
  const mensaje = armarMensajePedido(producto, seleccion)
  const deshabilitado = seleccion.faltaColor || seleccion.faltaTalle

  return (
    <div className="grid gap-4">
      <SelectorVariante
        colores={producto.colores}
        talles={producto.talles}
        color={seleccion.color}
        talle={seleccion.talle}
        cantidad={seleccion.cantidad}
        alElegirColor={seleccion.elegirColor}
        alElegirTalle={seleccion.elegirTalle}
        alCambiarCantidad={seleccion.cambiarCantidad}
      />
      <div className="grid justify-items-start gap-2">
        <BotonWhatsApp
          mensaje={mensaje}
          sinStock={Number(producto.stock) === 0}
          deshabilitado={deshabilitado}
        />
        {seleccion.avisoColor && (
          <p className="text-sm text-grafito">{seleccion.avisoColor}</p>
        )}
        {seleccion.avisoTalle && (
          <p className="text-sm text-grafito">{seleccion.avisoTalle}</p>
        )}
      </div>
    </div>
  )
}
