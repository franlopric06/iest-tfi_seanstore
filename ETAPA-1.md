# Sean's Store: primera etapa (TFI)

La carpeta `docs/` describe **la tienda completa**, como tiene que quedar cuando esté terminada. Este archivo dice **qué se construye ahora**, en la primera etapa, que es la que se entrega en el Trabajo Final Integrador (28/10/2026).

## Cómo usar este archivo

1. Leé `docs/` para entender el proyecto completo: el negocio, la marca, la arquitectura y las reglas.
2. **Construí solo lo que está en este archivo.** Todo lo demás queda para después.
3. **Si algo de `docs/` choca con este archivo, manda este archivo.** No corrijas los documentos de `docs/` por esas diferencias: describen la tienda terminada y está bien que tengan más cosas.

## Qué es la primera etapa

Una **tienda de demostración que funciona**: se ven los productos con precio, se elige uno y se pide por WhatsApp con un mensaje armado; y un asistente responde las dudas frecuentes.

Es un proyecto educativo que usa Sean's Store como modelo. **Los precios, el stock y las descripciones son datos de ejemplo** cargados por el equipo. Si algún día la tienda se usa de verdad, se vacía la base y el negocio carga sus datos desde el panel.

## Las 4 funcionalidades de esta entrega

| Orden | Carpeta | Funcionalidad | RF de `docs/02-REQUERIMIENTOS.md` |
| --- | --- | --- | --- |
| 1 | `specs/001-catalogo/` | Inicio, catálogo con filtro y detalle del producto con precio | RF01, RF02, RF04 |
| 2 | `specs/002-pedido-whatsapp/` | Pedido por WhatsApp desde el detalle (con o sin diseño) y botón flotante | RF07 (adaptado), RF24 |
| 3 | `specs/003-asistente/` | Asistente de preguntas frecuentes | RF25 |
| 4 | `specs/004-panel/` | Panel de administración en cuatro bloques: ingreso y edición rápida, productos completos, fotos y contenido de Nuestro taller | RF34, RF35 (adaptado), RF38 (solo Nuestro taller); RF37 queda fuera por no guardar consultas |

Se hacen **en este orden**. El panel se divide en cuatro bloques de prioridad Alta para poder entregar el alcance por partes.

### 1 · Catálogo

- Inicio según `DESIGN.md`: portada "Tu diseño en vivo", franja de categorías con sellos, "Elegí qué personalizar", "Los más pedidos" (los productos con `destacado = TRUE`), "Así de fácil" y "¿No tenés diseño?".
- Catálogo con filtro por las 4 categorías.
- Detalle con fotos, nombre, **precio**, descripción, talles y colores. Si el stock es 0, se muestra la etiqueta "Sin stock".

### 2 · Pedido por WhatsApp

- En el detalle, el cliente elige talle, color y cantidad, y "Tengo mi diseño" o "No tengo diseño", con un campo para contar su idea.
- El botón "Pedir por WhatsApp" abre WhatsApp con el mensaje armado; la consulta no se guarda en la base.
- Botón flotante de WhatsApp en todas las páginas de la tienda.
- El número de WhatsApp sale de la variable `VITE_WHATSAPP` (nunca escrito en el código).
- No hay carrito ni pago online: el pedido se cierra por WhatsApp.

### 3 · Asistente

- Burbuja con las preguntas frecuentes de `docs/06-DISENO-UI.md`, que busca por palabras clave y deriva a WhatsApp si no encuentra respuesta.

### 4 · Panel de administración

Se incorpora a esta entrega por pedido de la docente (28/10/2026). Los cuatro bloques, en este orden, tienen prioridad Alta:

1. **Ingreso y edición rápida:** botón «Ingresar» del header y formulario en `/ingresar`; una cuenta de administrador creada por el estudiante en Neon. Contraseña con bcrypt (costo 12), JWT firmado con `JWT_SECRET` y vencimiento de 2 horas; máximo 5 intentos fallidos por IP cada 15 minutos. El token se guarda en `sessionStorage` y se envía como Bearer. `/admin` requiere sesión; lista todos los productos, incluso inactivos, y permite guardar precio, stock y destacado por separado. Incluye «Salir».
2. **Productos completos:** crear, editar nombre, categoría existente, precio, stock, descripción, talles, colores y destacado. El código se genera automáticamente con el formato de los productos existentes y no se repite; no se edita en el formulario y sí aparece en el listado. El slug se genera del nombre y es único. Ocultar y reactivar un producto cambia `activo`; no se borra físicamente.
3. **Fotos de productos:** subir JPG, PNG o WebP de hasta 2 MB a Vercel Blob. La base guarda la URL; `generada_con_ia` se puede elegir y por defecto es falso. Se pueden borrar fotos y elegir la principal.
4. **Nuestro taller desde la base:** la tabla `contenido_taller` tiene una sola fila. La portada obtiene título, párrafo, URLs y textos alternativos con `GET /api/taller`; si falla, usa los textos de `data/textos.js`. Desde una pestaña del panel se editan título y párrafo y se cambian las fotos usando la carga anterior; cada alt es obligatorio.

El esquema y los datos iniciales de las tablas nuevas se preparan en `backend/src/db/esquema-panel.sql`, para que el estudiante los ejecute en Neon. `backend/scripts/generar-hash.js` solicita la contraseña por consola y muestra únicamente el hash bcrypt; el estudiante agrega el administrador con SQL. `JWT_SECRET` y `BLOB_READ_WRITE_TOKEN` son secretos solo del backend. `/ingresar` y `/admin` llevan `noindex` y no se incluyen en el sitemap.

RF37 describe la administración de consultas, pero esa función no se implementa en esta etapa: no se guardan ni administran consultas de WhatsApp.

## Datos de demostración

Se cargan por SQL, los ejecuta el estudiante en el SQL Editor de Neon. Los productos no son solo blancos: el negocio sublima en muchos colores; la lista de cada producto está en la columna `colores` de `backend/src/db/datos-demo.sql`, en la tabla de `specs/001-catalogo/spec.md` y en la columna Colores de la tabla de abajo (actualizada el 23/10/2026 con las fotos: llavero con Transparente, mousepad y almohadón con sus listas nuevas).

| Producto | Categoría | Precio | Stock | Colores | Destacado | Descripción |
| --- | --- | --- | --- | --- | --- | --- |
| Taza de cerámica | Tazas y termos | $ 12.000 | 40 | Blanco, Negro, Beige, Verde claro | Sí | Taza de cerámica de 325 ml, estampada con tu foto, tu logo o una frase. Apta microondas. |
| Taza de polímero | Tazas y termos | $ 9.500 | 30 | Blanco, Negro, Beige, Verde claro | No | Taza de polímero irrompible, ideal para chicos y para regalar. Se estampa con el diseño que quieras. |
| Termo | Tazas y termos | $ 28.000 | 15 | Blanco, Negro, Rosa, Verde claro | Sí | Termo de acero inoxidable de 500 ml que mantiene el frío y el calor, con tu diseño. |
| Botella | Tazas y termos | $ 18.000 | 20 | Blanco, Negro, Azul | No | Botella de aluminio de 600 ml con tapa a rosca, para el gimnasio, la facu o el trabajo. |
| Remera | Indumentaria | $ 16.000 | 50 | Blanco, Negro, Gris, Azul, Rojo | Sí | Remera de poliéster de manga corta, liviana y fresca. El estampado no se va con el lavado. |
| Buzo | Indumentaria | $ 38.000 | 20 | Blanco, Negro, Gris, Azul | No | Buzo con capucha y bolsillo canguro, ideal para egresados, equipos y empresas. |
| Campera | Indumentaria | $ 52.000 | 12 | Blanco, Negro, Gris, Azul | No | Campera con cierre, abrigada, personalizada con nombre, número o logo. |
| Canilleras | Deportes | $ 14.000 | 25 | Blanco, Negro | Sí | Canilleras livianas estampadas con tu nombre, tu número o el escudo de tu equipo. |
| Gorra | Accesorios | $ 13.000 | 30 | Blanco, Negro, Azul | No | Gorra trucker con frente estampado y regulación atrás. |
| Llavero | Accesorios | $ 3.500 | 100 | Blanco, Negro, Transparente | No | Llavero con tu foto o tu logo, ideal como souvenir o regalo empresarial. |
| Mousepad | Accesorios | $ 7.500 | 40 | Blanco, Negro | No | Mousepad de 22 × 18 cm con base antideslizante y tu diseño. |
| Almohadón | Accesorios | $ 15.000 | 20 | Blanco, Gris, Verde claro | No | Almohadón de 40 × 40 cm con funda estampada y relleno incluido. |

- Talles: remera, buzo y campera de S a XXL; canilleras S, M y L; el resto, talle único.
- En el pie de la tienda va el aviso **"Sitio de demostración: precios y datos de ejemplo."**
- El JSON-LD de producto va **sin el bloque `offers`**, para no publicar en Google precios de ejemplo como si fueran reales.

## Fotos

- Todas las fotos se generan con IA (Actividad 4 del TFI) y llevan la etiqueta «Generado con IA» (`producto_fotos.generada_con_ia = TRUE`).
- Van en `frontend/public/img/productos/` en WebP; los originales y sus fichas, en `multimedia/`.
- Mientras no existan, cada producto muestra un recuadro con su nombre.

## Base de datos de la primera etapa

- Tablas: `categorias`, `productos`, `producto_fotos`, `consultas` y `preguntas_frecuentes` (ya creadas).
- El panel agrega `administradores` y `contenido_taller`, creadas por el estudiante desde `backend/src/db/esquema-panel.sql`. No se reutiliza `usuarios` ni se crean cuentas de clientes.
- Las demás tablas de `docs/05-DATOS.md` son de la tienda completa.

## Header y footer de la primera etapa

- **Header:** logo, "Catálogo" e "Ingresar"; con sesión activa ofrece "Salir".
- **Footer:** isotipo, descripción del negocio, contacto por WhatsApp y el aviso de sitio de demostración. Sin legales ni botón de arrepentimiento, porque no hay compra online.

## Lo que no entra en esta entrega

Carrito, checkout, Mercado Pago, registro de clientes, varios administradores o roles, recuperar contraseña, favoritos, emails, seguimiento de pedidos, consultas de WhatsApp guardadas o administradas, pedidos desde el panel, reseñas y testimonios (el modelo está en `docs/`, y nunca se inventan), legales de compra online, botón de arrepentimiento, promociones, galería de trabajos, buscador, guía de talles, subida de diseños de clientes, edición de categorías, Open Graph por producto y sitemap.

## Historial de cambios

| Fecha | Cambio | Motivo |
| --- | --- | --- |
| 28/10/2026 | Se incorpora `004-panel` a la primera entrega, con cuatro bloques priorizados en `specs/004-panel/` | 28/10, pedido de la docente |
