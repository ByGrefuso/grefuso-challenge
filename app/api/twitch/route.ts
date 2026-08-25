import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const STREAMERS = [
  {
    channel: "bygrefuso",
    displayName: "BYGREFUSO",
  },
  {
    channel: "marcsuarezdp",
    displayName: "MARCCALVO",
  },
  {
    channel: "yuuki26_",
    displayName: "YUUKI26",
  },
  {
    channel: "kawinho15_",
    displayName: "KAWINHO15",
  },
  {
    channel: "euwthe4l3",
    displayName: "AL3",
  },
];

type TwitchTokenResponse = {
  access_token: string;
  expires_in: number;
  token_type: string;
};

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

async function getTwitchToken() {
  const clientId = process.env.TWITCH_CLIENT_ID;
  const clientSecret = process.env.TWITCH_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    throw new Error("Faltan TWITCH_CLIENT_ID o TWITCH_CLIENT_SECRET");
  }

  const response = await fetch(
    `https://id.twitch.tv/oauth2/token?client_id=${encodeURIComponent(
      clientId
    )}&client_secret=${encodeURIComponent(
      clientSecret
    )}&grant_type=client_credentials`,
    {
      method: "POST",
      cache: "no-store",
    }
  );

  if (!response.ok) {
    throw new Error(`Error obteniendo token de Twitch: ${response.status}`);
  }

  return (await response.json()) as TwitchTokenResponse;
}

export async function GET() {
  try {
    const clientId = process.env.TWITCH_CLIENT_ID;

    if (!clientId) {
      return NextResponse.json(
        {
          success: false,
          error: "Falta TWITCH_CLIENT_ID en .env.local",
          streams: [],
        },
        { status: 500 }
      );
    }

    const token = await getTwitchToken();

    const logins = STREAMERS.map((streamer) => streamer.channel).join("&login=");

    const headers = {
      "Client-ID": clientId,
      Authorization: `Bearer ${token.access_token}`,
    };

    const [usersResponse, streamsResponse] = await Promise.all([
      fetch(
        `https://api.twitch.tv/helix/users?login=${encodeURIComponent(
          STREAMERS[0].channel
        )}&login=${encodeURIComponent(STREAMERS[1].channel)}&login=${encodeURIComponent(
          STREAMERS[2].channel
        )}&login=${encodeURIComponent(STREAMERS[3].channel)}&login=${encodeURIComponent(
          STREAMERS[4].channel
        )}`,
        { headers, cache: "no-store" }
      ),
      fetch(
        `https://api.twitch.tv/helix/streams?game_id=&first=100`,
        { headers, cache: "no-store" }
      ),
    ]);

    if (!usersResponse.ok) {
      const text = await usersResponse.text();
      throw new Error(`Twitch users error ${usersResponse.status}: ${text}`);
    }

    if (!streamsResponse.ok) {
      const text = await streamsResponse.text();
      throw new Error(`Twitch streams error ${streamsResponse.status}: ${text}`);
    }

    const usersData = (await usersResponse.json()) as { data: TwitchUser[] };
    const allStreamsData = (await streamsResponse.json()) as {
      data: TwitchStream[];
    };

    const users = usersData.data || [];
    const wantedChannels = new Set(STREAMERS.map((s) => s.channel.toLowerCase()));

    const liveStreams = (allStreamsData.data || []).filter((stream) =>
      wantedChannels.has(stream.user_login.toLowerCase())
    );

    const streams = STREAMERS.map((config) => {
      const user = users.find(
        (u) => u.login.toLowerCase() === config.channel.toLowerCase()
      );

      const live = liveStreams.find(
        (s) => s.user_login.toLowerCase() === config.channel.toLowerCase()
      );

      return {
        channel: config.channel,
        displayName: user?.display_name || config.displayName,
        avatar: user?.profile_image_url || "",
        live: Boolean(live),
        title: live?.title || "",
        game: live?.game_name || "",
        viewers: live?.viewer_count || 0,
        thumbnail: live
          ? live.thumbnail_url
              .replace("{width}", "640")
              .replace("{height}", "360")
          : "",
        startedAt: live?.started_at || null,
        url: `https://www.twitch.tv/${config.channel}`,
      };
    });

    return NextResponse.json(
      {
        success: true,
        streams,
      },
      {
        headers: {
          "Cache-Control": "no-store, max-age=0",
        },
      }
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
