# Spec 002-pedido-whatsapp · Pedido por WhatsApp y botón flotante

**RF de origen:** RF07 (adaptado), RF24 · **Estado:** aprobada · **Fecha:** 26/10/2026

## Contexto

El negocio cierra todas las ventas por WhatsApp: no hay carrito ni pago online en esta etapa. Cuando el cliente eligió el producto en el detalle, necesita una forma directa de contactar al negocio con los datos de su pedido ya escritos, sin copiar y pegar nada. Esta funcionalidad agrega el selector de color, talle y cantidad al detalle (spec 001 mostró esos datos como información; acá se vuelven un formulario), el botón "Pedir por WhatsApp" que arma el mensaje y lo abre en `https://wa.me/`, y el botón flotante de WhatsApp visible en todas las páginas de la tienda. El número de WhatsApp viene de la variable de entorno `VITE_WHATSAPP` (nunca escrito en el código).

## Historias de usuario

- Como cliente, quiero elegir el color, el talle y la cantidad del producto y tocar un botón para que WhatsApp se abra con el pedido ya escrito, para no tener que dictar todo por mensaje.
- Como cliente con stock disponible, quiero que el mensaje ya diga el producto, el color, el talle y la cantidad que elegí, para que el negocio me responda con el precio y los pasos siguientes sin pedirme más datos.
- Como cliente que ve un producto sin stock, quiero poder consultar por disponibilidad sin tener que escribir el mensaje desde cero.
- Como cliente en cualquier página de la tienda, quiero ver un botón de WhatsApp flotante para poder contactar al negocio en cualquier momento.

## Requisitos (EARS)

| ID | Tipo | Requisito | Prioridad |
| --- | --- | --- | --- |
| R1 | Por evento | Cuando el cliente entre a `/producto/:slug`, el sistema deberá mostrar un selector de color (los disponibles del producto), un selector de talle (solo si `talles` no está vacío), un campo de cantidad (entero, mínimo 1, máximo 50, valor inicial 1) y el botón "Pedir por WhatsApp" o "Consultar por WhatsApp" según el stock. (RF07 adaptado) | Alta |
| R2 | Por evento | Cuando el cliente toque "Pedir por WhatsApp" (stock > 0), el sistema deberá abrir `https://wa.me/{VITE_WHATSAPP}?text=…` en una pestaña nueva con el mensaje: "Hola! Quiero pedir: {nombre del producto}, color {color}, talle {talle}, cantidad {cantidad}. ¿Me pasás el precio y cómo seguimos?" — omitiendo la parte del talle si el producto no tiene talles. (RF07 adaptado) | Alta |
| R3 | Por evento | Cuando el cliente toque "Consultar por WhatsApp" (stock = 0), el sistema deberá abrir `https://wa.me/{VITE_WHATSAPP}?text=…` en una pestaña nueva con el mensaje: "Hola! Me interesa {nombre del producto}, color {color}, talle {talle}, cantidad {cantidad}. ¿Tienen disponibilidad?" — omitiendo la parte del talle si el producto no tiene talles. (RF07 adaptado) | Alta |
| R4 | Ubicuo | El sistema deberá mostrar el botón de WhatsApp del detalle con los tokens de la marca `bg-whatsapp` y `text-whatsapp-texto` y el ícono `MessageCircle` de Lucide, con texto "Pedir por WhatsApp" o "Consultar por WhatsApp" según el stock, con un área táctil de al menos 44 px de alto, foco visible y texto alternativo para lectores de pantalla. (RNF03) | Alta |
| R5 | Si | Si `VITE_WHATSAPP` no está definido o está vacío, entonces el sistema no deberá mostrar ni el botón del detalle ni el botón flotante. (RF07 adaptado, RF24) | Alta |
| R6 | Ubicuo | El sistema deberá mostrar un botón flotante de WhatsApp en todas las páginas de la tienda (no en el panel `/admin`), fijo en la esquina inferior derecha, con el ícono `MessageCircle` de Lucide, `aria-label` descriptivo y área táctil de al menos 44 × 44 px. Al tocarlo, deberá abrir `https://wa.me/{VITE_WHATSAPP}?text=…` en una pestaña nueva con el mensaje "Hola! Te escribo desde la tienda, quiero hacer una consulta." (RF24) | Alta |
| R7 | Por estado | Cuando el producto tenga más de un color disponible y el cliente no haya elegido uno, el sistema deberá deshabilitar el botón de WhatsApp del detalle y mostrar debajo del botón, en pequeño, el mensaje de ayuda "Elegí un color para continuar". (RF07 adaptado) | Alta |
| R8 | Ubicuo | El sistema deberá inicializar la cantidad en 1 y no permitir valores fuera del rango 1–50; si el cliente intenta bajar de 1 o subir de 50, el control deberá mantenerse en el límite correspondiente. (RF07 adaptado) | Alta |
| R9 | Donde | Donde el producto tenga más de un talle, el sistema deberá mostrar el selector de talle y, mientras el cliente no elija uno, deshabilitar el botón de WhatsApp del detalle y mostrar debajo del botón, en pequeño, el mensaje de ayuda "Elegí un talle para continuar". (RF07 adaptado) | Alta |
| R10 | Ubicuo | El sistema deberá incluir en el mensaje de WhatsApp el nombre del producto, el color elegido y la cantidad; e incluir el talle solo si el producto tiene talles. Nunca deberá incluir el precio en el mensaje (es de ejemplo y lo confirma el negocio). (RF07 adaptado, RNF07) | Alta |
| R11 | Por estado | Cuando el producto tenga un solo color disponible o un solo talle (incluso "Talle único"), el sistema deberá mostrar esa opción como ya elegida: el botón de WhatsApp no se deshabilita por ese factor y no aparece el mensaje de ayuda correspondiente. (RF07 adaptado) | Alta |

## Casos límite

- **`VITE_WHATSAPP` no definido o vacío:** ni el botón del detalle ni el flotante se muestran. La tienda sigue funcionando normalmente.
- **Color no elegido (con más de un color):** botón deshabilitado y debajo el mensaje "Elegí un color para continuar" (R7). Se habilita solo cuando hay color elegido (y talle, si corresponde).
- **Talle no elegido (con más de un talle):** ídem anterior, con "Elegí un talle para continuar" (R9).
- **Un solo color o un solo talle (o "Talle único"):** la opción única aparece ya elegida y no bloquea el botón (R11).
- **Cantidad fuera de rango:** el control no acepta valores menores a 1 ni mayores a 50; al salir del campo con un valor inválido se corrije al límite más cercano.
- **Stock = 0:** el botón cambia a "Consultar por WhatsApp" y el mensaje pregunta por disponibilidad con color, talle (si hay) y cantidad (R3). El selector de color y cantidad siguen activos; el de talle también si el producto lo tiene.
- **Producto sin talles:** el selector de talle no aparece y la parte "talle {talle}" no se incluye en el mensaje.
- **Nombre del producto largo:** el mensaje de WhatsApp usa el nombre tal como viene de la API, sin truncar.
- **Celular (desde 360 px):** los selectores y el botón deben entrar en una sola columna sin desbordarse; área táctil de 44 px mínimo.
- **Mensaje de WhatsApp con caracteres especiales:** el texto va codificado con `encodeURIComponent` para que el link funcione correctamente.

## Fuera de alcance

- **Guardar la consulta en la base:** RF07 original pide guardar la consulta en `consultas`; en esta etapa no se guarda (se adapta a la tienda de demostración sin usuarios ni sesión). Queda para la siguiente etapa junto con el panel 004.
- **Campo "Tengo mi diseño / No tengo diseño":** el RF07 original incluye un campo para subir el diseño o contar la idea; no entra en esta entrega (requiere Cloudinary y el campo de texto libre de 500 caracteres queda para la tienda completa).
- **Carrito:** no hay carrito ni pago online en esta etapa (`ETAPA-1.md`).
- **Verificar stock antes de enviar:** la tienda es de demostración; se muestra la etiqueta "Sin stock" pero no se bloquea el pedido a nivel de base.
- **Open Graph por producto:** no entra en la primera etapa (decisión 10 de la clarificación de 001).
- **Botón flotante en el panel `/admin`:** cuando exista, el botón flotante no aparece ahí.

## Criterios de finalización

- [ ] Todos los requisitos Alta cumplen en `verificacion.md`.
- [ ] Tests en verde (`npm test` en `frontend/`) y `npm run build` sin errores.
- [ ] Lighthouse de 80 o más en las cuatro categorías.
- [ ] Revisado con la skill `revisar-marca` (tokens, tipografías, foco, `useReducedMotion`).

## Historial de cambios

| Fecha | Cambio | Motivo |
| --- | --- | --- |
| 26/10/2026 | Creación de la spec | Fase 1 del ciclo SDD para 002-pedido-whatsapp; sin entrevista porque el estudiante proveyó todas las decisiones directamente |
| 27/10/2026 | Clarificación cerrada con 8 decisiones. R4: en lugar del token inexistente `bg-verde`, se usan `bg-whatsapp` y `text-whatsapp-texto` (ya en `index.css`), y el ícono es `MessageCircle` de Lucide (no hay ícono de WhatsApp); ídem en el flotante de R6. R7/R9 definidos: mensaje de ayuda fijo debajo del botón ("Elegí un color para continuar" / "Elegí un talle para continuar") y solo bloquea cuando hay más de una opción — un color o talle único viene ya elegido (R11). R3 con mensaje completo: "Hola! Me interesa {producto}, color {color}, talle {talle}, cantidad {cantidad}. ¿Tienen disponibilidad?" (con cantidad y talle, coherente con R2). R6 con mensaje genérico: "Hola! Te escribo desde la tienda, quiero hacer una consulta." | Fase 2 del ciclo SDD: las 8 decisiones del estudiante (`clarificacion.md`) |
