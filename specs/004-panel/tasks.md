# Tareas 004-panel

**Spec:** aprobada · **Plan:** aprobado · **Estado:** aprobado
Para ahorrar pedidos al agente, las tareas se implementan en paquetes de 2 o 3 tareas relacionadas por mensaje, pero cada tarea mantiene su test primero y su propio commit.

Cada tarea estima menos de 30 minutos y no se avanza a otro bloque hasta que el anterior quede validado.

## Bloque 1 · Ingreso y edición rápida

- [x] **T01** · Validar y hashear contraseñas · Requisito: B1-R4 · Duración: 20 min · Archivos: `backend/tests/utils/contrasena.test.js`, `backend/src/utils/contrasena.js` · Test primero: mínimo 12 caracteres, máximo 72 bytes UTF-8 y bcrypt costo 12.
  **Listo cuando:** las pruebas de límites y del costo pasan; la utilidad no expone la contraseña.
- [x] **T02** · Crear el generador interactivo del hash · Requisito: B1-R4 · Duración: 20 min · Archivos: `backend/tests/generar-hash.test.js`, `backend/scripts/generar-hash.js` · Test primero: entrada oculta, llamada a `contrasena.js` y salida exclusiva del hash.
  **Listo cuando:** el test confirma que el script no imprime la contraseña ni duplica la lógica de validación/hash.
- [x] **T03** · Preparar el esquema del panel · Requisitos: B1-R3, B4-R1 · Duración: 25 min · Archivos: `backend/src/db/esquema-panel.sql` · Revisión primero: verificar campos, singleton de administradores, singleton de contenido y valores iniciales del taller contra los datos actuales.
  **Listo cuando:** el SQL está listo para revisión manual del estudiante; no incluye creación de contraseña/hash ni una prueba automática contra Neon.
- [x] **T04** · Configurar CORS y proxy confiable · Requisitos: B1-R7, B1-R18 · Duración: 25 min · Archivos: `backend/tests/app.test.js`, `backend/src/app.js` · Test primero: origen permitido/rechazado, cabeceras, métodos, preflight y resolución de IP con `trust proxy = 1`.
  **Listo cuando:** solo `FRONTEND_URL` recibe CORS, `OPTIONS` responde a preflight y Express confía en un proxy.
- [x] **T05** · Limitar intentos fallidos de ingreso · Requisito: B1-R7 · Duración: 25 min · Archivos: `backend/tests/limiteIngreso.test.js`, `backend/src/middleware/limiteIngreso.js` · Test primero: cinco fallos pasan, el sexto recibe 429, éxito reinicia contador y ventana de 15 minutos; documentar que el estado es por instancia Vercel.
  **Listo cuando:** el limitador solo cuenta fallos y sus pruebas controlan el tiempo sin esperar 15 minutos reales.
- [x] **T06** · Proteger rutas con JWT HS256 · Requisitos: B1-R12, B1-R19 · Duración: 25 min · Archivos: `backend/tests/requiereAdmin.test.js`, `backend/src/middleware/requiereAdmin.js` · Test primero: token ausente, inválido, expirado, firmado con algoritmo distinto y falta de `JWT_SECRET`.
  **Listo cuando:** solo acepta HS256 válido; sin secreto devuelve 503 en rutas del panel y no bloquea rutas públicas.
- [x] **T07** · Implementar ingreso en el backend · Requisitos: B1-R5, B1-R6, B1-R17, B1-R19 · Duración: 25 min · Archivos: `backend/tests/auth.test.js`, `backend/src/controllers/auth.controller.js` · Test primero: email normalizado, comparación bcrypt, JWT de 2 horas, 401 genérico y 503 sin `JWT_SECRET`.
  **Listo cuando:** las pruebas usan mocks de base, bcrypt y JWT, y ninguna respuesta filtra email existente, hash o secreto.
- [ ] **T08** · Exponer la ruta de ingreso · Requisitos: B1-R5, B1-R6, B1-R7 · Duración: 20 min · Archivos: `backend/tests/auth.routes.test.js`, `backend/src/routes/auth.routes.js`, `backend/src/routes/index.js` · Test primero: `POST /api/auth/ingresar` enruta al controlador y aplica limitación antes de procesar credenciales.
  **Listo cuando:** Supertest verifica la ruta, el middleware y la respuesta JSON sin servicios reales.
- [ ] **T09** · Añadir variables de entorno de ejemplo · Requisitos: B1-R8, B1-R19, B3-R2 · Duración: 15 min · Archivos: `backend/.env.ejemplo` · Sin test: agregar `JWT_SECRET` y `BLOB_READ_WRITE_TOKEN` con valores de ejemplo no secretos.
  **Listo cuando:** aparecen ambas variables de entorno de backend con valores de ejemplo; no se agrega ningún secreto real.
- [ ] **T10** · Implementar utilidades de sesión del navegador · Requisitos: B1-R9, B1-R11 · Duración: 20 min · Archivos: `frontend/tests/sesion.test.js`, `frontend/src/utils/sesion.js` · Test primero: guardar, leer y borrar en `sessionStorage`, sin usar `localStorage`.
  **Listo cuando:** las tres operaciones pasan con almacenamiento simulado y manejan sesión ausente.
- [ ] **T11** · Implementar el hook de sesión · Requisitos: B1-R1, B1-R11 · Duración: 20 min · Archivos: `frontend/tests/useSesion.test.js`, `frontend/src/hooks/useSesion.js` · Test primero: refleja sesión existente/ausente y la acción de salir borra sesión.
  **Listo cuando:** hook y pruebas no duplican acceso directo al almacenamiento fuera de `utils/sesion.js`.
- [ ] **T12** · Añadir llamadas de autenticación a la API frontend · Requisitos: B1-R9, B1-R10 · Duración: 25 min · Archivos: `frontend/tests/api.test.js`, `frontend/src/services/api.js` · Test primero: login, Bearer en llamadas protegidas, tratamiento de 401 con borrado de token y redirección.
  **Listo cuando:** toda llamada usa `services/api.js`, no hay `fetch` nuevo en componentes y no se conserva una sesión rechazada.
- [ ] **T13** · Crear pantalla accesible de ingreso · Requisitos: B1-R2, B1-R13 · Duración: 25 min · Archivos: `frontend/tests/Ingresar.test.jsx`, `frontend/src/pages/admin/Ingresar.jsx` · Test primero: labels, foco, envío, error con `role="alert"` y `noindex`.
  **Listo cuando:** formulario usable por teclado, muestra envío/error y nunca incluye credenciales en mensajes de error.
- [ ] **T14** · Crear ruta protegida del panel · Requisitos: B1-R12, B1-R13 · Duración: 20 min · Archivos: `frontend/tests/RutaProtegida.test.jsx`, `frontend/src/components/admin/RutaProtegida.jsx` · Test primero: sin sesión redirige a `/ingresar`; con sesión renderiza contenido.
  **Listo cuando:** redirección y render están probados con React Router y la ruta protegida no confía en datos fuera del token guardado.
- [ ] **T15** · Integrar header y rutas administrativas diferidas · Requisitos: B1-R1, B1-R13 · Duración: 25 min · Archivos: `frontend/tests/App.test.jsx`, `frontend/tests/Header.test.jsx`, `frontend/src/App.jsx`, `frontend/src/components/layout/Header.jsx` · Test primero: Ingresar/Salir y rutas `/ingresar`, `/admin` con `React.lazy`, `Suspense` y `Cargando`.
  **Listo cuando:** rutas del panel se cargan bajo demanda y la navegación del header cambia según sesión.
- [ ] **T16** · Crear la pantalla contenedora del panel · Requisitos: B1-R13, B1-R14 · Duración: 20 min · Archivos: `frontend/tests/Panel.test.jsx`, `frontend/src/pages/admin/Panel.jsx` · Test primero: `noindex`, encabezados y pestañas/secciones Productos y Nuestro taller.
  **Listo cuando:** Panel puede cargar lazy y ofrece los contenedores para las secciones sin estado de datos falso.
- [ ] **T17** · Listar productos admin en el backend · Requisito: B1-R14 · Duración: 25 min · Archivos: `backend/tests/admin.productos.test.js`, `backend/src/controllers/admin.productos.controller.js`, `backend/src/routes/admin.productos.routes.js`, `backend/src/routes/index.js` · Test primero: lista incluye activos/inactivos y código; ruta protegida por `requiereAdmin`.
  **Listo cuando:** Supertest y mock de `conexion.js` verifican consulta parametrizada y forma de respuesta.
- [ ] **T18** · Implementar edición rápida admin · Requisitos: B1-R15, B1-R16, B1-R17 · Duración: 25 min · Archivos: `backend/tests/admin.productos.test.js`, `backend/src/controllers/admin.productos.controller.js`, `backend/src/routes/admin.productos.routes.js` · Test primero: PATCH modifica precio, stock y destacado; rechaza valores inválidos sin guardar.
  **Listo cuando:** solo se actualizan esos tres campos con parámetros y errores explícitos.
- [ ] **T19** · Crear tabla de edición rápida · Requisitos: B1-R14, B1-R15 · Duración: 25 min · Archivos: `frontend/tests/TablaProductos.test.jsx`, `frontend/src/components/admin/TablaProductos.jsx`, `frontend/src/services/api.js` · Test primero: productos activos/inactivos, Guardar por producto y mensajes de éxito/error.
  **Listo cuando:** precio, stock y destacado se guardan por fila y la tabla conserva los datos previos si falla la API.
- [ ] **T20** · Integrar sección de productos en el panel · Requisitos: B1-R14, B1-R15 · Duración: 20 min · Archivos: `frontend/tests/Panel.test.jsx`, `frontend/src/pages/admin/Panel.jsx` · Test primero: estados de carga, vacío y error para la lista de productos.
  **Listo cuando:** la sección muestra cada estado y permite reintentar un error de carga.
- [ ] **T21** · Configurar Neon y secretos del entorno · Requisitos: B1-R3, B1-R8, B3-R2 · Duración: 25 min · Archivos: `specs/004-panel/tasks.md` (marcar tarea cumplida, sin valores secretos) · Validación manual: revisar `esquema-panel.sql`; ejecutarlo en Neon; generar hash localmente y crear administrador con SQL; configurar `JWT_SECRET` y `BLOB_READ_WRITE_TOKEN` en Vercel sin compartirlos.
  **Listo cuando:** tablas y cuenta están creadas y ambas variables privadas están cargadas en Vercel; no se copia ningún valor secreto al repo, commits ni chat.

## Bloque 2 · Productos completos

- [ ] **T22** · Validar datos de producto · Requisitos: B2-R1, B2-R6 · Duración: 25 min · Archivos: `backend/tests/validaciones/producto.test.js`, `backend/src/validaciones/producto.js` · Test primero: campos obligatorios, tipos, rangos, arrays, categoría y valores inválidos.
  **Listo cuando:** validador puro acepta datos válidos y devuelve errores identificables sin consultar servicios.
- [ ] **T23** · Generar código único de producto · Requisito: B2-R2 · Duración: 25 min · Archivos: `backend/tests/generarCodigo.test.js`, `backend/src/utils/generarCodigo.js` · Test primero: prefijos conocidos, siguiente número y colisiones con sufijo numérico.
  **Listo cuando:** función pura determinista genera código compatible y permite detectar/reintentar colisiones de base.
- [ ] **T24** · Generar slug único · Requisitos: B2-R3, B2-R4 · Duración: 25 min · Archivos: `backend/tests/generarSlug.test.js`, `backend/src/utils/generarSlug.js` · Test primero: normalización del nombre, acentos, caracteres y colisiones.
  **Listo cuando:** slug nuevo es estable y único sin modificar slugs ya persistidos.
- [ ] **T25** · Crear productos completos en backend · Requisitos: B2-R1, B2-R2, B2-R3, B2-R6 · Duración: 25 min · Archivos: `backend/tests/admin.productos.test.js`, `backend/src/controllers/admin.productos.controller.js` · Test primero: crea con código/slug generados, valida categoría y campos, rechaza errores y colisiones no resueltas.
  **Listo cuando:** la inserción SQL es parametrizada y las restricciones únicas se manejan con error explícito.
- [ ] **T26** · Completar alta, edición y estado de productos en rutas · Requisitos: B2-R1–R6 · Duración: 25 min · Archivos: `backend/tests/admin.productos.test.js`, `backend/src/routes/admin.productos.routes.js`, `backend/src/controllers/admin.productos.controller.js` · Test primero: rutas POST, PATCH completo, ocultar/reactivar; editar nombre mantiene slug/código.
  **Listo cuando:** todos los endpoints están bajo middleware admin y rechazan datos inválidos antes de persistir.
- [ ] **T27** · Crear formulario reutilizable de producto · Requisitos: B2-R1, B2-R4, B2-R6 · Duración: 25 min · Archivos: `frontend/tests/FormularioProducto.test.jsx`, `frontend/src/components/admin/FormularioProducto.jsx` · Test primero: labels, valores, validación visible y modo alta/edición sin campo código/slug.
  **Listo cuando:** formulario accesible envía solo campos editables y muestra errores sin descartar los valores ingresados.
- [ ] **T28** · Integrar altas y ediciones completas al panel · Requisitos: B2-R1–R6 · Duración: 25 min · Archivos: `frontend/tests/TablaProductos.test.jsx`, `frontend/src/components/admin/TablaProductos.jsx`, `frontend/src/pages/admin/Panel.jsx` · Test primero: abrir alta/edición, guardar, cancelar, ocultar y reactivar.
  **Listo cuando:** tabla refresca después de éxito y conserva el producto anterior ante error.

## Bloque 3 · Fotos de productos

- [ ] **T29** · Validar contenido de imagen · Requisitos: B3-R1, B3-R3 · Duración: 25 min · Archivos: `backend/tests/validaciones/imagen.test.js`, `backend/src/validaciones/imagen.js` · Test primero: JPG/PNG/WebP reales, tipo falso, corrupto, vacío y límites de 2 MB.
  **Listo cuando:** validador puro rechaza cualquier tipo no admitido o tamaño superior y acepta exactamente 2 MB válidos.
- [ ] **T30** · Configurar subida en memoria con Multer · Requisitos: B3-R1, B3-R3, B3-R6 · Duración: 25 min · Archivos: `backend/tests/admin.fotos.test.js`, `backend/src/routes/admin.fotos.routes.js`, `backend/src/validaciones/imagen.js` · Test primero: memoryStorage, límite de 2 MB, autenticación antes de procesar y error por tamaño.
  **Listo cuando:** no se escribe al disco y la ruta restringe el tipo/contenido antes del controlador.
- [ ] **T31** · Crear servicio aislado de Vercel Blob · Requisitos: B3-R2, B3-R4, B3-R6 · Duración: 25 min · Archivos: `backend/tests/almacenamiento.test.js`, `backend/src/services/almacenamiento.js` · Test primero: subir URL absoluta y borrar objeto con el SDK mockeado.
  **Listo cuando:** solo este archivo importa `@vercel/blob` y los errores se propagan para no simular éxito.
- [ ] **T32** · Subir fotos de producto y guardar metadatos · Requisitos: B3-R1–R3, B3-R6 · Duración: 25 min · Archivos: `backend/tests/admin.fotos.test.js`, `backend/src/controllers/admin.fotos.controller.js`, `backend/src/routes/admin.fotos.routes.js` · Test primero: alt obligatorio, `generada_con_ia` default false, URL/orden y rollback/limpieza ante fallo de DB.
  **Listo cuando:** la ruta autentica, valida archivo y guarda Blob/URL/alt con mocks, sin exponer token.
- [ ] **T33** · Borrar y ordenar fotos · Requisitos: B3-R4, B3-R5, B3-R6 · Duración: 25 min · Archivos: `backend/tests/admin.fotos.test.js`, `backend/src/controllers/admin.fotos.controller.js`, `backend/src/routes/admin.fotos.routes.js` · Test primero: URL Blob borra objeto antes de fila; URL relativa borra solo fila; principal recibe orden 1 y las restantes orden válido.
  **Listo cuando:** cualquier fallo conserva referencias y responde error; no hay éxito falso.
- [ ] **T34** · Añadir llamadas API de fotos · Requisitos: B3-R1–R6 · Duración: 20 min · Archivos: `frontend/tests/api.test.js`, `frontend/src/services/api.js` · Test primero: multipart autenticado, borrar y marcar principal sin `fetch` en componentes.
  **Listo cuando:** requests usan Bearer, respetan FormData sin fijar boundary manualmente y gestionan 401.
- [ ] **T35** · Corregir URLs de fotos en SEO y tarjetas · Requisito: B3-R7 · Duración: 20 min · Archivos: `frontend/tests/seoDetalle.test.js`, `frontend/src/utils/seoDetalle.js`, `frontend/tests/TarjetaProducto.test.jsx`, `frontend/src/components/tienda/TarjetaProducto.jsx` · Test primero: absoluto HTTPS intacto y ruta relativa con prefijo `URL_SITIO`.
  **Listo cuando:** ni JSON-LD ni tarjetas duplican el dominio en URLs de Blob.
- [ ] **T36** · Crear interfaz administrativa de fotos · Requisitos: B3-R1–R6 · Duración: 25 min · Archivos: `frontend/tests/FotosProducto.test.jsx`, `frontend/src/components/admin/FotosProducto.jsx`, `frontend/src/components/admin/TablaProductos.jsx` · Test primero: carga, vacío, fotos con alt/leyenda IA, subir, borrar, principal y error.
  **Listo cuando:** permite operar por teclado y muestra resultados accesibles sin ocultar fallos.

## Bloque 4 · Nuestro taller desde la base

- [ ] **T37** · Publicar contenido del taller en la API · Requisitos: B4-R1, B4-R2 · Duración: 25 min · Archivos: `backend/tests/taller.test.js`, `backend/src/controllers/taller.controller.js`, `backend/src/routes/taller.routes.js`, `backend/src/routes/index.js` · Test primero: devuelve fila pública, ausencia de fila y error de base.
  **Listo cuando:** GET no requiere JWT y usa SQL parametrizado con `conexion.js`.
- [ ] **T38** · Cargar NuestroTaller desde la API · Requisito: B4-R3 · Duración: 25 min · Archivos: `frontend/tests/NuestroTaller.test.jsx`, `frontend/src/components/inicio/NuestroTaller.jsx`, `frontend/src/services/api.js` · Test primero: respuesta de API, fallback ante error/ausencia, textos, alt y URLs.
  **Listo cuando:** portada conserva los datos locales ante fallo y las imágenes Blob usan la URL absoluta sin prefijo.
- [ ] **T39** · Editar texto del taller en backend · Requisitos: B4-R4, B4-R6 · Duración: 25 min · Archivos: `backend/tests/admin.taller.test.js`, `backend/src/controllers/admin.taller.controller.js`, `backend/src/routes/admin.taller.routes.js` · Test primero: PATCH autenticado, campos válidos, rechazo de vacíos y conservación del anterior ante error.
  **Listo cuando:** validación ocurre en servidor y el endpoint actualiza la fila única mediante parámetros.
- [ ] **T40** · Reemplazar fotos del taller de forma segura · Requisitos: B4-R5–R7 · Duración: 25 min · Archivos: `backend/tests/admin.taller.test.js`, `backend/src/controllers/admin.taller.controller.js`, `backend/src/routes/admin.taller.routes.js` · Test primero: subir nueva, guardar URL/alt antes de limpiar URL Blob anterior, conservar nueva ante fallo de limpieza y no borrar rutas relativas.
  **Listo cuando:** mocks verifican orden de operaciones y errores sin alterar la foto nueva activa.
- [ ] **T41** · Crear editor de Nuestro taller · Requisitos: B4-R4–R7 · Duración: 25 min · Archivos: `frontend/tests/EditorTaller.test.jsx`, `frontend/src/components/admin/EditorTaller.jsx`, `frontend/src/pages/admin/Panel.jsx` · Test primero: edición de texto, alts obligatorios, selección de fotos, guardado/error y estados accesibles.
  **Listo cuando:** editor conserva datos previos ante error y se integra en la pestaña «Nuestro taller».
