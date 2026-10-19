# Sean's Store: memoria del proyecto

Memoria compartida entre las conversaciones con el agente. Se lee al empezar y se actualiza al terminar cada tarea.

- Una línea por dato.
- "Estado actual" se reemplaza; "Decisiones" y "Problemas resueltos" se van sumando, con fecha.
- Nunca se guardan claves, contraseñas ni datos personales.

## Estado actual

- **Etapa:** Etapa 0 de `docs/08-TAREAS.md` (arnés y preparación). Todavía no hay código.
- **Última tarea hecha:** kit corregido para el TFI y arnés armado (constitución, comandos, skills, memoria).
- **Próxima tarea:** subir el kit al repositorio `iest-tfi_seanstore` (primer commit).
- **Datos reales que faltan del negocio:** lista de productos con precios, talles y colores; dirección; horarios; número de WhatsApp; tiempos de entrega; medidas de las guías de talles.

## Datos del proyecto

- **Alumno:** Francisco Ricardo Lopez · 3.º año, Tecnicatura Superior en Desarrollo de Software, IEST Tinogasta.
- **Materia:** Inteligencia Artificial (Prof. Ana Camila Barrionuevo). TFI = TP N.° 4.
- **Fechas:** entrega 28/10/2026 · defensa 30/10/2026.
- **Negocio:** Sean's Store, del hermano del alumno.
- **Agente:** OpenCode en la terminal de VS Code, modelo gratuito Big Pickle.
- **Repositorio:** `[se completa al crearlo]`
- **Sitio publicado:** `[se completa al publicarlo]` · **API:** `[se completa al publicarla]`

## Decisiones

| Fecha | Decisión | Por qué |
| --- | --- | --- |
| 09/10/2026 | Nombre "Sean's Store" (archivos como `seanstore`) | Es como aparece en el logo |
| 09/10/2026 | Si el cliente no tiene diseño, se lo atiende por WhatsApp | El diseño se arma con atención personalizada |
| 09/10/2026 | Solo reseñas de compradores verificados | Nunca se inventan opiniones |
| 10/10/2026 | Portada "Tu diseño en vivo" + cinta de productos | Elegida entre 3 alternativas (ver `DESIGN.md`) |
| 10/10/2026 | Sin desenfoque ni agrandar en celular, y sin más efectos | Se veía borroso y no se quiere recargar |
| 17/10/2026 | Agente OpenCode con modelo gratuito | La cátedra pide desarrollar con IA gratuita en VS Code |
| 19/10/2026 | Versión 1 = catálogo, pedido por WhatsApp y asistente | Mínimo 3 funcionalidades y 9 días; los pagos y las cuentas pasan a la versión 2 |
| 19/10/2026 | API en Vercel en lugar de Railway | Railway solo da USD 1 por mes en su plan gratuito |
| 19/10/2026 | Tests con Vitest (+ Testing Library y Supertest) | El TFI pide tests automáticos en verde |

## Problemas resueltos

| Fecha | Problema | Solución |
| --- | --- | --- |
| 17/10/2026 | `npm install -g opencode-ai` falló en Windows (EPERM y falta el paquete nativo) | Desinstalar, borrar `opencode-ai` de `%APPDATA%\npm\node_modules` e instalar `opencode-ai opencode-windows-x64` |
| 17/10/2026 | El agente respondió sobre `MEMORY.md` sin leerlo e inventó datos | Pedirle que use la herramienta de lectura y cite textual; regla agregada en `AGENTS.md` (ver Error N° 1 en `docs/PROMPTS.md`) |

## Cosas a tener en cuenta

- No usar `/init` en OpenCode: reescribe `AGENTS.md`.
- Las claves van solo en `backend/.env` y en las variables de Vercel.
