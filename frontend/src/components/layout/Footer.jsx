import textos from '../../data/textos.js'

const Footer = () => (
  <footer className="bg-violeta text-white">
    <div className="mx-auto max-w-7xl space-y-6 px-5 py-10">
      <img
        src="/img/isotipo-seanstore-fondo.png"
        alt={textos.footer.altIsotipo}
        className="h-16 w-auto"
      />
      <p className="font-titulos text-xl">{textos.footer.descripcion}</p>
      <div>
        <h2 className="text-lg">{textos.footer.contactoTitulo}</h2>
        <p className="text-white/80">{textos.footer.contacto}</p>
      </div>
      <p className="border-t border-white/30 pt-6 text-sm text-white/80">
        {textos.footer.aviso}
      </p>
    </div>
  </footer>
)

export default Footer
