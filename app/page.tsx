export default function Home() {
  return (
    <main style={{ maxWidth: 720, margin: '40px auto', fontFamily: 'system-ui, sans-serif' }}>
      <h1>Kids Check-In</h1>
      <ul>
        <li><a href="/kiosk/signup">Inscripción de familia</a></li>
        <li><a href="/kiosk/checkin">Check-in</a></li>
      </ul>
    </main>
  );
}
