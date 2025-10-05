app/kiosk/checkin/page.tsx
``]
Contenido:
```tsx
'use client';

import { useState } from 'react';

type Child = { id: string; full_name: string; dob: string; allergies?: string | null };

export default function CheckinPage() {
  const [phone, setPhone] = useState('');
  const [children, setChildren] = useState<Child[]>([]);
  const [selected, setSelected] = useState<string[]>([]);
  const [msg, setMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const search = async () => {
    setLoading(true); setMsg(null);
    const res = await fetch(`/api/kiosk/children-by-phone?phone=${encodeURIComponent(phone)}`);
    const js = await res.json();
    setLoading(false);
    if (!js.ok) { setMsg(js.error || 'Error'); return; }
    setChildren(js.children || []);
    setSelected([]);
  };

  const doCheckin = async () => {
    setLoading(true); setMsg(null);
    const res = await fetch('/api/kiosk/checkin', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ child_ids: selected }),
    });
    const js = await res.json();
    setLoading(false);
    if (!js.ok) { setMsg(js.error || 'Error'); return; }
    setMsg('¡Check-In realizado!');
  };

  return (
    <div style={{ maxWidth: 640, margin: '24px auto', padding: 16 }}>
      <h1>Check-In</h1>

      <div style={{ display: 'flex', gap: 8 }}>
        <input
          placeholder="Teléfono del tutor (solo dígitos)"
          value={phone}
          onChange={e => setPhone(e.target.value)}
        />
        <button onClick={search} disabled={loading}>Buscar</button>
      </div>

      <ul style={{ marginTop: 12 }}>
        {children.map(ch => (
          <li key={ch.id} style={{ listStyle: 'none', border: '1px solid #ddd', padding: 8, marginBottom: 6 }}>
            <label>
              <input
                type="checkbox"
                checked={selected.includes(ch.id)}
                onChange={e => {
                  setSelected(s => e.target.checked ? [...s, ch.id] : s.filter(x => x !== ch.id));
                }}
              />
              <span style={{ marginLeft: 8 }}>
                {ch.full_name} — DOB: {ch.dob}{ch.allergies ? ` — Alergias: ${ch.allergies}` : ''}
              </span>
            </label>
          </li>
        ))}
      </ul>

      {children.length > 0 && (
        <button onClick={doCheckin} disabled={loading || selected.length === 0}>Hacer Check-In</button>
      )}

      {msg && <p style={{ marginTop: 12 }}>{msg}</p>}

      <div style={{ marginTop: 16 }}>
        <a href="/kiosk/signup">← Volver a Inscripción</a>
      </div>

      <style jsx>{`
        input { flex:1; padding:10px; border:1px solid #ccc; border-radius:6px; }
        button { padding:8px 14px; border:1px solid #000; border-radius:6px; }
      `}</style>
    </div>
  );
}
