import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const PARTICIPANTS = [
  { name: "Kiwix", riotId: "Nissaxter ENJ#RAGE" },
  { name: "marccalvo", riotId: "Tyrhys Dolan#RCD" },
  { name: "Fardos31", riotId: "Myrwn#0031" },
  { name: "Yuki26", riotId: "DYsavage#EUW" },
  { name: "Delacasa95", riotId: "Turkishkebab1337#EUW" },
  { name: "Bounjimi", riotId: "Skyzer10#EUW" },
  { name: "OreWaRuo", riotId: "Sukehir0 Yami#Zoro" },
  { name: "Cristian", riotId: "Calm Smurf#EUW" },
  { name: "sallanman", riotId: "Lo Narisut#1492" },
  { name: "ByGrefuso", riotId: "Ooh Ferran#PEPO" },
  { name: "Kawinho15", riotId: "GodzOclock#EUW" },
  { name: "4l3", riotId: "X1aoCh4oM3ng#NOXUS" },
  { name: "Muchars", riotId: "icecoffeeweb#432" },
  { name: "Hiperbole", riotId: "fettuccina45#EUW" },
  { name: "Dragonsniper", riotId: "mostafahagag#EUW" },
  { name: "Luewer", riotId: "Ivaamaa  doppleg#GOAT" },
] as const;

function splitRiotId(value: string) {
  const hash = value.lastIndexOf("#");

  if (hash === -1) {
    return { gameName: value, tagLine: "" };
  }

  return {
    gameName: value.slice(0, hash),
    tagLine: value.slice(hash + 1),
  };
}

const EMPTY_PLAYER = (
  participant: (typeof PARTICIPANTS)[number],
  error?: string
) => ({
  name: participant.name,
  riotId: participant.riotId,
  tier: "UNRANKED",
  rank: "",
  lp: 0,
  wins: 0,
  losses: 0,
  ...(error ? { error } : {}),
});

export async function GET() {
  const apiKey = process.env.RIOT_API_KEY;

  if (!apiKey) {
    return NextResponse.json(
      {
        success: false,
        error: "Falta RIOT_API_KEY en .env.local",
        players: PARTICIPANTS.map((participant) => EMPTY_PLAYER(participant)),
      },
      { status: 500 }
    );
  }

  const players = await Promise.all(
    PARTICIPANTS.map(async (participant) => {
      try {
        const { gameName, tagLine } = splitRiotId(participant.riotId);

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
          console.error(
            `Riot Account API ${accountResponse.status} para ${participant.riotId}`
          );
          return EMPTY_PLAYER(
            participant,
            `Riot Account API ${accountResponse.status}`
          );
        }

        const account = await accountResponse.json();

        const entriesResponse = await fetch(
          `https://euw1.api.riotgames.com/lol/league/v4/entries/by-puuid/${encodeURIComponent(
            account.puuid
          )}`,
          {
            headers: { "X-Riot-Token": apiKey },
            cache: "no-store",
          }
        );

        if (!entriesResponse.ok) {
          console.error(
            `Riot League API ${entriesResponse.status} para ${participant.riotId}`
          );
          return EMPTY_PLAYER(
            participant,
            `Riot League API ${entriesResponse.status}`
          );
        }

        const entries = await entriesResponse.json();
        const solo = entries.find(
          (entry: any) => entry.queueType === "RANKED_SOLO_5x5"
        );

        return {
          name: participant.name,
          riotId: participant.riotId,
          tier: solo?.tier ?? "UNRANKED",
          rank: solo?.rank ?? "",
          lp: solo?.leaguePoints ?? 0,
          wins: solo?.wins ?? 0,
          losses: solo?.losses ?? 0,
          error: solo ? undefined : "SIN DATOS DE RANKED_SOLO_5x5",
        };
      } catch (error) {
        console.error(`Riot error para ${participant.riotId}:`, error);
        return EMPTY_PLAYER(participant, "Error consultando Riot API");
      }
    })
  );

  return NextResponse.json(
    { success: true, players },
    { headers: { "Cache-Control": "no-store, max-age=0" } }
  );
}
