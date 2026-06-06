'use client'

// src/app/i/[slug]/page.tsx
// Page d'accueil brandée de l'institution

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'

interface Institution {
  id: number
  slug: string
  name: string
  description: string
  logo_url?: string
  cover_url?: string
  primary_color: string
  secondary_color: string
  website?: string
  type: string
  members_count: number
  country?: string
  institution_domains?: { domain: string; is_primary: boolean }[]
}

interface Stats {
  total_members: number
  total_exchanges: number
  total_hours: number
  equivalent_value_eur: number
}

export default function InstitutionHomePage() {
  const { slug } = useParams() as { slug: string }
  const router   = useRouter()
  const [institution, setInstitution] = useState<Institution | null>(null)
  const [stats, setStats]             = useState<Stats | null>(null)
  const [loading, setLoading]         = useState(true)

  useEffect(() => {
    if (!slug) return
    Promise.all([
      fetch(`/api/institution?slug=${slug}`).then(r => r.ok ? r.json() : null),
      fetch(`/api/institution/stats?slug=${slug}`).then(r => r.ok ? r.json() : null),
    ]).then(([inst, s]) => {
      if (!inst) { router.replace('/404'); return }
      setInstitution(inst)
      setStats(s)
    }).finally(() => setLoading(false))
  }, [slug, router])

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
    </div>
  )

  if (!institution) return null

  const color = institution.primary_color || '#2563EB'

  return (
    <main className="min-h-screen bg-slate-50">

      {/* ── Navbar institution ── */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-100 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {institution.logo_url ? (
              <div className="relative w-9 h-9 rounded-xl overflow-hidden">
                <Image src={institution.logo_url} alt={institution.name} fill className="object-cover" />
              </div>
            ) : (
              <div className="w-9 h-9 rounded-xl flex items-center justify-center text-white font-bold text-sm"
                style={{ background: color }}>
                {institution.name[0]}
              </div>
            )}
            <span className="font-bold text-slate-800 hidden sm:block">{institution.name}</span>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/" className="text-xs text-slate-500 hover:text-slate-700 transition">
              ← Bourse du Temps
            </Link>
            <Link href={`/i/${slug}/join`}
              className="px-4 py-2 rounded-xl text-sm font-bold text-white transition"
              style={{ background: color }}>
              Rejoindre
            </Link>
          </div>
        </div>
      </nav>

      {/* ── Hero ── */}
      <div className="relative pt-16 min-h-[420px] flex items-end"
           style={{ background: institution.cover_url ? undefined : `linear-gradient(135deg, ${color}22, ${color}44)` }}>
        {institution.cover_url && (
          <Image src={institution.cover_url} alt="Cover" fill className="object-cover opacity-30" />
        )}
        <div className="relative z-10 max-w-6xl mx-auto px-4 pb-16 w-full">
          {institution.logo_url && (
            <div className="relative w-24 h-24 rounded-3xl overflow-hidden border-4 border-white shadow-xl mb-6">
              <Image src={institution.logo_url} alt={institution.name} fill className="object-cover" />
            </div>
          )}
          <h1 className="text-4xl font-bold text-slate-900 mb-3">{institution.name}</h1>
          {institution.description && (
            <p className="text-lg text-slate-600 max-w-2xl leading-relaxed">{institution.description}</p>
          )}
          <div className="flex flex-wrap gap-3 mt-6">
            <Link href={`/i/${slug}/join`}
              className="px-6 py-3 rounded-2xl text-sm font-bold text-white shadow-lg transition hover:opacity-90"
              style={{ background: color, boxShadow: `0 4px 14px ${color}40` }}>
              Rejoindre la communauté →
            </Link>
            <Link href={`/services`}
              className="px-6 py-3 rounded-2xl text-sm font-bold bg-white text-slate-700 shadow border border-slate-100 hover:shadow-md transition">
              Explorer les échanges
            </Link>
          </div>
        </div>
      </div>

      {/* ── Stats ── */}
      {stats && (
        <div className="max-w-6xl mx-auto px-4 -mt-8 relative z-20">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { icon: '👥', value: stats.total_members,        label: 'Membres',       color: '#3B82F6' },
              { icon: '🔄', value: stats.total_exchanges,      label: 'Échanges',      color: '#10B981' },
              { icon: '⏱️', value: `${stats.total_hours}h`,    label: 'Heures données',color: '#F59E0B' },
              { icon: '💶', value: `${stats.equivalent_value_eur}€`, label: 'Valeur créée', color: '#8B5CF6' },
            ].map(s => (
              <div key={s.label} className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 text-center">
                <p className="text-2xl mb-1">{s.icon}</p>
                <p className="text-2xl font-bold" style={{ color: s.color }}>{s.value}</p>
                <p className="text-xs text-slate-400 mt-0.5">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── CTA rejoindre ── */}
      <div className="max-w-6xl mx-auto px-4 py-16 text-center">
        <h2 className="text-2xl font-bold text-slate-800 mb-3">
          Faites partie de la communauté {institution.name}
        </h2>
        <p className="text-slate-500 mb-8 max-w-xl mx-auto">
          Échangez vos compétences avec vos pairs, accédez à des ateliers exclusifs et contribuez à une économie du temps solidaire.
        </p>
        <div className="flex flex-wrap gap-4 justify-center">
          <Link href={`/i/${slug}/join`}
            className="px-8 py-4 rounded-2xl text-base font-bold text-white shadow-lg transition hover:opacity-90"
            style={{ background: color, boxShadow: `0 4px 20px ${color}40` }}>
            S'inscrire maintenant →
          </Link>
          <Link href="/"
            className="px-8 py-4 rounded-2xl text-base font-bold border border-slate-200 bg-white text-slate-700 hover:shadow-md transition">
            Voir la plateforme principale
          </Link>
        </div>
      </div>
    </main>
  )
}
