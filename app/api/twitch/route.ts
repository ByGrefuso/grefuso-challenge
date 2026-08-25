import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const CHANNELS = [
  "bygrefuso",
  "crisblade04",
  "nerea3005_",
  "sallanman_cat",
  "orewarulo",
  "fardos_31",
  "delakelly",
];

let cachedToken = "";
let tokenExpiresAt = 0;

async function getAccessToken() {
  const clientId = process.env.TWITCH_CLIENT_ID;
  const clientSecret = process.env.TWITCH_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    throw new Error("Faltan las variables de Twitch en Vercel");
  }

  if (cachedToken && Date.now() < tokenExpiresAt) {
    return cachedToken;
  }

  const response = await fetch(
    `https://id.twitch.tv/oauth2/token?client_id=${clientId}&client_secret=${clientSecret}&grant_type=client_credentials`,
    {
      method: "POST",
      cache: "no-store",
    }
  );

  if (!response.ok) {
    throw new Error("No se pudo autenticar con Twitch");
  }

  const data = await response.json();

  cachedToken = data.access_token;
  tokenExpiresAt = Date.now() + (data.expires_in - 300) * 1000;

  return cachedToken;
}

export async function GET() {
  try {
    const clientId = process.env.TWITCH_CLIENT_ID;
    const token = await getAccessToken();

    const headers = {
      "Client-ID": clientId!,
      Authorization: `Bearer ${token}`,
    };

    const streamParams = CHANNELS.map(
      (channel) => `user_login=${encodeURIComponent(channel)}`
    ).join("&");

    const [streamsResponse, usersResponse] = await Promise.all([
      fetch(
        `https://api.twitch.tv/helix/streams?${streamParams}`,
        {
          headers,
          cache: "no-store",
        }
      ),
      fetch(
        `https://api.twitch.tv/helix/users?${streamParams}`,
        {
          headers,
          cache: "no-store",
        }
      ),
    ]);

    if (!streamsResponse.ok || !usersResponse.ok) {
      throw new Error("Error consultando Twitch");
    }

    const streamsData = await streamsResponse.json();
    const usersData = await usersResponse.json();

    const streams = streamsData.data || [];
    const users = usersData.data || [];

    const result = CHANNELS.map((channel) => {
      const user = users.find(
        (u: any) => u.login.toLowerCase() === channel.toLowerCase()
      );

      const stream = streams.find(
        (s: any) => s.user_login.toLowerCase() === channel.toLowerCase()
      );

      return {
        channel,
        displayName: user?.display_name || channel,
        avatar: user?.profile_image_url || "",
        live: !!stream,
        title: stream?.title || "",
        game: stream?.game_name || "",
        viewers: stream?.viewer_count || 0,
        thumbnail: stream?.thumbnail_url
          ? stream.thumbnail_url
              .replace("{width}", "640")
              .replace("{height}", "360")
          : "",
        startedAt: stream?.started_at || null,
        url: `https://www.twitch.tv/${channel}`,
      };
    });

    return NextResponse.json({
      success: true,
      streams: result,
      updatedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        error: "No se pudo obtener la información de Twitch",
      },
      { status: 500 }
    );
  }
}
