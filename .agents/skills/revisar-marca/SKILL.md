---
name: revisar-marca
description: Revisa que los componentes y páginas de Sean's Store respeten la marca y la accesibilidad. Controla colores desde tokens, tipografías, botones, textos alternativos, foco visible, movimiento reducido y textos de relleno. Usar antes de cerrar una tarea de interfaz o en la verificación.
---

# Revisar marca y accesibilidad

Revisa los archivos de `frontend/src` que se indiquen (o todos los que cambiaron en la tarea) y devuelve una lista de problemas con archivo y línea. **No corrige**: propone la corrección.

## Qué revisar

| Tema | Está bien si… | Está mal si… |
| --- | --- | --- |
| Colores | Usa clases del tema: `bg-violeta`, `text-magenta`, `bg-amarillo`, `text-grafito`, `bg-fondo`, `bg-whatsapp` | Aparece `#` con un color, `[#…]`, `rgb(` o colores por defecto (`bg-purple-900`, `text-gray-500`) |
| Tipografías | Títulos con `font-titulos` (Russo One) y textos con `font-textos` (Nunito) | Textos largos en Russo One o fuentes que no son de la marca |
| Amarillo | Lleva texto `text-violeta` | Lleva texto blanco |
| Magenta | Solo en botones de compra, enlaces y "Oferta" | Usado como fondo decorativo |
| Botones | `rounded-marca`, mínimo `min-h-11`, foco visible (`focus-visible:ring-2`) | Botones chicos o sin foco visible |
| Imágenes | Tienen `alt` descriptivo; las decorativas, `alt=""` o `aria-hidden` | Falta `alt` |
| Piezas con IA | Llevan la leyenda «Generado con IA» | No la llevan |
| Movimiento | Usa Motion, anima solo `transform` y `opacity` y respeta `useReducedMotion` | Usa `blur`, anima tamaños o ignora el movimiento reducido |
| Celular | Clases desde celular y después `sm:`, `md:`, `lg:` | El diseño se rompe a 360 px |
| Textos | Español rioplatense (vos), datos reales | "Lorem ipsum", "Producto 1", precios o teléfonos inventados |

## Cómo responder

```markdown
## Revisión de marca · <archivos>
- ✅ Colores
- ❌ `TarjetaProducto.jsx` línea 12: usa `text-gray-500` → cambiar por `text-grafito`
```

Al final, decir cuántos problemas hay y cuáles son graves (accesibilidad o colores fuera de la marca).
