# Plan 003-asistente · Asistente de preguntas frecuentes

## Resumen

Se agregará un botón de ayuda fijo abajo a la izquierda y un panel accesible que se abre desde él.
`Asistente.jsx` coordinará apertura, cierre, foco y búsqueda, usando `BotonAsistente.jsx` y `PanelAsistente.jsx`; `App.jsx` solo montará `<Asistente />` junto al flotante de WhatsApp.
Una función pura en `utils/` filtrará las seis preguntas locales comparando todos los términos contra pregunta y respuesta, normalizados sin mayúsculas ni tildes.
El panel permitirá expandir una sola respuesta y mostrará derivación contextual a WhatsApp cuando no haya resultados y la variable esté configurada.
No se agregan dependencias, rutas de API ni tablas; los textos aprobados viven en `data/textos.js`.

## Por requisito

| Requisito | Qué se hace | Archivos (crear o modificar) | Test que lo prueba |
| --- | --- | --- | --- |
| R1 | Agregar un botón con texto accesible, foco visible, área mínima de 44 × 44 px y posición fija abajo a la izquierda; montar el controlador desde el layout común de la tienda al lado del flotante de WhatsApp. | Crear `frontend/src/components/atencion/BotonAsistente.jsx` y `frontend/src/components/atencion/Asistente.jsx`; modificar `frontend/src/App.jsx`; crear `frontend/tests/BotonAsistente.test.jsx` y actualizar `frontend/tests/App.test.jsx`. | `BotonAsistente.test.jsx`: nombre accesible, clases de posición/tamaño/foco. `App.test.jsx`: el controlador y el flotante se montan en el layout fuera de las rutas. |
| R2 | Abrir el panel con título, búsqueda y preguntas; enfocar el título con `tabIndex="-1"` al abrir. | Crear `frontend/src/components/atencion/PanelAsistente.jsx` y `frontend/src/components/atencion/Asistente.jsx`; crear `frontend/tests/PanelAsistente.test.jsx`. | `PanelAsistente.test.jsx`: título, campo y seis preguntas; `Asistente.jsx` enfoca programáticamente el título. |
| R3 | Mostrar/ocultar la respuesta elegida y mantener abierta solo una pregunta por vez. | `frontend/src/components/atencion/PanelAsistente.jsx`; `frontend/src/data/textos.js`; `frontend/tests/PanelAsistente.test.jsx`. | `PanelAsistente.test.jsx`: revelar respuesta al activar una pregunta y cerrar la anterior al abrir otra. |
| R4 | Filtrar por todas las palabras de búsqueda sobre pregunta y respuesta, ignorando mayúsculas y diacríticos; búsqueda vacía devuelve todas. | Crear `frontend/src/utils/filtrarPreguntas.js`; modificar `frontend/src/components/atencion/Asistente.jsx`; crear `frontend/tests/filtrarPreguntas.test.js`. | `filtrarPreguntas.test.js`: coincidencia en pregunta, coincidencia en respuesta (“transferencia”), mayúsculas/tildes, todos los términos y cadena vacía. |
| R5 | Mostrar estado sin resultados y enlace de derivación contextual cuando no haya coincidencias. | `frontend/src/components/atencion/PanelAsistente.jsx`; `frontend/src/components/atencion/Asistente.jsx`; modificar `frontend/src/data/textos.js`; `frontend/tests/PanelAsistente.test.jsx`. | `PanelAsistente.test.jsx`: búsqueda sin resultados muestra el texto acordado y el enlace si hay número configurado. |
| R6 | Reutilizar `armarEnlaceWhatsApp` con la consulta interpolada; sin `VITE_WHATSAPP`, ocultar solo el enlace y dejar disponible el resto del asistente. | `frontend/src/components/atencion/PanelAsistente.jsx`; `frontend/src/utils/whatsapp.js` (reutilización, sin cambios previstos); `frontend/tests/PanelAsistente.test.jsx`. | `PanelAsistente.test.jsx`: número configurado produce enlace `wa.me` codificado con el texto de búsqueda; variable ausente o vacía oculta el enlace y conserva el panel. |
| R7 | Botón de cierre y Escape cierran el panel y devuelven el foco al disparador; abrir enfoca el título; no se atrapa el foco ni se cierra al tocar fuera. | `frontend/src/components/atencion/Asistente.jsx`; `frontend/src/components/atencion/BotonAsistente.jsx`; `frontend/src/components/atencion/PanelAsistente.jsx`; `frontend/tests/PanelAsistente.test.jsx`. | `PanelAsistente.test.jsx`: cierre por botón y Escape, foco restaurado, foco inicial en título y panel permanece abierto al activar un elemento externo. |
| R8 | Guardar saludo, preguntas, respuestas, etiquetas y estado sin resultados en los textos locales; no usar IA, claves, backend ni base. | Modificar `frontend/src/data/textos.js`; componentes locales del asistente. | `PanelAsistente.test.jsx`: renderiza las seis entradas aprobadas desde `textos.js`; el alcance no requiere llamadas de red. |

## API y datos

- **API:** no se agrega ni modifica ninguna ruta. El asistente funciona en el navegador con datos locales.
- **Datos:** no se consulta ni modifica ninguna tabla. Aunque `docs/05-DATOS.md` define `preguntas_frecuentes` para la tienda completa, esta spec aprobada exige usar `frontend/src/data/textos.js` y no usar base de datos.
- **WhatsApp:** se reutiliza `armarEnlaceWhatsApp(mensaje)` de `frontend/src/utils/whatsapp.js`; no se lee ni construye directamente el número en los componentes.

## Componentes y pantallas

- `BotonAsistente.jsx`: disparador fijo inferior izquierdo; expone estado expandido y control accesible del panel.
- `PanelAsistente.jsx`: panel presentacional de ayuda, encabezado enfocable, lista acordeón de preguntas, estado sin resultados y enlace condicional a WhatsApp. Recibe consulta, preguntas filtradas y acciones por props; se ubica sobre el botón para dejar visible el flotante de WhatsApp de la derecha.
- `Asistente.jsx`: mantiene el estado abierto/cerrado, consulta, referencias de foco y el manejo de Escape; filtra las preguntas mediante `filtrarPreguntas` y conecta el botón con el panel. Al cerrar devuelve el foco al disparador.
- `App.jsx`: solo monta `<Asistente />` junto a `BotonWhatsAppFlotante`, fuera de las rutas para que ambos estén disponibles en todas las páginas de la tienda.
- **Estados:** no hay carga ni error porque el contenido es local. Con búsqueda sin coincidencias se muestra el estado vacío. Si falta `VITE_WHATSAPP`, se oculta el enlace sin ocultar el estado vacío ni el asistente.
- El panel usará la animación de apertura ya descrita para paneles en `DESIGN.md`, solo con `transform` y `opacity`, respetando `useReducedMotion`; no se implementará la animación de “escribiendo…”.

## Riesgos

- La búsqueda debe normalizar acentos y mayúsculas tanto en consulta como en pregunta y respuesta, sin mutar los textos fuente; se cubre con pruebas unitarias de la función pura.
- Todas las palabras de una búsqueda tienen que coincidir en el texto combinado; las pruebas cubrirán términos encontrados entre pregunta y respuesta.
- Un mensaje de WhatsApp que incluya la búsqueda debe codificarse mediante el helper existente para caracteres especiales, sin concatenar parámetros manualmente.
- El movimiento del asistente a la esquina inferior izquierda difiere de `DESIGN.md`, que ubica el asistente y WhatsApp en la derecha. La ubicación izquierda está definida por la spec aprobada y evita solaparlos; no se modificará `DESIGN.md` como parte de este plan.
- Las respuestas de plazos, envíos, pagos y boceto son datos de demostración provistos por el estudiante; no deben sustituirse por afirmaciones inventadas durante la implementación.
- Mantener cada componente y la función principal pequeños; dividir cambios si el panel se acerca al límite orientativo de 150 líneas.
