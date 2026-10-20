# Plan 001-catalogo

**Spec:** aprobada (19/10/2026) · **Estado:** aprobado (19/10/2026, ok del estudiante)

## 1. Resumen

Base de datos: `esquema-v1.sql` y `carga-catalogo.sql` (hechos) y `datos-demo.sql` con los precios, stock, descripciones y destacados de `ETAPA-1.md`; el estudiante los ejecuta en el SQL Editor de Neon (la `DATABASE_URL` nunca pasa por el chat). Después se construye **primero lo que se ve**: header, footer, portada, franja, cinta y la página de inicio, que no dependen de la API, así la tienda publicada muestra avances enseguida. Luego la API (3 rutas de lectura con `vi.mock` de `conexion.js` en los tests), la conexión con Neon y Vercel, y por último las pantallas que usan datos: tarjetas con precio, "Los más pedidos", catálogo, detalle y 404, con estados de carga, vacío y error. Todo con los tokens de la marca, Motion según `DESIGN.md`, la leyenda «Generado con IA», el aviso de sitio de demostración y el SEO de `09-SEO.md`.

## 2. Por requisito

| Requisito | Qué se hace | Archivos (crear o modificar) | Test que lo prueba |
| --- | --- | --- | --- |
| R14 (primero) | Las 3 rutas de lectura del catálogo. `routes/index.js` registra cada router nuevo (como ya hace con salud). `WHERE activo = TRUE` siempre; consultas `$1/$2` desde `conexion.js` | crear: `backend/src/db/conexion.js`, `backend/src/db/esquema-v1.sql`, `backend/src/db/carga-catalogo.sql`, `backend/src/routes/categorias.routes.js`, `backend/src/routes/productos.routes.js`, `backend/src/controllers/categorias.controller.js`, `backend/src/controllers/productos.controller.js`; modificar: `backend/src/routes/index.js`, `backend/package.json` (agregar `pg`, permitida por 03-TECNOLOGIAS) | `backend/tests/categorias.test.js` y `backend/tests/productos.test.js` (Supertest): **`vi.mock` de `db/conexion.js`** que devuelve filas de prueba; listados, `?categoria=`, `?destacados=1`, 404 del detalle (inexistente e inactivo). Neon no se usa nunca en tests |
| R1 | Inicio con HeroSublimado, FranjaCategorias, CintaProductos, "Así de fácil" y "¿No tenés diseño?"; textos fijos en `data/textos.js` | modificar: `frontend/src/App.jsx` (rutas de React Router, reemplaza el contenido de Etapa 0); crear: `frontend/src/pages/tienda/Inicio.jsx`, `frontend/src/components/tienda/HeroSublimado.jsx`, `FranjaCategorias.jsx`, `CintaProductos.jsx`, `frontend/src/components/layout/Header.jsx`, `Footer.jsx`, `frontend/src/data/textos.js` | `frontend/tests/Inicio.test.jsx`: renderiza cada sección con `api.js` mockeado |
| R2/R3 | "Los más pedidos": hasta 4 destacados de `?destacados=1` en Embla (celular) + enlace "Ver todo el catálogo". Con la carga inicial (nada destacado) la sección no se renderiza, sin contenido inventado | modificar: `Inicio.jsx` | `Inicio.test.jsx`: 4 destacados mock → 4 `TarjetaProducto`; lista vacía → `queryBy` no encuentra la sección |
| R4 | Los nombres de la cinta enlazan a `/catalogo/:slug` | modificar: `FranjaCategorias.jsx` | `Inicio.test.jsx`: los 4 `href` correctos |
| R5 | Tarjeta: foto principal, leyenda IA, "Personalizable", nombre truncado, precio con `formatearPrecio` (`$ 12.000`); toda la tarjeta enlaza a `/producto/:slug` | crear: `frontend/src/components/tienda/TarjetaProducto.jsx`, `frontend/src/utils/formatearPrecio.js` | `TarjetaProducto.test.jsx`: textos, precio formateado y enlace |
| R6/R7 | `/catalogo` y `/catalogo/:slug`: filtro de las 4 categorías (marcada la actual), grilla 4/2/1 columnas (desde 360 px) y título + descripción SEO por categoría | modificar: `App.jsx`; crear: `frontend/src/pages/tienda/Catalogo.jsx`, `frontend/src/components/tienda/FiltroCategorias.jsx`, `frontend/src/components/comunes/MetaPagina.jsx` | `Catalogo.test.jsx` (con y sin `:slug`) + el test de API del filtro |
| R8 | Vacío: "No encontramos productos con esta categoría" + "Ver todo el catálogo" | crear: `frontend/src/components/comunes/EstadoVacio.jsx`; modificar: `Catalogo.jsx` | `Catalogo.test.jsx` caso vacío |
| R9 | Esqueletos grises con la forma del contenido mientras carga (inicio, catálogo, detalle) | crear: `frontend/src/components/comunes/Cargando.jsx`; modificar: las 3 páginas | asserts de esqueleto en los 3 tests de página |
| R10 | Detalle: galería con `orden = 1` principal, nombre, precio, descripción (oculta si es NULL), talles ("Talle único" si la lista viene vacía), colores y "Volver al catálogo" | crear: `frontend/src/pages/tienda/DetalleProducto.jsx`, `frontend/src/components/tienda/GaleriaFotos.jsx` | `DetalleProducto.test.jsx`: datos, "Talle único" con talles vacíos, galería |
| R11 | Slug inexistente o producto inactivo → API responde 404 JSON y el frontend muestra "No encontramos esta página" con botón al catálogo. El rewrite a `index.html` ya existe en `frontend/vercel.json` (Etapa 0): nada por hacer ahí | crear: `frontend/src/pages/tienda/NoEncontrada.jsx`; modificar: `App.jsx` (ruta `*`), `DetalleProducto.jsx` (404 → NoEncontrada) | `productos.test.js` (vi.mock): inexistente e inactivo → 404 JSON; `NoEncontrada.test.jsx` |
| R18 | Etiqueta "Sin stock" cuando `stock = 0`, en tarjeta y detalle | modificar: `TarjetaProducto.jsx`, `DetalleProducto.jsx` | tests de tarjeta y detalle con stock 0 y con stock > 0 |
| R19 | Aviso "Sitio de demostración: precios y datos de ejemplo." en el footer | modificar: `Footer.jsx`, `data/textos.js` | `Layout.test.jsx`: el aviso está en el footer |
| R12 | Etiqueta «Generado con IA» sobre la foto (tarjeta y detalle) solo si `generada_con_ia = TRUE` | modificar: `TarjetaProducto.jsx`, `GaleriaFotos.jsx` | tests de catálogo y detalle con foto `TRUE` (ve la leyenda) y `FALSE` (no la ve) |
| R13 | Producto sin fotos (el estado normal hasta que entren los WebP): recuadro con el nombre del producto | modificar: `TarjetaProducto.jsx`, `DetalleProducto.jsx` | tests: producto sin fotos → recuadro con el nombre |
| R15 | SEO: título + descripción por página, un solo `<h1>`, `alt` en todas las imágenes, JSON-LD de migas de pan y de producto **sin `offers`**; OG general del sitio en `index.html` | crear: `frontend/public/robots.txt`; modificar: `index.html` (validar/sumar OG general), `MetaPagina.jsx`, las 3 páginas | `DetalleProducto.test.jsx` y `Catalogo.test.jsx`: título/description, JSON-LD sin `offers`, un solo `<h1>`. Sitemap con script: v2, fuera del plan |
| R16 | Cada animación con Motion usa `useReducedMotion` y queda en estado final (remera quieta con el primer diseño, cinta quieta, canillera estampada) | modificar: `HeroSublimado.jsx`, `FranjaCategorias.jsx`, `CintaProductos.jsx` | test de render con `matchMedia` de movimiento reducido + verificación manual con la skill `revisar-marca` |
| R17 | Error de API: "Algo salió mal, probá de nuevo" + botón "Reintentar" (vuelve a pedir los datos) | crear: `frontend/src/components/comunes/MensajeError.jsx`, `frontend/src/hooks/useObtenerDatos.js`; modificar: las 3 páginas | los 3 tests de página con la API rechazada → mensaje y reintentar |

Extras que comparte todo el frontend:

- crear: `frontend/src/services/api.js` (los únicos `fetch` del proyecto, principio 3).
- modificar: `frontend/src/main.jsx` solo si el router necesita envolver a `App` (decisión de implementación); `styles/index.css` no se toca si los tokens alcanzan (ya existe con la marca completa).
- `express-rate-limit` no se agrega acá: entra en 002, cuando hay formularios (helmet y cors ya están en `app.js`).

## 3. API y datos

**Rutas de la API (públicas, solo lectura):**

| Ruta | Recibe | Devuelve | Tablas |
| --- | --- | --- | --- |
| `GET /api/categorias` | nada | `[{id, nombre, slug, orden}]` ordenadas por `orden` | `categorias` |
| `GET /api/productos` | `?categoria=slug`, `?destacados=1` (opcionales, combinables) | `[{codigo, slug, nombre, categoria: {slug, nombre}, talles, colores, foto: {url, alt, generada_con_ia} o null}]` (hasta 4 si es destacados) | `productos` JOIN `categorias` LEFT JOIN `producto_fotos` (la de `orden = 1`) |
| `GET /api/productos/:slug` | `:slug` en la ruta | el objeto de la lista + `descripcion` + `fotos: [{url, alt, generada_con_ia, orden}]` ordenadas por `orden` | `productos` JOIN `categorias` LEFT JOIN `producto_fotos` |

Reglas comunes:

- `WHERE activo = TRUE` en todas; el detalle responde 404 si el slug no existe o el producto está pausado. Se exponen `precio`, `stock` y `descripcion` (datos de demostración de `ETAPA-1.md`); `vendidos` no.
- Todas las consultas con parámetros (`$1`, `$2`) y por única vez en `backend/src/db/conexion.js` (pool de `pg`).
- Errores en JSON `{ "error": "mensaje" }` con su código HTTP (404 del detalle, 500 del servidor; el manejador ya existe en `app.js`).

**Carga del catálogo (SQL escrito por el agente, ejecutado por el estudiante en Neon):**

- `esquema-v1.sql`: crea solo las tablas de la v1 — `categorias`, `productos`, `producto_fotos`, `consultas`, `preguntas_frecuentes` (decisión 8). No crea tablas de la v2.
- `carga-catalogo.sql`: 4 categorías + 12 productos reales (talles y colores de la spec), `precio NULL`, `descripcion NULL` (los textos reales entran después con `/cambio`), `destacado FALSE` en los 12 (pendiente del negocio), `activo TRUE`. **No inserta filas en `producto_fotos`**: los WebP todavía no existen y quedarían referencias rotas.
- `datos-demo.sql`: `UPDATE` de los 12 productos con el precio, el stock, la descripción y el destacado de la tabla de `ETAPA-1.md` (4 destacados). Se puede volver a correr sin problema.
- `carga-fotos.sql` (aparte, tarea posterior): inserta las fotos con su `alt` y `generada_con_ia = TRUE` cuando los WebP estén en `frontend/public/img/productos/`. Mientras tanto cada producto muestra el recuadro con su nombre (R13).
- El `datos-ejemplo.sql` de `05-DATOS.md` no se usa.

**Fotos con IA:** los WebP van en `frontend/public/img/productos/`; los originales y sus fichas en `multimedia/imagenes/` + `FICHAS-IA.md`, sin tocar la base.

## 4. Componentes y pantallas

**Páginas** (cada una con su `MetaPagina` y su único `<h1>`):

| Pantalla | Contenido | Estados |
| --- | --- | --- |
| `/` Inicio | Hero, franja de categorías, cinta, "Los más pedidos" (condicional), "Así de fácil", "¿No tenés diseño?", con Header y Footer de la primera etapa | carga → esqueleto de destacados; vacío → sección oculta (R3); error → mensaje + reintentar |
| `/catalogo` y `/catalogo/:slug` | FiltroCategorias + grilla de `TarjetaProducto` | carga → esqueleto de grilla; vacío → EstadoVacio + "Ver todo el catálogo"; error → mensaje + reintentar |
| `/producto/:slug` | GaleriaFotos + datos + "Volver al catálogo" | carga → esqueleto; error → mensaje + reintentar; API 404 → NoEncontrada |
| `*` NoEncontrada | "No encontramos esta página" + botón al catálogo | no depende de la API, siempre disponible |

**Componentes** (uno por archivo, ~150 líneas máximo):

| Componente | Rol |
| --- | --- |
| `layout/Header.jsx` | Logo + enlace "Catálogo" (header de la primera etapa, `ETAPA-1.md`) |
| `layout/Footer.jsx` | Isotipo + descripción + contacto por WhatsApp + aviso de sitio de demostración; sin legales ni arrepentimiento |
| `tienda/HeroSublimado.jsx` | "Tu diseño en vivo": título inclinado, chips sincronizados, remera SVG que cicla 4 diseños (3 s c/u) |
| `tienda/FranjaCategorias.jsx` | Franja inclinada: cinta magenta en loop (32 s, pausa al hover/touch) + 3 sellos |
| `tienda/CintaProductos.jsx` | Cinta de producción: 5 íconos que pasan y se estampan (2.5 s c/u, vuelta 12.5 s); quieta: canillera estampada |
| `tienda/TarjetaProducto.jsx` | Foto cuadrada, leyenda IA, "Personalizable", nombre truncado, precio, "Sin stock" si corresponde; hover con pasada de tinta |
| `tienda/FiltroCategorias.jsx` | 4 chips, marcada la actual, táctil ≥ 44 px, foco magenta |
| `tienda/GaleriaFotos.jsx` | Principal `orden = 1` + miniaturas (Embla en celular cuando haya varias) |
| `comunes/Cargando.jsx`, `EstadoVacio.jsx`, `MensajeError.jsx`, `MetaPagina.jsx` | Estados y SEO reutilizables |
| `hooks/useObtenerDatos.js` | carga / dato / vacío / error + reintento del mismo pedido |
| `data/textos.js` | Pasos de "Así de fácil" (versión corta de celular), bajada del hero, sellos, "¿No tenés diseño?" |

**Marca y movimiento:** clases del tema (`bg-violeta`, `text-magenta`, `font-titulos`), cero colores sueltos. Motion: solo `transform` y `opacity`, `useReducedMotion` en cada animación, las secciones aparecen una vez con `whileInView` y el subrayado amarillo se dibuja de izquierda a derecha. Sin efectos nuevos.

## 5. Riesgos y cómo se evitan

| Riesgo | Cómo se evita |
| --- | --- |
| Los tests de la API tocan la base real de Neon | Los tests de ruta hacen `vi.mock` de `db/conexion.js` con filas de prueba: la base real de Neon nunca se usa en tests (07-CONVENCIONES; Error N° 7 en `PROMPTS.md`) |
| Falta `DATABASE_URL` al importar `conexion.js` en ambiente de test | El pool se crea con la URL del entorno pero no se conecta hasta ejecutar una consulta; como los tests mockean `conexion.js`, ningún test necesita la URL. La real vive solo en `backend/.env` (principio 6) |
| El SQL de la carga falla y todo el frontend queda vacío | `tasks.md` lo parte en tareas cortas; el estudiante ejecuta y valida los conteos (4 categorías, 12 productos). El agente nunca ejecuta nada contra Neon, solo escribe los archivos |
| Incluir el header/footer con funciones que no existen (carrito, favoritos, legales) | Header y footer de la primera etapa (`ETAPA-1.md`); lo demás entra con sus specs |
| Inventar reseñas o testimonios | No se construyen en la primera etapa; nunca se cargan opiniones de ejemplo |
| «Generado con IA» donde no corresponde | La etiqueta se renderiza solo leyendo `generada_con_ia` de la foto; sin textos fijos |
| Referencias a fotos inexistentes en la base | `carga-catalogo.sql` no inserta `producto_fotos`; las fotos entran con `carga-fotos.sql` cuando los WebP estén. El frontend no depende de que existan: sin fotos → recuadro (R13) |
| Animaciones del hero y de la cinta rompiendo accesibilidad o tamaño de archivo | Solo `transform`/`opacity`, `useReducedMotion` obligatorio; si `HeroSublimado` o `CintaProductos` pasan ~150 líneas, se dividen en subarchivos (queda en `tasks.md`) |
| Precios de ejemplo tomados como reales | Aviso de sitio de demostración en el footer (R19) y JSON-LD sin `offers`; el test de R15 lo comprueba |
| Colores, tipografías o radios fuera de la marca | Solo los tokens del `@theme` de `styles/index.css` (ya cargados en Etapa 0); nunca `[#...]` ni colores por defecto de Tailwind (principio 2) |
| Más de un `<h1>` o JSON-LD duplicado | `MetaPagina` es el único que escribe título, descripción y JSON-LD; test de R15: un solo `<h1>` |
| Refrescar `/producto/...` en producción da 404 del hosting | Ya resuelto en Etapa 0: `frontend/vercel.json` reescribe `/(.*)` a `/index.html`. Sin tareas nuevas |
| Falta del SQL ejecutado antes de probar la API | Orden en `tasks.md`: SQL → backend con tests en verde → frontend; `npm test` y `npm run build` antes de proponer cada commit (principio 5) |

Cuando el plan esté aprobado, sigue `/tareas` para partirlo en tareas de menos de 30 minutos. Al final de la implementación, `/verificar` valida contra la spec.

---

**Cambios de esta versión del plan** (revisión del estudiante, 19/10/2026):

1. Los tests de la API no usan Neon: simulan `db/conexion.js` con `vi.mock` (07-CONVENCIONES; Error N° 7 en `docs/PROMPTS.md`).
2. Los archivos de la Etapa 0 (`app.js`, `servidor.js`, `styles/index.css`, `main.jsx`, `index.html`, `vercel.json`) van como "modificar", no "crear"; las rutas siguen la convención existente: `categorias.routes.js` y `productos.routes.js` (como `salud.routes.js`), registradas en `routes/index.js`.
3. `carga-catalogo.sql` no carga filas en `producto_fotos` (las imágenes no existen y quedarían rotas); entran después con `carga-fotos.sql` cuando estén los WebP, y mientras tanto se muestra el recuadro con el nombre (R13).
4. Header mínimo (logo + "Catálogo") y footer sin legales ni arrepentimiento: ajuste de la v1 anotado en `DESIGN.md`.
5. Eliminada la línea sin sentido sobre helmet y cors: ya están en `app.js`; `express-rate-limit` se agrega en 002, cuando hay formulario.
6. `robots.txt` sí en la v1; el sitemap con script (`generarSitemap.js`) es de la versión 2.
7. Conteo corregido a 12 productos con el `/cambio` del 19/10/2026 (la tabla de la spec listaba 12, el resto decía 13); `descripcion NULL` en la carga hasta que el negocio pase los textos.

**Cambio del 20/10/2026** (reorganización con `ETAPA-1.md`): vuelven el precio, la descripción y la etiqueta "Sin stock" con datos de demostración (`datos-demo.sql`), se agrega el aviso de sitio de demostración (R19) y las tareas se reordenan para construir primero lo que se ve (inicio) y después lo que usa la API.
