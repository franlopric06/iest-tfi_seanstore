---
description: Fase 1 · Escribe la spec de una funcionalidad en notación EARS (ej. /spec 001-catalogo RF01 RF02 RF04)
---
La primera palabra de $ARGUMENTS es la carpeta de la spec (ej. 001-catalogo); en /implementar la segunda es la tarea (ej. T01); en /spec y /cambio, el resto es la descripción.

Vamos a escribir la spec de la funcionalidad de la carpeta indicada en $ARGUMENTS. Requisitos de origen: el resto de $ARGUMENTS (ej. RF01 RF02 RF04).

1. Leé con la herramienta de lectura: `docs/CONSTITUCION.md`, `memory.md`, `docs/02-REQUERIMIENTOS.md`, `DESIGN.md` y los `docs/` que tengan que ver con estos RF.
2. **Entrevistame antes de escribir.** Haceme entre 3 y 6 preguntas cortas sobre lo que no esté claro en los documentos (comportamiento, datos, casos raros). Esperá mis respuestas.
3. Con mis respuestas, creá `specs/$ARGUMENTS/spec.md` con esta estructura:

```markdown
# Spec $ARGUMENTS · <nombre>

**RF de origen:** … · **Estado:** borrador · **Fecha:** …

## Contexto
Para qué sirve esta funcionalidad y para quién (3 a 5 líneas).

## Historias de usuario
- Como <cliente/negocio>, quiero <…>, para <…>.

## Requisitos (EARS)
| ID | Tipo | Requisito | Prioridad |
| --- | --- | --- | --- |
| R1 | Por evento | Cuando <disparador>, el sistema deberá <respuesta>. | Alta |

## Casos límite
- Qué pasa si no hay datos, si falla la API, si el texto es muy largo, en celular, sin conexión…

## Fuera de alcance
- Lo que esta funcionalidad NO hace (incluye lo de la versión 2).

## Criterios de finalización
- [ ] Todos los requisitos Alta cumplen en `verificacion.md`.
- [ ] Tests en verde y build sin errores.
- [ ] Revisado con la skill `revisar-marca`.

## Historial de cambios
| Fecha | Cambio | Motivo |
| --- | --- | --- |
```

**Notación EARS** (usá estos moldes, uno por requisito, y cada requisito tiene que poder probarse):
- Ubicuo: «El sistema deberá …»
- Por evento: «Cuando …, el sistema deberá …»
- Por estado: «Mientras …, el sistema deberá …»
- Opcional: «Donde …, el sistema deberá …»
- No deseado: «Si …, entonces el sistema deberá …»

No escribas código. Al terminar, mostrame la spec y decime qué partes conviene que revise.
