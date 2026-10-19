# 06 · Diseño de la interfaz

Todo sale de `IDENTIDAD-MARCA.md`: fondo **Blanco algodón**, marca en **Violeta Sean**, compra en **Magenta tinta** y ofertas en **Amarillo calor**. Títulos en **Russo One**, textos en **Nunito**. Los datos que el negocio todavía no definió aparecen como `[a completar]` y nunca se inventan.

## Dirección de diseño

La tienda tiene que verse **profesional, actual y con personalidad propia**, no como una plantilla genérica de e-commerce. La idea que guía todo es **"el taller de sublimación"**: la tinta, el calor de la plancha y el producto en blanco que se transforma con un diseño.

> **El diseño aprobado de la página de inicio, sección por sección y con sus animaciones exactas, está en `DESIGN.md`** (en la raíz del proyecto), junto con los prototipos de `diseno/`. Si algo de este archivo choca con `DESIGN.md`, manda `DESIGN.md`.

### Principios

1. **El producto es el protagonista.** Fotos grandes, limpias, sobre fondo claro. Todo lo demás acompaña.
2. **La diagonal de la marca.** El logo es inclinado, así que la tienda repite esa inclinación: franjas y separadores de sección inclinados (`-skew-y-2`), títulos grandes en Russo One y la línea amarilla del logo como subrayado de los títulos de sección.
3. **Un solo momento "wow" por pantalla.** En lugar de animar todo, cada pantalla tiene un momento principal bien hecho (ver "Momentos clave") y el resto es tranquilo y prolijo.
4. **El movimiento responde a lo que hace el cliente.** Agregar al carrito, subir un diseño, abrir el asistente o cambiar de paso en el checkout siempre tienen una respuesta visual clara.
5. **Rápida y accesible.** Las animaciones nunca frenan la carga ni la lectura, y se desactivan si la persona pidió reducir el movimiento.

### Momentos clave

| Dónde | Qué pasa |
| --- | --- |
| Portada (`HeroSublimado`) | "Tu diseño en vivo": fondo violeta con tinta magenta que chorrea y una remera blanca cuyo pecho cambia cada 3 s entre 4 diseños (foto, número, frase y logo), sincronizada con los chips "Tu foto / Tu número / Tu frase / Tu logo". Detalle en `DESIGN.md`. |
| Franja de categorías (`FranjaCategorias`) | Bloque inclinado: arriba una cinta magenta con las categorías que se desplaza en loop (se pausa al pasar el mouse o al tocarla) y abajo los sellos de confianza en una banda blanca. |
| "Elegí qué personalizar" (`CintaProductos`) | Cinta de producción dentro de un paralelogramo violeta: tazas, remeras, gorras, termos y canilleras pasan en diagonal y se estampan en el centro con anillos de calor y gotas de tinta. |
| Detalle del producto | Al subir el diseño, la imagen "vuela" desde la zona de carga y se apoya sobre la foto del producto en la `VistaPreviaDiseno` (vista plana e ilustrativa, no un editor). |
| Agregar al carrito | Una miniatura del producto viaja hasta el ícono del carrito, el contador amarillo "rebota" y se abre el `CarritoLateral` desde la derecha. |
| Checkout | Los pasos se deslizan hacia los costados y la barra de progreso se llena en magenta. Al aprobarse el pago, un check animado y una lluvia corta de "gotas de tinta" de los colores de marca. |
| Seguimiento | La línea de tiempo se va completando hasta el estado actual. |
| Asistente | La burbuja se abre como un globo desde el ícono y las respuestas aparecen con el efecto de "escribiendo…". |

### Sistema de movimiento

| Tipo | Animación | Duración y curva |
| --- | --- | --- |
| Microinteracción de botón | Al pasar: sube 2 px y aumenta la sombra. Al tocar: se achica a 97% | 150 ms, `easeOut` |
| Tarjeta de producto | Al pasar: sube 6 px, sombra elevada, foto con zoom a 105% | resorte (`stiffness: 300, damping: 22`) |
| Entrada de contenido | Aparece con opacidad y 16 px de desplazamiento, **solo** en la portada y en el detalle | 400 ms, `easeOut`, una vez |
| Cambio de página | Fundido cruzado con desplazamiento de 8 px (`TransicionPagina`) | 250 ms |
| Paneles (carrito, menú, asistente) | Se deslizan desde su borde con fondo oscurecido | resorte (`stiffness: 260, damping: 30`) |
| Carga | Esqueletos grises con un brillo que recorre de izquierda a derecha | 1,4 s en loop |

**Reglas:**

- Se animan solo `transform` y `opacity` (nunca `width`, `height`, `top` ni `filter: blur`), para que vaya a 60 cuadros por segundo en celulares.
- En celular nada se agranda más de su tamaño real (`scale` máximo 1), para que no se vea borroso.
- **No se agregan efectos nuevos** a los definidos acá y en `DESIGN.md` sin preguntar: la tienda no tiene que verse recargada.
- Todo componente animado usa `useReducedMotion` de Motion: si la persona pidió reducir el movimiento, se muestra el estado final sin animación.
- El contenido nunca espera a una animación para poder leerse o tocarse.
- Nada de animaciones en el panel de administración más allá de las microinteracciones de botones y la apertura de paneles.

### Escala tipográfica

| Uso | Clases de Tailwind |
| --- | --- |
| Título de portada (H1) | `font-titulos text-5xl md:text-7xl leading-none -skew-x-6` |
| Título de sección (H2) | `font-titulos text-3xl md:text-4xl` + subrayado amarillo inclinado |
| Título de tarjeta (H3) | `font-titulos text-lg` |
| Texto | `font-textos text-base leading-relaxed`, máximo `max-w-prose` |
| Ayudas y leyendas | `text-sm text-grafito` |

### Fondo y superficies

- Fondo general `bg-fondo`; tarjetas `bg-white` con `shadow-tarjeta`.
- Secciones alternadas: una clara y, cada tanto, una franja inclinada `bg-violeta` con texto blanco (testimonios, equipos y egresados, footer).
- Header fijo arriba que, al bajar, se achica y toma fondo `bg-violeta/90` con `backdrop-blur-md`.
- No se usan degradados como fondo decorativo. La tinta de la portada, las gotas de la cinta y las de la confirmación de pago son de colores planos de la marca.

## Pantallas de la tienda

| Ruta | Pantalla | Qué muestra |
| --- | --- | --- |
| `/` | Inicio | En este orden (ver `DESIGN.md`): portada "Tu diseño en vivo", franja de categorías + sellos, "Elegí qué personalizar" con la cinta, "Los más pedidos", "Así de fácil", "¿No tenés diseño?", trabajos realizados, reseñas destacadas y footer |
| `/catalogo` | Catálogo | Filtro por categoría, buscador, orden y grilla de productos |
| `/catalogo/:categoria` | Catálogo filtrado | Igual, con la categoría elegida (URL propia para SEO) |
| `/producto/:slug` | Detalle | Galería de fotos, precio (y anterior tachado), stock, talle con "Ver guía de talles", color, cantidad, opción de diseño, botón favorito, descripción y reseñas |
| `/carrito` | Carrito | Ítems con miniatura del diseño, subtotal y "Ir a pagar" |
| `/checkout` | Checkout | 3 pasos: tus datos → entrega → pago, con el resumen siempre visible |
| `/pago/resultado` | Resultado | Aprobado, pendiente o rechazado, con el código del pedido |
| `/seguimiento` | Seguimiento | Código + email y una línea de tiempo con los estados |
| `/trabajos` | Trabajos realizados | Galería filtrable por tipo, con visor a pantalla completa |
| `/equipos-egresados` | Equipos y egresados | Ejemplos de trabajos por cantidad y formulario de presupuesto |
| `/contacto` | Contacto | Horarios, dirección, mapa incrustado y botón de WhatsApp |
| `/arrepentimiento` | Botón de arrepentimiento | Formulario y explicación breve |
| `/resena/:token` | Dejar reseña | Productos del pedido con estrellas y comentario |
| `/terminos`, `/privacidad`, `/cambios-y-devoluciones` | Legales | Texto con títulos por sección |
| `*` | No encontrada | "No encontramos esta página" y botón al catálogo |

## Pantallas de cuenta

| Ruta | Pantalla | Qué muestra |
| --- | --- | --- |
| `/ingresar` | Iniciar sesión | Email, contraseña con ojito, "Olvidé mi contraseña" y enlace a registro |
| `/registro` | Registro | Nombre, email, teléfono, contraseña con ojito y aceptación de términos |
| `/olvide-contrasena` | Olvidé mi contraseña | Campo email y el mensaje "Si el email está registrado, te mandamos un link" |
| `/nueva-contrasena/:token` | Nueva contraseña | Contraseña nueva y repetir, con ojito |
| `/mi-cuenta/pedidos` | Mis pedidos | Lista con código, fecha, total y estado |
| `/mi-cuenta/datos` | Mis datos | Nombre, teléfono, dirección y cambio de contraseña |
| `/mi-cuenta/favoritos` | Favoritos | Grilla de productos guardados |

## Pantallas del panel (solo admin)

| Ruta | Pantalla | Qué muestra |
| --- | --- | --- |
| `/admin` | Resumen | Ventas del mes, cantidad de pedidos por estado, 5 más vendidos, consultas sin atender |
| `/admin/pedidos` | Pedidos | Tabla con filtros por estado; los pagados sin producir arriba |
| `/admin/pedidos/:id` | Detalle de pedido | Cliente, entrega, ítems con los diseños para descargar y selector de estado |
| `/admin/productos` | Productos | Foto, precio, stock y activo; aviso amarillo si el stock es menor a 5 |
| `/admin/productos/nuevo` y `/:id` | Formulario de producto | Nombre, categoría, precio, precio anterior, stock, talles, colores, guía de talles, destacado y varias fotos (arrastrar para ordenar) |
| `/admin/consultas` | Consultas | Pestañas: "No tengo diseño", Presupuestos, Arrepentimientos; botón "Responder por WhatsApp" y "Marcar atendida" |
| `/admin/resenas` | Reseñas | Pendientes primero; botones Aprobar, Ocultar y Destacar |
| `/admin/testimonios` | Testimonios | Alta con texto, origen y casilla obligatoria "Tengo permiso del cliente" |
| `/admin/preguntas` | Preguntas del asistente | Pregunta, respuesta, palabras clave, orden y activa |
| `/admin/promociones` | Promociones | Texto, enlace, desde, hasta y activa |
| `/admin/medios-pago` | Medios de pago | Nombre, ícono, orden y activo |
| `/admin/galeria` | Galería de trabajos | Subir fotos, título, tipo, destacado y orden |
| `/admin/usuarios` | Usuarios y ventas | Clientes con cantidad de compras, total gastado y última compra |

El panel usa la misma marca, pero más sobrio: fondo blanco, menú lateral Violeta Sean y tablas simples. En celular el menú se abre con un botón.

## Estructura general de la tienda

- **Barra de promociones** (arriba de todo): fondo Amarillo calor, texto Violeta Sean, una promo a la vez que rota cada 5 segundos. Se oculta si no hay promociones vigentes.
- **Header:** fijo; fondo Violeta Sean (al bajar, `bg-violeta/90` con desenfoque), logo negativo a la izquierda, menú (Catálogo, Trabajos, Equipos y egresados, Contacto), ícono de cuenta, favoritos y carrito con contador amarillo. En celular, menú hamburguesa.
- **Footer:** fondo Violeta Sean con isotipo, horarios `[a completar]`, redes, franja de medios de pago, enlaces legales y el **"Botón de arrepentimiento"** bien visible.
- **Botón flotante de WhatsApp:** círculo `bg-whatsapp` abajo a la derecha, en todas las páginas de la tienda (no en el panel ni en el checkout). Abre WhatsApp con "Hola, Sean's Store. Quería hacer una consulta."
- **Asistente:** burbuja violeta abajo a la derecha, encima del botón de WhatsApp.

## Componentes

### Botones

| Tipo | Fondo | Texto | Uso |
| --- | --- | --- | --- |
| Primario | `bg-magenta` | `text-white font-titulos` | "Agregar al carrito", "Ir a pagar", "Pagar" |
| Secundario | Transparente, `border-2 border-violeta` | `text-violeta` | "Seguir comprando", "Ver detalle" |
| WhatsApp | `bg-whatsapp` | `text-whatsapp-texto` (verde oscuro, para que se lea bien), con ícono | "Consultar por WhatsApp", botón flotante |
| Deshabilitado | `bg-gris-claro` | `text-grafito` | Sin stock o falta elegir talle o diseño |

Todos con `rounded-marca`, mínimo 44 px de alto (`min-h-11`, fácil de tocar), foco visible con `focus-visible:ring-2 ring-magenta ring-offset-2` y la microinteracción de botón del sistema de movimiento.

### Tarjeta de producto

- Fondo blanco, `shadow-tarjeta` (pasa a `shadow-elevada` con hover), foto cuadrada arriba que hace un zoom suave al pasar el mouse.
- Etiqueta **"Personalizable"** en Amarillo calor con texto Violeta Sean.
- Si está en oferta: etiqueta magenta **"Oferta"** y precio anterior tachado en gris.
- Si no hay stock: etiqueta gris **"Sin stock"** y botón deshabilitado.
- Promedio de estrellas y cantidad de reseñas, solo si tiene reseñas aprobadas.
- Corazón de favorito arriba a la derecha.

### Opción de diseño (en el detalle)

Dos opciones grandes, una al lado de la otra: **"Tengo mi diseño"** y **"No tengo diseño"**.

- **Tengo mi diseño:** zona punteada con el texto "Arrastrá tu imagen o tocá para elegirla (PNG o JPG, hasta 5 MB)". Al subir, muestra miniatura y nombre del archivo, y se habilita "Agregar al carrito".
- **No tengo diseño:** desaparece la zona de subida y aparece un campo "Contanos tu idea (opcional)" con la ayuda "Te atendemos por WhatsApp y armamos el diseño con vos". El botón "Agregar al carrito" se reemplaza por **"Consultar por WhatsApp"**.

Mensaje armado para WhatsApp:

```text
Hola, Sean's Store. Quiero un {producto} personalizado.
Talle: {talle} · Color: {color} · Cantidad: {cantidad}
Mi idea: {idea o "todavía no la tengo clara"}
(Consulta N° {id})
```

### Guía de talles

Ventana que se abre desde "Ver guía de talles", con una tabla por tipo (`remera`, `buzo`, `campera`, `canillera`). Las medidas las completa el negocio en `frontend/src/data/guiasTalles.js`; mientras tanto se muestran `[a completar]`.

### Checkout

- Indicador de pasos arriba (1 Tus datos · 2 Entrega · 3 Pago), el actual en magenta.
- Si el cliente tiene cuenta, los datos vienen precargados.
- Entrega con dos opciones grandes: **Retiro en el local** (gratis) y **Envío a domicilio** ("El costo del envío te lo confirmamos por WhatsApp").
- Pago: el **Payment Brick** de Mercado Pago dentro de la página y, debajo, la opción "Pagar al retirar en el local".
- Tarjeta "Resumen del pedido" fija a la derecha en PC y abajo en celular.

### Reseñas

- Estrellas en Amarillo calor, nombre corto ("Lucía G."), fecha, comentario y la etiqueta **"Compra verificada"**.
- En el detalle: promedio, cantidad y las últimas 5, con "Ver más".
- Testimonios: tarjetas con comillas, el nombre y la etiqueta **"Testimonio de cliente"**.

### Sellos de confianza

Tres íconos con texto corto: "Pago seguro con Mercado Pago", "Retiro en el local o envío" y "Te atendemos por WhatsApp".

### Estados del pedido

| Estado | Color de la etiqueta |
| --- | --- |
| Pendiente de pago | Amarillo calor con texto Violeta Sean |
| Pagado / En producción / Listo | Violeta Sean con texto blanco |
| Enviado / Entregado | `bg-exito` con texto blanco |
| Cancelado | Gris grafito con texto blanco |

### Formularios

- Etiqueta arriba de cada campo, en Nunito 700.
- Al enfocar, `ring-2 ring-magenta`.
- Errores en `text-error` debajo del campo, en lenguaje simple ("Falta tu email").
- Los campos de contraseña tienen el botón de ojito para mostrar u ocultar.

## Estados de pantalla

Toda pantalla que carga datos contempla estos casos:

| Caso | Qué se muestra |
| --- | --- |
| Cargando | Tarjetas grises "esqueleto" con la forma del contenido (no un spinner suelto) |
| Vacío | Ícono, frase y acción. Ej. carrito: "Tu carrito está vacío" + "Ver catálogo" |
| Sin resultados | "No encontramos productos con esa búsqueda" + "Ver todo el catálogo" |
| Error | "Algo salió mal, probá de nuevo" + botón "Reintentar" |
| Éxito | Aviso verde breve. Ej. "Agregado al carrito" |
| Sin conexión | "Parece que no tenés conexión. Revisá tu internet." |

## Asistente de preguntas frecuentes

- Burbuja violeta con el ícono de chat. Al abrirla: "¡Hola! ¿En qué te ayudo?" y 4 preguntas sugeridas (las de menor `orden`).
- El cliente toca una sugerida o escribe. La función `buscarRespuesta` compara las palabras del mensaje (en minúscula y sin tildes) con las `palabras_clave` de cada pregunta y elige la que más coincide.
- Si no encuentra nada: "No tengo esa respuesta, pero te atendemos por WhatsApp" + botón de WhatsApp con la pregunta del cliente ya escrita.
- No guarda las conversaciones.

### Preguntas iniciales (se cargan en `preguntas_frecuentes`)

| Pregunta | Respuesta | Palabras clave |
| --- | --- | --- |
| ¿Cómo compro? | Elegí el producto, subí tu diseño, agregalo al carrito y pagá. Te llega un email con tu código de pedido. | comprar, compro, pedido, pasos |
| ¿Y si no tengo diseño? | ¡Te lo hacemos! En el producto elegí "No tengo diseño" y te atendemos por WhatsApp. | diseño, diseno, no tengo, idea, logo |
| ¿Qué medios de pago aceptan? | Tarjetas de crédito y débito y dinero en cuenta con Mercado Pago, o efectivo al retirar en el local. | pago, pagar, tarjeta, efectivo, cuotas, mercado pago |
| ¿Hacen envíos? | Sí. Podés retirar gratis en el local o pedir envío; el costo te lo confirmamos por WhatsApp. | envio, envios, mandan, domicilio, retiro |
| ¿Cuánto tarda mi pedido? | Normalmente [a completar] días hábiles desde que se confirma el pago. | tarda, demora, tiempo, cuando, dias |
| ¿Qué formato tiene que tener mi imagen? | PNG o JPG de hasta 5 MB. Cuanto mejor la calidad, mejor queda. | imagen, foto, formato, calidad, archivo |
| ¿Cómo sé mi talle? | En cada prenda tenés el botón "Ver guía de talles". | talle, medida, tamaño, guia |
| ¿Hacen pedidos por cantidad? | Sí, para equipos, egresados y empresas. Pedí tu presupuesto en "Equipos y egresados". | cantidad, mayor, equipo, egresados, empresa |
| ¿Cómo sigo mi pedido? | Entrá a "Seguí tu pedido" con tu código y tu email. | seguir, seguimiento, estado, donde esta |
| ¿Puedo cancelar mi compra? | Sí, desde el "Botón de arrepentimiento" del pie de la página. Leé "Cambios y devoluciones" para los productos personalizados. | cancelar, arrepentimiento, devolver, cambio |

## Emails automáticos

Todos con el logo arriba, fondo blanco, botón magenta y pie con WhatsApp y dirección `[a completar]`.

| Cuándo | Asunto | Contenido |
| --- | --- | --- |
| Pago confirmado o pedido "pagar en el local" | "¡Recibimos tu pedido SS-0042!" | Detalle de productos, total, entrega y botón "Seguir mi pedido" |
| Pasa a `en_produccion` | "Tu pedido está en producción" | Estado y botón de seguimiento |
| Pasa a `listo` | "¡Tu pedido está listo!" | Si es retiro: dirección y horarios. Si es envío: "En breve lo despachamos" |
| Pasa a `enviado` | "Tu pedido va en camino" | Estado y botón de seguimiento |
| Pasa a `entregado` | "¡Gracias por tu compra!" | Agradecimiento |
| 5 días después de entregado | "¿Cómo te quedó tu pedido?" | Botón "Dejar mi opinión" (link con `token_resena`) |
| Pasa a `cancelado` | "Tu pedido fue cancelado" | Motivo genérico y WhatsApp |
| Olvidé mi contraseña | "Recuperá tu contraseña" | Botón con el link (vence en 1 hora) |
| Botón de arrepentimiento | "Recibimos tu pedido de arrepentimiento ARR-0007" | Código de trámite y próximos pasos |

## Textos iniciales

- **Portada:** título "Tu diseño, en lo que quieras." · bajada "Una foto, tu logo, una frase o el número de tu equipo. Lo pasamos a remeras, tazas, buzos, gorras y todo lo que se te ocurra." · chips "Tu foto", "Tu número", "Tu frase", "Tu logo" · botones "Ver catálogo" y "Pedir presupuesto".
- **Así de fácil:** los 4 pasos con sus textos están en `DESIGN.md` (sección 7).
- **¿No tenés diseño?:** "Contanos tu idea por WhatsApp y armamos el diseño con vos. Te mandamos el boceto, lo ajustamos hasta que te guste y te pasamos el precio."
- **Páginas legales:** cada una con sus títulos y los datos del negocio como `[a completar]`. "Cambios y devoluciones" aclara que los productos personalizados según indicaciones del cliente no tienen cambio salvo fallas de fabricación.

## Grilla responsive

| Pantalla | Columnas del catálogo |
| --- | --- |
| PC (más de 1024 px) | 4 |
| Tablet (600 a 1024 px) | 2 |
| Celular (menos de 600 px) | 1 |

## Uso de colores en pantalla

- El magenta se usa **solo** en botones de compra, enlaces y la etiqueta "Oferta".
- El amarillo nunca lleva texto blanco. Siempre texto Violeta Sean.
- El verde de WhatsApp se usa solo en los botones de WhatsApp.
- Los textos largos van en Nunito, nunca en Russo One.
- Sobre fondo violeta se usa siempre el logo negativo.
