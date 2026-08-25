import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const PARTICIPANTS = [
  { name: "KIWIX", riotId: "Nissaxter ENJ#RAGE" },
  { name: "MARCCALVO", riotId: "Tyrhys Dolan#RCD" },
  { name: "FARDOS31", riotId: "Myrwn#0031" },
  { name: "YUKI26", riotId: "palladinni#EUW" },
  { name: "DELACASA95", riotId: "grakulaq#EUW" },
  { name: "BOUNJIMI", riotId: "xokas the boss #005" },
  { name: "OREWARUO", riotId: "Sukehir0 Yami#Zoro" },
  { name: "CRIS", riotId: "Calm Smurf#EUW" },
  { name: "SALLANMAN", riotId: "Lo Narisut#1492" },
  { name: "BYGREFUSO", riotId: "tinaJJ#6700" },
  { name: "KAWINHO15", riotId: "GodzOclock#EUW" },
  { name: "AL3", riotId: "laaw Traafalgar#EUW" },
] as const;

function splitRiotId(riotId: string) {
  const index = riotId.lastIndexOf("#");
  if (index === -1) return { gameName: riotId, tagLine: "" };
  return {
    gameName: riotId.slice(0, index),
    tagLine: riotId.slice(index + 1),
  };
}

export async function GET() {
  const apiKey = process.env.RIOT_API_KEY;

  if (!apiKey) {
    return NextResponse.json(
      { success: false, error: "Falta RIOT_API_KEY en .env.local", players: [] },
      { status: 500 }
    );
  }

  const players = await Promise.all(
    PARTICIPANTS.map(async (participant) => {
      try {
        const { gameName, tagLine } = splitRiotId(participant.riotId);

        // Riot Account-v1: EUW routing for EUW accounts.
        const accountResponse = await fetch(
          `https://europe.api.riotgames.com/riot/account/v1/accounts/by-riot-id/${encodeURIComponent(
            gameName
          )}/${encodeURIComponent(tagLine)}`,
          {
            headers: { "X-Riot-Token": apiKey },
            cache: "no-store",
          }
        );

        if (!accountResponse.ok) {
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

        const account = await accountResponse.json();

        const summonerResponse = await fetch(
          `https://euw1.api.riotgames.com/lol/summoner/v4/summoners/by-puuid/${encodeURIComponent(
            account.puuid
          )}`,
          {
            headers: { "X-Riot-Token": apiKey },
            cache: "no-store",
          }
        );

        if (!summonerResponse.ok) {
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

        const summoner = await summonerResponse.json();

        const rankedResponse = await fetch(
          `https://euw1.api.riotgames.com/lol/league/v4/entries/by-summoner/${encodeURIComponent(
            summoner.id
          )}`,
          {
            headers: { "X-Riot-Token": apiKey },
            cache: "no-store",
          }
        );

        const entries = rankedResponse.ok ? await rankedResponse.json() : [];
        const solo = entries.find((entry: any) => entry.queueType === "RANKED_SOLO_5x5");

        return {
          name: participant.name,
          riotId: participant.riotId,
          tier: solo?.tier ?? "UNRANKED",
          rank: solo?.rank ?? "",
          lp: solo?.leaguePoints ?? 0,
          wins: solo?.wins ?? 0,
          losses: solo?.losses ?? 0,
        };
      } catch (error) {
        console.error(`Riot error for ${participant.name}:`, error);
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

  return NextResponse.json(
    { success: true, players },
    { headers: { "Cache-Control": "no-store, max-age=0" } }
  );
}
