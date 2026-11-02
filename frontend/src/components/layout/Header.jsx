import { useEffect, useState } from 'react'
import { LogIn, Menu, X } from 'lucide-react'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import textos from '../../data/textos.js'
import useSesion from '../../hooks/useSesion.js'

const FOCO = 'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-magenta focus-visible:ring-offset-2'

// Enlaces de la compu: blancos sobre el violeta del header.
const claseCompu = (activo = false) =>
  `inline-flex min-h-11 shrink-0 items-center gap-2 rounded-marca px-3 text-lg font-bold text-white transition-opacity hover:opacity-80 underline-offset-8 ${FOCO} focus-visible:ring-offset-violeta ${
    activo ? 'underline decoration-amarillo decoration-2' : ''
  }`

// Enlaces del menú del celular: violetas sobre blanco, la sección actual en magenta.
const claseCelular = (activo = false) =>
  `flex min-h-12 items-center gap-2 rounded-marca px-3 text-lg font-bold ${FOCO} ${
    activo ? 'bg-gris-claro text-magenta' : 'text-violeta hover:bg-gris-claro'
  }`

// Los enlaces son los mismos en la compu y en el celular; cambia el estilo.
// NavLink marca la sección actual (estilo y aria-current="page").
const Enlaces = ({ sesion, alSalir, clase }) => (
  <>
    <NavLink to="/" end className={({ isActive }) => clase(isActive)}>{textos.header.textoInicio}</NavLink>
    <NavLink to="/catalogo" className={({ isActive }) => clase(isActive)}>{textos.header.enlaceCatalogo}</NavLink>
    {sesion ? (
      <>
        <NavLink to="/admin" className={({ isActive }) => clase(isActive)}>{textos.header.enlacePanel}</NavLink>
        <button type="button" onClick={alSalir} className={clase()}>{textos.header.botonSalir}</button>
      </>
    ) : (
      <NavLink to="/ingresar" className={({ isActive }) => clase(isActive)}>
        <LogIn aria-hidden="true" size={18} />
        {textos.header.enlaceIngresar}
      </NavLink>
    )}
  </>
)

const Header = () => {
  const { sesion, salir } = useSesion()
  const navegar = useNavigate()
  const quieto = useReducedMotion()
  const [menuAbierto, setMenuAbierto] = useState(false)

  // Con el menú abierto: Escape lo cierra y la página de abajo no se desplaza.
  useEffect(() => {
    if (!menuAbierto) return undefined
    const alTeclear = (evento) => evento.key === 'Escape' && setMenuAbierto(false)
    const desplazamientoAnterior = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    document.addEventListener('keydown', alTeclear)
    return () => {
      document.body.style.overflow = desplazamientoAnterior
      document.removeEventListener('keydown', alTeclear)
    }
  }, [menuAbierto])

  // Cualquier enlace del header cierra el menú. Si lleva a la página en la que
  // ya está la persona (por ejemplo «Inicio» estando en el inicio), sube arriba.
  const alTocarEnlace = (evento) => {
    const enlace = evento.target.closest('a')
    if (!enlace) return
    setMenuAbierto(false)
    if (enlace.pathname === window.location.pathname) {
      // Se espera un instante a que el menú termine de cerrarse y la página se
      // pueda desplazar de nuevo; si no, el navegador ignora la subida.
      setTimeout(() => window.scrollTo({ top: 0, behavior: quieto ? 'auto' : 'smooth' }), 0)
    }
  }

  const cerrarSesion = () => {
    salir()
    setMenuAbierto(false)
    navegar('/ingresar')
  }

  return (
    <header onClick={alTocarEnlace} className="sticky top-0 z-30 bg-violeta shadow-tarjeta">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-2 px-3 md:h-20 md:px-5">
        <Link
          to="/"
          aria-label={textos.header.enlaceInicio}
          className={`shrink-0 rounded-marca ${FOCO} focus-visible:ring-offset-violeta`}
        >
          <img src="/img/logo-seanstore-negativo.png" alt={textos.header.altLogo} className="h-11 w-auto md:h-16" />
        </Link>
        <nav aria-label={textos.header.navegacion} className="hidden items-center gap-2 md:flex">
          <Enlaces sesion={sesion} alSalir={cerrarSesion} clase={claseCompu} />
        </nav>
        <button
          type="button"
          aria-expanded={menuAbierto}
          aria-controls="menu-celular"
          aria-label={menuAbierto ? textos.header.cerrarMenu : textos.header.abrirMenu}
          onClick={() => setMenuAbierto((abierto) => !abierto)}
          className={`grid size-11 place-items-center rounded-marca text-magenta md:hidden ${FOCO} focus-visible:ring-offset-violeta`}
        >
          {menuAbierto ? <X aria-hidden="true" size={28} /> : <Menu aria-hidden="true" size={28} />}
        </button>
      </div>
      <AnimatePresence>
        {menuAbierto && (
          <>
            {/* Fondo oscuro: tocar afuera del menú lo cierra. */}
            <motion.div
              key="fondo"
              aria-hidden="true"
              data-testid="fondo-menu"
              onClick={() => setMenuAbierto(false)}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: quieto ? 0 : 0.2 }}
              className="fixed inset-x-0 bottom-0 top-16 bg-grafito/50 md:hidden"
            />
            {/* El menú baja desde el header (de 0 a su alto natural). */}
            <motion.nav
              key="menu"
              id="menu-celular"
              aria-label={textos.header.menuCelular}
              initial={{ height: 0 }}
              animate={{ height: 'auto' }}
              exit={{ height: 0 }}
              transition={{ duration: quieto ? 0 : 0.25, ease: 'easeOut' }}
              className="absolute inset-x-0 top-full overflow-hidden rounded-b-marca bg-white shadow-elevada md:hidden"
            >
              <div className="flex flex-col gap-1 p-3">
                <Enlaces sesion={sesion} alSalir={cerrarSesion} clase={claseCelular} />
              </div>
            </motion.nav>
          </>
        )}
      </AnimatePresence>
    </header>
  )
}

export default Header
