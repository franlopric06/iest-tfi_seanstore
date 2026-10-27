# Tareas 001-catalogo

**Spec:** aprobada · **Plan:** aprobado · **Estado:** aprobado · **Reordenado:** 20/10/2026 (reorganización con `ETAPA-1.md`) · **/cambio:** 20/10/2026 (los productos no son solo blancos: colores por producto) · **/cambio:** 23/10/2026 (catálogo en 2 columnas en celular)

Reglas: una tarea = un commit (`001-Txx`, 07-CONVENCIONES); ninguna tarea se commitea sin su test. Cada tarea arranca escribiendo su test (rojo) y termina con el código que lo pone en verde. Antes de proponer cada commit: `npm test` y `npm run build` en `frontend/` y `backend/` (principio 5). Los tests de la API nunca tocan Neon: `vi.mock` de `db/conexion.js` (Error N° 7 en `PROMPTS.md`).

Orden: primero lo que se ve (inicio), después la API y por último las pantallas que usan datos. Las tareas SQL generan commit; lo manual es solo ejecutarlas en Neon. La única tarea sin commit es T13.

## Base de datos

- [x] **T01** · Esquema: las 5 tablas (`categorias`, `productos`, `producto_fotos`, `consultas`, `preguntas_frecuentes`) · Requisito: R14 · Archivos: `backend/src/db/esquema-v1.sql` · Test: manual en Neon
  **Listo cuando:** en Neon existen las 5 tablas.
- [x] **T02** · Carga inicial: 4 categorías y 12 productos con talles y colores · Requisito: R14 · Archivos: `backend/src/db/carga-catalogo.sql` · Test: manual en Neon
  **Listo cuando:** los conteos dan 4 categorías y 12 productos.
- [x] **T03** · Datos de demostración: `UPDATE` de los 12 productos con el precio, el stock, la descripción y el destacado de la tabla de `ETAPA-1.md` · Requisito: R5, R10, R18, R2 · Archivos: crear `backend/src/db/datos-demo.sql` · Test: manual en Neon
  **Listo cuando:** en Neon, los 12 productos tienen precio, stock y descripción, y hay 4 destacados (taza de cerámica, termo, remera y canilleras).

## Inicio (lo que se ve primero)

- [x] **T04** · Header (logo + "Catálogo") y Footer (isotipo, descripción, contacto por WhatsApp y aviso "Sitio de demostración: precios y datos de ejemplo.") + textos fijos en `data/textos.js` · Requisito: R1, R19 · Archivos: crear `frontend/src/components/layout/Header.jsx`, `Footer.jsx`, `frontend/src/data/textos.js`, `frontend/tests/Layout.test.jsx` · Test: el header muestra el logo y "Catálogo"; el footer, la descripción, el contacto y el aviso
  **Listo cuando:** el test pasa y los textos no están escritos dentro de los componentes.
- [x] **T05** · HeroSublimado "Tu diseño en vivo": remera SVG que cicla 4 diseños (3 s c/u), chips sincronizados, título y botones · Requisito: R1, R16 · Archivos: crear `frontend/src/components/tienda/HeroSublimado.jsx` (y un subarchivo si pasa ~150 líneas), `frontend/tests/HeroSublimado.test.jsx` · Test: se dibuja con su título y sus chips; con movimiento reducido queda quieto con el primer diseño
  **Listo cuando:** el test pasa y solo anima `transform` y `opacity`.
- [x] **T06** · FranjaCategorias: franja inclinada con la cinta magenta en loop (32 s, pausa al pasar el mouse) + 3 sellos; cada categoría enlaza a `/catalogo/:slug` · Requisito: R1, R4, R16 · Archivos: crear `frontend/src/components/tienda/FranjaCategorias.jsx`, `frontend/tests/FranjaCategorias.test.jsx` · Test: muestra los sellos; los 4 enlaces apuntan a `/catalogo/tazas-termos`, `/catalogo/indumentaria`, `/catalogo/deportes` y `/catalogo/accesorios`; con movimiento reducido queda quieta
  **Listo cuando:** el test pasa.
- [x] **T07** · CintaProductos: los 5 íconos que pasan y se estampan (2,5 s c/u); con movimiento reducido se ve la canillera estampada · Requisito: R1, R16 · Archivos: crear `frontend/src/components/tienda/CintaProductos.jsx`, `frontend/tests/CintaProductos.test.jsx` · Test: se dibuja; con movimiento reducido queda en el estado final
  **Listo cuando:** el test pasa.
- [x] **T08** · Página Inicio con todas sus secciones ("Así de fácil" y "¿No tenés diseño?" incluidas), SEO del inicio (`MetaPagina`) y rutas con React Router · Requisito: R1, R15 · Archivos: crear `frontend/src/pages/tienda/Inicio.jsx`, `frontend/src/components/comunes/MetaPagina.jsx`, `frontend/tests/Inicio.test.jsx`; modificar `frontend/src/App.jsx` (y `tests/App.test.jsx` si se rompe) · Test: aparecen todas las secciones, el título y la descripción del inicio, y un solo `<h1>`
  **Listo cuando:** `npm test` y `npm run build` en verde. Después del push, la portada se ve en `sean-store.vercel.app`.

## API

- [x] **T09** · Conexión a la base: pool de `pg` con consultas con parámetros, sin conectarse hasta la primera consulta · Requisito: R14 · Archivos: crear `backend/src/db/conexion.js`; modificar `backend/package.json` (agregar `pg`) · Test: los tests existentes siguen en verde y ninguno toca Neon
  **Listo cuando:** `conexion.js` es el único acceso a la base (principio 3).
- [x] **T10** · `GET /api/categorias` — primero el test · Requisito: R14 · Archivos: crear `backend/tests/categorias.test.js`, `backend/src/controllers/categorias.controller.js`, `backend/src/routes/categorias.routes.js`; modificar `backend/src/routes/index.js` · Test: Supertest con `vi.mock`: 200 con las categorías ordenadas por `orden`
  **Listo cuando:** `npm test` en verde, sin Neon.
- [x] **T11** · `GET /api/productos` con `?categoria=` y `?destacados=1`, con precio y stock — primero el test · Requisito: R14 · Archivos: crear `backend/tests/productos.test.js`, `backend/src/controllers/productos.controller.js`, `backend/src/routes/productos.routes.js`; modificar `backend/src/routes/index.js` · Test: `vi.mock`: solo activos, filtro por categoría, hasta 4 destacados, foto principal o `null`, con `precio` y `stock`
  **Listo cuando:** los casos pasan sin Neon.
- [x] **T12** · `GET /api/productos/:slug` con 404 — primero el test · Requisito: R14, R11 · Archivos: modificar `productos.controller.js`, `productos.routes.js`, `tests/productos.test.js` · Test: 200 con `descripcion`, `precio`, `stock` y `fotos` ordenadas; 404 JSON si no existe o está inactivo
  **Listo cuando:** las 3 rutas responden y `npm test` está en verde.
- [x] **T13** · Conectar la base y publicar (la hace el estudiante con el agente guiando; ninguna clave pasa por el chat): `DATABASE_URL` (la connection string *pooled* de Neon) en `backend/.env` y en Vercel (proyecto de la API); `VITE_API_URL` en `frontend/.env` y en Vercel (proyecto de la tienda); redeploy de los dos · Requisito: R14 · Archivos: ninguno del repo · Test: manual
  **Listo cuando:** `https://sean-store-api.vercel.app/api/categorias` devuelve las 4 categorías.

## Pantallas con datos

- [x] **T14** · Puerta única a la API (`services/api.js`) y hook `useObtenerDatos` (carga, dato, error y reintento) · Requisito: R14, R17 · Archivos: crear `frontend/src/services/api.js`, `frontend/src/hooks/useObtenerDatos.js`, `frontend/tests/useObtenerDatos.test.jsx` · Test: el hook con la API simulada pasa por carga, dato, error y reintento
  **Listo cuando:** ningún archivo fuera de `api.js` hace `fetch`.
- [x] **T15** · TarjetaProducto: foto, "Personalizable", nombre, precio formateado (`$ 12.000`), "Sin stock" si el stock es 0, y enlace a `/producto/:slug` · Requisito: R5, R18 · Archivos: crear `frontend/src/components/tienda/TarjetaProducto.jsx`, `frontend/src/utils/formatearPrecio.js`, `frontend/tests/TarjetaProducto.test.jsx` · Test: textos, precio formateado, etiqueta con stock 0 y sin etiqueta con stock > 0, enlace
  **Listo cuando:** el test pasa.
- [x] **T16** · "Los más pedidos" en el inicio: hasta 4 destacados (Embla en celular) y "Ver todo el catálogo"; sin destacados, la sección no aparece · Requisito: R2, R3 · Archivos: modificar `Inicio.jsx`, `tests/Inicio.test.jsx`, `frontend/package.json` (agregar `embla-carousel-react`) · Test: 4 destacados simulados → 4 tarjetas; lista vacía → la sección no existe
  **Listo cuando:** el test pasa y en la página publicada se ven los 4 destacados.
- [x] **T17** · Página Catálogo: grilla de 4/2/1 columnas desde 360 px y esqueletos mientras carga · Requisito: R6, R9 · Archivos: crear `frontend/src/components/comunes/Cargando.jsx`, `frontend/src/pages/tienda/Catalogo.jsx`, `frontend/tests/Catalogo.test.jsx`; modificar `App.jsx` (más `frontend/src/data/textos.js`: `textos.catalogo`) · Test: grilla con productos simulados y esqueleto durante la carga
  **Listo cuando:** `/catalogo` lista los 12 productos.
- [x] **T18** · SEO del catálogo: título, descripción, un solo `<h1>` y JSON-LD de migas de pan · Requisito: R15 · Archivos: modificar `Catalogo.jsx`, `tests/Catalogo.test.jsx` (más `frontend/src/data/textos.js`: `textos.catalogo.seo` y `textos.catalogo.migas`) · Test: título, `description`, un `<h1>` y JSON-LD de migas
  **Listo cuando:** el test pasa.
- [x] **T19** · Filtro por categoría en `/catalogo/:slug`, con la categoría actual marcada · Requisito: R7 · Archivos: crear `frontend/src/components/tienda/FiltroCategorias.jsx`; modificar `Catalogo.jsx`, `tests/Catalogo.test.jsx` · Test: con y sin `:slug`
  **Listo cuando:** `/catalogo/indumentaria` muestra solo esa categoría con su chip marcado.
- [x] **T20** · Estado vacío del catálogo · Requisito: R8 · Archivos: crear `frontend/src/components/comunes/EstadoVacio.jsx`; modificar `Catalogo.jsx`, `tests/Catalogo.test.jsx` (más `frontend/src/data/textos.js`: `textos.catalogo.vacio`) · Test: "No encontramos productos con esta categoría" + "Ver todo el catálogo"
  **Listo cuando:** el caso vacío pasa.
- [x] **T21** · Página Detalle: galería, nombre, precio, descripción (oculta si es NULL), talles ("Talle único" si viene vacío), colores, "Sin stock" si corresponde, "Volver al catálogo" y esqueleto · Requisito: R10, R9, R18 · Archivos: crear `frontend/src/components/tienda/GaleriaFotos.jsx`, `frontend/src/pages/tienda/DetalleProducto.jsx`, `frontend/tests/DetalleProducto.test.jsx`; modificar `App.jsx` · Test: datos del detalle, "Talle único", "Sin stock" y esqueleto
  **Listo cuando:** `/producto/:slug` muestra todo.
- [x] **T22** · SEO del detalle: título y descripción del producto, JSON-LD de producto sin `offers` y de migas de pan · Requisito: R15 · Archivos: modificar `DetalleProducto.jsx`, `tests/DetalleProducto.test.jsx` (más crear `frontend/src/utils/seoDetalle.js` y sumar `textos.detalle.seo` a `frontend/src/data/textos.js`) · Test: título, `description`, JSON-LD sin `offers` y un solo `<h1>`
  **Listo cuando:** el test pasa.
- [x] **T23** · Página "No encontramos esta página" (ruta `*` y 404 del detalle) · Requisito: R11 · Archivos: crear `frontend/src/pages/tienda/NoEncontrada.jsx`, `frontend/tests/NoEncontrada.test.jsx`; modificar `App.jsx`, `DetalleProducto.jsx` · Test: texto y botón al catálogo
  **Listo cuando:** un slug inexistente lleva a la página 404.
- [x] **T24** · Etiqueta «Generado con IA» sobre la foto si `generada_con_ia = TRUE`, en tarjeta y detalle · Requisito: R12 · Archivos: modificar `TarjetaProducto.jsx`, `GaleriaFotos.jsx`, sus tests · Test: `TRUE` la muestra; `FALSE` no
  **Listo cuando:** los dos casos pasan.
- [x] **T25** · Recuadro con el nombre del producto cuando no tiene fotos · Requisito: R13 · Archivos: modificar `TarjetaProducto.jsx`, `DetalleProducto.jsx`, sus tests · Test: sin fotos → recuadro con el nombre
  **Listo cuando:** con la base sin fotos, todas las tarjetas se ven completas.
- [x] **T26** · `robots.txt` y Open Graph general del sitio en `index.html` · Requisito: R15 · Archivos: crear `frontend/public/robots.txt`; modificar `frontend/index.html`, `frontend/src/components/comunes/MetaPagina.jsx` · Test: revisión del `dist/` después de `npm run build`
  **Listo cuando:** el build trae `robots.txt` y las etiquetas Open Graph.
- [x] **T27** · Error con "Reintentar" en el Inicio · Requisito: R17 · Archivos: crear `frontend/src/components/comunes/MensajeError.jsx`; modificar `Inicio.jsx`, `tests/Inicio.test.jsx` · Test: API rechazada → mensaje y reintento
  **Listo cuando:** el caso de error pasa.
- [ ] **T28** · Error con "Reintentar" en Catálogo y Detalle · Requisito: R17 · Archivos: modificar `Catalogo.jsx`, `DetalleProducto.jsx`, sus tests · Test: API rechazada en las dos páginas
  **Listo cuando:** ninguna pantalla queda en blanco.
- [x] **T29** · `carga-fotos.sql` cuando estén las fotos generadas con IA en `frontend/public/img/productos/` · Requisito: R12, R13 · Archivos: crear `backend/src/db/carga-fotos.sql` y sumar los WebP · Test: manual en Neon y en la página
  **Listo cuando:** las fotos se ven en tarjetas y detalle, con su leyenda.
  **Listo cuando:** las fotos se ven en tarjetas y detalle, con su leyenda.

## Cambio del 20/10/2026 · los productos no son solo blancos

- [x] **T30** · Documentar el cambio: colores por producto en la tabla de carga de la spec y nota "blanco en todos" reemplazada, corrección del hallazgo 1 en la clarificación, dato en el plan, `ETAPA-1.md` (párrafo "Todos los productos son blancos" y descripción de la taza sin "blanca") y frase de la cinta en `DESIGN.md` · Requisito: ninguno nuevo (son los datos de demostración de R10/R14) · Archivos: modificar `specs/001-catalogo/spec.md`, `specs/001-catalogo/clarificacion.md`, `specs/001-catalogo/plan.md`, `ETAPA-1.md`, `DESIGN.md` · Test: ninguno (documentación)
  **Listo cuando:** los cinco archivos coinciden con la lista de colores y la frase nueva.
- [x] **T31** · Frase de la cinta en `textos.js`: "Elegí el producto y el color, y lo estampamos con tu diseño, con tintas que no se borran con el lavado." · Requisito: R1 · Archivos: modificar `frontend/src/data/textos.js` · Test: `CintaProductos.test.jsx` (R1 ya verifica la frase desde `textos.cinta.frase`) en verde con el texto nuevo
  **Listo cuando:** `npm test` y `npm run build` en verde.
- [x] **T32** · `datos-demo.sql`: `UPDATE` de `colores` por producto (lista confirmada por el estudiante), descripción de la taza de cerámica sin "blanca" y encabezado corregido · Requisito: R10, R14 · Archivos: modificar `backend/src/db/datos-demo.sql` · Test: manual en Neon (lo ejecuta el estudiante)
  **Listo cuando:** en Neon la columna `colores` muestra la lista nueva en los 12 productos.

## Cambio del 23/10/2026 · colores nuevos con las fotos

- [x] **T33** · Documentar el cambio: fila Accesorios de la tabla de carga e historial en la spec, nota del cambio en `plan.md` y columna Colores nueva en la tabla de datos de demostración de `ETAPA-1.md` (Llavero: Blanco, Negro, Transparente · Mousepad: Blanco, Negro · Almohadón: Blanco, Gris, Verde claro) · Requisito: ninguno nuevo (son los datos de demostración de R10/R14) · Archivos: modificar `specs/001-catalogo/spec.md`, `specs/001-catalogo/plan.md`, `ETAPA-1.md` · Test: ninguno (documentación)
  **Listo cuando:** los tres archivos coinciden con las listas nuevas (con el color nuevo Transparente en el llavero).
- [x] **T34** · `datos-demo.sql`: `UPDATE` de `colores` de Llavero (Blanco, Negro, Transparente), Mousepad (Blanco, Negro) y Almohadón (Blanco, Gris, Verde claro) · Requisito: R10, R14 · Archivos: modificar `backend/src/db/datos-demo.sql` · Test: manual en Neon (lo ejecuta el estudiante)
  **Listo cuando:** en Neon la columna `colores` muestra las listas nuevas en los 3 productos.

## Cambio del 23/10/2026 · catálogo en 2 columnas en celular

- [x] **T35** · Grilla del catálogo y de los esqueletos en 2 columnas en celular, 3 en tablet (`md`) y 4 en PC (`lg`) · Requisito: R6, R9 · Archivos: modificar `frontend/src/pages/tienda/Catalogo.jsx`, `frontend/src/components/comunes/Cargando.jsx`, `frontend/tests/Catalogo.test.jsx` · Test: clases `grid-cols-2 md:grid-cols-3 lg:grid-cols-4` en la grilla y en el esqueleto
  **Listo cuando:** el test pasa y `/catalogo` se ve en 2 columnas en el celular.
- [x] **T36** · Tarjeta angosta en celular: bloque de datos `p-3`, precio `text-lg` y etiqueta "Personalizable" `px-2 py-0.5` (en compu queda como ahora con `md:`) · Requisito: R5 · Archivos: modificar `frontend/src/components/tienda/TarjetaProducto.jsx`, `frontend/tests/TarjetaProducto.test.jsx` · Test: clases de celular presentes y las de compu en los `md:`
  **Listo cuando:** el test pasa y una tarjeta entra bien en 360 px sin cortarse.

## Cierre

`/verificar 001-catalogo` con la skill `verificar-criterios`, revisión con `revisar-marca` y Lighthouse de 80 o más.
