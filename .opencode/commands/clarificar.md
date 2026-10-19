---
description: Fase 2 · Revisa la spec como QA y registra las decisiones del estudiante (ej. /clarificar 001-catalogo)
---
Actuá como **QA** y revisá `specs/$1/spec.md` (leelo con la herramienta de lectura, junto con `docs/CONSTITUCION.md`).

1. Buscá: requisitos ambiguos o que no se pueden probar, contradicciones con los `docs/` o con la constitución, casos límite que faltan, datos que no sabemos de dónde salen, y cosas de la versión 2 que se colaron.
2. Creá `specs/$1/clarificacion.md`:

```markdown
# Clarificación $1

| N° | Hallazgo | Pregunta | Opciones | Decisión del estudiante |
| --- | --- | --- | --- | --- |
| 1 | … | … | A) … B) … | (pendiente) |
```

3. Preguntame los hallazgos **de a uno**, con tus opciones y cuál recomendás. Anotá mi decisión con mis palabras.
4. Cuando estén todos decididos, actualizá `spec.md` según las decisiones (y anotalo en su "Historial de cambios") y cambiá su estado a **aprobada**.

No escribas código.
