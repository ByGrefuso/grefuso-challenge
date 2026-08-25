const streamers = [
  {
    name: "ByGrefuso",
    platform: "Twitch",
    url: "https://www.twitch.tv/bygrefuso",
    tag: "STREAM",
    featured: true,
  },
  {
    name: "Crisblade04",
    platform: "Twitch",
    url: "https://www.twitch.tv/crisblade04",
    tag: "STREAM",
  },
  {
    name: "Nerea3005_",
    platform: "Twitch",
    url: "https://www.twitch.tv/nerea3005_",
    tag: "STREAM",
  },
  {
    name: "Sallanman_cat",
    platform: "Twitch",
    url: "https://www.twitch.tv/sallanman_cat",
    tag: "PRO",
    stream: true,
  },
  {
    name: "OreWaRuo",
    platform: "Twitch",
    url: "https://www.twitch.tv/orewarulo",
    tag: "STREAM",
  },
  {
    name: "Fardos_31",
    platform: "Twitch",
    url: "https://www.twitch.tv/fardos_31",
    tag: "STREAM",
  },
  {
    name: "ByDagma",
    platform: "Kick",
    url: "https://kick.com/bydagma",
    tag: "STREAM",
  },
  {
    name: "Delakelly",
    platform: "Twitch",
    url: "https://www.twitch.tv/delakelly",
    tag: "STREAM",
  },
];

const ranking = [
  "ByGrefuso",
  "Kiwix",
  "marccalvo",
  "Fardos31",
  "Yuki26",
  "Delacasa95",
  "Bounjimi",
  "OreWaRuo",
  "cris",
  "Sallanman",
  "Kawinho15",
  "Al3",
];

export default function Home() {
  return (
    <main>

      {/* NAVBAR */}

      <header className="navbar">

        <a href="#inicio" className="nav-logo">
          <img
            src="/logo.png"
            alt="Grefuso Challenge"
          />
        </a>

        <nav>
          <a className="active" href="#inicio">
            INICIO
          </a>

          <a href="#directos">
            DIRECTOS
          </a>

          <a href="#participantes">
            PARTICIPANTES
          </a>

          <a href="#clasificacion">
            CLASIFICACIÓN
          </a>

          <a href="#torneo">
            EL TORNEO
          </a>
        </nav>

        <div className="nav-actions">

          <a
            className="social-button"
            href="https://www.twitch.tv/bygrefuso"
            target="_blank"
            rel="noreferrer"
          >
            TW
          </a>

          <a
            className="main-button"
            href="https://www.twitch.tv/bygrefuso"
            target="_blank"
            rel="noreferrer"
          >
            VER EN TWITCH
          </a>

        </div>

      </header>


      {/* HERO */}

      <section id="inicio" className="hero">

        <div className="hero-background" />

        <div className="hero-overlay" />

        <div className="hero-content">

          <div className="hero-info">

            <div className="event-label">
              SOLOQ CHALLENGE
            </div>

            <img
              className="hero-logo"
              src="/logo.png"
              alt="Grefuso Challenge"
            />

            <p className="hero-description">
              El desafío competitivo de League of Legends.
              <br />
              Compite, escala y demuestra quién es el mejor.
            </p>

            <div className="event-date">
              28 AGOSTO — 15 SEPTIEMBRE 2026
            </div>

            <div className="countdown">

              <div className="count-box">
                <strong>--</strong>
                <span>DÍAS</span>
              </div>

              <div className="count-box">
                <strong>--</strong>
                <span>HORAS</span>
              </div>

              <div className="count-box">
                <strong>--</strong>
                <span>MIN</span>
              </div>

              <div className="count-box">
                <strong>--</strong>
                <span>SEG</span>
              </div>

            </div>

            <p className="start-text">
              EL CHALLENGE COMIENZA EL VIERNES 28 A LAS 20:00
            </p>

          </div>


          {/* STREAM PRINCIPAL */}

          <div className="featured-stream">

            <div className="featured-top">

              <span className="live-indicator">
                <span />
                EN DIRECTO
              </span>

              <span className="platform-label">
                TWITCH
              </span>

            </div>

            <div className="featured-preview">

              <div className="preview-glow">

                <span>
                  GREFUSO
                </span>

                <strong>
                  CHALLENGE
                </strong>

              </div>

            </div>

            <div className="featured-info">

              <div className="streamer-avatar">
                G
              </div>

              <div className="streamer-details">

                <h2>
                  ByGrefuso
                </h2>

                <p>
                  League of Legends
                </p>

              </div>

              <span className="tag stream-tag">
                STREAM
              </span>

              <a
                href="https://www.twitch.tv/bygrefuso"
                target="_blank"
                rel="noreferrer"
                className="watch-live"
              >
                VER DIRECTO
              </a>

            </div>

          </div>

        </div>

      </section>


      {/* DIRECTOS */}

      <section
        id="directos"
        className="section streams-section"
      >

        <div className="section-title">

          <div>
            <span className="eyebrow">
              GREFUSO CHALLENGE
            </span>

            <h2>
              DIRECTOS
              <span> AHORA</span>
            </h2>

            <p>
              Todos los participantes que están haciendo streaming.
            </p>
          </div>

          <span className="live-count">
            ● DIRECTOS EN VIVO
          </span>

        </div>


        <div className="streams-grid">

          {streamers.map((streamer) => (

            <a
              href={streamer.url}
              target="_blank"
              rel="noreferrer"
              key={streamer.name}
              className={`stream-card ${
                streamer.featured ? "featured-card" : ""
              }`}
            >

              <div className="card-preview">

                <div className="preview-background">

                  <span>
                    LEAGUE
                  </span>

                  <strong>
                    OF LEGENDS
                  </strong>

                </div>

                <span className="offline-status">
                  OFFLINE
                </span>

              </div>


              <div className="card-info">

                <div className="card-avatar">
                  {streamer.name.charAt(0)}
                </div>

                <div className="card-name">

                  <h3>
                    {streamer.name}
                  </h3>

                  <p>
                    {streamer.platform}
                  </p>

                </div>

                <span
                  className={`tag ${
                    streamer.tag === "PRO"
                      ? "pro-tag"
                      : "stream-tag"
                  }`}
                >
                  {streamer.tag}
                </span>

              </div>

            </a>

          ))}

        </div>

      </section>


      {/* PARTICIPANTES */}

      <section
        id="participantes"
        className="participants-section"
      >

        <div className="participants-content">

          <span className="eyebrow">
            LOS COMPETIDORES
          </span>

          <h2>
            12 JUGADORES.
            <br />
            <span>UN SOLO GANADOR.</span>
          </h2>

          <p>
            Jugadores compitiendo durante todo el Challenge
            para escalar lo máximo posible en League of Legends.
          </p>

          <a
            href="#clasificacion"
            className="outline-button"
          >
            VER CLASIFICACIÓN
          </a>

        </div>

      </section>


      {/* CLASIFICACIÓN */}

      <section
        id="clasificacion"
        className="section ranking-section"
      >

        <div className="section-title">

          <div>

            <span className="eyebrow">
              RANKING
            </span>

            <h2>
              CLASIFICACIÓN
              <span> EN DIRECTO</span>
            </h2>

            <p>
              Las posiciones se actualizarán automáticamente.
            </p>

          </div>

          <span className="update-status">
            ● ACTUALIZACIÓN AUTOMÁTICA
          </span>

        </div>


        <div className="ranking-table">

          <div className="ranking-header">

            <span>
              #
            </span>

            <span>
              JUGADOR
            </span>

            <span>
              RANGO
            </span>

            <span>
              PL
            </span>

            <span>
              V
            </span>

            <span>
              D
            </span>

            <span>
              WR
            </span>

          </div>


          {ranking.map((player, index) => (

            <div
              className={`ranking-row ${
                player === "Sallanman"
                  ? "pro-player"
                  : ""
              }`}
              key={player}
            >

              <span className="rank-position">
                {index + 1}
              </span>

              <span className="rank-player">

                <span className="rank-avatar">
                  {player.charAt(0)}
                </span>

                <strong>
                  {player}
                </strong>

                {player === "Sallanman" && (
                  <span className="tag pro-tag">
                    PRO
                  </span>
                )}

              </span>

              <span className="rank-value">
                —
              </span>

              <span className="rank-value">
                —
              </span>

              <span className="win-value">
                —
              </span>

              <span className="loss-value">
                —
              </span>

              <span className="rank-value">
                —
              </span>

            </div>

          ))}

        </div>

      </section>


      {/* TORNEO */}

      <section
        id="torneo"
        className="tournament-section"
      >

        <div>

          <span className="eyebrow">
            GREFUSO CHALLENGE 2026
          </span>

          <h2>
            PLAY.
            <span>
              GRIND.
            </span>
            WIN.
          </h2>

          <p>
            Una competición creada para disfrutar,
            competir y llevar League of Legends al límite.
          </p>

        </div>

      </section>


      {/* FOOTER */}

      <footer>

        <img
          src="/logo.png"
          alt="Grefuso Challenge"
        />

        <span>
          GREFUSO CHALLENGE © 2026
        </span>

        <span>
          BYGREFUSO
        </span>

      </footer>

    </main>
  );
}
