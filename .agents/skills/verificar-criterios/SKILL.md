---
name: verificar-criterios
description: Verifica una funcionalidad de Sean's Store contra su spec. Revisa cada requisito EARS de specs/NNN/spec.md, busca el test y el código que lo cumplen, corre los tests y escribe specs/NNN/verificacion.md marcando cumple, no cumple o prueba manual pendiente. Usar en la fase de validación (/verificar).
---

# Verificar criterios

Sirve para comprobar, requisito por requisito, que lo construido cumple la spec. **No arregla nada**: solo informa.

## Pasos

1. **Leer** con la herramienta de lectura `specs/NNN/spec.md`, `specs/NNN/tasks.md` y `docs/CONSTITUCION.md`.
2. **Correr los tests** en `frontend/` y en `backend/` (`npm test`) y el build (`npm run build`). Guardar el resumen: cuántos tests pasan y cuántos fallan.
3. **Por cada requisito** de la tabla "Requisitos (EARS)":
   - Buscar el test que lo prueba (archivo y nombre del test).
   - Buscar el código que lo implementa (archivo y función o componente).
   - Decidir el resultado:
     - **Cumple:** hay un test que lo prueba y pasa.
     - **No cumple:** no hay código, el test falla o el código hace otra cosa.
     - **Prueba manual pendiente:** no se puede probar con un test automático (por ejemplo, que la animación se vea fluida o que se abra WhatsApp en el celular). Indicar el paso exacto para probarlo a mano.
   - Si no cumple, decir si la falla es **del código** (la spec está bien y el código no la sigue) o **de la spec** (el requisito está mal escrito, es imposible o contradice otra cosa).
4. **Revisar los criterios de finalización** de la spec y los principios 2, 3, 5 y 6 de la constitución.
5. **Escribir** `specs/NNN/verificacion.md` con la plantilla de abajo.

## Plantilla de verificacion.md

```markdown
# Verificación NNN · <nombre>

**Fecha:** … · **Tests:** frontend X/Y en verde · backend X/Y en verde · **Build:** ok / con errores

| Requisito | Resultado | Evidencia (test y archivo) | Si falla: ¿código o spec? |
| --- | --- | --- | --- |
| R1 | Cumple | `tests/Catalogo.test.jsx` › "filtra por categoría" | — |
| R2 | Prueba manual pendiente | Paso: abrir en celular y tocar… | — |

## Criterios de finalización
- [x] …

## Constitución
- Principio 2 (tokens de marca): ok / problemas encontrados
- Principio 3 (capas): …
- Principio 5 (tests): …
- Principio 6 (seguridad): …

## Pruebas manuales que tiene que hacer el estudiante
1. …

## Conclusión
Cumplen X de Y requisitos Alta. Próximo paso: …
```

## Reglas

- Nunca marcar "Cumple" sin un test que pase o, en una prueba manual, sin que el estudiante confirme que la hizo.
- Copiar los nombres de archivos y tests tal cual existen; no inventarlos.
