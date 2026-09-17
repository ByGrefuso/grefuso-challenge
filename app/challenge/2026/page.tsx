import Image from "next/image";
import Link from "next/link";

const finalClassification = [
  { name: "sallanman", rank: "EMERALD IV", lp: 2, twitch: "https://www.twitch.tv/sallanman_cat" },
  { name: "OreWaRulo", rank: "PLATINUM II", lp: 25, twitch: "https://www.twitch.tv/orewarulo" },
  { name: "Fardos31", rank: "PLATINUM III", lp: 11, twitch: "https://www.twitch.tv/fardos_31" },
  { name: "Dragonsniper", rank: "PLATINUM III", lp: 10, twitch: "https://www.twitch.tv/dragonsniper555" },
  { name: "ByGrefuso", rank: "GOLD I", lp: 7, twitch: "https://www.twitch.tv/bygrefuso" },
  { name: "Luewer", rank: "GOLD III", lp: 10, twitch: "https://www.twitch.tv/luewer18" },
  { name: "Cristian", rank: "GOLD IV", lp: 85, twitch: "https://www.twitch.tv/crisblade_" },
  { name: "Kawinho15", rank: "GOLD IV", lp: 39, twitch: "https://www.twitch.tv/kawinho15_" },
  { name: "ByDagma", rank: "GOLD IV", lp: 7, twitch: "https://www.twitch.tv/bydagma" },
  { name: "4l3", rank: "SILVER II", lp: 95, twitch: "https://www.twitch.tv/euwthe4l3" },
  { name: "Bounjimi", rank: "SILVER III", lp: 72 },
  { name: "Hiperbole", rank: "BRONZE II", lp: 65 },
  { name: "marccalvo", rank: "BRONZE II", lp: 5, twitch: "https://www.twitch.tv/marcsuarezdp" },
  { name: "Delacasa95", rank: "BRONZE III", lp: 86, twitch: "https://www.twitch.tv/delakelly" },
  { name: "Yuki26", rank: "BRONZE III", lp: 2, twitch: "https://www.twitch.tv/yuuki26_" },
  { name: "Muchars", rank: "HIERRO IV", lp: 0, twitch: "https://www.twitch.tv/muchars" },
];

const videos = [
  {
    title: "Grefuso Challenge 2026 — Semana 1",
    id: "G1ktOGDYrfg",
    featured: true,
  },
  {
    title: "Grefuso Challenge 2026 — Semana 2",
    id: "vkFMBIBRpzc",
  },
  {
    title: "Grefuso Challenge 2026 — Vídeo resumen final",
    id: "RMu3-K0btqQ",
  },
];

const clips = [
  {
    title: "OrewaRulo",
    file: "/clips/Kesha moment.mp4",
  },
  {
    title: "Sallanman",
    file: "/clips/largo de aqui ZERDA! HAHAH.mp4",
  },
  {
    title: "delakelly",
    file: "/clips/20260829_AthleticInquisitiveClipsdadArsonNoSexy-tUQibX1eCDITSMcO_source(1).mp4",
  },
  {
    title: "Bygrefuso",
    file: "/clips/2b14718a-c845-488a-9a21-72c61acb4351(1).mp4",
  },
];

function TwitchIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className="twitch-icon"
    >
      <path
        fill="currentColor"
        d="M4 2h18v13l-5 5h-4l-3 3v-3H4V2zm2 2v14h5v2.2l2.2-2.2H16l4-4V4H6zm3 3h2v6H9V7zm5 0h2v6h-2V7z"
      />
    </svg>
  );
}

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
          <div className="podium-card second"><b>02</b><span>🥈</span><h3>OREWARULO</h3><small>PLATINUM II · 25 LP</small></div>
          <div className="podium-card first"><b>01</b><span>🏆</span><h3>SALLANMAN</h3><small>EMERALD IV · 2 LP</small></div>
          <div className="podium-card third"><b>03</b><span>🥉</span><h3>FARDOS31</h3><small>PLATINUM III · 11 LP</small></div>
        </div>
        <div className="final-table">
          {finalClassification.map((player, index) => {
            const content = <><span className="position">{String(index + 1).padStart(2, "0")}</span><strong>{player.name}</strong><span className="rank-value">{player.rank} · {player.lp} LP</span>{player.twitch && <span className="stream-link" aria-label={`Twitch de ${player.name}`} title={`Twitch de ${player.name}`}><TwitchIcon /></span>}</>;
            return player.twitch ? <a className={`final-row ${index === 0 ? "champion-row" : ""}`} key={player.name} href={player.twitch} target="_blank" rel="noreferrer">{content}</a> : <div className={`final-row ${index === 0 ? "champion-row" : ""}`} key={player.name}>{content}</div>;
          })}
        </div>
        <p className="archive-note">Clasificación final oficial de Grefuso Challenge 2026. Estos resultados quedan guardados como archivo histórico y no dependen de la Riot API.</p>
      </section>

      <section id="videos" className="section dark-section">
        <div className="section-head"><span>02</span><div><div className="eyebrow">YOUTUBE</div><h2>RESUMEN DEL EVENTO</h2></div></div>
        <div className="video-grid">
          {videos.map((video) => (
            <article className={`video-card ${video.featured ? "featured-video" : ""}`} key={video.title}>
              <iframe src={`https://www.youtube.com/embed/${video.id}`} title={video.title} allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen />
              <h3>{video.title}</h3>
            </article>
          ))}
        </div>
      </section>

      <section id="clips" className="section">
        <div className="section-head"><span>03</span><div><div className="eyebrow">COMUNIDAD</div><h2>MEJORES CLIPS</h2></div></div>
        <div className="clip-grid">
          {clips.map((clip, i) => (
            <article className="clip-card" key={clip.file}>
              <div className="clip-number">0{i + 1}</div>
              <video controls preload="metadata" playsInline src={clip.file} />
              <div>
                <h3>{clip.title}</h3>
                <p>Grefuso Challenge 2026</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <footer className="footer"><Link href="/">← GREFUSO EVENTS</Link><span>GREFUSO CHALLENGE 2026</span></footer>
    </main>
  );
}
