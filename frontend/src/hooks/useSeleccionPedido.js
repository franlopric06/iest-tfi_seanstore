import { useState } from 'react'

const CANTIDAD_MINIMA = 1
const CANTIDAD_MAXIMA = 50

export function useSeleccionPedido(producto) {
  const coloresDisponibles = Array.isArray(producto?.colores) ? producto.colores : []
  const colorUnico = coloresDisponibles.length === 1 ? coloresDisponibles[0] : null
  const tallesDisponibles = Array.isArray(producto?.talles) ? producto.talles : []
  const talleUnico = tallesDisponibles.length === 1 ? tallesDisponibles[0] : null

  const [color, setColor] = useState(colorUnico)
  const [talle, setTalle] = useState(talleUnico)
  const [cantidad, setCantidad] = useState(1)

  return {
    color,
    elegirColor: setColor,
    talle,
    elegirTalle: setTalle,
    cantidad,
    cambiarCantidad: (valor) =>
      setCantidad(
        Math.min(CANTIDAD_MAXIMA, Math.max(CANTIDAD_MINIMA, Math.trunc(Number(valor) || 0))),
      ),
  }
}
