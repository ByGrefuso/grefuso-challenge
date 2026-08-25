const streamers = [
  { name: "Crisblade04", platform: "Twitch", live: true },
  { name: "Nerea3005_", platform: "Twitch", live: true },
  { name: "Sallanman_cat", platform: "Twitch", live: false },
  { name: "OreWaRuo", platform: "Twitch", live: true },
  { name: "Fardos_31", platform: "Twitch", live: true },
  { name: "ByDagma", platform: "Kick", live: true },
  { name: "Delakelly", platform: "Twitch", live: false },
];

const ranking = [
  {
    position: 1,
    name: "ByGrefuso",
    rank: "—",
    lp: "—",
    wins: "—",
    losses: "—",
    winrate: "—",
  },
  {
    position: 2,
    name: "Kiwix",
    rank: "—",
    lp: "—",
    wins: "—",
    losses: "—",
    winrate: "—",
  },
  {
    position: 3,
    name: "marccalvo",
    rank: "—",
    lp: "—",
    wins: "—",
    losses: "—",
    winrate: "—",
  },
  {
    position: 4,
    name: "Fardos31",
    rank: "—",
    lp: "—",
    wins: "—",
    losses: "—",
    winrate: "—",
  },
  {
    position: 5,
    name: "Yuki26",
    rank: "—",
    lp: "—",
    wins: "—",
    losses: "—",
    winrate: "—",
  },
  {
    position: 6,
    name: "Delacasa95",
    rank: "—",
    lp: "—",
    wins: "—",
    losses: "—",
    winrate: "—",
  },
];

function Countdown() {
  return (
    <div className="countdown">
      <div className="countdown-title">EL CHALLENGE COMIENZA EN</div>

      <div className="countdown-numbers">
        <div>
          <strong>--</strong>
          <span>DÍAS</span>
        </div>

        <div>
          <strong>--</strong>
          <span>HORAS</span>
        </div>

        <div>
          <strong>--</strong>
          <span>MINUTOS</span>
        </div>

        <div>
          <strong>--</strong>
          <span>SEGUNDOS</span>
        </div>
      </div>

      <div className="start-date">
        ◷ VIERNES 28 DE AGOSTO A LAS 20:00
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <main>
      <header className="navbar">
        <div className="nav-logo">
          <img src="/logo.png" alt="Grefuso Challenge" />
        </div>

        <nav>
          <a className="active" href="#inicio">
            INICIO
          </a>
          <a href="#torneo">EL TORNEO</a>
          <a href="#participantes">PARTICIPANTES</a>
          <a href="#clasificacion">CLASIFICACIÓN</a>
          <a href="#faq">FAQ</a>
        </nav>

        <div className="socials">
          <a href="https://www.twitch.tv/bygrefuso" target="_blank">
            TW
          </a>
          <a href="#">IG</a>

          <a
            className="twitch-button"
            href="https://www.twitch.tv/by_grefuso"
            target="_blank"
          >
            ▣ SEGUIR EN TWITCH
          </a>
        </div>
      </header>

      <section id="inicio" className="hero">
        <div className="hero-left">
          <img
            className="hero-logo"
            src="/logo.png"
            alt="Grefuso Challenge"
          />

          <p className="subtitle">
            SOLOQ CHALLENGE DE LEAGUE OF LEGENDS
          </p>

          <div className="date-box">
            DEL 28 DE AGOSTO AL 15 DE SEPTIEMBRE
          </div>

          <Countdown />
        </div>

        <div className="live-feature">
          <div className="live-badge">
            <span />
            EN DIRECTO
          </div>

          <div className="live-content">
            <h1>ByGrefuso</h1>

            <p className="live-description">
              ◉ SoloQ Challenge — Rumbo a Diamante
            </p>

            <p className="game-name">League of Legends</p>

            <a
              className="watch-button"
              href="https://www.twitch.tv/by_grefuso"
              target="_blank"
            >
              ▣ VER DIRECTO EN TWITCH
            </a>

            <p className="viewers">● En directo</p>
          </div>
        </div>
      </section>

      <section className="streams-section">
        <div className="section-header">
          <div>
            <h2>
              <span className="pink-dot" />
              DIRECTOS AHORA
            </h2>
            <p>Mira quién está en directo en el Challenge</p>
          </div>

          <button>VER TODOS LOS CANALES →</button>
        </div>

        <div className="streams-grid">
          <div className="stream-card featured">
            <div className="stream-preview">
              <span className="live-label">● EN DIRECTO</span>
              <div className="fake-game-screen">
                GREFUSO
                <br />
                CHALLENGE
              </div>
            </div>

            <div className="stream-info">
              <div className="avatar">G</div>
              <div>
                <h3>ByGrefuso</h3>
                <p>En directo</p>
              </div>
              <span className="platform twitch">TW</span>
            </div>
          </div>

          {streamers.map((streamer) => (
            <div
              className={`stream-card ${
                streamer.live ? "is-live" : "is-offline"
              }`}
              key={streamer.name}
            >
              <div className="stream-preview">
                <span className={streamer.live ? "live-label" : "offline-label"}>
                  {streamer.live ? "● EN DIRECTO" : "OFFLINE"}
                </span>

                <div className="fake-game-screen">
                  {streamer.live ? "LEAGUE OF LEGENDS" : "GREFUSO"}
                </div>
              </div>

              <div className="stream-info">
                <div className="avatar">
                  {streamer.name.charAt(0)}
                </div>

                <div>
                  <h3>{streamer.name}</h3>
                  <p>{streamer.live ? "En directo" : "Offline"}</p>
                </div>

                <span
                  className={
                    streamer.platform === "Kick"
                      ? "platform kick"
                      : "platform twitch"
                  }
                >
                  {streamer.platform === "Kick" ? "K" : "TW"}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section id="clasificacion" className="ranking-section">
        <div className="section-header">
          <div>
            <h2>
              <span className="pink-dot" />
              CLASIFICACIÓN EN DIRECTO
            </h2>
            <p>Actualizada automáticamente durante el Challenge</p>
          </div>

          <span className="last-update">
            ÚLTIMA ACTUALIZACIÓN: —
          </span>
        </div>

        <div className="ranking-table">
          <div className="ranking-header">
            <span>#</span>
            <span>JUGADOR</span>
            <span>RANGO ACTUAL</span>
            <span>PL</span>
            <span>VICTORIAS</span>
            <span>DERROTAS</span>
            <span>WINRATE</span>
          </div>

          {ranking.map((player) => (
            <div className="ranking-row" key={player.name}>
              <span className="position">{player.position}</span>

              <span className="player-name">
                <span className="small-avatar">
                  {player.name.charAt(0)}
                </span>

                {player.name}

                {player.name === "ByGrefuso" && (
                  <span className="you-badge">TÚ</span>
                )}
              </span>

              <span>{player.rank}</span>
              <span>{player.lp}</span>
              <span className="wins">{player.wins}</span>
              <span className="losses">{player.losses}</span>
              <span>{player.winrate}</span>
            </div>
          ))}
        </div>

        <button className="full-ranking">
          VER CLASIFICACIÓN COMPLETA →
        </button>
      </section>

      <footer>
        <img src="/logo.png" alt="Grefuso Challenge" />
        <p>© 2026 Grefuso Challenge · ByGrefuso</p>
      </footer>
    </main>
  );
}
