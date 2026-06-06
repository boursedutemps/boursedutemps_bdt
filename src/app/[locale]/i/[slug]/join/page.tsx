'use client'

// src/app/i/[slug]/join/page.tsx
// Page d'inscription des membres à une institution

import { useEffect, useState } from 'react'
import { useParams, useRouter, useSearchParams } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'

interface Institution {
  id: number
  slug: string
  name: string
  logo_url?: string
  primary_color: string
  description?: string
}

export default function InstitutionJoinPage() {
  const { slug }        = useParams() as { slug: string }
  const searchParams    = useSearchParams()
  const router          = useRouter()
  const token           = searchParams.get('token') || ''

  const [institution, setInstitution] = useState<Institution | null>(null)
  const [tokenValid, setTokenValid]   = useState<boolean | null>(null)
  const [loading, setLoading]         = useState(true)
  const [joining, setJoining]         = useState(false)
  const [error, setError]             = useState<string | null>(null)
  const [department, setDepartment]   = useState('')
  const [studentId, setStudentId]     = useState('')

  useEffect(() => {
    const init = async () => {
      // Charger l'institution
      const instRes = await fetch(`/api/institution?slug=${slug}`)
      if (!instRes.ok) { router.replace('/404'); return }
      setInstitution(await instRes.json())

      // Valider le token si présent
      if (token) {
        const tokenRes = await fetch(`/api/institution/invite?token=${token}`)
        setTokenValid(tokenRes.ok)
      } else {
        setTokenValid(false)
      }
      setLoading(false)
    }
    if (slug) init()
  }, [slug, token, router])

  const handleJoin = async () => {
    const storedToken = localStorage.getItem('token')
    if (!storedToken) {
      // Rediriger vers login avec retour sur cette page
      router.push(`/?auth=login&redirect=/i/${slug}/join?token=${token}`)
      return
    }

    setJoining(true)
    setError(null)

    try {
      // Récupérer l'uid de l'utilisateur connecté
      const meRes = await fetch('/api/auth/me', {
        headers: { Authorization: `Bearer ${storedToken}` }
      })
      if (!meRes.ok) throw new Error('Session expirée, reconnectez-vous')
      const me = await meRes.json()

      const res = await fetch('/api/institution/invite', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action:     'join',
          token,
          user_uid:   me.uid || me.id,
          department: department || null,
          student_id: studentId || null,
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)

      // Rediriger vers le dashboard institution
      router.push(`/i/${slug}?joined=1`)
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Erreur')
    } finally {
      setJoining(false)
    }
  }

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
    </div>
  )

  if (!institution) return null

  const color = institution.primary_color || '#2563EB'

  return (
    <main className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">

        {/* Card */}
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden">

          {/* Header coloré */}
          <div className="p-8 text-center" style={{ background: `linear-gradient(135deg, ${color}15, ${color}30)` }}>
            {institution.logo_url ? (
              <div className="relative w-20 h-20 rounded-2xl overflow-hidden mx-auto mb-4 shadow-lg">
                <Image src={institution.logo_url} alt={institution.name} fill className="object-cover" />
              </div>
            ) : (
              <div className="w-20 h-20 rounded-2xl mx-auto mb-4 flex items-center justify-center text-3xl font-bold text-white shadow-lg"
                style={{ background: color }}>
                {institution.name[0]}
              </div>
            )}
            <h1 className="text-xl font-bold text-slate-800">{institution.name}</h1>
            {institution.description && (
              <p className="text-sm text-slate-500 mt-2 leading-relaxed">{institution.description}</p>
            )}
          </div>

          <div className="p-6">
            {!tokenValid ? (
              // Pas de token valide
              <div className="text-center space-y-4">
                <p className="text-4xl">🔒</p>
                <h2 className="font-bold text-slate-800">Accès sur invitation</h2>
                <p className="text-sm text-slate-500 leading-relaxed">
                  Pour rejoindre {institution.name}, vous avez besoin d'un lien d'invitation fourni par votre institution.
                </p>
                <p className="text-sm text-slate-500">
                  Contactez votre responsable ou l'administration pour obtenir votre lien.
                </p>
                <Link href="/"
                  className="block mt-4 py-3 rounded-xl text-sm font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 transition text-center">
                  ← Retour à la plateforme
                </Link>
              </div>
            ) : (
              // Token valide → formulaire
              <div className="space-y-4">
                <div className="bg-green-50 border border-green-100 rounded-xl p-3 flex items-center gap-2">
                  <span className="text-green-600">✓</span>
                  <p className="text-sm text-green-700 font-semibold">Invitation valide</p>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                    Département / Filière <span className="text-slate-400 font-normal">(optionnel)</span>
                  </label>
                  <input
                    value={department}
                    onChange={e => setDepartment(e.target.value)}
                    placeholder="Ex : Sciences du numérique"
                    className="w-full px-4 py-3 rounded-xl text-sm border border-slate-200 bg-slate-50 outline-none focus:border-blue-400 transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                    Numéro étudiant / matricule <span className="text-slate-400 font-normal">(optionnel)</span>
                  </label>
                  <input
                    value={studentId}
                    onChange={e => setStudentId(e.target.value)}
                    placeholder="Ex : 2024-SN-0042"
                    className="w-full px-4 py-3 rounded-xl text-sm border border-slate-200 bg-slate-50 outline-none focus:border-blue-400 transition-colors"
                  />
                </div>

                {error && (
                  <p className="text-sm text-red-500 bg-red-50 px-4 py-2 rounded-xl">⚠️ {error}</p>
                )}

                <button
                  onClick={handleJoin}
                  disabled={joining}
                  className="w-full py-3.5 rounded-xl text-sm font-bold text-white transition-all"
                  style={{
                    background: `linear-gradient(135deg, ${color}, ${color}cc)`,
                    boxShadow: `0 4px 14px ${color}40`,
                    opacity: joining ? 0.7 : 1,
                  }}
                >
                  {joining ? '⏳ Inscription en cours…' : `Rejoindre ${institution.name} →`}
                </button>

                <p className="text-xs text-slate-400 text-center">
                  Vous resterez également accessible sur la plateforme principale.
                </p>
              </div>
            )}
          </div>
        </div>

        <p className="text-center mt-4 text-xs text-slate-400">
          Propulsé par{' '}
          <Link href="/" className="text-blue-500 hover:underline">Bourse du Temps</Link>
        </p>
      </div>
    </main>
  )
}
