import { NextResponse } from "next/server";

const CHANNELS = [
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

type TwitchUser = {
  id: string;
  login: string;
  display_name: string;
  profile_image_url: string;
};

type TwitchStream = {
  id: string;
  user_id: string;
  user_login: string;
  user_name: string;
  game_name: string;
  title: string;
  viewer_count: number;
  started_at: string;
  thumbnail_url: string;
};

async function getAccessToken() {
  const clientId = process.env.TWITCH_CLIENT_ID;
  const clientSecret = process.env.TWITCH_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    throw new Error("Faltan TWITCH_CLIENT_ID o TWITCH_CLIENT_SECRET");
  }

  const response = await fetch(
    "https://id.twitch.tv/oauth2/token",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        client_id: clientId,
        client_secret: clientSecret,
        grant_type: "client_credentials",
      }),
      cache: "no-store",
    }
  );

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(
      `Error obteniendo token de Twitch: ${errorText}`
    );
  }

  const data = await response.json();

  return data.access_token as string;
}

export async function GET() {
  try {
    const clientId = process.env.TWITCH_CLIENT_ID;

    if (!clientId) {
      return NextResponse.json(
        {
          success: false,
          error: "Falta TWITCH_CLIENT_ID",
        },
        { status: 500 }
      );
    }

    const accessToken = await getAccessToken();

    const headers = {
      "Client-ID": clientId,
      Authorization: `Bearer ${accessToken}`,
    };

    /*
     * Primero obtenemos la información de los usuarios.
     * Esto nos permite mostrar nombre y foto de perfil
     * incluso cuando están offline.
     */

    const usersResponse = await fetch(
      `https://api.twitch.tv/helix/users?login=${CHANNELS.join(
        "&login="
      )}`,
      {
        headers,
        cache: "no-store",
      }
    );

    if (!usersResponse.ok) {
      const errorText = await usersResponse.text();

      throw new Error(
        `Error obteniendo usuarios de Twitch: ${errorText}`
      );
    }

    const usersData = await usersResponse.json();

    const users: TwitchUser[] = usersData.data || [];

    /*
     * Ahora obtenemos únicamente los streams que están LIVE.
     */

    const streamsResponse = await fetch(
      `https://api.twitch.tv/helix/streams?user_login=${CHANNELS.join(
        "&user_login="
      )}`,
      {
        headers,
        cache: "no-store",
      }
    );

    if (!streamsResponse.ok) {
      const errorText = await streamsResponse.text();

      throw new Error(
        `Error obteniendo streams de Twitch: ${errorText}`
      );
    }

    const streamsData = await streamsResponse.json();

    const streams: TwitchStream[] = streamsData.data || [];

    /*
     * Creamos un mapa para encontrar rápidamente
     * qué usuarios están en directo.
     */

    const liveMap = new Map<string, TwitchStream>();

    for (const stream of streams) {
      liveMap.set(stream.user_login.toLowerCase(), stream);
    }

    /*
     * Construimos el resultado final para la web.
     */

    const result = CHANNELS.map((channel) => {
      const user = users.find(
        (item) =>
          item.login.toLowerCase() === channel.toLowerCase()
      );

      const stream = liveMap.get(channel.toLowerCase());

      return {
        channel,

        displayName:
          user?.display_name ||
          channel,

        avatar:
          user?.profile_image_url ||
          "",

        live: !!stream,

        title:
          stream?.title ||
          "",

        game:
          stream?.game_name ||
          "",

        viewers:
          stream?.viewer_count ||
          0,

        thumbnail: stream
          ? stream.thumbnail_url
              .replace("{width}", "640")
              .replace("{height}", "360")
          : "",

        startedAt:
          stream?.started_at ||
          null,

        url:
          `https://www.twitch.tv/${channel}`,
      };
    });

    return NextResponse.json(
      {
        success: true,
        streams: result,
      },
      {
        headers: {
          "Cache-Control":
            "no-store, no-cache, must-revalidate",
        },
      }
    );
  } catch (error) {
    console.error("Twitch API error:", error);

    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Error desconocido",
      },
      {
        status: 500,
      }
    );
  }
}
