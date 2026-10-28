import { Link } from 'react-router-dom'
import textos from '../../data/textos.js'

const Header = () => (
  <header className="sticky top-0 z-30 bg-violeta shadow-tarjeta">
    <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 md:h-20">
      <img
        src="/img/logo-seanstore-negativo.png"
        alt={textos.header.altLogo}
        className="h-11 w-auto md:h-16"
      />
      <nav aria-label="Navegación principal">
        <Link
          to="/catalogo"
          className="inline-flex min-h-11 items-center px-1 text-lg font-bold text-white transition-opacity hover:opacity-80 focus-visible:ring-2 focus-visible:ring-magenta focus-visible:ring-offset-2 focus-visible:ring-offset-violeta"
        >
          {textos.header.enlaceCatalogo}
        </Link>
      </nav>
    </div>
  </header>
)

export default Header
