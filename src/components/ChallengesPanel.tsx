'use client'

// src/components/ChallengesPanel.tsx
// Affiche les défis gamifiés de l'utilisateur avec barres de progression

import { useEffect, useState, useCallback } from 'react'

interface Challenge {
  id: number
  title: string
  description: string
  icon: string
  credits_reward: number
  type: string
  condition_key: string
  condition_value: string
}

interface UserChallenge {
  challenge_id: number
  progress: number
  completed_at: string | null
}

interface ChallengeWithProgress extends Challenge {
  progress: number
  completed: boolean
  target: number
}

interface ChallengesPanelProps {
  uid: string
  isOwner?: boolean  // true si c'est le profil de l'utilisateur connecté
}

export default function ChallengesPanel({ uid, isOwner = false }: ChallengesPanelProps) {
  const [challenges, setChallenges] = useState<ChallengeWithProgress[]>([])
  const [loading, setLoading]       = useState(true)
  const [totalCompleted, setTotalCompleted] = useState(0)

  const fetchChallenges = useCallback(async () => {
    try {
      const res = await fetch(`/api/challenges?uid=${uid}`)
      if (!res.ok) return
      const data = await res.json()
      setChallenges(data.challenges || [])
      setTotalCompleted(data.completed || 0)
    } catch (err) {
      console.error('[ChallengesPanel]', err)
    } finally {
      setLoading(false)
    }
  }, [uid])

  useEffect(() => {
    fetchChallenges()
  }, [fetchChallenges])

  if (loading) return (
    <div className="mt-4 space-y-2">
      {[...Array(3)].map((_, i) => (
        <div key={i} className="h-14 rounded-2xl bg-slate-100 animate-pulse" />
      ))}
    </div>
  )

  if (challenges.length === 0) return null

  const completedList  = challenges.filter(c => c.completed)
  const pendingList    = challenges.filter(c => !c.completed)
  const totalCredits   = completedList.reduce((acc, c) => acc + c.credits_reward, 0)

  return (
    <div className="mt-4 bg-gradient-to-b from-amber-50 to-white rounded-[1.5rem] border border-amber-100 p-6">

      {/* En-tête */}
      <div className="flex items-center justify-between mb-5">
        <div>
          <h3 className="font-bold text-slate-800 text-sm">🏆 Défis</h3>
          <p className="text-xs text-slate-400 mt-0.5">
            {totalCompleted}/{challenges.length} complétés · +{totalCredits} crédits gagnés
          </p>
        </div>
        {/* Badge niveau */}
        <div className="text-center">
          <div
            className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold"
            style={{
              background: totalCompleted >= 5 ? 'linear-gradient(135deg,#F59E0B,#EF4444)' :
                          totalCompleted >= 3 ? 'linear-gradient(135deg,#3B82F6,#6366F1)' :
                          'linear-gradient(135deg,#94A3B8,#CBD5E1)',
              color: '#fff',
            }}
          >
            {totalCompleted >= 5 ? '🥇' : totalCompleted >= 3 ? '🥈' : '🥉'}
          </div>
          <p className="text-[9px] text-slate-400 mt-0.5 font-semibold uppercase tracking-wide">
            {totalCompleted >= 5 ? 'Expert' : totalCompleted >= 3 ? 'Actif' : 'Débutant'}
          </p>
        </div>
      </div>

      {/* Barre progression globale */}
      <div className="mb-5">
        <div className="flex justify-between text-xs text-slate-400 mb-1">
          <span>Progression globale</span>
          <span>{Math.round((totalCompleted / challenges.length) * 100)}%</span>
        </div>
        <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-700"
            style={{
              width: `${(totalCompleted / challenges.length) * 100}%`,
              background: 'linear-gradient(90deg, #F59E0B, #EF4444)',
            }}
          />
        </div>
      </div>

      {/* Défis en cours */}
      {pendingList.length > 0 && (
        <div className="space-y-3 mb-4">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">En cours</p>
          {pendingList.map(c => {
            const pct = Math.min(100, Math.round((c.progress / c.target) * 100))
            return (
              <div key={c.id} className="bg-white rounded-xl p-3 border border-slate-100 shadow-sm">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-base">{c.icon}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-slate-700 truncate">{c.title}</p>
                    <p className="text-[10px] text-slate-400 truncate">{c.description}</p>
                  </div>
                  <span className="text-[10px] font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full flex-shrink-0">
                    +{c.credits_reward} cr
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full bg-amber-400 transition-all duration-500"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <span className="text-[10px] text-slate-400 flex-shrink-0">{c.progress}/{c.target}</span>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Défis complétés */}
      {completedList.length > 0 && (
        <div className="space-y-2">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Complétés</p>
          {completedList.map(c => (
            <div key={c.id} className="flex items-center gap-2 py-1.5 px-3 bg-green-50 rounded-xl border border-green-100">
              <span className="text-sm">{c.icon}</span>
              <p className="text-xs font-semibold text-green-700 flex-1">{c.title}</p>
              <span className="text-[10px] text-green-600 font-bold">✓ +{c.credits_reward}</span>
            </div>
          ))}
        </div>
      )}

      {/* Message si tout complété */}
      {pendingList.length === 0 && completedList.length > 0 && (
        <div className="mt-3 text-center">
          <p className="text-xs text-amber-600 font-semibold">🎉 Tous les défis complétés !</p>
          {isOwner && (
            <p className="text-[10px] text-slate-400 mt-0.5">De nouveaux défis arrivent chaque mois</p>
          )}
        </div>
      )}
    </div>
  )
}
