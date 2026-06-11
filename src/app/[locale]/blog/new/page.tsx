'use client'

import { useState, useRef, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { useUser } from '@/components/UserProvider'
import RichTextEditor from '@/components/RichTextEditor'
import { useTranslations } from 'next-intl'
import { Link, useRouter } from '@/i18n/navigation'

const CATEGORIES = ['Actualités', 'Témoignages', 'Guides pratiques', 'Économie du temps', 'Communauté', 'Institutions', 'Ressources']

export default function BlogNewPage() {
  const router       = useRouter()
  const searchParams = useSearchParams()
  const editId       = searchParams.get('edit')
  const isEditMode   = !!editId
  const t = useTranslations('blog')
  const tCommon = useTranslations('common')

  const { user } = useUser()
  const [title, setTitle]         = useState('')
  const [content, setContent]     = useState('')
  const [category, setCategory]   = useState('Actualités')
  const [extLink, setExtLink]     = useState('')
  const [loading, setLoading]     = useState(false)
  const [uploading, setUploading] = useState(false)
  const [error, setError]         = useState<string | null>(null)
  const [loadingEdit, setLoadingEdit] = useState(isEditMode)
  const mediaInputRef = useRef<HTMLInputElement>(null)

  const isAdmin = user?.role === 'admin' || user?.role === 'moderator'

  useEffect(() => {
    if (!isEditMode || !editId) return
    fetch(`/api/blogs/${editId}`)
      .then(r => r.json())
      .then(data => {
        setTitle(data.title || '')
        setContent(data.content || '')
        setCategory(data.category || 'Actualités')
        setExtLink(data.externalLink || '')
      })
      .catch(() => setError(tCommon('error')))
      .finally(() => setLoadingEdit(false))
  }, [editId, isEditMode])

  if (!user) return (
    <main className="min-h-screen bg-[#FFFCF7] pt-24 flex items-center justify-center">
      <p className="text-slate-500">{t('connectTo')}</p>
    </main>
  )

  if (!isAdmin && !isEditMode) return (
    <main className="min-h-screen bg-[#FFFCF7] pt-24 flex items-center justify-center">
      <div className="text-center">
        <p className="text-4xl mb-3">🔒</p>
        <p className="text-slate-500">{t('adminOnly')}</p>
        <Link href="/blog" className="text-amber-600 font-semibold mt-4 inline-block hover:underline">{t('backToBlog')}</Link>
      </div>
    </main>
  )

  if (loadingEdit) return (
    <main className="min-h-screen bg-[#FFFCF7] pt-24 pb-16 px-4">
      <div className="max-w-3xl mx-auto space-y-4 animate-pulse">
        <div className="h-6 w-1/3 bg-slate-100 rounded-xl" />
        <div className="h-12 bg-slate-100 rounded-xl" />
        <div className="h-64 bg-slate-100 rounded-xl" />
      </div>
    </main>
  )

  const handleMediaImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true); setError(null)
    try {
      const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME
      const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET
      const isVideo = file.type.startsWith('video/')
      const formData = new FormData()
      formData.append('file', file)
      formData.append('upload_preset', uploadPreset || 'boursedutemps_upload')
      const res  = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/${isVideo ? 'video' : 'image'}/upload`, { method: 'POST', body: formData })
      const data = await res.json()
      if (!data.secure_url) throw new Error()
      const tag = isVideo
        ? `<video src="${data.secure_url}" controls style="max-width:100%;border-radius:12px;margin:12px 0"></video>`
        : `<img src="${data.secure_url}" alt="media" style="max-width:100%;border-radius:12px;margin:12px 0" />`
      setContent(prev => prev + tag)
    } catch { setError(tCommon('error')) }
    finally { setUploading(false); if (mediaInputRef.current) mediaInputRef.current.value = '' }
  }

  const handleSubmit = async () => {
    if (!title.trim() || !content || content === '<p></p>') { setError(tCommon('error')); return }
    setLoading(true); setError(null)
    try {
      const token = localStorage.getItem('token') || ''
      if (isEditMode) {
        const res = await fetch(`/api/blogs/${editId}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
          body: JSON.stringify({ title: title.trim(), content, category, externalLink: extLink.trim() || null }),
        })
        const data = await res.json()
        if (!res.ok) throw new Error(data.error || tCommon('error'))
        router.push(`/blog/${editId}` as never)
      } else {
        const res = await fetch('/api/blogs', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
          body: JSON.stringify({
            authorId: user.uid, authorName: `${user.firstName} ${user.lastName}`,
            authorAvatar: user.avatar || '', title: title.trim(), content, category,
            externalLink: extLink.trim() || null, media: [],
          }),
        })
        const data = await res.json()
        if (!res.ok) throw new Error(data.error || tCommon('error'))
        router.push(`/blog/${data.id}` as never)
      }
    } catch (e: unknown) { setError(e instanceof Error ? e.message : tCommon('error')) }
    finally { setLoading(false) }
  }

  const inputClass = "w-full px-4 py-3 rounded-xl text-sm border border-slate-200 bg-slate-50 outline-none focus:border-amber-400 transition-colors"

  return (
    <main className="min-h-screen bg-[#FFFCF7] pt-24 pb-16 px-4">
      <div className="max-w-3xl mx-auto">

        <div className="flex items-center justify-between mb-8">
          <Link href="/blog" className="text-sm text-slate-400 hover:text-amber-600 transition-colors">{t('backToBlog')}</Link>
          <span className="text-xs font-semibold px-3 py-1 rounded-full bg-amber-50 text-amber-600 border border-amber-200">
            {isEditMode ? `✏️ ${t('editArticle')}` : `✍️ ${t('newArticle')}`}
          </span>
        </div>

        <h1 className="text-2xl font-bold text-slate-800 mb-8">
          {isEditMode ? t('editArticle') : t('publish')}
        </h1>

        <div className="space-y-5">
          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">{t('titleLabel')} *</label>
            <input type="text" value={title} onChange={e => setTitle(e.target.value)}
              placeholder={t('titlePlaceholder')} className={inputClass} />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">{t('categoryLabel')}</label>
              <select value={category} onChange={e => setCategory(e.target.value)} className={inputClass}>
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">
                {t('externalLinkLabel')} <span className="text-slate-400 normal-case font-normal">({tCommon('optional')})</span>
              </label>
              <input type="url" value={extLink} onChange={e => setExtLink(e.target.value)} placeholder="https://..." className={inputClass} />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">{t('contentLabel')} *</label>
            <RichTextEditor value={content} onChange={setContent} placeholder={t('contentPlaceholder')} maxLength={20000} />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <button type="button" onClick={() => mediaInputRef.current?.click()} disabled={uploading}
              className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl border-2 border-dashed border-slate-200 text-slate-500 hover:border-amber-300 hover:text-amber-600 hover:bg-amber-50 transition-all text-sm font-semibold">
              {uploading ? <><span className="animate-spin">⏳</span> {t('importProgress')}</> : <><span>📁</span> {t('importMedia')}</>}
            </button>
            <input ref={mediaInputRef} type="file" accept="image/*,video/*" className="hidden" onChange={handleMediaImport} />
            {extLink && (
              <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-500 truncate">
                🔗 <span className="truncate">{extLink}</span>
              </div>
            )}
          </div>

          <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-slate-50 border border-slate-200">
            <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center text-amber-700 font-bold text-sm">
              {user.firstName?.charAt(0).toUpperCase()}
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-700">{user.firstName} {user.lastName}</p>
              <p className="text-xs text-slate-400">{t('articleAuthor')}</p>
            </div>
          </div>

          {error && <p className="text-sm text-red-500 bg-red-50 px-4 py-3 rounded-xl">⚠️ {error}</p>}

          <div className="flex gap-3 pt-2">
            <Link href="/blog" className="flex-1 py-3 rounded-xl text-sm font-semibold text-center bg-slate-100 text-slate-500 hover:bg-slate-200 transition-colors">
              {tCommon('cancel')}
            </Link>
            <button onClick={handleSubmit} disabled={loading || !title.trim()}
              className="flex-1 py-3 rounded-xl text-sm font-bold text-white transition-all disabled:opacity-50"
              style={{ background: 'linear-gradient(135deg,#F59E0B,#EF4444)' }}>
              {loading ? `⏳ ${tCommon('loading')}`
                : isEditMode ? `💾 ${t('saveChanges')}` : `🚀 ${t('publishArticle')}`}
            </button>
          </div>
        </div>
      </div>
    </main>
  )
}
