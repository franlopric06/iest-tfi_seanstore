import MetaPagina from '../../components/comunes/MetaPagina.jsx'
import AsiDeFacil from '../../components/tienda/AsiDeFacil.jsx'
import CintaProductos from '../../components/tienda/CintaProductos.jsx'
import FranjaCategorias from '../../components/tienda/FranjaCategorias.jsx'
import HeroSublimado from '../../components/tienda/HeroSublimado.jsx'
import LosMasPedidos from '../../components/tienda/LosMasPedidos.jsx'
import NoTenesDiseno from '../../components/tienda/NoTenesDiseno.jsx'
import useObtenerDatos from '../../hooks/useObtenerDatos.js'
import { obtenerProductos } from '../../services/api.js'
import textos from '../../data/textos.js'

const Inicio = () => {
  const { datos: destacados } = useObtenerDatos(() => obtenerProductos({ destacados: true }))

  return (
    <>
      <MetaPagina titulo={textos.inicio.seo.titulo} descripcion={textos.inicio.seo.descripcion} />
      <HeroSublimado />
      <FranjaCategorias />
      <CintaProductos />
      {Array.isArray(destacados) && destacados.length > 0 && (
        <LosMasPedidos destacados={destacados} />
      )}
      <AsiDeFacil />
      <NoTenesDiseno />
    </>
  )
}

export default Inicio
