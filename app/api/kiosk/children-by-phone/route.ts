import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseServer';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const phone = searchParams.get('phone')?.replace(/\D/g, '');
  if (!phone) return NextResponse.json({ ok: false, error: 'phone requerido' }, { status: 400 });

  const { data: guardian, error: gErr } = await supabaseAdmin
    .from('kids.guardians')
    .select('id')
    .eq('phone', phone)
    .maybeSingle();

  if (gErr) return NextResponse.json({ ok: false, error: gErr.message }, { status: 500 });
  if (!guardian) return NextResponse.json({ ok: true, children: [] });

  const { data: children, error: cErr } = await supabaseAdmin
    .from('kids.guardian_children')
    .select('child:children(id, full_name, dob, allergies)')
    .eq('guardian_id', guardian.id);

  if (cErr) return NextResponse.json({ ok: false, error: cErr.message }, { status: 500 });

  return NextResponse.json({
    ok: true,
    children: (children || []).map((x: any) => x.child),
  });
}
