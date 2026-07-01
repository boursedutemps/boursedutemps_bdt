'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useTranslations } from 'next-intl'

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
}

export default function ProjectsPage() {
  const t = useTranslations('projects')
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading]   = useState(true)
  const [status, setStatus]     = useState('open')
  const [joining, setJoining]   = useState<number | null>(null)

  const STATUS_CONFIG: Record<string, { label: string; color: string; bg: string }> = {
    open:        { label: t('statusOpen'),       color: '#10B981', bg: '#F0FDF4' },
    in_progress: { label: t('statusInProgress'), color: '#3B82F6', bg: '#EFF6FF' },
    completed:   { label: t('statusCompleted'),  color: '#8B5CF6', bg: '#F5F3FF' },
    cancelled:   { label: t('statusCancelled'),  color: '#94A3B8', bg: '#F8FAFC' },
  }

  useEffect(() => {
    setLoading(true)
    fetch(`/api/projects?status=${status}`)
      .then(r => r.json())
      .then(data => setProjects(Array.isArray(data) ? data : []))
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [status])

  const handleJoin = async (projectId: number) => {
    const token = localStorage.getItem('token')
    if (!token) { alert(t('loginToJoin')); return }
    setJoining(projectId)
    try {
      const meRes = await fetch('/api/auth/me', { headers: { Authorization: `Bearer ${token}` } })
      const me = await meRes.json()
      const res = await fetch('/api/projects', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ project_id: projectId, user_uid: me.uid || me.id, action: 'join' }),
      })
      if (res.ok) {
        setProjects(prev => prev.map(p =>
          p.id === projectId ? { ...p, members_count: p.members_count + 1 } : p
        ))
      }
    } finally { setJoining(null) }
  }

  const formatDeadline = (d?: string) => d
    ? new Date(d).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' })
    : null

  return (
    <main className="min-h-screen bg-[#FFFCF7] pt-24 pb-16 px-4">
      <div className="max-w-5xl mx-auto">

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <p className="text-xs font-semibold tracking-widest uppercase text-amber-500 mb-2">
              {t('label')}
            </p>
            <h1 className="text-3xl font-bold text-slate-800">{t('title')}</h1>
            <p className="text-slate-500 mt-1">{t('subtitle')}</p>
          </div>
          <Link href="/projects/new"
            className="px-5 py-2.5 rounded-xl text-sm font-bold text-white transition-all flex-shrink-0"
            style={{ background: 'linear-gradient(135deg,#F59E0B,#EF4444)', boxShadow: '0 4px 14px rgba(245,158,11,0.3)' }}>
            {t('createBtn')}
          </Link>
        </div>

        <div className="flex gap-2 mb-8 flex-wrap">
          {Object.entries(STATUS_CONFIG).map(([key, cfg]) => (
            <button key={key} onClick={() => setStatus(key)}
              className="px-4 py-2 rounded-xl text-xs font-semibold transition-all"
              style={{
                background: status === key ? cfg.color : cfg.bg,
                color: status === key ? '#fff' : cfg.color,
                border: `1px solid ${cfg.color}40`,
              }}>
              {cfg.label}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {[...Array(4)].map((_, i) => <div key={i} className="h-52 rounded-2xl bg-slate-100 animate-pulse" />)}
          </div>
        ) : projects.length === 0 ? (
          <div className="text-center py-20 text-slate-400">
            <p className="text-4xl mb-3">🚀</p>
            <p>{t('noProjects')}</p>
            <Link href="/projects/new" className="text-sm text-amber-600 underline mt-2 block">
              {t('launchFirst')}
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {projects.map(p => {
              const sc = STATUS_CONFIG[p.status] || STATUS_CONFIG.open
              const pct = Math.min(100, Math.round((p.hours_contributed / p.hours_goal) * 100))
              const deadline = formatDeadline(p.deadline)
              return (
                <div key={p.id} className="bg-white rounded-2xl border border-slate-100 hover:border-amber-200 hover:shadow-md transition-all duration-200 flex flex-col overflow-hidden">
                  <div className="p-5 pb-3" style={{ background: 'linear-gradient(135deg,#FEF3C7,#FFF7ED)' }}>
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <span className="text-3xl">{p.icon}</span>
                        <div>
                          <h3 className="font-bold text-slate-800 leading-snug">{p.title}</h3>
                          {p.category && <span className="text-xs text-slate-400 capitalize">{p.category}</span>}
                        </div>
                      </div>
                      <span className="text-xs font-bold px-2.5 py-1 rounded-full flex-shrink-0"
                        style={{ background: sc.bg, color: sc.color }}>
                        {sc.label}
                      </span>
                    </div>
                  </div>

                  <div className="p-5 pt-3 flex flex-col flex-1">
                    <p className="text-sm text-slate-500 leading-relaxed line-clamp-2 mb-3">{p.description}</p>

                    <div className="bg-slate-50 rounded-xl p-3 mb-3">
                      <p className="text-xs font-semibold text-slate-600 mb-1">🎯 {t('goal')}</p>
                      <p className="text-xs text-slate-500 leading-relaxed">{p.goal}</p>
                    </div>

                    <div className="mb-3">
                      <div className="flex justify-between text-xs text-slate-500 mb-1">
                        <span>{t('hoursContributed', { hours: p.hours_contributed })}</span>
                        <span>{t('hoursGoal', { hours: p.hours_goal })}</span>
                      </div>
                      <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div className="h-full rounded-full transition-all"
                          style={{ width: `${pct}%`, background: 'linear-gradient(90deg,#F59E0B,#EF4444)' }} />
                      </div>
                      <p className="text-right text-[10px] text-slate-400 mt-0.5">{pct}%</p>
                    </div>

                    <div className="flex items-center justify-between text-xs text-slate-400 mb-4">
                      <span>👥 {t('members', { count: p.members_count, limit: p.members_limit })}</span>
                      {deadline && <span>📅 {deadline}</span>}
                    </div>

                    <div className="mt-auto flex gap-2">
                      <Link href={`/projects/${p.slug}`}
                        className="flex-1 py-2.5 rounded-xl text-xs font-semibold border border-slate-200 text-slate-600 hover:bg-slate-50 transition text-center">
                        {t('viewProject')}
                      </Link>
                      {p.status === 'open' && (
                        <button onClick={() => handleJoin(p.id)} disabled={joining === p.id}
                          className="flex-1 py-2.5 rounded-xl text-xs font-bold text-white transition-all"
                          style={{ background: 'linear-gradient(135deg,#F59E0B,#EF4444)', opacity: joining === p.id ? 0.7 : 1 }}>
                          {joining === p.id ? '⏳' : t('contribute')}
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
