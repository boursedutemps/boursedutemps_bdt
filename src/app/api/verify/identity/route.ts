// src/app/api/verify/identity/route.ts
// Soumet un document d'identité (niveau 3 — validation manuelle sous 24-48h)

import { NextResponse } from 'next/server'
import { query } from '@/lib/db'

export async function POST(req: Request) {
  const { uid, document_url } = await req.json()

  if (!uid || !document_url) {
    return NextResponse.json({ error: 'uid et document_url requis' }, { status: 400 })
  }

  try {
    // Stocker l'URL du document — is_verified_id reste FALSE jusqu'à validation admin
    await query(
      'UPDATE users SET identity_document_url = $1 WHERE uid = $2',
      [document_url, uid]
    )

    console.log(`🪪 Document soumis pour uid=${uid} : ${document_url}`)

    return NextResponse.json({ success: true, pending: true })
  } catch (error) {
    console.error('[verify/identity]', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}

// GET : l'admin approuve ou rejette un document
export async function PATCH(req: Request) {
  const { uid, approved } = await req.json()

  if (!uid || typeof approved !== 'boolean') {
    return NextResponse.json({ error: 'uid et approved (boolean) requis' }, { status: 400 })
  }

  try {
    await query(
      'UPDATE users SET is_verified_id = $1 WHERE uid = $2',
      [approved, uid]
    )

    return NextResponse.json({ success: true, approved })
  } catch (error) {
    console.error('[verify/identity PATCH]', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
