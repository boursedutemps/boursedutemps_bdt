'use client'

// src/components/VerificationPanel.tsx
// Panel de vérification progressive 3 niveaux

import { useState, useRef } from 'react'

interface VerificationPanelProps {
  uid: string
  isVerifiedEmail: boolean
  isVerifiedSms: boolean
  isVerifiedId: boolean
  verificationLevel: number
  phone?: string
  onUpdate?: () => void
}

type Step = 'idle' | 'sms_phone' | 'sms_code' | 'id_upload' | 'id_pending' | 'done'

const LEVELS = [
  {
    num:         1,
    icon:        '📧',
    title:       'Email vérifié',
    description: 'Votre adresse email est confirmée',
    color:       '#10B981',
    bg:          '#F0FDF4',
    border:      '#BBF7D0',
  },
  {
    num:         2,
    icon:        '📱',
    title:       'Téléphone vérifié',
    description: 'Vérifiez votre numéro de téléphone par SMS',
    color:       '#3B82F6',
    bg:          '#EFF6FF',
    border:      '#BFDBFE',
  },
  {
    num:         3,
    icon:        '🪪',
    title:       'Identité vérifiée',
    description: 'Soumettez une pièce d\'identité officielle',
    color:       '#8B5CF6',
    bg:          '#F5F3FF',
    border:      '#DDD6FE',
  },
]

export default function VerificationPanel({
  uid, isVerifiedEmail, isVerifiedSms, isVerifiedId,
  verificationLevel, phone: initialPhone, onUpdate,
}: VerificationPanelProps) {
  const [step, setStep]       = useState<Step>('idle')
  const [phone, setPhone]     = useState(initialPhone || '')
  const [code, setCode]       = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState<string | null>(null)
  const [uploadingDoc, setUploadingDoc] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)

  const isVerified = [isVerifiedEmail, isVerifiedSms, isVerifiedId]

  // ── Étape SMS : envoyer code ────────────────────────────────
  const sendSmsCode = async () => {
    if (!phone.trim()) { setError('Entrez votre numéro'); return }
    setLoading(true); setError(null)
    try {
      const res = await fetch('/api/verify/sms/init', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone, uid }),
      })
      const j = await res.json()
      if (!res.ok) throw new Error(j.error)
      setStep('sms_code')
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Erreur')
    } finally { setLoading(false) }
  }

  // ── Étape SMS : vérifier code ───────────────────────────────
  const verifySmsCode = async () => {
    if (code.length !== 6) { setError('Code à 6 chiffres requis'); return }
    setLoading(true); setError(null)
    try {
      const res = await fetch('/api/verify/sms/check', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone, code, uid }),
      })
      const j = await res.json()
      if (!res.ok) throw new Error(j.error)
      setStep('done')
      onUpdate?.()
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Erreur')
    } finally { setLoading(false) }
  }

  // ── Étape ID : upload document ──────────────────────────────
  const uploadDocument = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (file.size > 10 * 1024 * 1024) { setError('Fichier trop lourd (max 10 Mo)'); return }

    setUploadingDoc(true); setError(null)
    try {
      // Upload vers Cloudinary
      const formData = new FormData()
      formData.append('file', file)
      formData.append('upload_preset', process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || 'bdt_avatars')
      formData.append('folder', 'boursedutemps/identity')

      const uploadRes = await fetch(
        `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
        { method: 'POST', body: formData }
      )
      const uploadData = await uploadRes.json()
      if (!uploadRes.ok) throw new Error(uploadData.error?.message || 'Upload échoué')

      // Soumettre à l'API
      const res = await fetch('/api/verify/identity', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ uid, document_url: uploadData.secure_url }),
      })
      const j = await res.json()
      if (!res.ok) throw new Error(j.error)

      setStep('id_pending')
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Erreur upload')
    } finally { setUploadingDoc(false) }
  }

  const inputClass = "w-full px-4 py-3 rounded-xl text-sm border border-slate-200 bg-slate-50 outline-none focus:border-amber-400 transition-colors"

  return (
    <div className="mt-4 bg-white rounded-[1.5rem] border border-slate-100 overflow-hidden">

      {/* En-tête niveau actuel */}
      <div className="p-5 bg-gradient-to-r from-slate-50 to-white border-b border-slate-50">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">
              Niveau de confiance
            </p>
            <div className="flex gap-1.5 items-center">
              {[1,2,3].map(n => (
                <div
                  key={n}
                  className="w-8 h-2 rounded-full transition-all"
                  style={{
                    background: n <= verificationLevel
                      ? LEVELS[n-1].color
                      : '#E2E8F0',
                  }}
                />
              ))}
              <span className="text-sm font-bold text-slate-600 ml-1">
                {verificationLevel}/3
              </span>
            </div>
          </div>
          <div
            className="w-12 h-12 rounded-2xl flex items-center justify-center text-xl font-bold"
            style={{
              background: verificationLevel >= 3 ? '#F5F3FF' :
                          verificationLevel >= 2 ? '#EFF6FF' :
                          verificationLevel >= 1 ? '#F0FDF4' : '#F8FAFC',
            }}
          >
            {verificationLevel >= 3 ? '👑' :
             verificationLevel >= 2 ? '🔵' :
             verificationLevel >= 1 ? '✅' : '🔒'}
          </div>
        </div>
      </div>

      {/* Niveaux */}
      <div className="p-5 space-y-3">
        {LEVELS.map((level, i) => {
          const verified = isVerified[i]
          const isNext   = !verified && (i === 0 || isVerified[i - 1])
          const locked   = !verified && !isNext

          return (
            <div
              key={level.num}
              className="rounded-2xl p-4 border transition-all"
              style={{
                background: verified ? level.bg : locked ? '#F8FAFC' : '#FFFCF7',
                borderColor: verified ? level.border : locked ? '#F1F5F9' : '#FDE68A',
                opacity: locked ? 0.5 : 1,
              }}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-2xl" style={{ filter: locked ? 'grayscale(1)' : 'none' }}>
                    {level.icon}
                  </span>
                  <div>
                    <p className="text-sm font-bold text-slate-700">{level.title}</p>
                    <p className="text-xs text-slate-400">{level.description}</p>
                  </div>
                </div>

                {verified ? (
                  <span className="text-xs font-bold px-3 py-1 rounded-full"
                    style={{ background: level.color, color: '#fff' }}>
                    ✓ Vérifié
                  </span>
                ) : isNext ? (
                  <button
                    onClick={() => {
                      setError(null)
                      if (i === 1) setStep('sms_phone')
                      if (i === 2) setStep('id_upload')
                    }}
                    className="text-xs font-bold px-3 py-1.5 rounded-full text-white transition-all"
                    style={{
                      background: 'linear-gradient(135deg,#F59E0B,#EF4444)',
                      boxShadow: '0 2px 8px rgba(245,158,11,0.3)',
                    }}
                  >
                    Vérifier →
                  </button>
                ) : (
                  <span className="text-xs text-slate-400">🔒 Verrouillé</span>
                )}
              </div>

              {/* Formulaire SMS */}
              {i === 1 && isNext && step === 'sms_phone' && (
                <div className="mt-4 space-y-3">
                  <input
                    type="tel"
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    placeholder="+33 6 12 34 56 78"
                    className={inputClass}
                  />
                  {error && <p className="text-xs text-red-500">⚠️ {error}</p>}
                  <div className="flex gap-2">
                    <button onClick={() => setStep('idle')}
                      className="flex-1 py-2.5 rounded-xl text-xs font-semibold bg-slate-100 text-slate-500">
                      Annuler
                    </button>
                    <button onClick={sendSmsCode} disabled={loading}
                      className="flex-1 py-2.5 rounded-xl text-xs font-bold text-white"
                      style={{ background: 'linear-gradient(135deg,#3B82F6,#6366F1)' }}>
                      {loading ? '⏳ Envoi…' : 'Envoyer le code →'}
                    </button>
                  </div>
                </div>
              )}

              {i === 1 && isNext && step === 'sms_code' && (
                <div className="mt-4 space-y-3">
                  <p className="text-xs text-slate-500">Code envoyé au <strong>{phone}</strong></p>
                  <input
                    type="text"
                    value={code}
                    onChange={e => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    placeholder="123456"
                    className={`${inputClass} text-center text-2xl font-bold tracking-widest`}
                    maxLength={6}
                  />
                  {error && <p className="text-xs text-red-500">⚠️ {error}</p>}
                  <div className="flex gap-2">
                    <button onClick={() => setStep('sms_phone')}
                      className="flex-1 py-2.5 rounded-xl text-xs font-semibold bg-slate-100 text-slate-500">
                      ← Retour
                    </button>
                    <button onClick={verifySmsCode} disabled={loading || code.length !== 6}
                      className="flex-1 py-2.5 rounded-xl text-xs font-bold text-white"
                      style={{ background: code.length === 6 ? 'linear-gradient(135deg,#3B82F6,#6366F1)' : '#E2E8F0',
                               color: code.length === 6 ? '#fff' : '#94A3B8' }}>
                      {loading ? '⏳ Vérification…' : 'Confirmer →'}
                    </button>
                  </div>
                </div>
              )}

              {/* Formulaire document */}
              {i === 2 && isNext && step === 'id_upload' && (
                <div className="mt-4 space-y-3">
                  <p className="text-xs text-slate-500 leading-relaxed">
                    Carte nationale, passeport ou permis de conduire. Votre document est stocké de façon sécurisée et examiné sous 24-48h.
                  </p>
                  <input ref={fileRef} type="file" accept="image/*,.pdf" className="hidden" onChange={uploadDocument} />
                  {error && <p className="text-xs text-red-500">⚠️ {error}</p>}
                  <div className="flex gap-2">
                    <button onClick={() => setStep('idle')}
                      className="flex-1 py-2.5 rounded-xl text-xs font-semibold bg-slate-100 text-slate-500">
                      Annuler
                    </button>
                    <button onClick={() => fileRef.current?.click()} disabled={uploadingDoc}
                      className="flex-1 py-2.5 rounded-xl text-xs font-bold text-white"
                      style={{ background: 'linear-gradient(135deg,#8B5CF6,#6366F1)' }}>
                      {uploadingDoc ? '⏳ Upload…' : '📎 Choisir un fichier'}
                    </button>
                  </div>
                </div>
              )}

              {i === 2 && step === 'id_pending' && (
                <div className="mt-3 flex items-center gap-2 text-xs text-purple-600 bg-purple-50 px-3 py-2 rounded-xl">
                  <span>⏳</span>
                  <span className="font-semibold">Document soumis — validation sous 24-48h</span>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
