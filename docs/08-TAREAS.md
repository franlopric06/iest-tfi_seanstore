# 08 · Tareas

Plan general para construir **la tienda completa**, por etapas. Se trabaja una tarea por vez, se prueba y se marca con `[x]` al terminarla.

- **La primera etapa (TFI) está en `ETAPA-1.md`.** Sus tareas chicas, de menos de 30 minutos, están en `specs/NNN-nombre/tasks.md`.
- Lo que se haga en la primera etapa se marca acá con `[x]` cuando corresponda.

## Etapa 1 · Preparación

- [x] Crear el repositorio `iest-tfi_seanstore` en GitHub con `frontend/` y `backend/`
- [x] Crear el proyecto React con Vite y React Router en `frontend/`
- [ ] Instalar Tailwind CSS v4 (`@tailwindcss/vite`), Motion, Lucide y Prettier con su plugin de Tailwind
- [ ] Crear el proyecto Express con helmet, cors y cookie-parser en `backend/`
- [x] Crear `styles/index.css` con el `@theme` de `IDENTIDAD-MARCA.md` (colores, fuentes, radio y sombras)
- [x] Copiar los logos de `marca/` a `frontend/public/img/` y el isotipo como `favicon.png`
- [ ] Componentes comunes: `Boton`, `CampoFormulario`, `CampoContrasena`, `Cargando`, `EstadoVacio`, `MensajeError`

## Etapa 2 · Base de datos

- [x] Crear la base en Neon (la `DATABASE_URL` se guarda en `backend/.env`)
- [ ] Ejecutar `esquema.sql` y cargar `datos-ejemplo.sql`
- [ ] Cargar las preguntas iniciales del asistente (tabla de `06-DISENO-UI.md`)
- [ ] Crear `conexion.js` y probar una consulta
- [ ] Script `crearAdmin.js` que pide email y contraseña y la guarda con bcrypt

## Etapa 3 · Estructura de la tienda

- [ ] `Header` (fijo, se achica al bajar), `Footer` (con legales y botón de arrepentimiento) y `BarraPromociones`
- [ ] `TransicionPagina` para animar el cambio entre pantallas
- [ ] `BotonWhatsAppFlotante`
- [ ] Ruta `GET /api/contenido` y `MetaPagina`
- [ ] Páginas legales con `PaginaLegal` y `data/legales.js`
- [ ] Página `NoEncontrada`

## Etapa 4 · Catálogo

- [ ] Rutas `GET /api/categorias`, `GET /api/productos` y `GET /api/productos/:slug`
- [ ] `TarjetaProducto` con `Precio` (precio anterior tachado) y etiquetas
- [ ] Página `Catalogo` con `FiltroCategorias`, `BuscadorProductos` y orden
- [ ] Página `DetalleProducto` con `GaleriaFotos`, `SelectorVariante` y stock
- [ ] `GuiaTalles` con `data/guiasTalles.js`
- [ ] `HeroSublimado` "Tu diseño en vivo" según `DESIGN.md` (y su versión sin movimiento)
- [ ] `FranjaCategorias` inclinada: cinta de categorías en loop + `SellosConfianza`
- [ ] `CintaProductos` según `DESIGN.md` (y su versión sin movimiento)
- [ ] Página `Inicio` con las secciones en el orden de `DESIGN.md`; comparar con `diseno/inicio-escritorio.html` y `diseno/inicio-celular.html`

## Etapa 5 · Diseño y carrito

- [ ] `OpcionDiseno`, `SubirDiseno` y `VistaPreviaDiseno`; ruta `POST /api/disenos` (Multer + Cloudinary)
- [ ] "No tengo diseño": `armarMensajeWhatsApp`, `POST /api/consultas` y abrir WhatsApp
- [ ] `CarritoContext` (guarda solo productos, variantes, cantidades y URL del diseño)
- [ ] `useAgregarAlCarrito` con la animación hacia el ícono y `CarritoLateral`
- [ ] Página `Carrito` con `ItemCarrito` y subtotal

## Etapa 6 · Cuentas

- [ ] Rutas de registro, login y logout con bcrypt y JWT en cookie
- [ ] `AuthContext`, `RutaProtegida`, `IniciarSesion` y `Registro`
- [ ] Servicio `email.js` con Brevo y `plantillasEmail.js`
- [ ] Recuperar contraseña: `OlvideContrasena`, `NuevaContrasena` y sus rutas
- [ ] `MisDatos` y `MisPedidos`
- [ ] Favoritos: rutas, `BotonFavorito` y página `Favoritos`

## Etapa 7 · Checkout y pagos

- [ ] Página `Checkout` con `FormEntrega` y `ResumenPedido`
- [ ] `POST /api/pedidos`: valida, revisa stock, calcula total y genera el código (transacción)
- [ ] `PagoMercadoPago` (Payment Brick) y `POST /api/pagos/procesar`
- [ ] `POST /api/pagos/webhook`: consulta el pago, marca `pagado`, descuenta stock, suma `vendidos` y manda el email
- [ ] Opción "Pagar al retirar en el local"
- [ ] Página `ResultadoPago` (aprobado, pendiente, rechazado)
- [ ] Probar todo con las credenciales y tarjetas de prueba de Mercado Pago

## Etapa 8 · Seguimiento y emails

- [ ] Página `SeguimientoPedido` con `LineaTiempoPedido`
- [ ] Email automático en cada cambio de estado (tabla de `06-DISENO-UI.md`)
- [ ] Tarea diaria `pedirResenas.js`: cancela pendientes de más de 48 h y manda los emails de reseña

## Etapa 9 · Confianza y atención

- [ ] Reseñas: `GET /api/resenas/pendientes/:token`, `POST /api/resenas` y página `DejarResena`
- [ ] `Estrellas`, `ListaResenas` y `Testimonios` en el detalle y en el inicio
- [ ] `FranjaMediosPago`
- [ ] `Asistente` con `buscarRespuesta`
- [ ] Página `Trabajos` y sección de trabajos en el inicio
- [ ] Páginas `EquiposEgresados` y `Contacto`
- [ ] Página `Arrepentimiento` y `POST /api/arrepentimiento` con su email

## Etapa 10 · Panel de administración

- [ ] `soloAdmin`, `MenuAdmin` y `AdminResumen` con métricas
- [ ] `AdminProductos` y `AdminFormProducto` (varias fotos, ordenables)
- [ ] `AdminPedidos` y `AdminDetallePedido` con cambio de estado
- [ ] `AdminConsultas` (diseño, presupuestos, arrepentimientos)
- [ ] `AdminResenas` y `AdminTestimonios`
- [ ] `AdminPreguntas`, `AdminPromociones`, `AdminMediosPago` y `AdminGaleria`
- [ ] `AdminUsuarios`

## Etapa 11 · SEO, calidad y publicación

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
