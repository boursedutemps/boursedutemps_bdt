'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useTranslations } from 'next-intl'

interface Member {
  uid: string
  name?: string
  first_name?: string
  last_name?: string
  avatar?: string
  bio?: string
  country?: string
  offered_skills?: string
  campus?: string
  verified?: boolean
  credits?: number
}

export default function MembersPage() {
  const t = useTranslations('members')
  const [members, setMembers] = useState<Member[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  useEffect(() => {
    fetch('/api/users')
      .then(r => r.json())
      .then(data => setMembers(Array.isArray(data) ? data : data.users ?? []))
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  const filtered = members.filter(m => {
    const fullName = [m.first_name, m.last_name, m.name].filter(Boolean).join(' ').toLowerCase()
    const skills = (m.offered_skills || '').toLowerCase()
    const q = search.toLowerCase()
    return fullName.includes(q) || skills.includes(q) || (m.country || '').toLowerCase().includes(q)
  })

  const displayName = (m: Member) =>
    [m.first_name, m.last_name].filter(Boolean).join(' ') || m.name || t('member')

  const initials = (m: Member) =>
    displayName(m).split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase()

  const plural = members.length > 1 ? 's' : ''

  return (
    <main className="min-h-screen bg-[#FFFCF7] pt-24 pb-16 px-4">
      <div className="max-w-5xl mx-auto">

        {/* En-tête */}
        <div className="mb-10">
          <p className="text-xs font-semibold tracking-widest uppercase text-amber-500 mb-2">
            {t('label')}
          </p>
          <h1 className="text-3xl font-bold text-slate-800">{t('title')}</h1>
          <p className="text-slate-500 mt-2">
            {t('subtitle', { count: members.length, plural })}
          </p>
        </div>

        {/* Recherche */}
        <div className="mb-8">
          <input
            type="text"
            placeholder={t('searchPlaceholder')}
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full px-4 py-3 rounded-xl text-sm border border-slate-200 bg-white outline-none focus:border-amber-400 transition-colors"
          />
        </div>

        {/* Grille */}
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="h-44 rounded-2xl bg-slate-100 animate-pulse" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20 text-slate-400">
            <p className="text-4xl mb-3">👥</p>
            <p className="font-medium">{t('noResults')}</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {filtered.map(member => (
              <Link
                key={member.uid}
                href={`/profile?uid=${member.uid}`}
                className="bg-white rounded-2xl p-4 border border-slate-100 hover:border-amber-200 hover:shadow-md transition-all duration-200 flex flex-col items-center text-center group"
              >
                <div className="w-16 h-16 rounded-2xl overflow-hidden mb-3 flex-shrink-0 bg-amber-100 flex items-center justify-center">
                  {member.avatar ? (
                    <Image
                      src={member.avatar}
                      alt={displayName(member)}
                      width={64}
                      height={64}
                      className="object-cover w-full h-full"
                    />
                  ) : (
                    <span className="text-lg font-bold text-amber-600">{initials(member)}</span>
                  )}
                </div>

                <p className="font-bold text-slate-800 text-sm leading-tight group-hover:text-amber-700 transition-colors">
                  {displayName(member)}
                </p>

                {member.country && (
                  <p className="text-xs text-slate-400 mt-0.5">📍 {member.country}</p>
                )}

                {member.verified && (
                  <span className="mt-1.5 text-xs bg-green-50 text-green-700 px-2 py-0.5 rounded-full font-medium">
                    {t('verified')}
                  </span>
                )}

                {member.offered_skills && (
                  <p className="text-xs text-slate-500 mt-2 line-clamp-2 leading-relaxed">
                    {member.offered_skills}
                  </p>
                )}
              </Link>
            ))}
          </div>
        )}
      </div>
    </main>
  )
}
