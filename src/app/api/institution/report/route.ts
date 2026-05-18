// src/app/api/institution/report/route.ts
// Génère le rapport PDF mensuel d'une institution

import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabaseAdmin'
import { renderToBuffer } from '@react-pdf/renderer'
import { InstitutionReportPDF } from '@/lib/pdf/InstitutionReport'
import React from 'react'

export async function GET(req: Request) {
  if (!supabaseAdmin) {
    return NextResponse.json({ error: 'Config manquante' }, { status: 500 })
  }

  const { searchParams } = new URL(req.url)
  const slug  = searchParams.get('slug')
  const year  = parseInt(searchParams.get('year')  || String(new Date().getFullYear()))
  const month = parseInt(searchParams.get('month') || String(new Date().getMonth() + 1))

  if (!slug) {
    return NextResponse.json({ error: 'slug requis' }, { status: 400 })
  }

  try {
    // ── 1. Récupérer l'institution ────────────────────────────────────────────
    const { data: institution, error: instError } = await supabaseAdmin
      .from('institutions')
      .select('id, name, logo_url, country, type, primary_color, status')
      .eq('slug', slug)
      .single()

    if (instError || !institution) {
      return NextResponse.json({ error: 'Institution introuvable' }, { status: 404 })
    }

    if (institution.status !== 'active') {
      return NextResponse.json({ error: 'Institution non active' }, { status: 403 })
    }

    // ── 2. Récupérer les stats (réutilise la logique de /api/institution/stats) ─
    const statsRes = await fetch(
      `${new URL(req.url).origin}/api/institution/stats?institution_id=${institution.id}`,
      { headers: { 'x-internal-request': '1' } }
    )

    if (!statsRes.ok) {
      return NextResponse.json({ error: 'Impossible de calculer les stats' }, { status: 500 })
    }

    const stats = await statsRes.json()

    // ── 3. Récupérer l'historique 6 mois depuis institution_kpis ─────────────
    const { data: history } = await supabaseAdmin
      .from('institution_kpis')
      .select('period_year, period_month, new_members, total_exchanges, equivalent_value_eur')
      .eq('institution_id', institution.id)
      .order('period_year',  { ascending: false })
      .order('period_month', { ascending: false })
      .limit(6)

    // ── 4. Assembler les données du rapport ───────────────────────────────────
    const reportData = {
      institution: {
        name:          institution.name,
        logo_url:      institution.logo_url,
        country:       institution.country,
        type:          institution.type,
        primary_color: institution.primary_color || '#1E40AF',
      },
      period: { year, month },
      stats: {
        ...stats,
        history: (history || []).reverse(),
      },
    }

    // ── 5. Générer le PDF ─────────────────────────────────────────────────────
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const element = React.createElement(InstitutionReportPDF, { data: reportData }) as any
    const buffer = await renderToBuffer(element)

    const MONTHS_FR = [
      'Janvier','Février','Mars','Avril','Mai','Juin',
      'Juillet','Août','Septembre','Octobre','Novembre','Décembre',
    ]
    const filename = `rapport-${slug}-${MONTHS_FR[month - 1]}-${year}.pdf`
      .toLowerCase()
      .replace(/[éèê]/g, 'e')
      .replace(/[àâ]/g, 'a')
      .replace(/[ûü]/g, 'u')
      .replace(/\s+/g, '-')

    // ── 6. Retourner le PDF ───────────────────────────────────────────────────
    return new NextResponse(buffer, {
      status: 200,
      headers: {
        'Content-Type':        'application/pdf',
        'Content-Disposition': `attachment; filename="${filename}"`,
        'Content-Length':      String(buffer.byteLength),
        'Cache-Control':       'no-cache',
      },
    })

  } catch (err: unknown) {
    console.error('[institution/report]', err)
    return NextResponse.json(
      { error: 'Erreur génération PDF', detail: err instanceof Error ? err.message : String(err) },
      { status: 500 }
    )
  }
}

// ── POST — déclencher un rapport et l'envoyer par email ──────────────────────
export async function POST(req: Request) {
  if (!supabaseAdmin) {
    return NextResponse.json({ error: 'Config manquante' }, { status: 500 })
  }

  try {
    const { slug, year, month, send_email, email_to } = await req.json()
    if (!slug) return NextResponse.json({ error: 'slug requis' }, { status: 400 })

    const origin = new URL(req.url).origin

    // Récupérer le PDF via la route GET
    const pdfRes = await fetch(`${origin}/api/institution/report?slug=${slug}&year=${year || new Date().getFullYear()}&month=${month || new Date().getMonth() + 1}`)
    if (!pdfRes.ok) {
      return NextResponse.json({ error: 'Impossible de générer le PDF' }, { status: 500 })
    }

    const pdfBuffer = await pdfRes.arrayBuffer()
    const pdfBase64 = Buffer.from(pdfBuffer).toString('base64')

    // Envoyer par email si demandé
    if (send_email && email_to) {
      const { sendEmail } = await import('@/lib/email')
      const MONTHS_FR = ['Janvier','Février','Mars','Avril','Mai','Juin','Juillet','Août','Septembre','Octobre','Novembre','Décembre']
      const monthLabel = MONTHS_FR[(month || new Date().getMonth() + 1) - 1]
      const yearVal    = year || new Date().getFullYear()

      await sendEmail({
        to:      email_to,
        subject: `Rapport mensuel Bourse du Temps — ${monthLabel} ${yearVal}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background: linear-gradient(135deg, #1E40AF, #7C3AED); padding: 32px; border-radius: 12px 12px 0 0;">
              <h1 style="color: white; margin: 0; font-size: 20px;">Rapport mensuel</h1>
              <p style="color: #93C5FD; margin: 8px 0 0;">${monthLabel} ${yearVal}</p>
            </div>
            <div style="background: #f8fafc; padding: 24px; border-radius: 0 0 12px 12px; border: 1px solid #e2e8f0;">
              <p style="color: #374151;">Bonjour,</p>
              <p style="color: #374151; line-height: 1.6;">
                Votre rapport mensuel Bourse du Temps pour <strong>${monthLabel} ${yearVal}</strong> est disponible en pièce jointe.
              </p>
              <p style="color: #374151; line-height: 1.6;">
                Il contient vos KPIs membres, échanges, indicateurs ESS et les recommandations automatiques pour le mois prochain.
              </p>
              <p style="color: #6B7280; font-size: 12px; margin-top: 24px;">
                Bourse du Temps · boursedutemps.vercel.app
              </p>
            </div>
          </div>
        `,
      })
    }

    return NextResponse.json({
      ok:         true,
      message:    send_email ? 'Rapport généré et envoyé par email' : 'Rapport généré',
      pdf_base64: send_email ? undefined : pdfBase64.slice(0, 100) + '...',
    })

  } catch (err: unknown) {
    console.error('[institution/report POST]', err)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
