'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useTranslations } from 'next-intl'

interface Module {
  id: number
  slug: string
  title: string
  description: string
  icon: string
  category: string
  tags?: string[]
  services_count: number
  members_count: number
  is_featured: boolean
}

const CATEGORY_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  langues:      { bg: '#EFF6FF', text: '#2563EB', border: '#BFDBFE' },
  informatique: { bg: '#F0FDF4', text: '#16A34A', border: '#BBF7D0' },
  arts:         { bg: '#FFF7ED', text: '#EA580C', border: '#FED7AA' },
  cuisine:      { bg: '#FEF3C7', text: '#D97706', border: '#FDE68A' },
  sante:        { bg: '#F0FDF4', text: '#059669', border: '#A7F3D0' },
  education:    { bg: '#F5F3FF', text: '#7C3AED', border: '#DDD6FE' },
  autre:        { bg: '#F8FAFC', text: '#475569', border: '#E2E8F0' },
}

export default function ModulesPage() {
  const t = useTranslations('modules')
  const [modules, setModules] = useState<Module[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch]   = useState('')
  const [category, setCategory] = useState('')

  useEffect(() => {
    fetch('/api/modules')
      .then(r => r.json())
      .then(data => setModules(Array.isArray(data) ? data : []))
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  const categories = [...new Set(modules.map(m => m.category))]
  const featured   = modules.filter(m => m.is_featured)
  const filtered   = modules.filter(m => {
    const q = search.toLowerCase()
    const matchQ = m.title.toLowerCase().includes(q) || m.description.toLowerCase().includes(q)
    return matchQ && (category ? m.category === category : true)
  })

  return (
    <main className="min-h-screen bg-[#FFFCF7] pt-24 pb-16 px-4">
      <div className="max-w-5xl mx-auto">

        <div className="mb-10">
          <p className="text-xs font-semibold tracking-widest uppercase text-amber-500 mb-2">
            {t('label')}
          </p>
          <h1 className="text-3xl font-bold text-slate-800">{t('title')}</h1>
          <p className="text-slate-500 mt-2">{t('subtitle')}</p>
        </div>

        {!search && !category && featured.length > 0 && (
          <div className="mb-10">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">⭐ {t('featured')}</p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {featured.slice(0, 3).map(m => {
                const colors = CATEGORY_COLORS[m.category] || CATEGORY_COLORS.autre
                return (
                  <Link key={m.id} href={`/modules/${m.slug}`}
                    className="rounded-2xl p-6 border hover:shadow-md transition-all duration-200 group"
                    style={{ background: colors.bg, borderColor: colors.border }}>
                    <p className="text-4xl mb-3">{m.icon}</p>
                    <h3 className="font-bold text-slate-800 mb-1 group-hover:text-blue-600 transition-colors">
                      {m.title}
                    </h3>
                    <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">{m.description}</p>
                    <div className="flex items-center gap-3 mt-4">
                      <span className="text-xs font-semibold" style={{ color: colors.text }}>
                        {t(m.services_count > 1 ? 'services' : 'service', { count: m.services_count })}
                      </span>
                      <span className="text-xs text-slate-400">→</span>
                    </div>
                  </Link>
                )
              })}
            </div>
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-3 mb-8">
          <input type="text" value={search} onChange={e => setSearch(e.target.value)}
            placeholder={t('searchPlaceholder')}
            className="flex-1 px-4 py-3 rounded-xl text-sm border border-slate-200 bg-white outline-none focus:border-amber-400 transition-colors" />
          <select value={category} onChange={e => setCategory(e.target.value)}
            className="px-4 py-3 rounded-xl text-sm border border-slate-200 bg-white outline-none focus:border-amber-400 transition-colors">
            <option value="">{t('allCategories')}</option>
            {categories.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[...Array(6)].map((_, i) => <div key={i} className="h-44 rounded-2xl bg-slate-100 animate-pulse" />)}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20 text-slate-400">
            <p className="text-4xl mb-3">📚</p>
            <p>{t('noResults')}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filtered.map(m => {
              const colors = CATEGORY_COLORS[m.category] || CATEGORY_COLORS.autre
              return (
                <Link key={m.id} href={`/modules/${m.slug}`}
                  className="bg-white rounded-2xl p-5 border border-slate-100 hover:border-amber-200 hover:shadow-md transition-all duration-200 flex flex-col group">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-3xl">{m.icon}</span>
                    <span className="text-xs font-semibold px-2.5 py-1 rounded-full capitalize"
                      style={{ background: colors.bg, color: colors.text, border: `1px solid ${colors.border}` }}>
                      {m.category}
                    </span>
                  </div>
                  <h3 className="font-bold text-slate-800 mb-2 group-hover:text-amber-700 transition-colors">
                    {m.title}
                  </h3>
                  <p className="text-sm text-slate-500 flex-1 line-clamp-2 leading-relaxed">{m.description}</p>
                  {m.tags && m.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-3">
                      {m.tags.slice(0, 3).map(tag => (
                        <span key={tag} className="text-[10px] bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full">{tag}</span>
                      ))}
                    </div>
                  )}
                  <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-50">
                    <span className="text-xs text-slate-400">
                      {t(m.services_count > 1 ? 'services' : 'service', { count: m.services_count })}
                    </span>
                    <span className="text-xs font-bold text-amber-600 group-hover:translate-x-1 transition-transform">
                      {t('explore')}
                    </span>
                  </div>
                </Link>
              )
            })}
          </div>
        )}
      </div>
    </main>
  )
}
