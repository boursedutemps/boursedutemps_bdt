'use client'

// src/app/admin/institutions/page.tsx
// Super admin — gestion et validation des institutions

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'

interface Institution {
  id: number
  slug: string
  name: string
  logo_url?: string
  type: string
  status: 'pending' | 'active' | 'suspended' | 'rejected'
  members_count: number
  country?: string
  contact_email: string
  created_at: string
  admin_uid: string
}

const STATUS_CONFIG = {
  pending:   { label: 'En attente',  color: '#F59E0B', bg: '#FEF3C7' },
  active:    { label: 'Active',      color: '#10B981', bg: '#F0FDF4' },
  suspended: { label: 'Suspendue',   color: '#EF4444', bg: '#FEF2F2' },
  rejected:  { label: 'Rejetée',     color: '#94A3B8', bg: '#F8FAFC' },
}

const TYPE_ICONS: Record<string, string> = {
  universite: '🎓', ong: '🌍', collectivite: '🏛️',
  entreprise: '🏢', association: '🤝', autre: '✨',
}

export default function AdminInstitutionsPage() {
  const router = useRouter()
  const [institutions, setInstitutions] = useState<Institution[]>([])
  const [loading, setLoading]           = useState(true)
  const [filter, setFilter]             = useState<'all' | 'pending' | 'active' | 'suspended'>('pending')
  const [acting, setActing]             = useState<number | null>(null)
  const [adminUid, setAdminUid]         = useState<string | null>(null)

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) { router.push('/'); return }

    fetch('/api/auth/me', { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.ok ? r.json() : null)
      .then(me => {
        if (!me || me.role !== 'admin') { router.push('/'); return }
        setAdminUid(me.uid || me.id)
        return fetch('/api/institution?all=1')
      })
      .then(r => r?.ok ? r.json() : [])
      .then(data => setInstitutions(Array.isArray(data) ? data : []))
      .finally(() => setLoading(false))
  }, [router])

  const handleAction = async (id: number, action: string) => {
    if (!adminUid) return
    setActing(id)
    try {
      await fetch('/api/institution', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, action, admin_uid: adminUid }),
      })
      setInstitutions(prev => prev.map(i =>
        i.id === id
          ? { ...i, status: action === 'validate' ? 'active' : action === 'suspend' ? 'suspended' : 'rejected' }
          : i
      ))
    } finally { setActing(null) }
  }

  const filtered = institutions.filter(i => filter === 'all' || i.status === filter)
  const pendingCount = institutions.filter(i => i.status === 'pending').length

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
    </div>
  )

  return (
    <main className="min-h-screen bg-slate-50 pt-24 pb-16 px-4">
      <div className="max-w-5xl mx-auto">

        {/* En-tête */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <p className="text-xs font-semibold tracking-widest uppercase text-purple-500 mb-2">
              Super Admin
            </p>
            <h1 className="text-3xl font-bold text-slate-800">Institutions</h1>
            {pendingCount > 0 && (
              <p className="text-sm text-amber-600 mt-1 font-semibold">
                ⚠️ {pendingCount} demande{pendingCount > 1 ? 's' : ''} en attente de validation
              </p>
            )}
          </div>
          <Link href="/admin/institutions/new"
            className="px-5 py-2.5 rounded-xl text-sm font-bold text-white transition"
            style={{ background: 'linear-gradient(135deg,#8B5CF6,#6366F1)' }}>
            + Nouvelle institution
          </Link>
        </div>

        {/* Filtres */}
        <div className="flex gap-2 mb-6 flex-wrap">
          {([
            { key: 'pending',   label: `En attente (${institutions.filter(i=>i.status==='pending').length})` },
            { key: 'active',    label: `Actives (${institutions.filter(i=>i.status==='active').length})` },
            { key: 'suspended', label: `Suspendues (${institutions.filter(i=>i.status==='suspended').length})` },
            { key: 'all',       label: `Toutes (${institutions.length})` },
          ] as const).map(f => (
            <button key={f.key} onClick={() => setFilter(f.key)}
              className="px-4 py-2 rounded-xl text-xs font-semibold transition-all"
              style={{
                background: filter === f.key ? '#6366F1' : '#fff',
                color: filter === f.key ? '#fff' : '#64748B',
                border: '1px solid',
                borderColor: filter === f.key ? '#6366F1' : '#E2E8F0',
              }}>
              {f.label}
            </button>
          ))}
        </div>

        {/* Liste */}
        {filtered.length === 0 ? (
          <div className="text-center py-20 text-slate-400">
            <p className="text-4xl mb-3">🏛️</p>
            <p className="font-medium">Aucune institution dans cette catégorie</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filtered.map(inst => {
              const sc = STATUS_CONFIG[inst.status]
              return (
                <div key={inst.id} className="bg-white rounded-2xl p-5 border border-slate-100 hover:shadow-sm transition">
                  <div className="flex items-start gap-4">

                    {/* Logo */}
                    <div className="flex-shrink-0">
                      {inst.logo_url ? (
                        <div className="relative w-14 h-14 rounded-xl overflow-hidden">
                          <Image src={inst.logo_url} alt={inst.name} fill className="object-cover" />
                        </div>
                      ) : (
                        <div className="w-14 h-14 rounded-xl bg-purple-50 flex items-center justify-center text-2xl">
                          {TYPE_ICONS[inst.type] || '🏛️'}
                        </div>
                      )}
                    </div>

                    {/* Infos */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="font-bold text-slate-800">{inst.name}</h3>
                        <span className="text-xs font-mono text-slate-400">/{inst.slug}</span>
                        <span className="text-xs font-semibold px-2 py-0.5 rounded-full"
                          style={{ background: sc.bg, color: sc.color }}>
                          {sc.label}
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-3 mt-1 text-xs text-slate-400">
                        <span>{TYPE_ICONS[inst.type]} {inst.type}</span>
                        {inst.country && <span>📍 {inst.country}</span>}
                        <span>👥 {inst.members_count} membres</span>
                        <span>📧 {inst.contact_email}</span>
                        <span>🗓 {new Date(inst.created_at).toLocaleDateString('fr-FR')}</span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2 flex-shrink-0 flex-wrap justify-end">
                      <Link href={`/i/${inst.slug}/dashboard`}
                        className="px-3 py-1.5 rounded-lg text-xs font-semibold border border-slate-200 hover:bg-slate-50 transition">
                        Dashboard
                      </Link>
                      {inst.status === 'pending' && (
                        <>
                          <button onClick={() => handleAction(inst.id, 'validate')}
                            disabled={acting === inst.id}
                            className="px-3 py-1.5 rounded-lg text-xs font-bold text-white bg-green-500 hover:bg-green-600 transition disabled:opacity-50">
                            {acting === inst.id ? '⏳' : '✓ Valider'}
                          </button>
                          <button onClick={() => handleAction(inst.id, 'reject')}
                            disabled={acting === inst.id}
                            className="px-3 py-1.5 rounded-lg text-xs font-bold text-red-600 bg-red-50 hover:bg-red-100 transition disabled:opacity-50">
                            ✗ Rejeter
                          </button>
                        </>
                      )}
                      {inst.status === 'active' && (
                        <button onClick={() => handleAction(inst.id, 'suspend')}
                          disabled={acting === inst.id}
                          className="px-3 py-1.5 rounded-lg text-xs font-bold text-orange-600 bg-orange-50 hover:bg-orange-100 transition disabled:opacity-50">
                          ⏸ Suspendre
                        </button>
                      )}
                      {inst.status === 'suspended' && (
                        <button onClick={() => handleAction(inst.id, 'validate')}
                          disabled={acting === inst.id}
                          className="px-3 py-1.5 rounded-lg text-xs font-bold text-green-600 bg-green-50 hover:bg-green-100 transition disabled:opacity-50">
                          ▶ Réactiver
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </main>
  )
}
