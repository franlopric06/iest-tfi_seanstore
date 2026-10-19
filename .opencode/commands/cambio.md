---
description: Fase 7 · Incorpora un requisito nuevo o un cambio: primero la spec, después el código (ej. /cambio 001-catalogo mostrar "Sin stock")
---
Cambio pedido para **$1**: $ARGUMENTS

1. Leé `specs/$1/spec.md`, `plan.md` y `tasks.md`, y `docs/CONSTITUCION.md`.
2. Explicame en pocas líneas qué requisitos, archivos y tests afecta el cambio, y si choca con la constitución o con la versión 1. **Esperá mi ok.**
3. Actualizá **primero** `spec.md` (requisito nuevo o modificado en EARS + fila en "Historial de cambios" con fecha y motivo), después `plan.md`, y agregá las tareas nuevas en `tasks.md`.
4. Recién ahí implementá las tareas nuevas como en `/implementar`: test primero, tests y build en verde, explicación de cada archivo y un commit por tarea con mi ok.
5. Anotá el cambio en "Decisiones" de `memory.md`.
