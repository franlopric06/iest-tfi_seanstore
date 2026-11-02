import { useEffect, useState } from 'react'

export const DURACION_AVISO = 3000

// Aviso del panel que se borra solo: los de éxito (tipo "status") desaparecen
// a los 3 segundos; los de error (tipo "alert") quedan hasta la próxima acción
// para que la persona alcance a leerlos.
const useAvisoTemporal = (inicial = null) => {
  const [aviso, setAviso] = useState(inicial)

  useEffect(() => {
    if (aviso?.tipo !== 'status') return undefined
    const temporizador = setTimeout(() => setAviso(null), DURACION_AVISO)
    return () => clearTimeout(temporizador)
  }, [aviso])

  return [aviso, setAviso]
}

export default useAvisoTemporal
