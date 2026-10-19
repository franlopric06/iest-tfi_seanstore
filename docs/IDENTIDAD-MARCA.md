# Manual de identidad: Sean's Store

## Esencia

- **Nombre:** Sean's Store (en archivos, carpetas y direcciones web se escribe `seanstore`, sin apóstrofe ni espacios)
- **Eslogan:** "Tu diseño, en lo que quieras."
- **Rubro:** sublimación y productos personalizados
- **Misión:** convertir las ideas, fotos y logos de cada cliente en productos reales, bien terminados y a tiempo.
- **Visión:** ser la tienda de referencia de la zona para regalos personalizados, indumentaria de equipos y merchandising de egresados y empresas.
- **Personalidad:** enérgica, creativa, cercana y prolija.
- **Público:** personas que buscan un regalo distinto, equipos deportivos, cursos de egresados, escuelas, emprendedores y empresas que quieren su marca en productos.

## Logo

Es una versión **minimalista y plana** del logo original del negocio, redibujada en CorelDRAW. Respeta su forma, pero sin brillos, reflejos ni efectos 3D:

- Una **S grande inclinada**, violeta arriba y magenta abajo, como las tintas de sublimación.
- Un **aro gris** que la envuelve y un **arco amarillo** arriba, que dan movimiento y recuerdan el calor de la plancha.
- Una **segunda S gris** abajo, que une el símbolo con el nombre.
- El nombre en dos líneas: **SEAN'** en violeta y **STORE** en magenta, en letra ancha e inclinada, con una línea amarilla debajo y la bajada "Sublimación y personalizados".

| Versión | Archivo | Cuándo se usa |
| --- | --- | --- |
| Horizontal | `marca/logo-seanstore-horizontal.png` | Encabezado del sitio y fondos claros |
| Negativo | `marca/logo-seanstore-negativo.png` | Fondos violeta u oscuros (footer, banners) |
| Isotipo | `marca/isotipo-seanstore.png` | Favicon, perfil de redes, sellos |
| Isotipo con fondo | `marca/isotipo-seanstore-fondo.png` | Ícono de app y miniaturas |

Todos los archivos están en PNG con fondo transparente (excepto las versiones con fondo violeta).

### Reglas del logo

- Área de seguridad: dejar libre alrededor un espacio igual a la altura de la S.
- Tamaño mínimo digital: 40 px de alto; más chico, usar el isotipo.
- Nunca deformarlo, rotarlo, cambiarle los colores ni agregarle sombras o brillos.
- Nunca ponerlo sobre fotos o fondos que le quiten contraste.

## Colores

Se usa la regla **60-30-10**: mucho fondo claro, el violeta como color de marca y el magenta y amarillo solo para llamar la atención.

| Nombre | HEX | RGB | Uso | Proporción |
| --- | --- | --- | --- | --- |
| Blanco algodón | `#FAF8F5` | 250, 248, 245 | Fondo general | 60% |
| Violeta Sean | `#2B1B4D` | 43, 27, 77 | Logo, títulos, header y footer | 24% |
| Gris grafito | `#5A5566` | 90, 85, 102 | Textos de apoyo, precios, íconos | 6% |
| Magenta tinta | `#E5007D` | 229, 0, 125 | Botones y llamados a la acción | 6% |
| Amarillo calor | `#FFB627` | 255, 182, 39 | Etiquetas, ofertas y destacados | 4% |

### Colores de apoyo (solo para estados de la interfaz)

| Nombre | HEX | Uso |
| --- | --- | --- |
| Verde éxito | `#2E7D32` | Avisos de éxito, estados "Enviado" y "Entregado" |
| Rojo error | `#C62828` | Mensajes de error en formularios |
| Gris claro | `#ECEAF0` | Bordes de campos, botones deshabilitados, esqueletos de carga |
| Verde WhatsApp | `#25D366` | Solo en los botones de WhatsApp (color oficial de la marca WhatsApp) |

## Tipografías

| Uso | Fuente | Peso | Por qué |
| --- | --- | --- | --- |
| Logo, títulos (H1, H2), precios y botones | **Russo One** | 400 (en el logo, inclinada) | Ancha y pesada como las letras del logo original, transmite fuerza y velocidad |
| Textos y subtítulos | **Nunito** | 400 y 700 | Redondeada y fácil de leer, transmite cercanía |

Las dos son gratuitas en Google Fonts con licencia libre (OFL), así que se pueden usar en el sitio web sin problema.

## Tema de Tailwind (para el código)

El proyecto usa **Tailwind CSS v4**. Los colores, fuentes y radios de la marca se definen una sola vez en `frontend/src/styles/index.css` con `@theme`, y Tailwind crea las clases solas (`bg-violeta`, `text-magenta`, `font-titulos`, etc.). Copiar tal cual:

```css
/* frontend/src/styles/index.css */
@import url("https://fonts.googleapis.com/css2?family=Nunito:wght@400;700;800&family=Russo+One&display=swap");
@import "tailwindcss";

@theme {
  --color-fondo: #FAF8F5;
  --color-violeta: #2B1B4D;
  --color-grafito: #5A5566;
  --color-magenta: #E5007D;
  --color-amarillo: #FFB627;
  --color-exito: #2E7D32;
  --color-error: #C62828;
  --color-gris-claro: #ECEAF0;
  --color-whatsapp: #25D366;
  --color-whatsapp-texto: #0B3D20; /* texto sobre el verde: el blanco no tiene contraste suficiente */

  --font-titulos: "Russo One", sans-serif;
  --font-textos: "Nunito", sans-serif;

  --radius-marca: 10px;
  --shadow-tarjeta: 0 2px 8px rgb(43 27 77 / 0.08);
  --shadow-elevada: 0 18px 40px -12px rgb(43 27 77 / 0.28);
}

@layer base {
  body { @apply bg-fondo font-textos text-violeta antialiased; }
  h1, h2, h3 { @apply font-titulos; }
}
```

| Color de marca | Clases de Tailwind |
| --- | --- |
| Blanco algodón | `bg-fondo` |
| Violeta Sean | `bg-violeta`, `text-violeta`, `border-violeta` |
| Gris grafito | `text-grafito` |
| Magenta tinta | `bg-magenta`, `text-magenta`, `ring-magenta` |
| Amarillo calor | `bg-amarillo`, `text-amarillo` |
| Colores de apoyo | `text-exito`, `text-error`, `bg-gris-claro`, `bg-whatsapp` con `text-whatsapp-texto` |
| Tipografías | `font-titulos`, `font-textos` |
| Radio y sombras | `rounded-marca`, `shadow-tarjeta`, `shadow-elevada` |

La IA usa **solo** estas clases para los colores de marca. Nunca valores sueltos como `bg-[#E5007D]` ni colores de la paleta por defecto de Tailwind (`bg-purple-900`, `text-pink-600`, etc.). Las transparencias se escriben con la clase del tema, ej. `bg-violeta/80`.

## Tono de voz

- Hablamos de **vos**, como se atiende en el local.
- Frases cortas, alegres y claras. Nada de palabras técnicas de imprenta.
- Siempre invitamos a la acción: "Subí tu diseño", "Comprá ahora", "Armá tu combo".
- Podemos usar algún emoji en redes, pero **no** en el sitio.

| Sí decimos | No decimos |
| --- | --- |
| "Mandanos tu foto y la pasamos a tu taza" | "Realizamos procesos de transferencia térmica" |
| "¿No tenés diseño? Te lo hacemos" | "Contamos con servicio de diseño gráfico" |
| "Comprá ahora y retirá en el local" | "Proceda a efectuar la compra" |
