'use client'

// src/app/dashboard/page.tsx — utilise useUser() au lieu de localStorage

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useUser } from '@/components/UserProvider'

interface Service { id: number; title: string; credit_cost: number; category: string }
interface Transaction { id: number; amount?: number; description?: string; created_at: string }

export default function DashboardPage() {
  const { user, isAuthReady } = useUser()
  const [services, setServices]           = useState<Service[]>([])
  const [transactions, setTransactions]   = useState<Transaction[]>([])
  const [loading, setLoading]             = useState(true)

  useEffect(() => {
    if (!isAuthReady) return
    if (!user) { setLoading(false); return }

    const token = localStorage.getItem('token') || ''
    Promise.allSettled([
      fetch(`/api/services?user_id=${user.uid}`, { headers: { Authorization: `Bearer ${token}` } })
        .then(r => r.ok ? r.json() : [])
        .then(d => setServices(Array.isArray(d) ? d : d.services ?? [])),
      fetch(`/api/transactions?user_id=${user.uid}`, { headers: { Authorization: `Bearer ${token}` } })
        .then(r => r.ok ? r.json() : [])
        .then(d => setTransactions(Array.isArray(d) ? d : d.transactions ?? [])),
    ]).finally(() => setLoading(false))
  }, [user, isAuthReady])

  const displayName = () => user?.first_name || user?.firstName || user?.name?.split(' ')[0] || 'Membre'

  // Attendre que l'auth soit prête
  if (!isAuthReady) return (
    <main className="min-h-screen bg-[#FFFCF7] pt-24 flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-amber-400 border-t-transparent rounded-full animate-spin" />
    </main>
  )

  // Non connecté
  if (!user) return (
    <main className="min-h-screen bg-[#FFFCF7] pt-24 pb-16 px-4 flex items-center justify-center">
      <div className="text-center">
        <p className="text-4xl mb-3">🔒</p>
        <h2 className="font-bold text-slate-800 mb-2">Connexion requise</h2>
        <p className="text-sm text-slate-500 mb-4">Accédez à votre espace personnel</p>
        <Link href="/?auth=login"
          className="px-6 py-3 rounded-xl text-sm font-bold text-white"
          style={{ background: 'linear-gradient(135deg, #F59E0B 0%, #EF4444 100%)' }}>
          Se connecter
        </Link>
      </div>
    </main>
  )

  const totalCreditsSpent  = transactions.filter(t => (t.amount ?? 0) < 0).reduce((a, t) => a + Math.abs(t.amount ?? 0), 0)
  const totalCreditsEarned = transactions.filter(t => (t.amount ?? 0) > 0).reduce((a, t) => a + (t.amount ?? 0), 0)

  return (
    <main className="min-h-screen bg-[#FFFCF7] pt-24 pb-16 px-4">
      <div className="max-w-4xl mx-auto space-y-6">

        {/* En-tête profil */}
        <div className="bg-white rounded-2xl p-6 border border-slate-100 flex items-center gap-5">
          <div className="w-16 h-16 rounded-2xl overflow-hidden bg-amber-100 flex items-center justify-center flex-shrink-0">
            {user.avatar ? (
              <Image src={user.avatar} alt="avatar" width={64} height={64} className="object-cover w-full h-full" />
            ) : (
              <span className="text-2xl font-bold text-amber-600">{displayName()[0].toUpperCase()}</span>
            )}
          </div>
          <div className="flex-1">
            <h1 className="text-xl font-bold text-slate-800">Bonjour, {displayName()} 👋</h1>
            <p className="text-sm text-slate-500 mt-0.5">Votre espace personnel</p>
          </div>
          <Link href={`/profile?uid=${user.uid}`}
            className="px-4 py-2 rounded-xl text-xs font-bold bg-amber-50 text-amber-700 hover:bg-amber-100 transition-colors">
            Voir mon profil →
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { icon: '⏱️', label: 'Crédits',    value: user.credits ?? 0,      color: '#F59E0B' },
            { icon: '🛠️', label: 'Services',   value: services.length,        color: '#3B82F6' },
            { icon: '🔄', label: 'Échanges',   value: transactions.length,    color: '#10B981' },
            { icon: '💰', label: 'Crédits gagnés', value: totalCreditsEarned, color: '#8B5CF6' },
          ].map(stat => (
            <div key={stat.label} className="bg-white rounded-2xl p-5 border border-slate-100 text-center">
              <p className="text-2xl mb-1">{stat.icon}</p>
              <p className="text-2xl font-bold" style={{ color: stat.color }}>{stat.value}</p>
              <p className="text-xs text-slate-400 mt-0.5">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Crédits */}
        {transactions.length > 0 && (
          <div className="bg-white rounded-2xl p-6 border border-slate-100">
            <h2 className="font-bold text-slate-800 mb-4">💰 Historique des crédits</h2>
            <div className="flex gap-6 mb-4">
              <div><p className="text-2xl font-bold text-green-600">+{totalCreditsEarned}</p><p className="text-xs text-slate-400">gagnés</p></div>
              <div><p className="text-2xl font-bold text-red-500">−{totalCreditsSpent}</p><p className="text-xs text-slate-400">dépensés</p></div>
            </div>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {transactions.slice(0, 10).map(t => (
                <div key={t.id} className="flex items-center justify-between py-2 border-b border-slate-50">
                  <span className="text-sm text-slate-600">{t.description || 'Échange'}</span>
                  <span className={`text-sm font-bold ${(t.amount ?? 0) >= 0 ? 'text-green-600' : 'text-red-500'}`}>
                    {(t.amount ?? 0) >= 0 ? '+' : ''}{t.amount}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Mes services */}
        <div className="bg-white rounded-2xl p-6 border border-slate-100">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-slate-800">🛠️ Mes services</h2>
            <Link href="/services" className="text-xs text-amber-600 hover:text-amber-700 font-semibold">Voir tous →</Link>
          </div>
          {loading ? (
            <div className="space-y-2">{[...Array(3)].map((_, i) => <div key={i} className="h-10 rounded-xl bg-slate-100 animate-pulse" />)}</div>
          ) : services.length === 0 ? (
            <p className="text-sm text-slate-400 text-center py-6 italic">Vous n'avez pas encore de service proposé.</p>
          ) : (
            <div className="space-y-2">
              {services.slice(0, 4).map(s => (
                <div key={s.id} className="flex items-center justify-between py-2 border-b border-slate-50">
                  <span className="text-sm text-slate-700">{s.title}</span>
                  <span className="text-xs bg-amber-50 text-amber-700 px-2 py-0.5 rounded-full font-semibold">{s.credit_cost} cr/h</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Raccourcis */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {[
            { href: '/services',     icon: '🛠️', label: 'Explorer les services' },
            { href: '/requests',     icon: '📋', label: 'Voir les demandes' },
            { href: '/members',      icon: '👥', label: 'Trouver des membres' },
            { href: '/workshops',    icon: '🎓', label: 'Ateliers collectifs' },
            { href: '/projects',     icon: '🚀', label: 'Projets collaboratifs' },
            { href: '/recherche',    icon: '🤖', label: 'Recherche IA' },
          ].map(link => (
            <Link key={link.href} href={link.href}
              className="bg-white rounded-2xl p-4 border border-slate-100 hover:border-amber-200 hover:shadow-sm transition-all duration-200 flex items-center gap-3">
              <span className="text-xl">{link.icon}</span>
              <span className="text-sm font-semibold text-slate-700">{link.label}</span>
            </Link>
          ))}
        </div>
      </div>
    </main>
  )
}
