# Sean's Store: diseño de la tienda

Este archivo describe **cómo se ve y cómo se mueve** la tienda, empezando por la página de inicio, que es el diseño aprobado. La IA lo lee antes de construir cualquier pantalla.

- Los colores, las fuentes y el tema de Tailwind están en `docs/IDENTIDAD-MARCA.md`.
- Las pantallas, los componentes, los estados y los textos están en `docs/06-DISENO-UI.md`.
- Los prototipos aprobados están en `diseno/` (ver al final). Son **solo de referencia**: se rehacen en React con Tailwind y Motion, nunca se copian sus estilos en línea.

## Idea que guía todo

**"El taller de sublimación"**: un producto en blanco que pasa por la plancha y sale con el diseño del cliente. Todo el diseño cuenta esa idea con la tinta magenta, el calor amarillo y la diagonal del logo.

## Reglas generales

1. **Profesional, no plantilla.** Nada de degradados de fondo, tarjetas con brillo, emojis decorativos ni frases genéricas ("¡Bienvenido a nuestra tienda!").
2. **La diagonal de la marca.** Los títulos grandes van inclinados (`-skew-x-6`), las franjas de sección también (`-skew-y-2` en PC, `-skew-y-3` en celular) y los títulos de sección llevan el subrayado amarillo.
3. **Un momento fuerte por sección, sin recargar.** El diseño ya tiene sus animaciones definidas (abajo). **No agregar efectos nuevos** sin preguntar.
4. **Solo `transform` y `opacity`.** Nada de `filter: blur`, ni animar `width`, `height`, `top` o sombras en loop.
5. **Celular primero.** En celular nada se agranda más de su tamaño real (`scale` máximo 1) y no se usa desenfoque, para que se vea nítido.
6. **Reducir movimiento.** Con `useReducedMotion` activo, cada animación muestra su estado final quieto (ver tabla de cada sección).
7. **Accesible.** Contraste correcto, foco visible magenta, botones de al menos 44 px, textos alternativos en todo lo que no es decorativo y `aria-hidden` en lo decorativo.

## Página de inicio, de arriba hacia abajo

### 1. Barra de promociones

- Fondo `bg-amarillo`, texto `text-violeta` en negrita, centrado, con enlace a la promo.
- Muestra una promo a la vez (rota cada 5 s con un fundido). Si no hay promociones vigentes, no aparece.

### 2. Header

- Fondo `bg-violeta`, logo negativo a la izquierda (64 px de alto en PC, 44 px en celular).
- Menú: Catálogo, Trabajos, Equipos y egresados, Contacto.
- Íconos de Lucide a la derecha: buscar, mi cuenta, favoritos y carrito con contador `bg-amarillo text-violeta`.
- En celular: logo, carrito y botón de menú (hamburguesa).
- Al bajar se achica y pasa a `bg-violeta/90 backdrop-blur-md`.

> En la primera etapa el header y el footer son más simples: ver `ETAPA-1.md`.

### 3. Portada "Tu diseño en vivo" (`HeroSublimado`)

Fondo `bg-violeta` con texto blanco. Dos columnas en PC (texto a la izquierda, remera a la derecha); en celular, el texto arriba y la remera abajo.

| Parte | Cómo es | Animación |
| --- | --- | --- |
| Tinta que chorrea | Franja magenta fina pegada al header con 6 gotas de distinto largo | Cada gota se estira y se encoge (`scaleY` 0.55 → 1.15), 3.2 s, ida y vuelta, desfasadas |
| Título | "Tu diseño, en lo que quieras." en `font-titulos`, enorme (`text-5xl md:text-8xl`), `leading-none`, `-skew-x-6` | Entra con opacidad y 16 px hacia arriba, 0.6 s, una vez |
| Bajada | "Una foto, tu logo, una frase o el número de tu equipo. Lo pasamos a remeras, tazas, buzos, gorras y todo lo que se te ocurra." | Igual, 0.15 s después |
| Chips | "Tu foto", "Tu número", "Tu frase", "Tu logo" | El chip del diseño que se ve en la remera se pinta magenta (sincronizado con la remera) |
| Botones | "Ver catálogo" (primario magenta) y "Pedir presupuesto" (borde blanco) | Microinteracción de botón |
| Remera | Remera blanca dibujada en SVG sobre un círculo violeta más claro | Flota suave (sube 10 px y gira ±2°), 6 s en loop |
| Diseño del pecho | Cambia cada **3 s** entre 4 diseños: una foto (paisaje con sol amarillo), el **10** con "Tu nombre", la frase **"Feliz cumple"** con subrayado amarillo, y **"Tu logo"** en un recuadro punteado | Cada diseño aparece "estampándose" de arriba hacia abajo (máscara que se abre) y se va con un fundido. Ciclo total de 12 s |

**Sin movimiento:** se ve la remera quieta con el primer diseño y el primer chip marcado.

### 4. Franja inclinada: categorías + sellos

Un solo bloque inclinado (`-skew-y-2` en PC, `-skew-y-3` en celular) con el contenido enderezado por dentro.

- **Arriba, cinta magenta** (`bg-magenta`, texto blanco en `font-titulos`): "Tazas y termos / Indumentaria / Deportes / Accesorios" repetido, que se desplaza lento hacia la izquierda en loop (32 s). Se pausa al pasar el mouse o al tocarla. Los nombres son enlaces a cada categoría.
- **Abajo, banda blanca** con los tres sellos de confianza (ícono violeta + texto): "Pago seguro con Mercado Pago", "Retiro en el local o envío" y "Te atendemos por WhatsApp".

**Sin movimiento:** la cinta queda quieta.

### 5. "Elegí qué personalizar" (`CintaProductos`)

Dos columnas en PC; en celular, primero el texto y los botones, después la animación.

- **Izquierda:** título con subrayado amarillo, la frase "Elegí el producto y el color, y lo estampamos con tu diseño, con tintas que no se borran con el lavado." y 4 botones de categoría **chicos** (blancos con borde, texto violeta y flecha ›).
- **Derecha, la cinta de producción:** un paralelogramo `bg-violeta` inclinado (`-skew-x-12`, con el contenido enderezado por dentro y **recortado**: nada sale del violeta).
  - Por la cinta pasan, de a uno, **tazas, remeras, gorras, termos y canilleras** (ícono blanco grande con su nombre). Entran desde arriba a la derecha, llegan al centro, se "estampan" y salen abajo a la izquierda, en diagonal.
  - En el centro, al estamparse: dos **anillos amarillos de calor** que se agrandan y desaparecen, y **5 gotas de tinta** (magenta y amarilla) que saltan hacia arriba. El diseño aparece sobre el producto de izquierda a derecha.
  - Cada producto tarda 2.5 s; la vuelta completa, 12.5 s.

**Sin movimiento:** se ve una sola pieza quieta (canilleras) ya estampada, sin anillos ni gotas.

### 6. "Los más pedidos"

- Título con subrayado amarillo y enlace "Ver todo el catálogo" a la derecha.
- Grilla de 4 `TarjetaProducto` (2 en tablet, 1 en celular; en celular se puede deslizar de costado con Embla).
- Tarjeta: foto cuadrada, corazón de favorito, etiqueta "Personalizable", nombre, precio y botón "Elegir y personalizar".
- **Hover:** la tarjeta sube 6 px con `shadow-elevada`, la foto hace zoom a 104% y una **pasada de tinta** (tres franjas inclinadas magenta, violeta y amarilla) cruza la foto una vez.

### 7. "Así de fácil"

Franja `bg-violeta` inclinada con texto blanco y los 4 pasos numerados (número grande en `font-titulos text-amarillo`):

1. **Elegí tu producto.** Taza, remera, buzo, gorra, termo o canilleras, con el talle y el color que quieras.
2. **Subí tu diseño.** Una foto, tu logo o una frase. Si no tenés diseño, te lo hacemos por WhatsApp.
3. **Pagá como quieras.** Con Mercado Pago sin salir de la página, o en efectivo cuando lo retirás.
4. **Retiralo o te lo enviamos.** Te avisamos por email cuando está en producción y cuando está listo.

En celular los textos van más cortos (están en `data/textos.js`).

### 8. "¿No tenés diseño? Te lo hacemos."

Bloque claro con borde, título, el texto "Contanos tu idea por WhatsApp y armamos el diseño con vos. Te mandamos el boceto, lo ajustamos hasta que te guste y te pasamos el precio." y el botón verde **"Consultar por WhatsApp"** (`bg-whatsapp text-whatsapp-texto`).

### 9. "Trabajos que ya hicimos"

Título, enlace "Ver la galería" y 4 fotos reales de la tabla `galeria_trabajos` (las destacadas). Mientras no haya fotos, la sección **no se muestra**.

### 10. "Lo que dicen nuestros clientes"

- Hasta 3 reseñas **destacadas y aprobadas**: estrellas amarillas, comentario, nombre corto ("Lucía G.") y etiqueta "Compra verificada".
- Si no hay reseñas aprobadas, la sección **no se muestra**. Nunca se completa con opiniones inventadas.

### 11. Footer

Fondo `bg-violeta`, isotipo, "Sublimación y productos personalizados.", Visitanos (dirección y horarios `[a completar]`), Ayuda (Seguí tu pedido y legales), Medios de pago y el **Botón de arrepentimiento** bien visible.

### 12. Botones flotantes

En la primera etapa, el botón fijo del **asistente** va abajo a la izquierda, en amarillo con texto violeta, `shadow-elevada`, borde blanco fino (`border-2 border-white`) e ícono `HelpCircle` de Lucide decorativo (`aria-hidden`). El botón de **WhatsApp** va abajo a la derecha. No aparecen en el checkout ni en el panel.

## Animaciones al bajar

- Cada sección aparece una sola vez al entrar en pantalla (opacidad + 16 px), con `whileInView` y `viewport={{ once: true }}` de Motion.
- El subrayado amarillo de los títulos se dibuja de izquierda a derecha cuando el título aparece.

## Medidas de referencia

| Cosa | PC | Celular |
| --- | --- | --- |
| Ancho máximo del contenido | 1280 px (`max-w-7xl`) | todo el ancho con 20 px de margen |
| Título de portada | 88 px | 48 px |
| Títulos de sección | 40 a 44 px | 28 a 32 px |
| Subrayado amarillo | 120 × 8 px | 90 × 6 px |
| Inclinación de franjas | −2° | −3° |
| Radio de tarjetas y botones | `rounded-marca` | `rounded-marca` |
| Chips y etiquetas (hero, "Personalizable", "Sin stock", filtro) | `rounded-marca` | `rounded-marca` |

**Excepción:** el botón flotante de WhatsApp es circular (`rounded-full`) en celular y escritorio. Su forma redonda se mantiene porque es una convención visual reconocible para contactar por WhatsApp.

## Prototipos aprobados

| Archivo | Qué es |
| --- | --- |
| `diseno/inicio-escritorio.html` | Página de inicio en PC (1440 px) |
| `diseno/inicio-celular.html` | Página de inicio en celular (390 px) |

Se abren con doble clic en el navegador. Los textos entre corchetes (`[Foto: …]`, `$ [precio]`, `[Opinión real…]`) marcan lugares que se llenan con datos reales de la base.

## Cómo se pasa del prototipo al código

| En el prototipo | En React |
| --- | --- |
| Estilos en línea con colores HEX | Clases de Tailwind del tema (`bg-violeta`, `text-magenta`…) |
| Tonos intermedios sobre violeta (`#D9D3E6`, `#6B5C8F`, `#3A2866`, `#B9B0CC`) | Blanco o violeta con opacidad: `text-white/80`, `border-white/30`, `bg-white/10`. No se crean colores nuevos |
| Hover del magenta (`#B8006A`) | `hover:bg-magenta/90` |
| `@keyframes` de CSS | `motion.div` con `animate`, `transition` y `repeat: Infinity` |
| `prefers-reduced-motion` en CSS | `useReducedMotion()` de Motion |
| Íconos dibujados en SVG | Íconos de Lucide (salvo la remera y la cinta, que son SVG propios) |
| Textos fijos en el HTML | `frontend/src/data/textos.js` |
