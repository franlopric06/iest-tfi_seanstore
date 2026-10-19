# 10 · Seguridad

Una tienda maneja **datos personales, contraseñas y pagos**, así que estas reglas son obligatorias.

## Datos sensibles

| Dato | Dónde vive | Quién lo ve |
| --- | --- | --- |
| Nombre, email, teléfono y dirección | Tablas `usuarios`, `pedidos`, `consultas`, `arrepentimientos` | El cliente (los suyos) y el admin |
| Contraseñas | Tabla `usuarios`, solo como hash bcrypt | Nadie, ni el admin |
| Tokens de recuperación | Tabla `tokens_recuperacion`, solo como hash | Nadie |
| Datos de la tarjeta | **Solo en Mercado Pago** (el Payment Brick los convierte en un token) | Nunca pasan por nuestro servidor |
| Diseños subidos | Cloudinary | El cliente que lo subió y el admin |
| Claves y tokens de servicios | `backend/.env` y variables de entorno de Vercel | Nadie más |

## Variables de entorno

```bash
# backend/.env  (NO se sube a GitHub)
PORT=3000
DATABASE_URL=postgresql://usuario:clave@servidor/seanstore
JWT_SECRET=una-frase-larga-y-secreta
MP_ACCESS_TOKEN=APP_USR-xxxx
MP_WEBHOOK_SECRET=xxxx
CLOUDINARY_CLOUD_NAME=xxxx
CLOUDINARY_API_KEY=xxxx
CLOUDINARY_API_SECRET=xxxx
BREVO_API_KEY=xxxx
EMAIL_REMITENTE=pedidos@seanstore.com.ar
FRONTEND_URL=https://seanstore.com.ar
```

```bash
# frontend/.env  (solo datos públicos)
VITE_API_URL=https://seanstore-api.up.railway.app
VITE_MP_PUBLIC_KEY=APP_USR-xxxx
VITE_WHATSAPP=549XXXXXXXXXX
```

- `.env` va en `.gitignore`. Se sube un `.env.example` con los nombres y valores vacíos.
- En el frontend **solo** van variables con prefijo `VITE_`, y nunca claves secretas: todo lo que tiene `VITE_` lo puede ver cualquiera. La `PUBLIC_KEY` de Mercado Pago es pública por diseño; el `ACCESS_TOKEN` jamás.

## Usuarios y sesiones

- Contraseñas con **bcrypt** (costo 10), mínimo 8 caracteres.
- La sesión es un **JWT en cookie `httpOnly`, `secure` y `sameSite=lax`**, que vence a los 7 días.
- Login con **límite de intentos**: 5 fallidos cada 15 minutos por IP.
- Mensaje genérico al loguearse: "Email o contraseña incorrectos", sin decir cuál falló.
- Las rutas `/api/admin/...` pasan por `verificarSesion` **y** `soloAdmin`.
- Un cliente solo ve **sus** pedidos y favoritos: el servidor filtra siempre por el `usuario_id` de la sesión.
- Ocultar el menú de admin no alcanza: la protección real está en el servidor.

## Recuperar contraseña

- Se genera un token aleatorio de 32 bytes (`crypto.randomBytes`); en la base se guarda **solo su hash**.
- El link vence en **1 hora** y sirve **una sola vez**.
- Siempre se responde lo mismo, exista o no el email: "Si el email está registrado, te mandamos un link". Así nadie puede averiguar quién tiene cuenta.
- Máximo 3 pedidos de recuperación por email cada hora.
- Al cambiar la contraseña, se borran los demás tokens de ese usuario.

## Pagos con Mercado Pago

- El cliente paga en el **Payment Brick**: los datos de la tarjeta van directo a Mercado Pago y nosotros solo recibimos un token.
- El monto del pago sale del **total calculado en el servidor** con los precios de la base.
- El pedido pasa a `pagado` **solo** cuando llega el webhook y el servidor **consulta el pago** a Mercado Pago y confirma que está aprobado y que el monto coincide.
- La página `/pago/resultado` solo **muestra** el estado; no cambia nada en la base.
- Se verifica la firma del webhook con `MP_WEBHOOK_SECRET`.
- Si el mismo aviso llega dos veces, no se descuenta stock dos veces (`mp_pago_id` es único).

## Reseñas y testimonios

- Una reseña solo se acepta con un `token_resena` válido de un pedido `entregado`, y solo para productos de ese pedido.
- El servidor ignora cualquier nombre o estrella que no venga del formulario válido; el admin **no puede editar** reseñas.
- Un testimonio no se publica si `permiso` es `false`.

## Consultas a la base

```js
// ✕ MAL: el texto del usuario se pega en el SQL
db.query("SELECT * FROM productos WHERE nombre LIKE '%" + buscar + "%'");

// ✓ BIEN: el valor viaja como parámetro
db.query("SELECT * FROM productos WHERE nombre ILIKE $1", [`%${buscar}%`]);
```

Crear un pedido, confirmar un pago (descontar stock y sumar vendidos) y cancelar un pedido (devolver stock) se hacen dentro de una **transacción**: o se guarda todo o no se guarda nada.

## Validaciones (siempre en el servidor)

- **Pedido:** nombre, email y teléfono obligatorios; al menos un producto; cantidades entre 1 y 500; cada ítem con `diseno_url` de nuestro Cloudinary.
- **Stock:** se revisa al crear el pedido y otra vez al confirmar el pago.
- **Precios:** se toman de la base, nunca del carrito.
- **Envío:** si `tipo_entrega` es `envio`, la dirección es obligatoria.
- **Email:** formato válido y en minúsculas. **Teléfono:** solo números, entre 8 y 15 dígitos.
- **Imágenes:** solo PNG o JPG, máximo 5 MB; se revisa el tipo real del archivo, no solo la extensión.
- **Textos libres** (notas, ideas, comentarios, motivos): máximo 500 caracteres; se guardan como texto plano.
- **Formularios públicos** (consultas, presupuesto, arrepentimiento, reseñas): máximo 10 envíos por IP cada hora.
- **Mensaje de WhatsApp:** se codifica con `encodeURIComponent` antes de armar el enlace `wa.me`, y solo lleva el producto, la variante, la idea y el número de consulta.
- **CORS:** la API solo acepta pedidos desde `FRONTEND_URL`.

## Nunca debe llegar al navegador

- `DATABASE_URL`, `JWT_SECRET`, `MP_ACCESS_TOKEN`, `BREVO_API_KEY` ni ninguna clave secreta
- El `password_hash` o los tokens de ningún usuario
- Datos o pedidos de otros clientes
- Mensajes de error internos o del stack (se muestra uno genérico: "Algo salió mal, probá de nuevo")

## En React

- React ya escapa el texto que muestra: **nunca** usar `dangerouslySetInnerHTML` (tampoco para reseñas, preguntas o promociones).
- No guardar el token ni datos personales en `localStorage`; el carrito solo guarda productos, variantes, cantidades y la URL del diseño.

## Datos personales

- La política de privacidad explica qué datos se piden, para qué y cómo pedir que se borren (Ley 25.326 de Protección de Datos Personales).
- Los emails solo se usan para el pedido, la cuenta y la invitación a reseñar; no se envían publicidades sin permiso.

## Lista de control

- [ ] `.env` fuera de GitHub y `.env.example` subido
- [ ] Rutas de admin probadas sin sesión y con sesión de cliente (deben responder 401 y 403)
- [ ] Un cliente no puede ver pedidos de otro cambiando el código en la URL
- [ ] Pago probado con tarjeta aprobada, rechazada y pendiente
- [ ] Webhook repetido no descuenta stock dos veces
- [ ] Link de recuperación vencido o usado no funciona
- [ ] Subir un archivo que no es imagen es rechazado
- [ ] Límite de intentos funcionando en login y formularios
