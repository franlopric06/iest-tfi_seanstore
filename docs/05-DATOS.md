# 05 · Datos

## Qué guarda la base

| Grupo | Tablas |
| --- | --- |
| Catálogo | `categorias`, `productos`, `producto_fotos` |
| Ventas | `pedidos`, `pedido_items` |
| Clientes | `usuarios`, `favoritos`, `tokens_recuperacion` |
| Atención | `consultas`, `arrepentimientos` |
| Confianza | `resenas`, `testimonios` |
| Contenido | `preguntas_frecuentes`, `promociones`, `medios_pago`, `trabajos` |

## Relaciones

```text
categorias 1 ── N productos 1 ── N producto_fotos
usuarios   1 ── N pedidos   1 ── N pedido_items N ── 1 productos
usuarios   1 ── N favoritos N ── 1 productos
pedidos    1 ── N resenas   N ── 1 productos
```

## Estados de un pedido

| Estado | Significa | Email al cliente |
| --- | --- | --- |
| `pendiente_pago` | Se creó el pedido pero todavía no se pagó | No |
| `pagado` | Mercado Pago confirmó el pago (o eligió pagar en el local) | Sí, confirmación |
| `en_produccion` | Se está sublimando | Sí |
| `listo` | Terminado, esperando retiro o envío | Sí |
| `enviado` | Salió hacia el domicilio | Sí |
| `entregado` | El cliente ya lo tiene | Sí, y 5 días después la invitación a reseñar |
| `cancelado` | Se anuló (vuelve el stock) | Sí |

Un pedido en `pendiente_pago` por más de 48 horas pasa solo a `cancelado`, sin email (lo hace la tarea diaria).

## Tablas

### usuarios

| Campo | Tipo | Detalle |
| --- | --- | --- |
| id | SERIAL | Clave primaria |
| nombre | VARCHAR(100) | Obligatorio |
| email | VARCHAR(120) | Único, en minúsculas |
| password_hash | VARCHAR(255) | bcrypt (nunca en texto plano) |
| telefono | VARCHAR(20) | Opcional |
| direccion | TEXT | Opcional, se precarga en el checkout |
| rol | VARCHAR(10) | `cliente` o `admin` |
| creado_en | TIMESTAMP | Fecha de alta |

### tokens_recuperacion

| Campo | Tipo | Detalle |
| --- | --- | --- |
| id | SERIAL | Clave primaria |
| usuario_id | INTEGER | Referencia a `usuarios` |
| token_hash | VARCHAR(255) | Hash del token (el token en claro solo viaja en el email) |
| vence_en | TIMESTAMP | Creación + 1 hora |
| usado | BOOLEAN | `true` después de usarlo |

### categorias

| Campo | Tipo | Detalle |
| --- | --- | --- |
| id | SERIAL | Clave primaria |
| nombre | VARCHAR(50) | Ej. "Tazas y termos" |
| slug | VARCHAR(50) | Ej. `tazas-termos` (único) |
| orden | INTEGER | Orden en el menú |

### productos

| Campo | Tipo | Detalle |
| --- | --- | --- |
| id | SERIAL | Clave primaria |
| codigo | VARCHAR(20) | Único, ej. `TAZ-001` |
| slug | VARCHAR(140) | Único, para la URL, ej. `taza-ceramica-blanca-325-ml` |
| nombre | VARCHAR(120) | Obligatorio |
| categoria_id | INTEGER | Referencia a `categorias` |
| descripcion | TEXT | Medidas, material y cuidados |
| precio | NUMERIC(12,2) | `0` como marcador |
| precio_anterior | NUMERIC(12,2) | Si tiene valor mayor al precio, se muestra tachado |
| stock | INTEGER | Unidades disponibles |
| talles | TEXT[] | Ej. `{S,M,L,XL}` (vacío si no aplica) |
| colores | TEXT[] | Ej. `{Blanco,Negro}` |
| guia_talles | VARCHAR(20) | `remera`, `buzo`, `campera`, `canillera` o vacío |
| destacado | BOOLEAN | Aparece en el inicio |
| vendidos | INTEGER | Se suma al confirmar cada pago (para ordenar por más vendidos) |
| activo | BOOLEAN | Si se muestra en la tienda |
| creado_en | TIMESTAMP | Para ordenar por novedad |

### producto_fotos

| Campo | Tipo | Detalle |
| --- | --- | --- |
| id | SERIAL | Clave primaria |
| producto_id | INTEGER | Referencia a `productos` |
| url | VARCHAR(255) | Imagen en Cloudinary |
| alt | VARCHAR(160) | Texto alternativo |
| orden | INTEGER | La de orden 1 es la principal |

### pedidos

| Campo | Tipo | Detalle |
| --- | --- | --- |
| id | SERIAL | Clave primaria |
| codigo | VARCHAR(10) | Único, ej. `SS-0042` |
| usuario_id | INTEGER | Referencia a `usuarios` (vacío si compró como invitado) |
| nombre_cliente | VARCHAR(100) | Obligatorio |
| email | VARCHAR(120) | Obligatorio |
| telefono | VARCHAR(20) | Obligatorio |
| tipo_entrega | VARCHAR(10) | `retiro` o `envio` |
| direccion_envio | TEXT | Solo si es envío |
| metodo_pago | VARCHAR(20) | `mercadopago` o `en_local` |
| subtotal | NUMERIC(12,2) | Suma de los ítems |
| costo_envio | NUMERIC(12,2) | `0` como marcador (se coordina a mano) |
| total | NUMERIC(12,2) | Calculado en el servidor |
| estado | VARCHAR(20) | Ver estados arriba |
| mp_pago_id | VARCHAR(100) | ID del pago aprobado en Mercado Pago |
| token_resena | VARCHAR(64) | Token del link para reseñar |
| resena_pedida | BOOLEAN | `true` cuando ya se mandó el email de reseña |
| entregado_en | TIMESTAMP | Fecha en que pasó a `entregado` |
| creado_en | TIMESTAMP | Fecha y hora del pedido |

### pedido_items

| Campo | Tipo | Detalle |
| --- | --- | --- |
| id | SERIAL | Clave primaria |
| pedido_id | INTEGER | Referencia a `pedidos` |
| producto_id | INTEGER | Referencia a `productos` |
| cantidad | INTEGER | Entre 1 y 500 |
| talle | VARCHAR(10) | Opcional |
| color | VARCHAR(30) | Opcional |
| diseno_url | VARCHAR(255) | Imagen subida por el cliente (obligatoria) |
| nota | TEXT | Indicaciones del cliente (opcional) |
| precio_unitario | NUMERIC(12,2) | Precio al momento de la compra |

### favoritos

| Campo | Tipo | Detalle |
| --- | --- | --- |
| usuario_id | INTEGER | Referencia a `usuarios` |
| producto_id | INTEGER | Referencia a `productos` |
| creado_en | TIMESTAMP | Clave primaria compuesta: (usuario_id, producto_id) |

### consultas

| Campo | Tipo | Detalle |
| --- | --- | --- |
| id | SERIAL | Clave primaria |
| tipo | VARCHAR(20) | `diseno`, `equipo`, `egresados`, `empresa`, `otro` |
| nombre | VARCHAR(100) | Obligatorio en presupuestos; opcional en `diseno` |
| telefono | VARCHAR(20) | Obligatorio en presupuestos; opcional en `diseno` |
| producto_id | INTEGER | Producto consultado (solo `diseno`) |
| detalle | TEXT | Talle, color y cantidad (solo `diseno`) |
| cantidad_estimada | INTEGER | Solo presupuestos |
| mensaje | TEXT | La idea o el pedido del cliente |
| atendida | BOOLEAN | La marca el negocio |
| creado_en | TIMESTAMP | Fecha y hora |

### arrepentimientos

| Campo | Tipo | Detalle |
| --- | --- | --- |
| id | SERIAL | Clave primaria |
| codigo | VARCHAR(10) | Único, ej. `ARR-0007` |
| pedido_codigo | VARCHAR(10) | Código del pedido que quiere cancelar |
| nombre | VARCHAR(100) | Obligatorio |
| email | VARCHAR(120) | Obligatorio |
| motivo | TEXT | Opcional |
| estado | VARCHAR(20) | `pendiente`, `aceptado`, `rechazado` |
| creado_en | TIMESTAMP | Fecha y hora |

### resenas

| Campo | Tipo | Detalle |
| --- | --- | --- |
| id | SERIAL | Clave primaria |
| producto_id | INTEGER | Referencia a `productos` |
| pedido_id | INTEGER | Pedido que la habilita (prueba de compra) |
| nombre_mostrado | VARCHAR(60) | Ej. "Lucía G." (nombre e inicial del apellido) |
| estrellas | SMALLINT | De 1 a 5 |
| comentario | TEXT | Hasta 500 caracteres |
| estado | VARCHAR(10) | `pendiente`, `aprobada`, `oculta` |
| destacada | BOOLEAN | Se muestra en el inicio |
| creado_en | TIMESTAMP | Fecha |

Solo puede haber una reseña por producto y pedido. El negocio puede aprobar, ocultar o destacar, pero **no editar** el texto ni las estrellas.

### testimonios

| Campo | Tipo | Detalle |
| --- | --- | --- |
| id | SERIAL | Clave primaria |
| nombre_mostrado | VARCHAR(60) | Como lo autorizó el cliente |
| texto | TEXT | Copiado tal cual del mensaje original |
| origen | VARCHAR(20) | `whatsapp`, `instagram`, `local` |
| permiso | BOOLEAN | Obligatorio `true` para mostrarse |
| destacado | BOOLEAN | Se muestra en el inicio |
| creado_en | TIMESTAMP | Fecha |

### preguntas_frecuentes

| Campo | Tipo | Detalle |
| --- | --- | --- |
| id | SERIAL | Clave primaria |
| pregunta | VARCHAR(200) | Como la escribiría un cliente |
| respuesta | TEXT | Respuesta corta, en el tono de la marca |
| palabras_clave | TEXT[] | Para encontrarla, ej. `{envio,envios,mandan,domicilio}` |
| orden | INTEGER | Orden de las sugeridas |
| activa | BOOLEAN | Si se usa en el asistente |

### promociones

| Campo | Tipo | Detalle |
| --- | --- | --- |
| id | SERIAL | Clave primaria |
| texto | VARCHAR(140) | Ej. "Día del Padre: termos personalizados" |
| enlace | VARCHAR(255) | Opcional, a dónde lleva al tocarla |
| desde | DATE | Inicio |
| hasta | DATE | Fin |
| activa | BOOLEAN | Encendida o apagada |

### medios_pago

| Campo | Tipo | Detalle |
| --- | --- | --- |
| id | SERIAL | Clave primaria |
| nombre | VARCHAR(40) | Ej. "Visa", "Mercado Pago", "Efectivo en el local" |
| icono_url | VARCHAR(255) | Ícono que se muestra en la franja |
| orden | INTEGER | Orden en la franja |
| activo | BOOLEAN | Si se muestra |

### trabajos

| Campo | Tipo | Detalle |
| --- | --- | --- |
| id | SERIAL | Clave primaria |
| imagen_url | VARCHAR(255) | Foto del trabajo |
| titulo | VARCHAR(100) | Ej. "Camperas de egresados 2026" |
| tipo | VARCHAR(20) | `tazas`, `indumentaria`, `deportes`, `accesorios` |
| destacado | BOOLEAN | Se muestra en el inicio |
| orden | INTEGER | Orden en la galería |

## Esquema SQL

```sql
-- backend/src/db/esquema.sql
CREATE TABLE usuarios (
  id            SERIAL PRIMARY KEY,
  nombre        VARCHAR(100) NOT NULL,
  email         VARCHAR(120) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  telefono      VARCHAR(20),
  direccion     TEXT,
  rol           VARCHAR(10) DEFAULT 'cliente' CHECK (rol IN ('cliente', 'admin')),
  creado_en     TIMESTAMP DEFAULT NOW()
);

CREATE TABLE tokens_recuperacion (
  id         SERIAL PRIMARY KEY,
  usuario_id INTEGER REFERENCES usuarios(id) ON DELETE CASCADE,
  token_hash VARCHAR(255) NOT NULL,
  vence_en   TIMESTAMP NOT NULL,
  usado      BOOLEAN DEFAULT FALSE
);

CREATE TABLE categorias (
  id     SERIAL PRIMARY KEY,
  nombre VARCHAR(50) NOT NULL,
  slug   VARCHAR(50) UNIQUE NOT NULL,
  orden  INTEGER DEFAULT 0
);

CREATE TABLE productos (
  id              SERIAL PRIMARY KEY,
  codigo          VARCHAR(20) UNIQUE NOT NULL,
  slug            VARCHAR(140) UNIQUE NOT NULL,
  nombre          VARCHAR(120) NOT NULL,
  categoria_id    INTEGER REFERENCES categorias(id),
  descripcion     TEXT,
  precio          NUMERIC(12,2) DEFAULT 0,
  precio_anterior NUMERIC(12,2),
  stock           INTEGER DEFAULT 0 CHECK (stock >= 0),
  talles          TEXT[] DEFAULT '{}',
  colores         TEXT[] DEFAULT '{}',
  guia_talles     VARCHAR(20),
  destacado       BOOLEAN DEFAULT FALSE,
  vendidos        INTEGER DEFAULT 0,
  activo          BOOLEAN DEFAULT TRUE,
  creado_en       TIMESTAMP DEFAULT NOW()
);

CREATE TABLE producto_fotos (
  id          SERIAL PRIMARY KEY,
  producto_id INTEGER REFERENCES productos(id) ON DELETE CASCADE,
  url         VARCHAR(255) NOT NULL,
  alt         VARCHAR(160),
  orden       INTEGER DEFAULT 1
);

CREATE TABLE pedidos (
  id              SERIAL PRIMARY KEY,
  codigo          VARCHAR(10) UNIQUE NOT NULL,
  usuario_id      INTEGER REFERENCES usuarios(id),
  nombre_cliente  VARCHAR(100) NOT NULL,
  email           VARCHAR(120) NOT NULL,
  telefono        VARCHAR(20) NOT NULL,
  tipo_entrega    VARCHAR(10) NOT NULL CHECK (tipo_entrega IN ('retiro', 'envio')),
  direccion_envio TEXT,
  metodo_pago     VARCHAR(20) NOT NULL CHECK (metodo_pago IN ('mercadopago', 'en_local')),
  subtotal        NUMERIC(12,2) DEFAULT 0,
  costo_envio     NUMERIC(12,2) DEFAULT 0,
  total           NUMERIC(12,2) DEFAULT 0,
  estado          VARCHAR(20) DEFAULT 'pendiente_pago' CHECK (estado IN
                  ('pendiente_pago', 'pagado', 'en_produccion', 'listo', 'enviado', 'entregado', 'cancelado')),
  mp_pago_id      VARCHAR(100) UNIQUE,
  token_resena    VARCHAR(64) UNIQUE,
  resena_pedida   BOOLEAN DEFAULT FALSE,
  entregado_en    TIMESTAMP,
  creado_en       TIMESTAMP DEFAULT NOW()
);

CREATE TABLE pedido_items (
  id              SERIAL PRIMARY KEY,
  pedido_id       INTEGER REFERENCES pedidos(id) ON DELETE CASCADE,
  producto_id     INTEGER REFERENCES productos(id),
  cantidad        INTEGER NOT NULL CHECK (cantidad BETWEEN 1 AND 500),
  talle           VARCHAR(10),
  color           VARCHAR(30),
  diseno_url      VARCHAR(255) NOT NULL,
  nota            TEXT,
  precio_unitario NUMERIC(12,2) DEFAULT 0
);

CREATE TABLE favoritos (
  usuario_id  INTEGER REFERENCES usuarios(id) ON DELETE CASCADE,
  producto_id INTEGER REFERENCES productos(id) ON DELETE CASCADE,
  creado_en   TIMESTAMP DEFAULT NOW(),
  PRIMARY KEY (usuario_id, producto_id)
);

CREATE TABLE consultas (
  id                SERIAL PRIMARY KEY,
  tipo              VARCHAR(20) NOT NULL CHECK (tipo IN ('diseno', 'equipo', 'egresados', 'empresa', 'otro')),
  nombre            VARCHAR(100),
  telefono          VARCHAR(20),
  producto_id       INTEGER REFERENCES productos(id),
  detalle           TEXT,
  cantidad_estimada INTEGER,
  mensaje           TEXT,
  atendida          BOOLEAN DEFAULT FALSE,
  creado_en         TIMESTAMP DEFAULT NOW()
);

CREATE TABLE arrepentimientos (
  id            SERIAL PRIMARY KEY,
  codigo        VARCHAR(10) UNIQUE NOT NULL,
  pedido_codigo VARCHAR(10) NOT NULL,
  nombre        VARCHAR(100) NOT NULL,
  email         VARCHAR(120) NOT NULL,
  motivo        TEXT,
  estado        VARCHAR(20) DEFAULT 'pendiente' CHECK (estado IN ('pendiente', 'aceptado', 'rechazado')),
  creado_en     TIMESTAMP DEFAULT NOW()
);

CREATE TABLE resenas (
  id              SERIAL PRIMARY KEY,
  producto_id     INTEGER REFERENCES productos(id) ON DELETE CASCADE,
  pedido_id       INTEGER REFERENCES pedidos(id) ON DELETE CASCADE,
  nombre_mostrado VARCHAR(60) NOT NULL,
  estrellas       SMALLINT NOT NULL CHECK (estrellas BETWEEN 1 AND 5),
  comentario      TEXT,
  estado          VARCHAR(10) DEFAULT 'pendiente' CHECK (estado IN ('pendiente', 'aprobada', 'oculta')),
  destacada       BOOLEAN DEFAULT FALSE,
  creado_en       TIMESTAMP DEFAULT NOW(),
  UNIQUE (producto_id, pedido_id)
);

CREATE TABLE testimonios (
  id              SERIAL PRIMARY KEY,
  nombre_mostrado VARCHAR(60) NOT NULL,
  texto           TEXT NOT NULL,
  origen          VARCHAR(20) CHECK (origen IN ('whatsapp', 'instagram', 'local')),
  permiso         BOOLEAN NOT NULL DEFAULT FALSE,
  destacado       BOOLEAN DEFAULT FALSE,
  creado_en       TIMESTAMP DEFAULT NOW()
);

CREATE TABLE preguntas_frecuentes (
  id             SERIAL PRIMARY KEY,
  pregunta       VARCHAR(200) NOT NULL,
  respuesta      TEXT NOT NULL,
  palabras_clave TEXT[] DEFAULT '{}',
  orden          INTEGER DEFAULT 0,
  activa         BOOLEAN DEFAULT TRUE
);

CREATE TABLE promociones (
  id     SERIAL PRIMARY KEY,
  texto  VARCHAR(140) NOT NULL,
  enlace VARCHAR(255),
  desde  DATE NOT NULL,
  hasta  DATE NOT NULL,
  activa BOOLEAN DEFAULT TRUE
);

CREATE TABLE medios_pago (
  id        SERIAL PRIMARY KEY,
  nombre    VARCHAR(40) NOT NULL,
  icono_url VARCHAR(255),
  orden     INTEGER DEFAULT 0,
  activo    BOOLEAN DEFAULT TRUE
);

CREATE TABLE trabajos (
  id         SERIAL PRIMARY KEY,
  imagen_url VARCHAR(255) NOT NULL,
  titulo     VARCHAR(100),
  tipo       VARCHAR(20) CHECK (tipo IN ('tazas', 'indumentaria', 'deportes', 'accesorios')),
  destacado  BOOLEAN DEFAULT FALSE,
  orden      INTEGER DEFAULT 0
);
```

## Datos de ejemplo

```sql
-- backend/src/db/datos-ejemplo.sql
INSERT INTO categorias (nombre, slug, orden) VALUES
  ('Tazas y termos', 'tazas-termos', 1),
  ('Indumentaria',   'indumentaria', 2),
  ('Deportes',       'deportes',     3),
  ('Accesorios',     'accesorios',   4);

INSERT INTO productos (codigo, slug, nombre, categoria_id, precio, stock, talles, colores, guia_talles, destacado) VALUES
  ('TAZ-001', 'taza-ceramica-blanca-325-ml', 'Taza cerámica blanca 325 ml', 1, 0, 50, '{}',             '{Blanco}',          NULL,        TRUE),
  ('TER-001', 'termo-acero-500-ml',          'Termo acero 500 ml',          1, 0, 20, '{}',             '{Blanco,Plateado}', NULL,        TRUE),
  ('REM-001', 'remera-poliester',            'Remera poliéster',            2, 0, 40, '{S,M,L,XL,XXL}', '{Blanco}',          'remera',    TRUE),
  ('BUZ-001', 'buzo-con-capucha',            'Buzo con capucha',            2, 0, 15, '{S,M,L,XL}',     '{Blanco,Gris}',     'buzo',      FALSE),
  ('CAN-001', 'canilleras-personalizadas',   'Canilleras personalizadas',   3, 0, 30, '{S,M,L}',        '{Blanco}',          'canillera', FALSE),
  ('GOR-001', 'gorra-trucker',               'Gorra trucker',               4, 0, 25, '{Único}',        '{Blanco,Negro}',    NULL,        FALSE);

INSERT INTO medios_pago (nombre, orden) VALUES
  ('Mercado Pago', 1), ('Visa', 2), ('Mastercard', 3), ('Débito', 4), ('Efectivo en el local', 5);

-- Las preguntas frecuentes iniciales están en 06-DISENO-UI.md (sección "Asistente").
-- El usuario admin se crea con un script que guarda la contraseña con bcrypt,
-- nunca escribiendo la contraseña en este archivo.
-- No se cargan reseñas ni testimonios de ejemplo: tienen que ser reales.
```

> Precios, stock y costo de envío son marcadores hasta que Sean's Store cargue los reales.
