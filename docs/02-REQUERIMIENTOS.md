# 02 · Requerimientos

Prioridad: **Alta** = entra en la **versión 1** (la del TFI) y tiene que estar implementado y validado · **Media** = segunda etapa · **Baja** = puede venir después.

## Versión 1 (TFI · octubre 2026)

La primera versión publicada es una **vidriera online con pedido por WhatsApp**: el cliente ve el catálogo, elige el producto y lo pide por WhatsApp con un mensaje armado, y un asistente le responde las dudas frecuentes. Los pagos online, el carrito, las cuentas, los emails y el panel quedan para la **versión 2**.

| Funcionalidad | Carpeta | RF |
| --- | --- | --- |
| Inicio, catálogo y detalle del producto | `specs/001-catalogo/` | RF01, RF02, RF04 |
| Pedido por WhatsApp ("Tengo mi diseño" / "No tengo diseño") | `specs/002-pedido-whatsapp/` | RF07, RF24 |
| Asistente de preguntas frecuentes | `specs/003-asistente/` | RF25 |

**Por qué este recorte:** el negocio hoy vende por WhatsApp, así que la versión 1 mejora lo que ya funciona (mostrar todo lo que se puede personalizar y ordenar las consultas) sin manejar dinero todavía. Los RF que antes eran de prioridad Alta y pasaron a la versión 2 están marcados con **(v2)**.

## Requerimientos funcionales

### Tienda

| ID | Requerimiento | Prioridad |
| --- | --- | --- |
| RF01 | Inicio según `DESIGN.md`: portada, franja de categorías y sellos, "Elegí qué personalizar", productos destacados, "Así de fácil" y "¿No tenés diseño?" (trabajos, reseñas y promociones aparecen cuando haya datos reales) | Alta |
| RF02 | Catálogo con filtro por categoría | Alta |
| RF03 | Buscador por nombre y orden por precio, novedad o más vendidos | Media |
| RF04 | Detalle del producto con varias fotos, precio, precio anterior tachado si está en oferta, stock, talle, color y cantidad | Alta |
| RF05 | Guía de talles en los productos que la tengan (remeras, buzos, camperas, canilleras) | Media |
| RF06 | "Tengo mi diseño": subir una imagen PNG o JPG de hasta 5 MB, obligatoria para comprar online | Media (v2) |
| RF07 | Pedido por WhatsApp desde el producto: el cliente elige "Tengo mi diseño" o "No tengo diseño", cuenta su idea, se guarda la consulta y se abre WhatsApp con un mensaje armado (el detalle se define en `specs/002-pedido-whatsapp/`) | Alta |
| RF08 | Galería de trabajos realizados, filtrable por tipo de producto | Media |
| RF09 | Página "Equipos y egresados" con formulario de presupuesto por cantidad | Media |
| RF10 | Favoritos: guardar productos para después (requiere cuenta) | Baja |

### Compra

| ID | Requerimiento | Prioridad |
| --- | --- | --- |
| RF11 | Carrito: agregar, quitar y cambiar cantidades, con subtotal | Media (v2) |
| RF12 | Checkout en 3 pasos (tus datos, entrega, pago), como invitado o con cuenta | Media (v2) |
| RF13 | Entrega: retiro en el local o envío a domicilio (con dirección) | Media (v2) |
| RF14 | Pago con Mercado Pago dentro de la página (tarjeta, débito y dinero en cuenta) | Media (v2) |
| RF15 | Opción "Pagar al retirar en el local" | Media |
| RF16 | Verificar stock antes de pagar y descontarlo cuando se confirma el pago | Media (v2) |
| RF17 | Confirmación con código de pedido (ej. `SS-0042`) en pantalla y por email | Media (v2) |
| RF18 | Seguimiento del pedido con código + email, con línea de tiempo de estados | Media |
| RF19 | Email automático en cada cambio de estado del pedido | Media |

### Cuenta del cliente

| ID | Requerimiento | Prioridad |
| --- | --- | --- |
| RF20 | Registro e inicio de sesión con email y contraseña, con botón para mostrar u ocultar la contraseña | Media |
| RF21 | Recuperar contraseña: "Olvidé mi contraseña" → email con link que vence en 1 hora → nueva contraseña | Media (v2) |
| RF22 | "Mis pedidos" con el estado de cada uno | Media |
| RF23 | "Mis datos": editar nombre, teléfono y dirección, y cambiar la contraseña | Baja |

### Atención

| ID | Requerimiento | Prioridad |
| --- | --- | --- |
| RF24 | Botón flotante de WhatsApp en todas las páginas de la tienda | Alta |
| RF25 | Asistente de preguntas frecuentes: burbuja que responde dudas de la tienda y deriva a WhatsApp si no encuentra respuesta | Alta |
| RF26 | Página de contacto con horarios, dirección, mapa y WhatsApp | Media |

### Confianza

| ID | Requerimiento | Prioridad |
| --- | --- | --- |
| RF27 | Reseñas verificadas con estrellas (1 a 5): solo de compradores, con etiqueta "Compra verificada" y moderadas antes de publicarse | Media |
| RF28 | Email invitando a dejar la reseña 5 días después de que el pedido se marca como entregado | Baja |
| RF29 | Testimonios reales cargados por el negocio, con permiso del cliente y etiqueta "Testimonio de cliente" | Baja |
| RF30 | Franja de medios de pago y sellos de confianza (pago seguro, envíos, atención por WhatsApp) | Media |
| RF31 | Barra de promociones y avisos editable desde el panel, con fecha de inicio y fin | Media |

### Legal

| ID | Requerimiento | Prioridad |
| --- | --- | --- |
| RF32 | Páginas de términos y condiciones, política de privacidad y cambios y devoluciones | Media (v2) |
| RF33 | Botón de arrepentimiento en el pie de todas las páginas, con formulario que genera un código de trámite y avisa por email | Media (v2) |

### Panel de administración

| ID | Requerimiento | Prioridad |
| --- | --- | --- |
| RF34 | Ingreso solo para usuarios con rol administrador | Media (v2) |
| RF35 | Productos: crear, editar, pausar y borrar, con varias fotos, precio, precio anterior, stock, talles, colores, guía de talles y "destacado" | Media (v2) |
| RF36 | Pedidos: lista con filtros por estado, detalle con los diseños para descargar y cambio de estado (dispara el email) | Media (v2) |
| RF37 | Consultas: presupuestos, "no tengo diseño" y arrepentimientos, con marca de "atendida" | Media |
| RF38 | Contenido: preguntas del asistente, promociones, medios de pago y galería de trabajos | Media |
| RF39 | Reseñas: aprobar, ocultar y destacar; cargar testimonios | Media |
| RF40 | Usuarios y ventas: lista de clientes con sus compras y métricas (ventas del mes, más vendidos, pedidos por estado) | Media |

### Medición

| ID | Requerimiento | Prioridad |
| --- | --- | --- |
| RF41 | Estadísticas de visitas de la tienda (no del panel) | Baja |

## Historias de usuario

### Comprar con diseño propio

> Como cliente, quiero subir la foto para mi taza, pagarla online y retirarla en el local, para no tener que ir dos veces ni explicar todo por mensaje.

- [ ] Puedo elegir el producto, la cantidad y subir mi imagen.
- [ ] El carrito muestra el subtotal y el total se calcula solo.
- [ ] En el checkout elijo "Retiro en el local" y no me pide dirección.
- [ ] Pago con Mercado Pago sin salir de la página.
- [ ] Veo mi código de pedido y me llega un email de confirmación.
- [ ] El pedido aparece como **pagado** en el panel del negocio.
- [ ] Si un producto se quedó sin stock, me avisa antes de pagar.

### Cliente sin diseño

> Como cliente, quiero una taza personalizada pero no tengo el diseño, así que quiero hablar con alguien que me ayude a armarlo.

- [ ] En el detalle del producto puedo elegir "No tengo diseño".
- [ ] El botón "Agregar al carrito" se reemplaza por "Consultar por WhatsApp".
- [ ] Hay un campo opcional para contar mi idea (hasta 500 caracteres).
- [ ] Al tocar el botón se abre WhatsApp con el producto, talle, color, cantidad y mi idea ya escritos.
- [ ] La consulta queda guardada en el panel aunque yo no mande el mensaje.

### Recuperar la contraseña

> Como cliente, me olvidé la contraseña y quiero volver a entrar a mi cuenta.

- [ ] En "Iniciar sesión" hay un enlace "Olvidé mi contraseña".
- [ ] Pongo mi email y siempre veo el mismo mensaje, exista o no la cuenta.
- [ ] Me llega un email con un link que sirve una sola vez y vence en 1 hora.
- [ ] Elijo una contraseña nueva (mínimo 8 caracteres) y puedo entrar.

### Dejar una reseña

> Como cliente que ya recibió su pedido, quiero contar cómo me quedó.

- [ ] Me llega un email 5 días después de la entrega con un link para opinar.
- [ ] Solo puedo opinar sobre productos que compré, una vez por producto y pedido.
- [ ] Elijo de 1 a 5 estrellas y puedo escribir un comentario de hasta 500 caracteres.
- [ ] Mi reseña se publica cuando el negocio la aprueba, con la etiqueta "Compra verificada".

### Pedir arrepentimiento

> Como cliente, me arrepentí de una compra y quiero cancelarla.

- [ ] Veo el botón "Botón de arrepentimiento" en el pie de cualquier página.
- [ ] Completo código de pedido, nombre, email y motivo (opcional).
- [ ] Recibo en pantalla y por email un código de trámite (ej. `ARR-0007`).
- [ ] El pedido aparece en Consultas del panel como arrepentimiento pendiente.

## Requerimientos no funcionales

- **RNF01 · Responsive:** se ve y funciona bien desde 360 px (celular) hasta escritorio.
- **RNF02 · Velocidad y calidad:** cada página carga en menos de 2 segundos con buena conexión; Lighthouse de 80 o más en Rendimiento, Accesibilidad, Buenas prácticas y SEO (meta: 90 en celular).
- **RNF03 · Accesibilidad:** contraste suficiente, textos alternativos, navegación con teclado y etiquetas en todos los campos.
- **RNF04 · Identidad:** usa solo los colores, fuentes y logos de `IDENTIDAD-MARCA.md`.
- **RNF05 · Seguridad:** contraseñas con hash, pagos confirmados por el servidor y claves fuera del navegador (ver `10-SEGURIDAD.md`).
- **RNF06 · Confiabilidad:** ningún pedido pagado se pierde, aunque el cliente cierre la página.
- **RNF07 · Honestidad:** reseñas y testimonios siempre reales; nada de contadores ni opiniones inventadas.
- **RNF08 · Mantenimiento:** código ordenado, un componente por archivo, todo en español.
- **RNF09 · Estados claros:** toda pantalla que carga datos muestra estado de carga, vacío y error (ver `06-DISENO-UI.md`).
- **RNF10 · Diseño profesional:** diseño propio y actual, con animaciones y microinteracciones según la dirección de diseño y el sistema de movimiento de `06-DISENO-UI.md`, fluidas en celular y desactivables con "reducir movimiento".
- **RNF11 · Tests:** cada RF de prioridad Alta tiene tests automáticos en verde (`npm test`) y el build termina sin errores.
- **RNF12 · Transparencia:** toda imagen, video o gráfico hecho con IA lleva la leyenda «Generado con IA» en el sitio.
