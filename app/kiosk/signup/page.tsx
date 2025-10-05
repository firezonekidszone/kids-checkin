'use client';

import Link from 'next/link';

export default function SignupPage() {
  return (
    <main style={{ maxWidth: 720, margin: '32px auto', padding: 16 }}>
      <h1>Inscripción de familia</h1>
      <p>Pronto agregaremos el formulario aquí.</p>
      <p><Link href="/kiosk/checkin">Ir a Check-In →</Link></p>
    </main>
  );
}
