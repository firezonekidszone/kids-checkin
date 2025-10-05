export default function Page() {
  const linkStyle: React.CSSProperties = { display: 'block', marginTop: 10 };

  return (
    <main style={{ padding: 20 }}>
      <h1>Kids Check-In</h1>

      <a href="/kiosk/signup" style={linkStyle}>📝 Inscripción de familia</a>
      <a href="/kiosk/checkin" style={linkStyle}>✅ Check-In</a>
    </main>
  );
}
