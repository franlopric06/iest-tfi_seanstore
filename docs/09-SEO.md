# 09 · SEO

El objetivo es que Sean's Store aparezca cuando alguien de la zona busca "tazas personalizadas", "sublimación" o "camperas de egresados", que cada producto se pueda encontrar por su nombre, y que al compartir un link por WhatsApp se vea una vista previa linda.

## Título y descripción por página

| Página | Título (`<title>`, máx. 60 caracteres) | Descripción (`meta description`, máx. 155) |
| --- | --- | --- |
| Inicio | Sean's Store · Sublimación y productos personalizados | Tazas, termos, remeras, buzos, gorras y canilleras con tu diseño. Comprá online y pagá con Mercado Pago. |
| Catálogo | Catálogo · Sean's Store | Elegí tu producto, subí tu diseño y comprá en minutos. |
| Categoría | {Categoría} personalizadas · Sean's Store | {Categoría} sublimadas con tu foto, logo o frase. Retiro en el local o envío. |
| Detalle | {Nombre del producto} personalizado · Sean's Store | {Nombre del producto} sublimado con tu diseño. {Precio}. Retiro en el local o envío. |
| Trabajos | Trabajos realizados · Sean's Store | Mirá tazas, camperas, remeras y más que ya personalizamos para nuestros clientes. |
| Equipos y egresados | Equipos y egresados · Sean's Store | Camperas, buzos, camisetas y canilleras para equipos, promos y empresas. Pedí tu presupuesto. |
| Contacto | Contacto · Sean's Store | Horarios, ubicación del local y WhatsApp de Sean's Store. |
| Seguimiento | Seguí tu pedido · Sean's Store | Consultá el estado de tu pedido con tu código. |
| Legales | {Título} · Sean's Store | {Título} de la tienda Sean's Store. |

### Páginas que no se indexan

Carrito, checkout, resultado de pago, dejar reseña, arrepentimiento, todas las de cuenta y todo el panel `/admin` llevan:

```html
<meta name="robots" content="noindex, nofollow" />
```

## Palabras clave

| Tipo | Palabras |
| --- | --- |
| Principales | sublimación, productos personalizados, tienda de personalizados |
| Por producto | tazas personalizadas, termos personalizados, remeras sublimadas, buzos personalizados, gorras personalizadas, canilleras personalizadas |
| Por ocasión | regalos personalizados, regalo Día del Padre, regalo Día de la Madre, camperas de egresados, buzos de promo |
| Por cliente | camisetas para equipos, merchandising para empresas, tazas con logo |
| Locales | sublimación + nombre de la ciudad `[a completar]` |

Se usan de forma natural en títulos, descripciones, el `<h1>` y los textos de cada categoría. No se repiten de forma forzada.

## Cómo se aplica en React

`MetaPagina` actualiza título, descripción, robots, Open Graph y datos estructurados en cada página:

```jsx
// components/comunes/MetaPagina.jsx
import { useEffect } from "react";

const ponerMeta = (selector, atributo, valor) => {
  let etiqueta = document.head.querySelector(selector);
  if (!etiqueta) {
    etiqueta = document.createElement("meta");
    const [, nombre, clave] = selector.match(/\[(\w+)="(.+)"\]/);
    etiqueta.setAttribute(nombre, clave);
    document.head.appendChild(etiqueta);
  }
  etiqueta.setAttribute(atributo, valor);
};

const MetaPagina = ({ titulo, descripcion, imagen = "/img/compartir.jpg", indexar = true, jsonLd }) => {
  useEffect(() => {
    document.title = titulo;
    ponerMeta('meta[name="description"]', "content", descripcion);
    ponerMeta('meta[name="robots"]', "content", indexar ? "index, follow" : "noindex, nofollow");
    ponerMeta('meta[property="og:title"]', "content", titulo);
    ponerMeta('meta[property="og:description"]', "content", descripcion);
    ponerMeta('meta[property="og:image"]', "content", imagen);

    const anterior = document.getElementById("json-ld");
    if (anterior) anterior.remove();
    if (jsonLd) {
      const script = document.createElement("script");
      script.type = "application/ld+json";
      script.id = "json-ld";
      script.textContent = JSON.stringify(jsonLd);
      document.head.appendChild(script);
    }
  }, [titulo, descripcion, imagen, indexar, jsonLd]);

  return null;
};

export default MetaPagina;
```

```html
<!-- frontend/index.html -->
<html lang="es">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Sean's Store · Sublimación y productos personalizados</title>
    <meta name="description" content="Tazas, termos, remeras, buzos, gorras y canilleras con tu diseño." />
    <meta name="robots" content="index, follow" />
    <meta property="og:type" content="website" />
    <meta property="og:site_name" content="Sean's Store" />
    <meta property="og:image" content="/img/compartir.jpg" />
    <link rel="icon" href="/favicon.png" />
  </head>
</html>
```

## Datos estructurados (JSON-LD)

Ayudan a que Google muestre el precio, la disponibilidad y las estrellas en los resultados.

**En el detalle de producto:**

```json
{
  "@context": "https://schema.org",
  "@type": "Product",
  "name": "Taza cerámica blanca 325 ml",
  "image": ["https://.../taza-1.jpg"],
  "description": "Taza sublimada con tu diseño.",
  "sku": "TAZ-001",
  "brand": { "@type": "Brand", "name": "Sean's Store" },
  "offers": {
    "@type": "Offer",
    "priceCurrency": "ARS",
    "price": "0",
    "availability": "https://schema.org/InStock",
    "url": "https://seanstore.com.ar/producto/taza-ceramica-blanca-325-ml"
  },
  "aggregateRating": { "@type": "AggregateRating", "ratingValue": "4.8", "reviewCount": "12" }
}
```

`aggregateRating` se agrega **solo** si el producto tiene reseñas aprobadas, y con los valores reales calculados de la base.

**En el inicio y en contacto:** `LocalBusiness` con nombre, logo, teléfono, dirección y horarios (`[a completar]`).

**En catálogo y detalle:** `BreadcrumbList` (Inicio › Categoría › Producto).

## Vista previa al compartir (Open Graph)

WhatsApp, Instagram y Facebook no ejecutan JavaScript, así que no ven las etiquetas que pone `MetaPagina`. Para eso, `frontend/middleware.js` (Vercel Routing Middleware) detecta a esos lectores (`WhatsApp`, `facebookexternalhit`, `Twitterbot`, `TelegramBot`) cuando piden `/producto/:slug`, consulta el producto a la API y devuelve un HTML mínimo con `og:title`, `og:description`, `og:image` (foto principal) y `og:url`. Para las demás páginas usan las etiquetas de `index.html`. Las personas siempre reciben la tienda normal.

## Sitemap y robots

- `scripts/generarSitemap.js` corre antes de cada build (`"prebuild"` en `package.json`): pide a la API las categorías y productos activos y escribe `public/sitemap.xml` con inicio, catálogo, categorías, productos, trabajos, equipos y egresados, contacto y legales.
- `public/robots.txt`:

```text
User-agent: *
Disallow: /admin
Disallow: /mi-cuenta
Disallow: /checkout
Disallow: /carrito
Sitemap: https://seanstore.com.ar/sitemap.xml
```

> El dominio `seanstore.com.ar` es un marcador hasta que el negocio defina el suyo.

## Texto alternativo de imágenes

| Imagen | Texto alternativo (`alt`) |
| --- | --- |
| Logo | Sean's Store, sublimación y personalizados |
| Foto de producto | {Nombre del producto} personalizable, vista {n} |
| Trabajo realizado | {Producto} sublimado para {tipo de cliente}, ej. "Campera sublimada para egresados" |
| Banner de inicio | Tazas, remeras y gorras con diseños personalizados |
| Ícono de medio de pago | Aceptamos {nombre del medio} |
| Diseño subido por el cliente | Diseño del cliente para {producto} |

## Lista de control

- [ ] Título y descripción únicos por página
- [ ] `noindex` en carrito, checkout, cuenta, reseña, arrepentimiento y panel
- [ ] Un solo `<h1>` por página
- [ ] URLs legibles con slug (`/producto/taza-ceramica-blanca-325-ml`)
- [ ] Todas las imágenes con `alt` descriptivo, en WebP y con `loading="lazy"` (menos la primera)
- [ ] Etiquetas semánticas (`header`, `nav`, `main`, `article`, `footer`)
- [ ] JSON-LD de producto, negocio local y migas de pan
- [ ] Vista previa correcta al compartir un producto por WhatsApp
- [ ] `sitemap.xml` y `robots.txt` publicados y el sitio dado de alta en Google Search Console
- [ ] La imagen principal de la portada se carga con prioridad (`fetchpriority="high"`) y la animación no retrasa su aparición
- [ ] PageSpeed de 90 o más en celular
