// src/app/api/cron/inactivity/route.ts
// Déclenché chaque jour à 8h00 UTC par Vercel Cron
// Envoie des rappels aux utilisateurs inactifs depuis 7+ jours

import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabaseAdmin'
import { sendEmail } from '@/lib/email'

const CRON_SECRET = process.env.CRON_SECRET

export async function GET(req: Request) {
  // ── Sécurité : vérifier le secret Vercel ──────────────────────────────────
  const authHeader = req.headers.get('authorization')
  if (CRON_SECRET && authHeader !== `Bearer ${CRON_SECRET}`) {
    return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
  }

  if (!supabaseAdmin) {
    return NextResponse.json({ error: 'Configuration serveur manquante' }, { status: 500 })
  }

  try {
    const now = new Date()
    const sevenDaysAgo    = new Date(now.getTime() -  7 * 24 * 60 * 60 * 1000).toISOString()
    const fourteenDaysAgo = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000).toISOString()

    // ── 1. Utilisateurs inactifs depuis 7 à 14 jours ─────────────────────────
    const { data: inactiveUsers, error: usersError } = await supabaseAdmin
      .from('users')
      .select('uid, email, first_name, name, last_active_at')
      .not('onboarding_completed_at', 'is', null)
      .lte('last_active_at', sevenDaysAgo)
      .gte('last_active_at', fourteenDaysAgo)
      .eq('status', 'active')

    if (usersError) {
      console.error('[cron/inactivity] Erreur fetch users:', usersError)
      return NextResponse.json({ error: usersError.message }, { status: 500 })
    }

    if (!inactiveUsers || inactiveUsers.length === 0) {
      return NextResponse.json({ ok: true, processed: 0, message: 'Aucun utilisateur inactif' })
    }

    // ── 2. Exclure ceux déjà notifiés cette semaine ───────────────────────────
    const uids = inactiveUsers.map(u => u.uid)

    const { data: recentNotifs } = await supabaseAdmin
      .from('notifications')
      .select('user_id')
      .in('user_id', uids)
      .eq('type', 'inactivity_reminder')
      .gte('created_at', sevenDaysAgo)

    const alreadyNotified = new Set((recentNotifs || []).map(n => n.user_id))
    const toNotify = inactiveUsers.filter(u => !alreadyNotified.has(u.uid))

    if (toNotify.length === 0) {
      return NextResponse.json({ ok: true, processed: 0, message: 'Tous déjà notifiés récemment' })
    }

    // ── 3. Notifications + emails ─────────────────────────────────────────────
    let emailsSent = 0
    let notifsSaved = 0

    for (const user of toNotify) {
      const firstName = user.first_name || user.name?.split(' ')[0] || 'là'

      const { error: notifError } = await supabaseAdmin
        .from('notifications')
        .insert({
          user_id:   user.uid,
          type:      'inactivity_reminder',
          content:   `Bonjour ${firstName} ! La communauté a besoin de vous. De nouveaux échanges vous attendent.`,
          from_name: 'Bourse du Temps',
          is_read:   false,
        })

      if (!notifError) notifsSaved++

      if (user.email) {
        try {
          await sendEmail({
            to:      user.email,
            subject: `${firstName}, la communauté vous attend 👋`,
            html:    buildInactivityEmail(firstName),
          })
          emailsSent++
        } catch (emailErr) {
          console.error(`[cron/inactivity] Email échoué pour ${user.uid}:`, emailErr)
        }
      }
    }

    console.log(`[cron/inactivity] ${notifsSaved} notifications, ${emailsSent} emails envoyés`)
    return NextResponse.json({ ok: true, processed: toNotify.length, notifsSaved, emailsSent })

  } catch (err: unknown) {
    console.error('[cron/inactivity] Erreur inattendue:', err)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}

// ── Template email ────────────────────────────────────────────────────────────

function buildInactivityEmail(firstName: string): string {
  return `
<!DOCTYPE html>
<html lang="fr">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"></head>
<body style="margin:0;padding:0;background:#f8fafc;font-family:'Segoe UI',Arial,sans-serif;">
  <div style="max-width:560px;margin:40px auto;background:#fff;border-radius:20px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.06);">

    <div style="background:linear-gradient(135deg,#F59E0B 0%,#EF4444 100%);padding:36px 32px;text-align:center;">
      <p style="margin:0;font-size:36px;">⏳</p>
      <h1 style="margin:12px 0 0;color:#fff;font-size:22px;font-weight:700;">
        ${firstName}, votre temps est précieux
      </h1>
    </div>

    <div style="padding:32px;">
      <p style="color:#374151;font-size:15px;line-height:1.7;margin:0 0 16px;">
        Bonjour <strong>${firstName}</strong>,
      </p>
      <p style="color:#374151;font-size:15px;line-height:1.7;margin:0 0 16px;">
        Cela fait quelques jours que nous ne vous avons pas vu sur la <strong>Bourse du Temps</strong>.
        La communauté continue de grandir — de nouvelles compétences et de nouveaux membres vous attendent !
      </p>

      <div style="background:#FEF3C7;border-radius:12px;padding:20px;margin:24px 0;text-align:center;">
        <table width="100%" style="border-collapse:collapse;">
          <tr>
            <td style="text-align:center;padding:0 8px;">
              <p style="margin:0;font-size:24px;font-weight:800;color:#B45309;">+12</p>
              <p style="margin:4px 0 0;font-size:12px;color:#92400E;">nouveaux services</p>
            </td>
            <td style="text-align:center;padding:0 8px;">
              <p style="margin:0;font-size:24px;font-weight:800;color:#B45309;">+8</p>
              <p style="margin:4px 0 0;font-size:12px;color:#92400E;">nouveaux membres</p>
            </td>
            <td style="text-align:center;padding:0 8px;">
              <p style="margin:0;font-size:24px;font-weight:800;color:#B45309;">+5</p>
              <p style="margin:4px 0 0;font-size:12px;color:#92400E;">demandes ouvertes</p>
            </td>
          </tr>
        </table>
      </div>

      <p style="color:#374151;font-size:15px;line-height:1.7;margin:0 0 24px;">
        Peut-être que quelqu'un a besoin exactement de votre compétence en ce moment ?
      </p>

      <div style="text-align:center;margin:32px 0;">
        <a href="https://boursedutemps.vercel.app/services"
           style="display:inline-block;background:linear-gradient(135deg,#F59E0B 0%,#EF4444 100%);color:#fff;text-decoration:none;padding:14px 32px;border-radius:12px;font-weight:700;font-size:15px;box-shadow:0 4px 14px rgba(245,158,11,0.35);">
          Reprendre les échanges →
        </a>
      </div>

      <p style="color:#9CA3AF;font-size:12px;text-align:center;margin:0;">
        Vous recevez cet email car vous êtes membre de la Bourse du Temps.<br>
        <a href="https://boursedutemps.vercel.app/profile" style="color:#F59E0B;">Gérer mes préférences</a>
      </p>
    </div>
  </div>
</body>
</html>`
}
