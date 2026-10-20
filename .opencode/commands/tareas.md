---
description: Fase 4 · Divide el plan en tareas de menos de 30 minutos (ej. /tareas 001-catalogo)
---
La primera palabra de $ARGUMENTS es la carpeta de la spec (ej. 001-catalogo); en /implementar la segunda es la tarea (ej. T01); en /spec y /cambio, el resto es la descripción.

Leé `specs/$ARGUMENTS/plan.md` (aprobado) y `specs/$ARGUMENTS/spec.md`.

Creá `specs/$ARGUMENTS/tasks.md` con tareas de **menos de 30 minutos**, en orden, empezando por los tests:

```markdown
# Tareas $ARGUMENTS

- [ ] **T01** · <qué se hace> · Requisito: R1 · Archivos: … · Test: …
  **Listo cuando:** <resultado que se puede comprobar>
```

Reglas: una tarea = un commit; cada tarea nombra su requisito; ninguna tarea toca más de 3 o 4 archivos. Mostrame la lista y esperá mi aprobación.
