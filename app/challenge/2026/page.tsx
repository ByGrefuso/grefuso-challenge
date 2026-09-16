import Image from "next/image";
import Link from "next/link";

const finalClassification = [
  { name: "sallanman", rank: "EMERALD IV", lp: 2 },
  { name: "Dragonsniper", rank: "PLATINUM III", lp: 10 },
  { name: "OreWaRuo", rank: "PLATINUM II", lp: 25 },
  { name: "Fardos31", rank: "PLATINUM III", lp: 11 },
  { name: "ByGrefuso", rank: "GOLD I", lp: 7 },
  { name: "Luewer", rank: "GOLD III", lp: 10 },
  { name: "Cristian", rank: "GOLD IV", lp: 85 },
  { name: "Kawinho15", rank: "GOLD IV", lp: 39 },
  { name: "Kiwix", rank: "GOLD IV", lp: 7 },
  { name: "4l3", rank: "SILVER II", lp: 95 },
  { name: "Bounjimi", rank: "SILVER III", lp: 72 },
  { name: "Hiperbole", rank: "BRONZE II", lp: 65 },
  { name: "marccalvo", rank: "BRONZE II", lp: 5 },
  { name: "Delacasa95", rank: "BRONZE III", lp: 86 },
  { name: "Yuki26", rank: "BRONZE III", lp: 2 },
  { name: "Muchars", rank: "HIERRO IV", lp: 0 },
];

const videos: { title: string; id?: string; featured?: boolean }[] = [
  { title: "Grefuso Challenge 2026 — Vídeo resumen", id: undefined, featured: true },
  { title: "Grefuso Challenge 2026 — Momentos", id: undefined },
  { title: "Grefuso Challenge 2026 — El camino al título", id: undefined },
];

const clips = [
  { title: "Mejor clip — votación de la comunidad", note: "Votación abierta en Instagram" },
  { title: "Clips destacados del Challenge", note: "Próximamente" },
  { title: "Más momentos del Challenge", note: "Próximamente" },
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
        <div className="section-head"><span>01</span><div><div className="eyebrow">RESULTADO FINAL</div><h2>CLASIFICACIÓN FINAL</h2></div></div>
        <div className="podium">
          <div className="podium-card second"><b>02</b><span>🥈</span><h3>DRAGONSNIPER</h3><small>PLATINUM III · 10 LP</small></div>
          <div className="podium-card first"><b>01</b><span>🏆</span><h3>SALLANMAN</h3><small>EMERALD IV · 2 LP</small></div>
          <div className="podium-card third"><b>03</b><span>🥉</span><h3>OREWARUO</h3><small>PLATINUM II · 25 LP</small></div>
        </div>
        <div className="final-table">
          {finalClassification.map((player, index) => (
            <div className={`final-row ${index === 0 ? "champion-row" : ""}`} key={player.name}>
              <span className="position">{String(index + 1).padStart(2, "0")}</span>
              <strong>{player.name}</strong>
              <span className="rank-value">{player.rank} · {player.lp} LP</span>
            </div>
          ))}
        </div>
        <p className="archive-note">Clasificación final oficial de Grefuso Challenge 2026. Estos resultados quedan guardados como archivo histórico y no dependen de la Riot API.</p>
      </section>

      <section id="videos" className="section dark-section">
        <div className="section-head"><span>02</span><div><div className="eyebrow">YOUTUBE</div><h2>RESUMEN DEL EVENTO</h2></div></div>
        <div className="video-grid">
          {videos.map((video, i) => (
            <article className={`video-card ${video.featured ? "featured-video" : ""}`} key={video.title}>
              {video.id ? <iframe src={`https://www.youtube.com/embed/${video.id}`} title={video.title} allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen /> : <div className="video-placeholder"><span>▶</span><small>{i === 0 ? "AÑADIR ÚLTIMO VÍDEO" : "PRÓXIMAMENTE"}</small></div>}
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
