# Prompts clave y errores de la IA

Registro de los pedidos más importantes que se le hicieron a la IA durante el proyecto y de los errores que cometió. Los errores se anotan con la skill `registrar-error-ia`.

## Prompts clave

| Fecha | Fase | Herramienta | Prompt (resumido) | Resultado |
| --- | --- | --- | --- | --- |
| 17/10/2026 | Arnés | OpenCode (Big Pickle) | «Leé el archivo AGENTS.md y explicame en tres líneas de qué se trata este proyecto. No modifiques ningún archivo.» | Resumen correcto del proyecto. Sirvió para comprobar que el agente lee el arnés. |
| 17/10/2026 | Arnés | OpenCode (Big Pickle) | «Usá la herramienta de lectura de archivos para abrir MEMORY.md. Copiame textual, sin resumir, la línea que empieza con "Próxima tarea".» | Copió la línea exacta. Desde acá se pide siempre leer con la herramienta y citar textual. |
| 20/10/2026 | Arnés | OpenCode (GLM-5.3-Flash Free) | «Leé ETAPA-1.md y resumí en tres líneas qué se construye en esta etapa. Después hacé un único commit de la reorganización.» | Resumen correcto y un solo commit. Desde acá, si un documento choca con ETAPA-1.md, manda ETAPA-1.md. |
| 20/10/2026 | Imágenes | Google Gemini | «Fotografía realista de una taza de cerámica blanca sobre una mesa de madera con un florero chico, luz natural de tarde… con la iglesia del reloj de Tinogasta estampada. Sin texto, sin logos, sin marcas.» (estructura SUJETO + ACCIÓN + ENTORNO + LUZ + CÁMARA + ESTILO + MARCA + RESTRICCIONES) | Base de las 55 fotos de productos. Un chat por producto para que no cambie la foto equivocada. |
| 28/10/2026 | 003 · Spec | GitHub Copilot (Agent) | «/spec 003-asistente: botón "¿Tenés dudas?" abajo a la izquierda, panel con seis preguntas frecuentes, búsqueda sin mayúsculas ni tildes y, si no encuentra, enlace a WhatsApp con lo buscado. Sin IA ni backend.» | Spec chica con 8 requisitos. El agente avisó que 06-DISENO-UI pedía más y preguntó antes de escribir. |
| 28/10/2026 | Video | Kling 2.5 Turbo | «La cámara entra despacio al taller, la luz de la ventana se mueve apenas, polvo suave en el aire. Sin personas.» (con la foto del taller como primer cuadro) | Clip del taller en un intento. |
| 29/10/2026 | 004 · Implementación | OpenCode (GLM-5.3-Flash Free) | «/implementar 004-panel T27 y T28: formulario de producto con nombre, categoría desde /api/categorias, precio, stock, descripción, talles y colores separados por comas, destacado; botones "Nuevo producto", "Editar" y "Ocultar"/"Mostrar". Mostrame los archivos y commiteá cada tarea después de mi ok.» | Quedó a medias por el límite gratuito; lo terminó Claude (ver errores N° 16 y N° 17). |
| 01/11/2026 | 004 · Cambio | Claude | «/cambio: los botones Guardar y Cancelar tienen que quedar debajo de las fotos, porque la foto es lo último que se sube.» | Botones abajo en productos y en el taller; al crear un producto se abre su edición para agregarle fotos. |

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

### Error N° 8 · Mensaje de commit deformado y con un carácter invisible

- **Fecha y fase:** 21/10/2026 · Implementación de 001-catalogo, tarea T15 (commit)
- **Herramienta:** OpenCode (GLM-5.3-Flash Free)
- **Qué se pidió:** hacer el commit con el mensaje propuesto, `001-T15 TarjetaProducto con precio formateado y etiqueta "Sin stock"`, y hacer el push.
- **Qué hizo mal la IA:** PowerShell deformó las comillas del mensaje: quedó `etiqueta " Sin stock\`, con un `\` al final y sin la comilla de cierre. Y al corregirlo con un archivo temporal, `Set-Content -Encoding UTF8` escribió un BOM invisible al inicio, así que el mensaje aparecía como `﻿001-T15…`.
- **Cómo se detectó:** la IA misma lo vio al revisar el mensaje con `git log -1 --format='%s'` después de cada commit, antes de hacer el push.
- **Corrección:** dos `git commit --amend -F` con el mensaje escrito en un archivo ASCII; el push se hizo después de confirmar que el mensaje quedaba bien: **se corrigió con `--amend` antes del push, así que no se reescribió historia publicada**.
- **Para que no se repita:** en Windows, cuando el mensaje del commit tiene comillas, escribirlo en un archivo ASCII y usar `git commit -F archivo` (nunca comillas anidadas en PowerShell), y revisar `git log -1 --format='%s'` antes de pushear.

### Error N° 9 · Escribió el código antes que los tests

- **Fecha y fase:** 26/10/2026 · Implementación de 001-catalogo, tarea T24 (leyenda «Generado con IA»)
- **Herramienta:** Kiro
- **Qué se pidió:** implementar T24 siguiendo `/implementar`, que en el paso 3 pide escribir primero el test y verlo fallar, y recién después el código.
- **Qué hizo mal la IA:** modificó `TarjetaProducto.jsx` y `GaleriaFotos.jsx` con la leyenda antes de agregar los tests nuevos. Los corrió cuando el código ya estaba en verde, así que nunca se vio el fallo esperado.
- **Cómo se detectó:** el estudiante lo notó al revisar el orden de los pasos y pidió registrarlo.
- **Corrección humana:** ninguna: los tests cubren los casos correctos y pasan. El error es de proceso, no de resultado.
- **Para que no se repita:** en cada tarea, escribir los casos de test nuevos primero, correrlos y confirmar que fallan (rojo), y solo entonces escribir el código que los pone en verde. No hay excepción aunque los cambios parezcan obvios.

### Error N° 10 · Inventó el nombre "Iglesia del Rosario" para un lugar real

- **Fecha y fase:** 26/10/2026 · Implementación de 001-catalogo, tarea T29 (carga-fotos.sql)
- **Herramienta:** Kiro
- **Qué se pidió:** generar los textos `alt` de cada foto a partir del nombre del archivo WebP, en español, describiendo lo que se ve.
- **Qué hizo mal la IA:** para los archivos con `-iglesia-reloj` en el nombre escribió el alt "con la Iglesia del Rosario y el reloj de Tinogasta", inventando el nombre "del Rosario" para esa iglesia. El nombre real no se podía inferir del nombre del archivo y la IA lo completó con un dato falso.
- **Cómo se detectó:** el estudiante lo notó al revisar el SQL antes de ejecutarlo en Neon.
- **Corrección humana:** el estudiante pidió reemplazar "la Iglesia del Rosario y el reloj de Tinogasta" por "la iglesia del reloj de Tinogasta" (descripción visual sin nombre propio inventado) en todos los alts afectados (taza, termo, campera y llavero). También pidió reemplazar "la Iglesia de Adobe de Tinogasta" por "una iglesia de adobe de la Ruta del Adobe" para el mismo motivo.
- **Para que no se repita:** cuando el nombre de archivo no incluye el nombre oficial de un lugar, el alt describe lo que se ve visualmente ("una iglesia de adobe", "una torre con reloj") sin inventar nombres propios. Si hay duda sobre el nombre real, preguntar antes de escribir.

### Error N° 11 · Explicó un error de sintaxis y un build fallido que nunca pasaron

- **Fecha y fase:** 26/10/2026 · Implementación de 001-catalogo, tarea T27
- **Herramienta:** OpenCode (GLM-5.3-Flash Free)
- **Qué se pidió:** implementar T27 (estado de error con "Reintentar" en el Inicio) y explicar en lenguaje simple cada archivo cambiado para que el estudiante lo pueda defender.
- **Qué hizo mal la IA:** en la explicación de `Inicio.jsx` inventó un detalle que no ocurrió: dijo que la lógica quedó como un solo condicional que producía un error de sintaxis y un build fallido. El build nunca falló durante la tarea (`npm run build` anduvo en verde en todos los intentos) y tampoco hubo ese error de sintaxis. Es una explicación con hechos ficticios: el estudiante tendría que defender algo que no pasó.
- **Cómo se detectó:** lo detectó el estudiante al leer la explicación: el build había anduvo bien, así que pidió registrar el error.
- **Corrección humana:** el estudiante lo marcó en la misma conversación; la explicación queda con solo lo que pasó de verdad (refactor del condicional y test nuevo en rojo primero).
- **Para que no se repita:** las explicaciones describen únicamente lo que pasó en la tarea, sin inventar fallos, pasos ni errores: si el build no falló, no se dice que falló; cada detalle del relato se puede verificar con la salida de los comandos que corrieron.

### Error N° 12 · Desactivó la verificación del certificado de la base

- **Fecha y fase:** 21/10/2026 · Implementación de 001-catalogo, tarea T09 (`conexion.js`)
- **Herramienta:** OpenCode (GLM-5.3-Flash Free)
- **Qué se pidió:** crear la conexión a Neon con `pg.Pool` y la variable `DATABASE_URL`.
- **Qué hizo mal la IA:** configuró `ssl: { rejectUnauthorized: false }`. Así la conexión se cifra, pero no se comprueba que del otro lado esté de verdad Neon.
- **Cómo se detectó:** al revisar el archivo antes del commit (estudiante con Claude).
- **Corrección humana:** se cambió a `ssl: true` antes del commit.
- **Para que no se repita:** en conexiones a servicios externos no se apaga ninguna verificación de seguridad para que algo «ande»; si falla, se busca la causa.

### Error N° 13 · Marcó la spec como aprobada sin preguntar

- **Fecha y fase:** 27/10/2026 · Clarificación de 002-pedido-whatsapp
- **Herramienta:** OpenCode (GLM-5.3-Flash Free)
- **Qué se pidió:** cerrar la clarificación con las decisiones del estudiante.
- **Qué hizo mal la IA:** además de anotar las decisiones, escribió en la spec que estaba «aprobada», cuando eso lo decide el estudiante.
- **Cómo se detectó:** el estudiante lo vio al revisar el diff.
- **Corrección humana:** se revisó la spec completa y se aprobó recién después.
- **Para que no se repita:** el agente nunca marca nada como aprobado; propone y espera el ok.

### Error N° 14 · Commiteó sin mostrar el código

- **Fecha y fase:** 29/10/2026 · Implementación de 004-panel, tareas T01–T02 y T18
- **Herramienta:** GitHub Copilot (modo Agent)
- **Qué se pidió:** implementar las tareas, mostrar los archivos y commitear después del ok del estudiante (paso 4 de `/implementar`).
- **Qué hizo mal la IA:** hizo el commit directamente, sin mostrar los archivos ni esperar el ok.
- **Cómo se detectó:** el estudiante vio el commit en el historial antes de haber revisado el código.
- **Corrección humana:** se revisaron los archivos después del commit (estaban bien) y se le recordó la regla en los pedidos siguientes.
- **Para que no se repita:** en cada pedido se repite «mostrame los archivos y esperá mi ok antes de commitear».

### Error N° 15 · Faltaba PUT en CORS y el ingreso delataba qué emails existían

- **Fecha y fase:** 29/10/2026 · Plan e implementación de 004-panel, bloque 1
- **Herramienta:** GitHub Copilot (modo Agent)
- **Qué se pidió:** configurar CORS para el panel y el ingreso con email y contraseña.
- **Qué hizo mal la IA:** (1) dejó CORS sin el método `PUT`, que después necesitaban las fotos del taller; (2) cuando el email no existía, respondía sin comparar ninguna contraseña, así que contestaba más rápido y alguien podía medir el tiempo para saber qué emails están registrados.
- **Cómo se detectó:** en la revisión de los archivos (Claude, con el estudiante).
- **Corrección humana:** se agregó `PUT` con su test, y el ingreso compara siempre contra un hash falso (`HASH_FALSO`) cuando el email no existe, así tarda lo mismo.
- **Para que no se repita:** en todo lo que es seguridad, revisar también lo que la respuesta deja adivinar, no solo lo que dice.

### Error N° 16 · Dejó dos tests mal hechos al cortarse

- **Fecha y fase:** 29/10/2026 · Implementación de 004-panel, tarea T27 (formulario de producto)
- **Herramienta:** OpenCode (GLM-5.3-Flash Free)
- **Qué se pidió:** el formulario de producto con sus tests.
- **Qué hizo mal la IA:** se quedó sin cuota a mitad de la tarea y dejó dos tests que fallaban: uno escribía un nombre y después esperaba el aviso de «nombre vacío»; el otro dependía de que el navegador dejara enviar un precio negativo, pero el navegador lo frenaba antes de que el formulario mostrara su aviso.
- **Cómo se detectó:** al correr `npm test` con lo que dejó el agente.
- **Corrección humana:** Claude terminó la tarea: corrigió los dos tests, agregó `noValidate` al formulario para que los avisos sean los propios y separó las funciones en `utils/formularioProducto.js`.
- **Para que no se repita:** un test tiene que fallar por la razón correcta; antes de aceptarlo, leer qué prepara y qué espera.

### Error N° 17 · Dos piezas con la misma llave repetían el formulario

- **Fecha y fase:** 29/10 al 01/11/2026 · Implementación de 004-panel, bloque 3 (fotos de productos)
- **Herramienta:** Claude (terminó el panel cuando los agentes gratuitos no tenían cuota)
- **Qué se pidió:** mostrar las fotos del producto debajo del formulario de edición.
- **Qué hizo mal la IA:** el formulario y las fotos usaban la misma `key` de React (el id del producto). Al guardar y volver a editar, React dejaba copias viejas y el formulario aparecía repetido dos, tres o más veces.
- **Cómo se detectó:** el estudiante, usando el panel publicado. Los tests no lo veían porque nunca repetían el ciclo editar y guardar.
- **Corrección humana:** llaves distintas (`formulario-…` y `fotos-…`) y un test que guarda y vuelve a abrir tres veces. Primero se descartó que fuera la base con una consulta en Neon.
- **Para que no se repita:** las `key` tienen que ser únicas entre piezas hermanas; y probar los flujos repetidos, no solo una vez.

### Error N° 18 · La casilla «Generado con IA» del taller no se guardaba

- **Fecha y fase:** 01/11/2026 · Cambio en 004-panel (marca de IA en las fotos del taller)
- **Herramienta:** Claude
- **Qué se pidió:** poder marcar las fotos del taller como generadas con IA, igual que las de productos.
- **Qué hizo mal la IA:** la casilla solo funcionaba al subir un archivo nuevo y siempre aparecía vacía; si se marcaba y se tocaba Guardar, no se enviaba y al recargar volvía a estar desmarcada.
- **Cómo se detectó:** el estudiante, probándolo en el panel publicado.
- **Corrección humana:** la casilla muestra cómo está guardada cada foto y se guarda con el botón Guardar junto con el texto; se agregaron tests.
- **Para que no se repita:** un control del panel tiene que mostrar el valor guardado y guardarse con el botón que la persona espera.

