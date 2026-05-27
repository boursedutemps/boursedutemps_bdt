'use client'

import { useEffect, useState } from 'react'
import { useUser } from '@/components/UserProvider'
import Link from 'next/link'
import Image from 'next/image'

interface BlogPost {
  id: number
  title: string
  content?: string
  excerpt?: string
  author?: string
  author_name?: string
  cover_image?: string
  image?: string
  category?: string
  created_at: string
  slug?: string
}

export default function BlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [loading, setLoading] = useState(true)
  const { user } = useUser()
  const isAdmin = user?.role === 'admin' || user?.role === 'moderator'

  useEffect(() => {
    fetch('/api/blogs')
      .then(r => r.json())
      .then(data => setPosts(Array.isArray(data) ? data : data.blogs ?? data.posts ?? []))
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  const formatDate = (str: string) =>
    new Date(str).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })

  const excerpt = (post: BlogPost) =>
    post.excerpt || post.content?.replace(/<[^>]+>/g, '').slice(0, 140) + '…' || ''

  if (loading) return (
    <main className="min-h-screen bg-[#FFFCF7] pt-24 pb-16 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="h-10 w-48 bg-slate-100 rounded-xl animate-pulse mb-10" />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-64 rounded-2xl bg-slate-100 animate-pulse" />
          ))}
        </div>
      </div>
    </main>
  )

  return (
    <main className="min-h-screen bg-[#FFFCF7] pt-24 pb-16 px-4">
      <div className="max-w-4xl mx-auto">

        {/* En-tête */}
        <div className="mb-10">
          <p className="text-xs font-semibold tracking-widest uppercase text-amber-500 mb-2">
            Ressources & inspirations
          </p>
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold text-slate-800">Le Blog</h1>
            {isAdmin && (
              <a
                href="/blog/new"
                className="text-sm font-bold px-4 py-2 rounded-xl text-white"
                style={{ background: 'linear-gradient(135deg,#F59E0B,#EF4444)' }}
              >
                ✍️ Publier un article
              </a>
            )}
          </div>
          <p className="text-slate-500 mt-2">
            Actualités, témoignages et réflexions sur l'économie du temps.
          </p>
        </div>

        {posts.length === 0 ? (
          <div className="text-center py-20 text-slate-400">
            <p className="text-4xl mb-3">✍️</p>
            <p className="font-medium">Aucun article publié pour l'instant</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {posts.map(post => (
              <Link
                key={post.id}
                href={`/blog/${post.slug || post.id}`}
                className="bg-white rounded-2xl overflow-hidden border border-slate-100 hover:border-amber-200 hover:shadow-md transition-all duration-200 group"
              >
                {/* Image */}
                {(post.cover_image || post.image) && (
                  <div className="relative h-44 bg-slate-100">
                    <Image
                      src={post.cover_image || post.image || ''}
                      alt={post.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                )}

                <div className="p-5">
                  {post.category && (
                    <span className="text-xs font-semibold text-amber-600 uppercase tracking-wide">
                      {post.category}
                    </span>
                  )}
                  <h2 className="font-bold text-slate-800 mt-1 mb-2 group-hover:text-amber-700 transition-colors leading-snug">
                    {post.title}
                  </h2>
                  <p className="text-sm text-slate-500 line-clamp-2 leading-relaxed">
                    {excerpt(post)}
                  </p>
                  <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-50">
                    <span className="text-xs text-slate-400">
                      {post.author_name || post.author || 'Bourse du Temps'} · {formatDate(post.created_at)}
                    </span>
                    <span className="text-xs font-semibold text-amber-600">
                      Lire →
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </main>
  )
}
