# Sean's Store: primera etapa (TFI)

La carpeta `docs/` describe **la tienda completa**, como tiene que quedar cuando esté terminada. Este archivo dice **qué se construye ahora**, en la primera etapa, que es la que se entrega en el Trabajo Final Integrador (28/10/2026).

## Cómo usar este archivo

1. Leé `docs/` para entender el proyecto completo: el negocio, la marca, la arquitectura y las reglas.
2. **Construí solo lo que está en este archivo.** Todo lo demás queda para después.
3. **Si algo de `docs/` choca con este archivo, manda este archivo.** No corrijas los documentos de `docs/` por esas diferencias: describen la tienda terminada y está bien que tengan más cosas.

## Qué es la primera etapa

Una **tienda de demostración que funciona**: se ven los productos con precio, se elige uno y se pide por WhatsApp con un mensaje armado; un asistente responde las dudas frecuentes; y un panel chico permite editar los datos.

Es un proyecto educativo que usa Sean's Store como modelo. **Los precios, el stock y las descripciones son datos de ejemplo** cargados por el equipo. Si algún día la tienda se usa de verdad, se vacía la base y el negocio carga sus datos desde el panel.

## Las 4 funcionalidades

| Orden | Carpeta | Funcionalidad | RF de `docs/02-REQUERIMIENTOS.md` |
| --- | --- | --- | --- |
| 1 | `specs/001-catalogo/` | Inicio, catálogo con filtro y detalle del producto con precio | RF01, RF02, RF04 |
| 2 | `specs/002-pedido-whatsapp/` | Pedido por WhatsApp desde el detalle (con o sin diseño) y botón flotante | RF07 (adaptado), RF24 |
| 3 | `specs/003-asistente/` | Asistente de preguntas frecuentes | RF25 |
| 4 | `specs/004-panel/` | Panel chico de administración | RF34, RF35, RF37 y RF38 (reducidos) |

Se hacen **en este orden**. La 004 se empieza cuando las otras tres estén terminadas.

### 1 · Catálogo

- Inicio según `DESIGN.md`: portada "Tu diseño en vivo", franja de categorías con sellos, "Elegí qué personalizar", "Los más pedidos" (los productos con `destacado = TRUE`), "Así de fácil" y "¿No tenés diseño?".
- Catálogo con filtro por las 4 categorías.
- Detalle con fotos, nombre, **precio**, descripción, talles y colores. Si el stock es 0, se muestra la etiqueta "Sin stock".

### 2 · Pedido por WhatsApp

- En el detalle, el cliente elige talle, color y cantidad, y "Tengo mi diseño" o "No tengo diseño", con un campo para contar su idea.
- El botón "Pedir por WhatsApp" guarda la consulta en la base y abre WhatsApp con el mensaje armado.
- Botón flotante de WhatsApp en todas las páginas de la tienda.
- El número de WhatsApp sale de la variable `VITE_WHATSAPP` (nunca escrito en el código).
- No hay carrito ni pago online: el pedido se cierra por WhatsApp.

### 3 · Asistente

- Burbuja con las preguntas frecuentes de `docs/06-DISENO-UI.md`, que busca por palabras clave y deriva a WhatsApp si no encuentra respuesta.

### 4 · Panel de administración (chico)

- **Ingreso** con email y contraseña, solo para el administrador (contraseña con bcrypt, sesión en cookie `httpOnly`).
- **Productos:** listar, crear y editar nombre, categoría, precio, stock, descripción, talles, colores, destacado y activo.
- **Consultas:** ver las consultas de WhatsApp y marcarlas como atendidas.
- **Preguntas del asistente:** crear y editar.
- Sin subida de fotos, pedidos, reseñas ni métricas (eso es de la tienda completa).

## Datos de demostración

Se cargan por SQL, los ejecuta el estudiante en el SQL Editor de Neon. Los productos no son solo blancos: el negocio sublima en muchos colores; la lista de cada producto está en la columna `colores` de `backend/src/db/datos-demo.sql` y en la tabla de `specs/001-catalogo/spec.md`.

| Producto | Categoría | Precio | Stock | Destacado | Descripción |
| --- | --- | --- | --- | --- | --- |
| Taza de cerámica | Tazas y termos | $ 12.000 | 40 | Sí | Taza de cerámica de 325 ml, estampada con tu foto, tu logo o una frase. Apta microondas. |
| Taza de polímero | Tazas y termos | $ 9.500 | 30 | No | Taza de polímero irrompible, ideal para chicos y para regalar. Se estampa con el diseño que quieras. |
| Termo | Tazas y termos | $ 28.000 | 15 | Sí | Termo de acero inoxidable de 500 ml que mantiene el frío y el calor, con tu diseño. |
| Botella | Tazas y termos | $ 18.000 | 20 | No | Botella de aluminio de 600 ml con tapa a rosca, para el gimnasio, la facu o el trabajo. |
| Remera | Indumentaria | $ 16.000 | 50 | Sí | Remera de poliéster de manga corta, liviana y fresca. El estampado no se va con el lavado. |
| Buzo | Indumentaria | $ 38.000 | 20 | No | Buzo con capucha y bolsillo canguro, ideal para egresados, equipos y empresas. |
| Campera | Indumentaria | $ 52.000 | 12 | No | Campera con cierre, abrigada, personalizada con nombre, número o logo. |
| Canilleras | Deportes | $ 14.000 | 25 | Sí | Canilleras livianas estampadas con tu nombre, tu número o el escudo de tu equipo. |
| Gorra | Accesorios | $ 13.000 | 30 | No | Gorra trucker con frente estampado y regulación atrás. |
| Llavero | Accesorios | $ 3.500 | 100 | No | Llavero con tu foto o tu logo, ideal como souvenir o regalo empresarial. |
| Mousepad | Accesorios | $ 7.500 | 40 | No | Mousepad de 22 × 18 cm con base antideslizante y tu diseño. |
| Almohadón | Accesorios | $ 15.000 | 20 | No | Almohadón de 40 × 40 cm con funda estampada y relleno incluido. |

- Talles: remera, buzo y campera de S a XXL; canilleras S, M y L; el resto, talle único.
- En el pie de la tienda va el aviso **"Sitio de demostración: precios y datos de ejemplo."**
- El JSON-LD de producto va **sin el bloque `offers`**, para no publicar en Google precios de ejemplo como si fueran reales.

## Fotos

- Todas las fotos se generan con IA (Actividad 4 del TFI) y llevan la etiqueta «Generado con IA» (`producto_fotos.generada_con_ia = TRUE`).
- Van en `frontend/public/img/productos/` en WebP; los originales y sus fichas, en `multimedia/`.
- Mientras no existan, cada producto muestra un recuadro con su nombre.

## Base de datos de la primera etapa

- Tablas: `categorias`, `productos`, `producto_fotos`, `consultas` y `preguntas_frecuentes` (ya creadas), y `usuarios` (para el ingreso al panel, en la 004).
- Las demás tablas de `docs/05-DATOS.md` son de la tienda completa.

## Header y footer de la primera etapa

- **Header:** logo y "Catálogo". El panel no se enlaza desde la tienda (se entra por `/admin`).
- **Footer:** isotipo, descripción del negocio, contacto por WhatsApp y el aviso de sitio de demostración. Sin legales ni botón de arrepentimiento, porque no hay compra online.

## Lo que no entra en la primera etapa

Carrito, checkout, Mercado Pago, cuentas de clientes, recuperar contraseña, favoritos, emails, seguimiento de pedidos, reseñas y testimonios (el modelo está en `docs/`, y nunca se inventan), legales de compra online, botón de arrepentimiento, promociones, galería de trabajos, buscador, guía de talles, subida de diseños e imágenes (Cloudinary), Open Graph por producto y sitemap.
