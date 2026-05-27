'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useUser } from '@/components/UserProvider'

const CATEGORIES = ['Actualités', 'Témoignages', 'Guides pratiques', 'Économie du temps', 'Communauté', 'Institutions', 'Ressources']

export default function BlogNewPage() {
  const router = useRouter()
  const { user } = useUser()
  const [title, setTitle]       = useState('')
  const [content, setContent]   = useState('')
  const [category, setCategory] = useState('Actualités')
  const [extLink, setExtLink]   = useState('')
  const [loading, setLoading]   = useState(false)
  const [error, setError]       = useState<string | null>(null)

  const isAdmin = user?.role === 'admin' || user?.role === 'moderator'

  if (!user) return (
    <main className="min-h-screen bg-[#FFFCF7] pt-24 flex items-center justify-center">
      <p className="text-slate-500">Connectez-vous pour publier un article.</p>
    </main>
  )

  if (!isAdmin) return (
    <main className="min-h-screen bg-[#FFFCF7] pt-24 flex items-center justify-center">
      <div className="text-center">
        <p className="text-4xl mb-3">🔒</p>
        <p className="text-slate-500">Réservé aux administrateurs et modérateurs.</p>
        <Link href="/blog" className="text-amber-600 font-semibold mt-4 inline-block hover:underline">← Retour au blog</Link>
      </div>
    </main>
  )

  const handleSubmit = async () => {
    if (!title.trim() || !content.trim()) { setError('Titre et contenu requis'); return }
    setLoading(true); setError(null)
    try {
      const token = localStorage.getItem('token') || ''
      const res = await fetch('/api/blogs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          authorId:   user.uid,
          authorName: `${user.firstName} ${user.lastName}`,
          authorAvatar: user.avatar || '',
          title:      title.trim(),
          content:    content.trim(),
          category,
          externalLink: extLink.trim() || null,
          media: [],
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Erreur serveur')
      router.push(`/blog/${data.id}`)
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Erreur')
    } finally {
      setLoading(false)
    }
  }

  const inputClass = "w-full px-4 py-3 rounded-xl text-sm border border-slate-200 bg-slate-50 outline-none focus:border-amber-400 transition-colors"

  return (
    <main className="min-h-screen bg-[#FFFCF7] pt-24 pb-16 px-4">
      <div className="max-w-2xl mx-auto">

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Link href="/blog" className="text-sm text-slate-400 hover:text-amber-600 transition-colors">
            ← Retour au blog
          </Link>
          <span className="text-xs font-semibold px-3 py-1 rounded-full bg-amber-50 text-amber-600 border border-amber-200">
            ✍️ Nouvel article
          </span>
        </div>

        <h1 className="text-2xl font-bold text-slate-800 mb-8">Publier un article</h1>

        <div className="space-y-5">

          {/* Titre */}
          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">
              Titre *
            </label>
            <input
              type="text"
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="Un titre accrocheur..."
              className={inputClass}
            />
          </div>

          {/* Catégorie */}
          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">
              Catégorie
            </label>
            <select
              value={category}
              onChange={e => setCategory(e.target.value)}
              className={inputClass}
            >
              {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          {/* Contenu */}
          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">
              Contenu * <span className="text-slate-400 normal-case font-normal">(HTML autorisé)</span>
            </label>
            <textarea
              value={content}
              onChange={e => setContent(e.target.value)}
              placeholder="Rédigez votre article ici...&#10;&#10;Vous pouvez utiliser du HTML basique : <b>gras</b>, <i>italique</i>, <p>paragraphes</p>"
              rows={14}
              className={`${inputClass} resize-none leading-relaxed`}
            />
          </div>

          {/* Lien externe */}
          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">
              Lien externe <span className="text-slate-400 normal-case font-normal">(optionnel)</span>
            </label>
            <input
              type="url"
              value={extLink}
              onChange={e => setExtLink(e.target.value)}
              placeholder="https://..."
              className={inputClass}
            />
          </div>

          {/* Auteur (lecture seule) */}
          <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-slate-50 border border-slate-200">
            <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center text-amber-700 font-bold text-sm">
              {user.firstName?.charAt(0).toUpperCase()}
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-700">{user.firstName} {user.lastName}</p>
              <p className="text-xs text-slate-400">Auteur de l'article</p>
            </div>
          </div>

          {error && (
            <p className="text-sm text-red-500 bg-red-50 px-4 py-3 rounded-xl">⚠️ {error}</p>
          )}

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <Link
              href="/blog"
              className="flex-1 py-3 rounded-xl text-sm font-semibold text-center bg-slate-100 text-slate-500 hover:bg-slate-200 transition-colors"
            >
              Annuler
            </Link>
            <button
              onClick={handleSubmit}
              disabled={loading || !title.trim() || !content.trim()}
              className="flex-1 py-3 rounded-xl text-sm font-bold text-white transition-all disabled:opacity-50"
              style={{ background: 'linear-gradient(135deg,#F59E0B,#EF4444)' }}
            >
              {loading ? '⏳ Publication…' : '🚀 Publier l\'article'}
            </button>
          </div>
        </div>
      </div>
    </main>
  )
}
