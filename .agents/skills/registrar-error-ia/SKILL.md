---
name: registrar-error-ia
description: Registra en docs/PROMPTS.md un error cometido por la IA que detectó el estudiante, con el problema, cómo se detectó y cómo se corrigió. Usar cuando el estudiante diga que la IA se equivocó o pida anotar un error.
---

# Registrar un error de la IA

El TFI pide documentar los errores de la IA. Esta skill los anota siempre con el mismo formato en `docs/PROMPTS.md`, en la sección "Errores de la IA".

## Pasos

1. Preguntarle al estudiante, si no lo dijo:
   - ¿Qué le pediste a la IA? (el prompt, resumido)
   - ¿Qué hizo mal?
   - ¿Cómo te diste cuenta?
   - ¿Cómo lo corregiste?
   - ¿Cambiaste alguna regla, comando o spec para que no vuelva a pasar?
2. Leer `docs/PROMPTS.md` para saber qué número de error sigue.
3. Agregar al final de "Errores de la IA" un bloque con esta forma, usando las palabras del estudiante:

```markdown
### Error N° X · <título corto>

- **Fecha y fase:** 21/10/2026 · Implementación de 001-catalogo, tarea T04
- **Herramienta:** OpenCode con <modelo>
- **Qué se pidió:** …
- **Qué hizo mal la IA:** …
- **Cómo se detectó:** …
- **Corrección humana:** …
- **Para que no se repita:** …
```

## Reglas

- No suavizar ni inventar: se anota lo que pasó.
- No copiar claves, contraseñas ni datos personales en el registro.
- No modificar los errores anteriores.
