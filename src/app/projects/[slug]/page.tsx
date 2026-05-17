'use client'

// src/app/projects/[slug]/page.tsx

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'

interface Contributor {
  user_uid: string
  role: string
  hours: number
  users: { first_name?: string; name?: string; avatar?: string }
}

interface Project {
  id: number
  slug: string
  title: string
  description: string
  goal: string
  icon: string
  category?: string
  hours_goal: number
  hours_contributed: number
  members_count: number
  members_limit: number
  status: string
  deadline?: string
  created_at: string
  project_contributions: Contributor[]
}

export default function ProjectDetailPage() {
  const { slug } = useParams() as { slug: string }
  const router   = useRouter()

  const [project, setProject] = useState<Project | null>(null)
  const [loading, setLoading] = useState(true)
  const [joining, setJoining] = useState(false)
  const [hours, setHours]     = useState(1)
  const [note, setNote]       = useState('')
  const [saving, setSaving]   = useState(false)
  const [myUid, setMyUid]     = useState<string | null>(null)

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token) {
      fetch('/api/auth/me', { headers: { Authorization: `Bearer ${token}` } })
        .then(r => r.ok ? r.json() : null)
        .then(me => { if (me) setMyUid(me.uid || me.id) })
        .catch(console.error)
    }

    fetch(`/api/projects?slug=${slug}`)
      .then(r => r.ok ? r.json() : null)
      .then(data => { if (!data) { router.replace('/projects'); return } setProject(data) })
      .finally(() => setLoading(false))
  }, [slug, router])

  const isMember = myUid && project?.project_contributions?.some(c => c.user_uid === myUid)
  const pct = project ? Math.min(100, Math.round((project.hours_contributed / project.hours_goal) * 100)) : 0

  const handleJoin = async () => {
    if (!myUid || !project) return
    setJoining(true)
    try {
      const res = await fetch('/api/projects', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ project_id: project.id, user_uid: myUid, action: 'join' }),
      })
      if (res.ok) {
        setProject(prev => prev ? { ...prev, members_count: prev.members_count + 1 } : prev)
        window.location.reload()
      }
    } finally { setJoining(false) }
  }

  const handleContribute = async () => {
    if (!myUid || !project) return
    setSaving(true)
    try {
      await fetch('/api/projects', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ project_id: project.id, user_uid: myUid, action: 'contribute', hours, description: note }),
      })
      window.location.reload()
    } finally { setSaving(false) }
  }

  const displayName = (c: Contributor) => c.users?.first_name || c.users?.name || 'Membre'

  const formatDate = (d?: string) => d
    ? new Date(d).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })
    : null

  if (loading) return (
    <main className="min-h-screen bg-[#FFFCF7] pt-24 flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-amber-400 border-t-transparent rounded-full animate-spin" />
    </main>
  )
  if (!project) return null

  return (
    <main className="min-h-screen bg-[#FFFCF7] pt-24 pb-16 px-4">
      <div className="max-w-4xl mx-auto">

        <Link href="/projects" className="text-xs text-slate-400 hover:text-slate-600 transition mb-6 block">
          ← Retour aux projets
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Colonne principale */}
          <div className="lg:col-span-2 space-y-5">

            {/* En-tête */}
            <div className="bg-white rounded-2xl p-6 border border-slate-100">
              <div className="flex items-start gap-4 mb-4">
                <span className="text-4xl">{project.icon}</span>
                <div className="flex-1">
                  <h1 className="text-xl font-bold text-slate-800">{project.title}</h1>
                  {project.category && <p className="text-xs text-slate-400 capitalize mt-0.5">{project.category}</p>}
                </div>
                <span className={`text-xs font-bold px-3 py-1 rounded-full ${
                  project.status === 'completed' ? 'bg-purple-50 text-purple-600' :
                  project.status === 'in_progress' ? 'bg-blue-50 text-blue-600' :
                  'bg-green-50 text-green-600'
                }`}>
                  {project.status === 'completed' ? '✓ Complété' :
                   project.status === 'in_progress' ? '⚡ En cours' : '🟢 Ouvert'}
                </span>
              </div>
              <p className="text-sm text-slate-600 leading-relaxed mb-4">{project.description}</p>
              <div className="bg-amber-50 rounded-xl p-3 border border-amber-100">
                <p className="text-xs font-semibold text-amber-800 mb-1">🎯 Objectif</p>
                <p className="text-sm text-slate-700">{project.goal}</p>
              </div>
            </div>

            {/* Progression */}
            <div className="bg-white rounded-2xl p-6 border border-slate-100">
              <div className="flex justify-between items-center mb-2">
                <h2 className="font-bold text-slate-800 text-sm">Progression</h2>
                <span className="text-sm font-bold text-amber-600">{pct}%</span>
              </div>
              <div className="h-3 bg-slate-100 rounded-full overflow-hidden mb-2">
                <div className="h-full rounded-full transition-all"
                  style={{ width: `${pct}%`, background: 'linear-gradient(90deg,#F59E0B,#EF4444)' }} />
              </div>
              <div className="flex justify-between text-xs text-slate-400">
                <span>{project.hours_contributed}h contribuées</span>
                <span>{project.hours_goal}h objectif</span>
              </div>
              {project.deadline && (
                <p className="text-xs text-slate-400 mt-2">📅 Deadline : {formatDate(project.deadline)}</p>
              )}
            </div>

            {/* Contribution (si membre) */}
            {isMember && project.status !== 'completed' && (
              <div className="bg-white rounded-2xl p-6 border border-amber-100">
                <h2 className="font-bold text-slate-800 mb-4">✍️ Déclarer ma contribution</h2>
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1.5">Heures contribuées</label>
                    <input type="number" value={hours} min={1} onChange={e => setHours(+e.target.value)}
                      className="w-full px-4 py-3 rounded-xl text-sm border border-slate-200 bg-slate-50 outline-none focus:border-amber-400 transition-colors" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1.5">Description (optionnel)</label>
                    <textarea value={note} onChange={e => setNote(e.target.value)}
                      placeholder="Qu'avez-vous réalisé ?" rows={2}
                      className="w-full px-4 py-3 rounded-xl text-sm border border-slate-200 bg-slate-50 outline-none resize-none focus:border-amber-400 transition-colors" />
                  </div>
                  <button onClick={handleContribute} disabled={saving}
                    className="w-full py-3 rounded-xl text-sm font-bold text-white transition-all"
                    style={{ background: 'linear-gradient(135deg,#F59E0B,#EF4444)', opacity: saving ? 0.7 : 1 }}>
                    {saving ? '⏳ Enregistrement…' : '+ Enregistrer ma contribution'}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Colonne latérale */}
          <div className="space-y-5">

            {/* CTA rejoindre */}
            {!isMember && project.status === 'open' && (
              <button onClick={handleJoin} disabled={joining}
                className="w-full py-4 rounded-2xl text-sm font-bold text-white transition-all shadow-lg"
                style={{ background: 'linear-gradient(135deg,#F59E0B,#EF4444)', opacity: joining ? 0.7 : 1,
                         boxShadow: '0 4px 14px rgba(245,158,11,0.3)' }}>
                {joining ? '⏳ Rejoindre…' : '🙋 Contribuer au projet →'}
              </button>
            )}

            {/* Contributeurs */}
            <div className="bg-white rounded-2xl p-5 border border-slate-100">
              <h2 className="font-bold text-slate-700 text-sm mb-4">
                👥 Contributeurs ({project.members_count}/{project.members_limit})
              </h2>
              {project.project_contributions?.length === 0 ? (
                <p className="text-xs text-slate-400 italic">Soyez le premier à contribuer !</p>
              ) : (
                <div className="space-y-3">
                  {(project.project_contributions || []).slice(0, 8).map(c => (
                    <div key={c.user_uid} className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-xl overflow-hidden bg-amber-100 flex items-center justify-center flex-shrink-0">
                        {c.users?.avatar ? (
                          <Image src={c.users.avatar} alt={displayName(c)} width={32} height={32} className="object-cover w-full h-full" />
                        ) : (
                          <span className="text-xs font-bold text-amber-700">{displayName(c)[0]}</span>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-slate-700 truncate">{displayName(c)}</p>
                        <p className="text-[10px] text-slate-400">{c.hours}h · {c.role}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
