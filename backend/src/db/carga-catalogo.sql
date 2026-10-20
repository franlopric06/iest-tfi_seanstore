-- Carga inicial del catálogo de la versión 1 (tarea 001-T02)
-- Ejecutar en el SQL Editor de Neon DESPUÉS de esquema-v1.sql (necesita las tablas creadas).
-- La DATABASE_URL nunca pasa por el chat: el estudiante lo corre a mano.
-- Datos: las 4 categorías y los 12 productos reales de specs/001-catalogo/spec.md.
--   precio NULL (se cotiza por WhatsApp) · descripcion NULL (los textos los pasa el negocio)
--   destacado FALSE (los 4 elegidos se marcan después con /cambio) · activo TRUE
--   sin filas en producto_fotos: los WebP aún no existen; entran con carga-fotos.sql.
-- ON CONFLICT DO NOTHING permite volver a correrlo sin duplicar filas.

INSERT INTO categorias (nombre, slug, orden) VALUES
  ('Tazas y termos', 'tazas-termos', 1),
  ('Indumentaria',   'indumentaria', 2),
  ('Deportes',       'deportes',     3),
  ('Accesorios',     'accesorios',   4)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO productos (codigo, slug, nombre, categoria_id, descripcion, precio, talles, colores, destacado, activo) VALUES
  ('TAZ-001', 'taza-ceramica', 'Taza de cerámica', (SELECT id FROM categorias WHERE slug = 'tazas-termos'), NULL, NULL, '{}', '{Blanco}', FALSE, TRUE),
  ('TAZ-002', 'taza-polimero',  'Taza de polímero', (SELECT id FROM categorias WHERE slug = 'tazas-termos'), NULL, NULL, '{}', '{Blanco}', FALSE, TRUE),
  ('TER-001', 'termo',          'Termo',            (SELECT id FROM categorias WHERE slug = 'tazas-termos'), NULL, NULL, '{}', '{Blanco}', FALSE, TRUE),
  ('BOT-001', 'botella',        'Botella',          (SELECT id FROM categorias WHERE slug = 'tazas-termos'), NULL, NULL, '{}', '{Blanco}', FALSE, TRUE),
  ('REM-001', 'remera',         'Remera',           (SELECT id FROM categorias WHERE slug = 'indumentaria'), NULL, NULL, '{S,M,L,XL,XXL}', '{Blanco}', FALSE, TRUE),
  ('BUZ-001', 'buzo',           'Buzo',             (SELECT id FROM categorias WHERE slug = 'indumentaria'), NULL, NULL, '{S,M,L,XL,XXL}', '{Blanco}', FALSE, TRUE),
  ('CAM-001', 'campera',        'Campera',          (SELECT id FROM categorias WHERE slug = 'indumentaria'), NULL, NULL, '{S,M,L,XL,XXL}', '{Blanco}', FALSE, TRUE),
  ('CAN-001', 'canilleras',     'Canilleras',       (SELECT id FROM categorias WHERE slug = 'deportes'),     NULL, NULL, '{S,M,L}', '{Blanco}', FALSE, TRUE),
  ('GOR-001', 'gorra',          'Gorra',            (SELECT id FROM categorias WHERE slug = 'accesorios'),   NULL, NULL, '{}', '{Blanco}', FALSE, TRUE),
  ('LAV-001', 'llavero',        'Llavero',          (SELECT id FROM categorias WHERE slug = 'accesorios'),   NULL, NULL, '{}', '{Blanco}', FALSE, TRUE),
  ('MOU-001', 'mousepad',       'Mousepad',         (SELECT id FROM categorias WHERE slug = 'accesorios'),   NULL, NULL, '{}', '{Blanco}', FALSE, TRUE),
  ('ALM-001', 'almohadon',      'Almohadón',        (SELECT id FROM categorias WHERE slug = 'accesorios'),   NULL, NULL, '{}', '{Blanco}', FALSE, TRUE)
ON CONFLICT (codigo) DO NOTHING;

-- Verificación para correr en Neon (los conteos que pide la tarea):
--   SELECT COUNT(*) FROM categorias;        -- 4
--   SELECT COUNT(*) FROM productos;         -- 12
--   SELECT COUNT(*) FROM producto_fotos;    -- 0
--   SELECT COUNT(*) FROM productos WHERE destacado = TRUE;  -- 0
--   SELECT COUNT(*) FROM productos WHERE activo = TRUE;     -- 12
