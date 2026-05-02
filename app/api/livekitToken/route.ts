// app/api/livekit-token/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { AccessToken } from 'livekit-server-sdk';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const room     = searchParams.get('room');
  const username = searchParams.get('username');

  if (!room || !username) {
    return NextResponse.json({ error: 'room et username requis' }, { status: 400 });
  }

  const apiKey    = process.env.LIVEKIT_API_KEY;
  const apiSecret = process.env.LIVEKIT_API_SECRET;

  if (!apiKey || !apiSecret) {
    return NextResponse.json({ error: 'LiveKit non configuré' }, { status: 500 });
  }

  const at = new AccessToken(apiKey, apiSecret, {
    identity: username,
    ttl:      '2h',
  });

  at.addGrant({
    roomJoin:     true,
    room,
    canPublish:   true,
    canSubscribe: true,
  });

  const token = await at.toJwt();
  return NextResponse.json({ token });
}
