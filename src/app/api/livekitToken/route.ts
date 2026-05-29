// src/app/api/livekitToken/route.ts
import { NextResponse } from 'next/server'
import { AccessToken } from 'livekit-server-sdk'
import { getUserIdFromRequest } from '@/lib/auth'

export async function POST(req: Request) {
  const uid = await getUserIdFromRequest(req)
  if (!uid) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })

  const { roomName, userName, isModerator } = await req.json()
  if (!roomName || !userName)
    return NextResponse.json({ error: 'roomName et userName requis' }, { status: 400 })

  const apiKey    = process.env.LIVEKIT_API_KEY
  const apiSecret = process.env.LIVEKIT_API_SECRET

  if (!apiKey || !apiSecret)
    return NextResponse.json({ error: 'LiveKit non configuré' }, { status: 500 })

  try {
    const at = new AccessToken(apiKey, apiSecret, {
      identity: uid,
      name:     userName,
      ttl:      '4h',
    })

    at.addGrant({
      roomJoin:       true,
      room:           roomName,
      canPublish:     true,
      canSubscribe:   true,
      canPublishData: true,
      roomAdmin:      isModerator === true,
    })

    const token = await at.toJwt()
    return NextResponse.json({ token })
  } catch (err) {
    console.error('[livekitToken]', err)
    return NextResponse.json({ error: 'Erreur génération token' }, { status: 500 })
  }
}
