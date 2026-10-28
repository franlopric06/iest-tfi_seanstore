import textos from '../data/textos'

function completar(plantilla, { producto, color, talle, cantidad }) {
  return plantilla
    .replaceAll('{producto}', producto.nombre)
    .replaceAll('{color}', color)
    .replaceAll('{talle}', talle)
    .replaceAll('{cantidad}', String(cantidad))
}

export function armarMensajePedido(producto, eleccion) {
  const consulta = Number(producto.stock) === 0
  const sinTalles = !Array.isArray(producto.talles) || producto.talles.length === 0
  const plantilla = consulta
    ? sinTalles
      ? textos.whatsapp.plantillaConsultaSinTalle
      : textos.whatsapp.plantillaConsulta
    : sinTalles
      ? textos.whatsapp.plantillaPedidoSinTalle
      : textos.whatsapp.plantillaPedido

  return completar(plantilla, {
    producto,
    color: eleccion.color,
    talle: eleccion.talle ?? '',
    cantidad: eleccion.cantidad,
  })
}
