-- Carga de fotos de productos generadas con IA (tarea 001-T29)
-- Ejecutar en el SQL Editor de Neon DESPUÉS de datos-demo.sql (necesita los productos cargados).
-- Las fotos WebP están en frontend/public/img/productos/.
-- Todos los registros: generada_con_ia = TRUE (generadas con IA en la Actividad 4 del TFI).
-- La taza de polímero queda sin fotos por ahora (muestra el recuadro con el nombre, R13).
-- Se puede volver a correr: el DELETE borra las fotos previas de cada producto antes de insertar.
-- La DATABASE_URL nunca pasa por el chat: el estudiante lo corre a mano en Neon.

-- Limpiar fotos anteriores de los 11 productos con fotos nuevas
DELETE FROM producto_fotos
WHERE producto_id IN (
  SELECT id FROM productos
  WHERE slug IN (
    'taza-ceramica', 'termo', 'botella',
    'remera', 'buzo', 'campera',
    'canilleras', 'gorra', 'llavero', 'mousepad', 'almohadon'
  )
);

-- ─── Taza de cerámica ────────────────────────────────────────────────────────
INSERT INTO producto_fotos (producto_id, url, alt, generada_con_ia, orden)
SELECT producto_id, url, alt, TRUE, orden FROM (VALUES
  ((SELECT id FROM productos WHERE slug = 'taza-ceramica'), '/img/productos/taza-ceramica-blanco-iglesia-reloj.webp',    'Taza de cerámica blanca con la iglesia del reloj de Tinogasta estampada',                 1),
  ((SELECT id FROM productos WHERE slug = 'taza-ceramica'), '/img/productos/taza-ceramica-blanco-tu-nombre.webp',        'Taza de cerámica blanca con un nombre personalizado estampado',                           2),
  ((SELECT id FROM productos WHERE slug = 'taza-ceramica'), '/img/productos/taza-ceramica-negro-iglesia-adobe.webp',     'Taza de cerámica negra con una iglesia de adobe de la Ruta del Adobe estampada',          3),
  ((SELECT id FROM productos WHERE slug = 'taza-ceramica'), '/img/productos/taza-ceramica-negro-tu-marca.webp',          'Taza de cerámica negra con el logo de una marca personalizada estampado',                  4),
  ((SELECT id FROM productos WHERE slug = 'taza-ceramica'), '/img/productos/taza-ceramica-beige-iglesia-andacollo.webp', 'Taza de cerámica beige con la Iglesia de Andacollo estampada',                             5),
  ((SELECT id FROM productos WHERE slug = 'taza-ceramica'), '/img/productos/taza-ceramica-beige-tu-frase.webp',          'Taza de cerámica beige con una frase personalizada estampada',                             6),
  ((SELECT id FROM productos WHERE slug = 'taza-ceramica'), '/img/productos/taza-ceramica-verde-claro-copa-vino.webp',   'Taza de cerámica verde claro con una copa de vino estampada',                             7)
) AS t(producto_id, url, alt, orden);

-- ─── Termo ───────────────────────────────────────────────────────────────────
INSERT INTO producto_fotos (producto_id, url, alt, generada_con_ia, orden)
SELECT producto_id, url, alt, TRUE, orden FROM (VALUES
  ((SELECT id FROM productos WHERE slug = 'termo'), '/img/productos/termo-negro-ecoparque-andalucas.webp',   'Termo negro con el ecoparque de Andalucás estampado',                       1),
  ((SELECT id FROM productos WHERE slug = 'termo'), '/img/productos/termo-blanco-iglesia-reloj.webp',        'Termo blanco con la iglesia del reloj de Tinogasta estampada',              2),
  ((SELECT id FROM productos WHERE slug = 'termo'), '/img/productos/termo-blanco-tu-nombre.webp',            'Termo blanco con un nombre personalizado estampado',                        3),
  ((SELECT id FROM productos WHERE slug = 'termo'), '/img/productos/termo-negro-tu-marca.webp',              'Termo negro con el logo de una marca personalizada estampado',              4),
  ((SELECT id FROM productos WHERE slug = 'termo'), '/img/productos/termo-rosa-iglesia-andacollo.webp',      'Termo rosa con la Iglesia de Andacollo estampada',                          5),
  ((SELECT id FROM productos WHERE slug = 'termo'), '/img/productos/termo-rosa-tu-frase.webp',               'Termo rosa con una frase personalizada estampada',                          6),
  ((SELECT id FROM productos WHERE slug = 'termo'), '/img/productos/termo-verde-claro-iglesia-adobe.webp',   'Termo verde claro con una iglesia de adobe de la Ruta del Adobe estampada', 7)
) AS t(producto_id, url, alt, orden);

-- ─── Botella ─────────────────────────────────────────────────────────────────
INSERT INTO producto_fotos (producto_id, url, alt, generada_con_ia, orden)
SELECT producto_id, url, alt, TRUE, orden FROM (VALUES
  ((SELECT id FROM productos WHERE slug = 'botella'), '/img/productos/botella-blanco-mas-fuerte-que-ayer.webp', 'Botella de aluminio blanca con la frase "Más fuerte que ayer" estampada',   1),
  ((SELECT id FROM productos WHERE slug = 'botella'), '/img/productos/botella-blanco-tu-marca.webp',            'Botella de aluminio blanca con el logo de una marca personalizada estampado', 2),
  ((SELECT id FROM productos WHERE slug = 'botella'), '/img/productos/botella-azul-tu-frase.webp',              'Botella de aluminio azul con una frase personalizada estampada',             3),
  ((SELECT id FROM productos WHERE slug = 'botella'), '/img/productos/botella-azul-un-paso-mas.webp',           'Botella de aluminio azul con la frase "Un paso más" estampada',              4),
  ((SELECT id FROM productos WHERE slug = 'botella'), '/img/productos/botella-negro-no-pares.webp',             'Botella de aluminio negra con la frase "No pares" estampada',                5),
  ((SELECT id FROM productos WHERE slug = 'botella'), '/img/productos/botella-negro-tu-nombre.webp',            'Botella de aluminio negra con un nombre personalizado estampado',            6)
) AS t(producto_id, url, alt, orden);

-- ─── Remera ──────────────────────────────────────────────────────────────────
INSERT INTO producto_fotos (producto_id, url, alt, generada_con_ia, orden)
SELECT producto_id, url, alt, TRUE, orden FROM (VALUES
  ((SELECT id FROM productos WHERE slug = 'remera'), '/img/productos/remera-blanco-letras-tinogasta.webp', 'Remera blanca con las letras de Tinogasta estampadas en el pecho',   1),
  ((SELECT id FROM productos WHERE slug = 'remera'), '/img/productos/remera-negro-cartel-plaza.webp',     'Remera negra con el cartel de la plaza de Tinogasta estampado',        2),
  ((SELECT id FROM productos WHERE slug = 'remera'), '/img/productos/remera-azul-tu-marca.webp',          'Remera azul con el logo de una marca personalizada estampado',         3),
  ((SELECT id FROM productos WHERE slug = 'remera'), '/img/productos/remera-gris-tu-nombre.webp',         'Remera gris con un nombre personalizado estampado',                    4),
  ((SELECT id FROM productos WHERE slug = 'remera'), '/img/productos/remera-rojo-tu-frase.webp',          'Remera roja con una frase personalizada estampada',                    5)
) AS t(producto_id, url, alt, orden);

-- ─── Buzo ─────────────────────────────────────────────────────────────────────
INSERT INTO producto_fotos (producto_id, url, alt, generada_con_ia, orden)
SELECT producto_id, url, alt, TRUE, orden FROM (VALUES
  ((SELECT id FROM productos WHERE slug = 'buzo'), '/img/productos/buzo-blanco-cartel-plaza.webp',   'Buzo blanco con el cartel de la plaza de Tinogasta estampado',               1),
  ((SELECT id FROM productos WHERE slug = 'buzo'), '/img/productos/buzo-negro-iglesia-adobe.webp',   'Buzo negro con una iglesia de adobe de la Ruta del Adobe estampada',         2),
  ((SELECT id FROM productos WHERE slug = 'buzo'), '/img/productos/buzo-azul-tu-marca.webp',         'Buzo azul con el logo de una marca personalizada estampado',                 3),
  ((SELECT id FROM productos WHERE slug = 'buzo'), '/img/productos/buzo-gris-tu-nombre.webp',        'Buzo gris con un nombre personalizado estampado',                            4),
  ((SELECT id FROM productos WHERE slug = 'buzo'), '/img/productos/buzo-negro-tu-frase.webp',        'Buzo negro con una frase personalizada estampada',                           5)
) AS t(producto_id, url, alt, orden);

-- ─── Campera ──────────────────────────────────────────────────────────────────
INSERT INTO producto_fotos (producto_id, url, alt, generada_con_ia, orden)
SELECT producto_id, url, alt, TRUE, orden FROM (VALUES
  ((SELECT id FROM productos WHERE slug = 'campera'), '/img/productos/campera-blanco-ruta-del-adobe.webp',    'Campera blanca con la Ruta del Adobe de Tinogasta estampada',                      1),
  ((SELECT id FROM productos WHERE slug = 'campera'), '/img/productos/campera-negro-iglesia-reloj.webp',      'Campera negra con la iglesia del reloj de Tinogasta estampada',                    2),
  ((SELECT id FROM productos WHERE slug = 'campera'), '/img/productos/campera-azul-tu-marca-tu-nombre.webp',  'Campera azul con el logo de una marca y un nombre personalizados estampados',      3),
  ((SELECT id FROM productos WHERE slug = 'campera'), '/img/productos/campera-gris-tu-logo-tu-frase.webp',    'Campera gris con un logo y una frase personalizados estampados',                  4),
  ((SELECT id FROM productos WHERE slug = 'campera'), '/img/productos/campera-negro-tu-nombre-tu-marca.webp', 'Campera negra con un nombre y el logo de una marca personalizados estampados',   5)
) AS t(producto_id, url, alt, orden);

-- ─── Canilleras ───────────────────────────────────────────────────────────────
INSERT INTO producto_fotos (producto_id, url, alt, generada_con_ia, orden)
SELECT producto_id, url, alt, TRUE, orden FROM (VALUES
  ((SELECT id FROM productos WHERE slug = 'canilleras'), '/img/productos/canilleras-negro-diseno-deportivo.webp',   'Canilleras negras con un diseño deportivo estampado',                1),
  ((SELECT id FROM productos WHERE slug = 'canilleras'), '/img/productos/canilleras-blanco-tu-nombre-10.webp',      'Canilleras blancas con un nombre y el número 10 estampados',         2),
  ((SELECT id FROM productos WHERE slug = 'canilleras'), '/img/productos/canilleras-negro-argentina-malvinas.webp', 'Canilleras negras con el diseño Argentina Malvinas estampado',        3)
) AS t(producto_id, url, alt, orden);

-- ─── Gorra ────────────────────────────────────────────────────────────────────
INSERT INTO producto_fotos (producto_id, url, alt, generada_con_ia, orden)
SELECT producto_id, url, alt, TRUE, orden FROM (VALUES
  ((SELECT id FROM productos WHERE slug = 'gorra'), '/img/productos/gorra-blanco-cartel-plaza.webp', 'Gorra blanca con el cartel de la plaza de Tinogasta estampado en el frente',           1),
  ((SELECT id FROM productos WHERE slug = 'gorra'), '/img/productos/gorra-negro-iglesia-adobe.webp', 'Gorra negra con una iglesia de adobe de la Ruta del Adobe estampada en el frente',    2),
  ((SELECT id FROM productos WHERE slug = 'gorra'), '/img/productos/gorra-azul-tu-logo.webp',        'Gorra azul con un logo personalizado estampado en el frente',                         3)
) AS t(producto_id, url, alt, orden);

-- ─── Llavero ──────────────────────────────────────────────────────────────────
INSERT INTO producto_fotos (producto_id, url, alt, generada_con_ia, orden)
SELECT producto_id, url, alt, TRUE, orden FROM (VALUES
  ((SELECT id FROM productos WHERE slug = 'llavero'), '/img/productos/llavero-transparente-yo-amo-tinogasta.webp', 'Llavero transparente con el diseño "Yo amo Tinogasta" estampado',              1),
  ((SELECT id FROM productos WHERE slug = 'llavero'), '/img/productos/llavero-blanco-iglesia-reloj.webp',          'Llavero blanco con la iglesia del reloj de Tinogasta estampada',               2),
  ((SELECT id FROM productos WHERE slug = 'llavero'), '/img/productos/llavero-blanco-tu-logo.webp',                'Llavero blanco con un logo personalizado estampado',                           3),
  ((SELECT id FROM productos WHERE slug = 'llavero'), '/img/productos/llavero-negro-tu-nombre.webp',               'Llavero negro con un nombre personalizado estampado',                          4)
) AS t(producto_id, url, alt, orden);

-- ─── Mousepad ─────────────────────────────────────────────────────────────────
INSERT INTO producto_fotos (producto_id, url, alt, generada_con_ia, orden)
SELECT producto_id, url, alt, TRUE, orden FROM (VALUES
  ((SELECT id FROM productos WHERE slug = 'mousepad'), '/img/productos/mousepad-blanco-ecoparque-andalucas.webp', 'Mousepad blanco con el ecoparque de Andalucás estampado',                  1),
  ((SELECT id FROM productos WHERE slug = 'mousepad'), '/img/productos/mousepad-blanco-letras-tinogasta.webp',    'Mousepad blanco con las letras de Tinogasta estampadas',                   2),
  ((SELECT id FROM productos WHERE slug = 'mousepad'), '/img/productos/mousepad-blanco-tu-marca.webp',            'Mousepad blanco con el logo de una marca personalizada estampado',        3),
  ((SELECT id FROM productos WHERE slug = 'mousepad'), '/img/productos/mousepad-negro-tu-logo.webp',              'Mousepad negro con un logo personalizado estampado',                       4)
) AS t(producto_id, url, alt, orden);

-- ─── Almohadón ────────────────────────────────────────────────────────────────
INSERT INTO producto_fotos (producto_id, url, alt, generada_con_ia, orden)
SELECT producto_id, url, alt, TRUE, orden FROM (VALUES
  ((SELECT id FROM productos WHERE slug = 'almohadon'), '/img/productos/almohadon-blanco-tu-frase.webp',        'Almohadón blanco con una frase personalizada estampada en la funda',       1),
  ((SELECT id FROM productos WHERE slug = 'almohadon'), '/img/productos/almohadon-blanco-tu-diseno.webp',       'Almohadón blanco con un diseño personalizado estampado en la funda',       2),
  ((SELECT id FROM productos WHERE slug = 'almohadon'), '/img/productos/almohadon-gris-tu-frase.webp',          'Almohadón gris con una frase personalizada estampada en la funda',         3),
  ((SELECT id FROM productos WHERE slug = 'almohadon'), '/img/productos/almohadon-gris-tu-diseno.webp',         'Almohadón gris con un diseño personalizado estampado en la funda',         4),
  ((SELECT id FROM productos WHERE slug = 'almohadon'), '/img/productos/almohadon-verde-claro-tu-frase.webp',   'Almohadón verde claro con una frase personalizada estampada en la funda',  5),
  ((SELECT id FROM productos WHERE slug = 'almohadon'), '/img/productos/almohadon-verde-claro-tu-diseno.webp',  'Almohadón verde claro con un diseño personalizado estampado en la funda',  6)
) AS t(producto_id, url, alt, orden);

-- Verificación (correr en Neon después de ejecutar):
--   SELECT COUNT(*) FROM producto_fotos;                                    -- 55
--   SELECT COUNT(*) FROM producto_fotos WHERE generada_con_ia = TRUE;       -- 55
--   SELECT COUNT(*) FROM producto_fotos WHERE orden = 1;                    -- 11
--   SELECT p.nombre, COUNT(f.id) AS fotos
--     FROM productos p
--     LEFT JOIN producto_fotos f ON f.producto_id = p.id
--     GROUP BY p.nombre ORDER BY p.nombre;
--   -- taza-polimero debe dar 0, el resto entre 3 y 7.
