'use client'
// src/components/CommentsSection.tsx
// Composant réutilisable — Blog, Forum, Témoignages

import { useState } from 'react'
import Image from 'next/image'
import { MessageCircle } from 'lucide-react'
import { useUser } from '@/components/UserProvider'

export interface Comment {
  id: string
  authorId: string
  authorName: string
  authorAvatar?: string
  content: string
  createdAt: string
}

interface CommentsSectionProps {
  postId: string | number
  comments: Comment[]
  apiPath: string          // ex: '/api/blogs/11' ou '/api/forum-topics/3'
  onUpdate: (comments: Comment[]) => void
}

export default function CommentsSection({ postId, comments, apiPath, onUpdate }: CommentsSectionProps) {
  const { user } = useUser()
  const [open, setOpen]       = useState(false)
  const [text, setText]       = useState('')
  const [sending, setSending] = useState(false)

  const handleSend = async () => {
    if (!user || !text.trim()) return
    setSending(true)
    const newComment: Comment = {
      id:           Math.random().toString(36).slice(2, 11),
      authorId:     user.uid,
      authorName:   `${user.firstName} ${user.lastName}`,
      authorAvatar: user.avatar,
      content:      text.trim(),
      createdAt:    new Date().toISOString(),
    }
    const updated = [...comments, newComment]
    try {
      await fetch(apiPath, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ comments: updated }),
      })
      onUpdate(updated)
      setText('')
    } catch (e) {
      console.error('Comment error', e)
    } finally {
      setSending(false)
    }
  }

  return (
    <div>
      {/* Bouton toggle */}
      <button
        onClick={() => setOpen(v => !v)}
        className="flex items-center gap-2 text-slate-400 hover:text-blue-600 font-bold transition"
      >
        <MessageCircle size={18} />
        <span className="text-xs">{comments.length}</span>
      </button>

      {/* Panneau commentaires */}
      {open && (
        <div className="mt-4 pt-4 border-t border-slate-100">

          {/* Liste */}
          {comments.length > 0 && (
            <div className="space-y-3 mb-4">
              {comments.map(c => (
                <div key={c.id} className="bg-slate-50 p-3 rounded-2xl">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="w-6 h-6 rounded-full bg-amber-100 overflow-hidden flex-shrink-0 flex items-center justify-center">
                      {c.authorAvatar
                        ? <Image src={c.authorAvatar} alt="" width={24} height={24} className="object-cover w-full h-full" />
                        : <span className="text-[9px] font-bold text-amber-600">{c.authorName?.[0]}</span>
                      }
                    </div>
                    <span className="text-xs font-bold text-slate-700">{c.authorName}</span>
                    <span className="text-[10px] text-slate-400 ml-auto">
                      {new Date(c.createdAt).toLocaleDateString('fr-FR')}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 pl-8 leading-relaxed">{c.content}</p>
                </div>
              ))}
            </div>
          )}

          {/* Saisie */}
          {user ? (
            <div className="flex gap-2">
              <input
                type="text"
                value={text}
                onChange={e => setText(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && !e.shiftKey && handleSend()}
                placeholder="Ajouter un commentaire…"
                className="flex-1 px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 outline-none focus:border-amber-400 text-sm transition-colors"
              />
              <button
                onClick={handleSend}
                disabled={sending || !text.trim()}
                className="px-4 py-2.5 rounded-xl text-sm font-bold text-white disabled:opacity-50 transition-all"
                style={{ background: 'linear-gradient(135deg,#3B82F6,#6366F1)' }}
              >
                {sending ? '⏳' : 'Envoyer'}
              </button>
            </div>
          ) : (
            <p className="text-xs text-slate-400 italic">Connectez-vous pour commenter.</p>
          )}
        </div>
      )}
    </div>
  )
}
