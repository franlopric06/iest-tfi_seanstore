import MetaPagina from '../../components/comunes/MetaPagina.jsx'
import AsiDeFacil from '../../components/tienda/AsiDeFacil.jsx'
import CintaProductos from '../../components/tienda/CintaProductos.jsx'
import FranjaCategorias from '../../components/tienda/FranjaCategorias.jsx'
import HeroSublimado from '../../components/tienda/HeroSublimado.jsx'
import NoTenesDiseno from '../../components/tienda/NoTenesDiseno.jsx'
import textos from '../../data/textos.js'

const Inicio = () => (
  <>
    <MetaPagina titulo={textos.inicio.seo.titulo} descripcion={textos.inicio.seo.descripcion} />
    <HeroSublimado />
    <FranjaCategorias />
    <CintaProductos />
    <AsiDeFacil />
    <NoTenesDiseno />
  </>
)

export default Inicio
