---
description: Fase 3 · Arma el plan técnico sin código, ligado a cada requisito (ej. /plan 001-catalogo)
---
Leé `specs/$1/spec.md` (tiene que estar **aprobada**), `docs/CONSTITUCION.md`, `docs/04-ARQUITECTURA.md`, `docs/05-DATOS.md` y `DESIGN.md`.

Creá `specs/$1/plan.md` **sin código**, con:

1. **Resumen:** cómo se va a construir, en 4 o 5 líneas.
2. **Por requisito:** una tabla `Requisito | Qué se hace | Archivos (crear o modificar) | Test que lo prueba`.
3. **API y datos:** rutas, qué reciben y qué devuelven, y qué tablas usan.
4. **Componentes y pantallas:** cuáles, y qué estados muestran (carga, vacío, error).
5. **Riesgos:** qué puede salir mal y cómo se evita.

Usá solo dependencias de `03-TECNOLOGIAS.md`. Explicame el plan en lenguaje simple y esperá mi aprobación.
