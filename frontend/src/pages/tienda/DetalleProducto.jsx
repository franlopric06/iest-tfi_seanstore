import { Link, useParams } from 'react-router-dom'
import GaleriaFotos from '../../components/tienda/GaleriaFotos.jsx'
import PedidoWhatsApp from '../../components/tienda/PedidoWhatsApp.jsx'
import MensajeError from '../../components/comunes/MensajeError.jsx'
import MetaPagina from '../../components/comunes/MetaPagina.jsx'
import NoEncontrada from './NoEncontrada.jsx'
import useObtenerDatos from '../../hooks/useObtenerDatos.js'
import { obtenerProducto } from '../../services/api.js'
import formatearPrecio from '../../utils/formatearPrecio.js'
import seoDetalle from '../../utils/seoDetalle.js'
import textos from '../../data/textos.js'

const EsqueletoDetalle = () => (
  <div
    role="status"
    aria-busy="true"
    aria-label={textos.detalle.cargando}
    className="mx-auto max-w-5xl px-5 pb-16 pt-8"
  >
    <div
      data-testid="esqueleto-detalle"
      className="grid gap-8 md:grid-cols-2"
    >
      <div className="aspect-square w-full rounded-marca bg-gris-claro" />
      <div className="flex flex-col gap-4">
        <div className="h-8 w-3/4 rounded bg-gris-claro" />
        <div className="h-7 w-1/3 rounded bg-gris-claro" />
        <div className="h-4 w-full rounded bg-gris-claro" />
        <div className="h-4 w-5/6 rounded bg-gris-claro" />
        <div className="h-4 w-4/6 rounded bg-gris-claro" />
        <div className="h-10 w-1/2 rounded-marca bg-gris-claro" />
      </div>
    </div>
  </div>
)

const DetalleProducto = () => {
  const { slug } = useParams()

  const { cargando, datos: producto, error, reintentar } = useObtenerDatos(
    () => obtenerProducto(slug),
    [slug],
  )

  if (cargando) return <EsqueletoDetalle />

  if (error?.status === 404) return <NoEncontrada />

  if (error) return <MensajeError alReintentar={reintentar} />

  if (!producto) return null

  const tieneTalles = Array.isArray(producto.talles) && producto.talles.length > 0
  const seo = seoDetalle(producto)

  return (
    <>
      <MetaPagina titulo={seo.titulo} descripcion={seo.descripcion} jsonLd={seo.jsonLd} />
      <section className="mx-auto max-w-5xl px-5 pb-16 pt-8">
      <div className="grid gap-8 md:grid-cols-2">
        <div className="flex flex-col gap-3">
          <GaleriaFotos key={producto.slug} fotos={producto.fotos} />
          {(!producto.fotos || producto.fotos.length === 0) && (
            <div
              data-testid="sin-foto-detalle"
              className="aspect-square w-full rounded-marca bg-gris-claro flex items-center justify-center p-6"
            >
              <span className="font-titulos text-base text-grafito text-center leading-snug">
                {producto.nombre}
              </span>
            </div>
          )}
        </div>

        <div className="flex flex-col gap-4">
          <h1 className="font-titulos text-2xl md:text-3xl">{producto.nombre}</h1>

          <p className="font-titulos text-2xl text-magenta">
            {formatearPrecio(producto.precio)}
          </p>

          {producto.stock === 0 && (
            <span className="self-start rounded-marca bg-error px-3 py-1 text-xs font-extrabold text-white">
              {textos.detalle.sinStock}
            </span>
          )}

          {producto.descripcion && (
            <p className="max-w-prose text-sm leading-relaxed md:text-base">
              {producto.descripcion}
            </p>
          )}

          {!tieneTalles && (
            <p className="text-sm">{textos.detalle.talleUnico}</p>
          )}

          <PedidoWhatsApp key={producto.slug} producto={producto} />

          <Link
            to="/catalogo"
            className="mt-2 self-start rounded-marca border border-gris-claro px-4 py-2 text-sm font-semibold outline-none transition-colors hover:border-violeta hover:text-violeta focus-visible:ring-2 focus-visible:ring-magenta focus-visible:ring-offset-2"
          >
            {textos.detalle.volver}
          </Link>
        </div>
      </div>
      </section>
    </>
  )
}

export default DetalleProducto
