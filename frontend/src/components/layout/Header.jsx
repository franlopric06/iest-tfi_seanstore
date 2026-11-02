import { useEffect, useState } from 'react'
import { LogIn, Menu, X } from 'lucide-react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import textos from '../../data/textos.js'
import useSesion from '../../hooks/useSesion.js'

const claseEnlace =
  'inline-flex min-h-11 shrink-0 items-center gap-2 rounded-marca px-3 text-lg font-bold text-white transition-opacity hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-magenta focus-visible:ring-offset-2 focus-visible:ring-offset-violeta'

// NavLink marca solo la sección en la que está la persona (subrayado amarillo
// y aria-current="page" para los lectores de pantalla).
const claseNavegacion = ({ isActive }) =>
  `${claseEnlace} underline-offset-8 ${isActive ? 'underline decoration-amarillo decoration-2' : ''}`

// Los enlaces son los mismos en la compu y en el celular; cambia cómo se acomodan.
const Enlaces = ({ sesion, alSalir }) => (
  <>
    <NavLink to="/" end className={claseNavegacion}>{textos.header.textoInicio}</NavLink>
    <NavLink to="/catalogo" className={claseNavegacion}>{textos.header.enlaceCatalogo}</NavLink>
    {sesion ? (
      <>
        <NavLink to="/admin" className={claseNavegacion}>{textos.header.enlacePanel}</NavLink>
        <button type="button" onClick={alSalir} className={claseEnlace}>{textos.header.botonSalir}</button>
      </>
    ) : (
      <NavLink to="/ingresar" className={claseNavegacion}>
        <LogIn aria-hidden="true" size={18} />
        {textos.header.enlaceIngresar}
      </NavLink>
    )}
  </>
)

const Header = () => {
  const { sesion, salir } = useSesion()
  const navegar = useNavigate()
  const [menuAbierto, setMenuAbierto] = useState(false)

  useEffect(() => {
    if (!menuAbierto) return undefined
    const alTeclear = (evento) => evento.key === 'Escape' && setMenuAbierto(false)
    document.addEventListener('keydown', alTeclear)
    return () => document.removeEventListener('keydown', alTeclear)
  }, [menuAbierto])

  const cerrarSesion = () => {
    salir()
    setMenuAbierto(false)
    navegar('/ingresar')
  }

  return (
    <header className="sticky top-0 z-30 bg-violeta shadow-tarjeta">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-2 px-3 md:h-20 md:px-5">
        <Link
          to="/"
          aria-label={textos.header.enlaceInicio}
          className="shrink-0 rounded-marca focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-magenta focus-visible:ring-offset-2 focus-visible:ring-offset-violeta"
        >
          <img src="/img/logo-seanstore-negativo.png" alt={textos.header.altLogo} className="h-11 w-auto md:h-16" />
        </Link>
        <nav aria-label={textos.header.navegacion} className="hidden items-center gap-2 md:flex">
          <Enlaces sesion={sesion} alSalir={cerrarSesion} />
        </nav>
        <button
          type="button"
          aria-expanded={menuAbierto}
          aria-controls="menu-celular"
          aria-label={menuAbierto ? textos.header.cerrarMenu : textos.header.abrirMenu}
          onClick={() => setMenuAbierto((abierto) => !abierto)}
          className="grid size-11 place-items-center rounded-marca text-magenta focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-magenta focus-visible:ring-offset-2 focus-visible:ring-offset-violeta md:hidden"
        >
          {menuAbierto ? <X aria-hidden="true" size={28} /> : <Menu aria-hidden="true" size={28} />}
        </button>
      </div>
      {menuAbierto && (
        <nav
          id="menu-celular"
          aria-label={textos.header.menuCelular}
          // Al tocar cualquier enlace se va a otra página: el menú se cierra.
          onClick={(evento) => evento.target.closest('a') && setMenuAbierto(false)}
          className="flex flex-col gap-1 border-t border-white/15 px-3 pb-4 pt-2 md:hidden"
        >
          <Enlaces sesion={sesion} alSalir={cerrarSesion} />
        </nav>
      )}
    </header>
  )
}

export default Header
