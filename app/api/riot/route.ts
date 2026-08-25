import { NextResponse } from "next/server";

const RIOT_API_KEY = process.env.RIOT_API_KEY;

const players = [
  { name: "Kiwix", riotId: "ENJ", tagLine: "RAGE" },
  { name: "marccalvo", riotId: "Dolan", tagLine: "RCD" },
  { name: "Fardos31", riotId: "Myrwn", tagLine: "0031" },
  { name: "Yuki26", riotId: "palladinni", tagLine: "EUW" },
  { name: "Delacasa95", riotId: "grakulaq", tagLine: "EUW" },
  { name: "Bounjimi", riotId: "xokas the boss", tagLine: "005" },
  { name: "OreWaRuo", riotId: "Sukehir0 Yami", tagLine: "Zoro" },
  { name: "cris", riotId: "Calm Smurf", tagLine: "EUW" },
  { name: "sallanman", riotId: "Lo Narisut", tagLine: "1492" },
  { name: "ByGrefuso", riotId: "tinaJJ", tagLine: "6700" },
  { name: "Kawinho15", riotId: "GodzOclock", tagLine: "EUW" },
  { name: "Al3", riotId: "laaw Traafalgar", tagLine: "EUW" },
];

const rankOrder: Record<string, number> = {
  IRON: 1,
  BRONZE: 2,
  SILVER: 3,
  GOLD: 4,
  PLATINUM: 5,
  EMERALD: 6,
  DIAMOND: 7,
  MASTER: 8,
  GRANDMASTER: 9,
  CHALLENGER: 10,
};

const tierOrder: Record<string, number> = {
  IV: 1,
  III: 2,
  II: 3,
  I: 4,
};

export async function GET() {
  if (!RIOT_API_KEY) {
    return NextResponse.json(
      {
        error: "Falta configurar RIOT_API_KEY en las variables de entorno.",
      },
      { status: 500 }
    );
  }

  const results = await Promise.all(
    players.map(async (player) => {
      try {
        // 1. Riot ID -> PUUID
        const accountUrl =
          `https://europe.api.riotgames.com/riot/account/v1/accounts/by-riot-id/` +
          `${encodeURIComponent(player.riotId)}/${encodeURIComponent(player.tagLine)}`;

        const accountResponse = await fetch(accountUrl, {
          headers: {
            "X-Riot-Token": RIOT_API_KEY,
          },
          cache: "no-store",
        });

        if (!accountResponse.ok) {
          return {
            ...player,
            tier: null,
            rank: null,
            lp: null,
            error: `Riot ID no encontrado (${accountResponse.status})`,
          };
        }

        const account = await accountResponse.json();

        // 2. PUUID -> ranked SoloQ
        const rankedUrl =
          `https://euw1.api.riotgames.com/lol/league/v4/entries/by-puuid/` +
          account.puuid;

        const rankedResponse = await fetch(rankedUrl, {
          headers: {
            "X-Riot-Token": RIOT_API_KEY,
          },
          cache: "no-store",
        });

        if (!rankedResponse.ok) {
          return {
            ...player,
            tier: null,
            rank: null,
            lp: null,
            error: `No se pudo obtener ranked (${rankedResponse.status})`,
          };
        }

        const rankedData = await rankedResponse.json();

        // Solo SoloQ
        const soloQ = rankedData.find(
          (queue: any) => queue.queueType === "RANKED_SOLO_5x5"
        );

        if (!soloQ) {
          return {
            ...player,
            tier: "UNRANKED",
            rank: "",
            lp: 0,
            wins: 0,
            losses: 0,
            error: null,
          };
        }

        return {
          ...player,
          tier: soloQ.tier,
          rank: soloQ.rank,
          lp: soloQ.leaguePoints,
          wins: soloQ.wins,
          losses: soloQ.losses,
          error: null,
        };
      } catch (error) {
        return {
          ...player,
          tier: null,
          rank: null,
          lp: null,
          error: "Error consultando Riot API",
        };
      }
    })
  );

  // Orden de clasificación:
  // Rango > División > LP
  results.sort((a, b) => {
    const aRank = a.tier ? rankOrder[a.tier] || 0 : 0;
    const bRank = b.tier ? rankOrder[b.tier] || 0 : 0;

    if (bRank !== aRank) {
      return bRank - aRank;
    }

    const aDivision = a.rank ? tierOrder[a.rank] || 0 : 0;
    const bDivision = b.rank ? tierOrder[b.rank] || 0 : 0;

    if (bDivision !== aDivision) {
      return bDivision - aDivision;
    }

    return (b.lp || 0) - (a.lp || 0);
  });

  // Añadimos posición
  const classification = results.map((player, index) => ({
    position: index + 1,
    ...player,
  }));

  return NextResponse.json({
    success: true,
    updatedAt: new Date().toISOString(),
    players: classification,
  });
}
