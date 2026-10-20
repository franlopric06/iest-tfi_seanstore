---
description: Fase 5 · Implementa UNA tarea con test primero y propone el commit (ej. /implementar 001-catalogo T03)
---
La primera palabra de $ARGUMENTS es la carpeta de la spec (ej. 001-catalogo); en /implementar la segunda es la tarea (ej. T01); en /spec y /cambio, el resto es la descripción.

Vamos a hacer **solo la tarea que indican $ARGUMENTS** (carpeta + código, ej. `/implementar 001-catalogo T03`), que vive en `specs/<carpeta>/tasks.md`.

1. Leé la tarea, su requisito en `spec.md`, el `plan.md` y los archivos que vas a tocar.
2. Decime en 3 líneas qué vas a hacer y en qué archivos. **Esperá mi ok.**
3. Escribí primero el test y corrélo (tiene que fallar).
4. Escribí el código mínimo para que pase. Respetá `docs/CONSTITUCION.md` y `AGENTS.md`.
5. Corré `npm test` y `npm run build` y mostrame el resultado.
6. Explicame cada archivo que cambió en lenguaje simple (qué hace y por qué), para que lo pueda defender.
7. Marcá la tarea con `[x]`, actualizá "Estado actual" en `memory.md` y proponé el mensaje del commit (`<carpeta>-<tarea> …`, según `07-CONVENCIONES.md`). Hacé el commit **solo cuando te diga ok**.

Si para hacer la tarea hace falta algo que no está en la spec, frená y proponé usar `/cambio`.
