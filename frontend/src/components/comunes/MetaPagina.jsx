import { useEffect } from 'react'

const ponerMeta = (selector, atributo, valor) => {
  let etiqueta = document.head.querySelector(selector)
  if (!etiqueta) {
    etiqueta = document.createElement('meta')
    const [, nombre, clave] = selector.match(/\[(\w+)="(.+)"\]/)
    etiqueta.setAttribute(nombre, clave)
    document.head.appendChild(etiqueta)
  }
  etiqueta.setAttribute(atributo, valor)
}

const MetaPagina = ({
  titulo,
  descripcion,
  imagen = 'https://sean-store.vercel.app/img/logo-seanstore-horizontal.png',
  indexar = true,
  jsonLd,
}) => {
  useEffect(() => {
    document.title = titulo
    ponerMeta('meta[name="description"]', 'content', descripcion)
    ponerMeta('meta[name="robots"]', 'content', indexar ? 'index, follow' : 'noindex, nofollow')
    ponerMeta('meta[property="og:title"]', 'content', titulo)
    ponerMeta('meta[property="og:description"]', 'content', descripcion)
    ponerMeta('meta[property="og:image"]', 'content', imagen)

    const anterior = document.getElementById('json-ld')
    if (anterior) anterior.remove()
    if (jsonLd) {
      const script = document.createElement('script')
      script.type = 'application/ld+json'
      script.id = 'json-ld'
      script.textContent = JSON.stringify(jsonLd)
      document.head.appendChild(script)
    }
  }, [titulo, descripcion, imagen, indexar, jsonLd])

  return null
}

export default MetaPagina
