'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { useTranslations } from 'next-intl'

interface Service {
  id: number
  user_id: string
  user_name: string
  title: string
  description: string
  credit_cost: number
  category: string
}

interface Module {
  id: number
  slug: string
  title: string
  description: string
  icon: string
  category: string
  tags?: string[]
  services_count: number
  module_services?: { services: Service }[]
}

export default function ModuleDetailPage() {
  const t = useTranslations('modules')
  const { slug } = useParams() as { slug: string }
  const router   = useRouter()
  const [module, setModule]   = useState<Module | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!slug) return
    fetch(`/api/modules?slug=${slug}`)
      .then(r => r.ok ? r.json() : null)
      .then(data => {
        if (!data) { router.replace('/modules'); return }
        setModule(data)
      })
      .finally(() => setLoading(false))
  }, [slug, router])

  if (loading) return (
    <main className="min-h-screen bg-[#FFFCF7] pt-24 px-4 flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-amber-400 border-t-transparent rounded-full animate-spin" />
    </main>
  )

  if (!module) return null

  const services = (module.module_services || []).map(ms => ms.services).filter(Boolean)

  return (
    <main className="min-h-screen bg-[#FFFCF7] pt-24 pb-16 px-4">
      <div className="max-w-4xl mx-auto">

        <Link href="/modules" className="text-xs text-slate-400 hover:text-slate-600 transition mb-6 block">
          {t('backToModules')}
        </Link>

        <div className="bg-white rounded-2xl p-8 border border-slate-100 mb-8">
          <div className="flex items-start gap-5">
            <span className="text-5xl">{module.icon}</span>
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-slate-800 mb-2">{module.title}</h1>
              <p className="text-slate-500 leading-relaxed">{module.description}</p>
              {module.tags && module.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-4">
                  {module.tags.map(tag => (
                    <span key={tag} className="text-xs bg-amber-50 text-amber-700 border border-amber-100 px-3 py-1 rounded-full font-medium">
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
          <div className="mt-5 pt-5 border-t border-slate-50 flex items-center gap-4 text-sm text-slate-400">
            <span>🛠️ {t(module.services_count > 1 ? 'services' : 'service', { count: module.services_count })}</span>
            <span className="capitalize">📂 {module.category}</span>
          </div>
        </div>

        <h2 className="font-bold text-slate-800 mb-4">{t('availableServices')}</h2>

        {services.length === 0 ? (
          <div className="text-center py-16 text-slate-400 bg-white rounded-2xl border border-slate-100">
            <p className="text-3xl mb-3">🛠️</p>
            <p className="font-medium">{t('noServices')}</p>
            <Link href="/services" className="text-sm text-amber-600 underline mt-2 block">
              {t('exploreAll')}
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {services.map(service => (
              <div key={service.id}
                className="bg-white rounded-2xl p-5 border border-slate-100 hover:border-amber-200 hover:shadow-sm transition-all duration-200 flex flex-col">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-bold text-slate-800 leading-snug">{service.title}</h3>
                  <span className="text-xs font-bold bg-amber-50 text-amber-700 px-2.5 py-1 rounded-full flex-shrink-0 ml-2">
                    {service.credit_cost} cr/h
                  </span>
                </div>
                <p className="text-sm text-slate-500 flex-1 leading-relaxed line-clamp-3">{service.description}</p>
                <div className="mt-4 pt-4 border-t border-slate-50 flex items-center justify-between">
                  <span className="text-xs text-slate-400">{t('by')} {service.user_name}</span>
                  <Link href={`/profile?uid=${service.user_id}`}
                    className="text-xs font-semibold text-amber-600 hover:text-amber-700 transition-colors">
                    {t('contact')}
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
