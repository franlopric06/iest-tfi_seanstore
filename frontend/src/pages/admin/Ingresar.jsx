import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import MetaPagina from '../../components/comunes/MetaPagina.jsx'
import textos from '../../data/textos.js'
import { ingresar } from '../../services/api.js'

const Ingresar = () => {
  const navegar = useNavigate()
  const [email, setEmail] = useState('')
  const [contrasena, setContrasena] = useState('')
  const [ingresando, setIngresando] = useState(false)
  const [error, setError] = useState('')

  const enviar = async (evento) => {
    evento.preventDefault()
    setIngresando(true)
    setError('')

    try {
      await ingresar(email.trim(), contrasena)
      setContrasena('')
      navegar('/admin')
    } catch (error) {
      if (error?.status === 429) {
        setError(textos.ingresar.errorLimite)
      } else if (error?.status === 401) {
        setError(textos.ingresar.errorCredenciales)
      } else {
        setError(textos.ingresar.errorConexion)
      }
    } finally {
      setIngresando(false)
    }
  }

  return (
    <section className="mx-auto flex min-h-[60vh] max-w-lg items-center px-5 py-12">
      <MetaPagina
        titulo={`${textos.ingresar.titulo} · Sean's Store`}
        descripcion={textos.ingresar.descripcion}
        indexar={false}
      />
      <div className="w-full rounded-marca bg-white p-6 shadow-tarjeta md:p-8">
        <h1 className="mb-6 font-titulos text-2xl text-violeta">{textos.ingresar.titulo}</h1>
        <form className="space-y-5" onSubmit={enviar}>
          <div className="space-y-2">
            <label htmlFor="email" className="block font-bold text-violeta">
              {textos.ingresar.email}
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="username"
              required
              value={email}
              onChange={(evento) => setEmail(evento.target.value)}
              className="min-h-11 w-full rounded-marca border border-gris-claro px-3 text-violeta focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-magenta"
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="contrasena" className="block font-bold text-violeta">
              {textos.ingresar.contrasena}
            </label>
            <input
              id="contrasena"
              name="contrasena"
              type="password"
              autoComplete="current-password"
              required
              value={contrasena}
              onChange={(evento) => setContrasena(evento.target.value)}
              className="min-h-11 w-full rounded-marca border border-gris-claro px-3 text-violeta focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-magenta"
            />
          </div>
          {error && <p role="alert" className="text-sm text-error">{error}</p>}
          <button
            type="submit"
            disabled={ingresando}
            className="min-h-11 w-full rounded-marca bg-magenta px-5 font-titulos text-white transition-colors hover:bg-magenta/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-magenta focus-visible:ring-offset-2 disabled:bg-gris-claro disabled:text-grafito"
          >
            {ingresando ? textos.ingresar.ingresando : textos.ingresar.boton}
          </button>
        </form>
      </div>
    </section>
  )
}

export default Ingresar
