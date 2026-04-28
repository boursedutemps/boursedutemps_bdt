import { NextRequest, NextResponse } from 'next/server';
import { AccessToken } from 'livekit-server-sdk';
import { getUserIdFromRequest } from '@/lib/auth';

export async function POST(req: NextRequest) {
  const uid = await getUserIdFromRequest(req);
  if (!uid) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });

  const { roomName, userName, isModerator } = await req.json();
  if (!roomName || !userName)
    return NextResponse.json({ error: 'roomName et userName requis' }, { status: 400 });

  const apiKey    = process.env.LIVEKIT_API_KEY!;
  const apiSecret = process.env.LIVEKIT_API_SECRET!;

  const token = new AccessToken(apiKey, apiSecret, {
    identity: uid,
    name: userName,
    ttl: '4h',
  });

  token.addGrant({
    roomJoin:       true,
    room:           roomName,
    canPublish:     true,
    canSubscribe:   true,
    canPublishData: true,
    roomAdmin:      isModerator ?? false,
  });

  return NextResponse.json({ token: await token.toJwt() });
}
