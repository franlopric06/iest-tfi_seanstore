# Verificación 003 · Asistente de preguntas frecuentes

**Fecha:** 28/10/2026 · **Tests:** frontend 136/136 en verde · backend 18/18 en verde · **Build:** ok

| Requisito | Resultado | Evidencia (test y archivo) | Si falla: ¿código o spec? |
| --- | --- | --- | --- |
| R1 | Cumple | `BotonAsistente.test.jsx` › “muestra el disparador accesible con posición, tamaño y foco visibles”; `Asistente.test.jsx` › “no se cierra al activar un control fuera del panel”; `App.test.jsx` › “muestra el botón flotante de WhatsApp en el layout de la tienda”. `BotonAsistente.jsx` define posición, tamaño mínimo y foco; `App.jsx` monta ambos flotantes fuera de las rutas. | — |
| R2 | Cumple | `PanelAsistente.test.jsx` › “muestra el saludo, la búsqueda y las seis preguntas frecuentes”; `Asistente.test.jsx` › “abre el panel y lleva el foco a su título”. `PanelAsistente.jsx` presenta el título enfocable y campo de búsqueda. | — |
| R3 | Cumple | `PanelAsistente.test.jsx` › “muestra la respuesta al activar una pregunta” y “mantiene una sola respuesta abierta a la vez”. `PanelAsistente.jsx` mantiene una pregunta abierta. | — |
| R4 | Cumple | `filtrarPreguntas.test.js` › “devuelve todas las preguntas si la búsqueda está vacía”, “busca en las preguntas ignorando mayúsculas y tildes”, “busca también en las respuestas” y “requiere que todos los términos aparezcan en pregunta o respuesta”; `Asistente.test.jsx` › “filtra por la respuesta, ignora mayúsculas y tildes, y restaura la lista al borrar”. `filtrarPreguntas.js` normaliza ambos textos y `Asistente.jsx` pasa la lista filtrada al panel. | — |
| R5 | Cumple | `PanelAsistente.test.jsx` › “muestra el estado vacío y el enlace contextual codificado en WhatsApp”. `PanelAsistente.jsx` muestra el estado cuando no hay coincidencias. | — |
| R6 | Cumple | `PanelAsistente.test.jsx` › “muestra el estado vacío y el enlace contextual codificado en WhatsApp” y `it.each` › “mantiene el panel y oculta el enlace con la variable ausente” / “variable vacía”. `whatsapp.js` construye la URL codificada y devuelve `null` sin número; `PanelAsistente.jsx` renderiza un enlace con `target="_blank"` y `rel="noopener noreferrer"` solo si la URL existe. | — |
| R7 | Cumple | `Asistente.test.jsx` › “cierra con el botón y devuelve el foco al disparador”, “cierra con Escape y devuelve el foco al disparador”, “no atrapa el foco dentro del panel” y “no se cierra al activar un control fuera del panel”. `Asistente.jsx` gestiona Escape y el cierre; `BotonAsistente.jsx` recibe la ref del disparador. | — |
| R8 | Cumple | `PanelAsistente.test.jsx` › “muestra el saludo, la búsqueda y las seis preguntas frecuentes”. Las preguntas/respuestas están en `textos.js`; `Asistente.jsx` y `PanelAsistente.jsx` usan esos datos locales y no incorporan IA, API ni base de datos. | — |

## Criterios de finalización
- [x] Los ocho requisitos Alta están verificados en esta tabla.
- [x] Tests frontend y backend en verde; build frontend sin errores.
- [x] Revisado con la skill `revisar-marca`; sin problemas pendientes.
- [x] Las seis respuestas de ejemplo fueron revisadas y aprobadas por el estudiante.

## Constitución
- Principio 2 (tokens de marca): **ok**. Los componentes usan tokens Tailwind; no se encontraron colores escritos a mano en `frontend/src`.
- Principio 3 (capas): **ok**. El asistente usa preguntas locales y el helper de WhatsApp; no llama a la API ni accede a la base. El `fetch` del frontend permanece en `services/api.js`.
- Principio 5 (tests): **ok**. Frontend 136/136 y backend 18/18; build frontend correcto; hay cobertura automatizada para cada requisito Alta.
- Principio 6 (seguridad): **ok**. `.env` y `.env.*` están ignorados por Git salvo `.env.ejemplo`; el asistente no solicita ni almacena datos personales y obtiene el número desde `VITE_WHATSAPP`.

## Pruebas manuales que tiene que hacer el estudiante
No quedan pruebas manuales pendientes para esta verificación. Durante T07 se comprobó en navegador local a 360 × 800 px que el panel no se desborda ni se superpone con el botón flotante de WhatsApp; con teclado, la apertura enfoca el título, Tab permite seguir al botón de cierre y Escape cierra y devuelve el foco al disparador. El registro está en `tasks.md`.

## Conclusión
Cumplen **8 de 8 requisitos Alta**. No se encontraron fallas de código ni de spec. Próximo paso: revisión del informe y commit de la verificación.
