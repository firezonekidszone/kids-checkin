export default function Home() {
  return (
    <main style={{ padding: 24, maxWidth: 720 }}>
      <h1>Kids Check-In</h1>
      <ul style={{ lineHeight: 2 }}>
        <li>
          <a href="/kiosk/signup">📝 Inscripción de familia</a>
        </li>
        <li>
          <a href="/kiosk/checkin">✅ Check-In</a>
        </li>
      </ul>
    </main>
  );
}
