import { Navigate, Outlet } from "react-router-dom";
import useSesion from "../../hooks/useSesion.js";

const RutaProtegida = () => {
  const { sesion } = useSesion();

  return sesion ? <Outlet /> : <Navigate to="/ingresar" replace />;
};

export default RutaProtegida;
