# Sean's Store · Tienda online

Tienda online de **Sean's Store**, un negocio de sublimación y productos personalizados de Tinogasta, Catamarca. La primera etapa es una tienda de demostración: el cliente ve los productos con su precio, elige uno y lo pide por WhatsApp con un mensaje armado, un asistente responde las dudas frecuentes y un panel chico permite editar los datos. La documentación de `docs/` describe la tienda completa y `ETAPA-1.md` dice qué se construye ahora.

Trabajo Final Integrador de **Inteligencia Artificial** · Tecnicatura Superior en Desarrollo de Software · IEST Tinogasta · 2026
Autor: Francisco Ricardo Lopez · Docente: Prof. Ana Camila Barrionuevo

## Enlaces

| | |
| --- | --- |
| Sitio publicado | https://sean-store.vercel.app |
| API | https://sean-store-api.vercel.app |
| Video promocional | `[se completa al subirlo]` |
| Video demo | `[se completa al subirlo]` |

## Cómo se desarrolló

Con agentes de IA (OpenCode en VS Code) siguiendo **Spec-Driven Development**: constitución → spec en EARS → clarificación → plan → tareas → implementación con tests → verificación → cambio. Cada funcionalidad tiene su carpeta en `specs/` con la evidencia de cada fase, y los errores de la IA están registrados en `docs/PROMPTS.md`.

## Tecnologías

React + Vite + Tailwind CSS v4 + Motion · Node.js + Express · PostgreSQL (Neon) · Vitest · Vercel

## Estructura

| Carpeta o archivo | Contenido |
| --- | --- |
| `AGENTS.md`, `CLAUDE.md`, `memory.md` | Arnés del agente: reglas, y memoria del proyecto |
| `.opencode/commands/` | Comandos `/spec`, `/clarificar`, `/plan`, `/tareas`, `/implementar`, `/verificar` y `/cambio` |
| `.agents/skills/` | Skills `verificar-criterios`, `revisar-marca` y `registrar-error-ia` |
| `ETAPA-1.md` | Qué se construye en la primera etapa (manda sobre `docs/` si algo choca) |
| `docs/` | Constitución, especificación del negocio (01 a 10), marca, prompts y declaración de uso de IA |
| `specs/` | Una carpeta por funcionalidad con su ciclo SDD |
| `DESIGN.md`, `diseno/`, `marca/` | Diseño aprobado, prototipos y logos |
| `frontend/`, `backend/` | Código de la tienda y de la API, con sus tests |
| `multimedia/` | Imágenes, video y gráficos hechos con IA, con sus fichas |

## Cómo correrlo en tu computadora

```bash
# API
cd backend
npm install
cp .env.ejemplo .env   # completar DATABASE_URL
npm run dev

# Tienda (en otra terminal)
cd frontend
npm install
npm run dev
```

Tests: `npm test` dentro de `frontend/` o de `backend/`.
