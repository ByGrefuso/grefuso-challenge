import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const CHANNELS = [
  { channel: "bydagma", displayName: "KIWIX" },
] as const;

async function getKickToken() {
  const clientId = process.env.KICK_CLIENT_ID;
  const clientSecret = process.env.KICK_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    return null;
  }

  const response = await fetch("https://id.kick.com/oauth/token", {
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
    throw new Error(`Kick token ${response.status}: ${await response.text()}`);
  }

  return (await response.json()) as { access_token: string };
}

export async function GET() {
  try {
    const token = await getKickToken();

    if (!token) {
      return NextResponse.json({
        success: true,
        streams: CHANNELS.map((channel) => ({
          channel: channel.channel,
          displayName: channel.displayName,
          avatar: "",
          live: false,
          title: "",
          game: "",
          viewers: 0,
          thumbnail: "",
          startedAt: null,
          url: `https://kick.com/${channel.channel}`,
        })),
      });
    }

    const response = await fetch(
      `https://api.kick.com/public/v1/channels?slug=${encodeURIComponent(CHANNELS[0].channel)}`,
      {
        headers: {
          Authorization: `Bearer ${token.access_token}`,
          Accept: "application/json",
        },
        cache: "no-store",
      }
    );

    if (!response.ok) {
      throw new Error(`Kick channels ${response.status}: ${await response.text()}`);
    }

    const json = await response.json();
    const channelData = Array.isArray(json?.data) ? json.data[0] : null;

    return NextResponse.json({
      success: true,
      streams: CHANNELS.map((channel) => ({
        channel: channel.channel,
        displayName: channelData?.user_username ?? channel.displayName,
        avatar: channelData?.profile_picture ?? "",
        live: Boolean(channelData?.stream),
        title: channelData?.stream?.session_title ?? "",
        game: channelData?.stream?.category?.name ?? "",
        viewers: channelData?.stream?.viewer_count ?? 0,
        thumbnail: channelData?.stream?.thumbnail ?? "",
        startedAt: channelData?.stream?.started_at ?? null,
        url: `https://kick.com/${channel.channel}`,
      })),
    }, { headers: { "Cache-Control": "no-store, max-age=0" } });
  } catch (error) {
    console.error("Kick API error:", error);
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
