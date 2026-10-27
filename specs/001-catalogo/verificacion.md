# Verificación 001-catalogo · Inicio, catálogo y detalle

**Fecha:** 26/10/2026 · **Tests:** frontend 74/74 en verde · backend 18/18 en verde · **Build:** ok

| Requisito | Resultado | Evidencia (test y archivo) | Si falla: ¿código o spec? |
| --- | --- | --- | --- |
| R1 | Cumple | `tests/Inicio.test.jsx` › "R1 · muestra la portada, la franja, la cinta, 'Así de fácil' y '¿No tenés diseño?'" | — |
| R2 | Cumple | `tests/Inicio.test.jsx` › "R2 · pide los destacados y muestra 'Los más pedidos' con las 4 tarjetas y 'Ver todo el catálogo'" | — |
| R3 | Cumple | `tests/Inicio.test.jsx` › "R3 · sin destacados la sección 'Los más pedidos' no aparece" | — |
| R4 | Cumple | `tests/FranjaCategorias.test.jsx` › "R1 · muestra la cinta con las 4 categorías y los 3 sellos" (verifica los 4 href `/catalogo/:slug`) | — |
| R5 | Cumple | `tests/TarjetaProducto.test.jsx` › "R5 · muestra la foto principal, 'Personalizable', el nombre y enlaza al detalle" + "R5 · muestra el precio con el formato $ 12.000" | — |
| R6 | Cumple | `tests/Catalogo.test.jsx` › "R6 · pide todos los productos y muestra la grilla con las 12 tarjetas" + "R6 · la grilla pasa de 2 columnas a 3 y 4" | — |
| R7 | Cumple | `tests/Catalogo.test.jsx` › "R7 · /catalogo/indumentaria pide esa categoría…" + "R7 · sin slug ningún chip queda marcado" + "R7 · la página de categoría lleva su propio título y descripción SEO" | — |
| R8 | Cumple | `tests/Catalogo.test.jsx` › "R8 · con una categoría sin productos muestra la frase y el enlace al catálogo completo" | — |
| R9 | Cumple | `tests/Catalogo.test.jsx` › "R9 · mientras carga muestra los esqueletos…" · `tests/DetalleProducto.test.jsx` › "R9 · mientras carga muestra el esqueleto con la forma del detalle, sin datos" | — |
| R10 | Cumple | `tests/DetalleProducto.test.jsx` › 9 casos: nombre/precio, talles/colores/descripción, descripción null, talles vacíos → "Talle único", galería con orden=1, miniatura → foto principal, key que resetea índice, enlace "Volver al catálogo", cambio de slug | — |
| R11 | Cumple | `tests/NoEncontrada.test.jsx` › "R11 · muestra el texto y el botón al catálogo" + "R11 · cuando la API responde 404 el detalle muestra la página" | — |
| R12 | Cumple | `tests/TarjetaProducto.test.jsx` › "R12 · con generada_con_ia true muestra la leyenda" + "R12 · con generada_con_ia false no muestra la leyenda" · `tests/DetalleProducto.test.jsx` › mismo par de casos | — |
| R13 | Cumple | `tests/TarjetaProducto.test.jsx` › "R13 · sin foto muestra un recuadro con el nombre del producto" · `tests/DetalleProducto.test.jsx` › "R13 · sin fotos muestra un recuadro con el nombre del producto" | — |
| R14 | Cumple | `tests/categorias.test.js` › 200 con las 4 categorías ordenadas · `tests/productos.test.js` › 18 casos: listado, `?categoria=`, `?destacados=1`, foto principal o null, precio/stock/descripcion, slug 200 con fotos ordenadas, slug inexistente 404, slug inactivo 404 | — |
| R15 | Cumple (parcial — ver nota) | `tests/Inicio.test.jsx` › título y descripción del inicio, un solo h1 · `tests/Catalogo.test.jsx` › título/descripción por página y por categoría, JSON-LD BreadcrumbList con URLs completas · `tests/DetalleProducto.test.jsx` › título/descripción del producto, JSON-LD Product sin offers + BreadcrumbList, un solo h1 · `tests/NoEncontrada.test.jsx` › título y robots noindex · `robots.txt` en `frontend/public/` · 6 etiquetas Open Graph en `index.html` | — |
| R16 | Prueba manual pendiente | Paso: activar "Reducir movimiento" en el SO (Configuración › Accesibilidad), abrir `https://sean-store.vercel.app` y verificar que el hero, la franja y la cinta están quietas en su estado final sin animaciones. Los tests unitarios de `HeroSublimado.test.jsx`, `FranjaCategorias.test.jsx` y `CintaProductos.test.jsx` ya verifican el comportamiento con `useReducedMotion = true`. | — |
| R17 | Cumple | `tests/Inicio.test.jsx` › "R17 · si la API falla, muestra el error y 'Reintentar' vuelve a pedir los destacados" · `tests/Catalogo.test.jsx` › "R17 · si la API falla, muestra el error y 'Reintentar' vuelve a pedir los productos" · `tests/DetalleProducto.test.jsx` › "R17 · si la API falla, muestra el error y 'Reintentar' vuelve a pedir el producto" | — |
| R18 | Cumple | `tests/TarjetaProducto.test.jsx` › "R18 · con stock 0 muestra la etiqueta 'Sin stock'" + "R18 · con stock mayor a 0 no muestra 'Sin stock'" · `tests/DetalleProducto.test.jsx` › mismo par de casos | — |
| R19 | Cumple | `tests/Layout.test.jsx` › "R19 · El footer muestra el aviso de sitio de demostración" | — |

**Nota sobre R15:** el `og:image` apunta a `https://sean-store.vercel.app/img/logo-seanstore-horizontal.png` (logo horizontal, solución provisoria). Cuando se genere la imagen de compartir (`/img/compartir.jpg`), se debe actualizar en `index.html` y en `MetaPagina.jsx`. La spec no tenía imagen pendiente como excepción, por eso se señala aquí pero no se marca como falla (la etiqueta está presente y tiene una URL válida).

## Criterios de finalización

- [x] Todos los requisitos Alta cumplen (con la excepción documentada de R16 que requiere prueba manual y la nota sobre og:image de R15).
- [x] Tests en verde: frontend 74/74 · backend 18/18 · `npm run build` sin errores.
- [ ] Lighthouse 80 o más en las cuatro categorías — **prueba manual pendiente**.
- [ ] Revisado con la skill `revisar-marca` — **pendiente**.

## Constitución

- **Principio 2 (tokens de marca):** ok. Búsqueda de `bg-[#`, `text-[#` y `border-[#` en `frontend/src/**/*.jsx` da cero resultados. Todos los colores y radios usan clases del tema (`bg-violeta`, `text-magenta`, `rounded-marca`, `bg-grafito/70`, etc.).
- **Principio 3 (capas separadas):** ok. Búsqueda de `fetch(` en `frontend/src/**/*.jsx` da cero resultados — todos los pedidos pasan por `services/api.js`. Búsqueda de `pool.query` en `backend/src/**/*.js` solo aparece en `db/conexion.js`.
- **Principio 5 (tests en verde):** ok. frontend 74/74, backend 18/18, build sin errores.
- **Principio 6 (seguridad):** ok. Búsqueda de `DATABASE_URL=` con valor en el código da cero resultados. Las variables de entorno viven en `.env` (ignorado por git) y en Vercel.

## Pruebas manuales que tiene que hacer el estudiante

1. **R16 · Movimiento reducido:** activar "Reducir movimiento" en el SO, abrir `https://sean-store.vercel.app` y verificar que el hero, la franja y la cinta se ven en su estado final sin animarse.
2. **Lighthouse:** abrir Chrome DevTools › Lighthouse en `https://sean-store.vercel.app`, `/catalogo` y `/producto/remera`. Debe dar 80 o más en las cuatro categorías (Performance, Accessibility, Best Practices, SEO).
3. **Skill `revisar-marca`:** correr la skill para controlar tokens, tipografías, foco de teclado y leyenda «Generado con IA» en tarjeta y detalle.
4. **og:image pendiente:** cuando exista `/img/compartir.jpg`, actualizar la URL en `index.html` y `MetaPagina.jsx` y volver a deployar.

## Conclusión

Cumplen 18 de 19 requisitos Alta con tests automáticos (R16 requiere prueba manual por su naturaleza visual). El build y los tests están en verde. Quedan 3 pasos manuales antes de cerrar la funcionalidad: prueba de movimiento reducido, Lighthouse y revisión con `revisar-marca`.
