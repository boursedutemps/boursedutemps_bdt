'use client'

// src/components/ReputationBadges.tsx
// Affiche le score de réputation + badges sur le profil

import { useEffect, useState, useCallback } from 'react'

interface Badge {
  id: number
  slug: string
  title: string
  description: string
  icon: string
  color: string
  category: string
  condition_value: number
  earned: boolean
  earned_at: string | null
  progress: number
  current: number
}

interface ReputationData {
  reputation_score: number
  reputation_level: 'bronze' | 'argent' | 'or' | 'expert'
  badges: Badge[]
  avg_rating: number
  testimonials_count: number
}

const LEVEL_CONFIG = {
  bronze: { label: 'Bronze',  color: '#CD7F32', bg: '#FDF3E7', next: 50,  icon: '🥉' },
  argent: { label: 'Argent',  color: '#94A3B8', bg: '#F1F5F9', next: 150, icon: '🥈' },
  or:     { label: 'Or',      color: '#F59E0B', bg: '#FEF3C7', next: 300, icon: '🥇' },
  expert: { label: 'Expert',  color: '#8B5CF6', bg: '#F5F3FF', next: 300, icon: '👑' },
}

const CATEGORY_LABELS: Record<string, string> = {
  echange:   '🔄 Échanges',
  social:    '👥 Social',
  profil:    '📋 Profil',
  fidelite:  '🔥 Fidélité',
  excellence:'⭐ Excellence',
}

export default function ReputationBadges({ uid, isOwner = false }: { uid: string; isOwner?: boolean }) {
  const [data, setData]       = useState<ReputationData | null>(null)
  const [loading, setLoading] = useState(true)
  const [tab, setTab]         = useState<'earned' | 'all'>('earned')
  const [newBadge, setNewBadge] = useState<Badge | null>(null)

  const fetchData = useCallback(async () => {
    try {
      const res = await fetch(`/api/badges?uid=${uid}`)
      if (!res.ok) return
      const json = await res.json()
      setData(json)

      // Notification si nouveau badge
      if (json.newly_earned?.length > 0 && isOwner) {
        const newOne = json.badges.find((b: Badge) => json.newly_earned.includes(b.id))
        if (newOne) {
          setNewBadge(newOne)
          setTimeout(() => setNewBadge(null), 4000)
        }
      }
    } catch (err) {
      console.error('[ReputationBadges]', err)
    } finally {
      setLoading(false)
    }
  }, [uid, isOwner])

  useEffect(() => { fetchData() }, [fetchData])

  if (loading) return (
    <div className="space-y-3 mt-4">
      {[...Array(2)].map((_, i) => (
        <div key={i} className="h-16 rounded-2xl bg-slate-100 animate-pulse" />
      ))}
    </div>
  )

  if (!data) return null

  const level      = LEVEL_CONFIG[data.reputation_level]
  const earnedList = data.badges.filter(b => b.earned)
  const pendingList= data.badges.filter(b => !b.earned)
  const displayed  = tab === 'earned' ? earnedList : data.badges

  // Progression vers le niveau suivant
  const levelProgress = data.reputation_level === 'expert' ? 100 :
    Math.min(100, Math.round((data.reputation_score / level.next) * 100))

  return (
    <>
      {/* ── Notification nouveau badge ── */}
      {newBadge && (
        <div className="fixed bottom-8 right-8 z-50 animate-bounce">
          <div className="bg-slate-900 text-white px-5 py-4 rounded-2xl shadow-2xl flex items-center gap-3 border border-white/10">
            <span className="text-2xl">{newBadge.icon}</span>
            <div>
              <p className="text-xs text-slate-400 font-semibold">Nouveau badge !</p>
              <p className="text-sm font-bold">{newBadge.title}</p>
            </div>
          </div>
        </div>
      )}

      <div className="mt-4 rounded-[1.5rem] border border-slate-100 overflow-hidden bg-white">

        {/* ── Score de réputation ── */}
        <div className="p-5" style={{ background: level.bg }}>
          <div className="flex items-center justify-between mb-3">
            <div>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-0.5">
                Réputation
              </p>
              <div className="flex items-center gap-2">
                <span className="text-2xl">{level.icon}</span>
                <span className="text-xl font-bold" style={{ color: level.color }}>
                  {level.label}
                </span>
              </div>
            </div>
            <div className="text-right">
              <p className="text-3xl font-bold text-slate-800">{data.reputation_score}</p>
              <p className="text-xs text-slate-400">points</p>
            </div>
          </div>

          {/* Barre vers niveau suivant */}
          {data.reputation_level !== 'expert' && (
            <div>
              <div className="flex justify-between text-xs text-slate-400 mb-1">
                <span>Vers {LEVEL_CONFIG[
                  data.reputation_level === 'bronze' ? 'argent' :
                  data.reputation_level === 'argent' ? 'or' : 'expert'
                ].label}</span>
                <span>{data.reputation_score}/{level.next} pts</span>
              </div>
              <div className="h-2 bg-white/60 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-700"
                  style={{ width: `${levelProgress}%`, background: level.color }}
                />
              </div>
            </div>
          )}

          {/* Note moyenne */}
          {data.testimonials_count > 0 && (
            <div className="flex items-center gap-2 mt-3 pt-3 border-t border-black/5">
              <div className="flex gap-0.5">
                {[1,2,3,4,5].map(s => (
                  <span key={s} className="text-sm" style={{ opacity: s <= Math.round(data.avg_rating) ? 1 : 0.25 }}>
                    ★
                  </span>
                ))}
              </div>
              <span className="text-sm font-bold text-slate-700">{data.avg_rating}/5</span>
              <span className="text-xs text-slate-400">({data.testimonials_count} avis)</span>
            </div>
          )}
        </div>

        {/* ── Badges ── */}
        <div className="p-5">
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm font-bold text-slate-700">
              🏅 Badges ({earnedList.length}/{data.badges.length})
            </p>
            <div className="flex gap-1 bg-slate-100 p-1 rounded-xl">
              {(['earned', 'all'] as const).map(t => (
                <button
                  key={t}
                  onClick={() => setTab(t)}
                  className="px-3 py-1 rounded-lg text-xs font-semibold transition-all"
                  style={{
                    background: tab === t ? '#fff' : 'transparent',
                    color: tab === t ? '#1E293B' : '#94A3B8',
                    boxShadow: tab === t ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
                  }}
                >
                  {t === 'earned' ? 'Obtenus' : 'Tous'}
                </button>
              ))}
            </div>
          </div>

          {displayed.length === 0 ? (
            <p className="text-xs text-slate-400 text-center py-4 italic">
              {tab === 'earned'
                ? 'Aucun badge encore — commencez à échanger !'
                : 'Aucun badge disponible'}
            </p>
          ) : (
            <div className="space-y-2">
              {displayed.map(badge => (
                <div
                  key={badge.id}
                  className="flex items-center gap-3 p-3 rounded-xl transition-all"
                  style={{
                    background: badge.earned ? `${badge.color}10` : '#F8FAFC',
                    border: badge.earned ? `1px solid ${badge.color}30` : '1px solid #F1F5F9',
                    opacity: badge.earned ? 1 : 0.6,
                  }}
                >
                  <span className="text-xl flex-shrink-0" style={{ filter: badge.earned ? 'none' : 'grayscale(1)' }}>
                    {badge.icon}
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-xs font-bold text-slate-700 truncate">{badge.title}</p>
                      {badge.earned && (
                        <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full flex-shrink-0"
                          style={{ background: badge.color, color: '#fff' }}>
                          ✓
                        </span>
                      )}
                    </div>
                    <p className="text-[10px] text-slate-400 truncate">{badge.description}</p>
                    {!badge.earned && isOwner && (
                      <div className="flex items-center gap-1.5 mt-1">
                        <div className="flex-1 h-1 bg-slate-200 rounded-full overflow-hidden">
                          <div
                            className="h-full rounded-full"
                            style={{ width: `${badge.progress}%`, background: badge.color }}
                          />
                        </div>
                        <span className="text-[9px] text-slate-400">{badge.current}/{badge.condition_value}</span>
                      </div>
                    )}
                  </div>
                  {badge.earned && badge.earned_at && (
                    <span className="text-[9px] text-slate-400 flex-shrink-0">
                      {new Date(badge.earned_at).toLocaleDateString('fr-FR', { month: 'short', year: '2-digit' })}
                    </span>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Catégories résumé */}
          {tab === 'all' && (
            <div className="mt-4 pt-4 border-t border-slate-50 flex flex-wrap gap-2">
              {Object.entries(CATEGORY_LABELS).map(([key, label]) => {
                const count = earnedList.filter(b => b.category === key).length
                const total = data.badges.filter(b => b.category === key).length
                return (
                  <span key={key} className="text-[10px] bg-slate-100 text-slate-500 px-2 py-1 rounded-lg font-medium">
                    {label} {count}/{total}
                  </span>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </>
  )
}
