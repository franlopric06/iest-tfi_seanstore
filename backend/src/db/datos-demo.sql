-- Datos de demostración del catálogo (tarea 001-T03)
-- UPDATE de los 12 productos con el precio, el stock, la descripción y el destacado
-- de la tabla de ETAPA-1.md. Ejecutar en el SQL Editor de Neon DESPUÉS de carga-catalogo.sql.
-- La DATABASE_URL nunca pasa por el chat: el estudiante lo corre a mano.
-- Es una tienda de demostración: estos precios y datos son de ejemplo
-- (el pie de la tienda lo avisa y no entran como ofertas en el JSON-LD).
-- Todos los productos son blancos; los talles y colores ya los cargó carga-catalogo.sql.
-- Se puede volver a correr sin problema: son UPDATE por codigo, nunca INSERT.

UPDATE productos SET precio = 12000, stock = 40,  destacado = TRUE,
  descripcion = 'Taza blanca de cerámica de 325 ml, estampada con tu foto, tu logo o una frase. Apta microondas.'
  WHERE codigo = 'TAZ-001';

UPDATE productos SET precio = 9500,  stock = 30,  destacado = FALSE,
  descripcion = 'Taza de polímero irrompible, ideal para chicos y para regalar. Se estampa con el diseño que quieras.'
  WHERE codigo = 'TAZ-002';

UPDATE productos SET precio = 28000, stock = 15,  destacado = TRUE,
  descripcion = 'Termo de acero inoxidable de 500 ml que mantiene el frío y el calor, con tu diseño.'
  WHERE codigo = 'TER-001';

UPDATE productos SET precio = 18000, stock = 20,  destacado = FALSE,
  descripcion = 'Botella de aluminio de 600 ml con tapa a rosca, para el gimnasio, la facu o el trabajo.'
  WHERE codigo = 'BOT-001';

UPDATE productos SET precio = 16000, stock = 50,  destacado = TRUE,
  descripcion = 'Remera de poliéster de manga corta, liviana y fresca. El estampado no se va con el lavado.'
  WHERE codigo = 'REM-001';

UPDATE productos SET precio = 38000, stock = 20,  destacado = FALSE,
  descripcion = 'Buzo con capucha y bolsillo canguro, ideal para egresados, equipos y empresas.'
  WHERE codigo = 'BUZ-001';

UPDATE productos SET precio = 52000, stock = 12,  destacado = FALSE,
  descripcion = 'Campera con cierre, abrigada, personalizada con nombre, número o logo.'
  WHERE codigo = 'CAM-001';

UPDATE productos SET precio = 14000, stock = 25,  destacado = TRUE,
  descripcion = 'Canilleras livianas estampadas con tu nombre, tu número o el escudo de tu equipo.'
  WHERE codigo = 'CAN-001';

UPDATE productos SET precio = 13000, stock = 30,  destacado = FALSE,
  descripcion = 'Gorra trucker con frente estampado y regulación atrás.'
  WHERE codigo = 'GOR-001';

UPDATE productos SET precio = 3500,  stock = 100, destacado = FALSE,
  descripcion = 'Llavero con tu foto o tu logo, ideal como souvenir o regalo empresarial.'
  WHERE codigo = 'LAV-001';

UPDATE productos SET precio = 7500,  stock = 40,  destacado = FALSE,
  descripcion = 'Mousepad de 22 × 18 cm con base antideslizante y tu diseño.'
  WHERE codigo = 'MOU-001';

UPDATE productos SET precio = 15000, stock = 20,  destacado = FALSE,
  descripcion = 'Almohadón de 40 × 40 cm con funda estampada y relleno incluido.'
  WHERE codigo = 'ALM-001';

-- Verificación para correr en Neon (lo que pide la tarea T03):
--   SELECT COUNT(*) FROM productos
--     WHERE precio IS NOT NULL AND stock IS NOT NULL AND descripcion IS NOT NULL;  -- 12
--   SELECT COUNT(*) FROM productos WHERE destacado = TRUE;  -- 4
--   SELECT codigo, nombre, precio, stock, destacado FROM productos WHERE destacado = TRUE;
--     -- TAZ-001 Taza de cerámica, TER-001 Termo, REM-001 Remera, CAN-001 Canilleras
