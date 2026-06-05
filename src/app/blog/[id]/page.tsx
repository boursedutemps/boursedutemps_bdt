'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { useUser } from '@/components/UserProvider'
import ShareMenu from '@/components/ShareMenu'
import CommentsSection, { Comment } from '@/components/CommentsSection'

interface BlogPost {
  id: number
  title: string
  content: string
  category?: string
  authorName?: string
  author_name?: string
  authorAvatar?: string
  user_id?: string
  authorId?: string
  externalLink?: string
  createdAt?: string
  created_at?: string
  shares?: number
  comments?: Comment[]
}

export default function BlogPostPage() {
  const { id } = useParams<{ id: string }>()
  const { user } = useUser()
  const [post, setPost]         = useState<BlogPost | null>(null)
  const [loading, setLoading]   = useState(true)
  const [notFound, setNotFound] = useState(false)

  useEffect(() => {
    if (!id || !/^\d+$/.test(id)) { setNotFound(true); setLoading(false); return }
    fetch(`/api/blogs/${id}`)
      .then(async r => {
        if (r.status === 404) { setNotFound(true); return null }
        if (!r.ok) throw new Error('Erreur serveur')
        return r.json()
      })
      .then(data => { if (data) setPost(data) })
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false))
  }, [id])

  const formatDate = (str?: string) =>
    str ? new Date(str).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' }) : ''

  const isAdmin  = user?.role === 'admin' || user?.role === 'moderator'
  const isAuthor = !!user && (user.uid === post?.user_id || user.uid === post?.authorId)

  if (loading) return (
    <main className="min-h-screen bg-[#FFFCF7] pt-24 pb-16 px-4">
      <div className="max-w-2xl mx-auto space-y-4">
        <div className="h-8 w-2/3 bg-slate-100 rounded-xl animate-pulse" />
        <div className="h-4 w-1/3 bg-slate-100 rounded animate-pulse" />
        <div className="space-y-3 mt-8">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="h-4 bg-slate-100 rounded animate-pulse" />
          ))}
        </div>
      </div>
    </main>
  )

  if (notFound || !post) return (
    <main className="min-h-screen bg-[#FFFCF7] pt-24 pb-16 px-4 flex items-center justify-center">
      <div className="text-center">
        <p className="text-5xl mb-4">📄</p>
        <h1 className="text-2xl font-bold text-slate-700 mb-2">Article introuvable</h1>
        <p className="text-slate-400 mb-6">Cet article n'existe pas ou a été supprimé.</p>
        <Link href="/blog" className="text-amber-600 font-semibold hover:underline">← Retour au blog</Link>
      </div>
    </main>
  )

  const author    = post.authorName || post.author_name || 'Bourse du Temps'
  const date      = formatDate(post.createdAt || post.created_at)
  const pageUrl   = typeof window !== 'undefined' ? window.location.href : `https://boursedutemps.vercel.app/blog/${id}`
  const comments  = Array.isArray(post.comments) ? post.comments : []

  const handleShareCount = async () => {
    await fetch(`/api/blogs/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ shares: (post.shares || 0) + 1 }),
    })
  }

  return (
    <main className="min-h-screen bg-[#FFFCF7] pt-24 pb-16 px-4">
      <div className="max-w-2xl mx-auto">

        {/* Breadcrumb */}
        <div className="flex items-center justify-between mb-8">
          <Link href="/blog" className="text-sm text-slate-400 hover:text-amber-600 transition-colors">
            ← Retour au blog
          </Link>
          <div className="flex items-center gap-2">
            {isAuthor && (
              <Link
                href={`/blog/new?edit=${post.id}`}
                className="text-xs font-semibold px-3 py-1.5 rounded-full bg-blue-50 text-blue-600 border border-blue-200 hover:bg-blue-100 transition-colors"
              >
                ✏️ Modifier
              </Link>
            )}
            {isAdmin && (
              <button
                onClick={async () => {
                  if (!confirm('Supprimer cet article ?')) return
                  await fetch(`/api/blogs/${post.id}`, { method: 'DELETE' })
                  window.location.href = '/blog'
                }}
                className="text-xs font-semibold px-3 py-1.5 rounded-full bg-red-50 text-red-500 border border-red-200 hover:bg-red-100 transition-colors"
              >
                🗑️ Supprimer
              </button>
            )}
          </div>
        </div>

        {/* Catégorie */}
        {post.category && (
          <span className="text-xs font-bold uppercase tracking-widest text-amber-700 mb-3 block">
            {post.category}
          </span>
        )}

        {/* Titre */}
        <h1 className="text-3xl font-bold text-slate-800 leading-tight mb-4">{post.title}</h1>

        {/* Auteur + date */}
        <div className="flex items-center gap-3 mb-8 pb-6 border-b border-slate-100">
          <div className="w-9 h-9 rounded-full bg-amber-100 flex items-center justify-center text-amber-700 font-bold text-sm flex-shrink-0">
            {author.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1">
            <p className="text-sm font-semibold text-slate-700">{author}</p>
            {date && <p className="text-xs text-slate-400">{date}</p>}
          </div>
        </div>

        {/* Contenu */}
        <article
          className="prose prose-slate max-w-none prose-headings:font-bold prose-a:text-amber-600 prose-img:rounded-xl"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />

        {/* Lien externe */}
        {post.externalLink && (
          <a href={post.externalLink} target="_blank" rel="noopener noreferrer"
            className="mt-8 flex items-center gap-2 text-sm font-semibold text-amber-600 hover:underline">
            🔗 Voir la source →
          </a>
        )}

        {/* Actions : Commentaires + Partager */}
        <div className="mt-10 pt-6 border-t border-slate-100">
          <div className="flex items-center gap-6">

            {/* Commentaires */}
            <CommentsSection
              postId={post.id}
              comments={comments}
              apiPath={`/api/blogs/${post.id}`}
              onUpdate={updated => setPost(p => p ? { ...p, comments: updated } : p)}
            />

            {/* Partager */}
            <ShareMenu
              url={pageUrl}
              title={post.title}
              text={post.content?.replace(/<[^>]+>/g, '').slice(0, 200)}
              count={post.shares}
              onShare={handleShareCount}
            />
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 pt-4 border-t border-slate-100">
          <Link href="/blog" className="text-sm text-slate-400 hover:text-amber-600 transition-colors">
            ← Tous les articles
          </Link>
        </div>
      </div>
    </main>
  )
}
