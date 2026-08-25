import { NextResponse } from "next/server";

const PARTICIPANTS = [
  { name: "Kiwix", riotId: "ENJ#RAGE" },
  { name: "marccalvo", riotId: "Dolan#RCD" },
  { name: "Fardos31", riotId: "Myrwn#0031" },
  { name: "Yuuki26", riotId: "palladinni#EUW" },
  { name: "Delacasa95", riotId: "grakulaq#EUW" },
  { name: "Bounjimi", riotId: "xokas the boss#005" },
  { name: "OreWaRuo", riotId: "Sukehir0 Yami#Zoro" },
  { name: "cris", riotId: "Calm Smurf#EUW" },
  { name: "Sallanman", riotId: "Lo Narisut#1492" },
  { name: "ByGrefuso", riotId: "tinaJJ#6700" },
  { name: "Kawinho15", riotId: "GodzOclock#EUW" },
  { name: "Al3", riotId: "laaw Traafalgar#EUW" },
] as const;

const ACCOUNT_REGION = "europe";
const PLATFORM = "euw1";

function riotHeaders() {
  const key = process.env.RIOT_API_KEY;
  if (!key) throw new Error("Falta RIOT_API_KEY en .env.local");
  return { "X-Riot-Token": key };
}

async function riotFetch(url: string) {
  const response = await fetch(url, {
    headers: riotHeaders(),
    cache: "no-store",
  });
  if (!response.ok) throw new Error(`Riot ${response.status}`);
  return response.json();
}

export async function GET() {
  try {
    const results = await Promise.all(
      PARTICIPANTS.map(async (participant) => {
        const [gameName, tagLine] = participant.riotId.split("#");

        try {
          const account = await riotFetch(
            `https://${ACCOUNT_REGION}.api.riotgames.com/riot/account/v1/accounts/by-riot-id/${encodeURIComponent(gameName)}/${encodeURIComponent(tagLine)}`
          );

          const summoner = await riotFetch(
            `https://${PLATFORM}.api.riotgames.com/lol/summoner/v4/summoners/by-puuid/${encodeURIComponent(account.puuid)}`
          );

          const entries = await riotFetch(
            `https://${PLATFORM}.api.riotgames.com/lol/league/v4/entries/by-summoner/${encodeURIComponent(summoner.id)}`
          );

          const soloQ = Array.isArray(entries)
            ? entries.find((entry: any) => entry.queueType === "RANKED_SOLO_5x5")
            : null;

          if (!soloQ) {
            return {
              name: participant.name,
              riotId: participant.riotId,
              tier: "UNRANKED",
              rank: "",
              lp: 0,
              wins: 0,
              losses: 0,
              icon: summoner.profileIconId
                ? `https://ddragon.leagueoflegends.com/cdn/15.17.1/img/profileicon/${summoner.profileIconId}.png`
                : undefined,
            };
          }

          return {
            name: participant.name,
            riotId: participant.riotId,
            tier: String(soloQ.tier || "UNRANKED"),
            rank: String(soloQ.rank || ""),
            lp: Number(soloQ.leaguePoints || 0),
            wins: Number(soloQ.wins || 0),
            losses: Number(soloQ.losses || 0),
            icon: summoner.profileIconId
              ? `https://ddragon.leagueoflegends.com/cdn/15.17.1/img/profileicon/${summoner.profileIconId}.png`
              : undefined,
          };
        } catch (error) {
          console.error(`Error Riot ${participant.riotId}:`, error);
          return {
            name: participant.name,
            riotId: participant.riotId,
            tier: "UNRANKED",
            rank: "",
            lp: 0,
            wins: 0,
            losses: 0,
          };
        }
      })
    );

    return NextResponse.json({ success: true, players: results });
  } catch (error) {
    console.error("Riot API error:", error);
    return NextResponse.json(
      { success: false, players: [], error: "No se pudo consultar Riot API" },
      { status: 500 }
    );
  }
}
