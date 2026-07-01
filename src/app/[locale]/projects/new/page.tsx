'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useTranslations } from 'next-intl'

const CATEGORIES = [
  'informatique','langues','arts','cuisine','sport',
  'musique','education','sante','environnement','social','autre'
]

const ICONS = ['🚀','🌍','💡','🎓','🗏️','🌱','🤝','💻','🎨','📚','⚽','🏥','🎵']

export default function NewProjectPage() {
  const t = useTranslations('projectsNew')
  const router = useRouter()

  const [form, setForm] = useState({
    slug: '', title: '', description: '', goal: '',
    icon: '🚀', category: '', hours_goal: 100,
    members_limit: 50, deadline: '',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState<string | null>(null)

  const set = (k: string, v: string | number) => {
    setForm(f => ({ ...f, [k]: v }))
    if (k === 'title') {
      const slug = (v as string).toLowerCase()
        .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 50)
      setForm(f => ({ ...f, title: v as string, slug }))
    }
  }

  const handleSubmit = async () => {
    if (!form.title || !form.description || !form.goal || !form.category) {
      setError(t('requiredFields'))
      return
    }
    setLoading(true); setError(null)
    try {
      const token = localStorage.getItem('token')
      const meRes = await fetch('/api/auth/me', { headers: { Authorization: `Bearer ${token}` } })
      const me    = await meRes.json()
      const res = await fetch('/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, created_by: me.uid || me.id, deadline: form.deadline || null }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      router.push(`/projects/${data.project.slug}`)
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Erreur inattendue')
    } finally { setLoading(false) }
  }

  const inputClass = "w-full px-4 py-3 rounded-xl text-sm border border-slate-200 bg-white outline-none focus:border-amber-400 transition-colors"

  return (
    <main className="min-h-screen bg-[#FFFCF7] pt-24 pb-16 px-4">
      <div className="max-w-2xl mx-auto">

        <Link href="/projects" className="text-xs text-slate-400 hover:text-slate-600 transition mb-6 block">
          {t('backToProjects')}
        </Link>

        <div className="mb-8">
          <p className="text-xs font-semibold tracking-widest uppercase text-amber-500 mb-2">{t('label')}</p>
          <h1 className="text-3xl font-bold text-slate-800">{t('title')}</h1>
          <p className="text-slate-500 mt-2">{t('subtitle')}</p>
        </div>

        <div className="bg-white rounded-2xl p-8 border border-slate-100 shadow-sm space-y-5">

          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-2">{t('iconLabel')}</label>
            <div className="flex flex-wrap gap-2">
              {ICONS.map(icon => (
                <button key={icon} type="button" onClick={() => set('icon', icon)}
                  className="w-10 h-10 rounded-xl text-xl flex items-center justify-center transition-all"
                  style={{
                    background: form.icon === icon ? '#FEF3C7' : '#F8FAFC',
                    border: form.icon === icon ? '2px solid #F59E0B' : '2px solid transparent',
                  }}>
                  {icon}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1.5">
              {t('titleLabel')} <span className="text-red-400">*</span>
            </label>
            <input value={form.title} onChange={e => set('title', e.target.value)}
              placeholder={t('titlePlaceholder')} className={inputClass} />
            {form.slug && (
              <p className="text-[10px] text-slate-400 mt-1">{t('urlPrefix')}{form.slug}</p>
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1.5">
              {t('descLabel')} <span className="text-red-400">*</span>
            </label>
            <textarea value={form.description} onChange={e => set('description', e.target.value)}
              placeholder={t('descPlaceholder')}
              rows={3} className={`${inputClass} resize-none`} />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1.5">
              {t('goalLabel')} <span className="text-red-400">*</span>
            </label>
            <input value={form.goal} onChange={e => set('goal', e.target.value)}
              placeholder={t('goalPlaceholder')} className={inputClass} />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                {t('categoryLabel')} <span className="text-red-400">*</span>
              </label>
              <select value={form.category} onChange={e => set('category', e.target.value)} className={inputClass}>
                <option value="">{t('choosePlaceholder')}</option>
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1.5">{t('deadlineLabel')}</label>
              <input type="date" value={form.deadline} onChange={e => set('deadline', e.target.value)}
                className={inputClass} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1.5">{t('hoursGoalLabel')}</label>
              <input type="number" value={form.hours_goal} min={1}
                onChange={e => set('hours_goal', parseInt(e.target.value))} className={inputClass} />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1.5">{t('membersLimitLabel')}</label>
              <input type="number" value={form.members_limit} min={2} max={500}
                onChange={e => set('members_limit', parseInt(e.target.value))} className={inputClass} />
            </div>
          </div>

          {error && <p className="text-sm text-red-500 bg-red-50 px-4 py-3 rounded-xl">⚠️ {error}</p>}

          <div className="flex gap-3 pt-2">
            <button onClick={() => router.back()}
              className="flex-1 py-3 rounded-xl text-sm font-semibold text-slate-500 bg-slate-100 hover:bg-slate-200 transition">
              {t('cancel')}
            </button>
            <button onClick={handleSubmit}
              disabled={loading || !form.title || !form.description || !form.goal || !form.category}
              className="flex-1 py-3 rounded-xl text-sm font-bold text-white transition-all"
              style={{
                background: 'linear-gradient(135deg,#F59E0B,#EF4444)',
                opacity: loading || !form.title ? 0.7 : 1,
                boxShadow: '0 4px 14px rgba(245,158,11,0.3)',
              }}>
              {loading ? `⏳ ${t('submitting')}` : `🚀 ${t('submit')}`}
            </button>
          </div>
        </div>
      </div>
    </main>
  )
}
