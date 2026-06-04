'use client'

// src/app/services/page.tsx

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useUser } from '@/components/UserProvider'

interface Service {
  id: number
  user_id: string
  user_name: string
  title: string
  description: string
  credit_cost: number
  category: string
  created_at: string
}

const CATEGORY_ICONS: Record<string, string> = {
  informatique: '💻', langues: '🌍', arts: '🎨', cuisine: '🍳',
  sport: '⚽', musique: '🎵', bricolage: '🔧', education: '📚',
  sante: '🏥', juridique: '⚖️', autre: '✨',
}

export default function ServicesPage() {
  const { user } = useUser()
  const [services, setServices]   = useState<Service[]>([])
  const [loading, setLoading]     = useState(true)
  const [search, setSearch]       = useState('')
  const [category, setCategory]   = useState('')

  // Modal
  const [selected, setSelected]   = useState<Service | null>(null)
  const [requesting, setRequesting] = useState(false)
  const [feedback, setFeedback]   = useState<{ type: 'success' | 'error'; msg: string } | null>(null)

  useEffect(() => {
    fetch('/api/services')
      .then(r => r.json())
      .then(data => setServices(Array.isArray(data) ? data : data.services ?? []))
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  const filtered = services.filter(s => {
    const matchSearch = s.title.toLowerCase().includes(search.toLowerCase()) ||
      s.description.toLowerCase().includes(search.toLowerCase())
    const matchCat = category ? s.category === category : true
    return matchSearch && matchCat
  })

  const categories = [...new Set(services.map(s => s.category).filter(Boolean))]

  const closeModal = () => {
    if (requesting) return
    setSelected(null)
    setFeedback(null)
  }

  const handleRequest = async () => {
    if (!selected || !user) return
    setRequesting(true)
    setFeedback(null)

    try {
      const res = await fetch('/api/transactions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({
          toId:         selected.user_id,
          serviceTitle: selected.title,
          amount:       selected.credit_cost,
        }),
      })
      const data = await res.json()

      if (!res.ok) {
        const msg = res.status === 402
          ? `Crédits insuffisants — vous avez ${data.credits} crédit(s), ce service en coûte ${data.required}.`
          : data.error || 'Une erreur est survenue.'
        setFeedback({ type: 'error', msg })
      } else {
        setFeedback({ type: 'success', msg: 'Échange initié ✅ Un avis vous sera demandé après la session.' })
        setTimeout(closeModal, 2500)
      }
    } catch {
      setFeedback({ type: 'error', msg: 'Erreur réseau, réessayez.' })
    } finally {
      setRequesting(false)
    }
  }

  return (
    <main className="min-h-screen bg-[#FFFCF7] pt-24 pb-16 px-4">
      <div className="max-w-5xl mx-auto">

        {/* En-tête */}
        <div className="mb-10">
          <p className="text-xs font-semibold tracking-widest uppercase text-amber-700 mb-2">
            Compétences disponibles
          </p>
          <h1 className="text-3xl font-bold text-slate-800">Services proposés</h1>
          <p className="text-slate-500 mt-2">
            Découvrez ce que la communauté peut vous offrir en échange d'une heure de votre temps.
          </p>
        </div>

        {/* Filtres */}
        <div className="flex flex-col sm:flex-row gap-3 mb-8">
          <input
            type="text"
            placeholder="Rechercher un service…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="flex-1 px-4 py-3 rounded-xl text-sm border border-slate-200 bg-white outline-none focus:border-amber-400 transition-colors"
          />
          <select
            value={category}
            onChange={e => setCategory(e.target.value)}
            className="px-4 py-3 rounded-xl text-sm border border-slate-200 bg-white outline-none focus:border-amber-400 transition-colors"
          >
            <option value="">Toutes les catégories</option>
            {categories.map(c => (
              <option key={c} value={c}>
                {CATEGORY_ICONS[c] || '✨'} {c.charAt(0).toUpperCase() + c.slice(1)}
              </option>
            ))}
          </select>
        </div>

        {/* Grille */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-48 rounded-2xl bg-slate-100 animate-pulse" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20 text-slate-400">
            <p className="text-4xl mb-3">🔍</p>
            <p className="font-medium">Aucun service trouvé</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filtered.map(service => (
              <div
                key={service.id}
                className="bg-white rounded-2xl p-5 border border-slate-100 hover:border-amber-200 hover:shadow-md transition-all duration-200 flex flex-col"
              >
                <div className="flex items-start justify-between mb-3">
                  <span className="text-2xl">{CATEGORY_ICONS[service.category] || '✨'}</span>
                  <span className="text-xs font-bold bg-amber-50 text-amber-700 px-2.5 py-1 rounded-full">
                    {service.credit_cost} crédit{service.credit_cost > 1 ? 's' : ''}/h
                  </span>
                </div>
                <h3 className="font-bold text-slate-800 mb-1 leading-snug">{service.title}</h3>
                <p className="text-sm text-slate-500 flex-1 leading-relaxed line-clamp-3">
                  {service.description}
                </p>
                <div className="mt-4 pt-4 border-t border-slate-50 flex items-center justify-between gap-2">
                  <Link
                    href={`/profile?uid=${service.user_id}`}
                    className="text-xs text-slate-500 hover:text-slate-700 transition-colors truncate"
                  >
                    par {service.user_name || 'Membre'}
                  </Link>

                  {/* CTA selon état de connexion */}
                  {!user ? (
                    <Link
                      href="/?auth=login"
                      className="text-xs font-semibold text-amber-600 hover:text-amber-700 transition-colors flex-shrink-0"
                    >
                      Connexion →
                    </Link>
                  ) : user.uid !== service.user_id ? (
                    <button
                      onClick={() => setSelected(service)}
                      className="text-xs font-bold bg-amber-500 hover:bg-amber-600 text-white px-3 py-1.5 rounded-lg transition-colors flex-shrink-0"
                    >
                      Demander →
                    </button>
                  ) : (
                    <span className="text-xs text-slate-400 italic flex-shrink-0">Votre service</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ── Modal de confirmation ────────────────────────────────────────────── */}
      {selected && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-title"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
          onClick={e => { if (e.target === e.currentTarget) closeModal() }}
        >
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6">
            <h2 id="modal-title" className="text-lg font-bold text-slate-800 mb-1">
              Confirmer l'échange
            </h2>
            <p className="text-sm text-slate-500 mb-5">
              Vous demandez ce service à{' '}
              <strong className="text-slate-700">{selected.user_name}</strong>.
            </p>

            {/* Récap */}
            <div className="bg-amber-50 rounded-xl p-4 mb-5 space-y-2.5">
              <div className="flex justify-between text-sm">
                <span className="text-slate-600">Service</span>
                <span className="font-semibold text-slate-800 text-right max-w-[55%] leading-tight">
                  {selected.title}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-600">Coût</span>
                <span className="font-bold text-amber-700">
                  {selected.credit_cost} crédit{selected.credit_cost > 1 ? 's' : ''}
                </span>
              </div>
              <div className="flex justify-between text-sm border-t border-amber-100 pt-2.5">
                <span className="text-slate-600">Vos crédits</span>
                <span className={`font-bold ${
                  (user?.credits ?? 0) >= selected.credit_cost
                    ? 'text-green-700' : 'text-red-600'
                }`}>
                  {user?.credits ?? '—'}
                </span>
              </div>
            </div>

            {/* Feedback */}
            {feedback && (
              <div className={`rounded-xl px-4 py-3 text-sm mb-4 font-medium leading-snug ${
                feedback.type === 'success'
                  ? 'bg-green-50 text-green-700 border border-green-100'
                  : 'bg-red-50 text-red-700 border border-red-100'
              }`}>
                {feedback.msg}
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-3">
              <button
                onClick={closeModal}
                disabled={requesting}
                className="flex-1 py-3 rounded-xl text-sm font-semibold text-slate-600 border border-slate-200 hover:bg-slate-50 transition disabled:opacity-50"
              >
                Annuler
              </button>
              <button
                onClick={handleRequest}
                disabled={requesting || feedback?.type === 'success' || (user?.credits ?? 0) < selected.credit_cost}
                className="flex-1 py-3 rounded-xl text-sm font-bold text-white bg-amber-500 hover:bg-amber-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {requesting ? 'Envoi…' : 'Confirmer'}
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  )
}
