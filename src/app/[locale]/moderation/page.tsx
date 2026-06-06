'use client'
// src/app/moderation/page.tsx — migré Firebase → REST

import { useEffect, useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { useUser } from '@/components/UserProvider'
import { User, Service, Request } from '@/types'
import dynamic from 'next/dynamic'
import Image from 'next/image'

const ModerationComponent = dynamic(() => import('@/components/pages-old/Moderation'), { ssr: false })

// ── Types ────────────────────────────────────────────────────────────────────
interface PendingVerification {
  uid:             string
  name:            string
  email:           string
  avatar:          string | null
  documentUrl:     string
  isVerifiedId:    boolean
  isVerifiedEmail: boolean
  isVerifiedSms:   boolean
  createdAt:       string
}

// ── Panel vérifications identité ──────────────────────────────────────────────
function IdentityPanel({ token }: { token: string }) {
  const [list, setList]       = useState<PendingVerification[]>([])
  const [loading, setLoading] = useState(true)
  const [preview, setPreview] = useState<string | null>(null)
  const [busy, setBusy]       = useState<string | null>(null)

  const fetchList = useCallback(async () => {
    setLoading(true)
    try {
      const res  = await fetch('/api/admin/pending-verifications', {
        headers: { Authorization: `Bearer ${token}` }
      })
      const data = await res.json()
      setList(Array.isArray(data) ? data : [])
    } finally {
      setLoading(false)
    }
  }, [token])

  useEffect(() => { fetchList() }, [fetchList])

  const handleDecision = async (uid: string, approved: boolean) => {
    setBusy(uid)
    try {
      await fetch('/api/verify/identity', {
        method:  'PATCH',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body:    JSON.stringify({ uid, approved }),
      })
      await fetchList()
    } finally {
      setBusy(null)
    }
  }

  const pending  = list.filter(u => !u.isVerifiedId)
  const approved = list.filter(u =>  u.isVerifiedId)

  return (
    <div className="mb-10">
      <h2 className="text-lg font-bold text-slate-800 mb-1">
        🪪 Vérifications d'identité
      </h2>
      <p className="text-sm text-slate-500 mb-5">
        {pending.length} en attente · {approved.length} approuvée{approved.length > 1 ? 's' : ''}
      </p>

      {loading ? (
        <div className="space-y-3">
          {[...Array(2)].map((_, i) => (
            <div key={i} className="h-20 rounded-2xl bg-slate-100 animate-pulse" />
          ))}
        </div>
      ) : list.length === 0 ? (
        <p className="text-sm text-slate-400 italic">Aucun document soumis pour l'instant.</p>
      ) : (
        <div className="space-y-3">
          {/* En attente d'abord */}
          {[...pending, ...approved].map(u => (
            <div key={u.uid}
              className={`rounded-2xl border p-4 flex flex-col sm:flex-row sm:items-center gap-4 ${
                u.isVerifiedId
                  ? 'bg-green-50 border-green-100'
                  : 'bg-white border-amber-200'
              }`}
            >
              {/* Avatar + infos */}
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <div className="w-10 h-10 rounded-full bg-slate-200 flex-shrink-0 flex items-center justify-center font-bold text-slate-600 overflow-hidden">
                  {u.avatar
                    ? <Image src={u.avatar} alt={u.name} width={40} height={40} className="object-cover w-full h-full" />
                    : u.name.charAt(0).toUpperCase()}
                </div>
                <div className="min-w-0">
                  <p className="font-semibold text-slate-800 truncate">{u.name}</p>
                  <p className="text-xs text-slate-500 truncate">{u.email}</p>
                  <div className="flex gap-1.5 mt-1 flex-wrap">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${u.isVerifiedEmail ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-400'}`}>
                      {u.isVerifiedEmail ? '✉️ Email ✓' : '✉️ Email —'}
                    </span>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${u.isVerifiedSms ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-400'}`}>
                      {u.isVerifiedSms ? '📱 SMS ✓' : '📱 SMS —'}
                    </span>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${u.isVerifiedId ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                      {u.isVerifiedId ? '🪪 Identité ✓' : '🪪 En attente'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 flex-shrink-0">
                <button
                  onClick={() => setPreview(u.documentUrl)}
                  className="text-xs font-semibold px-3 py-2 rounded-xl bg-slate-100 text-slate-600 hover:bg-slate-200 transition"
                >
                  👁️ Voir le document
                </button>
                {!u.isVerifiedId ? (
                  <>
                    <button
                      onClick={() => handleDecision(u.uid, true)}
                      disabled={busy === u.uid}
                      className="text-xs font-bold px-3 py-2 rounded-xl bg-green-500 text-white hover:bg-green-600 transition disabled:opacity-50"
                    >
                      {busy === u.uid ? '…' : '✅ Approuver'}
                    </button>
                    <button
                      onClick={() => handleDecision(u.uid, false)}
                      disabled={busy === u.uid}
                      className="text-xs font-bold px-3 py-2 rounded-xl bg-red-50 text-red-500 border border-red-200 hover:bg-red-100 transition disabled:opacity-50"
                    >
                      ❌ Rejeter
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => handleDecision(u.uid, false)}
                    disabled={busy === u.uid}
                    className="text-xs font-semibold px-3 py-2 rounded-xl bg-slate-100 text-slate-500 hover:bg-red-50 hover:text-red-500 transition disabled:opacity-50"
                  >
                    Révoquer
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal prévisualisation document */}
      {preview && (
        <div
          className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4"
          onClick={() => setPreview(null)}
        >
          <div className="bg-white rounded-2xl p-4 max-w-lg w-full" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-3">
              <p className="font-bold text-slate-700">Document d'identité</p>
              <button onClick={() => setPreview(null)} className="text-slate-400 hover:text-slate-600 text-xl">✕</button>
            </div>
            <img
              src={preview}
              alt="Document identité"
              className="w-full rounded-xl object-contain max-h-[60vh]"
              onError={e => { (e.target as HTMLImageElement).src = '' }}
            />
            <a
              href={preview}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 block text-center text-sm font-semibold text-blue-600 hover:underline"
            >
              Ouvrir en plein écran →
            </a>
          </div>
        </div>
      )}
    </div>
  )
}

// ── Page principale ───────────────────────────────────────────────────────────
export default function ModerationRoute() {
  const { user, isAuthReady } = useUser()
  const router = useRouter()
  const [users, setUsers]       = useState<User[]>([])
  const [services, setServices] = useState<Service[]>([])
  const [requests, setRequests] = useState<Request[]>([])
  const [loading, setLoading]   = useState(true)

  const isAuthorized = user?.role === 'admin' || user?.role === 'moderator'

  const fetchAll = async () => {
    if (!user) return
    const token = localStorage.getItem('token') || ''
    const headers = { Authorization: `Bearer ${token}` }
    setLoading(true)
    try {
      const [usersRes, servicesRes, requestsRes] = await Promise.all([
        fetch('/api/users',    { headers }).then(r => r.ok ? r.json() : []),
        fetch('/api/services', { headers }).then(r => r.ok ? r.json() : []),
        fetch('/api/requests', { headers }).then(r => r.ok ? r.json() : []),
      ])
      setUsers(Array.isArray(usersRes)      ? usersRes    : [])
      setServices(Array.isArray(servicesRes) ? servicesRes : [])
      setRequests(Array.isArray(requestsRes) ? requestsRes : [])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (!isAuthReady) return
    if (!user || !isAuthorized) { setLoading(false); return }
    fetchAll()
  }, [user, isAuthReady])

  if (!isAuthReady || loading) return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="w-8 h-8 border-2 border-amber-400 border-t-transparent rounded-full animate-spin" />
    </div>
  )

  if (!user || !isAuthorized) return (
    <div className="flex items-center justify-center min-h-[60vh] flex-col gap-3">
      <p className="text-4xl">🔒</p>
      <p className="text-slate-500 font-medium">Accès restreint aux modérateurs et administrateurs.</p>
    </div>
  )

  const token = typeof window !== 'undefined' ? localStorage.getItem('token') || '' : ''

  return (
    <div className="max-w-5xl mx-auto px-4 pt-24 pb-16">

      {/* ── Panel vérifications identité ── */}
      <IdentityPanel token={token} />

      <hr className="border-slate-100 mb-10" />

      {/* ── Modération générale ── */}
      <ModerationComponent
        users={users}
        onUpdateUsers={setUsers}
        services={services}
        onUpdateServices={setServices}
        requests={requests}
        onUpdateRequests={setRequests}
        currentUser={user}
        onRefresh={fetchAll}
      />
    </div>
  )
}
