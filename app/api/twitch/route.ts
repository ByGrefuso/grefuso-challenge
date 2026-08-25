import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const STREAMERS = [
  { channel: "bygrefuso", displayName: "BYGREFUSO" },
  { channel: "crisblade04", displayName: "CRISTIAN" },
  { channel: "yuuki26_", displayName: "YUKI26" },
  { channel: "sallanman_cat", displayName: "SALLANMAN" },
  { channel: "orewarulo", displayName: "OREWARUO" },
  { channel: "fardos_31", displayName: "FARDOS31" },
  { channel: "delakelly", displayName: "DELACASA95" },
  { channel: "euwthe4l3", displayName: "4L3" },
  { channel: "kawinho15_", displayName: "KAWINHO15" },
  { channel: "marcsuarezdp", displayName: "MARCCALVO" },
] as const;

async function getTwitchToken() {
  const clientId = process.env.TWITCH_CLIENT_ID;
  const clientSecret = process.env.TWITCH_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    throw new Error("Faltan TWITCH_CLIENT_ID o TWITCH_CLIENT_SECRET");
  }

  const response = await fetch("https://id.twitch.tv/oauth2/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: clientId,
      client_secret: clientSecret,
      grant_type: "client_credentials",
    }),
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`Twitch token ${response.status}: ${await response.text()}`);
  }

  return (await response.json()) as { access_token: string };
}

export async function GET() {
  try {
    const clientId = process.env.TWITCH_CLIENT_ID;
    if (!clientId) throw new Error("Falta TWITCH_CLIENT_ID");

    const { access_token } = await getTwitchToken();

    const headers = {
      "Client-ID": clientId,
      Authorization: `Bearer ${access_token}`,
    };

    const userParams = new URLSearchParams();
    const streamParams = new URLSearchParams();

    for (const streamer of STREAMERS) {
      userParams.append("login", streamer.channel);
      streamParams.append("user_login", streamer.channel);
    }

    const [usersResponse, streamsResponse] = await Promise.all([
      fetch(`https://api.twitch.tv/helix/users?${userParams.toString()}`, {
        headers,
        cache: "no-store",
      }),
      fetch(
        `https://api.twitch.tv/helix/streams?first=100&${streamParams.toString()}`,
        { headers, cache: "no-store" }
      ),
    ]);

    if (!usersResponse.ok) {
      throw new Error(
        `Twitch users ${usersResponse.status}: ${await usersResponse.text()}`
      );
    }

    if (!streamsResponse.ok) {
      throw new Error(
        `Twitch streams ${streamsResponse.status}: ${await streamsResponse.text()}`
      );
    }

    const usersJson = await usersResponse.json();
    const streamsJson = await streamsResponse.json();

    const users = usersJson.data ?? [];
    const liveStreams = streamsJson.data ?? [];

    const streams = STREAMERS.map((streamer) => {
      const user = users.find(
        (u: any) =>
          String(u.login).toLowerCase() === streamer.channel.toLowerCase()
      );

      const live = liveStreams.find(
        (s: any) =>
          String(s.user_login).toLowerCase() === streamer.channel.toLowerCase()
      );

      return {
        channel: streamer.channel,
        displayName: user?.display_name ?? streamer.displayName,
        avatar: user?.profile_image_url ?? "",
        live: Boolean(live),
        title: live?.title ?? "",
        game: live?.game_name ?? "",
        viewers: live?.viewer_count ?? 0,
        thumbnail: live?.thumbnail_url
          ? live.thumbnail_url
              .replace("{width}", "640")
              .replace("{height}", "360")
          : "",
        startedAt: live?.started_at ?? null,
        url: `https://www.twitch.tv/${streamer.channel}`,
      };
    });

    return NextResponse.json(
      { success: true, streams },
      { headers: { "Cache-Control": "no-store, max-age=0" } }
    );
  } catch (error) {
    console.error("Twitch API error:", error);

    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Error desconocido",
        streams: [],
      },
      { status: 500 }
    );
  }
}
