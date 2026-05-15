// src/app/api/verify/sms/check/route.ts
// Vérifie le code OTP SMS et passe is_verified_sms = true

import { NextResponse } from 'next/server'
import { query } from '@/lib/db'

export async function POST(req: Request) {
  const { phone, code, uid } = await req.json()

  if (!phone || !code || !uid) {
    return NextResponse.json({ error: 'Paramètres manquants' }, { status: 400 })
  }

  const normalizedPhone = phone.replace(/\s+/g, '').replace(/^00/, '+')

  try {
    const result = await query(
      'SELECT * FROM otps WHERE identifier = $1 AND code = $2 AND expires_at > NOW()',
      [normalizedPhone, code]
    )

    if (!result.rowCount || result.rowCount === 0) {
      return NextResponse.json({ error: 'Code invalide ou expiré' }, { status: 400 })
    }

    // Marquer SMS comme vérifié
    await query(
      'UPDATE users SET is_verified_sms = TRUE, phone = $1 WHERE uid = $2',
      [normalizedPhone, uid]
    )

    // Supprimer l'OTP utilisé
    await query('DELETE FROM otps WHERE identifier = $1', [normalizedPhone])

    return NextResponse.json({ success: true, verified: true })

  } catch (error) {
    console.error('[verify/sms/check]', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
