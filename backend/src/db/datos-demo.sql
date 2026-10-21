-- Datos de demostración del catálogo (tarea 001-T03; colores por producto con /cambio 20/10/2026)
-- UPDATE de los 12 productos con el precio, el stock, la descripción, el destacado
-- y la columna colores de la tabla de ETAPA-1.md. Ejecutar en el SQL Editor de Neon
-- DESPUÉS de carga-catalogo.sql.
-- La DATABASE_URL nunca pasa por el chat: el estudiante lo corre a mano.
-- Es una tienda de demostración: estos precios y datos son de ejemplo
-- (el pie de la tienda lo avisa y no entran como ofertas en el JSON-LD).
-- Los productos no son solo blancos: el negocio sublima en muchos colores y
-- cada producto lleva su lista en la columna colores.
-- Se puede volver a correr sin problema: son UPDATE por codigo, nunca INSERT.

UPDATE productos SET precio = 12000, stock = 40,  destacado = TRUE,
  colores = '{Blanco,Negro,Beige,"Verde claro"}',
  descripcion = 'Taza de cerámica de 325 ml, estampada con tu foto, tu logo o una frase. Apta microondas.'
  WHERE codigo = 'TAZ-001';

UPDATE productos SET precio = 9500,  stock = 30,  destacado = FALSE,
  colores = '{Blanco,Negro,Beige,"Verde claro"}',
  descripcion = 'Taza de polímero irrompible, ideal para chicos y para regalar. Se estampa con el diseño que quieras.'
  WHERE codigo = 'TAZ-002';

UPDATE productos SET precio = 28000, stock = 15,  destacado = TRUE,
  colores = '{Blanco,Negro,Rosa,"Verde claro"}',
  descripcion = 'Termo de acero inoxidable de 500 ml que mantiene el frío y el calor, con tu diseño.'
  WHERE codigo = 'TER-001';

UPDATE productos SET precio = 18000, stock = 20,  destacado = FALSE,
  colores = '{Blanco,Negro,Azul}',
  descripcion = 'Botella de aluminio de 600 ml con tapa a rosca, para el gimnasio, la facu o el trabajo.'
  WHERE codigo = 'BOT-001';

UPDATE productos SET precio = 16000, stock = 50,  destacado = TRUE,
  colores = '{Blanco,Negro,Gris,Azul,Rojo}',
  descripcion = 'Remera de poliéster de manga corta, liviana y fresca. El estampado no se va con el lavado.'
  WHERE codigo = 'REM-001';

UPDATE productos SET precio = 38000, stock = 20,  destacado = FALSE,
  colores = '{Blanco,Negro,Gris,Azul}',
  descripcion = 'Buzo con capucha y bolsillo canguro, ideal para egresados, equipos y empresas.'
  WHERE codigo = 'BUZ-001';

UPDATE productos SET precio = 52000, stock = 12,  destacado = FALSE,
  colores = '{Blanco,Negro,Gris,Azul}',
  descripcion = 'Campera con cierre, abrigada, personalizada con nombre, número o logo.'
  WHERE codigo = 'CAM-001';

UPDATE productos SET precio = 14000, stock = 25,  destacado = TRUE,
  colores = '{Blanco,Negro}',
  descripcion = 'Canilleras livianas estampadas con tu nombre, tu número o el escudo de tu equipo.'
  WHERE codigo = 'CAN-001';

UPDATE productos SET precio = 13000, stock = 30,  destacado = FALSE,
  colores = '{Blanco,Negro,Azul}',
  descripcion = 'Gorra trucker con frente estampado y regulación atrás.'
  WHERE codigo = 'GOR-001';

UPDATE productos SET precio = 3500,  stock = 100, destacado = FALSE,
  colores = '{Blanco}',
  descripcion = 'Llavero con tu foto o tu logo, ideal como souvenir o regalo empresarial.'
  WHERE codigo = 'LAV-001';

UPDATE productos SET precio = 7500,  stock = 40,  destacado = FALSE,
  colores = '{Blanco}',
  descripcion = 'Mousepad de 22 × 18 cm con base antideslizante y tu diseño.'
  WHERE codigo = 'MOU-001';

UPDATE productos SET precio = 15000, stock = 20,  destacado = FALSE,
  colores = '{Blanco,Gris}',
  descripcion = 'Almohadón de 40 × 40 cm con funda estampada y relleno incluido.'
  WHERE codigo = 'ALM-001';

-- Verificación para correr en Neon (lo que pide la tarea T03):
--   SELECT COUNT(*) FROM productos
--     WHERE precio IS NOT NULL AND stock IS NOT NULL AND descripcion IS NOT NULL;  -- 12
--   SELECT COUNT(*) FROM productos WHERE destacado = TRUE;  -- 4
--   SELECT codigo, nombre, precio, stock, destacado FROM productos WHERE destacado = TRUE;
--     -- TAZ-001 Taza de cerámica, TER-001 Termo, REM-001 Remera, CAN-001 Canilleras
--   SELECT codigo, nombre, colores FROM productos ORDER BY codigo;  -- la lista nueva en los 12
