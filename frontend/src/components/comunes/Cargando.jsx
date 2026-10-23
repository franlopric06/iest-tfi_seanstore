const Cargando = ({ etiqueta, cantidad = 8 }) => (
  <div role="status" aria-busy="true" aria-label={etiqueta}>
    <ul aria-hidden="true" className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
      {Array.from({ length: cantidad }, (_, numero) => (
        <li
          key={numero}
          data-testid="esqueleto-tarjeta"
          className="bg-white rounded-marca shadow-tarjeta"
        >
          <div className="aspect-square w-full bg-gris-claro" />
          <div className="flex flex-col gap-3 p-4">
            <div className="bg-gris-claro h-6 w-28 rounded-full" />
            <div className="bg-gris-claro h-6 w-3/4" />
            <div className="bg-gris-claro h-7 w-1/2" />
          </div>
        </li>
      ))}
    </ul>
  </div>
)

export default Cargando
