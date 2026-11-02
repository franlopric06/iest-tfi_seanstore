# Verificación 004 · Panel de administración

**Fecha:** 02/11/2026 · **Tests:** backend 164/164 en verde · frontend 258/258 en verde · **Build:** ok · **Lint:** sin avisos

Verificación hecha con la skill `verificar-criterios` sobre el código publicado. Además de los tests, el estudiante probó cada bloque en el sitio publicado (sean-store.vercel.app) con la base de Neon y el Blob reales.

## Bloque 1 · Ingreso y edición rápida

| Requisito | Resultado | Evidencia (test y archivo) | Si falla: ¿código o spec? |
| --- | --- | --- | --- |
| B1-R1 | Cumple | `Header.test.jsx` › “sin sesión muestra el enlace accesible Ingresar…” y “con sesión muestra Panel y salir…”. `Header.jsx`. | — |
| B1-R2 | Cumple | `Ingresar.test.jsx` › “presenta labels accesibles, foco visible y noindex” y los casos de error 401, 429, 503 y sin conexión. `Ingresar.jsx`. | — |
| B1-R3 | Cumple | `esquema-panel.sql` (tabla `administradores` con `CHECK (id = 1)` y email en minúsculas). Prueba manual: el estudiante ejecutó el script en Neon el 29/10. | — |
| B1-R4 | Cumple | `generar-hash.test.js` › “lee sin eco… muestra solamente el hash” y “rechaza la ejecución si no hay una terminal interactiva”; `contrasena.test.js` (12 caracteres mínimo, 72 bytes máximo). | — |
| B1-R5 | Cumple | `auth.test.js` › “normaliza el email, compara bcrypt y firma JWT HS256 con expiración de dos horas”. `auth.controller.js`. | — |
| B1-R6 | Cumple | `auth.test.js` › “responde igual ante email inexistente o contraseña incorrecta, sin filtrar datos”. Se compara contra un hash falso para que el tiempo de respuesta no delate si el email existe. | — |
| B1-R7 | Cumple | `limiteIngreso.test.js` (cinco fallos pasan, el sexto da 429, reinicio por éxito, ventana de 15 min, contador por IP) y `auth.routes.test.js`. | — |
| B1-R8 | Cumple | `backend/.env.ejemplo` tiene `JWT_SECRET` con un valor de muestra que dice que no se use en producción. El secreto real está solo en Vercel y en el `.env` local, que no se sube. | — |
| B1-R9 | Cumple | `sesion.test.js` › “guarda y lee el token desde sessionStorage”; `api.test.js` (cabecera `Authorization: Bearer`). | — |
| B1-R10 | Cumple | `sesion.test.js` › “borra y devuelve null si el token está vencido”; `api.test.js` (ante 401 borra la sesión y lleva a `/ingresar`). | — |
| B1-R11 | Cumple | `Header.test.jsx` › “con sesión muestra Panel y salir borra el token y navega a /ingresar”. | — |
| B1-R12 | Cumple | `requiereAdmin.test.js` (token ausente, inválido, vencido, otro algoritmo y falta de secreto) y los casos “requiere sesión” de cada ruta admin. El middleware se aplica una sola vez en `admin.routes.js`. | — |
| B1-R13 | Cumple | `RutaProtegida.test.jsx`; `Ingresar`, `Panel` y `EditarProducto` usan `indexar={false}`. El sitio no tiene sitemap. | — |
| B1-R14 | Cumple | `admin.productos.test.js` › “lista productos activos e inactivos junto con el código”. | — |
| B1-R15 | Cumple | `TablaProductos.test.jsx` (guarda, confirma, informa el error y deja Guardar apagado sin cambios). | — |
| B1-R16 | Cumple | `admin.productos.test.js` (rechazos de la edición rápida); `validaciones/producto.test.js`. | — |
| B1-R17 | Cumple | Todas las consultas usan `$1`, `$2`…; `auth.test.js` › “no expone errores de base de datos en la respuesta”; el manejador de errores de `app.js` responde un mensaje genérico. | — |
| B1-R18 | Cumple | `app.test.js` › “permite CORS solo desde FRONTEND_URL” y “responde a preflight con las cabeceras y métodos acordados” (incluye PUT, que se agregó para las fotos del taller). | — |
| B1-R19 | Cumple | `auth.test.js` y `requiereAdmin.test.js` › “devuelve 503 si falta JWT_SECRET”. | — |

## Bloque 2 · Productos completos

| Requisito | Resultado | Evidencia (test y archivo) | Si falla: ¿código o spec? |
| --- | --- | --- | --- |
| B2-R1 | Cumple | `admin.productos.test.js` (POST); `FormularioProducto.test.jsx`; `EditarProducto.test.jsx` › “crea el producto y abre su pantalla para agregarle fotos”. | — |
| B2-R2 | Cumple | `generarCodigo.test.js` (prefijos del catálogo, `PRO` si no hay letras, número siguiente sin reusar los borrados, tres dígitos); `admin.productos.test.js` (reintento ante código repetido y 409). | — |
| B2-R3 | Cumple | `generarSlug.test.js`; `admin.productos.test.js`. | — |
| B2-R4 | Cumple | `admin.productos.test.js` (PATCH completo sin tocar código ni slug); `EditarProducto.test.jsx` › “carga el producto…” y “guarda los cambios y vuelve a la lista con el aviso”. | — |
| B2-R5 | Cumple | `admin.productos.test.js` (estado); `GestionProductos.test.jsx` › “oculta un producto activo sin borrarlo…” y “vuelve a mostrar un producto oculto”. | — |
| B2-R6 | Cumple | `validaciones/producto.test.js`; `admin.productos.test.js` (precio negativo, stock decimal, categoría inexistente). | — |

## Bloque 3 · Fotos de productos

| Requisito | Resultado | Evidencia (test y archivo) | Si falla: ¿código o spec? |
| --- | --- | --- | --- |
| B3-R1 | Cumple | `validaciones/imagen.test.js` (reconoce JPG, PNG y WebP por sus primeros bytes); `admin.fotos.test.js` › “sube la foto a Blob y la guarda al final…”. | — |
| B3-R2 | Cumple (con cambio) | `almacenamiento.test.js`; `admin.fotos.test.js`. Vercel conecta ahora los Blob nuevos con `BLOB_STORE_ID` y un token OIDC, no con `BLOB_READ_WRITE_TOKEN`; el código acepta las dos formas. | Spec: se actualizó el texto del requisito (fase 7, cambio del 29/10). |
| B3-R3 | Cumple | `validaciones/imagen.test.js` (archivo falso aunque diga .jpg, vacío, más de 2 MB, alt vacío); `admin.fotos.test.js` (413 y 400); `FotosProducto.test.jsx` (aviso antes de enviar). | — |
| B3-R4 | Cumple | `admin.fotos.test.js` › “borra primero el archivo, después la fila, y renumera” y “si no se pudo borrar el archivo, conserva la fila”; `almacenamiento.test.js` (nunca borra rutas del proyecto). | — |
| B3-R5 | Cumple | `admin.fotos.test.js` › “deja como principal la foto elegida”; `FotosProducto.test.jsx` › “elige otra foto como principal”. | — |
| B3-R6 | Cumple | `admin.fotos.test.js` › “sin sesión no recibe ni procesa el archivo”. El token del Blob solo se usa en `services/almacenamiento.js` del backend. | — |
| B3-R7 | Cumple | `seoDetalle.test.js` › “antepone el sitio a las rutas del proyecto y deja intactas las URL de Blob”. | — |

## Bloque 4 · Nuestro taller desde la base

| Requisito | Resultado | Evidencia (test y archivo) | Si falla: ¿código o spec? |
| --- | --- | --- | --- |
| B4-R1 | Cumple | `esquema-panel.sql` (fila única con `CHECK (id = 1)`). Prueba manual: ejecutado en Neon el 29/10. Después se agregaron `foto_1_ia` y `foto_2_ia` con `migracion-taller-ia.sql`. | Spec: cambio del 01/11 (marca «Generado con IA» en el taller). |
| B4-R2 | Cumple | `taller.test.js` › “devuelve el contenido público sin autenticación…”. | — |
| B4-R3 | Cumple | `NuestroTaller.test.jsx` (contenido de la API, respaldo ante error o sin fila, leyenda según la marca). | — |
| B4-R4 | Cumple | `admin.taller.test.js`; `EditorTaller.test.jsx` (guardar, estados, marcas de IA). | — |
| B4-R5 | Cumple | `admin.taller.fotos.test.js` › “guarda la foto nueva y devuelve el contenido actualizado”; `FotosTaller.test.jsx`. | — |
| B4-R6 | Cumple | `admin.taller.test.js` (título vacío, largo, párrafo vacío, campos de más, marcas que no son sí o no); `admin.taller.fotos.test.js` (sin alt). | — |
| B4-R7 | Cumple | `admin.taller.fotos.test.js` › “intenta limpiar la anterior recién después de guardar la nueva” y “si falla la limpieza de la anterior, la nueva queda igual”. | — |

## Criterios de finalización
- [x] Los 39 requisitos Alta están verificados en esta tabla.
- [x] Tests backend y frontend en verde; build y lint sin errores.
- [x] Revisado con la skill `revisar-marca`: colores desde tokens, sin colores escritos a mano.
- [x] Probado por el estudiante en el sitio publicado: ingreso, edición rápida, alta, edición, ocultar y mostrar, fotos de productos, texto y fotos del taller.

## Constitución
- Principio 2 (tokens de marca): **ok**. Los componentes nuevos (`ListaDesplegable`, botones de acción, menú del celular) usan los tokens de `index.css`.
- Principio 3 (capas): **ok**. Las llamadas a la API están en `services/api.js`; el único archivo que usa Vercel Blob es `services/almacenamiento.js`.
- Principio 5 (tests): **ok**. Cada requisito tiene al menos un test automático.
- Principio 6 (seguridad): **ok**. Contraseña con bcrypt, JWT con vencimiento, límite de intentos, consultas parametrizadas, archivos revisados por su contenido y ningún secreto en el repositorio ni en el chat.

## Cambios durante el desarrollo (fase 7)
- **29/10:** el Blob se conecta con `BLOB_STORE_ID` (OIDC); se ajustó B3-R2.
- **01/11:** pantalla propia para crear y editar productos, buscador y filtros en la lista, botones Guardar y Cancelar debajo de las fotos, avisos que se borran solos y marca «Generado con IA» en las fotos del taller. Pedidos del estudiante al probar el panel; están anotados al final de `tasks.md`.

## Conclusión
Cumplen **39 de 39 requisitos Alta**. Hubo dos ajustes de spec (B3-R2 y B4-R1) y ninguna falla de código pendiente.
