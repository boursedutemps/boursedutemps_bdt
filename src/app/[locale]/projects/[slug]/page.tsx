'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { useTranslations } from 'next-intl'
import { useUser } from '@/components/UserProvider'

interface Contribution {
  user_uid: string
  role: 'leader' | 'contributor'
  hours: number
  users?: { first_name?: string; name?: string; avatar?: string }
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
  created_by: string
  project_contributions?: Contribution[]
}

export default function ProjectDetailPage() {
  const t = useTranslations('projects')
  const { slug } = useParams<{ slug: string }>()
  const { user } = useUser()
  const [project, setProject]   = useState<Project | null>(null)
  const [loading, setLoading]   = useState(true)
  const [notFound, setNotFound] = useState(false)
  const [joining, setJoining]   = useState(false)
  const [hours, setHours]       = useState('')
  const [desc, setDesc]         = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess]   = useState<string | null>(null)
  const [error, setError]       = useState<string | null>(null)

  const STATUS_CONFIG: Record<string, { label: string; color: string; bg: string }> = {
    open:        { label: t('statusOpen'),       color: '#10B981', bg: '#F0FDF4' },
    in_progress: { label: t('statusInProgress'), color: '#3B82F6', bg: '#EFF6FF' },
    completed:   { label: t('statusCompleted'),  color: '#8B5CF6', bg: '#F5F3FF' },
    cancelled:   { label: t('statusCancelled'),  color: '#94A3B8', bg: '#F8FAFC' },
  }

  const fetchProject = () =>
    fetch(`/api/projects?slug=${slug}`)
      .then(async r => {
        if (r.status === 404) { setNotFound(true); return }
        const data = await r.json()
        if (data.error) { setNotFound(true); return }
        setProject(data)
      })
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false))

  useEffect(() => { fetchProject() }, [slug])

  const isMember = project?.project_contributions?.some(c => c.user_uid === user?.uid)
  const myContrib = project?.project_contributions?.find(c => c.user_uid === user?.uid)

  const handleJoin = async () => {
    if (!user) return
    setJoining(true); setError(null)
    try {
      const res = await fetch('/api/projects', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ project_id: project!.id, user_uid: user.uid, action: 'join' }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      setSuccess(t('joinSuccess'))
      fetchProject()
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Erreur')
    } finally { setJoining(false) }
  }

  const handleContribute = async () => {
    if (!user || !hours) return
    setSubmitting(true); setError(null)
    try {
      const res = await fetch('/api/projects', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ project_id: project!.id, user_uid: user.uid, action: 'contribute', hours: parseFloat(hours), description: desc }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      setSuccess(t('logSuccess', { hours }))
      setHours(''); setDesc('')
      fetchProject()
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Erreur')
    } finally { setSubmitting(false) }
  }

  const formatDate = (str?: string) => str
    ? new Date(str).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })
    : null

  if (loading) return (
    <main className="min-h-screen bg-[#FFFCF7] pt-24 pb-16 px-4">
      <div className="max-w-3xl mx-auto space-y-4">
        <div className="h-10 w-2/3 bg-slate-100 rounded-xl animate-pulse" />
        <div className="h-4 w-1/3 bg-slate-100 rounded animate-pulse" />
        <div className="h-48 bg-slate-100 rounded-2xl animate-pulse mt-6" />
      </div>
    </main>
  )

  if (notFound || !project) return (
    <main className="min-h-screen bg-[#FFFCF7] pt-24 pb-16 px-4 flex items-center justify-center">
      <div className="text-center">
        <p className="text-5xl mb-4">🚀</p>
        <h1 className="text-2xl font-bold text-slate-700 mb-2">{t('notFound')}</h1>
        <Link href="/projects" className="text-amber-600 font-semibold hover:underline">{t('backToProjects')}</Link>
      </div>
    </main>
  )

  const sc = STATUS_CONFIG[project.status] || STATUS_CONFIG.open
  const pct = Math.min(100, Math.round((project.hours_contributed / project.hours_goal) * 100))
  const contributors = project.project_contributions || []

  return (
    <main className="min-h-screen bg-[#FFFCF7] pt-24 pb-16 px-4">
      <div className="max-w-3xl mx-auto">

        <Link href="/projects" className="text-sm text-slate-400 hover:text-amber-600 transition-colors mb-8 block">
          {t('backToProjects')}
        </Link>

        <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden mb-6">
          <div className="p-6 pb-4" style={{ background: 'linear-gradient(135deg,#FEF3C7,#FFF7ED)' }}>
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-4">
                <span className="text-5xl">{project.icon}</span>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    {project.category && (
                      <span className="text-xs text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full font-semibold capitalize">
                        {project.category}
                      </span>
                    )}
                    <span className="text-xs font-bold px-2.5 py-1 rounded-full"
                      style={{ background: sc.bg, color: sc.color }}>
                      {sc.label}
                    </span>
                  </div>
                  <h1 className="text-2xl font-bold text-slate-800 leading-tight">{project.title}</h1>
                </div>
              </div>
            </div>
          </div>

          <div className="p-6">
            <p className="text-slate-600 leading-relaxed mb-5">{project.description}</p>

            <div className="bg-amber-50 rounded-xl p-4 mb-5 border border-amber-100">
              <p className="text-xs font-bold text-amber-700 uppercase tracking-wide mb-1">🎯 {t('goal')}</p>
              <p className="text-sm text-slate-600 leading-relaxed">{project.goal}</p>
            </div>

            <div className="mb-5">
              <div className="flex justify-between text-sm text-slate-500 mb-2">
                <span className="font-semibold">{t('hoursContributed', { hours: project.hours_contributed })}</span>
                <span>{t('hoursGoal', { hours: project.hours_goal })}</span>
              </div>
              <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full rounded-full transition-all"
                  style={{ width: `${pct}%`, background: 'linear-gradient(90deg,#F59E0B,#EF4444)' }} />
              </div>
              <p className="text-right text-xs text-slate-400 mt-1">{pct}{t('accomplished')}</p>
            </div>

            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="bg-slate-50 rounded-xl p-3">
                <p className="text-xl font-bold text-slate-800">{project.members_count}</p>
                <p className="text-xs text-slate-400">{t('membersLabel', { limit: project.members_limit })}</p>
              </div>
              <div className="bg-slate-50 rounded-xl p-3">
                <p className="text-xl font-bold text-slate-800">{project.hours_contributed}h</p>
                <p className="text-xs text-slate-400">{t('contributedLabel')}</p>
              </div>
              <div className="bg-slate-50 rounded-xl p-3">
                <p className="text-xl font-bold text-slate-800">{pct}%</p>
                <p className="text-xs text-slate-400">{t('goalLabel')}</p>
              </div>
            </div>

            {project.deadline && (
              <p className="text-xs text-slate-400 mt-3 text-center">
                📅 {t('deadline')} : {formatDate(project.deadline)}
              </p>
            )}
          </div>
        </div>

        {success && <p className="text-sm text-green-600 bg-green-50 px-4 py-3 rounded-xl mb-4">✅ {success}</p>}
        {error   && <p className="text-sm text-red-500 bg-red-50 px-4 py-3 rounded-xl mb-4">⚠️ {error}</p>}

        {user && project.status === 'open' && !isMember && (
          <div className="bg-white rounded-2xl border border-amber-100 p-5 mb-6">
            <h2 className="font-bold text-slate-800 mb-3">{t('joinTitle')}</h2>
            <p className="text-sm text-slate-500 mb-4">{t('joinDesc')}</p>
            <button onClick={handleJoin} disabled={joining}
              className="w-full py-3 rounded-xl text-sm font-bold text-white disabled:opacity-50 transition-all"
              style={{ background: 'linear-gradient(135deg,#F59E0B,#EF4444)' }}>
              {joining ? `⏳ ${t('joining')}` : `🚀 ${t('joinBtn')}`}
            </button>
          </div>
        )}

        {isMember && project.status !== 'completed' && (
          <div className="bg-white rounded-2xl border border-blue-100 p-5 mb-6">
            <h2 className="font-bold text-slate-800 mb-4">📝 {t('logTitle')}</h2>
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">
                  {t('hoursLabel')}
                </label>
                <input type="number" value={hours} onChange={e => setHours(e.target.value)}
                  placeholder={t('hoursPlaceholder')} min="0.5" step="0.5"
                  className="w-full px-4 py-3 rounded-xl text-sm border border-slate-200 bg-slate-50 outline-none focus:border-amber-400" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">
                  {t('descLabel')}
                </label>
                <textarea value={desc} onChange={e => setDesc(e.target.value)}
                  placeholder={t('descPlaceholder')} rows={3}
                  className="w-full px-4 py-3 rounded-xl text-sm border border-slate-200 bg-slate-50 outline-none focus:border-amber-400 resize-none" />
              </div>
              <button onClick={handleContribute} disabled={submitting || !hours}
                className="w-full py-3 rounded-xl text-sm font-bold text-white disabled:opacity-50 transition-all"
                style={{ background: 'linear-gradient(135deg,#3B82F6,#6366F1)' }}>
                {submitting ? `⏳ ${t('logging')}` : `✅ ${t('logBtn')}`}
              </button>
            </div>
            {myContrib && (
              <p className="text-xs text-slate-400 mt-3 text-center">
                {t('myContrib', { hours: myContrib.hours })}
                {myContrib.role === 'leader' && ` 👑 ${t('leader')}`}
              </p>
            )}
          </div>
        )}

        {contributors.length > 0 && (
          <div className="bg-white rounded-2xl border border-slate-100 p-5">
            <h2 className="font-bold text-slate-800 mb-4">
              👥 {t('contributorsTitle', { count: contributors.length })}
            </h2>
            <div className="space-y-3">
              {contributors.map(c => {
                const name = c.users?.first_name || c.users?.name || 'Membre'
                return (
                  <div key={c.user_uid} className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-amber-100 flex items-center justify-center flex-shrink-0 overflow-hidden">
                      {c.users?.avatar
                        ? <Image src={c.users.avatar} alt={name} width={36} height={36} className="object-cover w-full h-full" />
                        : <span className="text-xs font-bold text-amber-600">{name[0]}</span>}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-slate-700 flex items-center gap-1">
                        {name}
                        {c.role === 'leader' && <span className="text-xs">👑</span>}
                      </p>
                      <p className="text-xs text-slate-400">{t('hoursContributed', { hours: c.hours })}</p>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}
      </div>
    </main>
  )
}
