import { createClient } from '@supabase/supabase-js';

export interface ResultadoChaside {
  id?: string;
  codigo: string;
  nombres: string;
  apellidos: string;
  correo: string;
  telefono: string | null;
  area1_codigo: string;
  area1_nombre: string;
  area1_puntaje: number;
  area2_codigo: string | null;
  area2_nombre: string | null;
  area2_puntaje: number | null;
  fecha_emision: string;
  acepta_contacto: boolean;
  email_enviado?: boolean;
  created_at?: string;
}

function getSupabaseClient() {
  const url = import.meta.env.SUPABASE_URL;
  const key = import.meta.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) throw new Error('SUPABASE_URL y SUPABASE_SERVICE_ROLE_KEY son requeridos');
  return createClient(url, key, { auth: { persistSession: false } });
}

export async function guardarResultado(data: Omit<ResultadoChaside, 'id' | 'email_enviado' | 'created_at'>) {
  const supabase = getSupabaseClient();
  const { error } = await supabase
    .from('resultados_chaside')
    .upsert(data, { onConflict: 'codigo' });
  if (error) throw error;
}

export async function verificarCodigo(codigo: string): Promise<ResultadoChaside | null> {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase
    .from('resultados_chaside')
    .select('codigo, nombres, apellidos, area1_codigo, area1_nombre, area1_puntaje, area2_codigo, area2_nombre, area2_puntaje, fecha_emision')
    .eq('codigo', codigo)
    .maybeSingle();
  if (error) throw error;
  return data as ResultadoChaside | null;
}

export async function marcarEmailEnviado(codigo: string) {
  const supabase = getSupabaseClient();
  await supabase
    .from('resultados_chaside')
    .update({ email_enviado: true })
    .eq('codigo', codigo);
}

export interface ContactoWeb {
  id?: string;
  nombre: string;
  email: string;
  telefono: string | null;
  mensaje: string;
  origen?: string;
  leido?: boolean;
  created_at?: string;
}

export async function guardarContacto(data: Omit<ContactoWeb, 'id' | 'leido' | 'created_at'>) {
  const supabase = getSupabaseClient();
  const { error } = await supabase.from('contactos_web').insert(data);
  if (error) throw error;
}
