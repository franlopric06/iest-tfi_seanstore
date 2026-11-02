import { useState } from 'react'
import { editarRapidoProducto } from '../services/api.js'
import { DURACION_AVISO } from './useAvisoTemporal.js'

const borradorInicial = (producto) => ({
  precio: String(Number(producto.precio)),
  stock: String(producto.stock),
  destacado: producto.destacado,
})

const mismosValores = (a, b) =>
  Number(a.precio) === Number(b.precio) && a.stock.trim() === b.stock.trim() && a.destacado === b.destacado

const esValido = (borrador) =>
  borrador.precio.trim() !== '' &&
  borrador.stock.trim() !== '' &&
  Number.isFinite(Number(borrador.precio)) &&
  Number(borrador.precio) >= 0 &&
  Number.isInteger(Number(borrador.stock)) &&
  Number(borrador.stock) >= 0

// Estado de la edición rápida (precio, stock y destacado) de cada fila del panel.
// - borradores: lo que la persona está escribiendo, por producto.
// - guardados: lo último que quedó guardado, para saber si hay cambios sin guardar.
// - resultados: cargando, éxito, error o datos inválidos, por producto.
// «Cambios guardados.» se borra solo a los 3 segundos.
const useEdicionRapida = () => {
  const [borradores, setBorradores] = useState({})
  const [guardados, setGuardados] = useState({})
  const [resultados, setResultados] = useState({})

  const marcar = (id, resultado) => setResultados((anteriores) => ({ ...anteriores, [id]: resultado }))
  const base = (producto) => guardados[producto.id] ?? borradorInicial(producto)
  const borradorDe = (producto) => borradores[producto.id] ?? base(producto)
  const hayCambios = (producto) => !mismosValores(borradorDe(producto), base(producto))

  const actualizar = (producto, campo, valor) => {
    setBorradores((anteriores) => ({ ...anteriores, [producto.id]: { ...borradorDe(producto), [campo]: valor } }))
    marcar(producto.id, null)
  }

  const guardar = async (producto) => {
    const borrador = borradorDe(producto)
    if (!esValido(borrador)) {
      marcar(producto.id, { invalido: true })
      return
    }
    marcar(producto.id, { cargando: true })
    try {
      await editarRapidoProducto(producto.id, {
        precio: Number(borrador.precio),
        stock: Number(borrador.stock),
        destacado: borrador.destacado,
      })
      setGuardados((anteriores) => ({ ...anteriores, [producto.id]: borrador }))
      marcar(producto.id, { exito: true })
      setTimeout(() => {
        setResultados((anteriores) =>
          anteriores[producto.id]?.exito ? { ...anteriores, [producto.id]: null } : anteriores,
        )
      }, DURACION_AVISO)
    } catch {
      marcar(producto.id, { error: true })
    }
  }

  return { borradorDe, hayCambios, resultadoDe: (producto) => resultados[producto.id], actualizar, guardar }
}

export default useEdicionRapida
