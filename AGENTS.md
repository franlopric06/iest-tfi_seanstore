# Sean's Store: instrucciones para el agente

Sean's Store es un negocio de **sublimación y productos personalizados** (tazas, termos, remeras, buzos, camperas, gorras, canilleras y más) de Tinogasta, Catamarca, con local físico y atención por WhatsApp. Este repositorio es su **tienda online**, desarrollada con agentes de IA siguiendo el ciclo **Spec-Driven Development (SDD)**.

**Versión 1 (TFI, entrega 28/10/2026):** vidriera online con pedido por WhatsApp. Tres funcionalidades:

| Carpeta | Funcionalidad | RF |
| --- | --- | --- |
| `specs/001-catalogo/` | Inicio, catálogo y detalle del producto | RF01, RF02, RF04 |
| `specs/002-pedido-whatsapp/` | Pedido por WhatsApp con o sin diseño + botón flotante | RF07, RF24 |
| `specs/003-asistente/` | Asistente de preguntas frecuentes | RF25 |

Pagos, carrito, cuentas, emails y panel son de la **versión 2**: no se construyen ahora.

**Stack:** React + Vite + Tailwind CSS v4 + Motion · Node.js + Express · PostgreSQL (Neon) · Vitest · Vercel
**Repositorio:** GitHub (`iest-tfi_seanstore`)

## Al empezar cada conversación

1. Leé `memory.md`: etapa actual, próxima tarea y decisiones.
2. Leé `docs/CONSTITUCION.md`. Sus 8 principios mandan sobre todo lo demás.
3. Leé los archivos que necesite la tarea (tabla de abajo). **Abrilos de verdad con la herramienta de lectura**: nunca respondas sobre un archivo sin haberlo leído en esta conversación. Si te piden un dato de un archivo, citá el texto exacto.
4. Antes de modificar archivos, explicá qué vas a hacer y en qué archivos, y esperá el "ok".

Una tarea, una conversación. Lo que haya que recordar va a `memory.md`, no al chat.

## Archivos del proyecto

| Archivo | Para qué sirve |
| --- | --- |
| `docs/CONSTITUCION.md` | Los 8 principios que no se negocian |
| `memory.md` | Estado actual, próxima tarea, decisiones y problemas resueltos |
| `DESIGN.md` | Diseño aprobado: secciones del inicio, animaciones y prototipos de `diseno/` |
| `docs/IDENTIDAD-MARCA.md` | Nombre, logo, colores, tipografías, tema de Tailwind y tono de voz |
| `docs/01-CONTEXTO.md` | Por qué existe la tienda, para quién es, versiones y qué no incluye |
| `docs/02-REQUERIMIENTOS.md` | RF01 a RF41 con prioridad (Alta = versión 1), historias de usuario y RNF |
| `docs/03-TECNOLOGIAS.md` | Herramientas y dependencias permitidas |
| `docs/04-ARQUITECTURA.md` | Carpetas, archivos y rutas de la API |
| `docs/05-DATOS.md` | Tablas y esquema SQL |
| `docs/06-DISENO-UI.md` | Pantallas, componentes, estados, asistente y textos |
| `docs/07-CONVENCIONES.md` | Nombres, tests y commits |
| `docs/08-TAREAS.md` | Plan general por etapas |
| `docs/09-SEO.md` | Títulos, descripciones, JSON-LD y textos alternativos |
| `docs/10-SEGURIDAD.md` | Claves, validaciones y qué nunca llega al navegador |
| `docs/PROMPTS.md` | Prompts clave y errores de la IA |
| `specs/NNN-nombre/` | Spec, clarificación, plan, tareas y verificación de cada funcionalidad |

## Ciclo SDD: cómo se trabaja cada funcionalidad

| Fase | Comando | Archivo que queda |
| --- | --- | --- |
| 0 · Constitución | (se lee siempre) | `docs/CONSTITUCION.md` |
| 1 · Spec | `/spec` | `specs/NNN/spec.md` (requisitos en notación EARS) |
| 2 · Clarificación | `/clarificar` | `specs/NNN/clarificacion.md` |
| 3 · Plan | `/plan` | `specs/NNN/plan.md` (sin código) |
| 4 · Tareas | `/tareas` | `specs/NNN/tasks.md` (menos de 30 min cada una) |
| 5 · Implementación | `/implementar` | código, tests y un commit por tarea |
| 6 · Validación | `/verificar` | `specs/NNN/verificacion.md` |
| 7 · Cambio | `/cambio` | spec actualizada primero, después el código |

No se salta ninguna fase y no se escribe código antes de que el estudiante apruebe `tasks.md`.

## Skills del proyecto (`.agents/skills/`)

- `verificar-criterios`: revisa cada requisito de una spec contra el código y los tests (la usa `/verificar`).
- `revisar-marca`: controla colores, fuentes, accesibilidad y movimiento contra la marca.
- `registrar-error-ia`: anota en `docs/PROMPTS.md` un error de la IA que detectó el estudiante.

## Reglas obligatorias

### Código y diseño

- Estilos **solo con Tailwind** y las clases del tema (`bg-violeta`, `text-magenta`, `font-titulos`…). Nunca valores sueltos como `bg-[#E5007D]` ni colores por defecto de Tailwind.
- No usar Bootstrap ni librerías de componentes; no crear archivos CSS aparte de `styles/index.css`.
- El diseño sigue **`DESIGN.md`** y `06-DISENO-UI.md`. Si chocan, manda `DESIGN.md`. Los prototipos de `diseno/` son solo referencia: se rehacen con Tailwind y Motion, nunca se copian sus estilos en línea.
- Animaciones **solo con Motion** (solo `transform` y `opacity`, sin `blur`, con `useReducedMotion`). **No agregar efectos** que no estén en `DESIGN.md`.
- Cada componente, página o función va en **su propio archivo**, de no más de ~150 líneas.
- Toda pantalla que carga datos muestra estado de carga, vacío y error.
- Todo el texto que ve el cliente va en español rioplatense (vos). **Sin textos de relleno:** si falta un dato real, se pregunta.

### Datos y servidor

- La base de datos se usa **solo** desde `backend/src/db/conexion.js`, con consultas **siempre con parámetros**.
- Todo lo que llega de un formulario se valida en el servidor.
- La consulta de WhatsApp no guarda datos personales que no hagan falta.

### Tests

- Primero el test, después el código. Cada requisito Alta tiene al menos un test.
- Antes de proponer un commit: `npm test` y `npm run build` en verde.

### Honestidad

- **Nunca** inventar reseñas, testimonios, contadores, precios, direcciones, teléfonos ni horarios.
- Toda imagen o video hecho con IA se muestra con la leyenda «Generado con IA».

### Usuarios y seguridad

- Nunca escribir claves en el código, en el frontend ni en el chat: `DATABASE_URL` y demás van en `.env` y en Vercel.
- No pedir ni aceptar que el estudiante pegue claves o datos personales en el chat.

## Al terminar cada tarea

1. Correr los tests y el build, y mostrar el resultado.
2. Explicar en lenguaje simple qué hace cada archivo que cambió: el estudiante tiene que poder defenderlo.
3. Marcar la tarea con `[x]` en `tasks.md`.
4. Proponer el mensaje del commit (`07-CONVENCIONES.md`) y hacerlo **solo con el ok del estudiante**.
5. Actualizar "Estado actual" en `memory.md`.

## Lo que el agente no debe hacer

- Usar `/init` ni reescribir completos `AGENTS.md`, `CLAUDE.md`, `memory.md`, `DESIGN.md` o la constitución: solo se editan las partes que cambian.
- Hacer `git push`, borrar archivos o instalar dependencias que no estén en `03-TECNOLOGIAS.md` sin preguntar.
- Construir funciones de la versión 2.
- Deformar, recolorear o redibujar el logo (usar los archivos de `marca/`).
- Usar `dangerouslySetInnerHTML` o guardar datos personales en `localStorage`.

## Si algo no está claro

Preguntar antes de inventar.
