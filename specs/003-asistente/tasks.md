# Tareas 003-asistente

**Spec:** aprobada · **Plan:** aprobado · **Estado:** aprobado · **Fecha:** 28/10/2026

Reglas: cada tarea dura menos de 30 minutos, empieza por su test y no toca más de 3 o 4 archivos. Un commit por tarea. No se implementa hasta que el estudiante apruebe esta lista.

- [x] **T01** · Crear primero tests para el filtrado y después la función pura `filtrarPreguntas` que compara todos los términos con pregunta + respuesta sin mayúsculas ni tildes; consulta vacía devuelve todas · Requisito: R4 · Archivos: crear `frontend/tests/filtrarPreguntas.test.js` y `frontend/src/utils/filtrarPreguntas.js` · Test: coincidencia por pregunta, respuesta (“transferencia”), mayúsculas, tildes, varios términos y consulta vacía.
  **Listo cuando:** `npm test -- filtrarPreguntas.test.js` pasa y la función no depende de React ni del DOM.

- [x] **T02** · Crear primero tests del contenido y comportamiento del panel; guardar saludo, las seis preguntas/respuestas aprobadas y textos de interfaz en `textos.js`; implementar el panel presentacional con una sola respuesta abierta · Requisitos: R2, R3, R8 · Archivos: crear `frontend/tests/PanelAsistente.test.jsx` y `frontend/src/components/atencion/PanelAsistente.jsx`; modificar `frontend/src/data/textos.js` · Test: aparecen las seis preguntas, cada respuesta se revela al tocarla y al abrir otra se cierra la anterior.
  **Listo cuando:** el panel muestra textos desde `textos.js`, recibe por props la consulta/lista filtrada y los tests enfocados pasan.

- [x] **T03** · Crear primero tests del disparador y luego el botón “¿Tenés dudas?” fijo abajo a la izquierda, con nombre accesible, foco visible y área táctil de 44 × 44 px · Requisito: R1 · Archivos: crear `frontend/tests/BotonAsistente.test.jsx` y `frontend/src/components/atencion/BotonAsistente.jsx` · Test: nombre accesible, clases de posición/tamaño/foco y activación llama el callback recibido.
  **Listo cuando:** el componente solo representa el disparador por props y pasan sus tests enfocados.

- [x] **T04** · Crear primero tests de apertura, foco y cierre; implementar `Asistente.jsx` como controlador de estado abierto/cerrado, refs de disparador/título, Escape y restauración del foco; montar solo `<Asistente />` al lado del flotante en `App.jsx` · Requisitos: R1, R2, R7 · Archivos: crear `frontend/tests/Asistente.test.jsx` y `frontend/src/components/atencion/Asistente.jsx`; modificar `frontend/src/App.jsx` y `frontend/tests/App.test.jsx` · Test: el panel abre, el foco va al título, el botón de cierre y Escape cierran y devuelven el foco, el foco no queda atrapado ni un clic fuera cierra el panel.
  **Listo cuando:** `App.jsx` solo monta `<Asistente />` junto al flotante de WhatsApp fuera de las rutas, y los tests de integración pasan.

- [x] **T05** · Crear primero tests de la búsqueda en el controlador y después conectar el campo del panel con `filtrarPreguntas` desde `Asistente.jsx` · Requisito: R4 · Archivos: modificar `frontend/tests/Asistente.test.jsx` y `frontend/src/components/atencion/Asistente.jsx` · Test: escribir una consulta actualiza la lista; “transferencia” encuentra “¿Cómo pago?”, diferencias de mayúsculas/tildes no alteran el resultado y borrar el campo restaura las seis.
  **Listo cuando:** el estado de búsqueda vive en `Asistente.jsx` y el panel recibe el texto y las preguntas filtradas por props.

- [x] **T06** · Crear primero tests del estado sin resultados y la derivación; mostrar el enlace contextual a WhatsApp solo con número configurado y usar `armarEnlaceWhatsApp` con la consulta codificada · Requisitos: R5, R6 · Archivos: modificar `frontend/tests/PanelAsistente.test.jsx`, `frontend/src/components/atencion/PanelAsistente.jsx` y `frontend/src/data/textos.js` · Test: consulta sin coincidencias muestra el mensaje acordado y el enlace `wa.me` codificado; con `VITE_WHATSAPP` ausente o vacío, el enlace no aparece pero el asistente sigue visible.
  **Listo cuando:** el enlace usa exactamente “Hola! Te escribo desde la tienda. Busqué "{consulta}" y no encontré la respuesta.” con la consulta reemplazada, y la suite enfocada pasa.

- [ ] **T07** · Revisar marca y accesibilidad y validar el cierre del alcance con pruebas y build · Requisitos: R1–R8 · Archivos: ninguno, salvo correcciones puntuales aprobadas en tareas nuevas · Test: ejecutar `npm test` en `frontend/` y `backend/`, `npm run build` en `frontend/`, skill `revisar-marca` y prueba manual de teclado/responsive desde 360 px.
  **Listo cuando:** las suites y el build están en verde; la revisión no encuentra problemas pendientes y se registra cualquier paso manual realizado.
