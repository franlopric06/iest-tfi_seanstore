CREATE TABLE IF NOT EXISTS administradores (
  id              SMALLINT PRIMARY KEY DEFAULT 1 CHECK (id = 1),
  email           VARCHAR(120) NOT NULL UNIQUE CHECK (email = LOWER(email)),
  contrasena_hash VARCHAR(60) NOT NULL,
  creado_en       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS contenido_taller (
  id             SMALLINT PRIMARY KEY DEFAULT 1 CHECK (id = 1),
  titulo         VARCHAR(120) NOT NULL,
  parrafo        TEXT NOT NULL,
  foto_1_url     VARCHAR(500) NOT NULL,
  foto_1_alt     VARCHAR(160) NOT NULL,
  foto_2_url     VARCHAR(500) NOT NULL,
  foto_2_alt     VARCHAR(160) NOT NULL,
  actualizado_en TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

INSERT INTO contenido_taller (
  id,
  titulo,
  parrafo,
  foto_1_url,
  foto_1_alt,
  foto_2_url,
  foto_2_alt
) VALUES (
  1,
  'Nuestro taller',
  'Cada pedido se diseña y se estampa en nuestro taller de Tinogasta.',
  '/img/sitio/nuestro-taller.jpg',
  'Interior del taller de sublimación con una prensa térmica y productos personalizados',
  '/img/sitio/nuestro-taller-clienta.jpg',
  'Una clienta sostiene una remera personalizada en el taller de sublimación'
)
ON CONFLICT (id) DO NOTHING;
