# Plan 004-panel · Panel de administración

**Spec:** aprobada · **Clarificación:** cerrada · **Estado del plan:** pendiente de aprobación

## Resumen

Se implementará el panel en cuatro bloques, siguiendo el orden acordado: autenticación y edición rápida, productos completos, fotos y contenido de Nuestro taller.
El backend mantendrá rutas, controladores, middleware, validaciones y almacenamiento separados; las consultas a PostgreSQL pasarán únicamente por `db/conexion.js`.
El frontend agregará sesión en `sessionStorage`, rutas administrativas diferidas y componentes de formulario separados por responsabilidad; las llamadas HTTP nuevas se integrarán en `services/api.js`.
Las funciones puras de generación/validación y las rutas se probarán con Vitest y Supertest, mocks de base, bcrypt, JWT y Blob, sin acceder a servicios reales.
Se respetarán los tokens y patrones visuales aprobados, los estados de carga/vacío/error y la accesibilidad de formularios.

## Por requisito

### Bloque 1 · Ingreso y edición rápida

| Requisito | Qué se hace | Archivos (crear o modificar) | Test que lo prueba |
| --- | --- | --- | --- |
| B1-R1 | El header muestra Ingresar sin sesión y Salir con sesión; salir limpia el token. | `frontend/src/components/layout/Header.jsx` (modificar), `frontend/src/hooks/useSesion.js` (crear), `frontend/src/utils/sesion.js` (crear) | `frontend/tests/Header.test.jsx`, `frontend/tests/useSesion.test.js`, `frontend/tests/sesion.test.js` |
| B1-R2 | Formulario accesible de ingreso, con etiquetas asociadas, foco visible y errores anunciados. | `frontend/src/pages/admin/Ingresar.jsx` (crear), `frontend/src/services/api.js` (modificar) | `frontend/tests/Ingresar.test.jsx`, `frontend/tests/api.test.js` |
| B1-R3–R4 | Crear tabla singleton `administradores` con email único normalizado; crear esquema SQL y un generador interactivo de hash sin eco. La validación exige mínimo 12 caracteres y máximo 72 bytes UTF-8; el hash usa bcrypt costo 12. | `backend/src/db/esquema-panel.sql` (crear), `backend/src/utils/contrasena.js` (crear), `backend/scripts/generar-hash.js` (crear) | `backend/tests/utils/contrasena.test.js` (validación y hash bcrypt mockeado); el estudiante revisa el SQL antes de ejecutarlo en Neon |
| B1-R5–R6 | `POST /api/auth/ingresar` normaliza email, compara bcrypt y devuelve JWT de dos horas; credenciales inválidas comparten respuesta genérica 401. | `backend/src/routes/auth.routes.js` (crear), `backend/src/controllers/auth.controller.js` (crear), `backend/src/db/conexion.js` (usar) | `backend/tests/auth.test.js` (éxito, email normalizado, credenciales incorrectas y error de base) |
| B1-R7 | Contar solo fallos por IP, aceptar cinco fallos y devolver 429 desde el siguiente intento; al autenticar correctamente, reiniciar el contador de esa IP; obtener IP real con trust proxy. Se conserva la limitación conocida de memoria por instancia. | `backend/src/middleware/limiteIngreso.js` (crear), `backend/src/app.js` y `backend/src/controllers/auth.controller.js` (modificar) | `backend/tests/limiteIngreso.test.js` (cinco fallos, sexto bloqueado, éxito reinicia, IP y ventana) |
| B1-R8, B1-R19 | Añadir `JWT_SECRET` de ejemplo no secreto; si falta en producción, la API pública sigue activa pero login y rutas del panel dan 503 sin secreto alternativo. | `backend/.env.ejemplo` (modificar), `backend/src/middleware/requiereAdmin.js` (crear), `backend/src/controllers/auth.controller.js` (crear) | `backend/tests/requiereAdmin.test.js`, `backend/tests/auth.test.js` (configuración ausente) |
| B1-R9–R11 | Guardar/leer/borrar JWT solo en `sessionStorage`; adjuntar la cabecera Bearer a llamadas protegidas; al 401 borrar sesión y redirigir; salir lleva a `/ingresar`. | `frontend/src/utils/sesion.js` (crear), `frontend/src/hooks/useSesion.js` (crear), `frontend/src/services/api.js` (modificar), `frontend/src/components/layout/Header.jsx` (modificar) | `frontend/tests/sesion.test.js`, `frontend/tests/useSesion.test.js`, `frontend/tests/api.test.js`, `frontend/tests/Header.test.jsx` |
| B1-R12–R13 | Proteger API admin con JWT verificado únicamente mediante algoritmo HS256 y proteger `/admin`; agregar noindex a ingreso y panel. Esta etapa no genera sitemap. | `backend/src/middleware/requiereAdmin.js` (crear), `frontend/src/components/admin/RutaProtegida.jsx` (crear), `frontend/src/App.jsx` (modificar), `frontend/src/pages/admin/Ingresar.jsx` y `Panel.jsx` (crear) | `backend/tests/requiereAdmin.test.js` (incluye algoritmo permitido/rechazado), `frontend/tests/RutaProtegida.test.jsx`, `frontend/tests/App.test.jsx` |
| B1-R14–R16 | Listar productos activos e inactivos; editar precio, stock y destacado por separado; validar tipos y rangos en backend; mostrar resultado del guardado. | `backend/src/routes/admin.productos.routes.js` (crear), `backend/src/controllers/admin.productos.controller.js` (crear), `frontend/src/components/admin/TablaProductos.jsx` (crear), `frontend/src/pages/admin/Panel.jsx` (crear), `frontend/src/services/api.js` (modificar) | `backend/tests/admin.productos.test.js`, `frontend/tests/TablaProductos.test.jsx`, `frontend/tests/Panel.test.jsx` |
| B1-R17 | Parametrizar consultas, validar entrada en el backend y no exponer detalles internos, hashes ni secretos. | Controladores del bloque y `backend/src/db/conexion.js` | Tests de error/validación de `auth.test.js`, `admin.productos.test.js` y `requiereAdmin.test.js`; revisión estática de consultas parametrizadas |
| B1-R18 | CORS solo desde `FRONTEND_URL`, admitir `Authorization` y `Content-Type`, métodos de negocio acordados y responder OPTIONS a preflight. | `backend/src/app.js` (modificar) | `backend/tests/app.test.js` (origen permitido/rechazado, headers, métodos y preflight) |

### Bloque 2 · Productos completos

| Requisito | Qué se hace | Archivos (crear o modificar) | Test que lo prueba |
| --- | --- | --- | --- |
| B2-R1 | Validar nombre, categoría existente, precio, stock, descripción, talles, colores y destacado con una función pura reutilizable. | `backend/src/validaciones/producto.js` (crear), `backend/src/controllers/admin.productos.controller.js` (modificar) | `backend/tests/validaciones/producto.test.js`, `backend/tests/admin.productos.test.js` |
| B2-R2 | Generar código con prefijo del producto y consecutivo; ante colisión, agregar sufijo numérico y resolver concurrencia con la restricción única de base/reintento. El código se oculta del formulario y se muestra en el listado. | `backend/src/utils/generarCodigo.js` (crear), `backend/src/controllers/admin.productos.controller.js` (modificar), `frontend/src/components/admin/TablaProductos.jsx` (modificar), `frontend/src/components/admin/FormularioProducto.jsx` (crear) | `backend/tests/generarCodigo.test.js`, `backend/tests/admin.productos.test.js`, `frontend/tests/FormularioProducto.test.jsx` |
| B2-R3 | Crear slug a partir del nombre y volverlo único sin alterar slugs de productos ya creados. | `backend/src/utils/generarSlug.js` (crear), `backend/src/controllers/admin.productos.controller.js` (modificar) | `backend/tests/generarSlug.test.js`, `backend/tests/admin.productos.test.js` |
| B2-R4 | Formulario común para alta/edición completa; editar nombre no modifica slug ni código existentes. | `frontend/src/components/admin/FormularioProducto.jsx` (crear), `frontend/src/components/admin/TablaProductos.jsx` (modificar), `backend/src/controllers/admin.productos.controller.js` (modificar) | `frontend/tests/FormularioProducto.test.jsx`, `backend/tests/admin.productos.test.js` |
| B2-R5–R6 | Ocultar/reactivar mediante `activo`; validar activo, destacado, categoría, precio y stock en el servidor; rechazar datos inválidos sin persistir. | `backend/src/routes/admin.productos.routes.js` y `controllers/admin.productos.controller.js` (modificar), `backend/src/validaciones/producto.js` (crear), `frontend/src/components/admin/TablaProductos.jsx` (modificar) | `backend/tests/admin.productos.test.js`, `backend/tests/validaciones/producto.test.js`, `frontend/tests/TablaProductos.test.jsx` |

### Bloque 3 · Fotos de productos

| Requisito | Qué se hace | Archivos (crear o modificar) | Test que lo prueba |
| --- | --- | --- | --- |
| B3-R1, B3-R3 | Recibir multipart en memoria con Multer `memoryStorage` y límite de 2 MB; validar tipo permitido y contenido real JPG/PNG/WebP; rechazar vacío, corrupto, extensión/MIME engañosos o alt ausente. No usar almacenamiento en disco. | `backend/src/routes/admin.fotos.routes.js` (crear), `backend/src/controllers/admin.fotos.controller.js` (crear), `backend/src/validaciones/imagen.js` (crear) | `backend/tests/admin.fotos.test.js`, `backend/tests/validaciones/imagen.test.js` (incluye configuración memoryStorage y límite) |
| B3-R2, B3-R6 | Único servicio backend que usa `@vercel/blob`; subir en backend y guardar URL absoluta, alt y `generada_con_ia` default false. Operaciones protegidas y token Blob nunca llega al navegador. | `backend/src/services/almacenamiento.js` (crear), `backend/src/controllers/admin.fotos.controller.js` (crear), `backend/src/routes/admin.fotos.routes.js` (crear), `backend/src/db/conexion.js` (usar) | `backend/tests/almacenamiento.test.js`, `backend/tests/admin.fotos.test.js` (Blob y DB mockeados) |
| B3-R4 | Borrar primero objeto Blob y después fila para URL absoluta; una URL relativa solo elimina la fila. Ante error, conservar referencia e informar; no confirmar éxito falso. | `backend/src/services/almacenamiento.js` (crear), `backend/src/controllers/admin.fotos.controller.js` (crear) | `backend/tests/admin.fotos.test.js` (URLs relativas, éxito Blob, fallo Blob y fallo DB) |
| B3-R5 | Elegir foto principal con orden 1 y actualizar órdenes sin duplicar principal. | `backend/src/routes/admin.fotos.routes.js` (crear), `backend/src/controllers/admin.fotos.controller.js` (crear) | `backend/tests/admin.fotos.test.js` (reordenamiento y fallo DB) |
| B3-R7 | Normalizar URLs de imágenes: absoluta `https://` se usa tal cual; `URL_SITIO` se agrega solo a rutas relativas en SEO y tarjetas. | `frontend/src/utils/seoDetalle.js` (modificar), `frontend/src/components/tienda/TarjetaProducto.jsx` (modificar) | `frontend/tests/seoDetalle.test.js`, `frontend/tests/TarjetaProducto.test.jsx` |
| B3-R1–R7 | Mostrar interfaz de fotos por producto, leyenda de IA según el dato y resultados/errores accesibles. | `frontend/src/components/admin/FotosProducto.jsx` (crear), `frontend/src/components/admin/TablaProductos.jsx` o `FormularioProducto.jsx` (integrar), `frontend/src/services/api.js` (modificar) | `frontend/tests/FotosProducto.test.jsx`, `frontend/tests/api.test.js` |

### Bloque 4 · Nuestro taller desde la base

| Requisito | Qué se hace | Archivos (crear o modificar) | Test que lo prueba |
| --- | --- | --- | --- |
| B4-R1 | Ampliar esquema con singleton `contenido_taller` y una fila inicial con los textos, URLs y alts actuales. El esquema no crea administrador; el estudiante revisa el SQL y agrega su cuenta por separado usando el hash generado localmente. | `backend/src/db/esquema-panel.sql` (crear), `frontend/src/data/textos.js` (consultar valores actuales) | Revisión manual del esquema por el estudiante antes de ejecutarlo en Neon |
| B4-R2 | Endpoint público `GET /api/taller` devuelve contenido sin autenticación. | `backend/src/routes/taller.routes.js` (crear), `backend/src/controllers/taller.controller.js` (crear), `backend/src/db/conexion.js` (usar), `backend/src/routes/index.js` (modificar) | `backend/tests/taller.test.js` |
| B4-R3 | NuestroTaller carga API con respaldo de textos/imágenes y alts de `textos.js` ante fallo o ausencia de fila. | `frontend/src/components/inicio/NuestroTaller.jsx` (modificar), `frontend/src/services/api.js` (modificar), `frontend/src/data/textos.js` (fallback existente) | `frontend/tests/NuestroTaller.test.jsx`, `frontend/tests/api.test.js` |
| B4-R4–R6 | Panel permite editar título, párrafo, dos fotos y alts requeridos; valida en servidor, muestra carga/guardado/error y conserva los datos anteriores si el guardado falla. | `backend/src/routes/admin.taller.routes.js` (crear), `backend/src/controllers/admin.taller.controller.js` (crear), `frontend/src/components/admin/EditorTaller.jsx` (crear), `frontend/src/pages/admin/Panel.jsx` (modificar), `frontend/src/services/api.js` (modificar) | `backend/tests/admin.taller.test.js`, `frontend/tests/EditorTaller.test.jsx` |
| B4-R5, B4-R7 | Subir nueva foto, guardar primero URL/alt, y borrar luego la anterior solo si era una URL absoluta Blob; no intentar borrar de Blob una ruta relativa. Si falla limpieza, mantener nueva foto activa e informar error. | `backend/src/controllers/admin.taller.controller.js` (crear), `backend/src/services/almacenamiento.js` (usar), `backend/src/validaciones/imagen.js` (usar) | `backend/tests/admin.taller.test.js` (Blob y DB mockeados; anterior Blob, relativa y fallo al limpiar) |

## API y datos

### Rutas previstas

Las rutas de administración se montan debajo de `/api/admin` y pasan por `requiereAdmin`; el formulario público de ingreso y `GET /api/taller` no requieren sesión.

| Método y ruta | Acceso | Entrada | Respuesta / efecto | Tablas |
| --- | --- | --- | --- | --- |
| `POST /api/auth/ingresar` | Público, con límite por IP | `{ email, contrasena }` | 200 con JWT y vencimiento; 401 genérico en los primeros cinco fallos; 429 desde el sexto fallo dentro de la ventana; 503 si falta `JWT_SECRET` | `administradores` |
| `GET /api/admin/productos` | Admin | — | Lista todos los productos, activos e inactivos, con categoría y fotos | `productos`, `categorias`, `producto_fotos` |
| `POST /api/admin/productos` | Admin | Campos de alta salvo código/slug | Crea y devuelve producto con código y slug únicos | `productos`, `categorias` |
| `PATCH /api/admin/productos/:id` | Admin | Campos editables completos | Actualiza campos sin cambiar código ni slug; valida categoría | `productos`, `categorias` |
| `PATCH /api/admin/productos/:id/edicion-rapida` | Admin | `precio`, `stock`, `destacado` | Guarda solo esos campos y devuelve producto actualizado | `productos` |
| `PATCH /api/admin/productos/:id/estado` | Admin | `{ activo }` | Oculta/reactiva sin borrar fila | `productos` |
| `POST /api/admin/productos/:productoId/fotos` | Admin | Multipart: imagen, alt, `generada_con_ia` opcional | Guarda Blob y fila con URL absoluta; default IA falso | `producto_fotos`, `productos` |
| `DELETE /api/admin/fotos/:fotoId` | Admin | — | Borra Blob primero si URL absoluta; para ruta relativa borra solo fila | `producto_fotos` |
| `PATCH /api/admin/fotos/:fotoId/principal` | Admin | — | Hace principal la foto y mantiene órdenes válidos | `producto_fotos` |
| `GET /api/taller` | Público | — | Contenido actual o respuesta explícita de ausencia; cliente usa fallback local | `contenido_taller` |
| `PATCH /api/admin/taller` | Admin | Título y párrafo | Actualiza la fila única y devuelve contenido | `contenido_taller` |
| `PUT /api/admin/taller/fotos/:numero` | Admin | Multipart: imagen y alt requerido | Guarda la nueva URL antes de intentar limpiar URL Blob previa | `contenido_taller` |

Todas las consultas usarán `consulta(sql, parametros)` de `backend/src/db/conexion.js`. El esquema solo agrega `administradores` y `contenido_taller`; no modifica las tablas existentes ni inserta credenciales. CORS permite el origen exacto `FRONTEND_URL`, las cabeceras `Authorization`/`Content-Type` y las preflight `OPTIONS`; los métodos de negocio son GET, POST, PATCH y DELETE. `trust proxy` se configura en un salto.

## Componentes y pantallas

- **Ingreso (`/ingresar`):** `Ingresar.jsx`, formulario etiquetado con error de login accesible; muestra estado de envío y error, sin requerir estado de carga de datos.
- **Panel (`/admin`):** `RutaProtegida` redirige sin sesión; `Panel.jsx` organiza las secciones «Productos» y «Nuestro taller». Las llamadas de datos muestran carga, estado vacío y error, con opción de reintento donde corresponda.
- **Tabla y formulario de productos:** `TablaProductos` lista activos e inactivos, comunica guardado/error por fila y abre `FormularioProducto` para alta y edición. Inputs inválidos muestran error asociado; la tabla conserva los datos previos si el guardado falla.
- **Fotos:** `FotosProducto` muestra fotos existentes, principal y etiqueta «Generado con IA» según dato; permite subir, borrar y elegir principal, con carga, vacío, éxito y error.
- **Editor del taller:** `EditorTaller` edita texto y dos imágenes con alt obligatorio; muestra carga, contenido, guardado, error y vista actual. `NuestroTaller.jsx` en la portada lee el endpoint público y mantiene el respaldo ya definido en `textos.js`.
- **Rutas diferidas:** `Ingresar` y `Panel` se cargarán con `React.lazy`/`Suspense` y `Cargando`; las páginas de catálogo/inicio ya existentes conservan su carga actual.
- **Accesibilidad y marca:** todos los formularios llevan `label`, `role="alert"` para errores, foco visible y uso por teclado; interfaz adaptable desde 360 px y solo clases/tokens aprobados.

## Riesgos

- **Configuración de despliegue:** cargar `JWT_SECRET` y `BLOB_READ_WRITE_TOKEN` como variables privadas en Vercel y añadir nombres/valores claramente no secretos a `backend/.env.ejemplo`; no incluir credenciales reales en repo ni chat. Si falta `JWT_SECRET`, la API pública sigue disponible pero login/admin devuelven 503.
- **SQL en Neon:** el estudiante ejecuta `backend/src/db/esquema-panel.sql` manualmente en Neon; probar el script con tests/mocks, nunca contra la base real. La cuenta admin se inserta aparte usando el hash local.
- **Limitador en Vercel:** contadores en memoria por instancia no son globales ni exactos; mantener la limitación explicitada en la spec y probar unidad por instancia.
- **Operaciones Blob/base no transaccionales:** conservar la fila si falla el borrado Blob, y para el taller guardar la nueva antes de eliminar la anterior; tests simulados verifican orden y estado ante fallos.
- **Rutas y seguridad:** usar el origen exacto de `FRONTEND_URL`, Bearer JWT con verificación `algorithms: ['HS256']` y `trust proxy = 1`; probar CORS permitido/rechazado, OPTIONS y rutas admin sin token, con token inválido y sin `JWT_SECRET`.
- **Subida en Vercel:** Multer debe usar `memoryStorage` con límite de 2 MB porque la función serverless no tiene disco persistente; no escribir uploads temporales al filesystem.
- **Colisiones de código/slug:** la generación previa no elimina la garantía ante concurrencia; usar restricciones únicas existentes y reintentar colisiones de forma acotada con error explícito si no se resuelve.
- **URL absoluta/local:** no anteponer `URL_SITIO` a URLs Blob y no llamar al borrado Blob para rutas relativas; cubrir ambos formatos en tests de fotos, SEO y tarjetas.
- **Peso de la tienda pública:** cargar rutas administrativas de forma perezosa y verificar que la portada no incorpore el código del panel al bundle inicial.
