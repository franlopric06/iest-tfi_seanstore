# Spec 004-panel · Panel de administración

**RF de origen:** RF34, RF35 y RF38 (adaptados); RF37 se excluye porque esta entrega no guarda ni administra consultas · **Estado:** aprobada · **Fecha:** 29/10/2026

## Contexto

El panel permite que el administrador gestione los productos de demostración, sus fotos y el contenido de la sección «Nuestro taller» sin editar la base manualmente. El único administrador se crea por SQL en Neon; no existe registro público. El alcance se implementa en cuatro bloques ordenados, cada uno priorizado como Alta para poder detener la entrega entre bloques. Los cambios de contenido se muestran en la tienda pública a través de la API.

## Historias de usuario

- Como administrador, quiero ingresar de forma segura para editar los datos que ve la tienda.
- Como administrador, quiero corregir rápidamente precio, stock y destacados, y después gestionar todos los campos de los productos.
- Como administrador, quiero mantener las fotos de los productos en Vercel Blob y definir su foto principal.
- Como administrador, quiero actualizar el texto y las imágenes de «Nuestro taller» desde el panel.
- Como visitante, quiero ver el contenido público del taller y que la portada conserve un respaldo si la API no está disponible.

## Requisitos (EARS)

Todos los requisitos incluidos en estos cuatro bloques tienen prioridad **Alta**.

| ID | Bloque | Tipo | Requisito | Prioridad |
| --- | --- | --- | --- | --- |
| B1-R1 | 1 · Ingreso y edición rápida | Por estado | El header deberá mostrar «Ingresar» y navegar a `/ingresar` cuando no haya sesión; si el administrador está autenticado, deberá ofrecer «Salir». | Alta |
| B1-R2 | 1 · Ingreso y edición rápida | Ubicuo | El sistema deberá presentar en `/ingresar` un formulario de email y contraseña con etiquetas asociadas, navegación por teclado y foco visible; los errores del formulario se mostrarán con `role="alert"`. | Alta |
| B1-R3 | 1 · Ingreso y edición rápida | Ubicuo | El sistema deberá crear `administradores` con los campos `id`, `email` único en minúsculas, `contrasena_hash` y `creado_en`, limitando la tabla a una sola cuenta, sin reutilizar `usuarios` ni permitir registro público. | Alta |
| B1-R4 | 1 · Ingreso y edición rápida | Ubicuo | El sistema deberá proporcionar `backend/src/db/esquema-panel.sql` para que el estudiante cree las tablas nuevas en Neon y `backend/scripts/generar-hash.js`, que solicitará la contraseña de forma interactiva y sin eco visible, exigirá al menos 12 caracteres y rechazará más de 72 bytes UTF-8, no la escribirá en el repositorio y mostrará únicamente su hash bcrypt de costo 12. | Alta |
| B1-R5 | 1 · Ingreso y edición rápida | Por evento | Cuando `POST /api/auth/ingresar` reciba credenciales válidas de un administrador, el sistema deberá normalizar el email, responder con un JWT firmado usando `JWT_SECRET` del entorno del backend y darle expiración de 2 horas. | Alta |
| B1-R6 | 1 · Ingreso y edición rápida | No deseado | Si el email o la contraseña no son válidos, el sistema deberá responder `401` con el mismo mensaje genérico «Email o contraseña incorrectos», sin revelar cuál dato falló ni si existe el administrador. | Alta |
| B1-R7 | 1 · Ingreso y edición rápida | No deseado | Si una IP acumula 5 intentos fallidos de ingreso dentro de 15 minutos, el sistema deberá responder normalmente a esos intentos y responder `429` a los posteriores hasta que venza la ventana; un ingreso exitoso deberá reiniciar el contador de esa IP. Para identificar la IP real detrás del proxy, la API deberá configurar `app.set('trust proxy', 1)`. | Alta |
| B1-R8 | 1 · Ingreso y edición rápida | Ubicuo | El archivo `backend/.env.ejemplo` deberá incluir `JWT_SECRET` con un valor de muestra claramente no secreto y no apto para producción; el secreto real solo vivirá en el entorno privado del backend. | Alta |
| B1-R9 | 1 · Ingreso y edición rápida | Por evento | Cuando el ingreso sea exitoso, el frontend deberá guardar el JWT en `sessionStorage` y enviar las solicitudes protegidas mediante la cabecera `Authorization` con esquema Bearer; no deberá guardar el token en `localStorage`. | Alta |
| B1-R10 | 1 · Ingreso y edición rápida | No deseado | Si el JWT vence o una solicitud autenticada recibe `401`, el frontend deberá borrar el token y redirigir a `/ingresar`. | Alta |
| B1-R11 | 1 · Ingreso y edición rápida | Por evento | Cuando el administrador active «Salir», el frontend deberá borrar el token de `sessionStorage` y navegar a `/ingresar`. | Alta |
| B1-R12 | 1 · Ingreso y edición rápida | Ubicuo | El middleware `requiereAdmin` deberá proteger todas las rutas bajo `/api/admin/*` y responder `401` ante token ausente, inválido o vencido; si `JWT_SECRET` no está configurado, responderá `503` sin aceptar tokens. | Alta |
| B1-R13 | 1 · Ingreso y edición rápida | Por estado | Mientras no exista un token válido, `/admin` deberá redirigir a `/ingresar`; `/ingresar` y `/admin` deberán incluir `noindex` y no formar parte del sitemap. | Alta |
| B1-R14 | 1 · Ingreso y edición rápida | Por evento | Cuando el administrador abra la lista del panel, el sistema deberá mostrar todos los productos, incluidos los que tienen `activo = false`, junto con su código generado. | Alta |
| B1-R15 | 1 · Ingreso y edición rápida | Por evento | Cuando el administrador guarde la edición rápida de un producto, el frontend deberá enviar precio, stock y destacado a `PATCH /api/admin/productos/:id` y mostrar explícitamente el resultado exitoso o el error. | Alta |
| B1-R16 | 1 · Ingreso y edición rápida | No deseado | Si el precio es menor que cero, el stock no es un entero mayor o igual a cero, o destacado no es booleano, el servidor deberá rechazar el PATCH sin modificar el producto. | Alta |
| B1-R17 | 1 · Ingreso y edición rápida | Ubicuo | El sistema deberá realizar consultas SQL parametrizadas; los datos de formularios se validarán en el servidor y los errores no expondrán stack traces, hashes ni secretos. | Alta |
| B1-R18 | 1 · Ingreso y edición rápida | Ubicuo | La API deberá permitir únicamente solicitudes CORS desde el origen configurado en `FRONTEND_URL`, habilitando las cabeceras `Authorization` y `Content-Type`, y los métodos de negocio `GET`, `POST`, `PATCH` y `DELETE`; deberá responder a `OPTIONS` únicamente para las preflight CORS. | Alta |
| B1-R19 | 1 · Ingreso y edición rápida | No deseado | Si `JWT_SECRET` no está configurado, el backend podrá iniciar, pero deberá deshabilitar el login y las rutas protegidas, responder `503` con un error explícito de configuración y no usar un secreto de respaldo. | Alta |
| B2-R1 | 2 · Productos completos | Por evento | Cuando el administrador cree un producto, el sistema deberá aceptar nombre, categoría existente, precio, stock, descripción, talles, colores y destacado, y validar esos datos en el servidor. | Alta |
| B2-R2 | 2 · Productos completos | Por evento | Cuando se cree un producto, el servidor deberá generar su `codigo` con el formato de los códigos existentes (`PREFIJO-NNN`), asignar un sufijo numérico al final si el código ya existe y garantizar que no se repita; el código no se editará ni aparecerá en el formulario de alta, pero sí en la lista. | Alta |
| B2-R3 | 2 · Productos completos | Por evento | Cuando el administrador cree un producto, el sistema deberá generar el `slug` a partir del nombre y asegurar su unicidad antes de guardarlo. | Alta |
| B2-R4 | 2 · Productos completos | Por evento | Cuando el administrador edite un producto existente, el sistema deberá permitir actualizar nombre, categoría existente, precio, stock, descripción, talles, colores y destacado, manteniendo el código generado; editar el nombre no deberá cambiar el `slug` existente para preservar enlaces compartidos. | Alta |
| B2-R5 | 2 · Productos completos | Por evento | Cuando el administrador oculte un producto, el sistema deberá establecer `activo = false` sin borrar la fila de la base; cuando lo reactive, deberá establecer `activo = true`. | Alta |
| B2-R6 | 2 · Productos completos | No deseado | Si el precio es negativo, el stock no es un entero no negativo, destacado o activo no es booleano, o la categoría no existe, el servidor deberá rechazar la operación sin guardar cambios. | Alta |
| B3-R1 | 3 · Fotos de productos | Por evento | Cuando un administrador autenticado suba una foto de producto, el servidor deberá aceptar únicamente JPG, PNG o WebP cuyo contenido corresponda al tipo declarado y cuyo tamaño no supere 2 MB. | Alta |
| B3-R2 | 3 · Fotos de productos | Por evento | Cuando se suba una foto válida, el backend deberá guardarla en Vercel Blob mediante `BLOB_READ_WRITE_TOKEN` privado del backend y registrar su URL absoluta, alt descriptivo y `generada_con_ia` en `producto_fotos`; `generada_con_ia` será opcional y por defecto `false`. | Alta |
| B3-R3 | 3 · Fotos de productos | No deseado | Si el archivo excede 2 MB, es de tipo no admitido, su contenido no coincide con su formato o falta un alt descriptivo, el sistema deberá rechazarlo sin guardarlo como foto del producto. | Alta |
| B3-R4 | 3 · Fotos de productos | Por evento | Cuando el administrador elimine una foto con URL absoluta `https://`, el sistema deberá borrar primero el objeto de Vercel Blob y luego quitar la fila de la base; ante fallo de Blob o de base, deberá informar el error y conservar la referencia en la base. Si la URL es relativa, deberá quitar solo la fila, sin intentar borrarla de Blob. | Alta |
| B3-R5 | 3 · Fotos de productos | Por evento | Cuando el administrador elija una foto principal, el sistema deberá asignarle `orden = 1` y mantener un orden válido para las demás fotos del producto. | Alta |
| B3-R6 | 3 · Fotos de productos | Ubicuo | El sistema deberá requerir autenticación de administrador para subir, eliminar o reordenar fotos; nunca expondrá `BLOB_READ_WRITE_TOKEN` al navegador. | Alta |
| B3-R7 | 3 · Fotos de productos | Por estado | Cuando `seoDetalle.js` o las tarjetas formen la URL de una foto, deberán usarla tal cual si empieza con `https://` y anteponer `URL_SITIO` únicamente a las rutas relativas. | Alta |
| B4-R1 | 4 · Nuestro taller desde la base | Ubicuo | El sistema deberá crear mediante `backend/src/db/esquema-panel.sql` una tabla `contenido_taller` limitada a una sola fila, con `titulo`, `parrafo`, `foto_1_url`, `foto_1_alt`, `foto_2_url`, `foto_2_alt` y `actualizado_en`, y cargar en ella los valores actuales de la sección de portada. | Alta |
| B4-R2 | 4 · Nuestro taller desde la base | Por evento | Cuando se solicite `GET /api/taller`, el backend deberá devolver el registro público de `contenido_taller` sin requerir autenticación. | Alta |
| B4-R3 | 4 · Nuestro taller desde la base | Por evento | Cuando la portada obtenga correctamente el contenido de `GET /api/taller`, deberá mostrar título, párrafo, fotos y alts devueltos por la API; si la petición falla o no hay registro, deberá usar los textos y fotos de respaldo definidos en `data/textos.js`. | Alta |
| B4-R4 | 4 · Nuestro taller desde la base | Por evento | Cuando el administrador abra la pestaña «Nuestro taller», el panel deberá permitir editar título y párrafo, guardar los cambios y mostrar el resultado de la operación. | Alta |
| B4-R5 | 4 · Nuestro taller desde la base | Por evento | Cuando el administrador cambie cualquiera de las dos fotos del taller, el sistema deberá aceptar una nueva imagen con las mismas reglas de formato y tamaño de B3-R1, guardar su URL y exigir un texto alternativo descriptivo no vacío; después de confirmar el cambio en la base, deberá borrar la foto anterior de Blob solo si su URL empieza con `https://`. | Alta |
| B4-R6 | 4 · Nuestro taller desde la base | No deseado | Si el título, párrafo o alt obligatorio no cumple la validación del servidor, el sistema deberá rechazar el cambio y conservar el contenido anterior. | Alta |
| B4-R7 | 4 · Nuestro taller desde la base | No deseado | Si falla el borrado en Blob de la foto anterior después de guardar una nueva, el sistema deberá conservar la nueva foto activa e informar el fallo de limpieza; si la URL anterior era relativa, no deberá intentar borrarla de Blob. | Alta |

## Casos límite

- Si no hay filas en `administradores` o las credenciales no coinciden, el ingreso responde con el mismo `401` genérico; los primeros cinco fallos por IP dentro de 15 minutos reciben su respuesta normal y los intentos siguientes reciben `429`. Un ingreso correcto reinicia el contador. El contador vive en la memoria de cada instancia de Vercel, así que el límite no es exacto entre instancias; `app.set('trust proxy', 1)` permite leer la IP real detrás del proxy.
- Si falta `JWT_SECRET`, el backend sigue disponible para rutas públicas, pero el ingreso y las rutas protegidas quedan deshabilitados y responden `503` con un error explícito de configuración; nunca se usa un secreto de respaldo.
- Un JWT ausente, manipulado o vencido no habilita ninguna ruta `/api/admin/*`; la sesión del navegador termina al cerrar la pestaña porque se usa `sessionStorage`.
- El formulario de productos rechaza precio `NaN`, infinito o negativo; stock decimal, negativo o ausente; arrays inválidos y categorías inexistentes. La edición rápida puede cambiar únicamente precio, stock y destacado.
- Si dos productos generarían el mismo código o slug, el backend añade un sufijo numérico hasta obtener un valor único, sin reemplazar productos existentes.
- Una foto de exactamente 2 MB se acepta si su formato es válido; una mayor, un archivo vacío, un MIME/extension engañosos o contenido corrupto se rechazan. La falla de Blob o de base se informa como error, no como carga exitosa. Al borrar una foto local de URL relativa, solo se elimina su fila; para una URL Blob se intenta borrar el objeto antes de la fila y se conserva la referencia si ocurre un error.
- Las fotos actuales de productos y del taller tienen URLs relativas a archivos del proyecto; al reemplazar una foto del taller, primero se guarda la nueva y luego se elimina la anterior solo si era una URL absoluta de Blob. Si falla la limpieza, la nueva foto sigue activa y el panel informa el error.
- Las URLs de fotos almacenadas en Vercel Blob son absolutas; las rutas relativas locales se completan con `URL_SITIO`, sin prefijar las absolutas.
- Si falla el borrado en Blob o en la base, el panel informa el error y no confirma que la foto desapareció. Si se selecciona otra foto principal, esta queda como orden 1.
- Si la API pública del taller falla o la tabla todavía no tiene una fila, la portada muestra el respaldo de `textos.js`; el panel informa errores al guardar sin perder silenciosamente el contenido anterior.
- Los formularios de ingreso, producto, fotos y taller deben poder usarse a 360 px, con teclado, etiquetas accesibles, foco visible y errores con `role="alert"`.
- `/ingresar` y `/admin` no se indexan; no se incluyen en el sitemap de la entrega.
- RF37 de `docs/02-REQUERIMIENTOS.md` se refiere a consultas administradas y queda fuera de esta adaptación; no se persisten consultas de WhatsApp.

## Fuera de alcance

- Registro de clientes, varios administradores, roles, recuperación de contraseña y gestión de sesiones de clientes.
- Consultas de WhatsApp guardadas o administradas.
- Edición de categorías, pedidos, reseñas, testimonios, preguntas frecuentes, promociones, medios de pago, métricas y otros contenidos no mencionados en los cuatro bloques.
- Eliminación física de productos, subida de diseños de clientes, Cloudinary, pagos, carrito y checkout.

## Criterios de finalización

- [ ] Todos los requisitos Alta cumplen en `verificacion.md`.
- [ ] Tests en verde y build sin errores.
- [ ] Tests de API con Supertest y mocks de `conexion.js`, bcrypt, jsonwebtoken y Vercel Blob; sin servicios reales.
- [ ] Revisado con la skill `revisar-marca`.

## Historial de cambios

| Fecha | Cambio | Motivo |
| --- | --- | --- |
| 29/10/2026 | Spec inicial dividida en cuatro bloques Alta | Pedido de incorporar el panel a la primera entrega; la docente lo solicitó el 28/10 |
| 29/10/2026 | Clarificación aprobada: límites de login, CORS, configuración JWT, contraseña, y limpieza de fotos locales y Blob | Decisiones del estudiante para cerrar ambigüedades que afectan implementación y seguridad |
