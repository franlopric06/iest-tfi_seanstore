import { useMemo } from 'react'
import { useParams } from 'react-router-dom'
import Cargando from '../../components/comunes/Cargando.jsx'
import EstadoVacio from '../../components/comunes/EstadoVacio.jsx'
import MetaPagina from '../../components/comunes/MetaPagina.jsx'
import FiltroCategorias from '../../components/tienda/FiltroCategorias.jsx'
import TarjetaProducto from '../../components/tienda/TarjetaProducto.jsx'
import useObtenerDatos from '../../hooks/useObtenerDatos.js'
import { obtenerProductos } from '../../services/api.js'
import textos from '../../data/textos.js'
import { URL_SITIO } from '../../data/sitio.js'

const Catalogo = () => {
  const { slug } = useParams()

  const pedir = slug ? () => obtenerProductos({ categoria: slug }) : () => obtenerProductos()
  const { cargando, datos: productos } = useObtenerDatos(pedir, [slug])

  const categoria = textos.franja.categorias.find((c) => c.slug === slug)
  const seo = (categoria && textos.catalogo.seoCategorias[slug]) || textos.catalogo.seo

  const jsonLd = useMemo(() => {
    const itemListElement = [
      ...textos.catalogo.migas.map((miga, indice) => ({
        '@type': 'ListItem',
        position: indice + 1,
        name: miga.nombre,
        item: URL_SITIO + miga.ruta,
      })),
      {
        '@type': 'ListItem',
        position: textos.catalogo.migas.length + 1,
        name: textos.catalogo.titulo,
        item: `${URL_SITIO}/catalogo`,
      },
    ]
    if (categoria) {
      itemListElement.push({
        '@type': 'ListItem',
        position: itemListElement.length + 1,
        name: categoria.nombre,
        item: `${URL_SITIO}/catalogo/${categoria.slug}`,
      })
    }
    return { '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement }
  }, [categoria])

  return (
    <section className="mx-auto max-w-6xl px-5 pb-16">
      <MetaPagina titulo={seo.titulo} descripcion={seo.descripcion} jsonLd={jsonLd} />
      <h1 className="pt-8 pb-6 font-titulos text-2xl md:pt-12 md:text-3xl">{textos.catalogo.titulo}</h1>
      <FiltroCategorias marcada={slug} />
      {cargando ? (
        <Cargando etiqueta={textos.catalogo.cargando} />
      ) : (
        <>
          {Array.isArray(productos) && productos.length === 0 && (
            <EstadoVacio
              frase={textos.catalogo.vacio.frase}
              enlace={textos.catalogo.vacio.enlace}
            />
          )}
          {Array.isArray(productos) && productos.length > 0 && (
            <ul className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
              {productos.map((producto) => (
                <li key={producto.slug}>
                  <TarjetaProducto producto={producto} />
                </li>
              ))}
            </ul>
          )}
        </>
      )}
    </section>
  )
}

export default Catalogo
