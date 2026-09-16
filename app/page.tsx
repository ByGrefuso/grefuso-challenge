import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <main className="site-shell home-page">
      <header className="topbar">
        <Link href="/" className="brand"><Image src="/logo.png" alt="Grefuso" width={130} height={130} priority /></Link>
        <nav><Link href="/">Inicio</Link><Link href="/challenge/2026">Grefuso Challenge 2026</Link><a href="#events">Eventos</a></nav>
      </header>
      <section className="home-hero">
        <div className="eyebrow">BYGREFUSO · ESPORTS & COMMUNITY</div>
        <h1>GREFUSO<br /><span>CHALLENGE</span></h1>
        <p>Competiciones, retos y eventos creados para la comunidad.</p>
      </section>
      <section id="events" className="section events-section">
        <div className="section-head"><span>01</span><div><div className="eyebrow">EVENTOS</div><h2>EVENTOS</h2></div></div>
        <div className="event-grid">
          <Link href="/challenge/2026" className="event-card challenge-card">
            <span className="event-status">FINALIZADO</span><div className="event-year">2026</div><h3>GREFUSO<br />CHALLENGE</h3><p>16 jugadores · 1 campeón</p><b>VER EDICIÓN →</b>
          </Link>
          <div className="event-card cup-card"><span className="event-status">PRÓXIMAMENTE</span><div className="event-year">2026</div><h3>GREFUSO<br />CUP</h3><p>La próxima gran competición Grefuso.</p><b>MUY PRONTO</b></div>
        </div>
      </section>
      <section className="coming-section"><div className="coming-label">PRÓXIMO EVENTO</div><h2>GREFUSO CUP 2026</h2><p>Estamos preparando algo grande.</p><span>PRÓXIMAMENTE</span></section>
      <footer className="footer"><a href="https://www.instagram.com/bygrefuso" target="_blank" rel="noreferrer">BYGREFUSO</a><span>© 2026</span></footer>
    </main>
  );
}
