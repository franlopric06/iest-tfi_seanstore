# Tareas 001-catalogo

**Spec:** aprobada · **Plan:** aprobado · **Estado:** aprobado (19/10/2026, ok del estudiante)

Reglas: una tarea = un commit (`001-Txx`, 07-CONVENCIONES); ninguna tarea se commitea sin su test. Cada tarea arranca escribiendo su test (rojo) y termina con el código que lo pone en verde. Antes de proponer cada commit: `npm test` y `npm run build` en `frontend/` y `backend/` (principio 5). Orden del plan: SQL → API → frontend. Los tests de API nunca tocan Neon: `vi.mock` de `db/conexion.js` (Error N° 7 en `PROMPTS.md`).
T01 y T02 sí generan commit (los archivos SQL están en el repo); lo manual es solo ejecutarlos en Neon. La única tarea sin commit es T07 (conectar la base y publicar): no toca nada del repo, la hace el estudiante con el agente guiando y ninguna clave pasa por el chat.

## Base de datos (R14)

- [x] **T01** · Crear el esquema de la versión 1: las 5 tablas (`categorias`, `productos`, `producto_fotos`, `consultas`, `preguntas_frecuentes`), sin tablas de la v2 · Requisito: R14 · Archivos: crear `backend/src/db/esquema-v1.sql` · Test: manual — el estudiante lo ejecuta en el SQL Editor de Neon (la `DATABASE_URL` nunca pasa por el chat)
  **Listo cuando:** en Neon existen las 5 tablas de la v1 y ninguna de la v2.
- [ ] **T02** · Crear la carga inicial: 4 categorías y los 13 productos reales (talles y colores de la spec), `precio NULL`, `destacado FALSE`, `activo TRUE`, sin filas en `producto_fotos` · Requisito: R14 · Archivos: crear `backend/src/db/carga-catalogo.sql` · Test: manual en Neon
  **Listo cuando:** los conteos en Neon dan 4 categorías, 13 productos, 0 fotos, 0 destacados y 13 activos.

## API (R14 y R11)

- [ ] **T03** · Conexión a la base: pool de `pg` para consultas con parámetros (`$1`, `$2`), sin conectarse hasta la primera consulta · Requisito: R14 · Archivos: crear `backend/src/db/conexion.js`; modificar `backend/package.json` (agregar `pg`) · Test: `npm test` de la Etapa 0 sigue en verde y ningún test toca Neon
  **Listo cuando:** `pg` está instalado, `conexion.js` es el único acceso a la base (principio 3) y los tests existentes pasan.
- [ ] **T04** · Ruta `GET /api/categorias` — primero el test, después el código · Requisito: R14 · Archivos: crear `backend/tests/categorias.test.js`, `backend/src/controllers/categorias.controller.js`, `backend/src/routes/categorias.routes.js`; modificar `backend/src/routes/index.js` · Test: Supertest con `vi.mock` de `conexion.js`: 200 con las categorías ordenadas por `orden`
  **Listo cuando:** `npm test` en verde con filas de prueba, sin conexión real a Neon.
- [ ] **T05** · Ruta `GET /api/productos` con `?categoria=` y `?destacados=1` — primero el test · Requisito: R14 · Archivos: crear `backend/tests/productos.test.js`, `backend/src/controllers/productos.controller.js`, `backend/src/routes/productos.routes.js`; modificar `backend/src/routes/index.js` · Test: `vi.mock`: listado solo con `activo = TRUE`, filtro por categoría, destacados limitados a 4, foto de `orden = 1` o `null`
  **Listo cuando:** los 4 casos del listado pasan con `vi.mock` y sin Neon.
- [ ] **T06** · Detalle `GET /api/productos/:slug` con 404 — primero el test · Requisito: R14, R11 · Archivos: modificar `backend/src/controllers/productos.controller.js`, `backend/src/routes/productos.routes.js`, `backend/tests/productos.test.js` · Test: 200 con `descripcion` + `fotos` ordenadas por `orden`; 404 JSON `{ "error": ... }` si el slug no existe o el producto está inactivo
  **Listo cuando:** la API completa responde las 3 rutas y `npm test` entero está en verde.
- [ ] **T07** · Conectar la base y publicar (la hace el estudiante, con el agente guiando; ninguna clave pasa por el chat): `DATABASE_URL` en `backend/.env` y en las variables del proyecto de la API en Vercel; `VITE_API_URL` en `frontend/.env` y en el proyecto de la tienda en Vercel; redeploy de los dos · Requisito: R14 · Archivos: ninguno en el repo (los `.env` están fuera de Git; el deploy es en Vercel) · Test: manual con `curl`, y tocando la web
  **Listo cuando:** `https://sean-store-api.vercel.app/api/categorias` devuelve las 4 categorías reales.

## Frontend — base e inicio (R14, R17, R1, R16, R4, R5, R2, R3)

- [ ] **T08** · Puerta única a la API y hook de carga, con su propio test · Requisito: R14, R17 · Archivos: crear `frontend/src/services/api.js`, `frontend/src/hooks/useObtenerDatos.js`, `frontend/tests/useObtenerDatos.test.jsx` · Test: `useObtenerDatos` con la API mockeada — estado de carga, dato cuando responde, error cuando falla y reintento que vuelve a pedir
  **Listo cuando:** el test del hook pasa y ningún archivo fuera de `api.js` hace `fetch` (principio 3).
- [ ] **T09** · Header mínimo (logo + "Catálogo") y footer de la v1 (isotipo + descripción + WhatsApp, sin legales) + textos fijos en `data/` · Requisito: R1 · Archivos: crear `frontend/src/components/layout/Header.jsx`, `Footer.jsx`, `frontend/src/data/textos.js`, `frontend/tests/Layout.test.jsx` · Test: `Layout.test.jsx` — el header renderiza el logo y "Catálogo"; el footer, la descripción y el contacto por WhatsApp
  **Listo cuando:** el test de layout pasa y los textos no están escritos dentro de los componentes (07-CONVENCIONES).
- [ ] **T10** · HeroSublimado "Tu diseño en vivo": remera SVG que cicla 4 diseños (3 s c/u), chips sincronizados, subrayado amarillo · Requisito: R1, R16 · Archivos: crear `frontend/src/components/tienda/HeroSublimado.jsx` (con subarchivo propio si pasa ~150 líneas), `frontend/tests/HeroSublimado.test.jsx` · Test: render con sus textos; con `matchMedia` de movimiento reducido queda quieto en su estado final
  **Listo cuando:** el test del hero pasa y usa solo `transform` y `opacity`.
- [ ] **T11** · FranjaCategorias: franja inclinada con cinta magenta en loop (32 s, pausa al hover/touch) + 3 sellos · Requisito: R1, R16 · Archivos: crear `frontend/src/components/tienda/FranjaCategorias.jsx`, `frontend/tests/FranjaCategorias.test.jsx` · Test: render con los sellos y las categorías; con movimiento reducido queda quieta
  **Listo cuando:** el test de la franja pasa con tokens de marca y `useReducedMotion`.
- [ ] **T12** · CintaProductos: 5 íconos que pasan y se estampan (2,5 s c/u, vuelta 12,5 s); quieta muestra la canillera estampada · Requisito: R1, R16 · Archivos: crear `frontend/src/components/tienda/CintaProductos.jsx`, `frontend/tests/CintaProductos.test.jsx` · Test: render; con movimiento reducido queda en el estado final (canillera estampada)
  **Listo cuando:** el test de la cinta pasa y respeta `useReducedMotion`.
- [ ] **T13** · Página Inicio que arma todas las secciones + SEO del inicio + rutas con React Router — primero el test · Requisito: R1, R15 · Archivos: crear `frontend/src/pages/tienda/Inicio.jsx`, `frontend/src/components/comunes/MetaPagina.jsx`, `frontend/tests/Inicio.test.jsx`; modificar `frontend/src/App.jsx` · Test: Testing Library con `api.js` mockeado: portada, franja, cinta, "Así de fácil", "¿No tenés diseño?", header y footer; además título y `description` del inicio y un solo `<h1>` (si el cambio de `App.jsx` rompe `tests/App.test.jsx` de Etapa 0, se ajusta en el mismo commit)
  **Listo cuando:** `/` muestra todas las secciones con su SEO, `npm test` y `npm run build` en verde. `MetaPagina` queda listo con soporte de JSON-LD para el catálogo (T18) y el detalle (T22).
- [ ] **T14** · Las categorías de la franja enlazan al catálogo filtrado · Requisito: R4 · Archivos: modificar `frontend/src/components/tienda/FranjaCategorias.jsx`, `frontend/tests/FranjaCategorias.test.jsx` · Test: los 4 `href` apuntan a `/catalogo/tazas-termos`, `/catalogo/indumentaria`, `/catalogo/deportes` y `/catalogo/accesorios`
  **Listo cuando:** el test de los 4 enlaces pasa.
- [ ] **T15** · TarjetaProducto: foto principal, "Personalizable", nombre truncado, "Consultá el precio" y toda la tarjeta enlazada a `/producto/:slug` — primero el test · Requisito: R5 · Archivos: crear `frontend/src/components/tienda/TarjetaProducto.jsx`, `frontend/tests/Catalogo.test.jsx` · Test: los textos de la tarjeta y el enlace
  **Listo cuando:** el test de tarjeta pasa con `npm test` en verde.
- [ ] **T16** · "Los más pedidos": hasta 4 destacados con Embla en celular + "Ver todo el catálogo"; sin destacados la sección no se renderiza (nada inventado) · Requisito: R2, R3 · Archivos: modificar `frontend/src/pages/tienda/Inicio.jsx`, `frontend/tests/Inicio.test.jsx`, `frontend/package.json` (agregar `embla-carousel-react`, permitida por 03-TECNOLOGIAS) · Test: 4 destacados mock → 4 `TarjetaProducto`; lista vacía → `queryBy` no encuentra la sección
  **Listo cuando:** el test pasa y, con la base real (nada destacado aún), la sección no aparece en `/`.

## Catálogo (R6, R9, R15, R7, R8)

- [ ] **T17** · Página Catálogo: grilla 4/2/1 columnas desde 360 px + esqueletos grises mientras carga — primero el test · Requisito: R6, R9 · Archivos: crear `frontend/src/components/comunes/Cargando.jsx`, `frontend/src/pages/tienda/Catalogo.jsx`; modificar `frontend/src/App.jsx`, `frontend/tests/Catalogo.test.jsx` · Test: grilla con productos mock y esqueleto durante la carga
  **Listo cuando:** `/catalogo` lista los 13 productos y el esqueleto aparece antes de los datos.
- [ ] **T18** · SEO del catálogo: `MetaPagina` con JSON-LD de migas de pan y datos de la página /catálogo · Requisito: R15 · Archivos: modificar `frontend/src/pages/tienda/Catalogo.jsx`, `frontend/tests/Catalogo.test.jsx` · Test: título y `description`, un solo `<h1>` y JSON-LD de migas de pan sin bloque `offers`
  **Listo cuando:** el test de SEO del catálogo pasa (09-SEO.md); `MetaPagina` es el único que escribe título, descripción y JSON-LD.
- [ ] **T19** · Filtro por categoría: `/catalogo/:slug` con las 4 categorías en chips, la actual marcada, táctil ≥ 44 px y foco magenta · Requisito: R7 · Archivos: crear `frontend/src/components/tienda/FiltroCategorias.jsx`; modificar `frontend/src/pages/tienda/Catalogo.jsx`, `frontend/tests/Catalogo.test.jsx` · Test: casos con y sin `:slug` (el filtro del API ya está probado en `productos.test.js`)
  **Listo cuando:** `/catalogo/indumentaria` muestra solo esa categoría con el chip marcado.
- [ ] **T20** · Estado vacío del catálogo · Requisito: R8 · Archivos: crear `frontend/src/components/comunes/EstadoVacio.jsx`; modificar `frontend/src/pages/tienda/Catalogo.jsx`, `frontend/tests/Catalogo.test.jsx` · Test: "No encontramos productos con esta categoría" + enlace "Ver todo el catálogo"
  **Listo cuando:** el caso vacío pasa y el filtro sigue usable.

## Detalle y 404 (R10, R15, R11)

- [ ] **T21** · Página Detalle: galería (principal `orden = 1`, miniaturas con Embla en celular), nombre, descripción, "Consultá el precio", talles ("Talle único" si viene vacío), colores y "Volver al catálogo" + esqueleto — primero el test · Requisito: R10, R9 · Archivos: crear `frontend/src/components/tienda/GaleriaFotos.jsx`, `frontend/src/pages/tienda/DetalleProducto.jsx`, `frontend/tests/DetalleProducto.test.jsx`; modificar `frontend/src/App.jsx` · Test: datos del detalle, "Talle único" con talles vacíos, galería y esqueleto
  **Listo cuando:** `/producto/:slug` muestra todo y `npm test` está en verde.
- [ ] **T22** · SEO del detalle: título y descripción del producto, JSON-LD de producto sin `offers` y JSON-LD de migas de pan (OG por producto: v2) · Requisito: R15 · Archivos: modificar `frontend/src/pages/tienda/DetalleProducto.jsx`, `frontend/tests/DetalleProducto.test.jsx` · Test: título y `description` del producto, JSON-LD de producto sin bloque `offers`, JSON-LD de migas de pan y un solo `<h1>`
  **Listo cuando:** el test de SEO del detalle pasa y no hay precio en el JSON-LD (decisión 7).
- [ ] **T23** · Página "No encontramos esta página": ruta `*` y detalle que la muestra ante 404 del API · Requisito: R11 · Archivos: crear `frontend/src/pages/tienda/NoEncontrada.jsx`, `frontend/tests/NoEncontrada.test.jsx`; modificar `frontend/src/App.jsx`, `frontend/src/pages/tienda/DetalleProducto.jsx` · Test: texto y botón al catálogo (el 404 del API ya quedó probado en `productos.test.js`)
  **Listo cuando:** un slug inexistente termina en la página 404 con salida al catálogo.

## Detalles de marca y estados (R12, R13, R15, R17)

- [ ] **T24** · Leyenda «Generado con IA» sobre la foto solo si `generada_con_ia = TRUE`, en tarjeta y detalle · Requisito: R12 · Archivos: modificar `frontend/src/components/tienda/TarjetaProducto.jsx`, `GaleriaFotos.jsx`, `frontend/tests/Catalogo.test.jsx`, `frontend/tests/DetalleProducto.test.jsx` · Test: foto `TRUE` → se ve la leyenda; `FALSE` → no se ve
  **Listo cuando:** los casos TRUE/FALSE pasan en los dos tests.
- [ ] **T25** · Recuadro con el nombre del producto cuando no tiene fotos (estado normal hasta `carga-fotos.sql`) · Requisito: R13 · Archivos: modificar `frontend/src/components/tienda/TarjetaProducto.jsx`, `frontend/src/pages/tienda/DetalleProducto.jsx`, `frontend/tests/Catalogo.test.jsx`, `frontend/tests/DetalleProducto.test.jsx` · Test: producto sin fotos → recuadro con su nombre
  **Listo cuando:** con la base real (0 fotos) todas las tarjetas y detalles se ven completos.
- [ ] **T26** · `robots.txt` y Open Graph general del sitio en `index.html` (OG por producto: v2) · Requisito: R15 · Archivos: crear `frontend/public/robots.txt`; modificar `frontend/index.html` · Test: revisión del HTML generado por `npm run build` (etiquetas OG presentes); sin sitemap (v2)
  **Listo cuando:** el `dist/` sirve OG general + `robots.txt`.
- [ ] **T27** · Estado de error con "Reintentar" en el Inicio · Requisito: R17 · Archivos: crear `frontend/src/components/comunes/MensajeError.jsx`; modificar `frontend/src/pages/tienda/Inicio.jsx`, `frontend/tests/Inicio.test.jsx` · Test: API rechazada → "Algo salió mal, probá de nuevo" + "Reintentar" vuelve a pedir los datos
  **Listo cuando:** el caso de error del inicio pasa con el reintento funcional.
- [ ] **T28** · Estado de error con "Reintentar" en Catálogo y Detalle · Requisito: R17 · Archivos: modificar `frontend/src/pages/tienda/Catalogo.jsx`, `DetalleProducto.jsx`, `frontend/tests/Catalogo.test.jsx`, `frontend/tests/DetalleProducto.test.jsx` · Test: API rechazada en ambas páginas → mensaje + reintento
  **Listo cuando:** los dos casos de error pasan; ninguna pantalla queda en blanco.
- [ ] **T29** · `carga-fotos.sql` (tarea posterior del plan): filas de `producto_fotos` (url, alt, orden, `generada_con_ia = TRUE`) cuando los WebP generados con IA estén en `frontend/public/img/productos/` · Requisito: R12, R13 · Archivos: crear `backend/src/db/carga-fotos.sql`; sumar los WebP a `frontend/public/img/productos/` · Test: manual en Neon — la cantidad de filas coincide con los archivos WebP y en la web se ven fotos con `alt` y leyenda
  **Listo cuando:** las fotos se ven en tarjetas y detalle. **Nota:** requiere las imágenes generadas; si no llegan, el sitio queda correcto con los recuadros (R13).

## Cierre

Al terminar las tareas: `/verificar` con la skill `verificar-criterios`, `revisar-marca` y Lighthouse 80+ (criterios de finalización de la spec). Los 4 destacados del negocio se marcan después con `/cambio` (anotado en `memory.md`).
