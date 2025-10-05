'use client';

import Link from 'next/link';

export default function CheckinPage() {
  return (
    <main style={{ maxWidth: 720, margin: '32px auto', padding: 16 }}>
      <h1>Check-In</h1>
      <p>Esta pantalla se llenará con el flujo de check-in.</p>
      <p><Link href="/kiosk/signup">Ir a Inscripción →</Link></p>
    </main>
  );
}
