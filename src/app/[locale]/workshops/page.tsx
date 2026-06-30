'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import { useTranslations } from 'next-intl'
import SkillHeatmap from '@/components/SkillHeatmap'

interface Workshop {
  id: number
  host_id: string
  host_name: string
  host_avatar?: string
  title: string
  description: string
  category: string
  skill_tags?: string[]
  max_participants: number
  participants_count: number
  credit_cost: number
  scheduled_at?: string
  duration_min: number
  format: 'en_ligne' | 'presentiel' | 'hybride'
  location?: string
  status: 'open' | 'full' | 'completed' | 'cancelled'
  is_full: boolean
}

const CATEGORY_ICONS: Record<string, string> = {
  informatique: '💻', langues: '🌍', arts: '🎨', cuisine: '🍳',
  sport: '⚽', musique: '🎵', bricolage: '🔧', education: '📚',
  sante: '🏥', juridique: '⚖️', autre: '✨',
}

const CATEGORIES = [
  'informatique','langues','arts','cuisine','sport',
  'musique','bricolage','education','sante','juridique','autre'
]

export default function WorkshopsPage() {
  const t = useTranslations('workshops')
  const [workshops, setWorkshops]     = useState<Workshop[]>([])
  const [loading, setLoading]         = useState(true)
  const [showForm, setShowForm]       = useState(false)
  const [showHeatmap, setShowHeatmap] = useState(false)
  const [joining, setJoining]         = useState<number | null>(null)

  const FORMAT_LABELS = {
    en_ligne: `💻 ${t('formatOnline')}`,
    presentiel: `📍 ${t('formatPresential')}`,
    hybride: `🔀 ${t('formatHybrid')}`,
  }

  const [form, setForm] = useState({
    title: '', description: '', category: '', format: 'en_ligne',
    max_participants: 10, credit_cost: 1, duration_min: 60,
    scheduled_at: '', location: '', skill_tags: '',
  })
  const [submitting, setSubmitting] = useState(false)

  const fetchWorkshops = async () => {
    try {
      const res = await fetch('/api/workshops')
      const data = await res.json()
      setWorkshops(Array.isArray(data) ? data : [])
    } catch (e) { console.error(e) }
    finally { setLoading(false) }
  }

  useEffect(() => { fetchWorkshops() }, [])

  const handleJoin = async (workshopId: number) => {
    const token = localStorage.getItem('token')
    if (!token) { alert(t('loginToJoin')); return }
    setJoining(workshopId)
    try {
      const res = await fetch('/api/workshops', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ workshop_id: workshopId, action: 'join' }),
      })
      if (res.ok) fetchWorkshops()
    } finally { setJoining(null) }
  }

  const handleCreate = async () => {
    const token = localStorage.getItem('token')
    if (!token) { alert(t('loginToCreate')); return }
    if (!form.title || !form.description || !form.category) return
    setSubmitting(true)
    try {
      const res = await fetch('/api/workshops', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          ...form,
          skill_tags: form.skill_tags.split(',').map(s => s.trim()).filter(Boolean),
          scheduled_at: form.scheduled_at || null,
        }),
      })
      if (res.ok) {
        setShowForm(false)
        setForm({ title:'',description:'',category:'',format:'en_ligne',max_participants:10,credit_cost:1,duration_min:60,scheduled_at:'',location:'',skill_tags:'' })
        fetchWorkshops()
      }
    } finally { setSubmitting(false) }
  }

  const formatDate = (str?: string) => str
    ? new Date(str).toLocaleDateString('fr-FR', { day:'numeric', month:'short', hour:'2-digit', minute:'2-digit' })
    : t('dateUndefined')

  const inputClass = "w-full px-4 py-3 rounded-xl text-sm border border-slate-200 bg-white outline-none focus:border-amber-400 transition-colors"

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
          <div className="flex gap-3">
            <button
              onClick={() => setShowHeatmap(s => !s)}
              className="px-4 py-2.5 rounded-xl text-sm font-semibold border border-slate-200 bg-white hover:bg-slate-50 transition-colors"
            >
              🌡️ {t('heatmapBtn')}
            </button>
            <button
              onClick={() => setShowForm(s => !s)}
              className="px-5 py-2.5 rounded-xl text-sm font-bold text-white transition-all"
              style={{ background: 'linear-gradient(135deg, #F59E0B 0%, #EF4444 100%)', boxShadow: '0 4px 14px rgba(245,158,11,0.3)' }}
            >
              {t('createBtn')}
            </button>
          </div>
        </div>

        {showHeatmap && (
          <div className="bg-white rounded-2xl p-6 border border-slate-100 mb-8">
            <SkillHeatmap />
          </div>
        )}

        {showForm && (
          <div className="bg-white rounded-2xl p-6 border border-amber-100 mb-8 shadow-sm">
            <h2 className="font-bold text-slate-800 mb-5">✏️ {t('formTitle')}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-600 mb-1.5">{t('titleLabel')}</label>
                <input value={form.title} onChange={e => setForm({...form, title: e.target.value})}
                  placeholder={t('titlePlaceholder')} className={inputClass} />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-600 mb-1.5">{t('descLabel')}</label>
                <textarea value={form.description} onChange={e => setForm({...form, description: e.target.value})}
                  placeholder={t('descPlaceholder')}
                  rows={3} className={`${inputClass} resize-none`} />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5">{t('categoryLabel')}</label>
                <select value={form.category} onChange={e => setForm({...form, category: e.target.value})} className={inputClass}>
                  <option value="">{t('choosePlaceholder')}</option>
                  {CATEGORIES.map(c => <option key={c} value={c}>{CATEGORY_ICONS[c]} {c}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5">{t('formatLabel')}</label>
                <select value={form.format} onChange={e => setForm({...form, format: e.target.value})} className={inputClass}>
                  <option value="en_ligne">💻 {t('formatOnline')}</option>
                  <option value="presentiel">📍 {t('formatPresential')}</option>
                  <option value="hybride">🔀 {t('formatHybrid')}</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5">{t('dateLabel')}</label>
                <input type="datetime-local" value={form.scheduled_at}
                  onChange={e => setForm({...form, scheduled_at: e.target.value})} className={inputClass} />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5">{t('durationLabel')}</label>
                <input type="number" value={form.duration_min} min={15} max={480}
                  onChange={e => setForm({...form, duration_min: +e.target.value})} className={inputClass} />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5">{t('maxParticipantsLabel')}</label>
                <input type="number" value={form.max_participants} min={2} max={50}
                  onChange={e => setForm({...form, max_participants: +e.target.value})} className={inputClass} />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5">{t('creditsLabel')}</label>
                <input type="number" value={form.credit_cost} min={0} max={10}
                  onChange={e => setForm({...form, credit_cost: +e.target.value})} className={inputClass} />
              </div>
              {form.format !== 'en_ligne' && (
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-slate-600 mb-1.5">{t('locationLabel')}</label>
                  <input value={form.location} onChange={e => setForm({...form, location: e.target.value})}
                    placeholder={t('locationPlaceholder')} className={inputClass} />
                </div>
              )}
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-600 mb-1.5">{t('tagsLabel')}</label>
                <input value={form.skill_tags} onChange={e => setForm({...form, skill_tags: e.target.value})}
                  placeholder={t('tagsPlaceholder')} className={inputClass} />
              </div>
            </div>
            <div className="flex gap-3 mt-5">
              <button onClick={() => setShowForm(false)}
                className="px-5 py-2.5 rounded-xl text-sm font-semibold text-slate-500 bg-slate-100 hover:bg-slate-200 transition-colors">
                {t('cancel')}
              </button>
              <button onClick={handleCreate} disabled={submitting || !form.title || !form.category}
                className="px-6 py-2.5 rounded-xl text-sm font-bold text-white transition-all"
                style={{ background: 'linear-gradient(135deg,#F59E0B,#EF4444)', opacity: submitting ? 0.7 : 1 }}>
                {submitting ? `⏳ ${t('publishing')}` : `🚀 ${t('publish')}`}
              </button>
            </div>
          </div>
        )}

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {[...Array(4)].map((_, i) => <div key={i} className="h-52 rounded-2xl bg-slate-100 animate-pulse" />)}
          </div>
        ) : workshops.length === 0 ? (
          <div className="text-center py-20 text-slate-400">
            <p className="text-4xl mb-3">🎓</p>
            <p className="font-medium">{t('noResults')}</p>
            <p className="text-sm mt-1">{t('beFirst')}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {workshops.map(w => (
              <div key={w.id}
                className="bg-white rounded-2xl border border-slate-100 hover:border-amber-200 hover:shadow-md transition-all duration-200 overflow-hidden flex flex-col">

                <div className="p-5 pb-3" style={{ background: 'linear-gradient(135deg,#FEF3C7,#FFF7ED)' }}>
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-lg">{CATEGORY_ICONS[w.category] || '✨'}</span>
                        <span className="text-xs font-semibold text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full capitalize">
                          {w.category}
                        </span>
                        <span className="text-xs text-slate-400">{FORMAT_LABELS[w.format]}</span>
                      </div>
                      <h3 className="font-bold text-slate-800 leading-snug">{w.title}</h3>
                    </div>
                    <span className={`text-xs font-bold px-2.5 py-1 rounded-full flex-shrink-0 ${
                      w.is_full ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-700'
                    }`}>
                      {w.is_full ? t('statusFull') : t('statusOpen')}
                    </span>
                  </div>
                </div>

                <div className="p-5 pt-3 flex flex-col flex-1">
                  <p className="text-sm text-slate-500 leading-relaxed line-clamp-2 mb-3">{w.description}</p>

                  {w.skill_tags && w.skill_tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-3">
                      {w.skill_tags.slice(0, 4).map(tag => (
                        <span key={tag} className="text-[10px] bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full">{tag}</span>
                      ))}
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-2 text-xs text-slate-500 mb-4">
                    <span>📅 {formatDate(w.scheduled_at)}</span>
                    <span>⏱ {w.duration_min} min</span>
                    <span>👥 {t('registered', { count: w.participants_count, max: w.max_participants })}</span>
                    <span>💳 {w.credit_cost} {w.credit_cost > 1 ? t('credits') : t('credit')}</span>
                  </div>

                  <div className="h-1.5 bg-slate-100 rounded-full mb-4 overflow-hidden">
                    <div className="h-full rounded-full bg-amber-400 transition-all"
                      style={{ width: `${(w.participants_count / w.max_participants) * 100}%` }} />
                  </div>

                  <div className="flex items-center justify-between mt-auto">
                    <div className="flex items-center gap-2">
                      {w.host_avatar ? (
                        <div className="relative w-7 h-7 rounded-full overflow-hidden">
                          <Image src={w.host_avatar} alt={w.host_name} fill className="object-cover" />
                        </div>
                      ) : (
                        <div className="w-7 h-7 rounded-full bg-amber-100 flex items-center justify-center text-xs font-bold text-amber-700">
                          {w.host_name[0]}
                        </div>
                      )}
                      <span className="text-xs text-slate-500">{w.host_name}</span>
                    </div>
                    <button
                      onClick={() => handleJoin(w.id)}
                      disabled={w.is_full || joining === w.id}
                      className="px-4 py-2 rounded-xl text-xs font-bold transition-all"
                      style={{
                        background: w.is_full ? '#F1F5F9' : 'linear-gradient(135deg,#F59E0B,#EF4444)',
                        color: w.is_full ? '#94A3B8' : '#fff',
                        boxShadow: w.is_full ? 'none' : '0 2px 8px rgba(245,158,11,0.3)',
                      }}
                    >
                      {joining === w.id ? '⏳' : w.is_full ? t('statusFull') : t('join')}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  )
}
