'use client';

import React, { useState } from 'react';

type Child = {
  id: string;
  full_name: string;
  allergies?: string | null;
  classroom_name?: string | null;
};

export default function Page() {
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [children, setChildren] = useState<Child[]>([]);
  const [selected, setSelected] = useState<Record<string, boolean>>({});
  const [msg, setMsg] = useState<string | null>(null);

  async function findChildren(e: React.FormEvent) {
    e.preventDefault();
    setMsg(null);
    setLoading(true);
    setChildren([]);
    setSelected({});
    try {
      const res = await fetch('/api/kiosk/children-by-phone', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone }),
      });
      const data = await res.json();
      if (!res.ok || !data?.ok) throw new Error(data?.error || 'No se pudo buscar.');
      const list: Child[] = data.children || [];
      setChildren(list);
      const pre: Record<string, boolean> = {};
      for (const c of list) pre[c.id] = true; // marcar todos por defecto
      setSelected(pre);
      if (list.length === 0) setMsg('No hay niños ligados a ese teléfono.');
    } catch (err: any) {
      setMsg(err.message || 'Error buscando niños.');
    } finally {
      setLoading(false);
    }
  }

  async function doCheckin() {
    setMsg(null);
    setLoading(true);
    try {
      const ids = Object.entries(selected)
        .filter(([, v]) => v)
        .map(([id]) => id);
      if (ids.length === 0) {
        setMsg('Selecciona al menos un niño.');
        setLoading(false);
        return;
      }
      const res = await fetch('/api/kiosk/checkin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ child_ids: ids }),
      });
      const data = await res.json();
      if (!res.ok || !data?.ok) throw new Error(data?.error || 'No se pudo hacer check-in.');
      setMsg('¡Check-in completado! Puedes imprimir etiquetas.');
    } catch (err: any) {
      setMsg(err.message || 'Error en check-in.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ maxWidth: 520, margin: '40px auto', fontFamily: 'system-ui, Arial' }}>
      <h1>Check-In</h1>

      <form onSubmit={findChildren} style={{ marginBottom: 16 }}>
        <label style={{ display: 'block', marginBottom: 6 }}>Teléfono del tutor</label>
        <input
          type="tel"
          inputMode="numeric"
          pattern="[0-9]*"
          placeholder="Ej. 7145551234"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          style={{ width: '100%', padding: 10, border: '1px solid #ccc', borderRadius: 6 }}
        />
        <button
          type="submit"
          disabled={loading || !phone}
          style={{ marginTop: 10, padding: '10px 16px', borderRadius: 6, border: '1px solid #000' }}
        >
          {loading ? 'Buscando…' : 'Buscar'}
        </button>
      </form>

      {children.length > 0 && (
        <div style={{ marginBottom: 16 }}>
          <h3>Niños encontrados</h3>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {children.map((c) => (
              <li key={c.id} style={{ padding: 10, border: '1px solid #eee', borderRadius: 6, marginBottom: 8 }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <input
                    type="checkbox"
                    checked={!!selected[c.id]}
                    onChange={(e) =>
                      setSelected((prev) => ({ ...prev, [c.id]: e.target.checked }))
                    }
                  />
                  <span style={{ fontWeight: 600 }}>{c.full_name}</span>
                </label>
                <div style={{ fontSize: 13, color: '#666' }}>
                  {c.classroom_name ? `Salón: ${c.classroom_name}` : 'Sin salón'}
                  {c.allergies ? ` · Alergias: ${c.allergies}` : ''}
                </div>
              </li>
            ))}
          </ul>

          <button
            onClick={doCheckin}
            disabled={loading}
            style={{ padding: '10px 16px', borderRadius: 6, border: '1px solid #000' }}
          >
            {loading ? 'Registrando…' : 'Hacer Check-In'}
          </button>
        </div>
      )}

      {msg && (
        <div style={{ marginTop: 12, padding: 10, border: '1px solid #ddd', borderRadius: 6 }}>
          {msg}
        </div>
      )}

      <div style={{ marginTop: 24 }}>
        <a href="/kiosk/signup">← Ir a Inscripción</a>
      </div>
    </div>
  );
}
