// src/app/api/cron/reports/route.ts
// Déclenché le 1er de chaque mois à 7h00 UTC
// Génère et envoie les rapports PDF à tous les admins d'institutions actives

import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabaseAdmin'

const CRON_SECRET = process.env.CRON_SECRET

export async function GET(req: Request) {
  // Sécurité
  const authHeader = req.headers.get('authorization')
  if (CRON_SECRET && authHeader !== `Bearer ${CRON_SECRET}`) {
    return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
  }

  if (!supabaseAdmin) {
    return NextResponse.json({ error: 'Config manquante' }, { status: 500 })
  }

  const origin = new URL(req.url).origin
  const now    = new Date()

  // Rapport du mois précédent
  const reportDate = new Date(now.getFullYear(), now.getMonth() - 1, 1)
  const year       = reportDate.getFullYear()
  const month      = reportDate.getMonth() + 1

  try {
    // Récupérer toutes les institutions actives avec leur admin
    const { data: institutions, error } = await supabaseAdmin
      .from('institutions')
      .select('id, slug, name, contact_email, admin_uid, users!institutions_admin_uid_fkey(email, first_name, name)')
      .eq('status', 'active')

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    if (!institutions || institutions.length === 0) {
      return NextResponse.json({ ok: true, processed: 0, message: 'Aucune institution active' })
    }

    let sent = 0
    let errors = 0

    for (const inst of institutions) {
      try {
        // Déterminer l'email destinataire
        const adminUser = Array.isArray(inst.users) ? inst.users[0] : inst.users
        const emailTo   = inst.contact_email || adminUser?.email

        if (!emailTo) {
          console.warn(`[cron/reports] Pas d'email pour ${inst.slug}`)
          continue
        }

        // Déclencher la génération + envoi
        const res = await fetch(`${origin}/api/institution/report`, {
          method:  'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            slug:       inst.slug,
            year,
            month,
            send_email: true,
            email_to:   emailTo,
          }),
        })

        if (res.ok) {
          sent++

          // Créer une notification in-app pour l'admin
          if (inst.admin_uid) {
            const MONTHS_FR = ['Janvier','Février','Mars','Avril','Mai','Juin','Juillet','Août','Septembre','Octobre','Novembre','Décembre']
            await supabaseAdmin.from('notifications').insert({
              user_id:   inst.admin_uid,
              type:      'monthly_report',
              content:   `📊 Votre rapport mensuel ${MONTHS_FR[month - 1]} ${year} a été généré et envoyé à ${emailTo}.`,
              from_name: 'Bourse du Temps',
              is_read:   false,
            })
          }
        } else {
          errors++
          console.error(`[cron/reports] Échec pour ${inst.slug}:`, await res.text())
        }

      } catch (instErr) {
        errors++
        console.error(`[cron/reports] Erreur pour ${inst.slug}:`, instErr)
      }
    }

    return NextResponse.json({
      ok:        true,
      processed: institutions.length,
      sent,
      errors,
      period:    `${month}/${year}`,
    })

  } catch (err: unknown) {
    console.error('[cron/reports]', err)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
