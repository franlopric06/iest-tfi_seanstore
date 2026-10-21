/* frontend/src/utils/formatearPrecio.js */

const SIN_CENTAVOS = { minimumFractionDigits: 0, maximumFractionDigits: 0 }
const CON_CENTAVOS = { minimumFractionDigits: 2, maximumFractionDigits: 2 }

const formatearPrecio = (precio) => {
  if (precio === null || precio === undefined) return null
  const importe = Number(precio)
  const llevaCentavos = importe % 1 !== 0
  return `$ ${importe.toLocaleString("es-AR", llevaCentavos ? CON_CENTAVOS : SIN_CENTAVOS)}`
}

export default formatearPrecio
