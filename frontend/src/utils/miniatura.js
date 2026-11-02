// Las fotos de productos del proyecto (/img/productos/*.webp) tienen una copia
// chica de 480 px (*-480.webp) para las tarjetas del catálogo: en el celular la
// tarjeta mide unos 170 px, así que bajar la de 1024 px era desperdiciar datos.
// Las fotos subidas desde el panel (URL de Blob) no tienen copia y se usan tal cual.
export const miniatura = (url) =>
  typeof url === 'string' && /^\/img\/productos\/.+(?<!-480)\.webp$/.test(url)
    ? url.replace(/\.webp$/, '-480.webp')
    : null

// srcSet y sizes para que el navegador elija la versión según el ancho de pantalla.
export const fuentesTarjeta = (url) => {
  const chica = miniatura(url)
  if (!chica) return {}
  return {
    srcSet: `${chica} 480w, ${url} 1024w`,
    sizes: '(min-width: 1024px) 25vw, (min-width: 768px) 33vw, 50vw',
  }
}
