# Verificación 001-catalogo · Inicio, catálogo y detalle

**Fecha:** 27/10/2026 · **Tests:** frontend 74/74 en verde (12 archivos) · backend 18/18 en verde (4 archivos) · **Build:** ok (`npm run build` sin errores) · **Lint:** oxlint limpio

| Requisito | Resultado | Evidencia (test y archivo) | Si falla: ¿código o spec? |
| --- | --- | --- | --- |
| R1 | Cumple | `Inicio.test.jsx` › "R1 · muestra la portada, la franja, la cinta, 'Así de fácil' y '¿No tenés diseño?'" (las 5 secciones de `DESIGN.md`, código en `pages/tienda/Inicio.jsx`); también `HeroSublimado.test.jsx` › R1, `FranjaCategorias.test.jsx` › R1 (x2), `CintaProductos.test.jsx` › R1 (x2) | — |
| R2 | Cumple | `Inicio.test.jsx` › "R2 · pide los destacados y muestra 'Los más pedidos' con las 4 tarjetas y 'Ver todo el catálogo'" (`pide` con `{ destacados: true }`, 4 enlaces a `/producto/:slug`); código en `LosMasPedidos.jsx` con Embla | — |
| R3 | Cumple | `Inicio.test.jsx` › "R3 · sin destacados la sección 'Los más pedidos' no aparece"; código: `Inicio.jsx` solo la renderiza con `destacados.length > 0` | — |
| R4 | Cumple | `FranjaCategorias.test.jsx` › "R4 · cada categoría enlaza a su /catalogo/:slug" (4 hrefs contra `textos.franja.categorias`) | — |
| R5 | Cumple | `TarjetaProducto.test.jsx` › R5 x3 (foto/chip/nombre/enlace, precio `$ 12.000` desde texto `"12000.00"`, tarjeta angosta en celular con `p-3`, `text-lg` y etiqueta con `px-2 py-0.5`); precios en `utils/formatearPrecio.js` con tests unitarios x5 | — |
| R6 | Cumple | `Catalogo.test.jsx` › "R6 · pide todos los productos y muestra la grilla con las 12 tarjetas" y "R6 · la grilla pasa de 2 columnas (celular) a 3 (tablet) y 4 (PC)" (`grid-cols-2 md:grid-cols-3 lg:grid-cols-4`) | — |
| R7 | Cumple | `Catalogo.test.jsx` › R7 x4: pide con `{ categoria }`, chip marcado con `aria-current` / sin slug ninguno, título y descripción SEO por categoría (`textos.catalogo.seoCategorias`), filtro en `FiltroCategorias.jsx` | — |
| R8 | Cumple | `Catalogo.test.jsx` › "R8 · con una categoría sin productos muestra la frase y el enlace al catálogo completo" (`EstadoVacio.jsx`, frase exacta "No encontramos productos con esta categoría") | — |
| R9 | Cumple | `Catalogo.test.jsx` › "R9 · mientras carga muestra los esqueletos con la forma de la tarjeta" y `DetalleProducto.test.jsx` › "R9 · mientras carga muestra el esqueleto con la forma del detalle" (`Cargando.jsx` con `role="status"` y `aria-busy`) | — |
| R10 | Cumple | `DetalleProducto.test.jsx` › R10 x7: nombre/precio, talles + colores + descripción, descripción `null` → bloque oculto, "Talle único" con talles vacíos, foto `orden = 1` principal + miniaturas, "Volver al catálogo" a `/catalogo`, recarga al cambiar slug | — |
| R11 | Cumple | Backend: `productos.test.js` › "R11 · responde 404 en JSON si el slug no existe" y "…si está inactivo" (consulta `WHERE p.activo = TRUE AND p.slug = $1`). Frontend: `NoEncontrada.test.jsx` › R11 x3 (ruta `*`, 404 del detalle → página con botón al catálogo) y `api.test.js` › "R11 · si la API responde 404 lanza el error con su status" | — |
| R12 | Cumple | `TarjetaProducto.test.jsx` › R12 x2 (true la muestra / false no) y `DetalleProducto.test.jsx` › R12 x2; leyenda de `textos.generadoConIA` en tarjeta y `GaleriaFotos.jsx` | — |
| R13 | Cumple | `TarjetaProducto.test.jsx` › "R13 · sin foto muestra un recuadro con el nombre" y `DetalleProducto.test.jsx` › mismo caso (`data-testid="sin-foto-tarjeta"` / `"sin-foto-detalle"`) | — |
| R14 | Cumple | Backend: `categorias.test.js` › R14 x2, `productos.test.js` › R14 x6 (listado con precio/stock/descripción, `?categoria=` con `$1`, solo activos, `?destacados=1` LIMIT 4, foto principal o null, detalle con fotos ordenadas), `conexion.test.js` › R14 x3 (pool, no conecta al importar, consulta con parámetros). Frontend: `api.test.js` › R14 x4 (única puerta con `fetch`: solo `services/api.js` la usa) | — |
| R15 | Cumple | `Catalogo.test.jsx` › "R15 · pone el título y la descripción", "un solo h1", "JSON-LD de migas" (y migas del filtro hasta la categoría, con URLs completas); `DetalleProducto.test.jsx` › "R15 · el JSON-LD trae el producto sin offers y las migas de pan" + título + un solo h1; OG general y `robots.txt` en `index.html`/`public` (revisión del `dist/` hecha en T26, pendiente de reproducir ahora) | — |
| R16 | Cumple (con prueba manual) | `HeroSublimado.test.jsx` › "R16 · con movimiento reducido la remera queda quieta con el primer diseño"; `FranjaCategorias.test.jsx` › R16 (franja quieta); `CintaProductos.test.jsx` › "R16 · se ve la canillera estampada, sin anillos ni gotas". Código: las 7 piezas animadas usan `useReducedMotion`. **Prueba manual:** activar "reducir movimiento" en el sistema y recorrer portada, tarjeta (hover) y detalle | — |
| R17 | Cumple | `Inicio.test.jsx` › "R17 · si la API falla muestra el error y 'Reintentar' vuelve a pedir" + mismo caso en `Catalogo.test.jsx` y `DetalleProducto.test.jsx` x2; hook `useObtenerDatos.test.jsx` › R17 x2; `MensajeError.jsx` con `role="alert"` | — |
| R18 | Cumple | `TarjetaProducto.test.jsx` › R18 x2 (stock 0 la muestra / > 0 no) y `DetalleProducto.test.jsx` › R18 x2 | — |
| R19 | Cumple | `Layout.test.jsx` › "R19 · El footer muestra el aviso de sitio de demostración" (texto exacto en `data/textos.js`) | — |

## Criterios de finalización

- [x] Requisitos Alta: cumplen los 19 (R4 se completa su CTA de WhatsApp en 002, según la nota de alcance de la spec)
- [x] Tests en verde: frontend 74/74 · backend 18/18 · `npm run build` sin errores
- [ ] Lighthouse 80 o más en las cuatro categorías: **pendiente de correr**
- [ ] Revisión con la skill `revisar-marca`: **pendiente**

## Constitución

- **Principio 2 (tokens de marca):** ok — la búsqueda de colores con `#` en `frontend/src` solo da resultados dentro de `styles/index.css`; los estilos usan clases del tema (`bg-magenta`, `font-titulos`, `rounded-marca`).
- **Principio 3 (capas):** ok — `fetch` aparece solo en `frontend/src/services/api.js`; en el backend, las consultas van con parámetros (`$1`, `$2`) y las prueban `conexion.test.js` y `productos.test.js`.
- **Principio 5 (tests):** ok — cada requisito Alta tiene al menos un test (ver tabla); `npm test` y `npm run build` en verde en las dos carpetas.
- **Principio 6 (seguridad):** ok — `backend/.env` y `frontend/.env` están ignorados por Git y no están versionados (`git ls-files` no los trae); el cálculo busca `DATABASE_URL=` con valor real solo en `.env` (correcto) y como ejemplo en `docs/10-SEGURIDAD.md` (sin clave real).

## Pruebas manuales que tiene que hacer el estudiante

1. **Lighthouse** en `https://sean-store.vercel.app` (Inicio, Catálogo y Detalle): 80 o más en Rendimiento, Accesibilidad, Buenas prácticas y SEO.
2. **Movimiento reducido:** activar "reducir movimiento" en el sistema y recorrer portada (remera quieta con el primer diseño), pasar el mouse sobre una tarjeta (sin subida ni pasada de tinta) y el detalle.
3. **Celular desde 360 px:** portada en una columna, catálogo en 2 columnas, "Los más pedidos" deslizable con el dedo y tarjeta sin cortarse.
4. **Fotos:** en `/catalogo` ver la leyenda «Generado con IA» sobre las fotos, el recuadro con el nombre en la taza de polímero (sin fotos), y en el detalle tocar una miniatura y verla como foto principal.
5. **Franja de categorías:** pasar el mouse por la cinta y verificar que se pausa (y reanuda al salir).
6. **Reintento real de R17** (opcional): pausar la API y recargar el catálogo, tocar "Reintentar" con la API ya arriba.

## Conclusión

**Cumplen 19 de 19 requisitos Alta.** Las 31 tareas están implementadas con sus tests (92 en verde entre frontend y backend) y el build pasa. No se encontró ninguna falla ni en el código ni en la spec. Quedan 2 ítems del cierre de la spec: correr Lighthouse y hacer la revisión con `revisar-marca`, más las pruebas manuales de R16 y la vista en celular.
**Próximo paso:** no hace falta `/implementar` ni `/cambio`; terminar el cierre de la spec y avanzar con 002-pedido-whatsapp (`/clarificar` o `/plan`).
