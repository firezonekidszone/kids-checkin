'use client';

import { useState } from 'react';

type Child = { full_name: string; dob: string; allergies?: string; notes?: string };

export default function SignupPage() {
  const [guardian, setGuardian] = useState({
    full_name: '',
    phone: '',
    email: '',
    emergency_name: '',
    emergency_phone: '',
  });
  const [children, setChildren] = useState<Child[]>([
    { full_name: '', dob: '', allergies: '', notes: '' },
  ]);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  const addChild = () => setChildren([...children, { full_name: '', dob: '' } as Child]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMsg(null);
    try {
      const res = await fetch('/api/kiosk/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ guardian, children }),
      });
      const js = await res.json();
      if (!js.ok) throw new Error(js.error || 'Error');
      setMsg('¡Guardado con éxito!');
    } catch (err: any) {
      setMsg(err.message || 'Error');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div style={{ maxWidth: 640, margin: '24px auto', padding: 16 }}>
      <h1>Inscripción de Familia</h1>

      <form onSubmit={onSubmit}>
        <h3>Tutor</h3>
        <input placeholder="Nombre completo"
               value={guardian.full_name}
               onChange={e => setGuardian({ ...guardian, full_name: e.target.value })}
        />
        <input placeholder="Teléfono (solo dígitos)"
               value={guardian.phone}
               onChange={e => setGuardian({ ...guardian, phone: e.target.value })}
        />
        <input placeholder="Email (opcional)"
               value={guardian.email}
               onChange={e => setGuardian({ ...guardian, email: e.target.value })}
        />
        <input placeholder="Contacto de emergencia (opcional)"
               value={guardian.emergency_name}
               onChange={e => setGuardian({ ...guardian, emergency_name: e.target.value })}
        />
        <input placeholder="Tel. de emergencia (opcional)"
               value={guardian.emergency_phone}
               onChange={e => setGuardian({ ...guardian, emergency_phone: e.target.value })}
        />

        <h3>Niños</h3>
        {children.map((c, i) => (
          <div key={i} style={{ border: '1px solid #ddd', padding: 12, marginBottom: 8 }}>
            <input placeholder="Nombre completo"
                   value={c.full_name}
                   onChange={e => {
                     const n = [...children]; n[i].full_name = e.target.value; setChildren(n);
                   }}
            />
            <input placeholder="Fecha de nacimiento (AAAA-MM-DD)"
                   value={c.dob}
                   onChange={e => {
                     const n = [...children]; n[i].dob = e.target.value; setChildren(n);
                   }}
            />
            <input placeholder="Alergias (opcional)"
                   value={c.allergies || ''}
                   onChange={e => {
                     const n = [...children]; n[i].allergies = e.target.value; setChildren(n);
                   }}
            />
            <input placeholder="Notas (opcional)"
                   value={c.notes || ''}
                   onChange={e => {
                     const n = [...children]; n[i].notes = e.target.value; setChildren(n);
                   }}
            />
          </div>
        ))}

        <button type="button" onClick={addChild}>+ Agregar niño</button>
        <button type="submit" disabled={saving} style={{ marginLeft: 8 }}>
          {saving ? 'Guardando...' : 'Guardar'}
        </button>
      </form>

      {msg && <p style={{ marginTop: 12 }}>{msg}</p>}

      <div style={{ marginTop: 16 }}>
        <a href="/kiosk/checkin">Ir a Check-In →</a>
      </div>

      <style jsx>{`
        input { display:block; width:100%; padding:10px; margin:6px 0; border:1px solid #ccc; border-radius:6px; }
        button { padding:8px 14px; border:1px solid #000; border-radius:6px; margin-right:8px; }
      `}</style>
    </div>
  );
}
