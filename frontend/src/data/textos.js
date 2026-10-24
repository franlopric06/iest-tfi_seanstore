const textos = {
  inicio: {
    seo: {
      titulo: "Sean's Store · Sublimación y productos personalizados",
      descripcion:
        'Tazas, termos, remeras, buzos, gorras y canilleras con tu diseño. Te atendemos por WhatsApp.',
    },
  },
  header: {
    altLogo: "Sean's Store: sublimación y productos personalizados",
    enlaceCatalogo: 'Catálogo',
  },
  catalogo: {
    titulo: 'Catálogo',
    cargando: 'Cargando productos',
    filtro: 'Filtrar por categoría',
    seo: {
      titulo: "Catálogo · Sean's Store",
      descripcion:
        'Elegí tu producto y te lo estampamos con tu diseño. Te atendemos por WhatsApp.',
    },
    seoCategorias: {
      'tazas-termos': {
        titulo: "Tazas y termos personalizados · Sean's Store",
        descripcion: 'Tazas y termos sublimados con tu diseño. Retiro en el local o envío.',
      },
      indumentaria: {
        titulo: "Indumentaria personalizada · Sean's Store",
        descripcion: 'Indumentaria sublimada con tu diseño. Retiro en el local o envío.',
      },
      deportes: {
        titulo: "Canilleras personalizadas · Sean's Store",
        descripcion: 'Canilleras sublimadas con tu diseño. Retiro en el local o envío.',
      },
      accesorios: {
        titulo: "Accesorios personalizados · Sean's Store",
        descripcion: 'Accesorios sublimados con tu diseño. Retiro en el local o envío.',
      },
    },
    migas: [{ nombre: 'Inicio', ruta: '/' }],
  },
  footer: {
    altIsotipo: "Isotipo de Sean's Store",
    descripcion: 'Sublimación y productos personalizados.',
    contactoTitulo: 'Contacto',
    contacto: 'Te atendemos por WhatsApp',
    aviso: 'Sitio de demostración: precios y datos de ejemplo.',
  },
  hero: {
    titulo: 'Tu diseño, en lo que quieras.',
    bajada: 'Una foto, tu logo, una frase o el número de tu equipo. Lo pasamos a remeras, tazas, buzos, gorras y todo lo que se te ocurra.',
    chips: ['Tu foto', 'Tu número', 'Tu frase', 'Tu logo'],
    botones: {
      verCatalogo: 'Ver catálogo',
      pedirPresupuesto: 'Pedir presupuesto',
      mensajePresupuesto: "Hola, Sean's Store. Quiero pedir un presupuesto.",
    },
    disenos: [
      {
        altRemera:
        'Remera blanca con una foto de paisaje con sol y colinas estampada en el pecho',
      },
      {
        altRemera: 'Remera blanca con el número 10 y "Tu nombre" estampados en el pecho',
      },
      {
        altRemera: 'Remera blanca con la frase "Feliz cumple" y subrayado amarillo estampada en el pecho',
      },
      { altRemera: 'Remera blanca con "Tu logo" en un recuadro punteado estampado en el pecho' },
    ],
  },
  franja: {
    categorias: [
      { nombre: 'Tazas y termos', slug: 'tazas-termos' },
      { nombre: 'Indumentaria', slug: 'indumentaria' },
      { nombre: 'Deportes', slug: 'deportes' },
      { nombre: 'Accesorios', slug: 'accesorios' },
    ],
    sellos: [
      'Pago seguro con Mercado Pago',
      'Retiro en el local o envío',
      'Te atendemos por WhatsApp',
    ],
  },
  cinta: {
    titulo: 'Elegí qué personalizar',
    frase: 'Elegí el producto y el color, y lo estampamos con tu diseño, con tintas que no se borran con el lavado.',
    etiqueta:
      'Tazas, remeras, gorras, termos y canilleras que pasan por la plancha y salen estampadas con un diseño de tinta',
    productos: [
      { id: 'taza', nombre: 'Tazas' },
      { id: 'remera', nombre: 'Remeras' },
      { id: 'gorra', nombre: 'Gorras' },
      { id: 'termo', nombre: 'Termos' },
      { id: 'canilleras', nombre: 'Canilleras' },
    ],
  },
  masPedidos: {
    titulo: 'Los más pedidos',
    enlace: 'Ver todo el catálogo',
  },
  facil: {
    titulo: 'Así de fácil',
    pasos: [
      {
        titulo: 'Elegí tu producto.',
        texto: 'Taza, remera, buzo, gorra, termo o canilleras, con el talle y el color que quieras.',
      },
      {
        titulo: 'Subí tu diseño.',
        texto: 'Una foto, tu logo o una frase. Si no tenés diseño, te lo hacemos por WhatsApp.',
      },
      {
        titulo: 'Pagá como quieras.',
        texto: 'Con Mercado Pago sin salir de la página, o en efectivo cuando lo retirás.',
      },
      {
        titulo: 'Retiralo o te lo enviamos.',
        texto: 'Te avisamos por email cuando está en producción y cuando está listo.',
      },
    ],
    pasoscorto: [
      { titulo: 'Elegí tu producto.', texto: 'Tazas, remeras, buzos, gorras, termos y canilleras.' },
      { titulo: 'Subí tu diseño.', texto: 'Una foto, tu logo o una frase.' },
      { titulo: 'Pagá como quieras.', texto: 'Mercado Pago o efectivo al retirar.' },
      { titulo: 'Retiralo o te lo enviamos.', texto: 'Te avisamos cuando esté listo.' },
    ],
  },
  sinDiseno: {
    titulo: '¿No tenés diseño? Te lo hacemos.',
    texto:
      'Contanos tu idea por WhatsApp y armamos el diseño con vos. Te mandamos el boceto, lo ajustamos hasta que te guste y te pasamos el precio.',
    boton: 'Consultar por WhatsApp',
    mensaje: "Hola, Sean's Store. No tengo diseño, ¿me ayudan a armarlo?",
  },
}

export default textos
