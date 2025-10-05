'use client';

import { useState } from 'react';

type Child = {
  full_name: string;
  dob: string;        // YYYY-MM-DD
  allergies?: string;
  notes?: string;
};

export default function SignupPage() {
  const [guardianName, setGuardianName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [children, setChildren] = useState<Child[]>([
    { full_name: '', dob: '' },
  ]);
  const [msg, setMsg] = useState<string | null>(null);

  const addChild = () => setChildren((c) => [...c, { full_name: '', dob: '' }]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMsg('Enviando…');

    try {
      // 👉 De momento solo mostramos los datos para confirmar que la página funciona en producción.
      // Más tarde volvemos a conectar con la API/Supabase.
      console.log({
        guardian: { guardianName, email, phone },
        children,
      });
      setMsg('¡Listo! (Demo) Formulario enviado en cliente.');
    } catch (err: any) {
      setMsg(`Error: ${err?.message ?? 'desconocido'}`);
    }
  };

  return (
    <main style={{ padding: 24, maxWidth: 800 }}>
      <h2>Inscripción de Familia</h2>

      <form onSubmit={onSubmit} style={{ marginTop: 16 }}>
        <h3>Tutor</h3>

        <input
          placeholder="Nombre del tutor"
          value={guardianName}
          onChange={(e) => setGuardianName(e.target.value)}
          required
          style={inputStyle}
        />

        <input
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          type="email"
          required
          style={inputStyle}
        />

        <input
          placeholder="Teléfono (solo números)"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          pattern="^[0-9+\-\s()]*$"
          required
          style={inputStyle}
        />

        <h3 style={{ marginTop: 24 }}>Niños</h3>

        {children.map((c, i) => (
          <div key={i} style={{ border: '1px solid #ddd', padding: 12, borderRadius: 8, marginBottom: 12 }}>
            <input
              placeholder="Nombre completo"
              value={c.full_name}
              onChange={(e) => {
                const n = [...children];
                n[i].full_name = e.target.value;
                setChildren(n);
              }}
              required
              style={inputStyle}
            />

            <input
              placeholder="Fecha de nacimiento (YYYY-MM-DD)"
              value={c.dob}
              onChange={(e) => {
                const n = [...children];
                n[i].dob = e.target.value;
                setChildren(n);
              }}
              pattern="^\d{4}-\d{2}-\d{2}$"
              required
              style={inputStyle}
            />

            <input
              placeholder="Alergias (opcional)"
              value={c.allergies ?? ''}
              onChange={(e) => {
                const n = [...children];
                n[i].allergies = e.target.value;
                setChildren(n);
              }}
              style={inputStyle}
            />

            <input
              placeholder="Notas (opcional)"
              value={c.notes ?? ''}
              onChange={(e) => {
                const n = [...children];
                n[i].notes = e.target.value;
                setChildren(n);
              }}
              style={inputStyle}
            />
          </div>
        ))}

        <button type="button" onClick={addChild} style={buttonStyle}>
          + Agregar niño
        </button>

        <button type="submit" style={buttonStyle}>
          Guardar (demo)
        </button>
      </form>

      {msg && <p style={{ marginTop: 16 }}>{msg}</p>}

      <div style={{ marginTop: 24 }}>
        <a href="/kiosk/checkin">Ir a Check-In →</a>
      </div>
    </main>
  );
}

const inputStyle: React.CSSProperties = {
  display: 'block',
  width: '100%',
  padding: '10px',
  margin: '6px 0',
  border: '1px solid #ccc',
  borderRadius: 6,
};

const buttonStyle: React.CSSProperties = {
  padding: '10px 14px',
  border: '1px solid #000',
  borderRadius: 6,
  marginRight: 8,
  cursor: 'pointer',
};
