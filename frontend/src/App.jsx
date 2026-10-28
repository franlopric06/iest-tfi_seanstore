import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Asistente from './components/atencion/Asistente.jsx'
import BotonWhatsAppFlotante from './components/atencion/BotonWhatsAppFlotante.jsx'
import Header from './components/layout/Header.jsx'
import SubirAlCambiarRuta from './components/layout/SubirAlCambiarRuta.jsx'
import Footer from './components/layout/Footer.jsx'
import Inicio from './pages/tienda/Inicio.jsx'
import Catalogo from './pages/tienda/Catalogo.jsx'
import DetalleProducto from './pages/tienda/DetalleProducto.jsx'
import NoEncontrada from './pages/tienda/NoEncontrada.jsx'

function App() {
  return (
    <BrowserRouter>
      <SubirAlCambiarRuta />
      <Header />
      <main>
        <Routes>
          <Route path="/" element={<Inicio />} />
          <Route path="/catalogo" element={<Catalogo />} />
          <Route path="/catalogo/:slug" element={<Catalogo />} />
          <Route path="/producto/:slug" element={<DetalleProducto />} />
          <Route path="*" element={<NoEncontrada />} />
        </Routes>
      </main>
      <BotonWhatsAppFlotante />
      <Asistente />
      <Footer />
    </BrowserRouter>
  )
}

export default App
