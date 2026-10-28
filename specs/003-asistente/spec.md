# Spec 003-asistente · Asistente de preguntas frecuentes

**RF de origen:** RF25 · **Estado:** aprobada · **Fecha:** 28/10/2026

> Las respuestas de demostración fueron provistas y aprobadas por el estudiante el 28/10/2026.

## Contexto

El asistente ayuda a quienes visitan la tienda a encontrar respuestas a dudas frecuentes sin salir de la página. En esta primera etapa será un panel fijo que se abre desde un botón, con preguntas frecuentes elegidas por el cliente y un campo de búsqueda por palabras clave. Si la búsqueda no encuentra una pregunta, el panel ofrece continuar la consulta por WhatsApp. Las preguntas y respuestas serán textos de demostración locales, sin IA, backend ni base de datos.

## Historias de usuario

- Como cliente que visita cualquier página de la tienda, quiero abrir un panel de ayuda, para resolver dudas frecuentes sin perder de vista dónde estoy.
- Como cliente, quiero buscar una pregunta por palabras clave, para encontrar más rápido una respuesta.
- Como cliente cuya búsqueda no encuentra una respuesta, quiero poder continuar por WhatsApp, para pedir ayuda al negocio.
- Como persona que navega con teclado, quiero cerrar el panel y recuperar el foco en el botón que lo abrió, para continuar mi navegación.

## Respuestas de ejemplo aprobadas

Estas respuestas son los textos de demostración elegidos por el estudiante para esta etapa.

| Pregunta | Respuesta |
| --- | --- |
| ¿Cómo hago un pedido? | Elegí el producto, el color, el talle y la cantidad en su página y tocá "Pedir por WhatsApp". Te llega el mensaje ya armado y seguimos por ahí. |
| ¿Cuánto tarda? | Entre 3 y 5 días hábiles, según la cantidad y el diseño. Si lo necesitás para una fecha, avisanos por WhatsApp. |
| ¿Hacen envíos? | Sí. Podés retirarlo en el local en Tinogasta o te lo enviamos; el costo del envío depende del destino y lo coordinamos por WhatsApp. |
| ¿Qué diseños aceptan? | Una foto, tu logo, una frase o el número de tu equipo, en buena calidad (JPG o PNG). Si no tenés diseño, te lo armamos. |
| ¿Cómo pago? | Por ahora el pago se coordina por WhatsApp: transferencia o efectivo al retirar. |
| ¿Puedo ver cómo queda antes? | Sí. Te mandamos un boceto por WhatsApp y lo ajustamos hasta que te guste, antes de estampar. |

## Requisitos (EARS)

| ID | Tipo | Requisito | Prioridad |
| --- | --- | --- | --- |
| R1 | Ubicuo | El sistema deberá mostrar en todas las páginas de la tienda un botón fijo “¿Tenés dudas?” abajo a la izquierda, separado del botón flotante de WhatsApp que permanece abajo a la derecha, con un área táctil de al menos 44 × 44 px y foco visible. | Alta |
| R2 | Por evento | Cuando el cliente active “¿Tenés dudas?”, el sistema deberá abrir un panel de ayuda con un título o saludo, un campo de búsqueda y las preguntas frecuentes disponibles, y mover el foco a su título programáticamente enfocable (`tabIndex="-1"`). | Alta |
| R3 | Por evento | Cuando el cliente elija una pregunta frecuente visible, el sistema deberá mostrar su respuesta propuesta dentro del panel; solo una respuesta podrá permanecer abierta a la vez. | Alta |
| R4 | Por evento | Cuando el cliente escriba en el campo de búsqueda, el sistema deberá filtrar las preguntas comparando todas las palabras de la búsqueda contra el texto combinado de la pregunta y su respuesta, sin distinguir mayúsculas ni tildes; si el campo queda vacío, deberá volver a mostrar todas las preguntas. | Alta |
| R5 | Si | Si la búsqueda no encuentra ninguna pregunta, entonces el sistema deberá mostrar un estado sin resultados y el enlace “¿No encontraste tu respuesta? Escribinos por WhatsApp”. | Alta |
| R6 | Si | Si `VITE_WHATSAPP` no está definida o está vacía, entonces el sistema no deberá mostrar el enlace de derivación a WhatsApp; el resto del asistente deberá seguir funcionando. Cuando la variable exista, el enlace deberá usar `armarEnlaceWhatsApp` con el mensaje “Hola! Te escribo desde la tienda. Busqué "{consulta}" y no encontré la respuesta.”, donde `{consulta}` se reemplaza por el texto de búsqueda, y abrir WhatsApp en una pestaña nueva. | Alta |
| R7 | Por evento | Cuando el cliente cierre el panel con su botón de cierre o con la tecla Escape, el sistema deberá cerrarlo y devolver el foco al botón “¿Tenés dudas?” que lo abrió; el foco no deberá quedar atrapado dentro del panel, y tocar fuera del panel no deberá cerrarlo. | Alta |
| R8 | Ubicuo | El sistema deberá guardar las preguntas y respuestas de ejemplo en `frontend/src/data/textos.js`; el asistente no deberá usar IA generativa, claves, backend ni base de datos. | Alta |

## Casos límite

- Al abrir el panel, la búsqueda vacía muestra todas las preguntas disponibles.
- La búsqueda ignora diferencias de mayúsculas y tildes; por ejemplo, “envios” encuentra “¿Hacen envíos?”.
- La búsqueda también compara las respuestas; por ejemplo, “transferencia” encuentra “¿Cómo pago?”.
- Si la búsqueda contiene más de una palabra, todas deben aparecer en el texto combinado de la pregunta y su respuesta, sin importar el orden.
- Si ninguna pregunta coincide, se muestra el estado sin resultados y, solo si `VITE_WHATSAPP` está configurada, el enlace de derivación.
- El mensaje del enlace de derivación incluye el texto de búsqueda en lugar de `{consulta}`: “Hola! Te escribo desde la tienda. Busqué "{consulta}" y no encontré la respuesta.”
- Si `VITE_WHATSAPP` no existe o está vacía, las preguntas y respuestas siguen disponibles; solo se omite el enlace externo.
- Al borrar el texto de búsqueda, vuelve la lista completa.
- Al abrir el panel, el foco va a su título (`tabIndex="-1"`); el panel no atrapa el foco.
- Escape y el botón de cierre cierran el panel y devuelven el foco al botón que lo abrió; un clic o toque fuera no lo cierra.
- Solo una respuesta puede quedar abierta a la vez; al abrir otra pregunta, se cierra la respuesta anterior.
- En celular, el botón de ayuda y su panel no deben desbordar la pantalla ni tapar el botón flotante de WhatsApp.
- El panel contiene seis preguntas y sus respuestas locales; no depende de la conexión ni de una API.

## Fuera de alcance

- IA generativa, respuestas libres, historial o almacenamiento de conversaciones.
- Backend, base de datos, panel administrativo o edición dinámica de preguntas.
- Carga de preguntas desde `preguntas_frecuentes`.
- Animación de “escribiendo…” descrita en `docs/06-DISENO-UI.md`; queda como próximo paso para una etapa posterior.
- Búsqueda semántica o coincidencias aproximadas: esta etapa filtra preguntas por palabras clave, sin distinguir mayúsculas ni tildes.

## Criterios de finalización

- [ ] Todos los requisitos Alta cumplen en `verificacion.md`.
- [ ] Tests en verde (`npm test` en `frontend/` y `backend/`) y build sin errores.
- [ ] Revisado con la skill `revisar-marca`.
- [x] Las seis respuestas de ejemplo fueron revisadas y aprobadas por el estudiante antes de la implementación.

## Historial de cambios

| Fecha | Cambio | Motivo |
| --- | --- | --- |
| 28/10/2026 | Creación del borrador de spec para RF25; respuestas ajustadas a los textos exactos del estudiante | Definir el panel de preguntas frecuentes de la primera etapa y registrar sus respuestas de demostración aprobadas |
| 28/10/2026 | Spec clarificada y aprobada; búsqueda contra pregunta y respuesta, mensaje de derivación contextual y reglas de interacción y foco precisadas | Registrar las decisiones del estudiante de `clarificacion.md` |
