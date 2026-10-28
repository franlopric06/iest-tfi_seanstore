# Plan 002-pedido-whatsapp · Pedido por WhatsApp y botón flotante

**Spec:** aprobada · **Fase:** 3 de 7 · **Fecha:** 27/10/2026

## 1. Resumen

Toda el trabajo es del **frontend** (sin backend ni base de datos): el pedido viaja en un enlace `https://wa.me/` armado en el navegador, como las decisiones de la clarificación. Se crea un ayudante (`whatsapp.js`) que es el único que conoce la variable `VITE_WHATSAPP` y arma el enlace con el mensaje codificado, un hook (`useSeleccionPedido`) que guarda la elección del cliente (color, talle y cantidad) con la preselección de la opción única y los avisos de las selecciones que faltan, y un componente `SelectorVariante` que solo muestra esa elección en la página del detalle, donde el botón "Pedir/Consultar por WhatsApp" se habilita solo cuando están las selecciones. `PedidoWhatsApp.jsx` reúne el hook, el selector, el botón y los avisos de ayuda del detalle. Otro componente nuevo es el botón flotante de WhatsApp en todas las pantallas de la tienda. Los textos del mensaje y de los avisos van a `data/textos.js`; si la variable no existe, no se muestra ningún botón (R5). No se tocan dependencias nuevas.

## 2. Por requisito

| Requisito | Qué se hace | Archivos (crear o modificar) | Test que lo prueba |
| --- | --- | --- | --- |
| R1 · selectores | Selector de color (chips solo texto con `rounded-marca`, decisión 5), selector de talle (solo si `talles` no está vacío) y campo de cantidad (entero, arranca en 1) encima del botón de WhatsApp en el detalle; la lógica de la selección vive en el hook | Crear `frontend/src/hooks/useSeleccionPedido.js` (estado: color, talle, cantidad y avisos), `frontend/src/components/tienda/SelectorVariante.jsx` (solo muestra: recibe por props visual y sus avisos); modificar `frontend/src/pages/tienda/DetalleProducto.jsx` (usa el hook), `frontend/src/data/textos.js` (`textos.whatsapp`) | `useSeleccionPedido.test.jsx`: arranca en 1, falta color/talle con más de una opción, preselección cuando es única · `SelectorVariante.test.jsx`: chips con los colores de la API, talle solo si hay, campo de cantidad |
| R2 · pedido (stock > 0) | Al tocar el botón, se abre en pestaña nueva `https://wa.me/{VITE_WHATSAPP}?text=…` con el mensaje del pedido | Crear `frontend/src/components/tienda/BotonWhatsApp.jsx`, `frontend/src/utils/whatsapp.js` (`armarMensajePedido` + `armarEnlaceWhatsApp`); modificar `DetalleProducto.jsx` | `BotonWhatsApp.test.jsx`: con stock > 0 el clic abre el enlace con "Hola! Quiero pedir: …" |
| R3 · consulta (stock = 0) | Botón cambia a "Consultar por WhatsApp" y el mensaje pregunta disponibilidad con color, talle (si hay) y cantidad | `BotonWhatsApp.jsx`, `utils/whatsapp.js`, `textos.js` | `BotonWhatsApp.test.jsx`: con stock = 0 el texto del botón y del mensaje |
| R4 · estilo del botón | Botón `bg-whatsapp text-whatsapp-texto`, ícono `MessageCircle` de Lucide, altura mínima 44 px, foco visible magenta y `aria` | `BotonWhatsApp.jsx` | `BotonWhatsApp.test.jsx`: clases del tema, ícono y atributos accesibles |
| R5 · sin variable | Si `VITE_WHATSAPP` está vacía, `armarEnlaceWhatsApp` devuelve `null`: ni el botón del detalle ni el flotante se renderizan | `utils/whatsapp.js` (el caso central), consumido por `BotonWhatsApp.jsx` y `BotonWhatsAppFlotante.jsx` | `whatsapp.test.js`: con la variable vacía devuelve `null`; con número devuelve el enlace armado |
| R6 · botón flotante | Botón fijo en la esquina inferior derecha de todas las páginas de la tienda (dentro del layout de la tienda, nunca en el panel), ícono `MessageCircle`, `aria-label`, 44 × 44 px y mensaje genérico "Hola! Te escribo desde la tienda, quiero hacer una consulta." | Crear `frontend/src/components/atencion/BotonWhatsAppFlotante.jsx`; modificar `frontend/src/App.jsx` | `BotonWhatsAppFlotante.test.jsx`: enlace con mensaje genérico, ícono y área táctil; no se renderiza con la variable vacía |
| R7 · falta el color | Con más de un color y ninguno elegido, el botón va deshabilitado y debajo aparece en pequeño "Elegí un color para continuar"; el estado lo calcula el hook | `useSeleccionPedido.js` (avisos), `DetalleProducto.jsx`, `textos.js` | `useSeleccionPedido.test.jsx`: aviso de color visible solo con más de una opción · `DetalleProducto.test.jsx`: botón deshabilitado con mensaje; habilitado al elegir |
| R8 · cantidad 1–50 | La cantidad no sale del rango 1–50: al intentar menos o más queda en el límite, y un valor inválido se corrige al más cercano (on blur) | `useSeleccionPedido.js` (regla), `SelectorVariante.jsx` (muestra) | `useSeleccionPedido.test.jsx`: tope de 1 y de 50, valor inválido corregido |
| R9 · falta el talle | Con más de un talle y ninguno elegido, deshabilitado y "Elegí un talle para continuar"; el estado lo calcula el hook | `useSeleccionPedido.js` (avisos), `DetalleProducto.jsx`, `textos.js` | `useSeleccionPedido.test.jsx`: ídem R7 con talles · `DetalleProducto.test.jsx`: ídem R7, con talles |
| R10 · contenido del mensaje | El mensaje lleva nombre, color y cantidad; talle solo si hay talles; jamás el precio. `encodeURIComponent` en el texto | `utils/whatsapp.js` (función pura `armarMensajePedido`) | `whatsapp.test.js`: mensajes exactos de R2/R3, con y sin talles, sin precio, texto codificado |
| R11 · opción única | Si el producto tiene un solo color o un solo talle, el hook la deja ya elegida de una: no bloquea el botón ni muestra ayuda | `useSeleccionPedido.js` (preselección inicial) | `useSeleccionPedido.test.jsx`: producto con un color y "Talle único" → botón habilitado de una, sin mensajes de ayuda |

## 3. API y datos

- **No se toca el backend ni la base.** Sin rutas nuevas, sin tablas nuevas (la consulta no se guarda: fuera de alcance de la spec).
- Los selectores trabajan con lo que ya devuelve `GET /api/productos/:slug` (spec 001): `nombre`, `stock`, `talles` y `colores`.
- El número de WhatsApp no viaja por la API: vive en la variable `VITE_WHATSAPP` de Vite, leída en un solo lugar (`frontend/src/utils/whatsapp.js`), igual que el principio 6 (nunca en el código y solo de entorno del navegador).

## 4. Componentes y pantallas

- **`useSeleccionPedido.js`** (hook, `src/hooks/`): la selección completa del cliente (color, talle, cantidad) con la preselección de la opción única (R11), los topes de cantidad (R8) y los avisos de faltantes (R7/R9). Con test propio, sin DOM. Se usa en `DetalleProducto`.
- **`SelectorVariante.jsx`** (tienda): muestra color, talle y cantidad; recibe del hook por props (valores, avisos y funciones de cambio). No tiene estados ni lógica propios.
- **`BotonWhatsApp.jsx`** (tienda): botón del detalle. Sus estados son los del formulario: **deshabilitado con mensaje de ayuda** (color o talle sin elegir, cuando hay más de una opción), **"Pedir por WhatsApp"** (stock > 0) y **"Consultar por WhatsApp"** (stock = 0). Con la variable vacía no se renderiza.
- **`PedidoWhatsApp.jsx`** (tienda): reúne `useSeleccionPedido`, `SelectorVariante`, `BotonWhatsApp` y los avisos de ayuda del pedido en el detalle. Sus avisos usan texto grafito porque orientan al cliente y no representan errores.
- **`BotonWhatsAppFlotante.jsx`** (atención): sin estados de datos (no carga nada); presente en la tienda, oculto sin variable.
- **`DetalleProducto.jsx`** (pantalla): conservan sus estados ya construidos en 001 (carga con esqueleto, 404 en `NoEncontrada`, error con `MensajeError`/reintentar, recuadro sin fotos); la sección nueva con el formulario vive en la rama de "datos cargados", así los estados heredan los de la página.
- **Textos:** todo lo que ve el cliente entra en `data/textos.js` como `textos.whatsapp` (mensajes, avisos y etiquetas), como ya hace el resto de la tienda.

## 5. Riesgos

| Riesgo | Cómo se evita |
| --- | --- |
| `VITE_WHATSAPP` a veces no existe en los tests o en otro entorno | El ayudante `whatsapp.js` devuelve `null` y cada componente no se renderiza; test con `vi.stubEnv` para el caso R5 |
| El enlace se arma roto si el mensaje tiene espacios, `?` o `!` | Toda la parte de texto se codifica dentro de `armarEnlaceWhatsApp` con `encodeURIComponent`, test con un mensaje con caracteres especiales |
| La elección del cliente (color, talle, cantidad y avisos) se dispersa y `DetalleProducto` pasa de ~150 líneas | La selección completa vive en el hook `useSeleccionPedido` (con su test propio, sin DOM): `DetalleProducto` lo usa, `SelectorVariante` solo muestra por props y `BotonWhatsApp` recibe habilitado/avisos. Si el detalle sigue creciendo, se extrae otra pieza a su propio archivo |
| Doble mantenimiento de los mensajes (R2, R3 y R10 repetidos) | Las funciones puras `armarMensajePedido(producto, eleccion)` y `armarEnlaceWhatsApp(mensaje)` en `utils/whatsapp.js`: si cambia una frase o el enlace, cambia una vez |
| `window.open` en jsdom | Los tests lo reemplazan con `vi.spyOn(window, 'open')` (como ya usaba stubs globales el test de `api.js`) |
| El botón flotante tapa contenido o aparece en el panel | Fijo abajo a la derecha con margen; en la primera etapa el panel `/admin` no existe, pero el componente se coloca solo en el layout de la tienda (App.jsx), nunca en una posible ruta administrativa |
| Ignorar los tokens de la marca (colores a mano) | Solo clases del tema (`bg-whatsapp`, `text-whatsapp-texto`, `rounded-marca`, foco magenta); revisión con `revisar-marca` al cerrar |

## Sin código y dependencias

- El plan no lleva código: eso es fase 5 (`/implementar`) tarea por tarea.
- Dependencias nuevas: **ninguna** (Motion, Lucide y lo demás ya están en `frontend/package.json` y en `03-TECNOLOGIAS.md`).
