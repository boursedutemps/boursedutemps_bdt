'use client'

// src/components/TestimonialForm.tsx
// Formulaire de témoignage post-échange avec note

import { useState } from 'react'

interface TestimonialFormProps {
  authorId: string
  authorName: string
  authorAvatar?: string
  toUserId: string
  toUserName: string
  transactionId?: number
  onSuccess?: () => void
  onClose?: () => void
}

export default function TestimonialForm({
  authorId, authorName, authorAvatar,
  toUserId, toUserName,
  transactionId,
  onSuccess, onClose,
}: TestimonialFormProps) {
  const [rating,  setRating]  = useState(0)
  const [hovered, setHovered] = useState(0)
  const [title,   setTitle]   = useState('')
  const [content, setContent] = useState('')
  const [loading, setLoading] = useState(false)
  const [error,   setError]   = useState<string | null>(null)
  const [done,    setDone]    = useState(false)

  const RATING_LABELS = ['', 'Décevant', 'Passable', 'Bien', 'Très bien', 'Excellent !']

  const handleSubmit = async () => {
    if (rating === 0) { setError('Merci de donner une note'); return }
    if (content.trim().length < 20) { setError('Le témoignage doit faire au moins 20 caractères'); return }

    setLoading(true)
    setError(null)

    try {
      const res = await fetch('/api/testimonials', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          author_id:      authorId,
          author_name:    authorName,
          author_avatar:  authorAvatar || null,
          to_user_id:     toUserId,
          rating,
          title:          title.trim() || null,
          content:        content.trim(),
          transaction_id: transactionId || null,
        }),
      })

      if (!res.ok) {
        const j = await res.json()
        throw new Error(j.error || 'Erreur envoi')
      }

      setDone(true)
      setTimeout(() => onSuccess?.(), 1500)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Erreur inattendue')
    } finally {
      setLoading(false)
    }
  }

  if (done) return (
    <div className="text-center py-8">
      <p className="text-4xl mb-3">🎉</p>
      <h3 className="font-bold text-slate-800 mb-1">Merci pour votre témoignage !</h3>
      <p className="text-sm text-slate-500">Votre avis aide la communauté à grandir.</p>
    </div>
  )

  return (
    <div className="space-y-5">
      <div>
        <p className="text-sm text-slate-500 mb-1">Votre expérience avec</p>
        <p className="font-bold text-slate-800 text-lg">{toUserName}</p>
      </div>

      {/* Étoiles */}
      <div>
        <p className="text-sm font-semibold text-slate-700 mb-2">
          Note <span className="text-red-400">*</span>
        </p>
        <div className="flex gap-2 items-center">
          {[1,2,3,4,5].map(s => (
            <button
              key={s}
              type="button"
              onClick={() => setRating(s)}
              onMouseEnter={() => setHovered(s)}
              onMouseLeave={() => setHovered(0)}
              className="text-3xl transition-transform hover:scale-110"
              style={{ color: s <= (hovered || rating) ? '#F59E0B' : '#E2E8F0' }}
            >
              ★
            </button>
          ))}
          {(hovered || rating) > 0 && (
            <span className="text-sm font-semibold text-amber-600 ml-1">
              {RATING_LABELS[hovered || rating]}
            </span>
          )}
        </div>
      </div>

      {/* Titre optionnel */}
      <div>
        <label className="block text-sm font-semibold text-slate-700 mb-1.5">
          Titre <span className="text-slate-400 font-normal">(optionnel)</span>
        </label>
        <input
          type="text"
          value={title}
          onChange={e => setTitle(e.target.value)}
          placeholder="Ex : Un échange enrichissant !"
          maxLength={100}
          className="w-full px-4 py-3 rounded-xl text-sm border border-slate-200 bg-slate-50 outline-none focus:border-amber-400 transition-colors"
        />
      </div>

      {/* Témoignage */}
      <div>
        <label className="block text-sm font-semibold text-slate-700 mb-1.5">
          Témoignage <span className="text-red-400">*</span>
        </label>
        <textarea
          value={content}
          onChange={e => setContent(e.target.value)}
          placeholder={`Décrivez votre échange avec ${toUserName} : ponctualité, qualité, ambiance…`}
          rows={4}
          maxLength={600}
          className="w-full px-4 py-3 rounded-xl text-sm border border-slate-200 bg-slate-50 outline-none resize-none focus:border-amber-400 transition-colors"
        />
        <p className="text-right text-xs text-slate-400 mt-0.5">{content.length}/600</p>
      </div>

      {error && (
        <p className="text-sm text-red-500 bg-red-50 px-4 py-2 rounded-xl">⚠️ {error}</p>
      )}

      <div className="flex gap-3">
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-3 rounded-xl text-sm font-semibold text-slate-500 bg-slate-100 hover:bg-slate-200 transition-colors"
          >
            Annuler
          </button>
        )}
        <button
          type="button"
          onClick={handleSubmit}
          disabled={loading || rating === 0 || content.trim().length < 20}
          className="flex-1 py-3 rounded-xl text-sm font-bold text-white transition-all duration-200"
          style={{
            background: rating > 0 && content.trim().length >= 20 && !loading
              ? 'linear-gradient(135deg, #F59E0B 0%, #EF4444 100%)'
              : '#E2E8F0',
            color: rating > 0 && content.trim().length >= 20 && !loading ? '#fff' : '#94A3B8',
            boxShadow: rating > 0 && content.trim().length >= 20
              ? '0 4px 14px rgba(245,158,11,0.3)' : 'none',
          }}
        >
          {loading ? '⏳ Envoi…' : 'Publier le témoignage →'}
        </button>
      </div>
    </div>
  )
}
