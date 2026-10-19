# 03 · Tecnologías

## Stack elegido

| Parte | Herramienta | Por qué |
| --- | --- | --- |
| Interfaz | **React 19** | Componentes reutilizables (tarjetas, carrito, formularios, panel) |
| Empaquetador | **Vite** | Arranque y recarga rápidos, configuración simple |
| Rutas del frontend | **React Router** | Navegar entre tienda, checkout, cuenta y panel sin recargar |
| Estilos | **Tailwind CSS v4** (`@tailwindcss/vite`) | Clases utilitarias con los colores y fuentes de la marca definidos una sola vez en `@theme`; diseño responsive rápido y consistente |
| Animaciones | **Motion** (`motion/react`) | Animaciones fluidas y transiciones entre pantallas, con soporte para movimiento reducido |
| Íconos | **Lucide** (`lucide-react`) | Íconos de línea livianos y consistentes |
| Carruseles | **Embla Carousel** | Galería de fotos del producto y carruseles táctiles en celular |
| Servidor (API) | **Node.js + Express** | API propia para productos, pedidos, usuarios, pagos y contenido |
| Base de datos | **PostgreSQL** (Neon) | Relaciona bien productos, pedidos, usuarios y reseñas; SQL estándar |
| Conexión a la base | **pg** (node-postgres) | Consultas con parámetros y transacciones, sin ORM |
| Pagos | **Mercado Pago · Checkout Bricks** (Payment Brick) | El cliente paga sin salir de la tienda; los datos de la tarjeta los maneja Mercado Pago |
| Usuarios y sesiones | **bcrypt + jsonwebtoken** (en cookie `httpOnly`) | Contraseñas seguras y sesión que JavaScript no puede leer |
| Imágenes | **Multer + Cloudinary** | Recibir diseños y fotos, guardarlas en la nube y servirlas optimizadas |
| Emails | **Brevo** (API de correos transaccionales) | Confirmación de compra, cambios de estado, recuperar contraseña, reseñas y arrepentimiento |
| Tareas programadas | **Vercel Cron Jobs** (versión 2) | Enviar cada día los emails de "dejá tu reseña"; en Vercel no se puede dejar un proceso de node-cron corriendo |
| Protección de la API | **helmet + express-rate-limit + cors** | Cabeceras seguras, límite de intentos y solo acepta pedidos del sitio |
| Mapa | **Google Maps (mapa incrustado)** | Mostrar la ubicación del local en Contacto, sin clave de API |
| Estadísticas | **Vercel Web Analytics** | Visitas y páginas más vistas, sin cookies de seguimiento |
| Vista previa al compartir | **Vercel Routing Middleware** | Arma las etiquetas Open Graph de cada producto para WhatsApp e Instagram |
| Código | **Git + GitHub** | Historial de cambios y trabajo ordenado por ramas |
| Tests | **Vitest** + **Testing Library** (frontend) y **Vitest** + **Supertest** (API) | Tests automáticos con `npm test`, rápidos y con la misma sintaxis en las dos partes |
| Publicación | **Vercel** (tienda y API, dos proyectos del mismo repositorio) | Deploy automático en cada push, HTTPS y plan gratuito. Vercel corre la API de Express sin configuración extra |
| Agente de IA | **OpenCode** en la terminal de VS Code, con un modelo gratuito | Lee `AGENTS.md`, los comandos de `.opencode/commands/` y las skills de `.agents/skills/` |

## Por qué frontend y API separados

Se eligió una tienda en **React con Vite** y una **API en Express** aparte, en lugar de Next.js como en Ursus:

- En un e-commerce, todo lo delicado (precios, stock, pagos, contraseñas, emails) vive en el servidor, y el navegador nunca toca la base de datos. Con la API separada esa frontera queda muy clara.
- La misma API sirve para la tienda y para el panel, y más adelante podría usarla una app de celular sin cambiar nada.
- Cada parte se publica por separado (dos proyectos de Vercel) y puede crecer sin tocar la otra.
**Cambio respecto del TP3:** la API iba a publicarse en Railway, pero Railway da un crédito de prueba de USD 5 y después un plan gratuito de USD 1 por mes, que no alcanza para tener la API funcionando todo el tiempo. Para que el sitio siga funcionando en la defensa y después, la API se publica también en Vercel, que tiene plan gratuito.
- El punto débil de una tienda en React puro es la vista previa al compartir links; se resuelve con el middleware de Vercel (ver `09-SEO.md`).

## Dependencias permitidas

```text
frontend: react, react-dom, react-router-dom, tailwindcss, @tailwindcss/vite, motion,
          lucide-react, embla-carousel-react, @mercadopago/sdk-react, @vercel/analytics
dev:      prettier, prettier-plugin-tailwindcss, vitest, @testing-library/react,
          @testing-library/jest-dom, @testing-library/user-event, jsdom, oxlint
backend:  express, pg, bcrypt, jsonwebtoken, cookie-parser, multer, cloudinary,
          mercadopago, @getbrevo/brevo, helmet, express-rate-limit, cors, dotenv
backend dev: vitest, supertest
```

**En la versión 1** solo se instalan las que se usan: en el frontend, todas menos `@mercadopago/sdk-react`; en el backend, `express`, `pg`, `helmet`, `express-rate-limit`, `cors` y `dotenv`. Las demás se agregan cuando llegue la versión 2.

```text
```

## Cómo se conecta todo

```text
Navegador del cliente
   │  HTTPS
   ▼
Tienda React (Vercel) ──fetch──► API Express (Vercel) ──SQL──► PostgreSQL (Neon)
   │                               │      ▲
   │ Payment Brick                 │      └── webhook: "el pago se aprobó"
   └──────────► Mercado Pago ◄─────┘
                                   ├──► Cloudinary (diseños y fotos)
                                   └──► Brevo (emails)
```

## No usar en este proyecto

- Bootstrap, Material UI, Chakra u otras librerías de componentes (los componentes se arman con Tailwind)
- CSS suelto por componente o archivos `.css` extra (todo se resuelve con clases de Tailwind y el tema)
- Otras librerías de animación (GSAP, AOS, Animate.css): solo Motion
- Next.js, Vue, Angular, jQuery
- MongoDB, Firebase
- Prisma, TypeScript ni otros ORM, por ahora
- Otras pasarelas de pago (solo Mercado Pago)
- Librerías de chat o IA externas para el asistente (se arma con las preguntas de la base)

> Es una decisión del proyecto, no una regla eterna: si algo cambia, primero se edita este archivo y después el código.
