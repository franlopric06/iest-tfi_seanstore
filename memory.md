# Sean's Store: memoria del proyecto

Memoria compartida entre las conversaciones con el agente. Se lee al empezar y se actualiza al terminar cada tarea.

- Una línea por dato.
- "Estado actual" se reemplaza; "Decisiones" y "Problemas resueltos" se van sumando, con fecha.
- Nunca se guardan claves, contraseñas ni datos personales.

## Estado actual

- **Etapa:** primera etapa (`ETAPA-1.md`), funcionalidad 001-catalogo, fase 5 (`/implementar`). Spec, clarificación, plan y tareas aprobados.
- **Hecho:** T01 (esquema en Neon), T02 (4 categorías y 12 productos en Neon), T03 (`backend/src/db/datos-demo.sql` escrito; el estudiante lo ejecuta en Neon: 12 con precio/stock/descripción y 4 destacados) y T04 (Header, Footer y `data/textos.js` con el aviso de demostración; test `Layout.test.jsx` en verde).
- **Reorganización (20/10/2026):** `docs/` describe la tienda completa y `ETAPA-1.md` dice qué se construye ahora: catálogo, pedido por WhatsApp, asistente y un panel chico, con datos de demostración (precio, stock, descripción y destacados definidos por el equipo). Spec, plan y tareas de 001 ajustados; tareas reordenadas para construir primero el inicio.
- **Próxima tarea:** T05 — HeroSublimado "Tu diseño en vivo" con la remera SVG que cicla 4 diseños, con test `HeroSublimado.test.jsx` (con movimiento reducido queda quieto).

## Datos del proyecto

- **Alumno:** Francisco Ricardo Lopez · 3.º año, Tecnicatura Superior en Desarrollo de Software, IEST Tinogasta.
- **Materia:** Inteligencia Artificial (Prof. Ana Camila Barrionuevo). TFI = TP N.° 4.
- **Fechas:** entrega 28/10/2026 · defensa 30/10/2026.
- **Negocio:** Sean's Store, usado como modelo para un proyecto educativo (tienda de demostración).
- **Agente:** OpenCode en la terminal de VS Code, modelo gratuito GLM-5.3-Flash Free (política de cero retención: no guarda ni entrena con lo que conversamos).
- **Repositorio:** https://github.com/franlopric06/iest-tfi_seanstore
- **Sitio publicado:** https://sean-store.vercel.app · **API:** https://sean-store-api.vercel.app

## Decisiones

| Fecha | Decisión | Por qué |
| --- | --- | --- |
| 09/10/2026 | Nombre "Sean's Store" (archivos como `seanstore`) | Es como aparece en el logo |
| 09/10/2026 | Si el cliente no tiene diseño, se lo atiende por WhatsApp | El diseño se arma con atención personalizada |
| 09/10/2026 | Solo reseñas de compradores verificados | Nunca se inventan opiniones |
| 10/10/2026 | Portada "Tu diseño en vivo" + cinta de productos | Elegida entre 3 alternativas (ver `DESIGN.md`) |
| 10/10/2026 | Sin desenfoque ni agrandar en celular, y sin más efectos | Se veía borroso y no se quiere recargar |
| 17/10/2026 | Agente OpenCode con modelo gratuito | La cátedra pide desarrollar con IA gratuita en VS Code |
| 19/10/2026 | Primera etapa = catálogo, pedido por WhatsApp y asistente | Mínimo 3 funcionalidades y 9 días; los pagos y las cuentas quedan para después |
| 19/10/2026 | API en Vercel en lugar de Railway | Railway solo da USD 1 por mes en su plan gratuito |
| 19/10/2026 | Tests con Vitest (+ Testing Library y Supertest) | El TFI pide tests automáticos en verde |
| 19/10/2026 | React 19 y oxlint en el template de Vite 8 | Es lo que trae `npm create vite@latest` hoy; se actualizó `03-TECNOLOGIAS.md` |
| 19/10/2026 | Fuentes (Russo One y Nunito) se cargan desde `index.html` con Google Fonts | Permite `preconnect` y carga más rápida que el `@import` en el CSS |
| 19/10/2026 | Vitest con `globals: true` en `vite.config.js` | Sin él, `describe`/`it`/`expect` no existen en los archivos de test (Error N° 2 en `docs/PROMPTS.md`) |
| 19/10/2026 | El ejemplo de variables de entorno se llama `.env.ejemplo` (no `.env.example`) | El `.gitignore` (con la excepción `!.env.ejemplo`) y el README ya usaban ese nombre; se corrigió `10-SEGURIDAD.md` |
| 19/10/2026 | Solo el frontend lleva `vercel.json`; la API no necesita ninguno | Vercel detecta Express con configuración cero: busca `src/app.js` con la app exportada como default; el rewrite SPA solo hace falta en el frontend (React Router) |
| 20/10/2026 | Reorganización: `docs/` = tienda completa; `ETAPA-1.md` = qué se construye ahora (manda si algo choca) | Recortar la primera etapa con parches en muchos documentos generaba contradicciones y preguntas en cadena |
| 20/10/2026 | Tienda de demostración con datos de ejemplo (precio, stock, descripción, 4 destacados) definidos por el equipo, aviso de sitio de demostración y panel chico (004) para editarlos | Es un proyecto educativo que usa el negocio como modelo; reemplaza la decisión de no mostrar precios ni stock |
| 19/10/2026 | Colores de la v1: blanco en todos los productos (la sublimación solo se hace sobre blanco) | Clarificación 001-catalogo, decisión 1 |
| 19/10/2026 | Fotos de producto generadas con IA en `frontend/public/img/productos/` (WebP); `producto_fotos.generada_con_ia` y leyenda en tarjeta y detalle | Clarificación 001-catalogo (decisiones 5 y 6; RNF12) |
| 19/10/2026 | Tablas de la v1: `categorias`, `productos`, `producto_fotos`, `consultas`, `preguntas_frecuentes`; carga por SQL escrito por el agente y ejecutado por el estudiante en Neon (la `DATABASE_URL` nunca pasa por el chat) | Clarificación 001-catalogo (decisiones 8 y 3) |
| 19/10/2026 | JSON-LD de producto sin `offers` y sin Open Graph por producto; solo OG general en `index.html` | Clarificación 001-catalogo (decisiones 7 y 10); los precios son de ejemplo |

## Problemas resueltos

| Fecha | Problema | Solución |
| --- | --- | --- |
| 17/10/2026 | `npm install -g opencode-ai` falló en Windows (EPERM y falta el paquete nativo) | Desinstalar, borrar `opencode-ai` de `%APPDATA%\npm\node_modules` e instalar `opencode-ai opencode-windows-x64` |
| 17/10/2026 | El agente respondió sobre `MEMORY.md` sin leerlo e inventó datos | Pedirle que use la herramienta de lectura y cite textual; regla agregada en `AGENTS.md` (ver Error N° 1 en `docs/PROMPTS.md`) |
| 19/10/2026 | En `/spec`, OpenCode puso todos los argumentos en `$1` y quiso crear la carpeta "001-catalogo RF01 RF02 RF04" | Los 7 comandos de `.opencode/commands/` pasaron a usar solo `$ARGUMENTS`, con una línea que explica cómo leerlo (primera palabra = carpeta de la spec; en `/implementar`, la segunda = la tarea; en `/spec` y `/cambio`, el resto = la descripción) |

## Cosas a tener en cuenta

- No usar `/init` en OpenCode: reescribe `AGENTS.md`.
- Las claves van solo en `backend/.env` y en las variables de Vercel.
- Una cosa por mensaje: el estudiante pide una tarea a la vez y revisa el resultado antes de seguir.
