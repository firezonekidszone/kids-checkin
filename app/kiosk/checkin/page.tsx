'use client';

import React, { useState } from 'react';

type NewChild = { full_name: string; dob: string; allergies?: string; notes?: string };

export default function Page() {
  const [guardianName, setGuardianName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [children, setChildren] = useState<NewChild[]>([{ full_name: '', dob: '' }]);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  function addChild() {
    setChildren((prev) => [...prev, { full_name: '', dob: '' }]);
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMsg(null);
    setLoading(true);
    try {
      const res = await fetch('/api/kiosk/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          guardian: { full_name: guardianName, phone, email },
          children,
        }),
      });
      const data = await res.json();
      if (!res.ok || !data?.ok) throw new Error(data?.error || 'No se pudo registrar.');
      setMsg('¡Familia registrada! Ya pueden hacer check-in.');
    } catch (err: any) {
      setMsg(err.message || 'Error al registrar.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ maxWidth: 600, margin: '40px auto', fontFamily: 'system-ui, Arial' }}>
      <h1>Inscripción de familia</h1>

      <form onSubmit={onSubmit}>
        <h3>Tutor</h3>
        <label>Nombre completo</label>
        <input
          style={{ display: 'block', width: '100%', marginBottom: 8, padding: 10, border: '1px solid #ccc', borderRadius: 6 }}
          value={guardianName}
          onChange={(e) => setGuardianName(e.target.value)}
        />

        <label>Teléfono</label>
        <input
          type="tel"
          inputMode="numeric"
          pattern="[0-9]*"
          style={{ display: 'block', width: '100%', marginBottom: 8, padding: 10, border: '1px solid #ccc', borderRadius: 6 }}
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />

        <label>Email (opcional)</label>
        <input
          type="email"
          style={{ display: 'block', width: '100%', marginBottom: 16, padding: 10, border: '1px solid #ccc', borderRadius: 6 }}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <h3>Niños</h3>
        {children.map((c, i) => (
          <div key={i} style={{ padding: 12, border: '1px solid #eee', borderRadius: 6, marginBottom: 10 }}>
            <label>Nombre completo</label>
            <input
              style={{ display: 'block', width: '100%', marginBottom: 8, padding: 10, border: '1px solid #ccc', borderRadius: 6 }}
              value={c.full_name}
              onChange={(e) => {
                const copy = [...children];
                copy[i].full_name = e.target.value;
                setChildren(copy);
              }}
            />
            <label>Fecha de nacimiento</label>
            <input
              type="date"
              style={{ display: 'block', width: '100%', marginBottom: 8, padding: 10, border: '1px solid #ccc', borderRadius: 6 }}
              value={c.dob}
              onChange={(e) => {
                const copy = [...children];
                copy[i].dob = e.target.value;
                setChildren(copy);
              }}
            />
            <label>Alergias (opcional)</label>
            <input
              style={{ display: 'block', width: '100%', marginBottom: 8, padding: 10, border: '1px solid #ccc', borderRadius: 6 }}
              value={c.allergies || ''}
              onChange={(e) => {
                const copy = [...children];
                copy[i].allergies = e.target.value;
                setChildren(copy);
              }}
            />
            <label>Notas (opcional)</label>
            <input
              style={{ display: 'block', width: '100%', padding: 10, border: '1px solid #ccc', borderRadius: 6 }}
              value={c.notes || ''}
              onChange={(e) => {
                const copy = [...children];
                copy[i].notes = e.target.value;
                setChildren(copy);
              }}
            />
          </div>
        ))}

        <button type="button" onClick={addChild} style={{ padding: '8px 12px', border: '1px solid #000', borderRadius: 6, marginRight: 8 }}>
          + Agregar niño
        </button>
        <button type="submit" disabled={loading} style={{ padding: '8px 12px', border: '1px solid #000', borderRadius: 6 }}>
          {loading ? 'Guardando…' : 'Guardar'}
        </button>
      </form>

      {msg && <div style={{ marginTop: 12, padding: 10, border: '1px solid #ddd', borderRadius: 6 }}>{msg}</div>}

      <div style={{ marginTop: 24 }}>
        <a href="/kiosk/checkin">Ir a Check-In →</a>
      </div>
    </div>
  );
}
