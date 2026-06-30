'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import { Heart } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useUser } from '@/components/UserProvider'
import ShareMenu from '@/components/ShareMenu'

interface Testimonial {
  id: number
  author_id?: string
  author_name?: string
  author_avatar?: string
  to_user_id?: string
  content: string
  rating?: number
  created_at: string
  likes?: string[]
  shares?: number
}

interface Member {
  uid: string
  first_name?: string
  last_name?: string
}

export default function TestimonialsPage() {
  const t = useTranslations('testimonials')
  const { user } = useUser()
  const [testimonials, setTestimonials] = useState<Testimonial[]>([])
  const [members, setMembers]           = useState<Member[]>([])
  const [loading, setLoading]           = useState(true)
  const [showForm, setShowForm]         = useState(false)
  const [toUserId, setToUserId]         = useState('')
  const [content, setContent]           = useState('')
  const [rating, setRating]             = useState(5)
  const [submitting, setSubmitting]     = useState(false)
  const [formError, setFormError]       = useState<string | null>(null)
  const [formSuccess, setFormSuccess]   = useState(false)

  const fetchTestimonials = () =>
    fetch('/api/testimonials')
      .then(r => r.json())
      .then(data => setTestimonials(Array.isArray(data) ? data : data.testimonials ?? []))
      .catch(console.error)

  useEffect(() => {
    Promise.all([
      fetchTestimonials(),
      fetch('/api/users').then(r => r.json()).then(data => setMembers(Array.isArray(data) ? data : [])),
    ]).finally(() => setLoading(false))
  }, [])

  const handleSubmit = async () => {
    if (!user) return
    if (!toUserId) { setFormError(t('errorRecipient')); return }
    if (content.trim().length < 20) { setFormError(t('errorMinChars')); return }
    setSubmitting(true); setFormError(null)
    try {
      const res = await fetch('/api/testimonials', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ author_id: user.uid, author_name: `${user.firstName} ${user.lastName}`, author_avatar: user.avatar || null, to_user_id: toUserId, content: content.trim(), rating }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Erreur serveur')
      setFormSuccess(true)
      setContent(''); setToUserId(''); setRating(5)
      await fetchTestimonials()
      setTimeout(() => { setFormSuccess(false); setShowForm(false) }, 2000)
    } catch (e: unknown) {
      setFormError(e instanceof Error ? e.message : 'Erreur')
    } finally { setSubmitting(false) }
  }

  const handleLike = async (tm: Testimonial) => {
    if (!user) return
    const likes = tm.likes || []
    const newLikes = likes.includes(user.uid) ? likes.filter(id => id !== user.uid) : [...likes, user.uid]
    await fetch(`/api/testimonials/${tm.id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ likes: newLikes }) })
    setTestimonials(prev => prev.map(x => x.id === tm.id ? { ...x, likes: newLikes } : x))
  }

  const handleShare = async (tm: Testimonial) => {
    await fetch(`/api/testimonials/${tm.id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ shares: (tm.shares || 0) + 1 }) })
    setTestimonials(prev => prev.map(x => x.id === tm.id ? { ...x, shares: (x.shares || 0) + 1 } : x))
  }

  const formatDate = (str: string) => new Date(str).toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })
  const initials = (name?: string) => (name || 'M').split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase()
  const stars = (n: number, interactive = false) => [1,2,3,4,5].map(i => (
    <button key={i} type="button" onClick={() => interactive && setRating(i)}
      className={`text-xl transition-colors ${interactive ? 'cursor-pointer hover:scale-110' : 'cursor-default'} ${i <= n ? 'text-amber-400' : 'text-slate-200'}`}>★</button>
  ))

  const otherMembers = members.filter(m => m.uid !== user?.uid)
  const pageUrl = typeof window !== 'undefined' ? window.location.href : 'https://boursedutemps.vercel.app/testimonials'

  return (
    <main className="min-h-screen bg-[#FFFCF7] pt-24 pb-16 px-4">
      <div className="max-w-4xl mx-auto">

        <div className="mb-10 text-center">
          <p className="text-xs font-semibold tracking-widest uppercase text-amber-500 mb-2">{t('label')}</p>
          <h1 className="text-3xl font-bold text-slate-800">{t('title')}</h1>
          <p className="text-slate-500 mt-2 max-w-xl mx-auto">{t('subtitle')}</p>
          {user && (
            <button onClick={() => setShowForm(f => !f)}
              className="mt-6 px-6 py-2.5 rounded-xl text-sm font-bold text-white transition-all"
              style={{ background: showForm ? '#94A3B8' : 'linear-gradient(135deg,#F59E0B,#EF4444)' }}>
              {showForm ? `✕ ${t('cancelBtn')}` : `✏️ ${t('leaveBtn')}`}
            </button>
          )}
        </div>

        {showForm && user && (
          <div className="bg-white rounded-2xl border border-amber-100 p-6 mb-10 shadow-sm">
            <h2 className="text-lg font-bold text-slate-800 mb-5">{t('formTitle')}</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">{t('toMemberLabel')}</label>
                <select value={toUserId} onChange={e => setToUserId(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl text-sm border border-slate-200 bg-slate-50 outline-none focus:border-amber-400">
                  <option value="">{t('selectMember')}</option>
                  {otherMembers.map(m => (
                    <option key={m.uid} value={m.uid}>{[m.first_name, m.last_name].filter(Boolean).join(' ')}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">{t('ratingLabel')}</label>
                <div className="flex gap-1">{stars(rating, true)}</div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">
                  {t('contentLabel')} <span className="text-slate-400 normal-case font-normal">{t('contentHint')}</span>
                </label>
                <textarea value={content} onChange={e => setContent(e.target.value)}
                  placeholder={t('contentPlaceholder')} rows={5}
                  className="w-full px-4 py-3 rounded-xl text-sm border border-slate-200 bg-slate-50 outline-none focus:border-amber-400 resize-none leading-relaxed" />
                <p className="text-xs text-slate-400 mt-1 text-right">{t('charCount', { count: content.length })}</p>
              </div>
              {formError && <p className="text-sm text-red-500 bg-red-50 px-4 py-3 rounded-xl">⚠️ {formError}</p>}
              {formSuccess && <p className="text-sm text-green-600 bg-green-50 px-4 py-3 rounded-xl">✅ {t('successMsg')}</p>}
              <div className="flex gap-3">
                <button onClick={() => setShowForm(false)} className="flex-1 py-3 rounded-xl text-sm font-semibold bg-slate-100 text-slate-500">{t('cancel')}</button>
                <button onClick={handleSubmit} disabled={submitting || content.trim().length < 20}
                  className="flex-1 py-3 rounded-xl text-sm font-bold text-white disabled:opacity-50"
                  style={{ background: 'linear-gradient(135deg,#F59E0B,#EF4444)' }}>
                  {submitting ? `⏳ ${t('sending')}` : `🚀 ${t('publish')}`}
                </button>
              </div>
            </div>
          </div>
        )}

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {[...Array(4)].map((_, i) => <div key={i} className="h-48 rounded-2xl bg-slate-100 animate-pulse" />)}
          </div>
        ) : testimonials.length === 0 ? (
          <div className="text-center py-20 text-slate-400">
            <p className="text-4xl mb-3">💬</p>
            <p className="font-medium">{t('noResults')}</p>
            <p className="text-sm mt-1">{t('beFirst')}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {testimonials.map(tm => (
              <div key={tm.id} className="bg-white rounded-2xl p-6 border border-slate-100 hover:border-amber-200 hover:shadow-sm transition-all flex flex-col">
                {tm.rating && <div className="flex gap-0.5 mb-3">{stars(tm.rating)}</div>}
                <p className="text-3xl text-amber-200 leading-none mb-1 font-serif">"</p>
                <p className="text-slate-600 text-sm leading-relaxed flex-1 italic">{tm.content}</p>

                <div className="flex items-center gap-3 mt-5 pt-4 border-t border-slate-50">
                  <div className="w-9 h-9 rounded-xl overflow-hidden bg-amber-100 flex items-center justify-center flex-shrink-0">
                    {tm.author_avatar
                      ? <Image src={tm.author_avatar} alt={tm.author_name || ''} width={36} height={36} className="object-cover w-full h-full" />
                      : <span className="text-xs font-bold text-amber-600">{initials(tm.author_name)}</span>}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-slate-700">{tm.author_name || t('anonymousMember')}</p>
                    <p className="text-xs text-slate-400">{formatDate(tm.created_at)}</p>
                  </div>
                </div>

                <div className="flex items-center gap-5 mt-4 pt-3 border-t border-slate-50">
                  <button onClick={() => handleLike(tm)}
                    className={`flex items-center gap-1.5 text-sm font-bold transition ${user && (tm.likes || []).includes(user.uid) ? 'text-red-500' : 'text-slate-400 hover:text-red-500'}`}>
                    <Heart size={16} className={user && (tm.likes || []).includes(user.uid) ? 'fill-current' : ''} />
                    <span className="text-xs">{(tm.likes || []).length}</span>
                  </button>
                  <ShareMenu
                    url={pageUrl}
                    title={`${t('title')} — ${tm.author_name || t('member', { ns: 'common' })}`}
                    text={tm.content.slice(0, 200)}
                    count={tm.shares}
                    onShare={() => handleShare(tm)}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  )
}
