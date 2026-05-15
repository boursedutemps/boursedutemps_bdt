'use client'

// src/components/SkillHeatmap.tsx
// Carte thermique offre vs demande par catégorie

import { useEffect, useState } from 'react'

interface HeatmapRow {
  category:     string
  offer_count:  number
  demand_count: number
  balance:      number
  alert:        boolean
  surplus:      boolean
  ratio:        number
}

const CATEGORY_ICONS: Record<string, string> = {
  informatique: '💻', langues: '🌍', arts: '🎨', cuisine: '🍳',
  sport: '⚽', musique: '🎵', bricolage: '🔧', education: '📚',
  sante: '🏥', juridique: '⚖️', autre: '✨',
}

export default function SkillHeatmap() {
  const [rows, setRows]     = useState<HeatmapRow[]>([])
  const [loading, setLoading] = useState(true)
  const [view, setView]     = useState<'heatmap' | 'bars'>('heatmap')

  useEffect(() => {
    fetch('/api/heatmap')
      .then(r => r.json())
      .then(d => setRows(d.data || []))
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  const maxCount = Math.max(...rows.map(r => Math.max(r.offer_count, r.demand_count)), 1)

  const getAlertColor = (row: HeatmapRow) => {
    if (row.alert)   return { bg: '#FEF2F2', border: '#FECACA', text: '#DC2626', label: '🔴 Forte demande' }
    if (row.surplus) return { bg: '#F0FDF4', border: '#BBF7D0', text: '#16A34A', label: '🟢 Surplus d\'offre' }
    return           { bg: '#F8FAFC',  border: '#E2E8F0', text: '#64748B', label: '⚖️ Équilibré' }
  }

  if (loading) return (
    <div className="space-y-3">
      {[...Array(5)].map((_, i) => (
        <div key={i} className="h-14 rounded-2xl bg-slate-100 animate-pulse" />
      ))}
    </div>
  )

  if (rows.length === 0) return (
    <div className="text-center py-10 text-slate-400">
      <p className="text-3xl mb-2">📊</p>
      <p className="text-sm">Pas encore assez de données</p>
    </div>
  )

  const alerts = rows.filter(r => r.alert)

  return (
    <div className="space-y-6">

      {/* Alertes compétences manquantes */}
      {alerts.length > 0 && (
        <div className="bg-red-50 border border-red-100 rounded-2xl p-4">
          <p className="text-sm font-bold text-red-700 mb-3">
            🚨 Compétences très recherchées — la communauté a besoin de vous !
          </p>
          <div className="flex flex-wrap gap-2">
            {alerts.map(row => (
              <span
                key={row.category}
                className="flex items-center gap-1.5 bg-white border border-red-200 text-red-700 px-3 py-1.5 rounded-full text-xs font-bold"
              >
                {CATEGORY_ICONS[row.category] || '✨'}
                {row.category}
                <span className="bg-red-100 px-1.5 py-0.5 rounded-full text-[10px]">
                  {row.demand_count} demandes
                </span>
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Toggle vue */}
      <div className="flex items-center justify-between">
        <h3 className="font-bold text-slate-800 text-sm">Équilibre offre / demande</h3>
        <div className="flex gap-1 bg-slate-100 p-1 rounded-xl">
          {(['heatmap', 'bars'] as const).map(v => (
            <button
              key={v}
              onClick={() => setView(v)}
              className="px-3 py-1 rounded-lg text-xs font-semibold transition-all"
              style={{
                background: view === v ? '#fff' : 'transparent',
                color: view === v ? '#1E293B' : '#94A3B8',
                boxShadow: view === v ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
              }}
            >
              {v === 'heatmap' ? '🌡️ Carte' : '📊 Barres'}
            </button>
          ))}
        </div>
      </div>

      {/* Légende */}
      <div className="flex gap-4 text-xs text-slate-500">
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-sm bg-emerald-400 inline-block" />
          Offres
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-sm bg-amber-400 inline-block" />
          Demandes
        </span>
        <span className="flex items-center gap-1.5">
          🔴 Forte demande non couverte
        </span>
      </div>

      {/* Vue Heatmap */}
      {view === 'heatmap' && (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {rows.map(row => {
            const { bg, border, text, label } = getAlertColor(row)
            const intensity = Math.round((row.demand_count / maxCount) * 100)
            return (
              <div
                key={row.category}
                className="rounded-2xl p-4 border transition-all hover:shadow-md cursor-default"
                style={{ background: bg, borderColor: border }}
              >
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-lg">{CATEGORY_ICONS[row.category] || '✨'}</span>
                  <span className="text-xs font-bold text-slate-700 capitalize">{row.category}</span>
                </div>

                {/* Barre de chaleur */}
                <div
                  className="h-2 rounded-full mb-2 transition-all"
                  style={{
                    background: row.alert
                      ? `linear-gradient(90deg, #F87171 ${intensity}%, #FEE2E2 ${intensity}%)`
                      : row.surplus
                        ? `linear-gradient(90deg, #34D399 ${intensity}%, #D1FAE5 ${intensity}%)`
                        : `linear-gradient(90deg, #FBBF24 ${intensity}%, #FEF3C7 ${intensity}%)`,
                  }}
                />

                <div className="flex justify-between text-[10px]">
                  <span className="text-emerald-600 font-semibold">↑ {row.offer_count}</span>
                  <span className="text-amber-600 font-semibold">↓ {row.demand_count}</span>
                </div>
                <p className="text-[9px] mt-1 font-semibold" style={{ color: text }}>{label}</p>
              </div>
            )
          })}
        </div>
      )}

      {/* Vue Barres */}
      {view === 'bars' && (
        <div className="space-y-3">
          {rows.map(row => (
            <div key={row.category} className="space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-slate-700 flex items-center gap-1.5">
                  {CATEGORY_ICONS[row.category] || '✨'}
                  <span className="capitalize">{row.category}</span>
                  {row.alert && (
                    <span className="text-[10px] bg-red-100 text-red-600 px-1.5 py-0.5 rounded-full font-bold">
                      Cherché
                    </span>
                  )}
                </span>
                <span className="text-xs text-slate-400">
                  {row.offer_count} offres · {row.demand_count} demandes
                </span>
              </div>
              <div className="flex gap-1 h-3">
                <div
                  className="rounded-l-full bg-emerald-400 transition-all"
                  style={{ width: `${(row.offer_count / maxCount) * 50}%`, minWidth: row.offer_count > 0 ? '4px' : '0' }}
                />
                <div
                  className="rounded-r-full bg-amber-400 transition-all"
                  style={{ width: `${(row.demand_count / maxCount) * 50}%`, minWidth: row.demand_count > 0 ? '4px' : '0' }}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
