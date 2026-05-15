'use client'

// src/components/ReviewPrompt.tsx
// Invite les deux parties à se noter après un échange

import { useState, useEffect } from 'react'
import TestimonialForm from '@/components/TestimonialForm'

interface ReviewPromptProps {
  uid: string
  userName: string
  userAvatar?: string
}

interface PendingReview {
  id: number
  transaction_id: number
  reviewee_id: string
  reviewee_name: string
  reviewee_avatar?: string
}

export default function ReviewPrompt({ uid, userName, userAvatar }: ReviewPromptProps) {
  const [pending, setPending]   = useState<PendingReview[]>([])
  const [current, setCurrent]   = useState<PendingReview | null>(null)
  const [dismissed, setDismissed] = useState(false)

  useEffect(() => {
    fetch(`/api/review-prompts?uid=${uid}`)
      .then(r => r.ok ? r.json() : [])
      .then(data => {
        const list = Array.isArray(data) ? data : []
        setPending(list)
        if (list.length > 0) setCurrent(list[0])
      })
      .catch(console.error)
  }, [uid])

  const handleSuccess = async () => {
    if (!current) return

    // Marquer comme complété
    await fetch('/api/review-prompts', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: current.id, completed: true }),
    }).catch(console.error)

    // Passer au suivant
    const remaining = pending.filter(p => p.id !== current.id)
    setPending(remaining)
    setCurrent(remaining[0] ?? null)
  }

  if (dismissed || !current) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
         style={{ background: 'rgba(15,23,42,0.7)', backdropFilter: 'blur(6px)' }}>
      <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden">

        {/* Header */}
        <div className="px-6 pt-6 pb-4"
             style={{ background: 'linear-gradient(135deg,#FEF3C7,#FFF7ED)' }}>
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs font-bold text-amber-600 uppercase tracking-widest">
              Échange terminé 🤝
            </p>
            {pending.length > 1 && (
              <span className="text-xs text-slate-400">{pending.length} avis en attente</span>
            )}
          </div>
          <h2 className="text-lg font-bold text-slate-800">
            Comment s'est passé votre échange ?
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Votre avis aide la communauté et renforce la confiance.
          </p>
        </div>

        {/* Formulaire */}
        <div className="p-6">
          <TestimonialForm
            authorId={uid}
            authorName={userName}
            authorAvatar={userAvatar}
            toUserId={current.reviewee_id}
            toUserName={current.reviewee_name}
            transactionId={current.transaction_id}
            onSuccess={handleSuccess}
            onClose={() => setDismissed(true)}
          />
        </div>
      </div>
    </div>
  )
}
