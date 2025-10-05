import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseServer';
import { getOrCreateTodayService } from '@/services/today';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    // body: { guardian: { full_name, phone, email?, emergency_name?, emergency_phone? }, children: [{ full_name, dob, allergies?, notes? }, ...] }

    const g = body.guardian;
    const kids = body.children || [];
    if (!g?.phone || !g?.full_name || kids.length === 0) {
      return NextResponse.json({ ok: false, error: 'Datos incompletos' }, { status: 400 });
    }

    // 1) Upsert tutor por phone
    const { data: guardian, error: gErr } = await supabaseAdmin
      .from('kids.guardians')
      .upsert({
        full_name: g.full_name,
        phone: String(g.phone).replace(/\D/g, ''),
        email: g.email || null,
        emergency_name: g.emergency_name || null,
        emergency_phone: g.emergency_phone ? String(g.emergency_phone).replace(/\D/g, '') : null,
      }, { onConflict: 'phone' })
      .select('id')
      .single();

    if (gErr) throw new Error(gErr.message);
    const guardian_id = guardian.id;

    // 2) Insertar/actualizar niños y vincular
    const insertedKids: { id: string; full_name: string; dob: string; allergies: string | null }[] = [];

    for (const k of kids) {
      // Normalizar fecha 'YYYY-MM-DD'
      const dob = String(k.dob || '').trim();
      if (!/^\d{4}-\d{2}-\d{2}$/.test(dob)) {
        return NextResponse.json({ ok: false, error: 'DOB debe ser AAAA-MM-DD' }, { status: 400 });
      }

      const { data: child, error: cErr } = await supabaseAdmin
        .from('kids.children')
        .upsert({
          full_name: k.full_name,
          dob,
          allergies: k.allergies || null,
          notes: k.notes || null,
        }, { onConflict: 'full_name, dob' }) // puedes ajustar el índice único si usas otro
        .select('id, full_name, dob, allergies')
        .single();

      if (cErr) throw new Error(cErr.message);

      // Relación tutor—niño
      await supabaseAdmin
        .from('kids.guardian_children')
        .insert({ guardian_id, child_id: child.id })
        .onConflict('guardian_id, child_id')
        .ignore();

      insertedKids.push(child);
    }

    // 3) (Opcional) Crear check-ins de ejemplo para hoy con salón y código
    const service_id = await getOrCreateTodayService();

    for (const kid of insertedKids) {
      // Obtener salón por edad usando tu función RPC classroom_for(dob, service_date)
      const { data: cls, error: clsErr } = await supabaseAdmin
        .rpc('classroom_for', { dob: kid.dob, service_date: new Date().toISOString().slice(0, 10) });

      if (clsErr) throw new Error(clsErr.message);

      // Código único corto
      const code = Math.random().toString(36).slice(2, 8).toUpperCase();

      const { error: insErr } = await supabaseAdmin
        .from('kids.checkins')
        .insert({
          child_id: kid.id,
          service_id,
          classroom_name: cls?.name || 'Sin salón',
          security_code: code,
        });

      if (insErr) throw new Error(insErr.message);
    }

    return NextResponse.json({ ok: true });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e.message ?? 'Error' }, { status: 500 });
  }
}
