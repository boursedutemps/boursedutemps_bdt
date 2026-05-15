// src/app/api/heatmap/route.ts
// Agrège offres (services) vs demandes (requests) par catégorie

import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabaseAdmin'

export async function GET() {
  if (!supabaseAdmin) {
    return NextResponse.json({ error: 'Configuration serveur manquante' }, { status: 500 })
  }

  try {
    // Utiliser la vue SQL créée en migration
    const { data: balanceData, error: balanceError } = await supabaseAdmin
      .from('skill_balance')
      .select('*')

    if (balanceError) {
      // Fallback manuel si la vue n'est pas encore créée
      const [servicesRes, requestsRes] = await Promise.all([
        supabaseAdmin.from('services').select('category'),
        supabaseAdmin.from('requests').select('category'),
      ])

      const offerMap: Record<string, number>  = {}
      const demandMap: Record<string, number> = {}

      for (const s of servicesRes.data || []) {
        if (s.category) offerMap[s.category] = (offerMap[s.category] || 0) + 1
      }
      for (const r of requestsRes.data || []) {
        if (r.category) demandMap[r.category] = (demandMap[r.category] || 0) + 1
      }

      const allCategories = [...new Set([...Object.keys(offerMap), ...Object.keys(demandMap)])]
      const rows = allCategories.map(cat => ({
        category:     cat,
        offer_count:  offerMap[cat]  || 0,
        demand_count: demandMap[cat] || 0,
        balance:      (offerMap[cat] || 0) - (demandMap[cat] || 0),
      })).sort((a, b) => b.demand_count - a.demand_count)

      return NextResponse.json({ data: rows, source: 'fallback' })
    }

    // Enrichir avec des alertes
    const enriched = (balanceData || []).map(row => ({
      ...row,
      // Alerte si demande > offre de 2x ou plus
      alert: row.demand_count > 0 && row.offer_count < row.demand_count / 2,
      // Surplus si offre > demande de 3x
      surplus: row.offer_count > row.demand_count * 3,
      // Ratio demande/offre pour intensité de la heatmap
      ratio: row.offer_count > 0
        ? Math.round((row.demand_count / row.offer_count) * 100) / 100
        : row.demand_count > 0 ? 99 : 0,
    }))

    return NextResponse.json({ data: enriched, source: 'view' })

  } catch (err: unknown) {
    console.error('[api/heatmap]', err)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
