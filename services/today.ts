import { supabaseAdmin } from '@/lib/supabaseServer';

export async function getOrCreateTodayService() {
  // Fecha a las 00:00 en ISO (solo yyyy-mm-dd)
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const dateStr = today.toISOString().slice(0, 10);

  // 1) Buscar si ya existe servicio para hoy
  const { data: existing, error: findErr } = await supabaseAdmin
    .from('kids.services')
    .select('id')
    .eq('service_date', dateStr)
    .limit(1)
    .maybeSingle();

  if (!findErr && existing) return existing.id;

  // 2) Si no existe, crearlo
  const { data: created, error: insErr } = await supabaseAdmin
    .from('kids.services')
    .insert({ service_date: dateStr, name: 'Domingo' })
    .select('id')
    .single();

  if (insErr) throw new Error(insErr.message);
  return created.id;
}
