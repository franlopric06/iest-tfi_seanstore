# 04 · Arquitectura

El proyecto tiene dos partes separadas: `frontend/` (la tienda y el panel) y `backend/` (la API que habla con la base de datos, Mercado Pago, Cloudinary y Brevo). Cada componente, página o función va en su propio archivo, de no más de ~150 líneas.

## Árbol de carpetas

```text
iest-tfi_seanstore/
├── AGENTS.md                            ← reglas para la IA (se lee primero)
├── CLAUDE.md                            ← apunta a AGENTS.md
├── memory.md                            ← estado del proyecto y decisiones
├── README.md                            ← qué es, enlaces y cómo correrlo
├── DESIGN.md                            ← diseño aprobado y animaciones
├── ETAPA-1.md                           ← qué se construye en la primera etapa (TFI)
├── opencode.json                        ← permisos del agente
├── .opencode/commands/                  ← /spec, /clarificar, /plan, /tareas, /implementar, /verificar, /cambio
├── .agents/skills/                      ← verificar-criterios, revisar-marca, registrar-error-ia
├── docs/                                ← estas especificaciones + CONSTITUCION, PROMPTS, DECLARACION-IA
├── specs/                               ← una carpeta por funcionalidad (001-catalogo…)
├── marca/                               ← logos y paleta originales
├── diseno/                              ← prototipos HTML aprobados (solo referencia)
├── multimedia/                          ← imagenes/, video/, graficos/ y FICHAS-IA.md
├── frontend/
│   ├── index.html
│   ├── vite.config.js
│   ├── vercel.json                      ← redirige todas las rutas a index.html
│   ├── tests/                           ← tests de componentes y páginas (Vitest)
│   ├── middleware.js                    ← Open Graph de productos para bots (ver 09-SEO)
│   ├── scripts/
│   │   └── generarSitemap.js            ← crea public/sitemap.xml antes del build
│   ├── public/
│   │   ├── favicon.png                  ← isotipo
│   │   ├── robots.txt
│   │   └── img/                         ← logos, banner, imagen para compartir
│   └── src/
│       ├── main.jsx
│       ├── App.jsx                      ← rutas
│       ├── pages/
│       │   ├── tienda/
│       │   │   ├── Inicio.jsx
│       │   │   ├── Catalogo.jsx
│       │   │   ├── DetalleProducto.jsx
│       │   │   ├── Carrito.jsx
│       │   │   ├── Checkout.jsx
│       │   │   ├── ResultadoPago.jsx
│       │   │   ├── SeguimientoPedido.jsx
│       │   │   ├── Trabajos.jsx               ← galería de trabajos realizados
│       │   │   ├── EquiposEgresados.jsx
│       │   │   ├── Contacto.jsx
│       │   │   ├── Arrepentimiento.jsx
│       │   │   ├── DejarResena.jsx
│       │   │   ├── PaginaLegal.jsx            ← términos, privacidad, cambios
│       │   │   └── NoEncontrada.jsx           ← error 404
│       │   ├── cuenta/
│       │   │   ├── IniciarSesion.jsx
│       │   │   ├── Registro.jsx
│       │   │   ├── OlvideContrasena.jsx
│       │   │   ├── NuevaContrasena.jsx
│       │   │   ├── MisPedidos.jsx
│       │   │   ├── MisDatos.jsx
│       │   │   └── Favoritos.jsx
│       │   └── admin/
│       │       ├── AdminResumen.jsx           ← métricas
│       │       ├── AdminPedidos.jsx
│       │       ├── AdminDetallePedido.jsx
│       │       ├── AdminProductos.jsx
│       │       ├── AdminFormProducto.jsx
│       │       ├── AdminConsultas.jsx
│       │       ├── AdminResenas.jsx
│       │       ├── AdminTestimonios.jsx
│       │       ├── AdminPreguntas.jsx
│       │       ├── AdminPromociones.jsx
│       │       ├── AdminMediosPago.jsx
│       │       ├── AdminGaleria.jsx
│       │       └── AdminUsuarios.jsx
│       ├── components/
│       │   ├── layout/
│       │   │   ├── Header.jsx
│       │   │   ├── Footer.jsx                 ← legales + botón de arrepentimiento
│       │   │   ├── BarraPromociones.jsx
│       │   │   ├── MenuAdmin.jsx
│       │   │   ├── CarritoLateral.jsx         ← panel que se desliza al agregar
│       │   │   ├── TransicionPagina.jsx       ← animación entre pantallas
│       │   │   └── RutaProtegida.jsx
│       │   ├── tienda/
│       │   │   ├── HeroSublimado.jsx          ← portada "Tu diseño en vivo" (remera que cambia de diseño)
│       │   │   ├── FranjaCategorias.jsx       ← franja inclinada: categorías en loop + sellos
│       │   │   ├── CintaProductos.jsx         ← productos que pasan y se estampan ("Elegí qué personalizar")
│       │   │   ├── TarjetaProducto.jsx
│       │   │   ├── GaleriaFotos.jsx
│       │   │   ├── Precio.jsx                 ← precio y precio anterior tachado
│       │   │   ├── FiltroCategorias.jsx
│       │   │   ├── BuscadorProductos.jsx
│       │   │   ├── SelectorVariante.jsx       ← talle, color, cantidad
│       │   │   ├── GuiaTalles.jsx
│       │   │   ├── OpcionDiseno.jsx           ← "Tengo mi diseño" / "No tengo diseño"
│       │   │   ├── SubirDiseno.jsx
│       │   │   ├── VistaPreviaDiseno.jsx      ← diseño apoyado sobre la foto (ilustrativo)
│       │   │   ├── BotonFavorito.jsx
│       │   │   ├── ItemCarrito.jsx
│       │   │   ├── ResumenPedido.jsx
│       │   │   ├── FormEntrega.jsx
│       │   │   ├── PagoMercadoPago.jsx        ← Payment Brick
│       │   │   └── LineaTiempoPedido.jsx
│       │   ├── confianza/
│       │   │   ├── Estrellas.jsx
│       │   │   ├── ListaResenas.jsx
│       │   │   ├── Testimonios.jsx
│       │   │   ├── FranjaMediosPago.jsx
│       │   │   └── SellosConfianza.jsx
│       │   ├── atencion/
│       │   │   ├── BotonWhatsAppFlotante.jsx
│       │   │   └── Asistente.jsx              ← burbuja de preguntas frecuentes
│       │   └── comunes/
│       │       ├── Boton.jsx
│       │       ├── CampoFormulario.jsx
│       │       ├── CampoContrasena.jsx        ← con botón mostrar/ocultar
│       │       ├── Cargando.jsx
│       │       ├── EstadoVacio.jsx
│       │       ├── MensajeError.jsx
│       │       ├── EstadoPedido.jsx           ← etiqueta de color por estado
│       │       └── MetaPagina.jsx             ← título, descripción y JSON-LD
│       ├── context/
│       │   ├── CarritoContext.jsx
│       │   └── AuthContext.jsx
│       ├── services/
│       │   └── api.js                         ← todas las llamadas a la API
│       ├── data/
│       │   ├── textos.js                      ← textos de inicio y "¿Cómo comprar?"
│       │   ├── guiasTalles.js
│       │   └── legales.js                     ← estructura de las páginas legales
│       ├── utils/
│       │   ├── formatearPrecio.js
│       │   ├── armarMensajeWhatsApp.js
│       │   ├── buscarRespuesta.js             ← busca la pregunta frecuente más parecida
│       │   └── validarFormulario.js
│       ├── hooks/
│       │   └── useAgregarAlCarrito.js         ← agrega y dispara la animación al carrito
│       └── styles/
│           └── index.css                      ← Tailwind + @theme de la marca (único CSS)
└── backend/
    ├── package.json
    ├── tests/                               ← tests de rutas de la API (Vitest + Supertest)
    ├── .env                                   ← claves (no se sube a GitHub)
    └── src/
        ├── app.js                             ← crea la app de Express y la exporta (Vercel la usa así)
        ├── servidor.js                        ← solo para desarrollo local: app.listen(3000)
        ├── routes/          ← un archivo por recurso: productos, disenos, auth, cuenta, pedidos,
        │                       pagos, resenas, contenido, consultas, arrepentimiento, admin
        ├── controllers/     ← mismo nombre que su ruta (ej. pedidos.controller.js)
        ├── middlewares/
        │   ├── verificarSesion.js
        │   ├── sesionOpcional.js              ← si hay sesión la usa, si no sigue como invitado
        │   ├── soloAdmin.js
        │   ├── validarPedido.js
        │   ├── subirImagen.js                 ← Multer: tipo y tamaño
        │   └── limitarIntentos.js
        ├── services/
        │   ├── mercadoPago.js                 ← crear pago y consultar pagos
        │   ├── cloudinary.js
        │   ├── email.js                       ← envía con Brevo
        │   ├── plantillasEmail.js             ← textos de cada email
        │   ├── stock.js                       ← verificar y descontar stock
        │   ├── codigos.js                     ← genera SS-0001, ARR-0001…
        │   └── metricas.js
        ├── jobs/
        │   └── pedirResenas.js                ← versión 2, lo llama Vercel Cron una vez por día
        └── db/
            ├── conexion.js                    ← única conexión a PostgreSQL
            ├── esquema.sql
            └── datos-ejemplo.sql
```

## Función de cada parte

| Carpeta | Qué hace |
| --- | --- |
| `frontend/src/pages/tienda` | Páginas públicas de la tienda |
| `frontend/src/pages/cuenta` | Login, registro, recuperar contraseña y datos del cliente |
| `frontend/src/pages/admin` | Panel del negocio (solo admin) |
| `frontend/src/components` | Piezas reutilizables, agrupadas por tema |
| `frontend/src/context` | Estado del carrito y de la sesión |
| `frontend/src/data` | Textos fijos y guías de talles |
| `frontend/src/services` | Único lugar que llama a la API |
| `backend/src/routes` | Define las rutas `/api/...` |
| `backend/src/controllers` | La lógica de cada ruta |
| `backend/src/middlewares` | Sesión, permisos y validaciones antes del controlador |
| `backend/src/services` | Mercado Pago, Cloudinary, emails, stock, códigos y métricas |
| `backend/src/jobs` | Tareas que se ejecutan solas cada día |
| `backend/src/db` | Conexión, tablas y datos de prueba |

## Rutas de la API

### Públicas

| Método | Ruta | Qué hace |
| --- | --- | --- |
| GET | `/api/productos` | Lista productos (`?categoria=`, `?buscar=`, `?orden=precio_asc\|precio_desc\|nuevos\|vendidos`, `?destacados=1`) |
| GET | `/api/productos/:slug` | Detalle con fotos, stock, guía de talles y reseñas aprobadas |
| GET | `/api/categorias` | Lista de categorías |
| GET | `/api/contenido` | Promociones vigentes, medios de pago, preguntas frecuentes, testimonios y trabajos destacados |
| GET | `/api/trabajos` | Galería de trabajos (`?tipo=`) |
| POST | `/api/disenos` | Sube la imagen del diseño y devuelve su URL |
| POST | `/api/pedidos` | Valida, revisa stock, calcula total y crea el pedido |
| GET | `/api/pedidos/seguimiento` | Estado de un pedido con `?codigo=` + `?email=` |
| POST | `/api/pagos/procesar` | Recibe el token del Payment Brick y crea el pago en Mercado Pago |
| POST | `/api/pagos/webhook` | Aviso de Mercado Pago; actualiza el pedido |
| POST | `/api/consultas` | Guarda consulta de presupuesto o de "no tengo diseño" |
| POST | `/api/arrepentimiento` | Registra el pedido de arrepentimiento y devuelve el código |
| GET | `/api/resenas/pendientes/:token` | Productos que el cliente puede reseñar (link del email) |
| POST | `/api/resenas` | Guarda una reseña (queda pendiente de aprobación) |

### Cuenta (requieren sesión, salvo registro, login y contraseña)

| Método | Ruta | Qué hace |
| --- | --- | --- |
| POST | `/api/auth/registro` | Crea una cuenta de cliente |
| POST | `/api/auth/login` | Inicia sesión (deja la cookie) |
| POST | `/api/auth/logout` | Cierra la sesión |
| POST | `/api/auth/olvide-contrasena` | Envía el email con el link de recuperación |
| POST | `/api/auth/nueva-contrasena` | Cambia la contraseña con el token del link |
| GET | `/api/cuenta/yo` | Datos del usuario logueado |
| PUT | `/api/cuenta/datos` | Edita nombre, teléfono y dirección |
| PUT | `/api/cuenta/contrasena` | Cambia la contraseña (pide la actual) |
| GET | `/api/cuenta/pedidos` | Pedidos del cliente |
| GET / POST / DELETE | `/api/cuenta/favoritos` | Lista, agrega o quita favoritos |

### Panel (requieren rol `admin`)

| Método | Ruta | Qué hace |
| --- | --- | --- |
| GET | `/api/admin/metricas` | Ventas del mes, más vendidos, pedidos por estado |
| GET / POST / PUT / DELETE | `/api/admin/productos` | Gestión de productos, fotos y stock |
| GET / PATCH | `/api/admin/pedidos` | Ver pedidos y cambiar su estado (envía el email) |
| GET / PATCH | `/api/admin/consultas` | Ver consultas y marcarlas como atendidas |
| GET / PATCH | `/api/admin/arrepentimientos` | Ver arrepentimientos y cambiar su estado |
| GET / PATCH | `/api/admin/resenas` | Aprobar, ocultar o destacar reseñas |
| CRUD | `/api/admin/testimonios` | Testimonios de clientes |
| CRUD | `/api/admin/preguntas` | Preguntas del asistente |
| CRUD | `/api/admin/promociones` | Barra de promociones |
| CRUD | `/api/admin/medios-pago` | Franja de medios de pago |
| CRUD | `/api/admin/trabajos` | Galería de trabajos |
| GET | `/api/admin/usuarios` | Clientes y sus compras |

Todas las respuestas son JSON. Los errores devuelven `{ "error": "mensaje para mostrar" }` con el código HTTP que corresponda (400, 401, 403, 404, 409, 500).
