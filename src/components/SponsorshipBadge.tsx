'use client'
// src/components/SponsorshipBadge.tsx
// Affiche les mécénats actifs — utilisable dans dashboard, profil, home

import { useEffect, useState } from 'react'
import Image from 'next/image'
import { useUser } from '@/components/UserProvider'

interface Sponsorship {
  id: number
  sponsor_name: string
  sponsor_logo?: string
  sponsor_website?: string
  title: string
  description?: string
  category?: string
  hours_offered: number
  hours_used: number
  credit_value: number
  already_used?: boolean
  ends_at?: string
}

export default function SponsorshipBadge() {
  const { user } = useUser()
  const [sponsorships, setSponsorships] = useState<Sponsorship[]>([])
  const [loading, setLoading]           = useState(true)
  const [claiming, setClaiming]         = useState<number | null>(null)
  const [success, setSuccess]           = useState<string | null>(null)

  useEffect(() => {
    const url = user ? `/api/sponsorships?uid=${user.uid}` : '/api/sponsorships'
    fetch(url)
      .then(r => r.json())
      .then(data => setSponsorships(Array.isArray(data) ? data : []))
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [user])

  const handleClaim = async (s: Sponsorship) => {
    if (!user) return
    setClaiming(s.id)
    try {
      const res = await fetch('/api/sponsorships', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'use', sponsorship_id: s.id, user_uid: user.uid, hours: 1 }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      setSuccess(`+${data.credits_added} crédits ajoutés grâce à ${s.sponsor_name} !`)
      setSponsorships(prev => prev.map(x => x.id === s.id ? { ...x, already_used: true, hours_used: x.hours_used + 1 } : x))
      setTimeout(() => setSuccess(null), 4000)
    } catch (e: unknown) {
      setSuccess(e instanceof Error ? e.message : 'Erreur')
    } finally { setClaiming(null) }
  }

  if (loading) return (
    <div className="space-y-3">
      {[...Array(2)].map((_, i) => <div key={i} className="h-20 rounded-2xl bg-slate-100 animate-pulse" />)}
    </div>
  )

  if (sponsorships.length === 0) return null

  return (
    <div>
      {success && (
        <div className="mb-3 text-sm text-green-700 bg-green-50 border border-green-200 px-4 py-3 rounded-xl">
          ✅ {success}
        </div>
      )}
      <div className="space-y-3">
        {sponsorships.map(s => {
          const pct = Math.min(100, Math.round((s.hours_used / s.hours_offered) * 100))
          const remaining = s.hours_offered - s.hours_used
          const isExpired = s.ends_at ? new Date(s.ends_at) < new Date() : false

          return (
            <div key={s.id}
              className="bg-white rounded-2xl border border-slate-100 p-4 hover:border-amber-200 transition-all">
              <div className="flex items-center gap-3">

                {/* Logo sponsor */}
                <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center flex-shrink-0 overflow-hidden border border-slate-200">
                  {s.sponsor_logo
                    ? <Image src={s.sponsor_logo} alt={s.sponsor_name} width={48} height={48} className="object-contain" />
                    : <span className="text-lg font-bold text-slate-400">{s.sponsor_name[0]}</span>}
                </div>

                {/* Infos */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <p className="text-sm font-bold text-slate-800 truncate">{s.title}</p>
                    {s.already_used && (
                      <span className="text-[10px] bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-bold flex-shrink-0">
                        ✓ Utilisé
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-400 truncate">
                    par{' '}
                    {s.sponsor_website
                      ? <a href={s.sponsor_website} target="_blank" rel="noopener noreferrer"
                          className="text-blue-500 hover:underline">{s.sponsor_name}</a>
                      : s.sponsor_name
                    }
                    {' '}· {remaining}h restantes · +{s.credit_value} crédits
                  </p>

                  {/* Barre progression */}
                  <div className="h-1.5 bg-slate-100 rounded-full mt-2 overflow-hidden">
                    <div className="h-full rounded-full transition-all"
                      style={{ width: `${pct}%`, background: pct >= 90 ? '#EF4444' : 'linear-gradient(90deg,#F59E0B,#EF4444)' }} />
                  </div>
                </div>

                {/* Bouton */}
                {user && !s.already_used && !isExpired && remaining > 0 && (
                  <button
                    onClick={() => handleClaim(s)}
                    disabled={claiming === s.id}
                    className="flex-shrink-0 px-3 py-2 rounded-xl text-xs font-bold text-white disabled:opacity-50 transition-all"
                    style={{ background: 'linear-gradient(135deg,#F59E0B,#EF4444)' }}>
                    {claiming === s.id ? '⏳' : 'Obtenir'}
                  </button>
                )}
                {!user && (
                  <a href="/?auth=login"
                    className="flex-shrink-0 px-3 py-2 rounded-xl text-xs font-bold text-amber-700 bg-amber-50 hover:bg-amber-100 transition-colors">
                    Se connecter
                  </a>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
