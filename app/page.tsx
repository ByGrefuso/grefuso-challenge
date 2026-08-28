"use client";

import { useEffect, useMemo, useState } from "react";

type Streamer = {
  channel: string;
  displayName: string;
  platform: "twitch" | "kick";
  avatar: string;
  live: boolean;
  title: string;
  game: string;
  viewers: number;
  thumbnail: string;
  startedAt: string | null;
  url: string;
};

type RiotPlayer = {
  name: string;
  riotId?: string;
  rank: string;
  tier: string;
  lp: number;
  wins: number;
  losses: number;
  icon?: string;
};

const PARTICIPANTS = [
  { name: "Kiwix", riotId: "Nissaxter ENJ#RAGE", platform: "kick", channel: "bydagma" },
  { name: "Marccalvo", riotId: "Tyrhys Dolan#RCD", platform: "twitch", channel: "marcsuarezdp" },
  { name: "Fardos31", riotId: "Myrwn#0031", platform: "twitch", channel: "fardos_31" },
  { name: "Yuki26", riotId: "DYsavage#EUW", platform: "twitch", channel: "yuuki26_" },
  { name: "Delacasa95", riotId: "grakulaq#EUW", platform: "twitch", channel: "delakelly" },
  { name: "Bounjimi", riotId: "xokas the boss #005", platform: null, channel: null },
  { name: "OreWaRuo", riotId: "Sukehir0 Yami#Zoro", platform: "twitch", channel: "orewarulo" },
  { name: "Crstian", riotId: "Calm Smurf#EUW", platform: "twitch", channel: "crisblade_" },
  { name: "Sallanman", riotId: "Lo Narisut#1492", platform: "twitch", channel: "sallanman_cat" },
  { name: "ByGrefuso", riotId: "Ooh Ferran#PEPO", platform: "twitch", channel: "bygrefuso" },
  { name: "Kawinho15", riotId: "GodzOclock#EUW", platform: "twitch", channel: "kawinho15_" },
  { name: "4l3", riotId: "laaw Traafalgar#EUW", platform: "twitch", channel: "euwthe4l3" },
  { name: "Muchars", riotId: "icecoffeeweb#432", platform: null, channel: "muchars" },
  { name: "Hiperbole", riotId: "fettuccina45#EUW", platform: null, channel: null },
  { name: "Dragonsniper", riotId: "mostafahagag#EUW", platform: "twitch", channel: "DragonSniper555" },
  { name: "Luewer", riotId: "Ivaamaa  doppleg#GOAT", platform: "twitch", channel: "luewer18" },
] as const;

const streamerLabels: Record<string, string[]> = {
  bygrefuso: ["STRM"],
  sallanman_cat: ["PRO", "STRM"],
  crisblade04: ["STRM"],
  yuuki26_: ["STRM"],
  orewarulo: ["STRM"],
  fardos_31: ["STRM"],
  delakelly: ["STRM"],
  euwthe4l3: ["STRM"],
  kawinho15_: ["STRM"],
  marcsuarezdp: ["STRM"],
  DragonSniper555: ["STRM"],
  luewer18: ["STRM"],
  bydagma: ["STRM"],
  muchars: ["STRM"],
};

const FAQS = [
  {
    question: "¿Cuántas partidas puedo jugar al día?",
    answer:
      "Puedes jugar hasta 5 partidas de SoloQ al día. Si eres streamer y estás retransmitiendo, puedes jugar hasta 7 partidas: 5 normales + 2 partidas extra.",
  },
  {
    question: "¿Las partidas que no juego se acumulan para otro día?",
    answer:
      "Sí. Las partidas son acumulables. Por ejemplo, si un día juegas solo 1 partida, te quedan 4 pendientes. Al día siguiente podrás jugar tus 5 partidas del día + las 4 acumuladas, es decir, 9 partidas.",
  },
  {
    question: "¿Los streamers tienen partidas adicionales?",
    answer:
      "Sí. Los participantes que hagan stream pueden jugar 2 partidas adicionales al día, siempre que estén retransmitiendo durante esas partidas. La organización podrá solicitar pruebas del directo.",
  },
  {
    question: "¿Tengo que jugar obligatoriamente SoloQ?",
    answer:
      "Sí. El Challenge es exclusivamente SoloQ. No cuentan partidas de DuoQ.",
  },
  {
    question: "¿Puedo jugar con otro participante?",
    answer:
      "No para obtener ventaja. Cada jugador debe competir individualmente y no está permitido coordinar partidas para obtener ventaja.",
  },
  {
    question: "¿Puedo cambiarme de posición?",
    answer:
      "Sí, salvo los jugadores que comiencen el Challenge en Diamante o superior, que deberán jugar obligatoriamente una posición que no sea su posición principal.",
  },
  {
    question: "¿Puedo utilizar mi OTP?",
    answer:
      "Los jugadores que comiencen el Challenge en Diamante o superior no podrán utilizar su OTP o campeón principal de especialización.",
  },
  {
    question: "¿Qué pasa si me banean la cuenta?",
    answer:
      "La cuenta es responsabilidad del participante. Si Riot aplica una sanción que impide continuar jugando, no habrá partidas adicionales, compensaciones ni ampliación del tiempo.",
  },
  {
    question: "¿Qué pasa si supero el límite de partidas?",
    answer:
      "Las partidas que superen las partidas disponibles no contarán para el Challenge.",
  },
  {
    question: "¿Hasta cuándo puedo jugar?",
    answer:
      "El Challenge termina el martes 15 de septiembre a las 23:59. Ese día se podrán jugar todas las partidas que correspondan. Las partidas iniciadas antes de las 23:59 podrán terminarse aunque finalicen después.",
  },
  {
    question: "¿Cómo se decide el ganador?",
    answer:
      "Ganará el participante que termine primero en la clasificación. La clasificación tendrá en cuenta únicamente el rango y los LP obtenidos.",
  },
  {
    question: "¿Puede la organización revisar mis partidas?",
    answer:
      "Sí. La organización puede revisar historiales, posiciones, campeones, estadísticas, streams e infracciones para comprobar que se cumplen las normas.",
  },
  {
    question: "¿Qué pasa si alguien incumple las normas?",
    answer:
      "La organización puede anular partidas y aplicar sanciones dentro del Challenge. La decisión final corresponde a la organización.",
  },
  {
    question: "¿Quién organiza el Grefuso Challenge?",
    answer:
      "El evento está organizado por ByGrefuso.",
  },
];

const RULES = [
  {
    number: "01",
    title: "LÍMITE DE PARTIDAS",
    icon: "🎮",
    content: (
      <>
        <p>
          Máximo <strong>5 partidas de SoloQ al día</strong>.
        </p>

        <p>
          Las partidas que superen el límite diario no contarán.
        </p>

        <div className="rule-highlight">
          <strong>🔥 ÚLTIMO DÍA — 15 DE SEPTIEMBRE</strong>
          <p>
            Se podrán jugar TODAS las partidas que se quieran hasta las
            23:59.
          </p>
          <p>
            Las partidas iniciadas antes de las 23:59 podrán terminarse aunque
            acaben después.
          </p>
        </div>
      </>
    ),
  },
  {
    number: "02",
    title: "BONUS STREAMERS",
    icon: "🔴",
    content: (
      <>
        <p>Los participantes que hagan STREAM podrán jugar:</p>

        <div className="big-rule-number">7 PARTIDAS AL DÍA</div>

        <p>5 partidas normales + 2 partidas EXTRA.</p>

        <div className="rule-highlight">
          <strong>🎥 PARA UTILIZAR LAS 2 PARTIDAS EXTRA</strong>
          <p>
            El participante deberá estar retransmitiendo.
          </p>
          <p>
            La organización podrá solicitar pruebas del directo.
          </p>
        </div>
      </>
    ),
  },
  {
    number: "03",
    title: "SOLOQ OBLIGATORIA",
    icon: "🚫",
    content: (
      <>
        <p>El Challenge es exclusivamente SOLOQ.</p>

        <ul>
          <li>❌ Nada de DuoQ.</li>
          <li>❌ Nada de recibir ayuda de otros participantes.</li>
          <li>
            ❌ Nada de coordinar partidas para obtener ventaja.
          </li>
        </ul>

        <p>
          <strong>Cada jugador compite individualmente.</strong>
        </p>
      </>
    ),
  },
  {
    number: "04",
    title: "CUENTA PERSONAL",
    icon: "🔐",
    content: (
      <>
        <p>
          Cada participante deberá jugar personalmente en su propia cuenta.
        </p>

        <ul>
          <li>❌ Compartir cuentas.</li>
          <li>❌ Que otra persona juegue por ti.</li>
          <li>❌ Boosting.</li>
          <li>❌ Comprar servicios para subir.</li>
          <li>
            ❌ Permitir que otra persona juegue en tu nombre.
          </li>
        </ul>

        <div className="rule-highlight strong-message">
          👉 LA CUENTA ES TUYA. LAS PARTIDAS LAS JUEGAS TÚ.
        </div>
      </>
    ),
  },
  {
    number: "05",
    title: "CÓDIGO DE CONDUCTA DE RIOT",
    icon: "🛡️",
    content: (
      <>
        <p>
          Todos los participantes deberán respetar las normas de Riot Games y
          el Código de Conducta de League of Legends.
        </p>

        <ul>
          <li>❌ Toxicidad</li>
          <li>❌ Insultos / acoso</li>
          <li>❌ Uso inapropiado del chat</li>
          <li>❌ AFK / abandonar partidas</li>
          <li>❌ Inting o sabotaje</li>
          <li>❌ Griefing</li>
          <li>❌ Perder deliberadamente</li>
          <li>❌ Cualquier conducta sancionable por Riot</li>
        </ul>

        <div className="ban-box">
          <strong>🚨 SI RIOT TE Banea POR TU COMPORTAMIENTO:</strong>

          <div className="ban-title">💀 TE JODES.</div>

          <p>
            Si recibes una sanción de Riot que te impide continuar jugando por
            incumplir sus normas, la organización NO será responsable.
          </p>

          <ul>
            <li>❌ No habrá partidas adicionales.</li>
            <li>❌ No habrá compensaciones.</li>
            <li>❌ No se ampliará tu tiempo.</li>
          </ul>

          <strong>👉 TU CUENTA → TU RESPONSABILIDAD.</strong>
        </div>
      </>
    ),
  },
  {
    number: "06",
    title: "REGLA HIGH ELO — DIAMANTE+",
    icon: "💎",
    content: (
      <>
        <p>
          Los jugadores que comiencen el Challenge en{" "}
          <strong>DIAMANTE o superior</strong> tendrán una dificultad
          adicional.
        </p>

        <div className="rule-subtitle">🔄 POSICIÓN NO MAIN</div>

        <p>
          Deberán jugar obligatoriamente en una posición que NO sea su
          posición principal.
        </p>

        <div className="rule-subtitle">🚫 OTP PROHIBIDO</div>

        <p>
          No podrán utilizar su OTP o campeón principal de especialización.
        </p>

        <div className="rule-subtitle">👁️ SUPERVISIÓN</div>

        <p>
          El responsable del Grefuso Challenge supervisará el cumplimiento de
          esta norma.
        </p>

        <p>Se podrá revisar:</p>

        <ul>
          <li>Historial de partidas</li>
          <li>Posiciones jugadas</li>
          <li>Campeones utilizados</li>
          <li>Rendimiento</li>
          <li>Intentos de esquivar la norma</li>
        </ul>

        <p>
          La posición MAIN y los campeones considerados OTP serán determinados
          por la organización según el historial reciente del jugador.
        </p>

        <div className="rule-highlight">
          <strong>⚠️ INCUMPLIMIENTO</strong>
          <p>
            Las partidas afectadas podrán ser anuladas y/o se podrá aplicar
            una sanción dentro del Challenge.
          </p>
          <p>
            🛑 La decisión final corresponde al responsable del evento.
          </p>
        </div>
      </>
    ),
  },
  {
    number: "07",
    title: "FINAL DEL CHALLENGE",
    icon: "🏁",
    content: (
      <>
        <div className="final-date">
          <strong>📅 MARTES 15 DE SEPTIEMBRE</strong>
          <span>⏰ 23:59</span>
        </div>

        <p>
          A esta hora finalizará oficialmente el Grefuso Challenge.
        </p>

        <p>
          🏆 El ganador será el jugador que termine en la primera posición de
          la clasificación según el sistema de puntuación establecido.
        </p>

        <div className="champion-message">
          👑 SOLO UNO SERÁ CAMPEÓN.
        </div>
      </>
    ),
  },
  {
    number: "08",
    title: "ORGANIZACIÓN",
    icon: "⚖️",
    content: (
      <>
        <p>La organización podrá:</p>

        <ul>
          <li>🔎 Revisar partidas</li>
          <li>📺 Comprobar streams</li>
          <li>📊 Revisar estadísticas</li>
          <li>🛡️ Investigar infracciones</li>
          <li>⚠️ Anular partidas</li>
          <li>🚨 Aplicar sanciones</li>
          <li>📜 Resolver situaciones no contempladas</li>
        </ul>

        <p>
          En cualquier situación no prevista, la decisión final corresponderá
          a la organización.
        </p>
      </>
    ),
  },
];

function formatViewers(viewers: number) {
  return new Intl.NumberFormat("es-ES").format(viewers);
}

function getCountdown() {
  // El Challenge ya ha comenzado. Ahora contamos hasta su final oficial.
  const target = new Date("2026-09-15T23:59:00+02:00").getTime();
  const now = Date.now();
  const difference = Math.max(0, target - now);

  const days = Math.floor(difference / 86400000);
  const hours = Math.floor((difference / 3600000) % 24);
  const minutes = Math.floor((difference / 60000) % 60);
  const seconds = Math.floor((difference / 1000) % 60);

  return { days, hours, minutes, seconds };
}

function rankValue(tier: string, rank: string) {
  const tiers: Record<string, number> = {
    HIERRO: 1,
    BRONCE: 2,
    PLATA: 3,
    ORO: 4,
    PLATINO: 5,
    ESMERALDA: 6,
    DIAMANTE: 7,
    MAESTRO: 8,
    GRAN_MAESTRO: 9,
    CHALLENGER: 10,
  };

  const divisions: Record<string, number> = {
    IV: 1,
    III: 2,
    II: 3,
    I: 4,
  };

  return (
    (tiers[tier.toUpperCase()] || 0) * 1000 +
    (divisions[rank.toUpperCase()] || 0) * 100 +
    0
  );
}

export default function Home() {
  const [streamers, setStreamers] = useState<Streamer[]>([]);
  const [loadingStreams, setLoadingStreams] = useState(true);
  const [countdown, setCountdown] = useState(getCountdown());
  const [showFullRanking, setShowFullRanking] = useState(false);
  const [showAllStreams, setShowAllStreams] = useState(false);

  /*
   * Preparado para la Riot API.
   * Cuando creemos /api/riot, esta lista se rellenará automáticamente.
   */
  const [riotPlayers, setRiotPlayers] = useState<RiotPlayer[]>([]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown(getCountdown());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  async function loadStreams() {
    try {
      const response = await fetch("/api/twitch", {
        cache: "no-store",
      });

      const data = await response.json();

      if (data.success && Array.isArray(data.streams)) {
        const twitchStreams: Streamer[] = data.streams.map((streamer: Streamer) => ({
          ...streamer,
          platform: "twitch",
        }));

        let kickStreams: Streamer[] = [];
        try {
          const kickResponse = await fetch("/api/kick", { cache: "no-store" });
          if (kickResponse.ok) {
            const kickData = await kickResponse.json();
            if (kickData.success && Array.isArray(kickData.streams)) {
              kickStreams = kickData.streams.map((streamer: Streamer) => ({
                ...streamer,
                platform: "kick",
              }));
            }
          }
        } catch (error) {
          console.warn("Kick API no disponible:", error);
        }

        const allStreams = [...twitchStreams, ...kickStreams];
        const ordered = allStreams.sort((a, b) => {
          const aMain = a.channel === "bygrefuso" ? 0 : 1;
          const bMain = b.channel === "bygrefuso" ? 0 : 1;
          if (aMain !== bMain) return aMain - bMain;
          if (a.live !== b.live) return a.live ? -1 : 1;
          return a.displayName.localeCompare(b.displayName, "es");
        });

        setStreamers(ordered);
      }
    } catch (error) {
      console.error("Error cargando Twitch:", error);
    } finally {
      setLoadingStreams(false);
    }
  }

  async function loadRiot() {
    try {
      const response = await fetch("/api/riot", {
        cache: "no-store",
      });

      if (!response.ok) return;

      const data = await response.json();

      if (data.success && Array.isArray(data.players)) {
        setRiotPlayers(data.players);
      }
    } catch (error) {
      /*
       * No mostramos error en pantalla mientras /api/riot todavía no exista.
       */
      console.log("Riot API todavía no disponible.");
    }
  }

  useEffect(() => {
    loadStreams();
    loadRiot();

    const interval = setInterval(() => {
      loadStreams();
      loadRiot();
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  const mainStreamer = useMemo(() => {
    const bygrefuso = streamers.find(
      (streamer) => streamer.channel === "bygrefuso"
    );

    if (bygrefuso?.live) {
      return bygrefuso;
    }

    return bygrefuso || streamers[0] || null;
  }, [streamers]);

  const liveStreamers = streamers.filter((streamer) => streamer.live);
  const orderedStreamers = [...streamers].sort((a, b) => {
    // ByGrefuso siempre tiene prioridad.
    if (a.channel === "bygrefuso" && b.channel !== "bygrefuso") return -1;
    if (b.channel === "bygrefuso" && a.channel !== "bygrefuso") return 1;

    // Después, primero los que están en directo.
    if (a.live !== b.live) return a.live ? -1 : 1;

    return a.displayName.localeCompare(b.displayName, "es");
  });

  // En portada enseñamos solo 6 tarjetas. El resto aparece al pulsar
  // "VER TODOS LOS DIRECTOS".
  const visibleStreamers = showAllStreams
    ? orderedStreamers
    : orderedStreamers.slice(0, 6);

  const sortedPlayers = [...riotPlayers].sort((a, b) => {
    const aValue =
      rankValue(a.tier, a.rank) * 10000 + a.lp;
    const bValue =
      rankValue(b.tier, b.rank) * 10000 + b.lp;

    return bValue - aValue;
  });

  return (
    <main className="challenge-page">
      <header className="navbar">
        <a href="/" className="brand">
          <img src="/logo.png" alt="Grefuso Challenge" />
        </a>

        <nav>
          <a href="#inicio">INICIO</a>
          <a href="#torneo">EL TORNEO</a>
          <a href="#participantes">PARTICIPANTES</a>
          <a href="#clasificacion">CLASIFICACIÓN</a>
          <a href="#normas">NORMAS</a>
          <a href="#faq">FAQ</a>
        </nav>

        <div className="socials">
          <a
            href="https://www.twitch.tv/bygrefuso"
            target="_blank"
            rel="noreferrer"
          >
            TW
          </a>

          <a
            href="https://www.instagram.com/_jordilarosa_/"
            target="_blank"
            rel="noreferrer"
          >
            IG
          </a>

          <a
            href="https://www.twitch.tv/bygrefuso"
            target="_blank"
            rel="noreferrer"
            className="follow-button"
          >
            SEGUIR EN TWITCH
          </a>
        </div>
      </header>

      <section id="inicio" className="hero">
        <div className="hero-left">
          <img
            src="/logo.png"
            alt="Grefuso Challenge"
            className="hero-logo"
          />

          <p className="eyebrow">
            SOLOQ CHALLENGE DE LEAGUE OF LEGENDS
          </p>

          <div className="date-box">
            DEL 28 DE AGOSTO AL 15 DE SEPTIEMBRE
          </div>

          <div className="countdown-title">
            EL CHALLENGE FINALIZA EN
          </div>

          <div className="countdown">
            <div>
              <strong>{String(countdown.days).padStart(2, "0")}</strong>
              <span>DÍAS</span>
            </div>

            <div>
              <strong>{String(countdown.hours).padStart(2, "0")}</strong>
              <span>HORAS</span>
            </div>

            <div>
              <strong>{String(countdown.minutes).padStart(2, "0")}</strong>
              <span>MINUTOS</span>
            </div>

            <div>
              <strong>{String(countdown.seconds).padStart(2, "0")}</strong>
              <span>SEGUNDOS</span>
            </div>
          </div>

          <p className="start-date">
            ● MARTES 15 DE SEPTIEMBRE A LAS 23:59
          </p>
        </div>

        <div className="hero-stream">
          <div className="stream-header">
            <span className="live-dot"></span>

            {mainStreamer?.live ? "EN DIRECTO" : "OFFLINE"}

            <span className="platform">TWITCH</span>
          </div>

          {mainStreamer?.live ? (
            <div className="twitch-player">
              <iframe
                src={`https://player.twitch.tv/?channel=${mainStreamer.channel}&parent=grefusochallenge.com&parent=www.grefusochallenge.com&muted=true`}
                allowFullScreen
                title={`Directo de ${mainStreamer.displayName}`}
              />
            </div>
          ) : (
            <div className="offline-main">
              <div className="offline-background">
                <span>GREFUSO</span>
                <strong>CHALLENGE</strong>
              </div>
            </div>
          )}

          <div className="main-stream-info">
            <div className="main-avatar">
              {mainStreamer?.avatar ? (
                <img
                  src={mainStreamer.avatar}
                  alt={mainStreamer.displayName}
                />
              ) : (
                "G"
              )}
            </div>

            <div className="main-info-text">
              <div className="main-name">
                {mainStreamer?.displayName || "ByGrefuso"}

                {mainStreamer?.channel === "bygrefuso" && (
                  <span className="verified">✓</span>
                )}

                {mainStreamer && (
                  <span className="tag">
                    {streamerLabels[mainStreamer.channel]?.join(" + ") || "STREAM"}
                  </span>
                )}
              </div>

              <div className="main-game">
                {mainStreamer?.game || "League of Legends"}
              </div>
            </div>

            {mainStreamer?.live && (
              <a
                href={mainStreamer.url}
                target="_blank"
                rel="noreferrer"
                className="watch-button"
              >
                VER DIRECTO
              </a>
            )}
          </div>
        </div>
      </section>

      <section className="dashboard-section">
        <div className="dashboard-live">
      <section className="live-section">
        <div className="section-heading">
          <div>
            <h2>
              <span className="live-dot"></span>
              DIRECTOS AHORA
            </h2>

            <p>
              {liveStreamers.length > 0
                ? `${liveStreamers.length} participante${
                    liveStreamers.length === 1 ? "" : "s"
                  } en directo`
                : "Ningún participante está en directo ahora mismo"}
            </p>
          </div>

          <button
            type="button"
            className="all-streams"
            onClick={() => setShowAllStreams((value) => !value)}
          >
            {showAllStreams
              ? "MOSTRAR SOLO 6 →"
              : "VER TODOS LOS DIRECTOS →"}
          </button>
        </div>

        <div className="stream-grid">
          {loadingStreams ? (
            <div className="loading">
              Cargando directos...
            </div>
          ) : (
            visibleStreamers.map((streamer) => (
              <StreamerCard
                key={`${streamer.platform}-${streamer.channel}`}
                streamer={streamer}
              />
            ))
          )}
        </div>
      </section>

      <section id="torneo" className="content-section">
        <div className="section-heading-large">
          <span>01</span>
          <div>
            <p className="section-kicker">GREFUSO CHALLENGE 2026</p>
            <h2>EL TORNEO</h2>
          </div>
        </div>

        <div className="info-grid">
          <div className="info-card">
            <span className="info-icon">🏆</span>
            <h3>UN SOLO CAMPEÓN</h3>
            <p>
              Todos compiten individualmente para terminar en la primera
              posición.
            </p>
          </div>

          <div className="info-card">
            <span className="info-icon">🎮</span>
            <h3>SOLOQ</h3>
            <p>
              El Challenge se juega exclusivamente en partidas clasificatorias
              SoloQ.
            </p>
          </div>

          <div className="info-card">
            <span className="info-icon">📅</span>
            <h3>28 AGO — 15 SEP</h3>
            <p>
              El Challenge comienza el viernes 28 de agosto y termina el
              martes 15 de septiembre.
            </p>
          </div>

          <div className="info-card">
            <span className="info-icon">💎</span>
            <h3>RANGO + LP</h3>
            <p>
              La clasificación se ordenará por el rango y los LP de cada
              participante.
            </p>
          </div>
        </div>
      </section>

      <section id="participantes" className="content-section">
        <div className="section-heading-large">
          <span>02</span>
          <div>
            <p className="section-kicker">LOS PARTICIPANTES</p>
            <h2>PARTICIPANTES</h2>
          </div>
        </div>

        <div className="participants-grid">
          {PARTICIPANTS.map((participant) => {
            const streamer = participant.channel
              ? streamers.find((item) => item.channel === participant.channel)
              : undefined;
            const labels = participant.channel
              ? streamerLabels[participant.channel] || ["STREAM"]
              : [];
            const content = (
              <>
                <div className="participant-avatar">
                  {streamer?.avatar ? (
                    <img src={streamer.avatar} alt={participant.name} />
                  ) : (
                    <span>{participant.name.charAt(0).toUpperCase()}</span>
                  )}
                </div>
                <div className="participant-card-main">
                  <h3>{participant.name}</h3>
                  <p className="participant-riot-id">{participant.riotId}</p>
                  <div className="participant-tags">
                    {labels.map((label) => (
                      <span key={label}>{label}</span>
                    ))}
                  </div>
                </div>
                {streamer?.live && <b className="participant-live">LIVE</b>}
              </>
            );

            return participant.channel ? (
              <a
                key={participant.riotId}
                href={streamer?.url || `https://${participant.platform}.com/${participant.channel}`}
                target="_blank"
                rel="noreferrer"
                className="participant-card"
              >
                {content}
              </a>
            ) : (
              <div key={participant.riotId} className="participant-card">
                {content}
              </div>
            );
          })}
        </div>
      </section>


        </div>

        <div className="dashboard-ranking" id="clasificacion">
      <section id="clasificacion" className="content-section">
        <div className="dashboard-heading">
          <div>
            <h2><span className="live-dot"></span> CLASIFICACIÓN EN DIRECTO</h2>
            <p>Actualizada automáticamente</p>
          </div>
          <button
            type="button"
            className="dashboard-link"
            onClick={() => setShowFullRanking((value) => !value)}
          >
            {showFullRanking ? "VER TOP 7 ↑" : "VER CLASIFICACIÓN COMPLETA →"}
          </button>
        </div>

        <div className="ranking-note compact-ranking-note">
          <span>🏆</span>
          <div>
            <strong>RANGO + LP = CLASIFICACIÓN</strong>
            <p>Haz clic en un jugador para abrir su perfil en OP.GG.</p>
          </div>
        </div>

        <div className="ranking-box">
          <div className="ranking-header">
            <span>#</span>
            <span>PARTICIPANTE</span>
            <span>RANGO</span>
            <span>LP</span>
          </div>

          {sortedPlayers.length > 0 ? (
            (showFullRanking ? sortedPlayers : sortedPlayers.slice(0, 7)).map((player, index) => (
              <a
                className="ranking-row"
                key={player.name}
                href={`https://op.gg/lol/summoners/euw/${encodeURIComponent((player.riotId || player.name).replace("#", "-"))}`}
                target="_blank"
                rel="noreferrer"
              >
                <strong className="position">{index + 1}</strong>

                <div className="ranking-player">
                  {player.icon && (
                    <img src={player.icon} alt={player.name} />
                  )}
                  <span>{player.name}</span>
                </div>

                <span className="rank-name">
                  {player.tier === "UNRANKED" ? "SIN RANGO" : `${player.tier} ${player.rank}`}
                </span>

                <strong className="lp">{player.lp} LP</strong>
              </a>
            ))
          ) : (
            <div className="ranking-empty">
              <div className="ranking-empty-icon">🏆</div>

              <h3>CLASIFICACIÓN EN PREPARACIÓN</h3>

              <p>
                La clasificación se actualizará automáticamente mediante la
                Riot API.
              </p>

              <span>
                RANGO + LP
              </span>
            </div>
          )}
        </div>
      </section>


        </div>
      </section>

      <section id="normas" className="content-section rules-section">
        <div className="section-heading-large">
          <span>04</span>
          <div>
            <p className="section-kicker">REGLAMENTO OFICIAL</p>
            <h2>NORMAS</h2>
          </div>
        </div>

        <div className="rules-intro">
          <div>
            <span>📜</span>
            <div>
              <strong>GREFUSO CHALLENGE 2026</strong>
              <p>
                Reglamento oficial del Challenge. Todos los participantes
                deberán conocer y respetar estas normas.
              </p>
            </div>
          </div>
        </div>

        <div className="rules-list">
          {RULES.map((rule) => (
            <article className="rule-card" key={rule.number}>
              <div className="rule-top">
                <span className="rule-number">{rule.number}</span>
                <span className="rule-icon">{rule.icon}</span>

                <h3>{rule.title}</h3>
              </div>

              <div className="rule-content">
                {rule.content}
              </div>
            </article>
          ))}
        </div>

        <div className="organizer-card">
          <span>👑</span>

          <div>
            <small>ORGANIZADOR</small>
            <h3>BYGREFUSO</h3>

            <div className="organizer-links">
              <a
                href="https://www.twitch.tv/bygrefuso"
                target="_blank"
                rel="noreferrer"
              >
                🎮 Twitch
              </a>

              <a
                href="https://www.youtube.com/@LoJord1"
                target="_blank"
                rel="noreferrer"
              >
                ▶️ YouTube
              </a>

              <a
                href="https://www.tiktok.com/@lojordi_ndeu"
                target="_blank"
                rel="noreferrer"
              >
                🎵 TikTok
              </a>

              <a
                href="https://www.instagram.com/_jordilarosa_/"
                target="_blank"
                rel="noreferrer"
              >
                📸 Instagram
              </a>
            </div>
          </div>
        </div>
      </section>

      <section id="faq" className="content-section faq-section">
        <div className="section-heading-large">
          <span>05</span>
          <div>
            <p className="section-kicker">TIENES DUDAS</p>
            <h2>FAQ</h2>
          </div>
        </div>

        <div className="faq-list">
          {FAQS.map((faq, index) => (
            <details className="faq-item" key={faq.question}>
              <summary>
                <span>{String(index + 1).padStart(2, "0")}</span>
                <strong>{faq.question}</strong>
                <b>+</b>
              </summary>

              <div className="faq-answer">
                <p>{faq.answer}</p>
              </div>
            </details>
          ))}
        </div>
      </section>

      <footer>
        <img src="/logo.png" alt="Grefuso Challenge" />

        <span>
          GREFUSO CHALLENGE © 2026
        </span>

        <span>
          ORGANIZADO POR BYGREFUSO
        </span>
      </footer>

      <style jsx global>{`
        * {
          box-sizing: border-box;
        }

        html {
          scroll-behavior: smooth;
        }

        body {
          margin: 0;
          background:
            radial-gradient(circle at 78% 16%, rgba(255, 0, 119, 0.22), transparent 34%),
            radial-gradient(circle at 8% 35%, rgba(145, 0, 90, 0.14), transparent 30%),
            linear-gradient(180deg, #070507 0%, #050505 62%, #070507 100%);
          background-attachment: fixed;
          color: white;
          font-family: Arial, Helvetica, sans-serif;
        }

        a {
          color: inherit;
          text-decoration: none;
        }

        .challenge-page {
          min-height: 100vh;
          overflow: hidden;
        }

        .navbar {
          height: 76px;
          padding: 0 4%;
          display: flex;
          align-items: center;
          justify-content: space-between;
          border-bottom: 1px solid rgba(255, 0, 119, 0.15);
          background: rgba(5, 5, 5, 0.94);
          position: sticky;
          top: 0;
          z-index: 20;
          backdrop-filter: blur(15px);
        }

        .brand img {
          width: 120px;
          height: 100px;
          object-fit: contain;
          transform: translateY(10px);
        }

        nav {
          display: flex;
          gap: 25px;
          height: 100%;
          align-items: center;
        }

        nav a {
          font-size: 12px;
          font-weight: 800;
          letter-spacing: 0.5px;
          color: #a8a8a8;
          transition: 0.2s;
        }

        nav a:hover {
          color: #ff0a83;
        }

        .socials {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .socials a {
          border: 1px solid #292929;
          padding: 10px 12px;
          border-radius: 8px;
          font-size: 11px;
          font-weight: 800;
        }

        .socials .follow-button {
          background: #ff0a83;
          border-color: #ff0a83;
          padding: 12px 20px;
        }

        .hero {
          width: 94%;
          max-width: 1500px;
          margin: 38px auto 35px;
          display: grid;
          grid-template-columns: 0.78fr 1.22fr;
          gap: 38px;
          align-items: center;
        }

        .hero-logo {
          width: min(100%, 500px);
          max-height: 400px;
          object-fit: contain;
          margin-bottom: 25px;
        }

        .eyebrow {
          font-size: 15px;
          font-weight: 900;
          letter-spacing: 3px;
          color: #ddd;
        }

        .date-box {
          display: inline-block;
          margin: 12px 0 35px;
          padding: 13px 18px;
          border: 1px solid #ff0a83;
          color: #ff0a83;
          font-weight: 900;
          font-size: 13px;
        }

        .countdown-title {
          font-size: 12px;
          font-weight: 900;
          letter-spacing: 2px;
          color: #aaa;
          margin-bottom: 12px;
        }

        .countdown {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 8px;
          max-width: 500px;
        }

        .countdown div {
          border: 1px solid #292929;
          border-radius: 8px;
          padding: 15px 8px;
          text-align: center;
          background: #090909;
        }

        .countdown strong {
          display: block;
          font-size: 30px;
          color: #ff0a83;
        }

        .countdown span {
          font-size: 9px;
          color: #aaa;
          font-weight: 800;
        }

        .start-date {
          color: #aaa;
          font-size: 11px;
          font-weight: 800;
        }

        .hero-stream {
          min-width: 0;
          border: 1px solid rgba(255, 0, 119, 0.6);
          border-radius: 12px;
          overflow: hidden;
          background: #0a0a0c;
          box-shadow: 0 0 50px rgba(255, 0, 119, 0.08);
        }

        .stream-header {
          height: 55px;
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 0 20px;
          font-size: 11px;
          font-weight: 900;
          color: #ff0a83;
          background: #100b10;
        }

        .platform {
          margin-left: auto;
          color: #777;
          letter-spacing: 2px;
        }

        .live-dot {
          width: 8px;
          height: 8px;
          display: inline-block;
          border-radius: 50%;
          background: #ff0a83;
          box-shadow: 0 0 12px #ff0a83;
        }

        .twitch-player {
          width: 100%;
          aspect-ratio: 16 / 9;
          background: #000;
        }

        .twitch-player iframe {
          width: 100%;
          height: 100%;
          border: 0;
        }

        .offline-main {
          aspect-ratio: 16 / 9;
          display: flex;
          align-items: center;
          justify-content: center;
          background:
            repeating-linear-gradient(
              135deg,
              #0a0a0c,
              #0a0a0c 30px,
              #111114 30px,
              #111114 32px
            );
        }

        .offline-background {
          text-align: center;
          opacity: 0.65;
        }

        .offline-background span {
          display: block;
          font-size: 30px;
          font-weight: 900;
          letter-spacing: 7px;
          color: #777;
        }

        .offline-background strong {
          display: block;
          font-size: clamp(45px, 7vw, 90px);
          font-weight: 1000;
          color: #ff0a83;
          text-shadow: 0 0 25px rgba(255, 0, 119, 0.35);
        }

        .main-stream-info {
          min-height: 85px;
          display: flex;
          align-items: center;
          gap: 14px;
          padding: 15px 20px;
          background: #09090b;
        }

        .main-avatar {
          width: 48px;
          height: 48px;
          border-radius: 50%;
          background: #ff0a83;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 900;
          overflow: hidden;
        }

        .main-avatar img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .main-name {
          font-size: 16px;
          font-weight: 900;
        }

        .verified {
          display: inline-flex;
          margin-left: 6px;
          width: 18px;
          height: 18px;
          border-radius: 50%;
          background: #ff0a83;
          align-items: center;
          justify-content: center;
          font-size: 11px;
        }

        .tag {
          display: inline-block;
          margin-left: 10px;
          padding: 4px 7px;
          border-radius: 4px;
          background: rgba(255, 0, 119, 0.12);
          color: #ff0a83;
          font-size: 8px;
          font-weight: 900;
          vertical-align: middle;
        }

        .main-game {
          margin-top: 5px;
          color: #777;
          font-size: 11px;
        }

        .watch-button {
          margin-left: auto;
          background: #ff0a83;
          padding: 13px 20px;
          border-radius: 5px;
          font-size: 10px;
          font-weight: 900;
        }

        .dashboard-section {
          width: 94%;
          max-width: 1500px;
          margin: 0 auto 70px;
          display: grid;
          grid-template-columns: minmax(0, 1.55fr) minmax(360px, 0.95fr);
          gap: 26px;
          align-items: start;
        }

        .dashboard-live,
        .dashboard-ranking {
          min-width: 0;
        }

        .dashboard-ranking {
          border: 1px solid #292929;
          border-radius: 12px;
          background: rgba(8, 8, 10, 0.9);
          overflow: hidden;
        }

        .dashboard-ranking .ranking-box {
          border: 0;
          border-radius: 0;
          border-top: 1px solid #242428;
        }

        .dashboard-heading {
          min-height: 64px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 15px;
          margin-bottom: 12px;
        }

        .dashboard-heading h2 {
          margin: 0;
          font-size: 20px;
          letter-spacing: 1px;
        }

        .dashboard-heading h2 .live-dot {
          margin-right: 9px;
        }

        .dashboard-heading p {
          color: #777;
          margin: 7px 0 0 18px;
          font-size: 11px;
        }

        .dashboard-link {
          border: 1px solid #333;
          border-radius: 6px;
          padding: 10px 13px;
          font-size: 9px;
          font-weight: 900;
          white-space: nowrap;
        }

        .dashboard-link:hover {
          border-color: #ff0a83;
          color: #ff0a83;
        }

        .compact-ranking-note {
          margin: 0;
          border: 0;
          border-bottom: 1px solid #242428;
          border-radius: 0;
          padding: 14px 18px;
        }

        .compact-ranking-note p {
          margin: 4px 0 0;
          font-size: 9px;
        }

        .dashboard-ranking .ranking-header,
        .dashboard-ranking .ranking-row {
          grid-template-columns: 38px 1fr 100px 70px;
        }

        .dashboard-ranking .ranking-header {
          padding: 13px 15px;
          font-size: 8px;
        }

        .dashboard-ranking .ranking-row {
          padding: 10px 15px;
          min-height: 51px;
          cursor: pointer;
          transition: background 0.15s, border-color 0.15s;
        }

        .dashboard-ranking .ranking-row:hover {
          background: rgba(255, 0, 119, 0.06);
        }

        .dashboard-ranking .ranking-player {
          font-size: 11px;
        }

        .dashboard-ranking .ranking-player img {
          width: 30px;
          height: 30px;
        }

        .dashboard-ranking .rank-name,
        .dashboard-ranking .lp {
          font-size: 10px;
        }

        .dashboard-ranking .ranking-empty {
          padding: 35px 18px;
        }

        .live-section {
          width: 100%;
          max-width: none;
          margin: 0;

          padding: 25px;
          border: 1px solid rgba(255, 0, 119, 0.4);
          border-radius: 12px;
          background: rgba(8, 8, 10, 0.8);
        }

        .section-heading {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 22px;
        }

        .section-heading h2 {
          margin: 0;
          font-size: 20px;
          letter-spacing: 1px;
        }

        .section-heading h2 .live-dot {
          margin-right: 10px;
        }

        .section-heading p {
          color: #777;
          margin: 7px 0 0 18px;
          font-size: 11px;
        }

        .all-streams {
          border: 1px solid #333;
          border-radius: 6px;
          padding: 12px 17px;
          font-size: 10px;
          font-weight: 900;
        }

        .stream-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 14px;
        }

        .stream-card {
          border: 1px solid #292929;
          border-radius: 9px;
          overflow: hidden;
          background: #09090b;
          transition: 0.2s;
        }

        .stream-card.live {
          border-color: rgba(255, 0, 119, 0.65);
        }

        .stream-card:hover {
          transform: translateY(-3px);
          border-color: #ff0a83;
        }

        .card-preview {
          position: relative;
          aspect-ratio: 16 / 9;
          background: #101013;
          overflow: hidden;
        }

        .card-preview img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .offline-preview {
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, #101014, #080809);
          color: #555;
          font-size: 13px;
          font-weight: 900;
          letter-spacing: 2px;
        }

        .status {
          position: absolute;
          left: 10px;
          top: 10px;
          padding: 6px 8px;
          border-radius: 4px;
          background: #ff0a83;
          color: white;
          font-size: 8px;
          font-weight: 900;
        }

        .status.offline {
          background: #303033;
          color: #aaa;
        }

        .card-info {
          padding: 12px;
          display: flex;
          align-items: center;
          gap: 9px;
        }

        .card-avatar {
          width: 35px;
          height: 35px;
          border-radius: 50%;
          overflow: hidden;
          background: #222;
          flex-shrink: 0;
        }

        .card-avatar img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .card-name {
          font-size: 12px;
          font-weight: 900;
        }

        .card-viewers {
          color: #777;
          font-size: 9px;
          margin-top: 3px;
        }

        .card-tag {
          margin-left: auto;
          color: #ff0a83;
          font-size: 7px;
          font-weight: 900;
        }

        .content-section {
          width: 94%;
          max-width: 1500px;
          margin: 0 auto 80px;
          padding-top: 20px;
          scroll-margin-top: 100px;
        }

        .section-heading-large {
          display: flex;
          gap: 22px;
          align-items: flex-start;
          margin-bottom: 35px;
        }

        .section-heading-large > span {
          color: #ff0a83;
          font-size: 14px;
          font-weight: 900;
          padding-top: 5px;
        }

        .section-kicker {
          color: #777;
          font-size: 10px;
          font-weight: 900;
          letter-spacing: 3px;
          margin: 0 0 8px;
        }

        .section-heading-large h2 {
          margin: 0;
          font-size: clamp(30px, 5vw, 58px);
          font-weight: 1000;
          letter-spacing: -2px;
        }

        .info-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 14px;
        }

        .info-card {
          border: 1px solid #252529;
          background: #09090b;
          border-radius: 10px;
          padding: 25px;
          min-height: 180px;
          transition: 0.2s;
        }

        .info-card:hover {
          border-color: rgba(255, 0, 119, 0.7);
          transform: translateY(-3px);
        }

        .info-icon {
          font-size: 24px;
        }

        .info-card h3 {
          font-size: 13px;
          margin: 20px 0 10px;
        }

        .info-card p {
          color: #777;
          font-size: 12px;
          line-height: 1.7;
          margin: 0;
        }

        .participants-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 12px;
        }

        .participant-card {
          display: flex;
          align-items: center;
          gap: 14px;
          padding: 16px;
          border: 1px solid #292929;
          background: #09090b;
          border-radius: 9px;
          transition: 0.2s;
        }

        .participant-card:hover {
          border-color: #ff0a83;
          transform: translateY(-2px);
        }

        .participant-avatar {
          width: 48px;
          height: 48px;
          border-radius: 50%;
          overflow: hidden;
          background: #18181c;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #ff0a83;
          font-weight: 900;
          flex-shrink: 0;
        }

        .participant-avatar img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .participant-card h3 {
          margin: 0 0 5px;
          font-size: 13px;
        }

        .participant-card span {
          color: #ff0a83;
          font-size: 8px;
          font-weight: 900;
        }

        .participant-live {
          margin-left: auto;
          color: #ff0a83;
          font-size: 8px;
        }

        .ranking-box {
          border: 1px solid rgba(255, 0, 119, 0.35);
          border-radius: 12px;
          overflow: hidden;
          background: #09090b;
        }

        .ranking-header,
        .ranking-row {
          display: grid;
          grid-template-columns: 70px 1fr 200px 120px;
          align-items: center;
        }

        .ranking-header {
          padding: 16px 22px;
          color: #666;
          font-size: 9px;
          font-weight: 900;
          letter-spacing: 1px;
          border-bottom: 1px solid #242428;
          background: #0d0d10;
        }

        .ranking-row {
          padding: 15px 22px;
          border-bottom: 1px solid #1c1c20;
        }

        .ranking-row:last-child {
          border-bottom: 0;
        }

        .position {
          color: #ff0a83;
        }

        .ranking-player {
          display: flex;
          align-items: center;
          gap: 12px;
          font-size: 13px;
          font-weight: 900;
        }

        .ranking-player img {
          width: 34px;
          height: 34px;
          border-radius: 50%;
          object-fit: cover;
        }

        .rank-name {
          color: #aaa;
          font-size: 12px;
          font-weight: 800;
        }

        .lp {
          color: #ff0a83;
          font-size: 13px;
        }

        .ranking-empty {
          text-align: center;
          padding: 70px 20px;
        }

        .ranking-empty-icon {
          font-size: 45px;
          margin-bottom: 15px;
        }

        .ranking-empty h3 {
          margin: 0 0 10px;
          font-size: 17px;
        }

        .ranking-empty p {
          margin: 0 auto 18px;
          color: #666;
          max-width: 500px;
          font-size: 12px;
          line-height: 1.7;
        }

        .ranking-empty span {
          color: #ff0a83;
          font-size: 10px;
          font-weight: 900;
          letter-spacing: 2px;
        }

        .rules-intro {
          border: 1px solid rgba(255, 0, 119, 0.4);
          background: rgba(255, 0, 119, 0.04);
          padding: 25px;
          border-radius: 10px;
          margin-bottom: 20px;
        }

        .rules-intro > div {
          display: flex;
          align-items: center;
          gap: 18px;
        }

        .rules-intro span {
          font-size: 30px;
        }

        .rules-intro strong {
          font-size: 14px;
        }

        .rules-intro p {
          color: #777;
          font-size: 11px;
          margin: 7px 0 0;
        }

        .rules-list {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .rule-card {
          border: 1px solid #252529;
          border-radius: 10px;
          background: #09090b;
          padding: 25px;
        }

        .rule-top {
          display: flex;
          align-items: center;
          gap: 12px;
          border-bottom: 1px solid #202024;
          padding-bottom: 17px;
          margin-bottom: 18px;
        }

        .rule-number {
          color: #ff0a83;
          font-size: 12px;
          font-weight: 900;
        }

        .rule-icon {
          font-size: 20px;
        }

        .rule-top h3 {
          margin: 0;
          font-size: 14px;
          letter-spacing: 0.5px;
        }

        .rule-content {
          color: #999;
          font-size: 12px;
          line-height: 1.75;
        }

        .rule-content p {
          margin: 0 0 13px;
        }

        .rule-content strong {
          color: #fff;
        }

        .rule-content ul {
          margin: 10px 0 18px;
          padding-left: 0;
          list-style: none;
        }

        .rule-content li {
          margin: 7px 0;
        }

        .rule-highlight {
          margin-top: 18px;
          padding: 16px;
          border-left: 3px solid #ff0a83;
          background: rgba(255, 0, 119, 0.05);
        }

        .strong-message {
          color: #fff;
          font-weight: 900;
        }

        .big-rule-number {
          color: #ff0a83;
          font-size: 28px;
          font-weight: 1000;
          letter-spacing: -1px;
          margin: 15px 0;
        }

        .rule-subtitle {
          color: #ff0a83;
          font-weight: 900;
          font-size: 10px;
          letter-spacing: 1px;
          margin: 20px 0 8px;
        }

        .ban-box {
          margin-top: 20px;
          padding: 20px;
          border: 1px solid rgba(255, 0, 119, 0.5);
          background: rgba(255, 0, 119, 0.04);
        }

        .ban-title {
          color: #ff0a83;
          font-size: 26px;
          font-weight: 1000;
          margin: 12px 0;
        }

        .final-date {
          display: flex;
          gap: 15px;
          align-items: center;
          margin-bottom: 20px;
        }

        .final-date strong {
          color: #fff;
          font-size: 15px;
        }

        .final-date span {
          color: #ff0a83;
          font-weight: 900;
        }

        .champion-message {
          margin-top: 25px;
          padding: 20px;
          text-align: center;
          border: 1px solid rgba(255, 0, 119, 0.5);
          color: #ff0a83;
          font-size: 16px;
          font-weight: 1000;
        }

        .organizer-card {
          display: flex;
          align-items: center;
          gap: 20px;
          margin-top: 20px;
          padding: 25px;
          border: 1px solid #292929;
          border-radius: 10px;
          background: #09090b;
        }

        .organizer-card > span {
          font-size: 35px;
        }

        .organizer-card small {
          color: #666;
          font-size: 9px;
          font-weight: 900;
        }

        .organizer-card h3 {
          margin: 5px 0 12px;
        }

        .organizer-links {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
        }

        .organizer-links a {
          border: 1px solid #292929;
          padding: 8px 10px;
          border-radius: 5px;
          font-size: 9px;
          font-weight: 800;
        }

        .organizer-links a:hover {
          border-color: #ff0a83;
          color: #ff0a83;
        }

        .faq-list {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .faq-item {
          border: 1px solid #252529;
          border-radius: 9px;
          background: #09090b;
          overflow: hidden;
        }

        .faq-item summary {
          cursor: pointer;
          list-style: none;
          display: grid;
          grid-template-columns: 45px 1fr 25px;
          align-items: center;
          gap: 10px;
          padding: 20px;
        }

        .faq-item summary::-webkit-details-marker {
          display: none;
        }

        .faq-item summary > span {
          color: #ff0a83;
          font-size: 9px;
          font-weight: 900;
        }

        .faq-item summary strong {
          font-size: 12px;
        }

        .faq-item summary b {
          color: #ff0a83;
          font-size: 18px;
          text-align: right;
        }

        .faq-item[open] summary {
          border-bottom: 1px solid #222;
        }

        .faq-item[open] summary b {
          transform: rotate(45deg);
        }

        .faq-answer {
          padding: 18px 20px 20px 75px;
        }

        .faq-answer p {
          color: #888;
          font-size: 12px;
          line-height: 1.8;
          margin: 0;
        }

        .loading {
          grid-column: 1 / -1;
          padding: 40px;
          text-align: center;
          color: #777;
        }

        footer {
          margin-top: 70px;
          padding: 35px;
          border-top: 1px solid #202024;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 20px;
          color: #555;
          font-size: 9px;
          font-weight: 900;
        }

        footer img {
          width: 65px;
          height: 50px;
          object-fit: contain;
        }

        @media (max-width: 1100px) {
          nav {
            display: none;
          }

          .hero {
            grid-template-columns: 1fr;
          }

          .dashboard-section {
            grid-template-columns: 1fr;
          }

          .hero-left {
            text-align: center;
          }

          .hero-logo {
            width: 350px;
          }

          .countdown {
            margin: 0 auto;
          }

          .stream-grid {
            grid-template-columns: repeat(2, 1fr);
          }

          .info-grid {
            grid-template-columns: repeat(2, 1fr);
          }

          .participants-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (max-width: 700px) {
          .navbar {
            padding: 0 15px;
          }

          .brand img {
            width: 85px;
          }

          .socials a:not(.follow-button) {
            display: none;
          }

          .follow-button {
            padding: 9px 10px !important;
          }

          .hero {
            width: 92%;
            margin-top: 35px;
          }

          .hero-logo {
            width: 280px;
          }

          .countdown strong {
            font-size: 22px;
          }

          .countdown span {
            font-size: 7px;
          }

          .main-stream-info {
            flex-wrap: wrap;
          }

          .watch-button {
            width: 100%;
            text-align: center;
            margin-left: 0;
          }

          .dashboard-section {
            width: 92%;
            grid-template-columns: 1fr;
          }

          .live-section {
            width: 100%;
            padding: 15px;
          }

          .dashboard-heading {
            align-items: flex-start;
            flex-direction: column;
          }

          .dashboard-ranking .ranking-header,
          .dashboard-ranking .ranking-row {
            grid-template-columns: 32px 1fr 82px 58px;
          }

          .section-heading {
            align-items: flex-start;
            gap: 15px;
            flex-direction: column;
          }

          .stream-grid,
          .info-grid,
          .participants-grid {
            grid-template-columns: 1fr;
          }

          .content-section {
            width: 92%;
          }

          .ranking-header,
          .ranking-row {
            grid-template-columns: 35px 1fr 90px 65px;
          }

          .ranking-header {
            font-size: 7px;
          }

          .ranking-row {
            padding: 13px 10px;
          }

          .ranking-player {
            font-size: 10px;
          }

          .rank-name,
          .lp {
            font-size: 9px;
          }

          .rule-card {
            padding: 18px;
          }

          .faq-item summary {
            grid-template-columns: 30px 1fr 20px;
            padding: 16px;
          }

          .faq-answer {
            padding: 15px 16px 18px 46px;
          }

          .organizer-card {
            align-items: flex-start;
            flex-direction: column;
          }

          footer {
            flex-direction: column;
            text-align: center;
          }
        }
      `}</style>
    </main>
  );
}

function StreamerCard({ streamer }: { streamer: Streamer }) {
  const tag = streamerLabels[streamer.channel] || "STREAM";

  return (
    <a
      href={streamer.url}
      target="_blank"
      rel="noreferrer"
      className={`stream-card ${streamer.live ? "live" : ""}`}
    >
      <div className="card-preview">
        {streamer.live && streamer.thumbnail ? (
          <img
            src={streamer.thumbnail}
            alt={`Directo de ${streamer.displayName}`}
          />
        ) : (
          <div className="offline-preview">OFFLINE</div>
        )}

        <span className={`status ${streamer.live ? "" : "offline"}`}>
          {streamer.live ? "● EN DIRECTO" : "OFFLINE"}
        </span>
      </div>

      <div className="card-info">
        <div className="card-avatar">
          {streamer.avatar && (
            <img
              src={streamer.avatar}
              alt={streamer.displayName}
            />
          )}
        </div>

        <div>
          <div className="card-name">
            {streamer.displayName}
          </div>

          <div className="card-viewers">
            {streamer.live
              ? `${formatViewers(streamer.viewers)} espectadores`
              : "Offline"}
          </div>
        </div>

        <span className="card-tag">{tag}</span>
      </div>
    </a>
  );
}
