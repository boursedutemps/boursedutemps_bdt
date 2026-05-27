'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { useUser } from '@/components/UserProvider'

interface BlogPost {
  id: number
  title: string
  content: string
  excerpt?: string
  authorId?: string
  authorName?: string
  authorAvatar?: string
  author_name?: string
  cover_image?: string
  image?: string
  category?: string
  createdAt?: string
  created_at?: string
  externalLink?: string
  likes?: string[]
  comments?: unknown[]
}

export default function BlogPostPage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()
  const { user } = useUser()
  const [post, setPost] = useState<BlogPost | null>(null)
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)

  useEffect(() => {
    if (!id) return
    fetch(`/api/blogs/${id}`)
      .then(async r => {
        if (r.status === 404) { setNotFound(true); return null }
        return r.json()
      })
      .then(data => { if (data) setPost(data) })
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [id])

  const formatDate = (str?: string) => {
    if (!str) return ''
    return new Date(str).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })
  }

  const isAdmin = user?.role === 'admin' || user?.role === 'moderator'

  if (loading) return (
    <main className="min-h-screen bg-[#FFFCF7] pt-24 pb-16 px-4">
      <div className="max-w-2xl mx-auto space-y-4">
        <div className="h-8 w-3/4 bg-slate-100 rounded-xl animate-pulse" />
        <div className="h-64 bg-slate-100 rounded-2xl animate-pulse" />
        <div className="space-y-3">
          {[...Array(6)].map((_, i) => <div key={i} className="h-4 bg-slate-100 rounded animate-pulse" />)}
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

  const coverImg = post.cover_image || post.image
  const date = formatDate(post.createdAt || post.created_at)
  const author = post.authorName || post.author_name || 'Bourse du Temps'

  return (
    <main className="min-h-screen bg-[#FFFCF7] pt-24 pb-16 px-4">
      <div className="max-w-2xl mx-auto">

        {/* Breadcrumb */}
        <div className="flex items-center justify-between mb-8">
          <Link href="/blog" className="text-sm text-slate-400 hover:text-amber-600 transition-colors flex items-center gap-1">
            ← Retour au blog
          </Link>
          {isAdmin && (
            <Link
              href={`/blog/${id}/edit`}
              className="text-xs font-semibold px-3 py-1.5 rounded-full bg-amber-50 text-amber-600 border border-amber-200 hover:bg-amber-100 transition-colors"
            >
              ✏️ Modifier
            </Link>
          )}
        </div>

        {/* Catégorie */}
        {post.category && (
          <span className="text-xs font-bold uppercase tracking-widest text-amber-500 mb-3 block">
            {post.category}
          </span>
        )}

        {/* Titre */}
        <h1 className="text-3xl font-bold text-slate-800 leading-tight mb-4">
          {post.title}
        </h1>

        {/* Meta auteur */}
        <div className="flex items-center gap-3 mb-8 pb-6 border-b border-slate-100">
          {post.authorAvatar ? (
            <Image src={post.authorAvatar} alt={author} width={36} height={36} className="rounded-full object-cover" />
          ) : (
            <div className="w-9 h-9 rounded-full bg-amber-100 flex items-center justify-center text-amber-700 font-bold text-sm">
              {author.charAt(0).toUpperCase()}
            </div>
          )}
          <div>
            <p className="text-sm font-semibold text-slate-700">{author}</p>
            <p className="text-xs text-slate-400">{date}</p>
          </div>
        </div>

        {/* Image de couverture */}
        {coverImg && (
          <div className="relative h-64 sm:h-80 rounded-2xl overflow-hidden mb-8 bg-slate-100">
            <Image src={coverImg} alt={post.title} fill className="object-cover" />
          </div>
        )}

        {/* Contenu */}
        <article
          className="prose prose-slate max-w-none prose-headings:font-bold prose-a:text-amber-600 prose-img:rounded-xl"
          dangerouslySetInnerHTML={{ __html: post.content || '' }}
        />

        {/* Lien externe */}
        {post.externalLink && (
          <a
            href={post.externalLink}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-8 flex items-center gap-2 text-sm font-semibold text-amber-600 hover:underline"
          >
            🔗 Voir la source externe →
          </a>
        )}

        {/* Footer */}
        <div className="mt-12 pt-6 border-t border-slate-100 flex items-center justify-between">
          <Link href="/blog" className="text-sm text-slate-400 hover:text-amber-600 transition-colors">
            ← Tous les articles
          </Link>
          <button
            onClick={() => { navigator.clipboard.writeText(window.location.href); alert('Lien copié !') }}
            className="text-xs font-semibold text-slate-400 hover:text-slate-600 transition-colors"
          >
            🔗 Partager
          </button>
        </div>
      </div>
    </main>
  )
}
