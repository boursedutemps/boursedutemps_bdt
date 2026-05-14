'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'

interface User {
  uid: string
  name?: string
  first_name?: string
  avatar?: string
  credits?: number
  onboarding_step?: number
  onboarding_completed_at?: string
}

interface Service { id: number; title: string; credit_cost: number; category: string }
interface Transaction { id: number; amount?: number; credit_cost?: number; description?: string; created_at: string; status?: string }
interface Connection { id: number; user_name?: string; created_at: string }

export default function DashboardPage() {
  const [user, setUser]               = useState<User | null>(null)
  const [services, setServices]       = useState<Service[]>([])
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [connections, setConnections] = useState<Connection[]>([])
  const [loading, setLoading]         = useState(true)

  useEffect(() => {
    // Récupérer l'utilisateur connecté
    fetch('/api/auth/me')
      .then(r => r.ok ? r.json() : null)
      .then(async data => {
        if (!data?.user && !data?.uid) return
        const u: User = data.user || data
        setUser(u)

        // Charger les données en parallèle
        await Promise.allSettled([
          fetch(`/api/services?user_id=${u.uid}`)
            .then(r => r.json())
            .then(d => setServices(Array.isArray(d) ? d : d.services ?? [])),
          fetch(`/api/transactions?user_id=${u.uid}`)
            .then(r => r.json())
            .then(d => setTransactions(Array.isArray(d) ? d : d.transactions ?? [])),
          fetch(`/api/connections?user_id=${u.uid}`)
            .then(r => r.json())
            .then(d => setConnections(Array.isArray(d) ? d : d.connections ?? [])),
        ])
      })
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  const displayName = (u: User) =>
    u.first_name || u.name?.split(' ')[0] || 'Membre'

  const totalCreditsSpent = transactions
    .filter(t => (t.amount ?? t.credit_cost ?? 0) < 0)
    .reduce((acc, t) => acc + Math.abs(t.amount ?? t.credit_cost ?? 0), 0)

  const totalCreditsEarned = transactions
    .filter(t => (t.amount ?? t.credit_cost ?? 0) > 0)
    .reduce((acc, t) => acc + (t.amount ?? t.credit_cost ?? 0), 0)

  if (loading) return (
    <main className="min-h-screen bg-[#FFFCF7] pt-24 pb-16 px-4">
      <div className="max-w-4xl mx-auto space-y-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="h-32 rounded-2xl bg-slate-100 animate-pulse" />
        ))}
      </div>
    </main>
  )

  if (!user) return (
    <main className="min-h-screen bg-[#FFFCF7] pt-24 pb-16 px-4 flex items-center justify-center">
      <div className="text-center">
        <p className="text-4xl mb-3">🔒</p>
        <h2 className="font-bold text-slate-800 mb-2">Connexion requise</h2>
        <p className="text-sm text-slate-500 mb-4">Accédez à votre espace personnel</p>
        <Link
          href="/"
          className="px-6 py-3 rounded-xl text-sm font-bold text-white"
          style={{ background: 'linear-gradient(135deg, #F59E0B 0%, #EF4444 100%)' }}
        >
          Se connecter
        </Link>
      </div>
    </main>
  )

  return (
    <main className="min-h-screen bg-[#FFFCF7] pt-24 pb-16 px-4">
      <div className="max-w-4xl mx-auto space-y-6">

        {/* En-tête profil */}
        <div className="bg-white rounded-2xl p-6 border border-slate-100 flex items-center gap-5">
          <div className="w-16 h-16 rounded-2xl overflow-hidden bg-amber-100 flex items-center justify-center flex-shrink-0">
            {user.avatar ? (
              <Image src={user.avatar} alt="avatar" width={64} height={64} className="object-cover w-full h-full" />
            ) : (
              <span className="text-2xl font-bold text-amber-600">
                {displayName(user)[0].toUpperCase()}
              </span>
            )}
          </div>
          <div className="flex-1">
            <h1 className="text-xl font-bold text-slate-800">
              Bonjour, {displayName(user)} 👋
            </h1>
            <p className="text-sm text-slate-500 mt-0.5">Votre espace personnel</p>
          </div>
          <Link
            href={`/profile?uid=${user.uid}`}
            className="px-4 py-2 rounded-xl text-xs font-bold bg-amber-50 text-amber-700 hover:bg-amber-100 transition-colors"
          >
            Voir mon profil →
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { icon: '⏱️', label: 'Crédits disponibles', value: user.credits ?? 0, color: '#F59E0B' },
            { icon: '🛠️', label: 'Services proposés',   value: services.length,      color: '#3B82F6' },
            { icon: '🤝', label: 'Connexions',           value: connections.length,   color: '#10B981' },
            { icon: '🔄', label: 'Échanges réalisés',    value: transactions.length,  color: '#8B5CF6' },
          ].map(stat => (
            <div key={stat.label} className="bg-white rounded-2xl p-5 border border-slate-100 text-center">
              <p className="text-2xl mb-1">{stat.icon}</p>
              <p className="text-2xl font-bold" style={{ color: stat.color }}>{stat.value}</p>
              <p className="text-xs text-slate-400 mt-0.5 leading-tight">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Crédits détail */}
        {transactions.length > 0 && (
          <div className="bg-white rounded-2xl p-6 border border-slate-100">
            <h2 className="font-bold text-slate-800 mb-4">💰 Historique des crédits</h2>
            <div className="flex gap-6 mb-5">
              <div>
                <p className="text-2xl font-bold text-green-600">+{totalCreditsEarned}</p>
                <p className="text-xs text-slate-400">crédits gagnés</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-red-500">−{totalCreditsSpent}</p>
                <p className="text-xs text-slate-400">crédits dépensés</p>
              </div>
            </div>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {transactions.slice(0, 10).map(t => {
                const amount = t.amount ?? t.credit_cost ?? 0
                return (
                  <div key={t.id} className="flex items-center justify-between py-2 border-b border-slate-50">
                    <span className="text-sm text-slate-600">
                      {t.description || 'Échange'}
                    </span>
                    <span className={`text-sm font-bold ${amount >= 0 ? 'text-green-600' : 'text-red-500'}`}>
                      {amount >= 0 ? '+' : ''}{amount}
                    </span>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* Mes services */}
        <div className="bg-white rounded-2xl p-6 border border-slate-100">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-slate-800">🛠️ Mes services</h2>
            <Link href="/services" className="text-xs text-amber-600 hover:text-amber-700 font-semibold">
              Voir tous →
            </Link>
          </div>
          {services.length === 0 ? (
            <p className="text-sm text-slate-400 text-center py-6">
              Vous n'avez pas encore de service proposé.
            </p>
          ) : (
            <div className="space-y-2">
              {services.slice(0, 4).map(s => (
                <div key={s.id} className="flex items-center justify-between py-2 border-b border-slate-50">
                  <span className="text-sm text-slate-700">{s.title}</span>
                  <span className="text-xs bg-amber-50 text-amber-700 px-2 py-0.5 rounded-full font-semibold">
                    {s.credit_cost} crédit/h
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Raccourcis */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {[
            { href: '/services',      icon: '🛠️', label: 'Explorer les services' },
            { href: '/requests',      icon: '📋', label: 'Voir les demandes' },
            { href: '/members',       icon: '👥', label: 'Trouver des membres' },
            { href: '/forum',         icon: '💬', label: 'Aller au forum' },
            { href: '/recherche',     icon: '🤖', label: 'Recherche IA' },
            { href: '/testimonials',  icon: '⭐', label: 'Témoignages' },
          ].map(link => (
            <Link
              key={link.href}
              href={link.href}
              className="bg-white rounded-2xl p-4 border border-slate-100 hover:border-amber-200 hover:shadow-sm transition-all duration-200 flex items-center gap-3"
            >
              <span className="text-xl">{link.icon}</span>
              <span className="text-sm font-semibold text-slate-700">{link.label}</span>
            </Link>
          ))}
        </div>
      </div>
    </main>
  )
}
