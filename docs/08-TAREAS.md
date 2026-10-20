# 08 · Tareas

Se trabaja **una tarea por vez**, se prueba y se marca con `[x]` al terminarla.

- Las tareas de esta lista son **grandes**. Cada funcionalidad se divide en tareas de menos de 30 minutos dentro de su carpeta `specs/NNN-nombre/tasks.md`, siguiendo el ciclo SDD (ver `AGENTS.md`).
- Cada tarea chica termina en **un commit**.

# Versión 1 · TFI (entrega 28/10/2026)

## Etapa 0 · Arnés y preparación

- [x] Crear el repositorio público `iest-tfi_seanstore` en GitHub y subir el kit (docs, specs, arnés, marca y diseño)
- [ ] Conseguir los datos reales del negocio: productos, precios, talles, colores, dirección, horarios, número de WhatsApp y tiempos de entrega (ver `memory.md`)
- [x] Crear el frontend: React + Vite + React Router + Tailwind CSS v4 + Motion + Lucide, con el `@theme` de `IDENTIDAD-MARCA.md`
- [x] Configurar Vitest y Testing Library en el frontend, con un primer test que pase (`npm test`)
- [x] Crear el backend: Express con helmet y cors, `app.js` + `servidor.js` y la ruta `GET /api/salud` con su test (Vitest + Supertest)
- [ ] Crear la base en Neon con las tablas de la versión 1 (`categorias`, `productos`, `producto_fotos`, `consultas`, `preguntas_frecuentes`) y cargar los datos reales
- [x] Publicar el frontend y la API en Vercel (versión mínima) y probar las dos URL

## Etapa 1 · Funcionalidad 001 · Inicio, catálogo y detalle

- [ ] Ciclo SDD completo en `specs/001-catalogo/` (RF01, RF02, RF04)

## Etapa 2 · Funcionalidad 002 · Pedido por WhatsApp

- [ ] Ciclo SDD completo en `specs/002-pedido-whatsapp/` (RF07, RF24)

## Etapa 3 · Funcionalidad 003 · Asistente de preguntas frecuentes

- [ ] Ciclo SDD completo en `specs/003-asistente/` (RF25)

## Etapa 4 · Cierre de la versión 1

- [ ] Integrar las imágenes generadas con IA (de `multimedia/imagenes/`, en WebP) con su leyenda «Generado con IA»
- [ ] Página `/como-hicimos-este-sitio` con el uso de IA y los enlaces a los videos
- [ ] Títulos, descripciones y JSON-LD de `09-SEO.md` para las páginas de la versión 1
- [ ] Lighthouse de 80 o más en las cuatro categorías, en celular y en escritorio
- [ ] Revisar en celular (360 px), tablet y PC, y con teclado
- [ ] README con los enlaces: repositorio, sitio, video promocional y video demo

# Versión 2 · Después del TFI

Las etapas de abajo son el plan completo de la tienda. Lo que ya se haya hecho en la versión 1 se marca con `[x]`.

## Etapa V2.1 · Preparación

- [ ] Crear el repositorio `seanstore` en GitHub con `frontend/` y `backend/`
- [ ] Crear el proyecto React con Vite y React Router en `frontend/`
- [ ] Instalar Tailwind CSS v4 (`@tailwindcss/vite`), Motion, Lucide y Prettier con su plugin de Tailwind
- [ ] Crear el proyecto Express con helmet, cors y cookie-parser en `backend/`
- [ ] Crear `styles/index.css` con el `@theme` de `IDENTIDAD-MARCA.md` (colores, fuentes, radio y sombras)
- [ ] Copiar los logos de `marca/` a `frontend/public/img/` y el isotipo como `favicon.png`
- [ ] Componentes comunes: `Boton`, `CampoFormulario`, `CampoContrasena`, `Cargando`, `EstadoVacio`, `MensajeError`

## Etapa V2.2 · Base de datos

- [ ] Crear la base en Neon y guardar `DATABASE_URL` en `backend/.env`
- [ ] Ejecutar `esquema.sql` y cargar `datos-ejemplo.sql`
- [ ] Cargar las preguntas iniciales del asistente (tabla de `06-DISENO-UI.md`)
- [ ] Crear `conexion.js` y probar una consulta
- [ ] Script `crearAdmin.js` que pide email y contraseña y la guarda con bcrypt

## Etapa V2.3 · Estructura de la tienda

- [ ] `Header` (fijo, se achica al bajar), `Footer` (con legales y botón de arrepentimiento) y `BarraPromociones`
- [ ] `TransicionPagina` para animar el cambio entre pantallas
- [ ] `BotonWhatsAppFlotante`
- [ ] Ruta `GET /api/contenido` y `MetaPagina`
- [ ] Páginas legales con `PaginaLegal` y `data/legales.js`
- [ ] Página `NoEncontrada`

## Etapa V2.4 · Catálogo

- [ ] Rutas `GET /api/categorias`, `GET /api/productos` y `GET /api/productos/:slug`
- [ ] `TarjetaProducto` con `Precio` (precio anterior tachado) y etiquetas
- [ ] Página `Catalogo` con `FiltroCategorias`, `BuscadorProductos` y orden
- [ ] Página `DetalleProducto` con `GaleriaFotos`, `SelectorVariante` y stock
- [ ] `GuiaTalles` con `data/guiasTalles.js`
- [ ] `HeroSublimado` "Tu diseño en vivo" según `DESIGN.md` (y su versión sin movimiento)
- [ ] `FranjaCategorias` inclinada: cinta de categorías en loop + `SellosConfianza`
- [ ] `CintaProductos` según `DESIGN.md` (y su versión sin movimiento)
- [ ] Página `Inicio` con las secciones en el orden de `DESIGN.md`; comparar con `diseno/inicio-escritorio.html` y `diseno/inicio-celular.html`

## Etapa V2.5 · Diseño y carrito

- [ ] `OpcionDiseno`, `SubirDiseno` y `VistaPreviaDiseno`; ruta `POST /api/disenos` (Multer + Cloudinary)
- [ ] "No tengo diseño": `armarMensajeWhatsApp`, `POST /api/consultas` y abrir WhatsApp
- [ ] `CarritoContext` (guarda solo productos, variantes, cantidades y URL del diseño)
- [ ] `useAgregarAlCarrito` con la animación hacia el ícono y `CarritoLateral`
- [ ] Página `Carrito` con `ItemCarrito` y subtotal

## Etapa V2.6 · Cuentas

- [ ] Rutas de registro, login y logout con bcrypt y JWT en cookie
- [ ] `AuthContext`, `RutaProtegida`, `IniciarSesion` y `Registro`
- [ ] Servicio `email.js` con Brevo y `plantillasEmail.js`
- [ ] Recuperar contraseña: `OlvideContrasena`, `NuevaContrasena` y sus rutas
- [ ] `MisDatos` y `MisPedidos`
- [ ] Favoritos: rutas, `BotonFavorito` y página `Favoritos`

## Etapa V2.7 · Checkout y pagos

- [ ] Página `Checkout` con `FormEntrega` y `ResumenPedido`
- [ ] `POST /api/pedidos`: valida, revisa stock, calcula total y genera el código (transacción)
- [ ] `PagoMercadoPago` (Payment Brick) y `POST /api/pagos/procesar`
- [ ] `POST /api/pagos/webhook`: consulta el pago, marca `pagado`, descuenta stock, suma `vendidos` y manda el email
- [ ] Opción "Pagar al retirar en el local"
- [ ] Página `ResultadoPago` (aprobado, pendiente, rechazado)
- [ ] Probar todo con las credenciales y tarjetas de prueba de Mercado Pago

## Etapa V2.8 · Seguimiento y emails

- [ ] Página `SeguimientoPedido` con `LineaTiempoPedido`
- [ ] Email automático en cada cambio de estado (tabla de `06-DISENO-UI.md`)
- [ ] Tarea diaria `pedirResenas.js`: cancela pendientes de más de 48 h y manda los emails de reseña

## Etapa V2.9 · Confianza y atención

- [ ] Reseñas: `GET /api/resenas/pendientes/:token`, `POST /api/resenas` y página `DejarResena`
- [ ] `Estrellas`, `ListaResenas` y `Testimonios` en el detalle y en el inicio
- [ ] `FranjaMediosPago`
- [ ] `Asistente` con `buscarRespuesta`
- [ ] Página `Trabajos` y sección de trabajos en el inicio
- [ ] Páginas `EquiposEgresados` y `Contacto`
- [ ] Página `Arrepentimiento` y `POST /api/arrepentimiento` con su email

## Etapa V2.10 · Panel de administración

- [ ] `soloAdmin`, `MenuAdmin` y `AdminResumen` con métricas
- [ ] `AdminProductos` y `AdminFormProducto` (varias fotos, ordenables)
- [ ] `AdminPedidos` y `AdminDetallePedido` con cambio de estado
- [ ] `AdminConsultas` (diseño, presupuestos, arrepentimientos)
- [ ] `AdminResenas` y `AdminTestimonios`
- [ ] `AdminPreguntas`, `AdminPromociones`, `AdminMediosPago` y `AdminGaleria`
- [ ] `AdminUsuarios`

## Etapa V2.11 · SEO, calidad y publicación

- [ ] Completar títulos, descripciones y JSON-LD de `09-SEO.md`
- [ ] `generarSitemap.js`, `robots.txt` y `middleware.js` para Open Graph
- [ ] Vercel Web Analytics
- [ ] Revisar estados de carga, vacío y error en todas las pantallas
- [ ] Revisar los momentos clave y el sistema de movimiento; probar con "reducir movimiento" activado
- [ ] Revisar en celular (360 px), tablet y PC, y navegación con teclado
- [ ] Revisar la lista de control de `10-SEGURIDAD.md`
- [ ] Medir con PageSpeed (meta: 90 o más en celular)
- [ ] Publicar el frontend en Vercel y la API también en Vercel con sus variables de entorno
- [ ] Cambiar a credenciales reales de Mercado Pago y Brevo
- [ ] Hacer una compra real de punta a punta y probar cada email
