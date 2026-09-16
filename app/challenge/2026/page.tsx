import Image from "next/image";
import Link from "next/link";

const participants = [
  "Sallanman", "Fardos31", "Dragonsniper", "ByDagma", "Marccalvo", "Yuki26", "Delacasa95", "Bounjimi",
  "OreWaRuo", "Crstian", "ByGrefuso", "Kawinho15", "4l3", "Muchars", "Hiperbole", "Luewer"
];

// Añade aquí los IDs de YouTube conforme quieras incorporar más vídeos al archivo histórico.
const videos: { title: string; id?: string; featured?: boolean }[] = [
  { title: "Grefuso Challenge 2026 — Vídeo resumen", id: undefined, featured: true },
  { title: "Grefuso Challenge 2026 — Resumen / momentos", id: undefined },
  { title: "Grefuso Challenge 2026 — El camino al título", id: undefined },
];

const clips = [
  { title: "Mejor clip — votación de la comunidad", note: "Votación abierta en Instagram" },
  { title: "Clips destacados del Challenge", note: "Próximamente" },
  { title: "Más momentos", note: "Próximamente" },
];

export default function Challenge2026() {
  return (
    <main className="site-shell archive-page">
      <header className="topbar">
        <Link href="/" className="brand"><Image src="/logo.png" alt="Grefuso" width={130} height={130} priority /></Link>
        <nav><Link href="/">Inicio</Link><a href="#classification">Clasificación</a><a href="#videos">Vídeos</a><a href="#clips">Clips</a></nav>
      </header>

      <section className="archive-hero">
        <div className="eyebrow">ARCHIVO OFICIAL · 28 AGOSTO — 15 SEPTIEMBRE 2026</div>
        <h1>GREFUSO<br /><span>CHALLENGE</span> 2026</h1>
        <p>16 jugadores. Una clasificación. Un campeón.</p>
        <div className="champion-banner"><span>🏆 CAMPEÓN</span><strong>SALLANMAN</strong><small>1ª EDICIÓN · GREFUSO CHALLENGE</small></div>
      </section>

      <section id="classification" className="section">
        <div className="section-head"><span>01</span><div><div className="eyebrow">RESULTADO FINAL</div><h2>CLASIFICACIÓN</h2></div></div>
        <div className="podium">
          <div className="podium-card second"><b>02</b><span>🥈</span><h3>—</h3><small>CLASIFICACIÓN FINAL</small></div>
          <div className="podium-card first"><b>01</b><span>🏆</span><h3>SALLANMAN</h3><small>CAMPEÓN</small></div>
          <div className="podium-card third"><b>03</b><span>🥉</span><h3>FARDOS31</h3><small>TOP 3</small></div>
        </div>
        <div className="final-table">
          {participants.map((name, index) => (
            <div className={`final-row ${index === 0 ? "champion-row" : ""}`} key={name}>
              <span className="position">{String(index + 1).padStart(2, "0")}</span>
              <strong>{name}</strong>
              <span className="rank-value">{index === 0 ? "CAMPEÓN" : index === 1 ? "—" : index === 2 ? "PLATINO III · 10 LP" : "FINAL"}</span>
            </div>
          ))}
        </div>
        <p className="archive-note">La clasificación se conserva como resultado histórico de la edición 2026.</p>
      </section>

      <section id="videos" className="section dark-section">
        <div className="section-head"><span>02</span><div><div className="eyebrow">YOUTUBE</div><h2>RESUMEN DEL EVENTO</h2></div></div>
        <div className="video-grid">
          {videos.map((video, i) => (
            <article className={`video-card ${video.featured ? "featured-video" : ""}`} key={video.title}>
              {video.id ? <iframe src={`https://www.youtube.com/embed/${video.id}`} title={video.title} allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen /> : <div className="video-placeholder"><span>▶</span><small>{i === 0 ? "AÑADIR ÚLTIMO VÍDEO" : "VÍDEO"}</small></div>}
              <h3>{video.title}</h3>
            </article>
          ))}
        </div>
      </section>

      <section id="clips" className="section">
        <div className="section-head"><span>03</span><div><div className="eyebrow">COMUNIDAD</div><h2>MEJORES CLIPS</h2></div></div>
        <div className="clip-grid">
          {clips.map((clip, i) => <article className="clip-card" key={clip.title}><div className="clip-number">0{i + 1}</div><div><h3>{clip.title}</h3><p>{clip.note}</p></div><span>→</span></article>)}
        </div>
        <div className="instagram-cta"><strong>VOTA EL MEJOR CLIP</strong><span>Las votaciones se realizan mediante Stories en @bygrefuso.</span><a href="https://www.instagram.com/bygrefuso/" target="_blank" rel="noreferrer">IR A INSTAGRAM ↗</a></div>
      </section>

      <footer className="footer"><Link href="/">← GREFUSO EVENTS</Link><span>GREFUSO CHALLENGE 2026</span></footer>
    </main>
  );
}
