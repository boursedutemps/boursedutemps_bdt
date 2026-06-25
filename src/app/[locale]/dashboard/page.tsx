'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useTranslations } from 'next-intl'
import { useUser } from '@/components/UserProvider'

interface Service     { id: number; title: string; credit_cost: number; category: string }
interface Transaction { id: number; amount?: number; description?: string; created_at: string }
interface ReviewPrompt {
  id: number
  transaction_id: string
  reviewee_id: string
  reviewee_name: string
  reviewee_avatar?: string
}

export default function DashboardPage() {
  const t = useTranslations('dashboard')
  const { user, isAuthReady } = useUser()
  const [services, setServices]         = useState<Service[]>([])
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [reviews, setReviews]           = useState<ReviewPrompt[]>([])
  const [loading, setLoading]           = useState(true)
  const [dismissedReviews, setDismissedReviews] = useState<number[]>([])

  useEffect(() => {
    if (!isAuthReady || !user) { setLoading(false); return }
    const token = localStorage.getItem('token') || ''
    const headers = { Authorization: `Bearer ${token}` }

    Promise.allSettled([
      fetch(`/api/services?user_id=${user.uid}`, { headers }).then(r => r.ok ? r.json() : []).then(d => setServices(Array.isArray(d) ? d : d.services ?? [])),
      fetch(`/api/transactions?user_id=${user.uid}`, { headers }).then(r => r.ok ? r.json() : []).then(d => setTransactions(Array.isArray(d) ? d : d.transactions ?? [])),
      fetch(`/api/review-prompts?uid=${user.uid}`).then(r => r.ok ? r.json() : []).then(d => setReviews(Array.isArray(d) ? d : [])),
    ]).finally(() => setLoading(false))
  }, [user, isAuthReady])

  const dismissReview = async (id: number) => {
    setDismissedReviews(prev => [...prev, id])
    await fetch('/api/review-prompts', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, completed: true }),
    })
  }

  const pendingReviews = reviews.filter(r => !dismissedReviews.includes(r.id))
  const displayName = () => user?.first_name || user?.firstName || user?.name?.split(' ')[0] || t('member', { ns: 'common' })

  if (!isAuthReady) return (
    <main className="min-h-screen bg-[#FFFCF7] pt-24 flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-amber-400 border-t-transparent rounded-full animate-spin" />
    </main>
  )

  if (!user) return (
    <main className="min-h-screen bg-[#FFFCF7] pt-24 pb-16 px-4 flex items-center justify-center">
      <div className="text-center">
        <p className="text-4xl mb-3">🔒</p>
        <h2 className="font-bold text-slate-800 mb-2">{t('loginRequired')}</h2>
        <p className="text-sm text-slate-500 mb-4">{t('loginDesc')}</p>
        <Link href="/?auth=login"
          className="px-6 py-3 rounded-xl text-sm font-bold text-white"
          style={{ background: 'linear-gradient(135deg,#F59E0B,#EF4444)' }}>
          {t('login')}
        </Link>
      </div>
    </main>
  )

  const totalCreditsEarned = transactions.filter(t => (t.amount ?? 0) > 0).reduce((a, t) => a + (t.amount ?? 0), 0)
  const totalCreditsSpent  = transactions.filter(t => (t.amount ?? 0) < 0).reduce((a, t) => a + Math.abs(t.amount ?? 0), 0)

  const shortcuts = [
    { href: '/services',  icon: '🛠️', label: t('shortcuts.services') },
    { href: '/requests',  icon: '📋', label: t('shortcuts.requests') },
    { href: '/members',   icon: '👥', label: t('shortcuts.members') },
    { href: '/workshops', icon: '🎓', label: t('shortcuts.workshops') },
    { href: '/projects',  icon: '🚀', label: t('shortcuts.projects') },
    { href: '/recherche', icon: '🤖', label: t('shortcuts.search') },
  ]

  return (
    <main className="min-h-screen bg-[#FFFCF7] pt-24 pb-16 px-4">
      <div className="max-w-4xl mx-auto space-y-6">

        {/* Review prompts */}
        {pendingReviews.length > 0 && (
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5">
            <div className="flex items-center gap-3 mb-3">
              <span className="text-2xl">⭐</span>
              <div>
                <p className="font-bold text-amber-800">{t('reviewsBanner', { count: pendingReviews.length })}</p>
                <p className="text-xs text-amber-600">{t('reviewsDesc')}</p>
              </div>
            </div>
            <div className="space-y-2">
              {pendingReviews.map(r => (
                <div key={r.id}
                  className="flex items-center justify-between bg-white rounded-xl px-4 py-3 border border-amber-100">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center flex-shrink-0 overflow-hidden">
                      {r.reviewee_avatar
                        ? <Image src={r.reviewee_avatar} alt={r.reviewee_name} width={32} height={32} className="object-cover w-full h-full" />
                        : <span className="text-xs font-bold text-amber-600">{r.reviewee_name[0]}</span>}
                    </div>
                    <span className="text-sm font-semibold text-slate-700">
                      {t('rateUser', { name: r.reviewee_name })}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Link
                      href={`/testimonials?to=${r.reviewee_id}`}
                      className="text-xs font-bold px-3 py-1.5 rounded-full text-white"
                      style={{ background: 'linear-gradient(135deg,#F59E0B,#EF4444)' }}>
                      {t('leaveReview')}
                    </Link>
                    <button onClick={() => dismissReview(r.id)}
                      className="text-xs text-slate-400 hover:text-slate-600 px-2 py-1.5 rounded-full hover:bg-slate-100 transition-colors">
                      ✕
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* En-tête profil */}
        <div className="bg-white rounded-2xl p-6 border border-slate-100 flex items-center gap-5">
          <div className="w-16 h-16 rounded-2xl overflow-hidden bg-amber-100 flex items-center justify-center flex-shrink-0">
            {user.avatar
              ? <Image src={user.avatar} alt="avatar" width={64} height={64} className="object-cover w-full h-full" />
              : <span className="text-2xl font-bold text-amber-600">{displayName()[0].toUpperCase()}</span>}
          </div>
          <div className="flex-1">
            <h1 className="text-xl font-bold text-slate-800">{t('greeting', { name: displayName() })}</h1>
            <p className="text-sm text-slate-500 mt-0.5">{t('subtitle')}</p>
          </div>
          <Link href={`/profile?uid=${user.uid}`}
            className="px-4 py-2 rounded-xl text-xs font-bold bg-amber-50 text-amber-700 hover:bg-amber-100 transition-colors">
            {t('myProfile')}
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { icon: '⏱️', label: t('statCredits'),  value: user.credits ?? 0,   color: '#F59E0B' },
            { icon: '🛠️', label: t('statServices'), value: services.length,     color: '#3B82F6' },
            { icon: '🔄', label: t('statExchanges'),value: transactions.length, color: '#10B981' },
            { icon: '💰', label: t('statEarned'),   value: totalCreditsEarned,  color: '#8B5CF6' },
          ].map(stat => (
            <div key={stat.label} className="bg-white rounded-2xl p-5 border border-slate-100 text-center">
              <p className="text-2xl mb-1">{stat.icon}</p>
              <p className="text-2xl font-bold" style={{ color: stat.color }}>{stat.value}</p>
              <p className="text-xs text-slate-400 mt-0.5">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Historique crédits */}
        {transactions.length > 0 && (
          <div className="bg-white rounded-2xl p-6 border border-slate-100">
            <h2 className="font-bold text-slate-800 mb-4">{t('creditHistory')}</h2>
            <div className="flex gap-6 mb-4">
              <div><p className="text-2xl font-bold text-green-600">+{totalCreditsEarned}</p><p className="text-xs text-slate-400">{t('earned')}</p></div>
              <div><p className="text-2xl font-bold text-red-500">−{totalCreditsSpent}</p><p className="text-xs text-slate-400">{t('spent')}</p></div>
            </div>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {transactions.slice(0, 10).map(tx => (
                <div key={tx.id} className="flex items-center justify-between py-2 border-b border-slate-50">
                  <span className="text-sm text-slate-600">{tx.description || t('exchange')}</span>
                  <span className={`text-sm font-bold ${(tx.amount ?? 0) >= 0 ? 'text-green-600' : 'text-red-500'}`}>
                    {(tx.amount ?? 0) >= 0 ? '+' : ''}{tx.amount}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Mes services */}
        <div className="bg-white rounded-2xl p-6 border border-slate-100">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-slate-800">{t('myServices')}</h2>
            <Link href="/services" className="text-xs text-amber-600 hover:text-amber-700 font-semibold">{t('viewAll')}</Link>
          </div>
          {loading ? (
            <div className="space-y-2">{[...Array(3)].map((_, i) => <div key={i} className="h-10 rounded-xl bg-slate-100 animate-pulse" />)}</div>
          ) : services.length === 0 ? (
            <p className="text-sm text-slate-400 text-center py-6 italic">{t('noServices')}</p>
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
          {shortcuts.map(link => (
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
