'use client'

// src/app/i/[slug]/members/page.tsx
// Annuaire des membres de l'institution

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'

interface Member {
  user_uid: string
  role: string
  department?: string
  joined_at: string
  users: {
    first_name?: string
    name?: string
    avatar?: string
    bio?: string
    country?: string
    offered_skills?: string
    verification_level?: number
    reputation_score?: number
  }
}

export default function InstitutionMembersPage() {
  const { slug } = useParams() as { slug: string }
  const [members, setMembers]   = useState<Member[]>([])
  const [loading, setLoading]   = useState(true)
  const [search, setSearch]     = useState('')
  const [instColor, setInstColor] = useState('#2563EB')

  useEffect(() => {
    if (!slug) return
    Promise.all([
      fetch(`/api/institution?slug=${slug}`).then(r => r.ok ? r.json() : null),
      fetch(`/api/institution/members?slug=${slug}`).then(r => r.ok ? r.json() : []),
    ]).then(([inst, m]) => {
      if (inst) setInstColor(inst.primary_color || '#2563EB')
      setMembers(Array.isArray(m) ? m : [])
    }).finally(() => setLoading(false))
  }, [slug])

  const filtered = members.filter(m => {
    const u = m.users || {}
    const name = (u.first_name || u.name || '').toLowerCase()
    const skills = (u.offered_skills || '').toLowerCase()
    const dept = (m.department || '').toLowerCase()
    const q = search.toLowerCase()
    return name.includes(q) || skills.includes(q) || dept.includes(q)
  })

  const displayName = (m: Member) => m.users?.first_name || m.users?.name || 'Membre'

  return (
    <main className="min-h-screen bg-slate-50 pt-24 pb-16 px-4">
      <div className="max-w-5xl mx-auto">

        {/* En-tête */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <Link href={`/i/${slug}`}
              className="text-xs text-slate-400 hover:text-slate-600 transition mb-2 block">
              ← Retour à l'institution
            </Link>
            <h1 className="text-3xl font-bold text-slate-800">Membres</h1>
            <p className="text-slate-500 mt-1">{filtered.length} membre{filtered.length > 1 ? 's' : ''}</p>
          </div>
        </div>

        {/* Recherche */}
        <input type="text" value={search} onChange={e => setSearch(e.target.value)}
          placeholder="Rechercher par nom, compétence, département…"
          className="w-full px-4 py-3 rounded-xl text-sm border border-slate-200 bg-white outline-none focus:border-blue-400 transition-colors mb-8" />

        {/* Grille */}
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {[...Array(8)].map((_, i) => <div key={i} className="h-44 rounded-2xl bg-slate-100 animate-pulse" />)}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20 text-slate-400">
            <p className="text-4xl mb-3">👥</p>
            <p>Aucun membre trouvé</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {filtered.map(m => (
              <Link key={m.user_uid} href={`/profile?uid=${m.user_uid}`}
                className="bg-white rounded-2xl p-4 border border-slate-100 hover:border-blue-200 hover:shadow-md transition-all duration-200 flex flex-col items-center text-center group">

                {/* Avatar */}
                <div className="w-16 h-16 rounded-2xl overflow-hidden mb-3 bg-slate-100 flex items-center justify-center flex-shrink-0">
                  {m.users?.avatar ? (
                    <Image src={m.users.avatar} alt={displayName(m)} width={64} height={64}
                      className="object-cover w-full h-full" />
                  ) : (
                    <span className="text-xl font-bold" style={{ color: instColor }}>
                      {displayName(m)[0]}
                    </span>
                  )}
                </div>

                <p className="font-bold text-slate-800 text-sm group-hover:text-blue-600 transition-colors">
                  {displayName(m)}
                </p>

                {m.role !== 'member' && (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full mt-1"
                    style={{ background: `${instColor}15`, color: instColor }}>
                    {m.role === 'admin' ? '👑 Admin' : '🛡️ Modo'}
                  </span>
                )}

                {m.department && (
                  <p className="text-xs text-slate-400 mt-1 truncate w-full">{m.department}</p>
                )}

                {m.users?.offered_skills && (
                  <p className="text-xs text-slate-500 mt-2 line-clamp-2 leading-relaxed">
                    {m.users.offered_skills}
                  </p>
                )}

                {m.users?.verification_level && m.users.verification_level >= 2 && (
                  <span className="text-[10px] text-green-600 mt-1">✓ Vérifié</span>
                )}
              </Link>
            ))}
          </div>
        )}
      </div>
    </main>
  )
}
