# 01 · Contexto

## Problema

Sean's Store vende solo en el local y por WhatsApp. Los clientes no tienen dónde ver **todo lo que se puede personalizar**, así que preguntan una y otra vez lo mismo: qué productos hay, qué talles, qué colores y cuánto sale. Los diseños llegan mezclados con audios y mensajes, los pagos se coordinan a mano y es fácil perder un archivo, confundir un pedido o no saber cuál ya está pagado. Además, solo se puede vender en horario de atención y el negocio no tiene una vidriera online que genere confianza en quien no lo conoce.

## Objetivo

Una **tienda online** donde el cliente pueda, a cualquier hora:

1. Ver el catálogo completo con fotos, precios, ofertas y stock.
2. Elegir talle (con guía de talles), color y cantidad.
3. Subir su diseño o, si no tiene, consultar por WhatsApp para que se lo hagan.
4. Pagar online con Mercado Pago sin salir de la página, o elegir pagar al retirar.
5. Elegir retiro en el local o envío a domicilio.
6. Recibir emails con la confirmación y con cada cambio de estado de su pedido.
7. Resolver dudas con un asistente de preguntas frecuentes o hablar por WhatsApp.
8. Ver opiniones reales de otros compradores y trabajos ya hechos.

Y donde el negocio pueda manejar productos, stock, pedidos, consultas, reseñas, promociones y contenido desde un **panel de administración**, con métricas de ventas.

### Se construye en dos versiones

- **Versión 1 (TFI, octubre 2026):** vidriera online con pedido por WhatsApp. Catálogo con fotos y precios, detalle del producto, pedido por WhatsApp con mensaje armado (con o sin diseño) y asistente de preguntas frecuentes. Los productos y las preguntas se cargan directamente en la base de datos.
- **Versión 2:** subir el diseño, carrito, pago con Mercado Pago, cuentas, emails, seguimiento, reseñas, legales de compra online y panel de administración.

Los puntos 1, 3 (por WhatsApp) y 7 del objetivo entran en la versión 1; el resto, en la versión 2. El detalle está en `02-REQUERIMIENTOS.md`.

## Público

- **Particulares:** regalos de cumpleaños, Día de la Madre, del Padre, aniversarios.
- **Equipos deportivos:** camisetas, camperas y canilleras con nombre y número.
- **Egresados y escuelas:** buzos, camperas y remeras de promo.
- **Emprendedores y empresas:** tazas, termos y gorras con su logo.

La mayoría entra desde el **celular**, muchas veces desde un link compartido por WhatsApp o Instagram.

## Productos y servicios

### Productos sublimables

- Tazas (cerámica y polímero)
- Termos y botellas
- Remeras
- Buzos y camperas
- Gorras
- Canilleras
- Otros: llaveros, mousepads y almohadones

### Servicios

- **Personalización con diseño del cliente:** el cliente sube su imagen y compra online.
- **Diseño a pedido con atención personalizada:** si el cliente no tiene diseño, no compra online. La tienda lo deriva a WhatsApp con un mensaje ya armado (producto, talle, color, cantidad y su idea), y desde ahí Sean's Store charla con él, le arma el diseño, le pasa el precio y coordina el pago.
- **Pedidos por cantidad:** presupuesto especial para equipos, egresados y empresas.

## Cómo compra un cliente

**En la versión 1** (pedido por WhatsApp):

```text
Catálogo → Producto (talle, color, cantidad) → "Tengo mi diseño" o "No tengo diseño" → cuenta su idea
→ "Pedir por WhatsApp" → se guarda la consulta → se abre WhatsApp con el mensaje armado → el negocio lo atiende
```

**En la versión 2:**

**Con diseño propio** (compra online):

```text
Catálogo → Producto (talle, color, sube su diseño) → Carrito → Checkout (datos y entrega)
→ Pago con Mercado Pago en la página → Confirmación con código + email
→ Email en cada cambio de estado → Entrega → Email invitando a dejar su reseña
```

**Sin diseño** (atención personalizada):

```text
Catálogo → Producto → "No tengo diseño" → cuenta su idea → "Consultar por WhatsApp"
→ se guarda la consulta → se abre WhatsApp con el mensaje armado → el negocio lo atiende
```

## Confianza: reglas del negocio

- Las **reseñas son siempre reales**: solo puede opinar quien compró el producto, y el negocio las modera antes de publicarlas. Puede ocultar insultos o spam, pero **nunca inventar ni modificar** una opinión.
- Los **testimonios** que el negocio carga a mano tienen que ser de clientes reales (por ejemplo, mensajes de WhatsApp o Instagram), con su permiso, y se muestran con la etiqueta "Testimonio de cliente".
- No se muestran contadores de ventas ni de visitas inventados.

## Obligaciones legales a tener en cuenta

- Páginas de **términos y condiciones**, **política de privacidad** y **cambios y devoluciones**.
- **Botón de arrepentimiento** visible en todas las páginas de la tienda (Resolución 424/2020 de la Secretaría de Comercio Interior), para pedir la cancelación de una compra.
- Los productos hechos según las indicaciones del cliente pueden quedar fuera del derecho de arrepentimiento (Código Civil y Comercial, art. 1116), salvo fallas. Esto se aclara en "Cambios y devoluciones".
- Los textos legales definitivos los completa el negocio, idealmente revisados por un profesional. El sitio trae la estructura con secciones y marcadores `[a completar]`.

## No incluye (por ahora)

- Editor de diseño en el navegador o vista previa 3D del producto (solo hay una vista previa plana e ilustrativa del diseño sobre la foto).
- Integración automática con correos (Andreani, Correo Argentino); el envío y su costo se coordinan a mano.
- Cupones de descuento y programa de puntos (las promociones se muestran como avisos).
- Facturación electrónica automática.
- Asistente con inteligencia artificial generativa (por ahora responde con las preguntas frecuentes cargadas en el panel).
- App para celular (el sitio funciona en el navegador del celular).
