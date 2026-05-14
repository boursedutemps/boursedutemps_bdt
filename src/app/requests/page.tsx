'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

interface Request {
  id: number
  user_id: string
  user_name?: string
  title: string
  description: string
  category?: string
  credit_cost?: number
  status?: string
  created_at: string
}

export default function RequestsPage() {
  const [requests, setRequests] = useState<Request[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  useEffect(() => {
    fetch('/api/requests')
      .then(r => r.json())
      .then(data => setRequests(Array.isArray(data) ? data : data.requests ?? []))
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  const filtered = requests.filter(r =>
    r.title.toLowerCase().includes(search.toLowerCase()) ||
    r.description?.toLowerCase().includes(search.toLowerCase())
  )

  const timeAgo = (dateStr: string) => {
    const diff = Date.now() - new Date(dateStr).getTime()
    const days = Math.floor(diff / 86400000)
    if (days === 0) return "Aujourd'hui"
    if (days === 1) return 'Hier'
    return `il y a ${days} jours`
  }

  return (
    <main className="min-h-screen bg-[#FFFCF7] pt-24 pb-16 px-4">
      <div className="max-w-3xl mx-auto">

        {/* En-tête */}
        <div className="mb-10">
          <p className="text-xs font-semibold tracking-widest uppercase text-amber-500 mb-2">
            Besoins de la communauté
          </p>
          <h1 className="text-3xl font-bold text-slate-800">Demandes en cours</h1>
          <p className="text-slate-500 mt-2">
            Un membre a besoin de vous ? Proposez votre aide et gagnez des crédits.
          </p>
        </div>

        {/* Recherche */}
        <div className="mb-8">
          <input
            type="text"
            placeholder="Rechercher une demande…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full px-4 py-3 rounded-xl text-sm border border-slate-200 bg-white outline-none focus:border-amber-400 transition-colors"
          />
        </div>

        {/* Liste */}
        {loading ? (
          <div className="space-y-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-28 rounded-2xl bg-slate-100 animate-pulse" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20 text-slate-400">
            <p className="text-4xl mb-3">📭</p>
            <p className="font-medium">Aucune demande pour l'instant</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filtered.map(req => (
              <div
                key={req.id}
                className="bg-white rounded-2xl p-5 border border-slate-100 hover:border-amber-200 hover:shadow-sm transition-all duration-200"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-bold text-slate-800">{req.title}</h3>
                      {req.status && req.status !== 'open' && (
                        <span className="text-xs bg-green-50 text-green-700 px-2 py-0.5 rounded-full font-medium">
                          {req.status}
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-slate-500 leading-relaxed line-clamp-2">
                      {req.description}
                    </p>
                    <div className="flex items-center gap-3 mt-3">
                      <span className="text-xs text-slate-400">
                        {req.user_name || 'Membre'} · {timeAgo(req.created_at)}
                      </span>
                      {req.credit_cost && (
                        <span className="text-xs font-semibold text-amber-600">
                          {req.credit_cost} crédit{req.credit_cost > 1 ? 's' : ''}
                        </span>
                      )}
                    </div>
                  </div>
                  <Link
                    href={`/profile?uid=${req.user_id}`}
                    className="flex-shrink-0 px-4 py-2 rounded-xl text-xs font-bold bg-amber-50 text-amber-700 hover:bg-amber-100 transition-colors"
                  >
                    Répondre
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  )
}
