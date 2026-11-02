import { LogIn } from 'lucide-react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import textos from '../../data/textos.js'
import useSesion from '../../hooks/useSesion.js'

const Header = () => {
  const { sesion, salir } = useSesion()
  const navegar = useNavigate()

  const cerrarSesion = () => {
    salir()
    navegar('/ingresar')
  }

  const claseEnlace =
    "inline-flex min-h-11 shrink-0 items-center gap-1 px-2 text-sm font-bold text-white transition-opacity hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-magenta focus-visible:ring-offset-2 focus-visible:ring-offset-violeta md:gap-2 md:px-3 md:text-lg"

  // NavLink marca solo la sección en la que está la persona (subrayado amarillo
  // y aria-current="page" para los lectores de pantalla).
  const claseNavegacion = ({ isActive }) =>
    `${claseEnlace} rounded-marca underline-offset-8 ${isActive ? 'underline decoration-amarillo decoration-2' : ''}`

  return (
    <header className="sticky top-0 z-30 bg-violeta shadow-tarjeta">
      <div className="mx-auto flex h-16 max-w-7xl flex-nowrap items-center justify-between gap-2 px-3 md:h-20 md:px-5">
        <Link
          to="/"
          aria-label={textos.header.enlaceInicio}
          className="shrink-0 rounded-marca focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-magenta focus-visible:ring-offset-2 focus-visible:ring-offset-violeta"
        >
          <img
            src="/img/logo-seanstore-negativo.png"
            alt={textos.header.altLogo}
            className="h-11 w-auto md:h-16"
          />
        </Link>
        <nav
          aria-label="Navegación principal"
          className="flex flex-nowrap items-center gap-0.5 md:gap-2"
        >
          <NavLink to="/" end className={claseNavegacion}>
            {textos.header.textoInicio}
          </NavLink>
          <NavLink to="/catalogo" className={claseNavegacion}>
            {textos.header.enlaceCatalogo}
          </NavLink>
          {sesion ? (
            <>
              <NavLink to="/admin" className={claseNavegacion}>
                {textos.header.enlacePanel}
              </NavLink>
              <button
                type="button"
                onClick={cerrarSesion}
                className={`${claseEnlace} rounded-marca`}
              >
                {textos.header.botonSalir}
              </button>
            </>
          ) : (
            <Link
              to="/ingresar"
              aria-label={textos.header.enlaceIngresar}
              className={`${claseEnlace} rounded-marca`}
            >
              <LogIn aria-hidden="true" size={18} />
              <span className="sr-only md:not-sr-only" aria-hidden="true">
                {textos.header.enlaceIngresar}
              </span>
            </Link>
          )}
        </nav>
      </div>
    </header>
  )
}

export default Header
