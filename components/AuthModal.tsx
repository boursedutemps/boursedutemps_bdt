'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabaseClient'

type Step = 'email' | 'otp' | 'signup_name'
type Mode = 'login' | 'signup'

interface AuthModalProps {
  onClose: () => void
  onSuccess: (token: string, userId: string, name: string, email: string) => void
}

export default function AuthModal({ onClose, onSuccess }: AuthModalProps) {
  const [mode, setMode] = useState<Mode>('login')
  const [step, setStep] = useState<Step>('email')
  const [email, setEmail] = useState('')
  const [otp, setOtp] = useState('')
  const [name, setName] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [info, setInfo] = useState('')

  // ── Étape 1 : envoi OTP ──────────────────────────────────────────────────
  async function handleSendOtp() {
    setError('')
    setLoading(true)
    try {
      const { error } = await supabase!.auth.signInWithOtp({
        email,
        options: { shouldCreateUser: mode === 'signup' },
      })
      if (error) throw error
      setInfo(`Un code a été envoyé à ${email}`)
      setStep(mode === 'signup' ? 'signup_name' : 'otp')
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Erreur envoi OTP')
    } finally {
      setLoading(false)
    }
  }

  // ── Étape 2 (signup) : nom puis affichage champ OTP ──────────────────────
  function handleNameNext() {
    if (!name.trim()) { setError('Veuillez entrer votre nom'); return }
    setError('')
    setStep('otp')
  }

  // ── Étape finale : vérification OTP ──────────────────────────────────────
  async function handleVerifyOtp() {
    setError('')
    setLoading(true)
    try {
      const { data, error } = await supabase!.auth.verifyOtp({
        email,
        token: otp,
        type: 'email',
      })
      if (error) throw error

      const session = data.session
      const user = data.user
      if (!session || !user) throw new Error('Session introuvable')

      // Si signup → mettre à jour le profil Supabase avec le nom
      if (mode === 'signup' && name) {
        await supabase!.auth.updateUser({ data: { full_name: name } })
        // Créer le profil dans notre table users PostgreSQL
        await fetch('/api/profil', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${session.access_token}`,
          },
          body: JSON.stringify({ name, email }),
        })
      }

      // Récupérer le nom depuis notre DB si login
      let displayName = name
      if (mode === 'login') {
        const res = await fetch('/api/profil', {
          headers: { Authorization: `Bearer ${session.access_token}` },
        })
        if (res.ok) {
          const profil = await res.json()
          displayName = profil.name ?? email
        }
      }

      onSuccess(session.access_token, user.id, displayName, email)
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Code invalide ou expiré')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-xl">✕</button>

        <h2 className="text-2xl font-bold mb-6 text-center">
          {mode === 'login' ? 'Connexion' : 'Créer un compte'}
        </h2>

        {/* Toggle mode */}
        <div className="flex justify-center gap-4 mb-6">
          {(['login', 'signup'] as Mode[]).map(m => (
            <button
              key={m}
              onClick={() => { setMode(m); setStep('email'); setError(''); setInfo('') }}
              className={`px-4 py-1 rounded-full text-sm font-medium transition ${
                mode === m ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {m === 'login' ? 'Connexion' : 'Inscription'}
            </button>
          ))}
        </div>

        {error && <p className="text-red-500 text-sm mb-4 text-center">{error}</p>}
        {info && <p className="text-green-600 text-sm mb-4 text-center">{info}</p>}

        {/* Étape : email */}
        {step === 'email' && (
          <div className="space-y-4">
            <input
              type="email"
              placeholder="Votre adresse email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSendOtp()}
              className="w-full border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={handleSendOtp}
              disabled={loading || !email}
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 transition"
            >
              {loading ? 'Envoi…' : 'Envoyer le code'}
            </button>
          </div>
        )}

        {/* Étape : nom (signup uniquement) */}
        {step === 'signup_name' && (
          <div className="space-y-4">
            <p className="text-sm text-gray-500 text-center">Code envoyé à <strong>{email}</strong></p>
            <input
              type="text"
              placeholder="Votre nom complet"
              value={name}
              onChange={e => setName(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleNameNext()}
              className="w-full border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={handleNameNext}
              disabled={!name.trim()}
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 transition"
            >
              Continuer
            </button>
          </div>
        )}

        {/* Étape : OTP */}
        {step === 'otp' && (
          <div className="space-y-4">
            <p className="text-sm text-gray-500 text-center">Code envoyé à <strong>{email}</strong></p>
            <input
              type="text"
              placeholder="Code à 6 chiffres"
              value={otp}
              maxLength={6}
              onChange={e => setOtp(e.target.value.replace(/\D/g, ''))}
              onKeyDown={e => e.key === 'Enter' && otp.length === 6 && handleVerifyOtp()}
              className="w-full border rounded-lg px-4 py-3 text-center text-2xl tracking-widest focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={handleVerifyOtp}
              disabled={loading || otp.length !== 6}
              className="w-full bg-green-600 text-white py-3 rounded-lg font-medium hover:bg-green-700 disabled:opacity-50 transition"
            >
              {loading ? 'Vérification…' : 'Valider'}
            </button>
            <button
              onClick={() => { setStep('email'); setOtp(''); setInfo('') }}
              className="w-full text-sm text-gray-400 hover:text-gray-600"
            >
              ← Changer d'email
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
