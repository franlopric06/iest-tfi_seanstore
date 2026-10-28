import { lazy, Suspense } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Asistente from './components/atencion/Asistente.jsx'
import BotonWhatsAppFlotante from './components/atencion/BotonWhatsAppFlotante.jsx'
import Cargando from './components/comunes/Cargando.jsx'
import Header from './components/layout/Header.jsx'
import SubirAlCambiarRuta from './components/layout/SubirAlCambiarRuta.jsx'
import Footer from './components/layout/Footer.jsx'
import Inicio from './pages/tienda/Inicio.jsx'
import textos from './data/textos.js'

const Catalogo = lazy(() => import('./pages/tienda/Catalogo.jsx'))
const DetalleProducto = lazy(() => import('./pages/tienda/DetalleProducto.jsx'))
const NoEncontrada = lazy(() => import('./pages/tienda/NoEncontrada.jsx'))

function App() {
  return (
    <BrowserRouter>
      <SubirAlCambiarRuta />
      <Header />
      <main>
        <Suspense fallback={<Cargando etiqueta={textos.cargandoPagina} cantidad={4} />}>
          <Routes>
            <Route path="/" element={<Inicio />} />
            <Route path="/catalogo" element={<Catalogo />} />
            <Route path="/catalogo/:slug" element={<Catalogo />} />
            <Route path="/producto/:slug" element={<DetalleProducto />} />
            <Route path="*" element={<NoEncontrada />} />
          </Routes>
        </Suspense>
      </main>
      <BotonWhatsAppFlotante />
      <Asistente />
      <Footer />
    </BrowserRouter>
  )
}

export default App
