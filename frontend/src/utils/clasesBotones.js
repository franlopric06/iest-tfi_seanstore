// Clases de los botones chicos de acción del panel (Guardar, Editar, Ocultar,
// Mostrar): todos del mismo ancho y alto, con el texto centrado. El alto queda
// en 44 px (min-h-11) porque DESIGN.md pide botones de al menos 44 px para que
// sean fáciles de tocar en el celular.
const BASE =
  'inline-flex min-h-11 w-24 items-center justify-center rounded-marca px-2 text-sm font-bold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-magenta focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60'

export const BOTON_ACCION_PRINCIPAL = `${BASE} bg-violeta text-white hover:bg-magenta`

export const BOTON_ACCION_SECUNDARIO = `${BASE} border border-violeta bg-white text-violeta hover:bg-gris-claro`
