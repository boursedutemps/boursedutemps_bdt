// src/app/api/otp/check/route.ts
// Vérifie un OTP email (flux login/register)

import { NextResponse } from 'next/server'
import { query } from '@/lib/db'

export async function POST(req: Request) {
  const { email, code } = await req.json()

  if (!email || !code) {
    return NextResponse.json({ error: 'Email et code requis' }, { status: 400 })
  }

  try {
    const result = await query(
      'SELECT * FROM otps WHERE identifier = $1 AND code = $2 AND expires_at > NOW()',
      [email, code]
    )

    if (!result.rowCount || result.rowCount === 0) {
      return NextResponse.json({ error: 'Code invalide ou expiré' }, { status: 400 })
    }

    // On garde l'OTP pour que login/register puissent aussi le consommer
    return NextResponse.json({ success: true, verified: true })
  } catch (error) {
    console.error('[otp/check]', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
