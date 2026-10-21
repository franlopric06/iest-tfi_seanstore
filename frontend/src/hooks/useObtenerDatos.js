import { useCallback, useEffect, useRef, useState } from "react"

const useObtenerDatos = (pedir, dependencias = []) => {
  const pedirReferencia = useRef(pedir)

  useEffect(() => {
    pedirReferencia.current = pedir
  })

  const [intentos, setIntentos] = useState(0)
  const [cargando, setCargando] = useState(true)
  const [datos, setDatos] = useState(null)
  const [error, setError] = useState(null)

  const reintentar = useCallback(() => {
    setIntentos((cantidad) => cantidad + 1)
  }, [])

  const pedidoDependencias = [intentos, ...dependencias]

  useEffect(() => {
    let enPantalla = true

    const pedirDatos = async () => {
      setCargando(true)
      setError(null)
      try {
        const respuesta = await pedirReferencia.current()
        if (!enPantalla) return
        setDatos(respuesta)
      } catch (errorPedido) {
        if (!enPantalla) return
        setError(errorPedido)
      } finally {
        if (enPantalla) setCargando(false)
      }
    }

    pedirDatos()

    return () => {
      enPantalla = false
    }
  // La lista de dependencias llega como parámetro: el lint no puede verificarla estáticamente.
  // oxlint-disable-next-line react-hooks/exhaustive-deps
  }, pedidoDependencias)

  return { cargando, datos, error, reintentar }
}

export default useObtenerDatos
