import { useState } from 'react'
import useObtenerDatos from '../../hooks/useObtenerDatos.js'
import { obtenerCategorias } from '../../services/api.js'
import textos from '../../data/textos.js'
import {
  BORRADOR_VACIO,
  borradorDesdeProducto,
  datosDesdeBorrador,
  validarBorrador,
} from '../../utils/formularioProducto.js'

const etiquetas = textos.panel.formulario

const CLASE_CAMPO =
  'min-h-11 w-full rounded-marca border border-gris-claro bg-white px-3 text-grafito focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-magenta'

// Campo con etiqueta y aviso propio; el aviso queda unido al campo con aria-describedby.
const Campo = ({ id, etiqueta, aviso, children }) => (
  <div className="flex flex-col gap-1 text-sm text-grafito">
    <label htmlFor={id} className="font-bold">{etiqueta}</label>
    {children}
    {aviso && <p id={`${id}-aviso`} role="alert" className="text-sm font-bold text-error">{aviso}</p>}
  </div>
)

// Mensaje claro si el servidor rechaza los datos (400) o el producto choca con otro (409).
const mensajeDeError = (error) =>
  error?.status === 400 || error?.status === 409 ? error.message : etiquetas.errorGuardar

const FormularioProducto = ({ producto = null, guardar, onCancelar }) => {
  const categorias = useObtenerDatos(obtenerCategorias)
  const [borrador, setBorrador] = useState(producto ? borradorDesdeProducto(producto) : BORRADOR_VACIO)
  const [avisos, setAvisos] = useState({})
  const [guardando, setGuardando] = useState(false)
  const [errorGuardar, setErrorGuardar] = useState(null)

  const alCambiar = (campo, valor) => {
    setBorrador((anterior) => ({ ...anterior, [campo]: valor }))
    setAvisos((anteriores) => ({ ...anteriores, [campo]: undefined }))
    setErrorGuardar(null)
  }

  const enviar = async (evento) => {
    evento.preventDefault()
    const nuevosAvisos = validarBorrador(borrador, etiquetas)
    setAvisos(nuevosAvisos)
    if (Object.keys(nuevosAvisos).length > 0) return

    setGuardando(true)
    try {
      await guardar(datosDesdeBorrador(borrador))
    } catch (error) {
      setErrorGuardar(mensajeDeError(error))
    } finally {
      setGuardando(false)
    }
  }

  // Props comunes de cada campo de texto: valor, cambio y estado de error accesible.
  const propsDe = (campo) => ({
    id: `producto-${campo}`,
    value: borrador[campo],
    onChange: (evento) => alCambiar(campo, evento.target.value),
    'aria-invalid': Boolean(avisos[campo]),
    'aria-describedby': avisos[campo] ? `producto-${campo}-aviso` : undefined,
  })

  return (
    <form aria-label={producto ? etiquetas.editar : etiquetas.agregar} onSubmit={enviar} noValidate className="flex flex-col gap-4 rounded-marca bg-gris-claro/40 p-4 md:p-6">
      <h2 className="font-titulos text-lg text-violeta">{producto ? etiquetas.editar : etiquetas.agregar}</h2>
      <div className="grid gap-4 md:grid-cols-2">
        <Campo id="producto-nombre" etiqueta={etiquetas.nombre} aviso={avisos.nombre}>
          <input type="text" maxLength={120} {...propsDe('nombre')} className={CLASE_CAMPO} />
        </Campo>
        <Campo id="producto-categoria_id" etiqueta={etiquetas.categoria} aviso={avisos.categoria_id}>
          <select {...propsDe('categoria_id')} disabled={categorias.cargando || Boolean(categorias.error)} className={CLASE_CAMPO}>
            <option value="">{categorias.cargando ? etiquetas.cargandoCategorias : etiquetas.seleccionarCategoria}</option>
            {(categorias.datos ?? []).map((categoria) => (
              <option key={categoria.id} value={String(categoria.id)}>{categoria.nombre}</option>
            ))}
          </select>
          {categorias.error && (
            <p role="alert" className="flex flex-wrap items-center gap-2 text-sm text-grafito">
              {etiquetas.errorCategorias}
              <button type="button" onClick={categorias.reintentar} className="min-h-11 rounded-marca px-3 font-bold text-violeta underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-magenta">
                {etiquetas.reintentar}
              </button>
            </p>
          )}
        </Campo>
        <Campo id="producto-precio" etiqueta={etiquetas.precio} aviso={avisos.precio}>
          <input type="number" min="0" step="0.01" inputMode="decimal" {...propsDe('precio')} className={CLASE_CAMPO} />
        </Campo>
        <Campo id="producto-stock" etiqueta={etiquetas.stock} aviso={avisos.stock}>
          <input type="number" min="0" step="1" inputMode="numeric" {...propsDe('stock')} className={CLASE_CAMPO} />
        </Campo>
        <Campo id="producto-talles" etiqueta={etiquetas.talles} aviso={avisos.talles}>
          <input type="text" placeholder={etiquetas.ejemploTalles} {...propsDe('talles')} className={CLASE_CAMPO} />
        </Campo>
        <Campo id="producto-colores" etiqueta={etiquetas.colores} aviso={avisos.colores}>
          <input type="text" placeholder={etiquetas.ejemploColores} {...propsDe('colores')} className={CLASE_CAMPO} />
        </Campo>
      </div>
      <Campo id="producto-descripcion" etiqueta={etiquetas.descripcion}>
        <textarea rows={3} {...propsDe('descripcion')} className={`${CLASE_CAMPO} py-2`} />
      </Campo>
      <label className="flex min-h-11 items-center gap-2 text-sm text-grafito">
        <input
          type="checkbox"
          checked={borrador.destacado}
          onChange={(evento) => alCambiar('destacado', evento.target.checked)}
          className="size-5 accent-violeta focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-magenta"
        />
        {etiquetas.destacado}
      </label>
      {errorGuardar && <p role="alert" className="font-bold text-error">{errorGuardar}</p>}
      <div className="flex flex-wrap gap-3">
        <button type="submit" disabled={guardando} className="min-h-11 rounded-marca bg-violeta px-6 font-bold text-white transition-colors hover:bg-magenta focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-magenta focus-visible:ring-offset-2 disabled:opacity-60">
          {guardando ? etiquetas.guardando : etiquetas.guardar}
        </button>
        <button type="button" disabled={guardando} onClick={onCancelar} className="min-h-11 rounded-marca border border-violeta bg-white px-6 font-bold text-violeta focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-magenta focus-visible:ring-offset-2 disabled:opacity-60">
          {etiquetas.cancelar}
        </button>
      </div>
    </form>
  )
}

export default FormularioProducto
