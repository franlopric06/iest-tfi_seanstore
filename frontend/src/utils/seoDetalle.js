import textos from '../data/textos.js'
import { URL_SITIO } from '../data/sitio.js'

const seoDetalle = (producto) => {
  const seo = textos.detalle.seo

  const productoLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: producto.nombre,
    sku: producto.codigo,
    brand: { '@type': 'Brand', name: seo.marca },
  }
  if (producto.descripcion) {
    productoLd.description = producto.descripcion
  }
  if (Array.isArray(producto.fotos) && producto.fotos.length > 0) {
    // Las fotos subidas desde el panel ya traen la dirección completa (https://…).
    productoLd.image = producto.fotos.map((foto) =>
      /^https?:\/\//.test(foto.url) ? foto.url : URL_SITIO + foto.url,
    )
  }

  const pasos = [
    ...textos.catalogo.migas,
    { nombre: producto.categoria.nombre, ruta: `/catalogo/${producto.categoria.slug}` },
    { nombre: producto.nombre, ruta: `/producto/${producto.slug}` },
  ]
  const migasLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: pasos.map((paso, indice) => ({
      '@type': 'ListItem',
      position: indice + 1,
      name: paso.nombre,
      item: URL_SITIO + paso.ruta,
    })),
  }

  return {
    titulo: `${producto.nombre} · ${seo.marca}`,
    descripcion: `${producto.nombre} ${seo.descripcion}`,
    jsonLd: [productoLd, migasLd],
  }
}

export default seoDetalle
