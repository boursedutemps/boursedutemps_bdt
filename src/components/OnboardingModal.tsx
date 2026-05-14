'use client'

import { useState, useRef, useCallback } from 'react'
import Image from 'next/image'

// ─── Types ────────────────────────────────────────────────────────────────────

interface OnboardingModalProps {
  user: {
    uid: string
    name?: string
    first_name?: string
    avatar?: string
    bio?: string
    country?: string
    onboarding_step?: number
  }
  onComplete: () => void
}

interface FormData {
  // Étape 1 — Profil
  first_name: string
  bio: string
  country: string
  avatar: string | null
  // Étape 2 — Compétence
  skill_title: string
  skill_description: string
  skill_category: string
  skill_credit_cost: number
}

const CATEGORIES = [
  { value: 'informatique',  label: '💻 Informatique' },
  { value: 'langues',       label: '🌍 Langues' },
  { value: 'arts',          label: '🎨 Arts & Créativité' },
  { value: 'cuisine',       label: '🍳 Cuisine' },
  { value: 'sport',         label: '⚽ Sport & Bien-être' },
  { value: 'musique',       label: '🎵 Musique' },
  { value: 'bricolage',     label: '🔧 Bricolage' },
  { value: 'education',     label: '📚 Éducation' },
  { value: 'sante',         label: '🏥 Santé' },
  { value: 'juridique',     label: '⚖️ Juridique' },
  { value: 'autre',         label: '✨ Autre' },
]

const STEPS = [
  { num: 1, label: 'Mon profil',     icon: '👤' },
  { num: 2, label: 'Ma compétence',  icon: '🛠️' },
  { num: 3, label: 'C\'est parti !', icon: '🚀' },
]

// ─── Composant principal ───────────────────────────────────────────────────────

export default function OnboardingModal({ user, onComplete }: OnboardingModalProps) {
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [uploadingAvatar, setUploadingAvatar] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [skipSkill, setSkipSkill] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [form, setForm] = useState<FormData>({
    first_name:         user.first_name || user.name?.split(' ')[0] || '',
    bio:                user.bio || '',
    country:            user.country || '',
    avatar:             user.avatar || null,
    skill_title:        '',
    skill_description:  '',
    skill_category:     '',
    skill_credit_cost:  1,
  })

  // ── Helpers ────────────────────────────────────────────────

  const set = useCallback(
    (key: keyof FormData, value: string | number | null) =>
      setForm(prev => ({ ...prev, [key]: value })),
    []
  )

  const progressPercent = ((step - 1) / (STEPS.length - 1)) * 100

  // ── Upload avatar Cloudinary ───────────────────────────────

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (file.size > 5 * 1024 * 1024) {
      setError('Image trop lourde (max 5 Mo)')
      return
    }
    setUploadingAvatar(true)
    setError(null)
    try {
      const data = new FormData()
      data.append('file', file)
      data.append('upload_preset', process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || 'bdt_avatars')
      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
        { method: 'POST', body: data }
      )
      const json = await res.json()
      if (!res.ok) throw new Error(json.error?.message || 'Upload échoué')
      set('avatar', json.secure_url)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Erreur upload')
    } finally {
      setUploadingAvatar(false)
    }
  }

  // ── Validation par étape ───────────────────────────────────

  const canAdvance = () => {
    if (step === 1) {
      return form.first_name.trim().length >= 2
    }
    if (step === 2) {
      if (skipSkill) return true
      return (
        form.skill_title.trim().length >= 3 &&
        form.skill_description.trim().length >= 10 &&
        form.skill_category !== ''
      )
    }
    return true
  }

  // ── Sauvegarde étape 1 ─────────────────────────────────────

  const saveStep1 = async () => {
    const res = await fetch('/api/onboarding', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        uid:         user.uid,
        step:        1,
        first_name:  form.first_name,
        bio:         form.bio,
        country:     form.country,
        avatar:      form.avatar,
      }),
    })
    if (!res.ok) {
      const j = await res.json()
      throw new Error(j.error || 'Erreur sauvegarde profil')
    }
  }

  // ── Sauvegarde étape 2 ─────────────────────────────────────

  const saveStep2 = async () => {
    if (skipSkill) {
      // marque quand même l'étape comme passée
      await fetch('/api/onboarding', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ uid: user.uid, step: 2, skipped_skill: true }),
      })
      return
    }
    const res = await fetch('/api/onboarding', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        uid:               user.uid,
        step:              2,
        skill_title:       form.skill_title,
        skill_description: form.skill_description,
        skill_category:    form.skill_category,
        skill_credit_cost: form.skill_credit_cost,
      }),
    })
    if (!res.ok) {
      const j = await res.json()
      throw new Error(j.error || 'Erreur sauvegarde compétence')
    }
  }

  // ── Sauvegarde finale ──────────────────────────────────────

  const completeOnboarding = async () => {
    const res = await fetch('/api/onboarding', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ uid: user.uid, step: 3, completed: true }),
    })
    if (!res.ok) {
      const j = await res.json()
      throw new Error(j.error || 'Erreur finalisation')
    }
  }

  // ── Avancer d'une étape ────────────────────────────────────

  const handleNext = async () => {
    if (!canAdvance()) return
    setLoading(true)
    setError(null)
    try {
      if (step === 1) await saveStep1()
      if (step === 2) await saveStep2()
      if (step === 3) {
        await completeOnboarding()
        onComplete()
        return
      }
      setStep(s => s + 1)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Erreur inattendue')
    } finally {
      setLoading(false)
    }
  }

  // ── Rendu ──────────────────────────────────────────────────

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
         style={{ background: 'rgba(15, 23, 42, 0.75)', backdropFilter: 'blur(6px)' }}>

      <div className="relative w-full max-w-lg rounded-2xl overflow-hidden shadow-2xl"
           style={{ background: '#FFFCF7', fontFamily: "'DM Sans', sans-serif" }}>

        {/* Barre de progression */}
        <div className="h-1 w-full bg-amber-100">
          <div
            className="h-full bg-gradient-to-r from-amber-400 to-orange-400 transition-all duration-700 ease-out"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        {/* En-tête */}
        <div className="px-8 pt-8 pb-4">
          {/* Étapes */}
          <div className="flex items-center justify-between mb-6">
            {STEPS.map((s, i) => (
              <div key={s.num} className="flex items-center">
                <div className="flex flex-col items-center gap-1">
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center text-lg font-semibold transition-all duration-300"
                    style={{
                      background: step > s.num
                        ? '#F59E0B'
                        : step === s.num
                          ? '#FEF3C7'
                          : '#F1F5F9',
                      color: step > s.num ? '#fff' : step === s.num ? '#B45309' : '#94A3B8',
                      border: step === s.num ? '2px solid #F59E0B' : '2px solid transparent',
                      boxShadow: step === s.num ? '0 0 0 4px rgba(245,158,11,0.15)' : 'none',
                    }}
                  >
                    {step > s.num ? '✓' : s.icon}
                  </div>
                  <span
                    className="text-xs font-medium hidden sm:block"
                    style={{ color: step === s.num ? '#B45309' : '#94A3B8' }}
                  >
                    {s.label}
                  </span>
                </div>
                {i < STEPS.length - 1 && (
                  <div
                    className="w-16 sm:w-24 h-0.5 mx-2 transition-all duration-500"
                    style={{ background: step > s.num ? '#F59E0B' : '#E2E8F0' }}
                  />
                )}
              </div>
            ))}
          </div>

          {/* Titre dynamique */}
          <div className="mb-6">
            {step === 1 && (
              <>
                <p className="text-xs font-semibold tracking-widest uppercase text-amber-500 mb-1">
                  Étape 1 · Bienvenue 👋
                </p>
                <h2 className="text-2xl font-bold text-slate-800">
                  Parlons de toi
                </h2>
                <p className="text-sm text-slate-500 mt-1">
                  Quelques infos pour que la communauté te découvre
                </p>
              </>
            )}
            {step === 2 && (
              <>
                <p className="text-xs font-semibold tracking-widest uppercase text-amber-500 mb-1">
                  Étape 2 · Ta valeur
                </p>
                <h2 className="text-2xl font-bold text-slate-800">
                  Qu'est-ce que tu sais faire ?
                </h2>
                <p className="text-sm text-slate-500 mt-1">
                  Chaque compétence est précieuse — même 1h de cuisine ou de conversation
                </p>
              </>
            )}
            {step === 3 && (
              <>
                <p className="text-xs font-semibold tracking-widest uppercase text-amber-500 mb-1">
                  C'est fait ! 🎉
                </p>
                <h2 className="text-2xl font-bold text-slate-800">
                  Tu fais partie de la Bourse
                </h2>
                <p className="text-sm text-slate-500 mt-1">
                  Le temps que tu donnes reviendra toujours
                </p>
              </>
            )}
          </div>
        </div>

        {/* Corps */}
        <div className="px-8 pb-4 space-y-4">

          {/* ── Étape 1 ── */}
          {step === 1 && (
            <>
              {/* Avatar */}
              <div className="flex items-center gap-5">
                <div
                  className="relative w-20 h-20 rounded-2xl overflow-hidden cursor-pointer group flex-shrink-0"
                  style={{ background: '#FEF3C7', border: '2px dashed #F59E0B' }}
                  onClick={() => fileInputRef.current?.click()}
                >
                  {form.avatar ? (
                    <Image src={form.avatar} alt="avatar" fill className="object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-3xl">
                      {uploadingAvatar ? '⏳' : '📷'}
                    </div>
                  )}
                  <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-semibold">
                    Changer
                  </div>
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-slate-700 mb-0.5">Photo de profil</p>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Une photo rassure les autres membres. Elle augmente vos chances d'échange de 3×.
                  </p>
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="mt-2 text-xs font-semibold text-amber-600 hover:text-amber-700 transition-colors"
                    disabled={uploadingAvatar}
                  >
                    {uploadingAvatar ? 'Envoi en cours...' : form.avatar ? '↺ Changer' : '+ Ajouter une photo'}
                  </button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleAvatarUpload}
                  />
                </div>
              </div>

              {/* Prénom */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                  Prénom <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  value={form.first_name}
                  onChange={e => set('first_name', e.target.value)}
                  placeholder="Comment tu t'appelles ?"
                  className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all"
                  style={{
                    background: '#F8FAFC',
                    border: '1.5px solid #E2E8F0',
                    color: '#1E293B',
                  }}
                  onFocus={e => (e.target.style.borderColor = '#F59E0B')}
                  onBlur={e => (e.target.style.borderColor = '#E2E8F0')}
                />
              </div>

              {/* Bio */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                  En deux mots… <span className="text-slate-400 font-normal">(optionnel)</span>
                </label>
                <textarea
                  value={form.bio}
                  onChange={e => set('bio', e.target.value)}
                  placeholder="Ex : Développeuse passionnée de cuisine italienne, j'aime partager mes connaissances…"
                  rows={3}
                  maxLength={300}
                  className="w-full px-4 py-3 rounded-xl text-sm outline-none resize-none transition-all"
                  style={{
                    background: '#F8FAFC',
                    border: '1.5px solid #E2E8F0',
                    color: '#1E293B',
                  }}
                  onFocus={e => (e.target.style.borderColor = '#F59E0B')}
                  onBlur={e => (e.target.style.borderColor = '#E2E8F0')}
                />
                <p className="text-right text-xs text-slate-400 mt-0.5">
                  {form.bio.length}/300
                </p>
              </div>

              {/* Pays */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                  Ville ou pays <span className="text-slate-400 font-normal">(optionnel)</span>
                </label>
                <input
                  type="text"
                  value={form.country}
                  onChange={e => set('country', e.target.value)}
                  placeholder="Ex : Paris, France"
                  className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all"
                  style={{
                    background: '#F8FAFC',
                    border: '1.5px solid #E2E8F0',
                    color: '#1E293B',
                  }}
                  onFocus={e => (e.target.style.borderColor = '#F59E0B')}
                  onBlur={e => (e.target.style.borderColor = '#E2E8F0')}
                />
              </div>
            </>
          )}

          {/* ── Étape 2 ── */}
          {step === 2 && !skipSkill && (
            <>
              {/* Titre compétence */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                  Nom de la compétence <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  value={form.skill_title}
                  onChange={e => set('skill_title', e.target.value)}
                  placeholder="Ex : Cours de guitare débutant"
                  className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all"
                  style={{
                    background: '#F8FAFC',
                    border: '1.5px solid #E2E8F0',
                    color: '#1E293B',
                  }}
                  onFocus={e => (e.target.style.borderColor = '#F59E0B')}
                  onBlur={e => (e.target.style.borderColor = '#E2E8F0')}
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                  Ce que tu proposes <span className="text-red-400">*</span>
                </label>
                <textarea
                  value={form.skill_description}
                  onChange={e => set('skill_description', e.target.value)}
                  placeholder="Décris ce que tu peux apporter : niveau, format (présentiel/en ligne), ce que la personne apprendra…"
                  rows={3}
                  maxLength={500}
                  className="w-full px-4 py-3 rounded-xl text-sm outline-none resize-none transition-all"
                  style={{
                    background: '#F8FAFC',
                    border: '1.5px solid #E2E8F0',
                    color: '#1E293B',
                  }}
                  onFocus={e => (e.target.style.borderColor = '#F59E0B')}
                  onBlur={e => (e.target.style.borderColor = '#E2E8F0')}
                />
              </div>

              {/* Catégorie + Crédits */}
              <div className="flex gap-3">
                <div className="flex-1">
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                    Catégorie <span className="text-red-400">*</span>
                  </label>
                  <select
                    value={form.skill_category}
                    onChange={e => set('skill_category', e.target.value)}
                    className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all appearance-none"
                    style={{
                      background: '#F8FAFC',
                      border: '1.5px solid #E2E8F0',
                      color: form.skill_category ? '#1E293B' : '#94A3B8',
                    }}
                    onFocus={e => (e.target.style.borderColor = '#F59E0B')}
                    onBlur={e => (e.target.style.borderColor = '#E2E8F0')}
                  >
                    <option value="">Choisir…</option>
                    {CATEGORIES.map(c => (
                      <option key={c.value} value={c.value}>{c.label}</option>
                    ))}
                  </select>
                </div>

                <div className="w-32">
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                    Crédits/h
                  </label>
                  <div className="flex items-center gap-2 px-3 py-3 rounded-xl"
                       style={{ background: '#F8FAFC', border: '1.5px solid #E2E8F0' }}>
                    <button
                      type="button"
                      onClick={() => set('skill_credit_cost', Math.max(1, form.skill_credit_cost as number - 1))}
                      className="w-6 h-6 rounded-full bg-amber-100 text-amber-700 font-bold text-sm hover:bg-amber-200 transition-colors"
                    >−</button>
                    <span className="flex-1 text-center text-sm font-bold text-slate-700">
                      {form.skill_credit_cost}
                    </span>
                    <button
                      type="button"
                      onClick={() => set('skill_credit_cost', Math.min(10, form.skill_credit_cost as number + 1))}
                      className="w-6 h-6 rounded-full bg-amber-100 text-amber-700 font-bold text-sm hover:bg-amber-200 transition-colors"
                    >+</button>
                  </div>
                </div>
              </div>

              {/* Skip */}
              <button
                type="button"
                onClick={() => setSkipSkill(true)}
                className="text-xs text-slate-400 hover:text-slate-600 underline underline-offset-2 transition-colors"
              >
                Je n'ai pas de compétence à proposer pour l'instant
              </button>
            </>
          )}

          {step === 2 && skipSkill && (
            <div className="py-6 text-center space-y-3">
              <p className="text-4xl">💡</p>
              <p className="text-sm text-slate-600 leading-relaxed">
                Pas de souci ! Tu pourras ajouter tes compétences depuis ton profil à tout moment.
                <br />Tu commences avec <strong className="text-amber-600">5 crédits</strong> pour découvrir la plateforme.
              </p>
              <button
                type="button"
                onClick={() => setSkipSkill(false)}
                className="text-xs text-amber-600 hover:text-amber-700 underline underline-offset-2"
              >
                ← Finalement, j'ai quelque chose à partager
              </button>
            </div>
          )}

          {/* ── Étape 3 ── */}
          {step === 3 && (
            <div className="space-y-4">
              {/* Résumé */}
              <div className="rounded-2xl p-5 space-y-3"
                   style={{ background: 'linear-gradient(135deg, #FEF3C7 0%, #FFF7ED 100%)', border: '1px solid #FDE68A' }}>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl overflow-hidden flex-shrink-0 bg-amber-200">
                    {form.avatar
                      ? <Image src={form.avatar} alt="avatar" width={48} height={48} className="object-cover w-full h-full" />
                      : <div className="w-full h-full flex items-center justify-center text-xl">👤</div>
                    }
                  </div>
                  <div>
                    <p className="font-bold text-slate-800">{form.first_name || user.name}</p>
                    {form.country && <p className="text-xs text-slate-500">📍 {form.country}</p>}
                  </div>
                </div>
                {form.bio && (
                  <p className="text-sm text-slate-600 italic">"{form.bio}"</p>
                )}
                {!skipSkill && form.skill_title && (
                  <div className="flex items-center gap-2 pt-1">
                    <span className="text-xs bg-amber-200 text-amber-800 rounded-full px-3 py-1 font-semibold">
                      🛠️ {form.skill_title}
                    </span>
                    <span className="text-xs text-slate-500">
                      {form.skill_credit_cost} crédit{form.skill_credit_cost > 1 ? 's' : ''}/h
                    </span>
                  </div>
                )}
              </div>

              {/* Prochaines actions */}
              <div className="space-y-2">
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Ce qui t'attend
                </p>
                {[
                  { icon: '🔍', text: 'Explore les compétences de la communauté' },
                  { icon: '💬', text: 'Contacte un membre pour ton premier échange' },
                  { icon: '🏆', text: 'Débloque des badges au fil de tes échanges' },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3 text-sm text-slate-600">
                    <span className="text-base">{item.icon}</span>
                    <span>{item.text}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Erreur */}
        {error && (
          <div className="mx-8 mb-2 px-4 py-2 rounded-xl text-sm text-red-600 bg-red-50 border border-red-100">
            ⚠️ {error}
          </div>
        )}

        {/* Footer / boutons */}
        <div className="px-8 pb-8 pt-4 flex items-center justify-between">
          {step > 1 ? (
            <button
              type="button"
              onClick={() => { setStep(s => s - 1); setError(null) }}
              className="text-sm text-slate-400 hover:text-slate-600 transition-colors font-medium"
              disabled={loading}
            >
              ← Retour
            </button>
          ) : (
            <div />
          )}

          <button
            type="button"
            onClick={handleNext}
            disabled={!canAdvance() || loading}
            className="px-8 py-3 rounded-xl text-sm font-bold transition-all duration-200"
            style={{
              background: canAdvance() && !loading
                ? 'linear-gradient(135deg, #F59E0B 0%, #EF4444 100%)'
                : '#E2E8F0',
              color: canAdvance() && !loading ? '#fff' : '#94A3B8',
              boxShadow: canAdvance() && !loading
                ? '0 4px 14px rgba(245,158,11,0.35)'
                : 'none',
              transform: canAdvance() && !loading ? 'translateY(0)' : 'none',
              cursor: canAdvance() && !loading ? 'pointer' : 'not-allowed',
            }}
            onMouseEnter={e => {
              if (canAdvance() && !loading)
                (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(-1px)'
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(0)'
            }}
          >
            {loading
              ? '⏳ Sauvegarde…'
              : step === 3
                ? '🚀 Commencer les échanges'
                : 'Continuer →'
            }
          </button>
        </div>
      </div>
    </div>
  )
}
