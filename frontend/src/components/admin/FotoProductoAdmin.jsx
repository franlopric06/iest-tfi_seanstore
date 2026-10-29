import textos from '../../data/textos.js'

const FotoProductoAdmin = ({ producto }) => {
  const etiqueta = textos.panel.productos.sinFoto
  if (!producto.foto) {
    return (
      <span className="grid size-12 shrink-0 place-items-center rounded-marca bg-gris-claro text-xs text-grafito">
        {etiqueta}
      </span>
    )
  }

  return (
    <figure className="w-16 shrink-0">
      <img
        src={producto.foto.url}
        alt={producto.foto.alt}
        className="size-12 rounded-marca object-cover"
      />
      {producto.foto.generada_con_ia && (
        <figcaption className="text-[9px] leading-tight text-grafito">
          {textos.generadoConIA}
        </figcaption>
      )}
    </figure>
  )
}

export default FotoProductoAdmin
