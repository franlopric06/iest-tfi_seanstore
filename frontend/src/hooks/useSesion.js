import { useCallback, useEffect, useState } from "react";
import { borrarSesion, obtenerSesion } from "../utils/sesion.js";

const useSesion = () => {
  const [sesion, setSesion] = useState(obtenerSesion);

  useEffect(() => {
    const actualizarSesion = () => setSesion(obtenerSesion());
    window.addEventListener("sesion-cambiada", actualizarSesion);

    return () => window.removeEventListener("sesion-cambiada", actualizarSesion);
  }, []);

  const salir = useCallback(() => {
    borrarSesion();
    setSesion(null);
  }, []);

  return { sesion, salir };
};

export default useSesion;
