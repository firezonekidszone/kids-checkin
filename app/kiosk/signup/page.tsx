'use client';

import { useState } from 'react';

type Child = { full_name: string; dob: string; allergies?: string; notes?: string };

export default function Page() {
  const [guardianName, setGuardianName] = useState('');
  const [guardianEmail, setGuardianEmail] = useState('');
  const [guardianPhone, setGuardianPhone] = useState('');
  const [children, setChildren] = useState<Child[]>([{ full_name: '', dob: '' }]);
  const [msg, setMsg] = useState<string | null>(null);

  const addChild = () => setChildren((c) => [...c, { full_name: '', dob: '' }]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMsg(null);
    // aquí solo simula OK para compilar limpio
    setTimeout(() => setMsg('Inscripción guardada (demo).'), 300);
  };

  const inputStyle: React.CSSProperties = {
    display: 'block', width: '100%', padding: '10px', margin: '6px 0',
    border: '1px solid #ccc', borderRadius: 6,
  };
  const buttonStyle: React.CSSProperties = {
    padding: '10px 14px', border: '1px solid #000', borderRadius: 6, cursor: 'pointer',
  };

  return (
    <main style={{ maxWidth: 720, margin: '40px auto', fontFamily: 'system-ui, sans-serif' }}>
      <h2>Inscripción de Familia</h2>

      <form onSubmit={submit}>
        <h3>Tutor</h3>
        <input style={inputStyle} placeholder="Nombre del tutor"
               value={guardianName} onChange={(e)=>setGuardianName(e.target.value)} />
        <input style={inputStyle} placeholder="Correo"
               value={guardianEmail} onChange={(e)=>setGuardianEmail(e.target.value)} />
        <input style={inputStyle} placeholder="Teléfono"
               value={guardianPhone} onChange={(e)=>setGuardianPhone(e.target.value)} />

        <h3>Niños</h3>
        {children.map((c, i) => (
          <div key={i} style={{ border: '1px solid #eee', padding: 12, margin: '8px 0' }}>
            <input style={inputStyle} placeholder="Nombre completo"
                   value={c.full_name}
                   onChange={(e)=>setChildren(cs => (cs.map((x,idx)=> idx===i ? {...x, full_name:e.target.value} : x)))} />
            <input style={inputStyle} placeholder="Fecha de nacimiento (YYYY-MM-DD)"
                   value={c.dob}
                   onChange={(e)=>setChildren(cs => (cs.map((x,idx)=> idx===i ? {...x, dob:e.target.value} : x)))} />
            <input style={inputStyle} placeholder="Alergias (opcional)"
                   value={c.allergies || ''}
                   onChange={(e)=>setChildren(cs => (cs.map((x,idx)=> idx===i ? {...x, allergies:e.target.value} : x)))} />
            <input style={inputStyle} placeholder="Notas (opcional)"
                   value={c.notes || ''}
                   onChange={(e)=>setChildren(cs => (cs.map((x,idx)=> idx===i ? {...x, notes:e.target.value} : x)))} />
          </div>
        ))}

        <div style={{ marginTop: 12 }}>
          <button type="button" onClick={addChild} style={{ ...buttonStyle, marginRight: 8 }}>+ Agregar niño</button>
          <button type="submit" style={buttonStyle}>Guardar</button>
        </div>
      </form>

      {msg && <p style={{ marginTop: 16, color: 'green' }}>{msg}</p>}

      <div style={{ marginTop: 24 }}>
        <a href="/kiosk/checkin">Ir a Check-in →</a>
      </div>
    </main>
  );
}
