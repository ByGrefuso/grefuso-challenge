 "use client";

import { useEffect, useMemo, useState } from "react";

type Player = {
  name: string;
  riotId: string;
  tagLine: string;
  tier: string | null;
  rank: string | null;
  lp: number | null;
  error?: string | null;
};

const PLAYERS = [
  ["Kiwix", "ENJ#RAGE"],
  ["marccalvo", "Dolan#RCD"],
  ["Fardos31", "Myrwn#0031"],
  ["Yuuki26", "palladinni#EUW"],
  ["Delacasa95", "grakulaq#EUW"],
  ["Bounjimi", "xokas the boss#005"],
  ["OreWaRuo", "Sukehir0 Yami#Zoro"],
  ["cris", "Calm Smurf#EUW"],
  ["Sallanman", "Lo Narisut#1492"],
  ["ByGrefuso", "tinaJJ#6700"],
  ["Kawinho15", "GodzOclock#EUW"],
  ["Al3", "laaw Traafalgar#EUW"],
] as const;

const STREAMS = [
  ["ByGrefuso", "bygrefuso", "STRM"],
  ["Kawinho15", "kawinho15_", "STRM"],
  ["Al3", "euwthe4l3", "STRM"],
  ["Yuuki26", "yuuki26_", "STRM"],
  ["Sallanman", "sallanman", "PRO"],
] as const;

const TIER_VALUE: Record<string, number> = {
  IRON: 1, BRONZE: 2, SILVER: 3, GOLD: 4, PLATINUM: 5,
  EMERALD: 6, DIAMOND: 7, MASTER: 8, GRANDMASTER: 9, CHALLENGER: 10,
};
const DIV_VALUE: Record<string, number> = { IV: 1, III: 2, II: 3, I: 4 };

const RULES = [
  ["01", "LÍMITE DE PARTIDAS", <>Máximo <b>5 partidas de SoloQ al día</b>. Las partidas que superen el límite diario no contarán.<br /><br /><b>ÚLTIMO DÍA — 15 DE SEPTIEMBRE:</b> se podrán jugar todas las partidas que se quieran hasta las 23:59. Las partidas iniciadas antes de las 23:59 podrán terminarse aunque acaben después.</>],
  ["02", "BONUS STREAMERS", <>Los participantes que hagan <b>STREAM</b> podrán jugar <b>7 PARTIDAS AL DÍA</b>: 5 normales + 2 EXTRA. Para utilizar las 2 extra deberán estar retransmitiendo. La organización podrá solicitar pruebas del directo.</>],
  ["03", "SOLOQ OBLIGATORIA", <>El Challenge es exclusivamente <b>SOLOQ</b>.<br /><br />❌ Nada de DuoQ.<br />❌ Nada de recibir ayuda de otros participantes.<br />❌ Nada de coordinar partidas para obtener ventaja.<br /><br />Cada jugador compite individualmente.</>],
  ["04", "CUENTA PERSONAL", <>Cada participante deberá jugar personalmente en su propia cuenta.<br /><br />❌ Compartir cuentas.<br />❌ Que otra persona juegue por ti.<br />❌ Boosting.<br />❌ Comprar servicios para subir.<br />❌ Permitir que otra persona juegue en tu nombre.<br /><br /><b>LA CUENTA ES TUYA. LAS PARTIDAS LAS JUEGAS TÚ.</b></>],
  ["05", "CÓDIGO DE CONDUCTA DE RIOT", <>Todos los participantes deberán respetar las normas de Riot Games y el Código de Conducta de League of Legends.<br /><br />❌ Toxicidad · ❌ Insultos / acoso · ❌ Uso inapropiado del chat · ❌ AFK · ❌ Inting · ❌ Griefing · ❌ Perder deliberadamente.<br /><br /><b>SI RIOT TE Banea POR TU COMPORTAMIENTO: TE JODES.</b><br /><br />La organización no será responsable de una sanción de Riot. No habrá partidas adicionales, compensaciones ni ampliación de tiempo.</>],
  ["06", "REGLA HIGH ELO — DIAMANTE+", <>Los jugadores que comiencen el Challenge en <b>DIAMANTE o superior</b> tendrán una dificultad adicional.<br /><br /><b>POSICIÓN NO MAIN:</b> deberán jugar obligatoriamente en una posición que NO sea su posición principal.<br /><br /><b>OTP PROHIBIDO:</b> no podrán utilizar su OTP o campeón principal.<br /><br /><b>SUPERVISIÓN:</b> la organización podrá revisar historial, posiciones, campeones, rendimiento e intentos de esquivar la norma.</>],
  ["07", "FINAL DEL CHALLENGE", <><b>MARTES 15 DE SEPTIEMBRE — 23:59.</b><br /><br />A esta hora finalizará oficialmente el Grefuso Challenge. El ganador será el jugador que termine en primera posición según el sistema de puntuación establecido.<br /><br /><b>SOLO UNO SERÁ CAMPEÓN.</b></>],
  ["08", "ORGANIZACIÓN", <>La organización podrá revisar partidas, comprobar streams, revisar estadísticas, investigar infracciones, anular partidas, aplicar sanciones y resolver situaciones no contempladas.<br /><br />En cualquier situación no prevista, la decisión final corresponderá a la organización.</>],
] as const;

const FAQ = [
  ["¿CUÁNTAS PARTIDAS PUEDO JUGAR AL DÍA?", "Máximo 5 partidas de SoloQ al día. Si estás haciendo stream, puedes jugar 2 partidas EXTRA y llegar a 7."],
  ["¿LAS PARTIDAS SON ACUMULABLES?", "SÍ. Las partidas que no juegues se acumulan. Por ejemplo, si hoy juegas solo 1 partida, mañana podrás jugar 9: las 4 que te faltaban + las 5 del nuevo día."],
  ["¿LAS PARTIDAS EXTRA DE STREAM TAMBIÉN SE ACUMULAN?", "SÍ. Las partidas disponibles que no hayas utilizado se pueden acumular según las condiciones del Challenge. Las 2 extra requieren estar retransmitiendo para utilizarlas."],
  ["¿PUEDO JUGAR DUOQ?", "NO. El Challenge es exclusivamente SoloQ."],
  ["¿QUÉ CUENTA PARA LA CLASIFICACIÓN?", "Únicamente el rango de SoloQ y los LP actuales. Los datos se obtienen mediante la Riot API."],
  ["¿CUENTAN LAS VICTORIAS Y DERROTAS POR SEPARADO?", "No. La clasificación utiliza rango y LP."],
  ["¿QUÉ SIGNIFICA UNRANKED?", "Significa que Riot no devuelve una clasificación de SoloQ para esa cuenta."],
  ["¿QUÉ SIGNIFICA ERROR API?", "Es un problema al consultar Riot. No significa que el jugador esté sin rango."],
  ["¿QUÉ PASA SI ME BANEAN?", "La cuenta y el comportamiento del jugador son responsabilidad del participante. Una sanción de Riot no da derecho a partidas adicionales, compensaciones ni ampliación de tiempo."],
  ["¿CUÁNDO TERMINA?", "El martes 15 de septiembre a las 23:59. Las partidas iniciadas antes de esa hora podrán terminarse."],
  ["¿QUIÉN ES EL ORGANIZADOR?", "BYGREFUSO."],
] as const;

function opggUrl(p: Player) {
  return `https://op.gg/lol/summoners/euw/${encodeURIComponent(p.riotId)}-${encodeURIComponent(p.tagLine)}`;
}

function rankLabel(p: Player) {
  if (p.error) return "ERROR API";
  if (!p.tier) return "UNRANKED";
  return `${p.tier}${p.rank ? ` ${p.rank}` : ""}`;
}

export default function Page() {
  const [ranking, setRanking] = useState<Player[]>([]);
  const [apiError, setApiError] = useState(false);
  const [updated, setUpdated] = useState("");

  useEffect(() => {
    let active = true;

    const load = async () => {
      try {
        const response = await fetch("/api/riot", { cache: "no-store" });
        const data = await response.json();
        if (!active) return;
        if (!response.ok || !Array.isArray(data.players)) {
          setApiError(true);
          return;
        }
        setRanking(data.players);
        setApiError(false);
        setUpdated(new Date().toLocaleTimeString("es-ES", { hour: "2-digit", minute: "2-digit" }));
      } catch {
        if (active) setApiError(true);
      }
    };

    load();
    const interval = setInterval(load, 60_000);
    return () => {
      active = false;
      clearInterval(interval);
    };
  }, []);

  const ordered = useMemo(() => {
    return [...ranking]
      .sort((a, b) => {
        const tier = (TIER_VALUE[b.tier || ""] || 0) - (TIER_VALUE[a.tier || ""] || 0);
        if (tier) return tier;
        const div = (DIV_VALUE[b.rank || ""] || 0) - (DIV_VALUE[a.rank || ""] || 0);
        if (div) return div;
        return (b.lp ?? -1) - (a.lp ?? -1);
      })
      .map((p, i) => ({ ...p, position: i + 1 }));
  }, [ranking]);

  return (
    <>
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&display=swap');
        *{box-sizing:border-box}
        html{scroll-behavior:smooth}
        body{margin:0;background:#070707;color:#fff;font-family:'Space Grotesk',sans-serif;text-transform:uppercase}
        a{color:inherit;text-decoration:none}
        .page{min-height:100vh;background:radial-gradient(circle at 50% -5%,rgba(255,79,163,.14),transparent 34%)}
        .container{width:min(1180px,calc(100% - 32px));margin:auto}
        .pink{color:#ff4fa3}
        header{position:sticky;top:0;z-index:20;background:rgba(7,7,7,.9);backdrop-filter:blur(16px);border-bottom:1px solid #252525}
        .nav{height:72px;display:flex;align-items:center;justify-content:space-between}
        .logo{font-weight:700;font-size:18px;letter-spacing:-.05em}.logo span{color:#ff4fa3}
        nav{display:flex;gap:18px;font-size:10px;font-weight:700;color:#999}nav a:hover{color:#ff4fa3}
        .hero{padding:125px 0 105px;border-bottom:1px solid #242424}
        .eyebrow{color:#ff4fa3;font-size:10px;font-weight:700;letter-spacing:.18em}
        h1{font-size:clamp(60px,10vw,135px);line-height:.82;letter-spacing:-.08em;margin:20px 0}
        h2{font-size:clamp(38px,5vw,68px);line-height:.9;letter-spacing:-.07em;margin:0}
        .hero p,.intro{color:#8e8e8e;line-height:1.7;text-transform:none}
        .hero p{max-width:680px;font-size:15px}
        .buttons{display:flex;gap:10px;margin-top:30px;flex-wrap:wrap}
        .btn{padding:15px 20px;border:1px solid #333;font-size:10px;font-weight:700}.btn.primary{background:#ff4fa3;color:#070707;border-color:#ff4fa3}
        section{padding:82px 0;border-bottom:1px solid #242424}
        .head{display:grid;grid-template-columns:60px 1fr;gap:18px;margin-bottom:34px}.number{color:#ff4fa3;font-size:11px;font-weight:700}
        .intro{font-size:12px;margin:10px 0 0}
        .cards{display:grid;grid-template-columns:repeat(3,1fr);gap:10px}
        .card{background:#0d0d0d;border:1px solid #292929;padding:22px;min-height:170px;transition:.2s}.card:hover{border-color:#ff4fa3;transform:translateY(-2px)}
        .top{display:flex;justify-content:space-between}.muted{color:#555;font-size:10px}.tag{border:1px solid #ff4fa3;color:#ff4fa3;font-size:9px;font-weight:700;padding:4px 7px}
        .card h3{font-size:20px;letter-spacing:-.04em;margin:38px 0 8px}.card p{color:#888;font-size:12px;line-height:1.6;margin:0;text-transform:none}
        .ranking{border:1px solid #292929;overflow:hidden}
        .row{display:grid;grid-template-columns:55px 1.7fr 1fr 100px;gap:12px;align-items:center;padding:17px 18px;background:#0d0d0d;border-bottom:1px solid #222}
        .row:last-child{border-bottom:0}.row.header{background:#151515;color:#666;font-size:9px;font-weight:700}
        .position{color:#ff4fa3;font-weight:700}.player{font-weight:700}.riotid{font-size:9px;color:#666;text-transform:none;margin-top:3px}.tier{font-size:12px;font-weight:600}.lp{text-align:right;font-size:12px;font-weight:700}.empty{text-align:center;color:#777;padding:30px;font-size:10px}
        .rules{display:grid;gap:9px}.rule{display:grid;grid-template-columns:55px 1fr;gap:18px;background:#0d0d0d;border:1px solid #292929;padding:24px}.rule-num{color:#ff4fa3;font-weight:700}.rule h3{margin:0 0 12px;font-size:19px}.rule p{margin:0;color:#999;font-size:12px;line-height:1.7;text-transform:none}
        .faq{display:grid;gap:8px}details{background:#0d0d0d;border:1px solid #292929;padding:19px 20px}summary{cursor:pointer;font-size:12px;font-weight:700;list-style:none}summary::-webkit-details-marker{display:none}details p{color:#999;font-size:12px;line-height:1.7;text-transform:none;margin:14px 0 0}
        .streams{display:grid;grid-template-columns:repeat(5,1fr);gap:10px}.stream{background:#0d0d0d;border:1px solid #292929;padding:20px;transition:.2s}.stream:hover{border-color:#ff4fa3;transform:translateY(-2px)}.stream-name{font-size:18px;font-weight:700;margin:22px 0 6px}.stream-url{font-size:9px;color:#777;text-transform:none}.watch{margin-top:18px;color:#ff4fa3;font-size:9px;font-weight:700}
        .opgg{font-size:9px;color:#777;margin-top:7px}.row:hover .opgg{color:#ff4fa3}
        footer{padding:50px 0}.footer{display:flex;justify-content:space-between;gap:20px;flex-wrap:wrap}.footer-title{font-size:25px;font-weight:700}.social{display:flex;gap:18px;color:#888;font-size:9px}.copy{color:#555;font-size:9px;margin-top:25px}
        @media(max-width:850px){nav{display:none}.cards{grid-template-columns:1fr 1fr}.streams{grid-template-columns:1fr 1fr}.row{grid-template-columns:40px 1fr 95px 75px}}
        @media(max-width:600px){.container{width:calc(100% - 24px)}.hero{padding:85px 0 75px}.cards,.streams{grid-template-columns:1fr}.head{grid-template-columns:40px 1fr}.row{grid-template-columns:35px 1fr 90px}.row .lp,.row.header .lp{display:none}.rule{grid-template-columns:38px 1fr}}
      `}</style>

      <div className="page">
        <header><div className="container nav">
          <a href="#inicio" className="logo">GREFUSO <span>CHALLENGE</span></a>
          <nav><a href="#organizador">BYGREFUSO</a><a href="#clasificacion">CLASIFICACIÓN</a><a href="#participantes">PARTICIPANTES</a><a href="#streams">STREAMS</a><a href="#reglamento">REGLAMENTO</a><a href="#faq">FAQ</a></nav>
        </div></header>

        <main>
          <section id="inicio" className="hero"><div className="container">
            <div className="eyebrow">BYGREFUSO PRESENTA · 2026</div>
            <h1>GREFUSO<br/><span className="pink">CHALLENGE</span></h1>
            <p>EL RETO DE SOLOQ DONDE CADA PARTIDA CUENTA. COMPITE, SUBE LP Y LUCHA POR TERMINAR EN LO MÁS ALTO DE LA CLASIFICACIÓN.</p>
            <div className="buttons"><a className="btn primary" href="#clasificacion">VER CLASIFICACIÓN</a><a className="btn" href="#reglamento">VER REGLAMENTO</a></div>
          </div></section>

          <section id="organizador"><div className="container"><div className="head"><span className="number">01</span><div><h2>BYGREFUSO</h2><p className="intro">ORGANIZADOR DEL GREFUSO CHALLENGE 2026. SIGUE TODO EL EVENTO EN MIS REDES.</p></div></div>
            <div className="cards">
              <a className="card" href="https://www.twitch.tv/bygrefuso" target="_blank" rel="noreferrer"><span className="tag">TWITCH</span><h3>BYGREFUSO</h3><p>DIRECTOS Y COBERTURA DEL CHALLENGE.</p></a>
              <a className="card" href="https://www.youtube.com/@LoJord1" target="_blank" rel="noreferrer"><span className="tag">YOUTUBE</span><h3>LOJORD1</h3><p>CONTENIDO Y RESÚMENES DEL EVENTO.</p></a>
              <a className="card" href="https://www.instagram.com/_jordilarosa_/" target="_blank" rel="noreferrer"><span className="tag">INSTAGRAM</span><h3>_JORDILAROSA_</h3><p>ACTUALIZACIONES DEL GREFUSO CHALLENGE.</p></a>
            </div>
          </div></section>

          <section id="clasificacion"><div className="container"><div className="head"><span className="number">02</span><div><h2>CLASIFICACIÓN</h2><p className="intro">SOLO CUENTAN RANGO + LP DE SOLOQ. HAZ CLIC EN UN JUGADOR PARA VER SU PERFIL EN OP.GG.</p></div></div>
            <div className="ranking">
              <div className="row header"><span>#</span><span>JUGADOR</span><span>RANGO</span><span className="lp">LP</span></div>
              {apiError ? <div className="empty">ERROR API — NO SE HA PODIDO CARGAR LA CLASIFICACIÓN.</div> : ordered.length === 0 ? <div className="empty">CARGANDO CLASIFICACIÓN...</div> : ordered.map(p => (
                <a className="row" href={opggUrl(p)} target="_blank" rel="noreferrer" key={p.name}>
                  <span className="position">#{p.position}</span>
                  <div><div className="player">{p.name}</div><div className="riotid">{p.riotId}#{p.tagLine}</div><div className="opgg">VER OP.GG ↗</div></div>
                  <span className="tier">{rankLabel(p)}</span>
                  <span className="lp">{p.lp == null ? "—" : `${p.lp} LP`}</span>
                </a>
              ))}
            </div>
            <p className="intro">{updated ? `ÚLTIMA ACTUALIZACIÓN: ${updated}` : "ACTUALIZACIÓN AUTOMÁTICA CADA 60 SEGUNDOS."}</p>
          </div></section>

          <section id="participantes"><div className="container"><div className="head"><span className="number">03</span><div><h2>PARTICIPANTES</h2><p className="intro">LOS 12 JUGADORES DEL GREFUSO CHALLENGE 2026.</p></div></div>
            <div className="cards">{PLAYERS.map(([name, riot], i) => {
              const tag = name === "Sallanman" ? "PRO" : ["ByGrefuso","Kawinho15","Al3","Yuuki26"].includes(name) ? "STRM" : "PARTICIPANTE";
              return <div className="card" key={riot}><div className="top"><span className="muted">{String(i+1).padStart(2,"0")}</span><span className="tag">{tag}</span></div><h3>{name}</h3><p>{riot}</p></div>;
            })}</div>
          </div></section>

          <section id="streams"><div className="container"><div className="head"><span className="number">04</span><div><h2>STREAMS</h2><p className="intro">CANALES DE LOS PARTICIPANTES Y DEL ORGANIZADOR.</p></div></div>
            <div className="streams">{STREAMS.map(([name, channel, tag]) => <a className="stream" href={`https://www.twitch.tv/${channel}`} target="_blank" rel="noreferrer" key={channel}><span className="tag">{tag}</span><div className="stream-name">{name}</div><div className="stream-url">TWITCH.TV/{channel}</div><div className="watch">● VER CANAL ↗</div></a>)}</div>
          </div></section>

          <section><div className="container"><div className="head"><span className="number">05</span><div><h2>CÓMO FUNCIONA</h2><p className="intro">LAS CLAVES DEL CHALLENGE.</p></div></div>
            <div className="cards">
              <div className="card"><span className="muted">01</span><h3>5 PARTIDAS</h3><p>MÁXIMO DE 5 PARTIDAS NORMALES AL DÍA.</p></div>
              <div className="card"><span className="muted">02</span><h3>+2 EXTRA</h3><p>LOS STREAMERS PUEDEN JUGAR 2 PARTIDAS EXTRA ESTANDO EN DIRECTO.</p></div>
              <div className="card"><span className="muted">03</span><h3>ACUMULABLES</h3><p>SI NO JUEGAS TUS PARTIDAS, SE ACUMULAN PARA EL DÍA SIGUIENTE.</p></div>
              <div className="card"><span className="muted">04</span><h3>SOLOQ</h3><p>NO HAY DUOQ NI AYUDAS ENTRE PARTICIPANTES.</p></div>
              <div className="card"><span className="muted">05</span><h3>RANGO + LP</h3><p>ES LO ÚNICO QUE CUENTA PARA LA CLASIFICACIÓN.</p></div>
              <div className="card"><span className="muted">06</span><h3>15 SEPTIEMBRE</h3><p>EL CHALLENGE TERMINA A LAS 23:59.</p></div>
            </div>
          </div></section>

          <section id="reglamento"><div className="container"><div className="head"><span className="number">06</span><div><h2>REGLAMENTO</h2><p className="intro">REGLAMENTO OFICIAL DEL GREFUSO CHALLENGE 2026.</p></div></div>
            <div className="rules">{RULES.map(([n,t,b]) => <article className="rule" key={n}><div className="rule-num">{n}</div><div><h3>{t}</h3><p>{b}</p></div></article>)}</div>
          </div></section>

          <section id="faq"><div className="container"><div className="head"><span className="number">07</span><div><h2>FAQ</h2><p className="intro">LAS PREGUNTAS MÁS FRECUENTES.</p></div></div>
            <div className="faq">{FAQ.map(([q,a]) => <details key={q}><summary>{q}</summary><p>{a}</p></details>)}</div>
          </div></section>
        </main>

        <footer><div className="container"><div className="footer">
          <div><div className="footer-title">GREFUSO <span className="pink">CHALLENGE</span></div><div className="copy">ORGANIZADO POR BYGREFUSO · 2026</div></div>
          <div className="social"><a href="https://www.twitch.tv/bygrefuso">TWITCH</a><a href="https://www.youtube.com/@LoJord1">YOUTUBE</a><a href="https://www.tiktok.com/@lojordi_ndeu">TIKTOK</a><a href="https://www.instagram.com/_jordilarosa_/">INSTAGRAM</a></div>
        </div></div></footer>
      </div>
    </>
  );
}
