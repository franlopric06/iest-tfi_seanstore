import { lazy, Suspense } from 'react'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import RutaProtegida from './components/admin/RutaProtegida.jsx'
import Asistente from './components/atencion/Asistente.jsx'
import BotonWhatsAppFlotante from './components/atencion/BotonWhatsAppFlotante.jsx'
import Cargando from './components/comunes/Cargando.jsx'
import Header from './components/layout/Header.jsx'
import SubirAlCambiarRuta from './components/layout/SubirAlCambiarRuta.jsx'
import Footer from './components/layout/Footer.jsx'
import Inicio from './pages/tienda/Inicio.jsx'
import useSesion from './hooks/useSesion.js'
import textos from './data/textos.js'

const Catalogo = lazy(() => import('./pages/tienda/Catalogo.jsx'))
const DetalleProducto = lazy(() => import('./pages/tienda/DetalleProducto.jsx'))
const NoEncontrada = lazy(() => import('./pages/tienda/NoEncontrada.jsx'))
const Ingresar = lazy(() => import('./pages/admin/Ingresar.jsx'))
const Panel = lazy(() => import('./pages/admin/Panel.jsx'))

function App() {
  const { sesion } = useSesion()

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
            <Route
              path="/ingresar"
              element={sesion ? <Navigate to="/admin" replace /> : <Ingresar />}
            />
            <Route element={<RutaProtegida />}>
              <Route path="/admin" element={<Panel />} />
            </Route>
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
