-- Marca «Generado con IA» para las fotos de Nuestro taller (01/11/2026).
-- Ejecutar una sola vez en el SQL Editor de Neon, ANTES de publicar el código nuevo.
-- Se puede volver a correr sin problema (IF NOT EXISTS).

ALTER TABLE contenido_taller
  ADD COLUMN IF NOT EXISTS foto_1_ia BOOLEAN NOT NULL DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS foto_2_ia BOOLEAN NOT NULL DEFAULT FALSE;

-- Las fotos que vienen con el proyecto (/img/...) se hicieron con IA.
-- Las subidas desde el panel quedan como estaban: se marcan al volver a subirlas.
UPDATE contenido_taller
SET foto_1_ia = foto_1_ia OR foto_1_url LIKE '/img/%',
    foto_2_ia = foto_2_ia OR foto_2_url LIKE '/img/%'
WHERE id = 1;

-- Para revisar: SELECT foto_1_url, foto_1_ia, foto_2_url, foto_2_ia FROM contenido_taller;
