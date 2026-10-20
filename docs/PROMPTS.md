# Prompts clave y errores de la IA

Registro de los pedidos más importantes que se le hicieron a la IA durante el proyecto y de los errores que cometió. Los errores se anotan con la skill `registrar-error-ia`.

## Prompts clave

| Fecha | Fase | Herramienta | Prompt (resumido) | Resultado |
| --- | --- | --- | --- | --- |
| 17/10/2026 | Arnés | OpenCode (Big Pickle) | «Leé el archivo AGENTS.md y explicame en tres líneas de qué se trata este proyecto. No modifiques ningún archivo.» | Resumen correcto del proyecto. Sirvió para comprobar que el agente lee el arnés. |
| 17/10/2026 | Arnés | OpenCode (Big Pickle) | «Usá la herramienta de lectura de archivos para abrir MEMORY.md. Copiame textual, sin resumir, la línea que empieza con "Próxima tarea".» | Copió la línea exacta. Desde acá se pide siempre leer con la herramienta y citar textual. |

## Errores de la IA

### Error N° 1 · Respondió sin leer los archivos

- **Fecha y fase:** 17/10/2026 · Preparación del arnés
- **Herramienta:** OpenCode con Big Pickle
- **Qué se pidió:** «Leé MEMORY.md y DESIGN.md. Decime en dos líneas en qué etapa está el proyecto y cuál es la próxima tarea, y en otras dos líneas cómo es la portada de la página de inicio. No modifiques ningún archivo.»
- **Qué hizo mal la IA:** respondió sin abrir los archivos e inventó todo: una "Etapa 0", una "TAREA 1.01" que no existe y una portada con el título "Sublimación y productos personalizados" y botones que no están en el diseño.
- **Cómo se detectó:** comparando la respuesta con los archivos. La próxima tarea real era crear el repositorio y el título de la portada es "Tu diseño, en lo que quieras.". Además, el contador de contexto marcaba muy pocos tokens, señal de que no había cargado los archivos.
- **Corrección humana:** se le volvió a pedir que usara la herramienta de lectura y copiara textual la línea de "Próxima tarea"; esta vez la copió bien.
- **Para que no se repita:** se agregó en `AGENTS.md` la regla de abrir siempre los archivos con la herramienta de lectura y citar el texto exacto.

### Error N° 2 · Configuró Vitest sin `globals: true`

- **Fecha y fase:** 19/10/2026 · Etapa 0 (Vitest y Testing Library)
- **Herramienta:** OpenCode (GLM-5.3-Flash Free)
- **Qué se pidió:** «Configurar Vitest y Testing Library en el frontend, con un primer test que pase».
- **Qué hizo mal la IA:** armó `vite.config.js` con `environment: "jsdom"` y `setupFiles` pero sin `globals: true`; al correr `npm test`, falló con `ReferenceError: describe is not defined`.
- **Cómo se detectó:** la IA misma corrió `npm test` y vio el error antes de entregar la tarea (el build sí pasaba); se autocorrigió sin intervención humana.
- **Corrección:** se agregó `globals: true` a la sección `test` de `vite.config.js` y el test pasó en verde.
- **Corrección humana:** el estudiante revisó el cambio de `globals: true` y entendió por qué hacía falta (`describe`/`it`/`expect` no existen sin él).
- **Para que no se repita:** decisión anotada en `memory.md` (19/10/2026) y siempre correr `npm test` antes de dar una tarea por terminada.

### Error N° 3 · Inventó el código de tarea en el mensaje del commit

- **Fecha y fase:** 19/10/2026 · Etapa 0 (Vitest y Testing Library)
- **Herramienta:** OpenCode (GLM-5.3-Flash Free)
- **Qué se pidió:** «Configurar Vitest y Testing Library en el frontend, con un primer test que pase» y proponer el mensaje del commit.
- **Qué hizo mal la IA:** propuso el commit «agrega… (T0.04)» con un código de tarea inventado: esa tarea no está en ningún `tasks.md`, y los commits de preparación no llevan código según `07-CONVENCIONES.md`.
- **Cómo se detectó:** lo detectó el estudiante comparando el mensaje con `07-CONVENCIONES.md`.
- **Corrección humana:** el estudiante pidió el mensaje sin código: «configura Vitest y Testing Library con un primer test en verde».
- **Para que no se repita:** en `/implementar` el código de tarea sale de `tasks.md`; nunca se inventa, y los commits de documentación o arnés no llevan código.

### Error N° 4 · Export dijo default, import con llaves

- **Fecha y fase:** 19/10/2026 · Etapa 0 (backend: Express + ruta de salud)
- **Herramienta:** OpenCode (GLM-5.3-Flash Free)
- **Qué se pidió:** «Crear el backend con `app.js` + `servidor.js` y la ruta `GET /api/salud` separada en `routes/salud.routes.js` y `controllers/salud.controller.js`, con su test en Vitest + Supertest».
- **Qué hizo mal la IA:** exportó el controlador como default (`export default estadoSalud`) pero lo importó con llaves (`import { estadoSalud } from …`), así que la variable quedó `undefined` y el router recibió "argument handler must be a function"; `npm test` falló con 0 tests corridos.
- **Cómo se detectó:** la IA misma corrió `npm test`, leyó el error del stack (puntaba a `salud.routes.js:6`) y lo corrigió quitándole las llaves al import; también pasa cuando un archivo exporta con nombre pero se importa distinto.
- **Corrección:** se cambió el import a `import estadoSalud from "../controllers/salud.controller.js"` y los 3 tests pasaron en verde.
- **Corrección humana:** el estudiante revisó la corrección y entendió la diferencia entre exportar default (se importa sin llaves) y exportar con nombre (se importa con llaves y el nombre exacto).
- **Para que no se repita:** al crear un módulo, decidir primero si va a ser export default o nombrado, y hacer el import con la misma forma; siempre correr `npm test` antes de cerrar la tarea.

### Error N° 5 · `??` con `FRONTEND_URL` vacía bloqueaba la API por CORS

- **Fecha y fase:** 19/10/2026 · Etapa 0 (backend: cors en `app.js` y `.env.ejemplo`)
- **Herramienta:** OpenCode (GLM-5.3-Flash Free)
- **Qué se pidió:** cors con `origin` desde `FRONTEND_URL`, y un `.env.ejemplo` con los nombres de las variables.
- **Qué hizo mal la IA:** usó el operador `??` (nullish) en `process.env.FRONTEND_URL ?? "http://localhost:5173"`. Como `FRONTEND_URL` queda con valor vacío al copiar `.env.ejemplo`, `??` no la saltea (solo saltea `null` y `undefined`, no `""`) y el origen autorizado quedaba `""`: ningún sitio podía hablar con la API. Además, `.env.ejemplo` tenía todo vacío, incluso valores que no son secretos.
- **Cómo se detectó:** lo detectó el estudiante revisando `app.js` y `.env.ejemplo` antes del commit.
- **Corrección humana:** el estudiante pidió tres cambios: cambiar `??` por `||` (que saltea también `""`), poner los valores de ejemplo que no son secretos (`PORT=3000` y `FRONTEND_URL=http://localhost:5173`; `DATABASE_URL` queda vacía porque es secreta) y agregar un test que compruebe la cabecera `Access-Control-Allow-Origin`.
- **Para que no se repita:** en `origin` y demás variables de entorno usar `||` (no `??`) cuando el valor vacío no sirve, y en los ejemplos de `.env` dejar vacío solo lo secreto; probar siempre la cabecera CORS con un test.

### Error N° 6 · Texto del chat con palabras mezcladas y sin sentido

- **Fecha y fase:** 19/10/2026 · Spec de 001-catalogo (fases 1 y 2)
- **Herramienta:** OpenCode (GLM-5.3-Flash Free)
- **Qué se pidió:** una entrevista antes de escribir la spec (5 preguntas con opciones) y, después, la revisión de hallazgos con recomendaciones.
- **Qué hizo mal la IA:** dos veces el texto salió mezclado y sin sentido, tanto en la entrevista (pregunta N° 5, sobre los datos de desarrollo) como en las opciones del hallazgo 1 ("haría fermentar la misma line for all sections..."). No se podía leer la pregunta ni la recomendación.
- **Cómo se detectó:** lo detectó el estudiante al leer las respuestas; le avisó a la IA las dos veces y la hizo rehacer.
- **Corrección humana:** el estudiante apartó la pregunta afectada y la volvió a responder en texto simple; en el hallazgo 1 pidió "evitá eso" y la IA reformuló.
- **Para que no se repita:** en el chat, cada pregunta con opciones va corta y de a una, sin textos largos de relleno; si algo sale ilegible, se avisa y se reescribe antes de seguir.
- **Ocurrencias adicionales (19/10/2026):** tercera y cuarta vez en la misma conversación (final de la pregunta del hallazgo 6 y criterio de finalización de `spec.md` con "destacadosNames"). El estudiante detectó ambas; se mantiene la regla: frases completas en español, texto corto, releer el archivo escrito antes de avisar y reescritura inmediata cuando sale ilegible.

### Error N° 7 · El plan proponía tests contra la base real de Neon

- **Fecha y fase:** 19/10/2026 · Plan de 001-catalogo (fase 3 del ciclo SDD)
- **Herramienta:** OpenCode (GLM-5.3-Flash Free)
- **Qué se pidió:** crear `specs/001-catalogo/plan.md` con, entre otras cosas, los tests de los requisitos R14 (las rutas de la API) y la tabla de riesgos.
- **Qué hizo mal la IA:** el plan proponía correr los tests de la API contra la base real de Neon ("Los tests de la API tocan la base real de Neon"), contradiciendo `docs/07-CONVENCIONES.md`, que dice que la base se reemplaza por datos de prueba porque "no se usa la base real en los tests".
- **Cómo se detectó:** lo detectó el estudiante al revisar el plan antes de aprobarlo.
- **Corrección humana:** el estudiante pidió corregir la tabla de riesgos y los tests de R14: los tests simulan `db/conexion.js` con `vi.mock` de Vitest y devuelven datos de prueba, sin tocar Neón nunca.
- **Para que no se repita:** antes de definir los tests de una spec se lee `07-CONVENCIONES.md`; en el backend, todo test de ruta hace `vi.mock` de `db/conexion.js` con datos de prueba.
