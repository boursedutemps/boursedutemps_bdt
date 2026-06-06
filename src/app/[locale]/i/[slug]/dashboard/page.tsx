'use client'

// src/app/i/[slug]/dashboard/page.tsx
// Dashboard admin institution avec KPIs temps réel

import { useEffect, useState, useCallback } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'

interface Stats {
  total_members:        number
  new_members:          number
  active_members:       number
  total_exchanges:      number
  total_hours:          number
  avg_rating:           number
  isolation_score:      number
  isolated_count:       number
  diversity_score:      number
  equivalent_value_eur: number
  gender_ratio:         number
  workshops_count:      number
  workshop_attendees:   number
  history:              HistoryPoint[]
  computed_at:          string
}

interface HistoryPoint {
  period_year:          number
  period_month:         number
  total_exchanges:      number
  new_members:          number
  active_members:       number
  equivalent_value_eur: number
}

interface Institution {
  id: number
  slug: string
  name: string
  logo_url?: string
  primary_color: string
  members_count: number
  status: string
}

interface InviteToken {
  token: string
  uses_count: number
  max_uses: number
  expires_at: string
}

const MONTHS = ['Jan','Fév','Mar','Avr','Mai','Jun','Jul','Aoû','Sep','Oct','Nov','Déc']

export default function InstitutionDashboardPage() {
  const { slug } = useParams() as { slug: string }
  const router   = useRouter()

  const [institution, setInstitution] = useState<Institution | null>(null)
  const [stats, setStats]             = useState<Stats | null>(null)
  const [tokens, setTokens]           = useState<InviteToken[]>([])
  const [loading, setLoading]         = useState(true)
  const [generating, setGenerating]   = useState(false)
  const [copiedToken, setCopiedToken] = useState<string | null>(null)

  const fetchData = useCallback(async () => {
    const storedToken = localStorage.getItem('token')
    if (!storedToken) { router.push('/'); return }

    const [instRes, statsRes] = await Promise.all([
      fetch(`/api/institution?slug=${slug}`),
      fetch(`/api/institution/stats?slug=${slug}`),
    ])
    if (!instRes.ok) { router.replace('/404'); return }

    setInstitution(await instRes.json())
    if (statsRes.ok) setStats(await statsRes.json())
    setLoading(false)
  }, [slug, router])

  useEffect(() => { fetchData() }, [fetchData])

  const generateToken = async () => {
    if (!institution) return
    const storedToken = localStorage.getItem('token')
    const meRes  = await fetch('/api/auth/me', { headers: { Authorization: `Bearer ${storedToken}` } })
    const me     = await meRes.json()
    setGenerating(true)
    try {
      const res = await fetch('/api/institution/invite', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action:         'create_token',
          institution_id: institution.id,
          created_by:     me.uid || me.id,
          max_uses:       200,
          days_valid:     30,
        }),
      })
      const data = await res.json()
      if (data.token) {
        setTokens(prev => [{ token: data.token, uses_count: 0, max_uses: 200, expires_at: '' }, ...prev])
      }
    } finally { setGenerating(false) }
  }

  const copyInviteLink = (token: string) => {
    const link = `${window.location.origin}/i/${slug}/join?token=${token}`
    navigator.clipboard.writeText(link)
    setCopiedToken(token)
    setTimeout(() => setCopiedToken(null), 2000)
  }

  const maxExchanges = Math.max(...(stats?.history.map(h => h.total_exchanges) || [1]), 1)

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
    </div>
  )

  if (!institution) return null
  const color = institution.primary_color || '#2563EB'

  return (
    <main className="min-h-screen bg-slate-50 pt-6 pb-16 px-4">
      <div className="max-w-5xl mx-auto space-y-6">

        {/* En-tête */}
        <div className="bg-white rounded-2xl p-6 border border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-4">
            {institution.logo_url ? (
              <div className="relative w-14 h-14 rounded-2xl overflow-hidden shadow">
                <Image src={institution.logo_url} alt={institution.name} fill className="object-cover" />
              </div>
            ) : (
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl font-bold text-white shadow"
                style={{ background: color }}>
                {institution.name[0]}
              </div>
            )}
            <div>
              <h1 className="text-xl font-bold text-slate-800">{institution.name}</h1>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-semibold">
                  ✓ Active
                </span>
                <span className="text-xs text-slate-400">
                  Mise à jour {stats?.computed_at ? new Date(stats.computed_at).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }) : ''}
                </span>
              </div>
            </div>
          </div>
          <div className="flex gap-2">
            <Link href={`/i/${slug}`}
              className="px-4 py-2 rounded-xl text-xs font-semibold border border-slate-200 hover:bg-slate-50 transition">
              Voir la page →
            </Link>
            <button onClick={fetchData}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-white transition"
              style={{ background: color }}>
              ↺ Actualiser
            </button>
          </div>
        </div>

        {/* KPIs principaux */}
        {stats && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { icon:'👥', label:'Membres',         value: stats.total_members,        sub: `+${stats.new_members} ce mois`,  color:'#3B82F6' },
              { icon:'🔄', label:'Échanges',         value: stats.total_exchanges,      sub: `${stats.total_hours}h données`,  color:'#10B981' },
              { icon:'⭐', label:'Note moyenne',     value: `${stats.avg_rating}/5`,    sub: `${stats.active_members} actifs`, color:'#F59E0B' },
              { icon:'💶', label:'Valeur créée',     value: `${stats.equivalent_value_eur}€`, sub: 'au SMIC horaire',        color:'#8B5CF6' },
            ].map(k => (
              <div key={k.label} className="bg-white rounded-2xl p-5 border border-slate-100">
                <p className="text-2xl mb-2">{k.icon}</p>
                <p className="text-2xl font-bold" style={{ color: k.color }}>{k.value}</p>
                <p className="text-xs font-semibold text-slate-600 mt-0.5">{k.label}</p>
                <p className="text-[10px] text-slate-400 mt-0.5">{k.sub}</p>
              </div>
            ))}
          </div>
        )}

        {/* KPIs ESS */}
        {stats && (
          <div className="bg-white rounded-2xl p-6 border border-slate-100">
            <h2 className="font-bold text-slate-800 mb-5">📊 Indicateurs ESS</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">

              {/* Isolement */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="font-semibold text-slate-700">🔴 Score d'isolement</span>
                  <span className="font-bold text-red-500">{stats.isolation_score}%</span>
                </div>
                <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-red-400 rounded-full transition-all"
                    style={{ width: `${stats.isolation_score}%` }} />
                </div>
                <p className="text-xs text-slate-400">
                  {stats.isolated_count} membre{stats.isolated_count > 1 ? 's' : ''} sans échange
                </p>
              </div>

              {/* Diversité */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="font-semibold text-slate-700">🌈 Diversité</span>
                  <span className="font-bold text-blue-500">{stats.diversity_score} catégories</span>
                </div>
                <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-400 rounded-full transition-all"
                    style={{ width: `${Math.min(100, (stats.diversity_score / 11) * 100)}%` }} />
                </div>
                <p className="text-xs text-slate-400">Sur 11 catégories disponibles</p>
              </div>

              {/* Genre */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="font-semibold text-slate-700">⚥ Parité</span>
                  <span className="font-bold" style={{ color }}>{stats.gender_ratio}% femmes</span>
                </div>
                <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full rounded-full transition-all"
                    style={{ width: `${stats.gender_ratio}%`, background: color }} />
                </div>
                <p className="text-xs text-slate-400">
                  {stats.gender_ratio >= 45 && stats.gender_ratio <= 55 ? '✓ Parité atteinte' : 'Objectif : 50%'}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Historique */}
        {stats && stats.history.length > 0 && (
          <div className="bg-white rounded-2xl p-6 border border-slate-100">
            <h2 className="font-bold text-slate-800 mb-5">📈 Évolution des échanges (6 mois)</h2>
            <div className="flex items-end gap-2 h-32">
              {stats.history.map((h, i) => {
                const pct = Math.round((h.total_exchanges / maxExchanges) * 100)
                return (
                  <div key={i} className="flex-1 flex flex-col items-center gap-1">
                    <span className="text-[10px] text-slate-500 font-semibold">{h.total_exchanges}</span>
                    <div className="w-full rounded-t-lg transition-all"
                      style={{ height: `${Math.max(4, pct)}%`, background: color, opacity: i === stats.history.length - 1 ? 1 : 0.5 }} />
                    <span className="text-[9px] text-slate-400">{MONTHS[h.period_month - 1]}</span>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* Liens d'invitation */}
        <div className="bg-white rounded-2xl p-6 border border-slate-100">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-bold text-slate-800">🔗 Liens d'invitation</h2>
            <button onClick={generateToken} disabled={generating}
              className="px-4 py-2 rounded-xl text-xs font-bold text-white transition-all"
              style={{ background: 'linear-gradient(135deg,#F59E0B,#EF4444)', opacity: generating ? 0.7 : 1 }}>
              {generating ? '⏳' : '+ Générer un lien'}
            </button>
          </div>

          {tokens.length === 0 ? (
            <p className="text-sm text-slate-400 text-center py-6 italic">
              Générez un lien pour inviter vos membres
            </p>
          ) : (
            <div className="space-y-3">
              {tokens.map(t => (
                <div key={t.token} className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl">
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-mono text-slate-600 truncate">
                      {window.location.origin}/i/{slug}/join?token={t.token}
                    </p>
                    <p className="text-[10px] text-slate-400 mt-0.5">
                      {t.uses_count}/{t.max_uses} utilisations
                      {t.expires_at && ` · expire le ${new Date(t.expires_at).toLocaleDateString('fr-FR')}`}
                    </p>
                  </div>
                  <button onClick={() => copyInviteLink(t.token)}
                    className="px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex-shrink-0"
                    style={{
                      background: copiedToken === t.token ? '#10B981' : color,
                      color: '#fff',
                    }}>
                    {copiedToken === t.token ? '✓ Copié' : 'Copier'}
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  )
}
