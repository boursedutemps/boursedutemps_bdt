// src/app/api/verify/sms/init/route.ts
// Envoie un OTP par SMS via Twilio (ou email fallback en dev)

import { NextResponse } from 'next/server'
import { query } from '@/lib/db'
import crypto from 'crypto'

export async function POST(req: Request) {
  const { phone, uid } = await req.json()

  if (!phone || !uid) {
    return NextResponse.json({ error: 'Téléphone et uid requis' }, { status: 400 })
  }

  // Normaliser le numéro
  const normalizedPhone = phone.replace(/\s+/g, '').replace(/^00/, '+')
  if (!/^\+?[0-9]{8,15}$/.test(normalizedPhone)) {
    return NextResponse.json({ error: 'Numéro de téléphone invalide' }, { status: 400 })
  }

  const code = crypto.randomInt(100000, 999999).toString()

  try {
    // Sauvegarder l'OTP (réutilise la table otps existante)
    await query('DELETE FROM otps WHERE identifier = $1', [normalizedPhone])
    await query(
      "INSERT INTO otps (identifier, code, expires_at) VALUES ($1, $2, NOW() + INTERVAL '10 minutes')",
      [normalizedPhone, code]
    )

    // Sauvegarder le numéro sur le profil utilisateur
    await query('UPDATE users SET phone = $1 WHERE uid = $2', [normalizedPhone, uid])

    // ── Envoi SMS via Twilio ──────────────────────────────────────────────
    const twilioSid   = process.env.TWILIO_ACCOUNT_SID
    const twilioToken = process.env.TWILIO_AUTH_TOKEN
    const twilioFrom  = process.env.TWILIO_PHONE_NUMBER

    if (twilioSid && twilioToken && twilioFrom) {
      const twilioUrl = `https://api.twilio.com/2010-04-01/Accounts/${twilioSid}/Messages.json`
      const body = new URLSearchParams({
        To:   normalizedPhone,
        From: twilioFrom,
        Body: `Bourse du Temps — Votre code de vérification : ${code} (valable 10 min)`,
      })

      const smsRes = await fetch(twilioUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          Authorization: `Basic ${Buffer.from(`${twilioSid}:${twilioToken}`).toString('base64')}`,
        },
        body,
      })

      if (!smsRes.ok) {
        const err = await smsRes.json()
        console.error('[verify/sms/init] Twilio error:', err)
        // Fallback : on continue quand même (le code est en base)
      }
    } else {
      // Mode développement : log le code
      console.log(`📱 [DEV] OTP SMS pour ${normalizedPhone}: ${code}`)
    }

    return NextResponse.json({ success: true, dev_code: twilioSid ? undefined : code })

  } catch (error) {
    console.error('[verify/sms/init]', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
