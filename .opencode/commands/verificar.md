---
description: Fase 6 · Valida cada requisito contra código y tests, usando la skill verificar-criterios (ej. /verificar 001-catalogo)
---
La primera palabra de $ARGUMENTS es la carpeta de la spec (ej. 001-catalogo); en /implementar la segunda es la tarea (ej. T01); en /spec y /cambio, el resto es la descripción.

Cargá la skill **verificar-criterios** y seguila al pie de la letra para la funcionalidad de la carpeta indicada en **$ARGUMENTS**.

El resultado va en `specs/$ARGUMENTS/verificacion.md`. No arregles nada durante la verificación: solo informá. Al final decime qué falló, si la falla es del código o de la spec, y qué comando conviene usar después (`/implementar` o `/cambio`).
