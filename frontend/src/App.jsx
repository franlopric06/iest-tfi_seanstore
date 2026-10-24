import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Header from './components/layout/Header.jsx'
import Footer from './components/layout/Footer.jsx'
import Inicio from './pages/tienda/Inicio.jsx'
import Catalogo from './pages/tienda/Catalogo.jsx'

function App() {
  return (
    <BrowserRouter>
      <Header />
      <main>
        <Routes>
          <Route path="/" element={<Inicio />} />
          <Route path="/catalogo" element={<Catalogo />} />
          <Route path="/catalogo/:slug" element={<Catalogo />} />
        </Routes>
      </main>
      <Footer />
    </BrowserRouter>
  )
}

export default App
