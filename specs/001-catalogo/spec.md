# Spec 001-catalogo · Inicio, catálogo y detalle

**RF de origen:** RF01, RF02, RF04 · **Estado:** aprobada · **Fecha:** 19/10/2026

## Contexto

Primera pantalla del negocio: la vidriera. Un cliente de Tinogasta (o de los alrededores) entra, ve la portada "Tu diseño en vivo", recorre las categorías y llega al detalle de cada producto para decidir qué quiere personalizar. En la versión 1 no se muestran precios porque el negocio cotiza según cantidad y diseño: cada producto dice "Consultá el precio" y el cierre de la venta es por WhatsApp (se construye en `specs/002-pedido-whatsapp/`). Los productos, talles y colores son los reales de Sean's Store.

## Catálogo real (carga inicial)

| Categoría (slug) | Productos | Talles | Colores |
| --- | --- | --- | --- |
| Tazas y termos (`tazas-termos`) | Taza de cerámica, Taza de polímero, Termo, Botella | Talle único | Blanco |
| Indumentaria (`indumentaria`) | Remera, Buzo, Campera | S a XXL | Blanco |
| Deportes (`deportes`) | Canilleras | S, M, L | Blanco |
| Accesorios (`accesorios`) | Gorra, Llavero, Mousepad, Almohadón | Talle único | Blanco |

Decisión 1 de la clarificación: **blanco en todos los productos, porque la sublimación solo se hace sobre blanco** (así funciona la técnica). Las gorras también en blanco hasta que el negocio confirme otros colores; si después pasan más colores, entran con `/cambio`.

- **Fotos:** se generan con IA. Van en `frontend/public/img/productos/` en WebP liviano; la base guarda la ruta. Los originales quedan en `multimedia/imagenes/` con su ficha en `FICHAS-IA.md`. La tabla `producto_fotos` lleva la columna `generada_con_ia` (BOOLEAN): la leyenda «Generado con IA» se muestra solo cuando está en `TRUE` (R12).
- **Precios:** el negocio cotiza por cantidad y diseño, así que **la versión 1 no muestra precios**; la columna `precio` de la base puede quedar vacía. Si el negocio pasa precios reales, se muestran con `/cambio`.
- **Destacados:** los 4 productos de "Los más pedidos" los está eligiendo el negocio (decisión 4 de la clarificación). Hasta que responda, ningún producto va con `destacado = TRUE` y la sección queda oculta (R3); cuando conteste, se marcan con `/cambio`.
- **Carga:** el agente escribe el SQL (esquema de las tablas de la versión 1 y la carga de las 4 categorías y los 13 productos) en `backend/src/db/`, y el estudiante lo ejecuta en el SQL Editor de Neon. La `DATABASE_URL` nunca pasa por el chat ni la ve el agente (principio 6). El `datos-ejemplo.sql` con precios en 0 no se usa en la versión 1.
- **Tablas de la versión 1** (decisión 8): `categorias`, `productos`, `producto_fotos`, `consultas` y `preguntas_frecuentes`. El resto de las tablas de `05-DATOS.md` (pedidos, usuarios, reseñas…) son de la versión 2.

## Historias de usuario

- Como cliente, quiero recorrer una vidriera clara con fotos y categorías, para darme cuenta de todo lo que puedo personalizar.
- Como cliente, quiero filtrar el catálogo por categoría, para encontrar rápido lo que busco (una remera, una taza, unas canilleras).
- Como cliente, quiero ver el detalle del producto con sus fotos, talles y colores, para decidir y consultar por WhatsApp.
- Como negocio, quiero que la vidriera muestre mis productos reales sin precios en pantalla, para que las consultas me lleguen por WhatsApp y cotizar cada pedido a mano.

## Requisitos (EARS)


| ID | Tipo | Requisito | Prioridad |
| --- | --- | --- | --- |
| R1 | Por evento | Cuando el cliente entre a `/`, el sistema deberá mostrar las secciones del inicio según `DESIGN.md`: portada "Tu diseño en vivo", franja de categorías con sellos, "Elegí qué personalizar", "Así de fácil" y "¿No tenés diseño?". (RF01) | Alta |
| R2 | Por evento | Cuando existan productos con `destacado = TRUE`, el sistema deberá mostrar hasta 4 tarjetas de producto en la sección "Los más pedidos", con el enlace "Ver todo el catálogo"; en celular la grilla se desliza de costado con Embla, según `DESIGN.md`. (RF01) | Alta |
| R3 | Por estado | Mientras no haya productos con `destacado = TRUE`, el sistema deberá ocultar la sección "Los más pedidos", sin rellenarla con contenido inventado. (RF01, RNF07) | Alta |
| R4 | Por evento | Cuando el cliente toque una categoría en la franja del inicio, el sistema deberá llevarlo al catálogo filtrado `/catalogo/:slug`. (RF01, RF02) | Alta |
| R5 | Ubicuo | El sistema deberá mostrar las tarjetas de producto con la foto principal, la etiqueta "Personalizable", el nombre y el texto "Consultá el precio", y al tocarlas deberá abrir `/producto/:slug`. (RF01, RF02) | Alta |
| R6 | Ubicuo | El sistema deberá mostrar en `/catalogo` el filtro por las 4 categorías reales y la grilla de productos activos (4 columnas en PC, 2 en tablet, 1 en celular). (RF02) | Alta |
| R7 | Por evento | Cuando el cliente entre a `/catalogo/:slug`, el sistema deberá mostrar solo los productos activos de esa categoría, con la categoría marcada en el filtro, y la página deberá tener su propio título y descripción SEO según `09-SEO.md`. (RF02) | Alta |
| R8 | Por evento | Cuando el catálogo no tenga resultados en un filtro, el sistema deberá mostrar el estado vacío "No encontramos productos con esta categoría" con el enlace "Ver todo el catálogo". (RF02, RNF09) | Alta |
| R9 | Por estado | Mientras cargan los datos del inicio, del catálogo o del detalle, el sistema deberá mostrar esqueletos grises con la forma del contenido. (RNF09) | Alta |
| R10 | Por evento | Cuando el cliente entre a `/producto/:slug`, el sistema deberá mostrar el detalle con la galería de fotos (la de `orden = 1` como principal), el nombre, la descripción, el texto "Consultá el precio", los talles disponibles ("Talle único" si no aplica), los colores disponibles y el enlace "Volver al catálogo" (navegación simple: el CTA de WhatsApp llega con `specs/002-pedido-whatsapp/`). (RF04) | Alta |
| R11 | Por evento | Cuando se pida un `slug` que no existe o un producto inactivo, el sistema deberá responder 404 y mostrar la página "No encontramos esta página" con botón al catálogo. (RF04) | Alta |
| R12 | Donde | Donde una foto tenga `generada_con_ia = TRUE`, el sistema deberá mostrar la etiqueta «Generado con IA» sobre la foto, tanto en la tarjeta del catálogo como en el detalle (decisión 6). (RNF12) | Alta |
| R13 | Por evento | Cuando un producto no tenga fotos cargadas, el sistema deberá mostrar en su lugar un recuadro con el nombre del producto. (RF04) | Alta |
| R14 | Ubicuo | La API deberá exponer `GET /api/categorias`, `GET /api/productos` (`?categoria=`, `?destacados=1`) y `GET /api/productos/:slug`, en JSON, solo con productos `activo = TRUE`, consultando la base desde `db/conexion.js` con parámetros y sobre las tablas de la versión 1 (decisión 8). (RF01, RF02, RF04) | Alta |
| R15 | Ubicuo | El detalle y el catálogo deberán aplicar el SEO de `09-SEO.md`: título y descripción por página, un solo `<h1>`, `alt` en todas las imágenes, JSON-LD de migas de pan y JSON-LD de producto **sin el bloque `offers`** mientras no haya precios reales (decisión 7). El Open Graph por producto (middleware de Vercel) pasa a la versión 2: en la v1 van solo las etiquetas Open Graph generales del sitio en `index.html` (decisión 10). (RF02, RF04) | Alta |
| R16 | Por estado | Mientras la persona tenga activado "reducir movimiento", el sistema deberá mostrar cada animación del inicio y del detalle en su estado final, sin movimiento. (RNF10) | Alta |
| R17 | Por evento | Cuando falle la carga del inicio, del catálogo o del detalle (API caída), el sistema deberá mostrar el estado de error "Algo salió mal, probá de nuevo" con botón "Reintentar". (RNF09) | Alta |

Notas sobre la decisión de alcance:

- El **selector** de talle, color y cantidad, las opciones "Tengo mi diseño" / "No tengo diseño" y los botones de WhatsApp del detalle **son de `specs/002-pedido-whatsapp/`** (decisión del estudiante). En 001 el detalle muestra talles y colores como información; RF04 se completa con la suma de 002.
- El **stock no se muestra** en la versión 1: Sean's Store produce a pedido (compra los productos en blanco y los estampa cuando el cliente pide), así que no hay stock de productos terminados que mostrar. La parte de stock de RF04 queda fuera de alcance de la versión 1.

## Casos límite

- **Base sin productos o API caída:** estados vacío o de error (R9, R17); nunca una pantalla en blanco.
- **Categoría sin productos activos:** estado vacío (R8), el filtro sigue usable.
- **Slug inexistente o producto pausado:** 404 con página propia (R11).
- **Producto sin fotos:** recuadro con el nombre (R13); si una foto no carga, por su `alt` se entiende igual.
- **Productos sin destacado:** "Los más pedidos" se oculta (R3) hasta que el negocio marque los 4 con `/cambio`.
- **Nombres y descripciones largos:** el nombre se trunca con puntos suspensivos en la tarjeta y se completa en el detalle; la descripción usa `max-w-prose`.
- **Talle único:** se muestra el texto "Talle único" en vez de la lista de talles.
- **Celular (desde 360 px):** portada en una columna, grilla de 1 columna, franjas inclinadas a −3°, todo tocable (44 px).
- **Sin conexión:** mensaje "Parece que no tenés conexión. Revisá tu internet." y reintentar.
- **Movimiento reducido:** animaciones quietas en su estado final (R16), el contenido nunca queda inaccesible.
- **Fotos IA:** etiqueta «Generado con IA» solo si `generada_con_ia = TRUE` (R12); las fotos reales futuras van en `FALSE` y no llevan leyenda.

## Fuera de alcance

- **Buscador y orden** (RF03, Media): sin buscador, sin ordenar por precio/novedad/más vendidos, sin paginación (la tienda es chica).
- **Precios en pantalla, precio anterior tachado y etiqueta "Oferta"** (RF04): el negocio no pasó precios; entran con `/cambio` cuando los cargue.
- **Stock** (parte de RF04): sin indicador en la versión 1, porque el negocio produce a pedido (decisión 2).
- **Guía de talles** (RF05, Media): el detalle lista los talles, pero la ventana con medidas va a la siguiente etapa.
- **Selector de talle/color/cantidad, opciones de diseño y botones de WhatsApp del detalle** (RF07): son de `specs/002-pedido-whatsapp/`.
- **Botón flotante de WhatsApp** (RF24): 002. **Asistente** (RF25): 003.
- **Trabajos, reseñas y promociones** (RF08, RF27, RF31): esas secciones **no se construyen** en la versión 1 (tampoco sus tablas: la v1 solo tiene `categorias`, `productos`, `producto_fotos`, `consultas` y `preguntas_frecuentes`, decisión 8).
- **Favoritos** (RF10, Baja): requieren cuenta (versión 2); la tarjeta no muestra el corazón en v1.
- **Carrito, checkout, pagos online, seguimiento, cuentas y panel** (versión 2).
- **Open Graph por producto con el middleware de Vercel** (decisión 10): es de la versión 2; en la v1 solo las etiquetas generales de `index.html` (`frontend/middleware.js` se queda para la v2).

## Criterios de finalización

- [ ] Todos los requisitos Alta cumplen en `verificacion.md` (con la excepción documentada de RF04 que se completa en 002).
- [ ] Tests en verde (`npm test` en `frontend/` y `backend/`) y `npm run build` sin errores.
- [ ] Lighthouse 80 o más en las cuatro categorías.
- [ ] Revisado con la skill `revisar-marca` (tokens, tipografías, foco, `useReducedMotion`, leyenda «Generado con IA»).
- [ ] Los 4 productos destacados del negocio anotados en `memory.md` (se marcan con `/cambio` cuando él responda).

## Historial de cambios

| Fecha | Cambio | Motivo |
| --- | --- | --- |
| 19/10/2026 | Creación de la spec (borrador) | Fase 1 del ciclo SDD para 001-catalogo |
| 19/10/2026 | Clarificación: colores (blanco, técnica de sublimación), sin stock (produce a pedido), carga SQL en `backend/src/db/`, destacados pendientes del negocio, fotos IA en `public/img/productos/` + columna `generada_con_ia`, leyenda IA en tarjeta y detalle, JSON-LD sin `offers`, tablas de v1 y sin sección de reseñas, enlace "Volver al catálogo" | Fase 2 del ciclo SDD: las 9 decisiones del estudiante (`clarificacion.md`) |
| 19/10/2026 | Estado pasa a **aprobada** | Todas las decisiones cerradas y documentadas |
| 19/10/2026 | Decisión 10 del estudiante: sin Open Graph por producto en la v1 (middleware de Vercel → v2); R15 ajustado y nota en "Fuera de alcance". Docs alineados: `05-DATOS.md` (columna `generada_con_ia`, `precio` nullable en v1, nota de tablas de la v1) y `04-ARQUITECTURA.md` (detalle sin reseñas ni stock en la v1) | Fase 2 cerrada: los docs ahora coinciden con la spec |
