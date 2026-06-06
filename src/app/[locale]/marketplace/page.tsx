'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

interface Service {
  id: number
  user_id: string
  user_name?: string
  title: string
  description: string
  credit_cost: number
  category?: string
  created_at: string
}

interface Request {
  id: number
  user_id: string
  user_name?: string
  title: string
  description: string
  credit_cost?: number
  category?: string
  created_at: string
}

const CATEGORY_ICONS: Record<string, string> = {
  informatique: '💻', langues: '🌍', arts: '🎨', cuisine: '🍳',
  sport: '⚽', musique: '🎵', bricolage: '🔧', education: '📚',
  sante: '🏥', juridique: '⚖️', autre: '✨',
}

type Tab = 'services' | 'requests'

export default function MarketplacePage() {
  const [tab, setTab]           = useState<Tab>('services')
  const [services, setServices] = useState<Service[]>([])
  const [requests, setRequests] = useState<Request[]>([])
  const [loading, setLoading]   = useState(true)
  const [search, setSearch]     = useState('')
  const [category, setCategory] = useState('')

  useEffect(() => {
    setLoading(true)
    Promise.allSettled([
      fetch('/api/services').then(r => r.json()).then(d => setServices(Array.isArray(d) ? d : d.services ?? [])),
      fetch('/api/requests').then(r => r.json()).then(d => setRequests(Array.isArray(d) ? d : d.requests ?? [])),
    ]).finally(() => setLoading(false))
  }, [])

  const allCategories = [...new Set([
    ...services.map(s => s.category),
    ...requests.map(r => r.category),
  ].filter(Boolean) as string[])]

  const filteredServices = services.filter(s => {
    const q = search.toLowerCase()
    const matchQ = s.title.toLowerCase().includes(q) || s.description.toLowerCase().includes(q)
    return matchQ && (category ? s.category === category : true)
  })

  const filteredRequests = requests.filter(r => {
    const q = search.toLowerCase()
    const matchQ = r.title.toLowerCase().includes(q) || r.description?.toLowerCase().includes(q)
    return matchQ && (category ? r.category === category : true)
  })

  const items = tab === 'services' ? filteredServices : filteredRequests

  return (
    <main className="min-h-screen bg-[#FFFCF7] pt-24 pb-16 px-4">
      <div className="max-w-5xl mx-auto">

        {/* En-tête */}
        <div className="mb-8">
          <p className="text-xs font-semibold tracking-widest uppercase text-amber-500 mb-2">
            Offres & Demandes
          </p>
          <h1 className="text-3xl font-bold text-slate-800">Marketplace</h1>
          <p className="text-slate-500 mt-2">
            Trouvez une compétence ou proposez la vôtre. 1h donnée = 1h reçue.
          </p>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 bg-slate-100 p-1 rounded-2xl w-fit">
          {(['services', 'requests'] as Tab[]).map(t => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className="px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200"
              style={{
                background: tab === t ? '#fff' : 'transparent',
                color: tab === t ? '#B45309' : '#64748B',
                boxShadow: tab === t ? '0 1px 4px rgba(0,0,0,0.08)' : 'none',
              }}
            >
              {t === 'services'
                ? `🛠️ Services (${services.length})`
                : `📋 Demandes (${requests.length})`}
            </button>
          ))}
        </div>

        {/* Filtres */}
        <div className="flex flex-col sm:flex-row gap-3 mb-8">
          <input
            type="text"
            placeholder={tab === 'services' ? 'Rechercher un service…' : 'Rechercher une demande…'}
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="flex-1 px-4 py-3 rounded-xl text-sm border border-slate-200 bg-white outline-none focus:border-amber-400 transition-colors"
          />
          <select
            value={category}
            onChange={e => setCategory(e.target.value)}
            className="px-4 py-3 rounded-xl text-sm border border-slate-200 bg-white outline-none focus:border-amber-400 transition-colors"
          >
            <option value="">Toutes catégories</option>
            {allCategories.map(c => (
              <option key={c} value={c}>
                {CATEGORY_ICONS[c] || '✨'} {c.charAt(0).toUpperCase() + c.slice(1)}
              </option>
            ))}
          </select>
        </div>

        {/* Contenu */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-48 rounded-2xl bg-slate-100 animate-pulse" />
            ))}
          </div>
        ) : items.length === 0 ? (
          <div className="text-center py-20 text-slate-400">
            <p className="text-4xl mb-3">🔍</p>
            <p className="font-medium">Aucun résultat</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {items.map(item => (
              <div
                key={item.id}
                className="bg-white rounded-2xl p-5 border border-slate-100 hover:border-amber-200 hover:shadow-md transition-all duration-200 flex flex-col"
              >
                <div className="flex items-start justify-between mb-3">
                  <span className="text-2xl">
                    {CATEGORY_ICONS[item.category || ''] || (tab === 'services' ? '🛠️' : '📋')}
                  </span>
                  <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                    tab === 'services'
                      ? 'bg-amber-50 text-amber-700'
                      : 'bg-blue-50 text-blue-700'
                  }`}>
                    {tab === 'services' ? 'Offre' : 'Demande'}
                  </span>
                </div>

                <h3 className="font-bold text-slate-800 mb-1 leading-snug">{item.title}</h3>
                <p className="text-sm text-slate-500 flex-1 leading-relaxed line-clamp-3">
                  {item.description}
                </p>

                <div className="mt-4 pt-4 border-t border-slate-50 flex items-center justify-between">
                  <div>
                    <span className="text-xs text-slate-400">par {item.user_name || 'Membre'}</span>
                    {item.credit_cost && (
                      <span className="ml-2 text-xs font-semibold text-amber-600">
                        · {item.credit_cost} cr/h
                      </span>
                    )}
                  </div>
                  <Link
                    href={`/profile?uid=${item.user_id}`}
                    className="text-xs font-semibold text-amber-600 hover:text-amber-700 transition-colors"
                  >
                    Contacter →
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
