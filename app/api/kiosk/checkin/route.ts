app/api/kiosk/checkin/route.ts
``]
Contenido:
```ts
import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseServer';
import { getOrCreateTodayService } from '@/services/today';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    // body: { child_ids: string[] }
    const ids: string[] = body.child_ids || [];
    if (!ids.length) return NextResponse.json({ ok: false, error: 'Sin niños' }, { status: 400 });

    const service_id = await getOrCreateTodayService();
    const service_date = new Date().toISOString().slice(0, 10);

    for (const id of ids) {
      // salón por edad
      const { data: child, error: chErr } = await supabaseAdmin
        .from('kids.children')
        .select('id, dob, full_name, allergies')
        .eq('id', id)
        .single();
      if (chErr) throw new Error(chErr.message);

      const { data: cls, error: clsErr } = await supabaseAdmin
        .rpc('classroom_for', { dob: child.dob, service_date });
      if (clsErr) throw new Error(clsErr.message);

      const security_code = Math.random().toString(36).slice(2, 8).toUpperCase();

      const { error: insErr } = await supabaseAdmin
        .from('kids.checkins')
        .insert({
          child_id: id,
          service_id,
          classroom_name: cls?.name || 'Sin salón',
          security_code,
        });

      if (insErr) throw new Error(insErr.message);
    }

    return NextResponse.json({ ok: true });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e.message ?? 'Error' }, { status: 500 });
  }
}
