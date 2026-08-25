"use client";

import { useEffect, useMemo, useState } from "react";

type Streamer = {
  channel: string;
  displayName: string;
  avatar: string;
  live: boolean;
  title: string;
  game: string;
  viewers: number;
  thumbnail: string;
  startedAt: string | null;
  url: string;
};

type RankingPlayer = {
  position: number;
  name: string;
  riotId: string;
  tagLine: string;
  tier: string | null;
  rank: string | null;
  lp: number | null;
  error: string | null;
};

const STREAMER_ORDER = [
  "bygrefuso",
  "crisblade04",
  "nerea3005_",
  "sallanman_cat",
  "orewarulo",
  "fardos_31",
  "delakelly",
  "euwthe4l3",
  "kawinho15_",
];

const streamerLabels: Record<string, "STREAM" | "PRO"> = {
  bygrefuso: "STREAM",
  crisblade04: "STREAM",
  nerea3005_: "STREAM",
  sallanman_cat: "PRO",
  orewarulo: "STREAM",
  fardos_31: "STREAM",
  delakelly: "STREAM",
  euwthe4l3: "STREAM",
  kawinho15_: "STREAM",
};

function formatViewers(viewers: number) {
  return new Intl.NumberFormat("es-ES").format(viewers);
}

function getCountdown() {
  const target = new Date("2026-08-28T20:00:00+02:00").getTime();
  const now = Date.now();
  const difference = Math.max(0, target - now);

  const days = Math.floor(difference / 86400000);
  const hours = Math.floor((difference / 3600000) % 24);
  const minutes = Math.floor((difference / 60000) % 60);
  const seconds = Math.floor((difference / 1000) % 60);

  return { days, hours, minutes, seconds };
}

export default function Home() {
  const [streamers, setStreamers] = useState<Streamer[]>([]);
  const [loadingStreams, setLoadingStreams] = useState(true);
  const [countdown, setCountdown] = useState(getCountdown());
  const [ranking, setRanking] = useState<RankingPlayer[]>([]);
  const [loadingRanking, setLoadingRanking] = useState(true);

  async function loadRanking() {
    try {
      const response = await fetch("/api/riot", { cache: "no-store" });
      const data = await response.json();
      if (data.success && Array.isArray(data.players)) {
        setRanking(data.players);
      }
    } catch (error) {
      console.error("Error cargando clasificación:", error);
    } finally {
      setLoadingRanking(false);
    }
  }

  useEffect(() => {
    loadRanking();
    const interval = setInterval(loadRanking, 60000);
    return () => clearInterval(interval);
  }, []);

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
        const ordered = [...data.streams].sort(
          (a: Streamer, b: Streamer) =>
            STREAMER_ORDER.indexOf(a.channel) -
            STREAMER_ORDER.indexOf(b.channel)
        );

        setStreamers(ordered);
      }
    } catch (error) {
      console.error("Error cargando Twitch:", error);
    } finally {
      setLoadingStreams(false);
    }
  }

  useEffect(() => {
    loadStreams();

    const interval = setInterval(loadStreams, 60000);

    return () => clearInterval(interval);
  }, []);

  const mainStreamer = useMemo(() => {
    const bygrefuso = streamers.find(
      (streamer) => streamer.channel === "bygrefuso"
    );

    if (bygrefuso?.live) {
      return bygrefuso;
    }

    return streamers.find((streamer) => streamer.live) || bygrefuso || null;
  }, [streamers]);

  const liveStreamers = streamers.filter((streamer) => streamer.live);

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
            href="https://www.instagram.com/"
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

          <p className="eyebrow">SOLOQ CHALLENGE DE LEAGUE OF LEGENDS</p>

          <div className="date-box">
            DEL 28 DE AGOSTO AL 15 DE SEPTIEMBRE
          </div>

          <div className="countdown-title">EL CHALLENGE COMIENZA EN</div>

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
            ● VIERNES 28 DE AGOSTO A LAS 20:00
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
                src={`https://player.twitch.tv/?channel=${mainStreamer.channel}&parent=grefuso-challenge.vercel.app&muted=true`}
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
                    {streamerLabels[mainStreamer.channel] || "STREAM"}
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

          <a
            href="https://www.twitch.tv/bygrefuso"
            target="_blank"
            rel="noreferrer"
            className="all-streams"
          >
            VER TODOS LOS CANALES →
          </a>
        </div>

        <div className="stream-grid">
          {loadingStreams ? (
            <div className="loading">
              Cargando directos...
            </div>
          ) : (
            streamers.map((streamer) => (
              <StreamerCard
                key={streamer.channel}
                streamer={streamer}
              />
            ))
          )}
        </div>
      </section>

      <section id="torneo" className="simple-section">
        <span className="section-number">01</span>
        <div>
          <h2>EL TORNEO</h2>
          <p>
            El Grefuso Challenge enfrenta a participantes de League of Legends
            durante el periodo del challenge.
          </p>
        </div>
      </section>

      <section id="participantes" className="simple-section">
        <span className="section-number">02</span>
        <div>
          <h2>PARTICIPANTES</h2>
          <p>
            Sigue a todos los participantes y descubre quién está compitiendo.
          </p>
        </div>
      </section>

      <section id="clasificacion" className="ranking-section">
        <div className="ranking-heading">
          <div>
            <span className="section-number">03</span>
            <h2>CLASIFICACIÓN</h2>
            <p>RANGO + LP DE SOLOQ · ACTUALIZACIÓN AUTOMÁTICA</p>
          </div>
          <span className="riot-badge">RIOT GAMES</span>
        </div>

        <div className="ranking-table">
          <div className="ranking-row ranking-header">
            <span>#</span><span>JUGADOR</span><span>RANGO</span><span>LP</span>
          </div>
          {loadingRanking ? (
            <div className="ranking-loading">Cargando clasificación...</div>
          ) : ranking.length === 0 ? (
            <div className="ranking-loading">No se ha podido cargar la clasificación.</div>
          ) : (
            ranking.map((player) => (
              <div className="ranking-row" key={player.name}>
                <span className="position">{player.position}</span>
                <span className="player-name">{player.name}</span>
                <span className="player-rank">
                  {player.tier ? `${player.tier} ${player.rank || ""}` : "SIN RANGO"}
                </span>
                <span className="player-lp">{player.lp ?? "—"} LP</span>
              </div>
            ))
          )}
        </div>
      </section>

      <section id="faq" className="simple-section">
        <span className="section-number">04</span>
        <div>
          <h2>FAQ</h2>
          <p>
            Información y preguntas frecuentes del Grefuso Challenge.
          </p>
        </div>
      </section>

      <footer>
        <img src="/logo.png" alt="Grefuso Challenge" />
        <span>GREFUSO CHALLENGE © 2026</span>
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
            radial-gradient(
              circle at 85% 15%,
              rgba(255, 0, 119, 0.12),
              transparent 32%
            ),
            #050505;
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
          gap: 38px;
          height: 100%;
          align-items: center;
        }

        nav a {
          font-size: 13px;
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
          margin: 70px auto 45px;
          display: grid;
          grid-template-columns: 0.8fr 1.2fr;
          gap: 45px;
          align-items: center;
        }

        .hero-logo {
          width: min(100%, 480px);
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

        .live-section {
          width: 94%;
          max-width: 1500px;
          margin: 0 auto 70px;
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

        .loading {
          grid-column: 1 / -1;
          padding: 40px;
          text-align: center;
          color: #777;
        }

        .ranking-section {
          width: 94%;
          max-width: 1200px;
          margin: 0 auto 30px;
          padding: 35px;
          border: 1px solid rgba(255, 0, 119, 0.35);
          border-radius: 12px;
          background: rgba(8, 8, 10, 0.85);
        }

        .ranking-heading {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 20px;
          margin-bottom: 22px;
        }

        .ranking-heading h2 {
          margin: 5px 0 6px;
          font-size: 24px;
        }

        .ranking-heading p {
          margin: 0;
          color: #777;
          font-size: 10px;
          font-weight: 900;
          letter-spacing: 1px;
        }

        .riot-badge {
          border: 1px solid #292929;
          border-radius: 5px;
          padding: 9px 12px;
          color: #777;
          font-size: 9px;
          font-weight: 900;
        }

        .ranking-table {
          border: 1px solid #252529;
          border-radius: 8px;
          overflow: hidden;
        }

        .ranking-row {
          min-height: 58px;
          display: grid;
          grid-template-columns: 60px 1fr 180px 100px;
          align-items: center;
          gap: 15px;
          padding: 0 20px;
          border-bottom: 1px solid #202024;
          background: #09090b;
        }

        .ranking-row:last-child {
          border-bottom: 0;
        }

        .ranking-header {
          min-height: 42px;
          background: #111114;
          color: #666;
          font-size: 9px;
          font-weight: 900;
          letter-spacing: 1px;
        }

        .position {
          color: #ff0a83;
          font-weight: 1000;
        }

        .player-name {
          font-weight: 900;
        }

        .player-rank {
          color: #ddd;
          font-size: 11px;
          font-weight: 800;
        }

        .player-lp {
          color: #ff0a83;
          font-size: 12px;
          font-weight: 1000;
          text-align: right;
        }

        .ranking-loading {
          padding: 35px;
          text-align: center;
          color: #777;
          font-size: 11px;
        }

        .simple-section {
          width: 94%;
          max-width: 1200px;
          margin: 0 auto 20px;
          padding: 40px;
          display: flex;
          gap: 25px;
          border-top: 1px solid #202024;
        }

        .section-number {
          color: #ff0a83;
          font-size: 13px;
          font-weight: 900;
        }

        .simple-section h2 {
          margin: 0 0 10px;
        }

        .simple-section p {
          color: #777;
          margin: 0;
          max-width: 700px;
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

        @media (max-width: 1000px) {
          nav {
            display: none;
          }

          .hero {
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
        }

        @media (max-width: 600px) {
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

          .live-section {
            width: 92%;
            padding: 15px;
          }

          .section-heading {
            align-items: flex-start;
            gap: 15px;
            flex-direction: column;
          }

          .stream-grid {
            grid-template-columns: 1fr;
          }

          .ranking-section {
            width: 92%;
            padding: 22px 12px;
          }

          .ranking-heading {
            align-items: flex-start;
            flex-direction: column;
          }

          .ranking-row {
            grid-template-columns: 35px 1fr 90px;
            gap: 8px;
            padding: 0 10px;
          }

          .ranking-row .player-lp {
            display: none;
          }

          .simple-section {
            width: 92%;
            padding: 25px 10px;
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
            <img src={streamer.avatar} alt={streamer.displayName} />
          )}
        </div>

        <div>
          <div className="card-name">{streamer.displayName}</div>

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
