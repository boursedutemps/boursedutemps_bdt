import { NextRequest, NextResponse } from 'next/server';
import { AccessToken } from 'livekit-server-sdk';

export async function POST(req: NextRequest) {
  const { roomName, userName, isModerator } = await req.json();
  if (!roomName || !userName)
    return NextResponse.json({ error: 'roomName et userName requis' }, { status: 400 });

  const apiKey    = process.env.LIVEKIT_API_KEY;
  const apiSecret = process.env.LIVEKIT_API_SECRET;
  if (!apiKey || !apiSecret)
    return NextResponse.json({ error: 'LiveKit non configure' }, { status: 500 });

  const at = new AccessToken(apiKey, apiSecret, { identity: userName, ttl: '2h' });
  at.addGrant({
    roomJoin:     true,
    room:         roomName,
    canPublish:   true,
    canSubscribe: true,
    roomAdmin:    isModerator ?? false,
  });

  return NextResponse.json({ token: await at.toJwt() });
}