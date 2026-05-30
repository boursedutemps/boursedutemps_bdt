'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'

interface Testimonial {
  id: number
  author_id?: string
  author_name?: string
  author_avatar?: string
  recipient_id?: string
  recipient_name?: string
  content: string
  rating?: number
  created_at: string
}

export default function TestimonialsPage() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/testimonials')
      .then(r => r.json())
      .then(data => setTestimonials(Array.isArray(data) ? data : data.testimonials ?? []))
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  const formatDate = (str: string) =>
    new Date(str).toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })

  const initials = (name?: string) =>
    (name || 'M').split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase()

  const stars = (rating?: number) =>
    rating ? '★'.repeat(rating) + '☆'.repeat(5 - rating) : null

  return (
    <main className="min-h-screen bg-[#FFFCF7] pt-24 pb-16 px-4">
      <div className="max-w-4xl mx-auto">

        {/* En-tête */}
        <div className="mb-10 text-center">
          <p className="text-xs font-semibold tracking-widest uppercase text-amber-500 mb-2">
            Ils en parlent mieux que nous
          </p>
          <h1 className="text-3xl font-bold text-slate-800">Témoignages</h1>
          <p className="text-slate-500 mt-2 max-w-xl mx-auto">
            Des échanges réels, des liens durables. Voici ce que vivent les membres de la Bourse du Temps.
          </p>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-48 rounded-2xl bg-slate-100 animate-pulse" />
            ))}
          </div>
        ) : testimonials.length === 0 ? (
          <div className="text-center py-20 text-slate-400">
            <p className="text-4xl mb-3">💬</p>
            <p className="font-medium">Aucun témoignage pour l'instant</p>
            <p className="text-sm mt-1">Soyez le premier à partager votre expérience !</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {testimonials.map(t => (
              <div
                key={t.id}
                className="bg-white rounded-2xl p-6 border border-slate-100 hover:border-amber-200 hover:shadow-sm transition-all duration-200 flex flex-col"
              >
                {/* Étoiles */}
                {t.rating && (
                  <div className="text-amber-400 text-sm mb-3 tracking-wide">
                    {stars(t.rating)}
                  </div>
                )}

                {/* Guillemets */}
                <p className="text-3xl text-amber-200 leading-none mb-1 font-serif">"</p>

                {/* Contenu */}
                <p className="text-slate-600 text-sm leading-relaxed flex-1 italic">
                  {t.content}
                </p>

                {/* Auteur */}
                <div className="flex items-center gap-3 mt-5 pt-4 border-t border-slate-50">
                  <div className="w-9 h-9 rounded-xl overflow-hidden bg-amber-100 flex items-center justify-center flex-shrink-0">
                    {t.author_avatar ? (
                      <Image
                        src={t.author_avatar}
                        alt={t.author_name || 'Membre'}
                        width={36}
                        height={36}
                        className="object-cover w-full h-full"
                      />
                    ) : (
                      <span className="text-xs font-bold text-amber-600">
                        {initials(t.author_name)}
                      </span>
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-700">
                      {t.author_name || 'Membre anonyme'}
                    </p>
                    <p className="text-xs text-slate-400">{formatDate(t.created_at)}</p>
                  </div>
                  {t.recipient_name && (
                    <div className="ml-auto text-xs text-slate-400">
                      → {t.recipient_name}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  )
}
