# Spec 001-catalogo · Inicio, catálogo y detalle

**RF de origen:** RF01, RF02, RF04 · **Estado:** aprobada · **Fecha:** 19/10/2026

## Contexto

Primera pantalla de la tienda: la vidriera. Un cliente entra, ve la portada "Tu diseño en vivo", recorre las categorías y llega al detalle de cada producto, con su precio, para decidir qué quiere personalizar. El pedido se cierra por WhatsApp (se construye en `specs/002-pedido-whatsapp/`). Es la primera funcionalidad de `ETAPA-1.md`: una tienda de demostración con los productos de Sean's Store y **datos de ejemplo** (precio, stock y descripción) definidos por el equipo.

## Catálogo (carga inicial)

| Categoría (slug) | Productos | Talles | Colores |
| --- | --- | --- | --- |
| Tazas y termos (`tazas-termos`) | Taza de cerámica, Taza de polímero, Termo, Botella | Talle único | Cerámica y polímero: Blanco, Negro, Beige, Verde claro · Termo: Blanco, Negro, Rosa, Verde claro · Botella: Blanco, Negro, Azul |
| Indumentaria (`indumentaria`) | Remera, Buzo, Campera | S a XXL | Remera: Blanco, Negro, Gris, Azul, Rojo · Buzo y campera: Blanco, Negro, Gris, Azul |
| Deportes (`deportes`) | Canilleras | S, M, L | Blanco, Negro |
| Accesorios (`accesorios`) | Gorra, Llavero, Mousepad, Almohadón | Talle único | Gorra: Blanco, Negro, Azul · Llavero: Blanco, Negro, Transparente · Mousepad: Blanco, Negro · Almohadón: Blanco, Gris, Verde claro |

- **Colores:** el negocio sublima en muchos colores y cada producto lleva su lista (la de la tabla de arriba y la de `datos-demo.sql`). Corrige la decisión 1 del 19/10/2026 ("solo blanco"): es el hallazgo 1 de la clarificación, corregido con `/cambio` el 20/10/2026.
- **Precios, stock, descripciones, destacados y colores:** son los **datos de demostración** de la tabla de `ETAPA-1.md` (4 destacados: taza de cerámica, termo, remera y canilleras). Se cargan con `backend/src/db/datos-demo.sql` (que también actualiza la columna `colores`), que ejecuta el estudiante en Neon. En la funcionalidad 004 se editan desde el panel.
- **Aviso:** el pie de la tienda dice "Sitio de demostración: precios y datos de ejemplo."
- **Fotos:** se generan con IA. Van en `frontend/public/img/productos/` en WebP liviano; la base guarda la ruta. Los originales quedan en `multimedia/imagenes/` con su ficha en `FICHAS-IA.md`. La tabla `producto_fotos` lleva la columna `generada_con_ia` (BOOLEAN): la leyenda «Generado con IA» se muestra solo cuando está en `TRUE` (R12).
- **Carga:** el agente escribe el SQL en `backend/src/db/` y el estudiante lo ejecuta en el SQL Editor de Neon. La `DATABASE_URL` nunca pasa por el chat ni la ve el agente (principio 6).
- **Tablas:** las de la primera etapa en `ETAPA-1.md`.

## Historias de usuario

- Como cliente, quiero recorrer una vidriera clara con fotos y categorías, para darme cuenta de todo lo que puedo personalizar.
- Como cliente, quiero filtrar el catálogo por categoría, para encontrar rápido lo que busco (una remera, una taza, unas canilleras).
- Como cliente, quiero ver el detalle del producto con sus fotos, precio, talles y colores, para decidir y pedirlo por WhatsApp.
- Como negocio, quiero que la vidriera muestre los productos con su precio y su disponibilidad, para que los pedidos me lleguen claros.

## Requisitos (EARS)


| ID | Tipo | Requisito | Prioridad |
| --- | --- | --- | --- |
| R1 | Por evento | Cuando el cliente entre a `/`, el sistema deberá mostrar las secciones del inicio según `DESIGN.md`: portada "Tu diseño en vivo", franja de categorías con sellos, "Elegí qué personalizar", "Así de fácil" y "¿No tenés diseño?". (RF01) | Alta |
| R2 | Por evento | Cuando existan productos con `destacado = TRUE`, el sistema deberá mostrar hasta 4 tarjetas de producto en la sección "Los más pedidos", con el enlace "Ver todo el catálogo"; en celular la grilla se desliza de costado con Embla, según `DESIGN.md`. (RF01) | Alta |
| R3 | Por estado | Mientras no haya productos con `destacado = TRUE`, el sistema deberá ocultar la sección "Los más pedidos", sin rellenarla con contenido inventado. (RF01, RNF07) | Alta |
| R4 | Por evento | Cuando el cliente toque una categoría en la franja del inicio, el sistema deberá llevarlo al catálogo filtrado `/catalogo/:slug`. (RF01, RF02) | Alta |
| R5 | Ubicuo | El sistema deberá mostrar las tarjetas de producto con la foto principal, la etiqueta "Personalizable", el nombre y el precio (formato `$ 12.000`), y al tocarlas deberá abrir `/producto/:slug`. (RF01, RF02) | Alta |
| R6 | Ubicuo | El sistema deberá mostrar en `/catalogo` el filtro por las 4 categorías reales y la grilla de productos activos (4 columnas en PC, 2 en tablet, 1 en celular). (RF02) | Alta |
| R7 | Por evento | Cuando el cliente entre a `/catalogo/:slug`, el sistema deberá mostrar solo los productos activos de esa categoría, con la categoría marcada en el filtro, y la página deberá tener su propio título y descripción SEO según `09-SEO.md`. (RF02) | Alta |
| R8 | Por evento | Cuando el catálogo no tenga resultados en un filtro, el sistema deberá mostrar el estado vacío "No encontramos productos con esta categoría" con el enlace "Ver todo el catálogo". (RF02, RNF09) | Alta |
| R9 | Por estado | Mientras cargan los datos del inicio, del catálogo o del detalle, el sistema deberá mostrar esqueletos grises con la forma del contenido. (RNF09) | Alta |
| R10 | Por evento | Cuando el cliente entre a `/producto/:slug`, el sistema deberá mostrar el detalle con la galería de fotos (la de `orden = 1` como principal), el nombre, el precio, la descripción, los talles disponibles ("Talle único" si no aplica), los colores disponibles y el enlace "Volver al catálogo" (navegación simple: el CTA de WhatsApp llega con `specs/002-pedido-whatsapp/`). (RF04) | Alta |
| R11 | Por evento | Cuando se pida un `slug` que no existe o un producto inactivo, el sistema deberá responder 404 y mostrar la página "No encontramos esta página" con botón al catálogo. (RF04) | Alta |
| R12 | Donde | Donde una foto tenga `generada_con_ia = TRUE`, el sistema deberá mostrar la etiqueta «Generado con IA» sobre la foto, tanto en la tarjeta del catálogo como en el detalle (decisión 6). (RNF12) | Alta |
| R13 | Por evento | Cuando un producto no tenga fotos cargadas, el sistema deberá mostrar en su lugar un recuadro con el nombre del producto. (RF04) | Alta |
| R14 | Ubicuo | La API deberá exponer `GET /api/categorias`, `GET /api/productos` (`?categoria=`, `?destacados=1`) y `GET /api/productos/:slug`, en JSON, solo con productos `activo = TRUE`, consultando la base desde `db/conexion.js` con parámetros y sobre las tablas de la primera etapa (`ETAPA-1.md`); devuelven también `precio`, `stock` y `descripcion`. (RF01, RF02, RF04) | Alta |
| R15 | Ubicuo | El detalle y el catálogo deberán aplicar el SEO de `09-SEO.md`: título y descripción por página, un solo `<h1>`, `alt` en todas las imágenes, JSON-LD de migas de pan y JSON-LD de producto **sin el bloque `offers`**, porque los precios son de ejemplo (`ETAPA-1.md`). Sin Open Graph por producto: solo las etiquetas Open Graph generales del sitio en `index.html` (decisión 10). (RF02, RF04) | Alta |
| R16 | Por estado | Mientras la persona tenga activado "reducir movimiento", el sistema deberá mostrar cada animación del inicio y del detalle en su estado final, sin movimiento. (RNF10) | Alta |
| R17 | Por evento | Cuando falle la carga del inicio, del catálogo o del detalle (API caída), el sistema deberá mostrar el estado de error "Algo salió mal, probá de nuevo" con botón "Reintentar". (RNF09) | Alta |
| R18 | Donde | Donde un producto tenga `stock = 0`, el sistema deberá mostrar la etiqueta "Sin stock" en la tarjeta y en el detalle. (RF04) | Alta |
| R19 | Ubicuo | El sistema deberá mostrar en el pie de todas las páginas de la tienda el aviso "Sitio de demostración: precios y datos de ejemplo." (`ETAPA-1.md`) | Alta |

Notas sobre la decisión de alcance:

- El **selector** de talle, color y cantidad, las opciones "Tengo mi diseño" / "No tengo diseño" y los botones de WhatsApp del detalle **son de `specs/002-pedido-whatsapp/`** (decisión del estudiante). En 001 el detalle muestra talles y colores como información; RF04 se completa con la suma de 002.
- El stock se usa solo para la etiqueta "Sin stock" (R18); no se muestra la cantidad.

## Casos límite

- **Base sin productos o API caída:** estados vacío o de error (R9, R17); nunca una pantalla en blanco.
- **Categoría sin productos activos:** estado vacío (R8), el filtro sigue usable.
- **Slug inexistente o producto pausado:** 404 con página propia (R11).
- **Producto sin fotos:** recuadro con el nombre (R13); si una foto no carga, por su `alt` se entiende igual.
- **Productos sin destacado:** si en el panel se desmarcan todos, "Los más pedidos" se oculta (R3).
- **Producto sin descripción:** el detalle no muestra ese bloque (ni texto de relleno ni espacio vacío).
- **Producto sin descripción:** `descripcion = NULL` en la carga inicial; el detalle no muestra el bloque de descripción, sin relleno (honestidad / RNF07).
- **Nombres y descripciones largos:** el nombre se trunca con puntos suspensivos en la tarjeta y se completa en el detalle; la descripción usa `max-w-prose`.
- **Talle único:** se muestra el texto "Talle único" en vez de la lista de talles.
- **Celular (desde 360 px):** portada en una columna, grilla de 1 columna, franjas inclinadas a −3°, todo tocable (44 px).
- **Sin conexión:** mensaje "Parece que no tenés conexión. Revisá tu internet." y reintentar.
- **Movimiento reducido:** animaciones quietas en su estado final (R16), el contenido nunca queda inaccesible.
- **Fotos IA:** etiqueta «Generado con IA» solo si `generada_con_ia = TRUE` (R12); las fotos reales futuras van en `FALSE` y no llevan leyenda.

## Fuera de alcance

- **Buscador y orden** (RF03, Media): sin buscador, sin ordenar por precio/novedad/más vendidos, sin paginación (la tienda es chica).
- **Precio anterior tachado y etiqueta "Oferta"** (RF04): no entran en la primera etapa.
- **Cantidad de stock en pantalla:** solo la etiqueta "Sin stock" (R18).
- **Guía de talles** (RF05, Media): el detalle lista los talles, pero la ventana con medidas va a la siguiente etapa.
- **Selector de talle/color/cantidad, opciones de diseño y botones de WhatsApp del detalle** (RF07): son de `specs/002-pedido-whatsapp/`.
- **Botón flotante de WhatsApp** (RF24): 002. **Asistente** (RF25): 003.
- **Trabajos, reseñas y promociones** (RF08, RF27, RF31): esas secciones no se construyen en la primera etapa (`ETAPA-1.md`).
- **Favoritos** (RF10, Baja): requieren cuenta; la tarjeta no muestra el corazón en la primera etapa.
- **Carrito, checkout, pagos online, seguimiento, cuentas y panel** (versión 2).
- **Open Graph por producto con el middleware de Vercel** (decisión 10): no entra en la primera etapa; solo las etiquetas generales de `index.html`.

## Criterios de finalización

- [ ] Todos los requisitos Alta cumplen en `verificacion.md` (con la excepción documentada de RF04 que se completa en 002).
- [ ] Tests en verde (`npm test` en `frontend/` y `backend/`) y `npm run build` sin errores.
- [ ] Lighthouse 80 o más en las cuatro categorías.
- [ ] Revisado con la skill `revisar-marca` (tokens, tipografías, foco, `useReducedMotion`, leyenda «Generado con IA»).

## Historial de cambios

| Fecha | Cambio | Motivo |
| --- | --- | --- |
| 19/10/2026 | Creación de la spec (borrador) | Fase 1 del ciclo SDD para 001-catalogo |
| 19/10/2026 | Clarificación: colores (blanco, técnica de sublimación), sin stock (produce a pedido), carga SQL en `backend/src/db/`, destacados pendientes del negocio, fotos IA en `public/img/productos/` + columna `generada_con_ia`, leyenda IA en tarjeta y detalle, JSON-LD sin `offers`, tablas de v1 y sin sección de reseñas, enlace "Volver al catálogo" | Fase 2 del ciclo SDD: las 9 decisiones del estudiante (`clarificacion.md`) |
| 19/10/2026 | Estado pasa a **aprobada** | Todas las decisiones cerradas y documentadas |
| 19/10/2026 | Decisión 10 del estudiante: sin Open Graph por producto en la v1 (middleware de Vercel → v2); R15 ajustado y nota en "Fuera de alcance". Docs alineados: `05-DATOS.md` (columna `generada_con_ia`, `precio` nullable en v1, nota de tablas de la v1) y `04-ARQUITECTURA.md` (detalle sin reseñas ni stock en la v1) | Fase 2 cerrada: los docs ahora coinciden con la spec |
| 19/10/2026 | `/cambio` al implementar T02: la tabla "Catálogo real" lista 12 productos, pero el resto de la spec y el plan decían 13. Se corrige el conteo a **12** (los datos reales los confirmó el estudiante), la `descripcion` va en `NULL` hasta que el negocio pase los textos, y el detalle no muestra el bloque de descripción cuando es `NULL` | Conteo real de los productos de Sean's Store; sin inventar descripciones (RNF07) |
| 20/10/2026 | `/cambio` de enfoque: el proyecto se reorganiza con `ETAPA-1.md` (la documentación describe la tienda completa y `ETAPA-1.md` dice qué se construye). Es una tienda de demostración con datos de ejemplo definidos por el equipo: vuelven el precio en tarjeta y detalle (R5, R10), la descripción, la etiqueta "Sin stock" (R18) y 4 destacados; se agrega el aviso de sitio de demostración (R19). Las decisiones 2 y 4 de la clarificación (sin stock, destacados pendientes) quedan reemplazadas | El estudiante aclaró que es un proyecto educativo que usa el negocio como modelo: los datos no dependen del negocio real y se editan desde el panel (funcionalidad 004) |
| 20/10/2026 | `/cambio` "los productos no son solo blancos": la carga de la demostración lleva la columna `colores` por producto (Blanco, Negro, Beige, Verde claro, Rosa, Azul, Gris y Rojo, según el producto) y la frase de la cinta pasa a "Elegí el producto y el color, y lo estampamos con tu diseño, con tintas que no se borran con el lavado." Sin cambios de requisitos: R10 ya muestra los colores disponibles que devuelve la API | El estudiante confirmó las listas de colores del negocio; corrige la decisión 1 del 19/10/2026 (hallazgo 1 de la clarificación) |
| 23/10/2026 | `/cambio` "colores nuevos con las fotos": Llavero pasa a Blanco, Negro, Transparente; Mousepad a Blanco, Negro; Almohadón a Blanco, Gris, Verde claro. Actualiza la tabla de carga de arriba, `ETAPA-1.md` (columna Colores nueva en su tabla de datos de demostración) y `datos-demo.sql`. Apareció un color nuevo (Transparente) que no estaba en la paleta del 20/10. Sin cambios de requisitos: R10 ya muestra los colores disponibles que devuelve la API | El estudiante definió las listas al generar las fotos IA de los accesorios |
