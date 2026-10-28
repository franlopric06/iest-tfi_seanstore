# Tareas 002-pedido-whatsapp

**Spec:** aprobada · **Plan:** aprobado · **Estado:** aprobado · **Fecha:** 27/10/2026

Reglas: una tarea = un commit (`002-Txx`, 07-CONVENCIONES); ninguna se commitea sin su test. Cada tarea arranca escribiendo su test (rojo) y termina con el código que lo pone en verde. Antes de proponer cada commit: `npm test` y `npm run build` en `frontend/` (principio 5). Todo el trabajo es del frontend; el backend no se toca. Textos que ve el cliente → `data/textos.js`.

Orden: primero las funciones puras (sin DOM), después el hook, después los componentes y la integración en el detalle, y al final el flotante.

## Funciones puras

- [x] **T01** · `utils/whatsapp.js`: la función pura `armarMensajePedido(producto, eleccion)` que arma el mensaje exacto de R2 ("Hola! Quiero pedir: {producto}, color {color}, talle {talle}, cantidad {cantidad}. ¿Cómo seguimos?") y de R3 ("Hola! Me interesa …, ¿Tienen disponibilidad?"), sin la parte del talle si el producto no tiene talles, sin el precio y con los textos de `textos.whatsapp` · Requisito: R2, R3, R10 · Archivos: crear `frontend/src/utils/whatsapp.js` y `frontend/tests/whatsapp.test.js`; modificar `frontend/src/data/textos.js` · Test: mensajes exactos de R2 y R3 (con talles y sin), nunca el precio, y el texto con la marca {cantidad} formateada
  **Listo cuando:** el test pasa en verde con un solo archivo nuevo de utilidades.
- [ ] **T02** · `utils/whatsapp.js`: `armarEnlaceWhatsApp(mensaje)` — devuelve `https://wa.me/{VITE_WHATSAPP}?text={encodeURIComponent(mensaje)}`; si `VITE_WHATSAPP` no está definida o vacía devuelve `null` · Requisito: R5, R10 · Archivos: modificar `frontend/src/utils/whatsapp.js`, `frontend/tests/whatsapp.test.js` · Test: enlace con texto codificado (con `?` y `!` en el mensaje) y `null` sin la variable (`vi.stubEnv`)
  **Listo cuando:** el test pasa con la variable vacía y con número.

## Elección del cliente (hook)

- [ ] **T03** · Hook `useSeleccionPedido(producto)`: guarda color, talle y cantidad (arranca en 1); preselección si el producto tiene un solo color (R11); tope 1–50 con corrección al límite (R8) · Requisito: R1, R8, R11 · Archivos: crear `frontend/src/hooks/useSeleccionPedido.js` y `frontend/tests/useSeleccionPedido.test.jsx` · Test: cantidad inicial 1, llegar a 50 y no pasar, preselección con color único
  **Listo cuando:** el test pasa con el hook probado con ReactDOM (sin pantallas).
- [ ] **T04** · Hook: avisos de faltante — con más de un color sin elegir, `faltaColor` en `true` y aviso "Elegí un color para continuar" (R7); ídem `faltaTalle` con "Elegí un talle para continuar" (R9); nunca hay aviso cuando la opción es única · Requisito: R7, R9, R11 · Archivos: modificar `frontend/src/hooks/useSeleccionPedido.js` y `frontend/tests/useSeleccionPedido.test.jsx`; modificar `frontend/src/data/textos.js` · Test: avisos apenas el producto pide elegir y desaparecen al elegir; con un solo color/talle no hay aviso
  **Listo cuando:** el test pasa y los textos viven en `textos.js`.

## Componentes y pantalla

- [ ] **T05** · `SelectorVariante.jsx` presentacional: chips de color solo texto con `rounded-marca` (elección 5), chips de talle solo si hay talles y campo de cantidad; todo por props (valores, avisos y funciones de cambio), sin estado propio · Requisito: R1 · Archivos: crear `frontend/src/components/tienda/SelectorVariante.jsx` y `frontend/tests/SelectorVariante.test.jsx` · Test: chips con los colores y talles de la API, talle ausente con `talles` vacío, campo de cantidad
  **Listo cuando:** el test pasa sin que el componente tenga `useState`.
- [ ] **T06** · `BotonWhatsApp.jsx`: botón "Pedir por WhatsApp" o "Consultar por WhatsApp" según la prop `sinStock`, `bg-whatsapp text-whatsapp-texto`, ícono `MessageCircle`, alto mínimo 44 px, foco visible magenta y `aria-label`; deshabilitado por las props del hook; con el mensaje armado por prop, al tocar abre `window.open(armarEnlaceWhatsApp(mensaje))` en pestaña nueva · Requisito: R2, R3, R4, R5 · Archivos: crear `frontend/src/components/tienda/BotonWhatsApp.jsx` y `frontend/tests/BotonWhatsApp.test.jsx` · Test: texto según stock, clases del tema, ícono, `window.open` capturado con `vi.spyOn` y no renderiza si el enlace es `null`
  **Listo cuando:** el test pasa sin llamar a WhatsApp de verdad.
- [ ] **T07** · Integración en el detalle: `DetalleProducto.jsx` usa el hook y muestra `SelectorVariante` + `BotonWhatsApp` (y los avisos de ayuda) en la rama de "datos cargados"; `useObtenerDatos` y los estados de 001 quedan iguales · Requisito: R1, R7, R9, R11 · Archivos: modificar `frontend/src/pages/tienda/DetalleProducto.jsx` y `frontend/tests/DetalleProducto.test.jsx` · Test: flujo entero con mock — producto con varios colores y talles arranca con el botón deshabilitado y aviso; al elegir color y talle se habilita; el clic abre el enlace con el mensaje armado; producto con un color y "Talle único" habilitado de una y sin avisos
  **Listo cuando:** el test pasa en la página `/producto/:slug` completa y el detalle no pasa de ~150 líneas.

## Botón flotante

- [ ] **T08** · `BotonWhatsAppFlotante.jsx` en el layout de la tienda: fijo abajo a la derecha (`fixed`), 44 × 44 px mínimo, ícono `MessageCircle`, `aria-label`, enlaces a `wa.me` con el mensaje genérico "Hola! Te escribo desde la tienda, quiero hacer una consulta." (decisión 4); no aparece sin `VITE_WHATSAPP`; no se coloca en rutas administrativas (la primera etapa tiene solo el layout de la tienda) · Requisito: R5, R6 · Archivos: crear `frontend/src/components/atencion/BotonWhatsAppFlotante.jsx` y `frontend/tests/BotonWhatsAppFlotante.test.jsx`; modificar `frontend/src/App.jsx` y `frontend/src/data/textos.js` · Test: dentro del layout, área táctil y `aria-label`, tocar muestra `window.open` con el mensaje genérico, y sin variable el botón no existe
  **Listo cuando:** el test pasa y el botón se ve en portada, catálogo y detalle.

## Cierre

- [ ] **T09** · Revisión con la skill `revisar-marca` (tokens del tema, foco visible, accesibilidad, sin relleno) y prueba manual en `/producto/:slug`: pedido y consulta con una variable real de `VITE_WHATSAPP` local (mensaje que llega al chat del negocio), y en celular los tres controles y el botón entran sin desbordarse · Requisito: R4, R7, R9, R11 (vista) · Archivos: ninguno (revisión) · Test: manual
  **Listo cuando:** el estudiante revisa y guarda la captura; lo que falla entra como tarea nueva o `/cambio`.

Después: `/verificar 002-pedido-whatsapp` con la skill `verificar-criterios`, Lighthouse 80+ y actualizar `memory.md`.
