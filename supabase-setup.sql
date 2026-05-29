-- ============================================================
-- GESCO — Setup Supabase
-- Ejecutar en: supabase.com → proyecto → SQL Editor → New query
-- ============================================================

CREATE TABLE IF NOT EXISTS public.resultados_chaside (
  id               UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
  codigo           TEXT        UNIQUE NOT NULL,
  nombres          TEXT        NOT NULL,
  apellidos        TEXT        NOT NULL,
  correo           TEXT        NOT NULL,
  telefono         TEXT,
  area1_codigo     CHAR(1)     NOT NULL,
  area1_nombre     TEXT        NOT NULL,
  area1_puntaje    SMALLINT    NOT NULL,
  area2_codigo     CHAR(1),
  area2_nombre     TEXT,
  area2_puntaje    SMALLINT,
  fecha_emision    DATE        NOT NULL,
  acepta_contacto  BOOLEAN     NOT NULL DEFAULT TRUE,
  email_enviado    BOOLEAN     NOT NULL DEFAULT FALSE,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Índice para búsqueda rápida por código (verificación)
CREATE INDEX IF NOT EXISTS idx_resultados_chaside_codigo
  ON public.resultados_chaside (codigo);

-- Índice para reportes por correo (leads)
CREATE INDEX IF NOT EXISTS idx_resultados_chaside_correo
  ON public.resultados_chaside (correo);

-- Row Level Security: bloquea acceso anónimo directo.
-- El servidor usa service_role_key que bypasea RLS automáticamente.
ALTER TABLE public.resultados_chaside ENABLE ROW LEVEL SECURITY;

-- Comentarios de columnas
COMMENT ON TABLE  public.resultados_chaside              IS 'Resultados del Test Vocacional CHASIDE generados en gescovirtual.com';
COMMENT ON COLUMN public.resultados_chaside.codigo       IS 'Código único del certificado: GESCO-CH-YYYYMMDD-XXXXXX';
COMMENT ON COLUMN public.resultados_chaside.area1_codigo IS 'Código CHASIDE del área principal (C/H/A/S/I/D/E)';
COMMENT ON COLUMN public.resultados_chaside.email_enviado IS 'TRUE si el resultado fue enviado al correo del estudiante';
