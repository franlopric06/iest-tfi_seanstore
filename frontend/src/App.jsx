import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Header from './components/layout/Header.jsx'
import Footer from './components/layout/Footer.jsx'
import Inicio from './pages/tienda/Inicio.jsx'

function App() {
  return (
    <BrowserRouter>
      <Header />
      <main>
        <Routes>
          <Route path="/" element={<Inicio />} />
        </Routes>
      </main>
      <Footer />
    </BrowserRouter>
  )
}

export default App
