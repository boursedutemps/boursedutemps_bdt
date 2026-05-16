// src/app/api/institution/stats/route.ts
// Calcule les KPIs temps réel d'une institution

import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabaseAdmin'

const SMIC_HORAIRE = 11.88 // € (France 2024)

export async function GET(req: Request) {
  if (!supabaseAdmin) return NextResponse.json({ error: 'Config manquante' }, { status: 500 })

  const { searchParams } = new URL(req.url)
  const institutionId = searchParams.get('institution_id')
  const slug          = searchParams.get('slug')

  if (!institutionId && !slug) {
    return NextResponse.json({ error: 'institution_id ou slug requis' }, { status: 400 })
  }

  try {
    // Résoudre l'ID si slug fourni
    let instId = institutionId ? parseInt(institutionId) : null
    if (!instId && slug) {
      const { data } = await supabaseAdmin
        .from('institutions').select('id').eq('slug', slug).single()
      instId = data?.id ?? null
    }
    if (!instId) return NextResponse.json({ error: 'Institution introuvable' }, { status: 404 })

    // ── Membres ────────────────────────────────────────────────────────────
    const { data: members } = await supabaseAdmin
      .from('institution_members')
      .select('user_uid, role, joined_at, status')
      .eq('institution_id', instId)
      .eq('status', 'active')

    const memberUids = (members || []).map(m => m.user_uid)
    const totalMembers = memberUids.length

    // Nouveaux membres ce mois
    const now = new Date()
    const firstOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString()
    const newMembers = (members || []).filter(m => m.joined_at >= firstOfMonth).length

    // ── Échanges ───────────────────────────────────────────────────────────
    let totalExchanges = 0
    let totalHours     = 0
    let activeMembers  = new Set<string>()

    if (memberUids.length > 0) {
      const { data: transactions } = await supabaseAdmin
        .from('transactions')
        .select('from_user_id, to_user_id, amount, created_at')
        .or(`from_user_id.in.(${memberUids.join(',')}),to_user_id.in.(${memberUids.join(',')})`)

      totalExchanges = (transactions || []).length
      totalHours     = (transactions || []).reduce((acc, t) => acc + (t.amount || 0), 0)

      for (const t of transactions || []) {
        if (memberUids.includes(t.from_user_id)) activeMembers.add(t.from_user_id)
        if (memberUids.includes(t.to_user_id))   activeMembers.add(t.to_user_id)
      }
    }

    // ── KPIs ESS ───────────────────────────────────────────────────────────

    // Score d'isolement : % membres sans aucun échange
    const isolatedCount   = totalMembers - activeMembers.size
    const isolationScore  = totalMembers > 0
      ? Math.round((isolatedCount / totalMembers) * 100)
      : 0

    // Valeur équivalente €
    const equivalentValueEur = Math.round(totalHours * SMIC_HORAIRE)

    // Score de diversité : nb catégories de services distinctes parmi les membres
    let diversityScore = 0
    if (memberUids.length > 0) {
      const { data: services } = await supabaseAdmin
        .from('services')
        .select('category')
        .in('user_id', memberUids)
      const categories = new Set((services || []).map(s => s.category).filter(Boolean))
      diversityScore = categories.size
    }

    // Ratio genre
    let genderRatio = 0
    if (memberUids.length > 0) {
      const { data: userGenders } = await supabaseAdmin
        .from('users')
        .select('gender')
        .in('uid', memberUids)
      const femmes = (userGenders || []).filter(u => u.gender === 'Femme').length
      genderRatio = totalMembers > 0 ? Math.round((femmes / totalMembers) * 100) : 0
    }

    // Note moyenne des échanges intra-institution
    let avgRating = 0
    if (memberUids.length > 0) {
      const { data: testimonials } = await supabaseAdmin
        .from('testimonials')
        .select('rating')
        .in('to_user_id', memberUids)
        .not('rating', 'is', null)

      if (testimonials && testimonials.length > 0) {
        avgRating = testimonials.reduce((acc, t) => acc + (t.rating || 0), 0) / testimonials.length
        avgRating = Math.round(avgRating * 10) / 10
      }
    }

    // ── Ateliers ───────────────────────────────────────────────────────────
    let workshopsCount   = 0
    let workshopAttendees = 0
    if (memberUids.length > 0) {
      const { data: workshops } = await supabaseAdmin
        .from('workshops')
        .select('id')
        .in('host_id', memberUids)
      workshopsCount = (workshops || []).length

      if (workshopsCount > 0) {
        const workshopIds = (workshops || []).map(w => w.id)
        const { count } = await supabaseAdmin
          .from('workshop_participants')
          .select('*', { count: 'exact', head: true })
          .in('workshop_id', workshopIds)
        workshopAttendees = count || 0
      }
    }

    // ── Snapshot mensuel ───────────────────────────────────────────────────
    await supabaseAdmin.from('institution_kpis').upsert({
      institution_id:       instId,
      period_year:          now.getFullYear(),
      period_month:         now.getMonth() + 1,
      total_members:        totalMembers,
      new_members:          newMembers,
      active_members:       activeMembers.size,
      retention_rate:       totalMembers > 0 ? Math.round((activeMembers.size / totalMembers) * 100) : 0,
      total_exchanges:      totalExchanges,
      total_hours:          totalHours,
      avg_rating:           avgRating,
      isolation_score:      isolationScore,
      diversity_score:      diversityScore,
      equivalent_value_eur: equivalentValueEur,
      gender_ratio:         genderRatio,
      workshops_count:      workshopsCount,
      workshop_attendees:   workshopAttendees,
    }, { onConflict: 'institution_id,period_year,period_month' })

    // ── Historique 6 mois ──────────────────────────────────────────────────
    const { data: history } = await supabaseAdmin
      .from('institution_kpis')
      .select('period_year, period_month, total_exchanges, new_members, active_members, equivalent_value_eur')
      .eq('institution_id', instId)
      .order('period_year', { ascending: false })
      .order('period_month', { ascending: false })
      .limit(6)

    return NextResponse.json({
      // Temps réel
      total_members:        totalMembers,
      new_members:          newMembers,
      active_members:       activeMembers.size,
      total_exchanges:      totalExchanges,
      total_hours:          totalHours,
      avg_rating:           avgRating,
      // KPIs ESS
      isolation_score:      isolationScore,
      isolated_count:       isolatedCount,
      diversity_score:      diversityScore,
      equivalent_value_eur: equivalentValueEur,
      gender_ratio:         genderRatio,
      // Ateliers
      workshops_count:      workshopsCount,
      workshop_attendees:   workshopAttendees,
      // Historique
      history:              (history || []).reverse(),
      // Meta
      smic_horaire:         SMIC_HORAIRE,
      computed_at:          now.toISOString(),
    })

  } catch (err) {
    console.error('[institution/stats]', err)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
