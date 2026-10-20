-- Esquema de la versión 1 (tarea 001-T01)
-- Crea solo las 5 tablas de la v1 (decisión 8 de la clarificación de 001-catalogo):
--   categorias, productos, producto_fotos, consultas y preguntas_frecuentes.
-- Las demás tablas de 05-DATOS.md (ventas, clientes, confianza, contenido) son de la versión 2.
-- Ejecutar en el SQL Editor de Neon sobre una base sin tablas; la DATABASE_URL nunca pasa por el chat.

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
  -- Nullable en la v1: el negocio cotiza por WhatsApp, sin precios en pantalla
  precio          NUMERIC(12,2),
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
  id              SERIAL PRIMARY KEY,
  producto_id     INTEGER REFERENCES productos(id) ON DELETE CASCADE,
  url             VARCHAR(255) NOT NULL,
  alt             VARCHAR(160),
  generada_con_ia BOOLEAN DEFAULT FALSE,
  orden           INTEGER DEFAULT 1
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

CREATE TABLE preguntas_frecuentes (
  id             SERIAL PRIMARY KEY,
  pregunta       VARCHAR(200) NOT NULL,
  respuesta      TEXT NOT NULL,
  palabras_clave TEXT[] DEFAULT '{}',
  orden          INTEGER DEFAULT 0,
  activa         BOOLEAN DEFAULT TRUE
);
