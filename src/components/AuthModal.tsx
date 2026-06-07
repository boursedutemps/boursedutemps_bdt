'use client'

import { useState, useRef, ChangeEvent } from 'react'
import { supabase } from '@/lib/supabase/client'

/* ─── Types ─────────────────────────────────────────────────────────────── */
type Mode = 'login' | 'signup'

interface AuthModalProps {
  onClose: () => void
  onSuccess: (token: string, userId: string, name: string, email: string) => void
}

/* ─── Static data ────────────────────────────────────────────────────────── */
const STUDY_DOMAINS = [
  'Informatique / Numérique',
  'Sciences / Mathématiques',
  'Médecine / Santé',
  'Droit / Sciences juridiques',
  'Économie / Gestion',
  'Commerce / Marketing',
  'Architecture / Design',
  'Arts / Lettres / Humanités',
  'Langues / Linguistique',
  'Sciences politiques',
  'Psychologie / Sciences sociales',
  'Ingénierie / Technologie',
  'Agriculture / Environnement',
  'Communication / Journalisme',
  'Éducation / Pédagogie',
  'Finance / Comptabilité',
  'Histoire / Géographie',
  'Philosophie / Éthique',
  'Sport / STAPS',
  'Autre',
]

const COUNTRIES = [
  'Afghanistan', 'Afrique du Sud', 'Albanie', 'Algérie', 'Allemagne', 'Angola',
  'Arabie saoudite', 'Argentine', 'Australie', 'Autriche', 'Azerbaïdjan', 'Bangladesh',
  'Belgique', 'Bénin', 'Bolivie', 'Bosnie-Herzégovine', 'Brésil', 'Bulgarie',
  'Burkina Faso', 'Burundi', 'Cambodge', 'Cameroun', 'Canada', 'Chili', 'Chine',
  'Colombie', 'Congo (RDC)', 'Congo (Rép.)', 'Corée du Sud', 'Costa Rica',
  "Côte d'Ivoire", 'Croatie', 'Cuba', 'Danemark', 'Égypte', 'Émirats arabes unis',
  'Équateur', 'Espagne', 'Estonie', 'États-Unis', 'Éthiopie', 'Finlande', 'France',
  'Gabon', 'Ghana', 'Grèce', 'Guatemala', 'Guinée', 'Haïti', 'Hongrie', 'Inde',
  'Indonésie', 'Irak', 'Iran', 'Irlande', 'Israël', 'Italie', 'Japon', 'Jordanie',
  'Kazakhstan', 'Kenya', 'Liban', 'Libye', 'Madagascar', 'Mali', 'Maroc',
  'Mauritanie', 'Mexique', 'Moldavie', 'Mozambique', 'Myanmar', 'Namibie', 'Népal',
  'Nicaragua', 'Niger', 'Nigéria', 'Norvège', 'Nouvelle-Zélande', 'Ouganda',
  'Pakistan', 'Panama', 'Paraguay', 'Pays-Bas', 'Pérou', 'Philippines', 'Pologne',
  'Portugal', 'République tchèque', 'Roumanie', 'Royaume-Uni', 'Russie', 'Rwanda',
  'Sénégal', 'Serbie', 'Sierra Leone', 'Somalie', 'Soudan', 'Sri Lanka', 'Suède',
  'Suisse', 'Syrie', 'Taïwan', 'Tanzanie', 'Tchad', 'Thaïlande', 'Togo', 'Tunisie',
  'Turquie', 'Ukraine', 'Uruguay', 'Venezuela', 'Vietnam', 'Yémen', 'Zimbabwe',
]

const LANGUAGES = [
  'Français', 'Anglais', 'Arabe', 'Espagnol', 'Portugais', 'Allemand', 'Italien',
  'Chinois', 'Hindi', 'Russe', 'Japonais', 'Coréen', 'Turc', 'Néerlandais',
  'Polonais', 'Swahili', 'Haoussa', 'Wolof', 'Bambara', 'Peul', 'Autre',
]

const DISPONIBILITIES = [
  'Matin (8h–12h)',
  'Après-midi (12h–18h)',
  'Soir (18h–22h)',
  'Week-end',
  'Flexible',
]

/* ─── Component ──────────────────────────────────────────────────────────── */
export default function AuthModal({ onClose, onSuccess }: AuthModalProps) {
  const [mode, setMode] = useState<Mode>('login')
  const [step, setStep] = useState(1)

  /* Shared */
  const [email, setEmail]     = useState('')
  const [otp, setOtp]         = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState('')
  const [info, setInfo]       = useState('')

  /* Login */
  const [loginPassword, setLoginPassword] = useState('')
  const [showLoginPwd, setShowLoginPwd]   = useState(false)

  /* OTP resend cooldown */
  const [resendCooldown, setResendCooldown] = useState(0)
  const cooldownRef = useRef<ReturnType<typeof setInterval> | null>(null)

  function startCooldown() {
    setResendCooldown(60)
    cooldownRef.current = setInterval(() => {
      setResendCooldown(prev => {
        if (prev <= 1) { clearInterval(cooldownRef.current!); return 0 }
        return prev - 1
      })
    }, 1000)
  }
  /* Signup step 1 */
  const [whatsapp, setWhatsapp] = useState('')

  /* Signup step 3 */
  const [firstName, setFirstName]             = useState('')
  const [lastName, setLastName]               = useState('')
  const [gender, setGender]                   = useState('')
  const [country, setCountry]                 = useState('')
  const [domains, setDomains]                 = useState<string[]>([])
  const [password, setPassword]               = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPwd, setShowPwd]                 = useState(false)
  const [showConfirmPwd, setShowConfirmPwd]   = useState(false)

  /* Signup step 4 */
  const [skillsOffered, setSkillsOffered]         = useState('')
  const [skillsSought, setSkillsSought]           = useState('')
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>([])
  const [availability, setAvailability]           = useState<string[]>([])
  const [photo, setPhoto]                         = useState<File | null>(null)
  const [photoPreview, setPhotoPreview]           = useState<string | null>(null)
  const [termsAccepted, setTermsAccepted]         = useState(false)
  const photoRef = useRef<HTMLInputElement>(null)

  /* Session ref shared between signup steps 3 & 4 */
  const sessionRef = useRef<{ token: string; userId: string } | null>(null)

  /* ── Helpers ──────────────────────────────────────────────────────────── */
  function resetAll() {
    if (cooldownRef.current) clearInterval(cooldownRef.current)
    setStep(1); setEmail(''); setOtp(''); setError(''); setInfo('')
    setLoginPassword(''); setWhatsapp(''); setResendCooldown(0)
    setFirstName(''); setLastName(''); setGender(''); setCountry('')
    setDomains([]); setPassword(''); setConfirmPassword('')
    setSkillsOffered(''); setSkillsSought(''); setSelectedLanguages([])
    setAvailability([]); setPhoto(null); setPhotoPreview(null); setTermsAccepted(false)
    sessionRef.current = null
  }

  function switchMode(m: Mode) { resetAll(); setMode(m) }

  function toggleArray(arr: string[], val: string, set: (a: string[]) => void) {
    set(arr.includes(val) ? arr.filter(x => x !== val) : [...arr, val])
  }

  /* ── LOGIN — Step 1: email + password → verify then send OTP ─────────── */
  async function handleLoginSendOtp() {
    setError('')
    if (!email || !loginPassword) { setError('Veuillez remplir tous les champs.'); return }
    setLoading(true)
    try {
      const { error: pwErr } = await supabase!.auth.signInWithPassword({
        email,
        password: loginPassword,
      })
      if (pwErr) throw pwErr

      /* Credentials valid — sign out immediately, then send OTP for 2FA */
      await supabase!.auth.signOut()

      const { error: otpErr } = await supabase!.auth.signInWithOtp({
        email,
        options: { shouldCreateUser: false },
      })
      if (otpErr) throw otpErr

      setInfo(`Code envoyé à ${email}`)
      startCooldown()
      setStep(2)
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Email ou mot de passe incorrect.')
    } finally {
      setLoading(false)
    }
  }

  /* ── LOGIN — Step 2: OTP → connexion ─────────────────────────────────── */
  async function handleLoginVerifyOtp() {
    setError('')
    if (otp.length !== 6) { setError('Entrez le code à 6 chiffres.'); return }
    setLoading(true)
    try {
      const { data, error } = await supabase!.auth.verifyOtp({
        email,
        token: otp,
        type: 'email',
      })
      if (error) throw error
      if (!data.session || !data.user) throw new Error('Session introuvable.')

      const { access_token: token } = data.session
      const { id: userId }          = data.user

      const res = await fetch('/api/profil', {
        headers: { Authorization: `Bearer ${token}` },
      })
      let displayName = email
      if (res.ok) {
        const profil = await res.json()
        displayName  = profil.name ?? email
      }

      onSuccess(token, userId, displayName, email)
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Code invalide ou expiré.')
    } finally {
      setLoading(false)
    }
  }

  /* ── SIGNUP — Step 1: email + WhatsApp → send OTP ────────────────────── */
  async function handleSignupSendOtp() {
    setError('')
    if (!email || !whatsapp) { setError('Veuillez remplir tous les champs.'); return }
    setLoading(true)
    try {
      const { error } = await supabase!.auth.signInWithOtp({
        email,
        options: { shouldCreateUser: true },
      })
      if (error) throw error
      setInfo(`Un code a été envoyé à ${email}`)
      startCooldown()
      setStep(2)
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Erreur lors de l'envoi du code.")
    } finally {
      setLoading(false)
    }
  }

  /* ── SIGNUP — Step 2: OTP → connexion automatique ────────────────────── */
  async function handleSignupVerifyOtp() {
    setError('')
    if (otp.length !== 6) { setError('Entrez le code à 6 chiffres.'); return }
    setLoading(true)
    try {
      const { data, error } = await supabase!.auth.verifyOtp({
        email,
        token: otp,
        type: 'email',
      })
      if (error) throw error
      if (!data.session || !data.user) throw new Error('Session introuvable.')

      sessionRef.current = {
        token:  data.session.access_token,
        userId: data.user.id,
      }
      setInfo('')
      setStep(3)
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Code invalide ou expiré.')
    } finally {
      setLoading(false)
    }
  }

  /* ── SIGNUP — Step 3: infos personnelles + mot de passe ──────────────── */
  function handleSignupStep3() {
    setError('')
    if (!firstName.trim())    { setError('Prénom requis.'); return }
    if (!lastName.trim())     { setError('Nom requis.'); return }
    if (!gender)              { setError('Genre requis.'); return }
    if (!country)             { setError("Pays d'origine requis."); return }
    if (domains.length === 0) { setError('Choisissez au moins un domaine.'); return }
    if (password.length < 8)  { setError('Mot de passe : 8 caractères minimum.'); return }
    if (password !== confirmPassword) { setError('Les mots de passe ne correspondent pas.'); return }
    setStep(4)
  }

  /* ── SIGNUP — Step 4: compétences + photo → envoi final ──────────────── */
  async function handleSignupFinish() {
    setError('')
    if (!termsAccepted)        { setError('Veuillez accepter les conditions.'); return }
    if (!sessionRef.current)   { setError('Session expirée, recommencez.'); return }
    setLoading(true)
    try {
      const { token, userId } = sessionRef.current

      /* Update Supabase Auth password and display name */
      await supabase!.auth.updateUser({
        password,
        data: { full_name: `${firstName} ${lastName}` },
      })

      /* Upload photo to Supabase Storage */
      let photoUrl = ''
      if (photo) {
        const ext  = photo.name.split('.').pop() ?? 'jpg'
        const path = `avatars/${userId}.${ext}`
        const { error: uploadErr } = await supabase!.storage
          .from('avatars')
          .upload(path, photo, { upsert: true })
        if (!uploadErr) {
          const { data: urlData } = supabase!.storage
            .from('avatars')
            .getPublicUrl(path)
          photoUrl = urlData.publicUrl
        }
      }

      /* Send full profile to API */
      const res = await fetch('/api/profil', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          email,
          whatsapp,
          firstName,
          lastName,
          name:          `${firstName} ${lastName}`,
          gender,
          country,
          domains,
          skillsOffered: skillsOffered.split(',').map(s => s.trim()).filter(Boolean),
          skillsSought:  skillsSought.split(',').map(s => s.trim()).filter(Boolean),
          languages:     selectedLanguages,
          availability,
          photoUrl,
        }),
      })
      if (!res.ok) {
        const body = await res.json().catch(() => ({}))
        throw new Error(body?.message ?? 'Erreur lors de la création du profil.')
      }

      onSuccess(token, userId, `${firstName} ${lastName}`, email)
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Erreur lors de l'inscription.")
    } finally {
      setLoading(false)
    }
  }

  /* ── Photo handler ────────────────────────────────────────────────────── */
  function handlePhotoChange(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setPhoto(file)
    const reader = new FileReader()
    reader.onload = () => setPhotoPreview(reader.result as string)
    reader.readAsDataURL(file)
  }

  /* ── Style shortcuts ──────────────────────────────────────────────────── */
  const inputCls =
    'w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm'
  const labelCls = 'block text-sm font-medium text-gray-700 mb-1'
  const btnPrimary =
    'w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 transition text-sm'
  const btnBack = 'w-full text-sm text-gray-400 hover:text-gray-600 mt-1'
  const checkboxCls = 'flex items-center gap-2 text-sm cursor-pointer select-none'

  const totalSteps = mode === 'signup' ? 4 : 2
  const stepLabels = mode === 'signup'
    ? ['Email & WhatsApp', 'Vérification', 'Profil & mot de passe', 'Compétences & finalisation']
    : ['Identifiants', 'Vérification']

  /* ── Render ───────────────────────────────────────────────────────────── */
  return (
    <div
      className="fixed inset-x-0 bottom-0 bg-black/50 flex items-center justify-center z-50 p-4"
      style={{ top: 'env(safe-area-inset-top, 0px)' }}
    >
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg relative max-h-[92vh] flex flex-col">

        {/* ── Fixed header ─────────────────────────────────────────────── */}
        <div className="px-8 pt-8 pb-4 flex-shrink-0">
          <button
            onClick={onClose}
            aria-label="Fermer"
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-xl leading-none"
          >
            &times;
          </button>

          <h2 className="text-2xl font-bold text-center mb-4">
            {mode === 'login' ? 'Connexion' : 'Créer un compte'}
          </h2>

          {/* Mode toggle */}
          <div className="flex justify-center gap-3 mb-5">
            {(['login', 'signup'] as Mode[]).map(m => (
              <button
                key={m}
                onClick={() => switchMode(m)}
                className={`px-5 py-1.5 rounded-full text-sm font-medium transition ${
                  mode === m
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {m === 'login' ? 'Connexion' : 'Inscription'}
              </button>
            ))}
          </div>

          {/* Progress bar */}
          <div className="flex gap-1.5 mb-1">
            {Array.from({ length: totalSteps }, (_, i) => (
              <div
                key={i}
                className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${
                  i + 1 <= step ? 'bg-blue-600' : 'bg-gray-200'
                }`}
              />
            ))}
          </div>
          <p className="text-xs text-gray-400 text-center">
            Étape {step} / {totalSteps} — {stepLabels[step - 1]}
          </p>
        </div>

        {/* ── Scrollable body ───────────────────────────────────────────── */}
        <div className="px-8 pb-8 overflow-y-auto flex-1 space-y-0">
          {error && (
            <p className="text-red-500 text-sm mb-4 text-center bg-red-50 rounded-lg py-2 px-3">
              {error}
            </p>
          )}
          {info && (
            <p className="text-green-600 text-sm mb-4 text-center bg-green-50 rounded-lg py-2 px-3">
              {info}
            </p>
          )}

          {/* ════════════════════════════════════════════════════════════
              LOGIN — Étape 1 : email + mot de passe
          ════════════════════════════════════════════════════════════ */}
          {mode === 'login' && step === 1 && (
            <div className="space-y-4">
              <div>
                <label className={labelCls}>Adresse email</label>
                <input
                  type="email"
                  placeholder="vous@exemple.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className={inputCls}
                  autoComplete="email"
                />
              </div>
              <div>
                <label className={labelCls}>Mot de passe</label>
                <div className="relative">
                  <input
                    type={showLoginPwd ? 'text' : 'password'}
                    placeholder="••••••••"
                    value={loginPassword}
                    onChange={e => setLoginPassword(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && handleLoginSendOtp()}
                    className={`${inputCls} pr-12`}
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowLoginPwd(v => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-xs"
                  >
                    {showLoginPwd ? 'Masquer' : 'Voir'}
                  </button>
                </div>
              </div>
              <button
                onClick={handleLoginSendOtp}
                disabled={loading || !email || !loginPassword}
                className={btnPrimary}
              >
                {loading ? 'Vérification...' : 'Recevoir le code de confirmation'}
              </button>
            </div>
          )}

          {/* LOGIN — Étape 2 : OTP */}
          {mode === 'login' && step === 2 && (
            <div className="space-y-4">
              <p className="text-sm text-gray-500 text-center">
                Code envoyé à <strong>{email}</strong>
              </p>
              <input
                type="text"
                inputMode="numeric"
                placeholder="000000"
                value={otp}
                maxLength={6}
                onChange={e => setOtp(e.target.value.replace(/\D/g, ''))}
                onKeyDown={e => e.key === 'Enter' && otp.length === 6 && handleLoginVerifyOtp()}
                className={`${inputCls} text-center text-2xl tracking-widest font-mono`}
                autoComplete="one-time-code"
              />
              <button
                onClick={handleLoginVerifyOtp}
                disabled={loading || otp.length !== 6}
                className="w-full bg-green-600 text-white py-3 rounded-lg font-medium hover:bg-green-700 disabled:opacity-50 transition text-sm"
              >
                {loading ? 'Vérification...' : 'Se connecter'}
              </button>
              <button onClick={() => { setStep(1); setOtp(''); setInfo('') }} className={btnBack}>
                ← Retour
              </button>
              <button
                type="button"
                disabled={resendCooldown > 0 || loading}
                onClick={async () => {
                  setError(''); setOtp('')
                  setLoading(true)
                  try {
                    const { error } = await supabase!.auth.signInWithOtp({ email, options: { shouldCreateUser: false } })
                    if (error) throw error
                    setInfo('Nouveau code envoyé.')
                    startCooldown()
                  } catch (e: unknown) {
                    setError(e instanceof Error ? e.message : 'Erreur renvoi.')
                  } finally { setLoading(false) }
                }}
                className="w-full text-xs text-blue-500 hover:text-blue-700 disabled:text-gray-300 mt-1 transition"
              >
                {resendCooldown > 0 ? `Renvoyer dans ${resendCooldown}s` : 'Renvoyer le code'}
              </button>
            </div>
          )}

          {/* ════════════════════════════════════════════════════════════
              SIGNUP — Étape 1 : email + WhatsApp
          ════════════════════════════════════════════════════════════ */}
          {mode === 'signup' && step === 1 && (
            <div className="space-y-4">
              <div>
                <label className={labelCls}>Adresse email</label>
                <input
                  type="email"
                  placeholder="vous@exemple.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className={inputCls}
                  autoComplete="email"
                />
              </div>
              <div>
                <label className={labelCls}>Numéro WhatsApp</label>
                <input
                  type="tel"
                  placeholder="+33 6 00 00 00 00"
                  value={whatsapp}
                  onChange={e => setWhatsapp(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleSignupSendOtp()}
                  className={inputCls}
                  autoComplete="tel"
                />
              </div>
              <button
                onClick={handleSignupSendOtp}
                disabled={loading || !email || !whatsapp}
                className={btnPrimary}
              >
                {loading ? 'Envoi en cours...' : 'Envoyer le code par email'}
              </button>
            </div>
          )}

          {/* SIGNUP — Étape 2 : OTP */}
          {mode === 'signup' && step === 2 && (
            <div className="space-y-4">
              <p className="text-sm text-gray-500 text-center">
                Code envoyé à <strong>{email}</strong>
              </p>
              <input
                type="text"
                inputMode="numeric"
                placeholder="000000"
                value={otp}
                maxLength={6}
                onChange={e => setOtp(e.target.value.replace(/\D/g, ''))}
                onKeyDown={e => e.key === 'Enter' && otp.length === 6 && handleSignupVerifyOtp()}
                className={`${inputCls} text-center text-2xl tracking-widest font-mono`}
                autoComplete="one-time-code"
              />
              <button
                onClick={handleSignupVerifyOtp}
                disabled={loading || otp.length !== 6}
                className="w-full bg-green-600 text-white py-3 rounded-lg font-medium hover:bg-green-700 disabled:opacity-50 transition text-sm"
              >
                {loading ? 'Vérification...' : 'Valider le code'}
              </button>
              <button onClick={() => { setStep(1); setOtp(''); setInfo('') }} className={btnBack}>
                ← Retour
              </button>
              <button
                type="button"
                disabled={resendCooldown > 0 || loading}
                onClick={async () => {
                  setError(''); setOtp('')
                  setLoading(true)
                  try {
                    const { error } = await supabase!.auth.signInWithOtp({ email, options: { shouldCreateUser: true } })
                    if (error) throw error
                    setInfo('Nouveau code envoyé.')
                    startCooldown()
                  } catch (e: unknown) {
                    setError(e instanceof Error ? e.message : 'Erreur renvoi.')
                  } finally { setLoading(false) }
                }}
                className="w-full text-xs text-blue-500 hover:text-blue-700 disabled:text-gray-300 mt-1 transition"
              >
                {resendCooldown > 0 ? `Renvoyer dans ${resendCooldown}s` : 'Renvoyer le code'}
              </button>
            </div>
          )}

          {/* SIGNUP — Étape 3 : infos personnelles + mot de passe */}
          {mode === 'signup' && step === 3 && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={labelCls}>Prénom</label>
                  <input
                    type="text"
                    placeholder="Jean"
                    value={firstName}
                    onChange={e => setFirstName(e.target.value)}
                    className={inputCls}
                    autoComplete="given-name"
                  />
                </div>
                <div>
                  <label className={labelCls}>Nom</label>
                  <input
                    type="text"
                    placeholder="Dupont"
                    value={lastName}
                    onChange={e => setLastName(e.target.value)}
                    className={inputCls}
                    autoComplete="family-name"
                  />
                </div>
              </div>

              <div>
                <label className={labelCls}>Genre</label>
                <select
                  value={gender}
                  onChange={e => setGender(e.target.value)}
                  className={inputCls}
                >
                  <option value="">Sélectionner...</option>
                  <option value="homme">Homme</option>
                  <option value="femme">Femme</option>
                  <option value="non-binaire">Non-binaire</option>
                  <option value="non-precise">Préfère ne pas préciser</option>
                </select>
              </div>

              <div>
                <label className={labelCls}>Pays d'origine</label>
                <select
                  value={country}
                  onChange={e => setCountry(e.target.value)}
                  className={inputCls}
                >
                  <option value="">Sélectionner un pays...</option>
                  {COUNTRIES.map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className={labelCls}>Domaines d'études / formation</label>
                <div className="border border-gray-300 rounded-lg p-3 max-h-44 overflow-y-auto space-y-1.5">
                  {STUDY_DOMAINS.map(d => (
                    <label key={d} className={checkboxCls}>
                      <input
                        type="checkbox"
                        checked={domains.includes(d)}
                        onChange={() => toggleArray(domains, d, setDomains)}
                        className="accent-blue-600 flex-shrink-0"
                      />
                      <span>{d}</span>
                    </label>
                  ))}
                </div>
                {domains.length > 0 && (
                  <p className="text-xs text-blue-600 mt-1">
                    {domains.length} domaine{domains.length > 1 ? 's' : ''} sélectionné{domains.length > 1 ? 's' : ''}
                  </p>
                )}
              </div>

              <div>
                <label className={labelCls}>Mot de passe</label>
                <div className="relative">
                  <input
                    type={showPwd ? 'text' : 'password'}
                    placeholder="Minimum 8 caractères"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    className={`${inputCls} pr-12`}
                    autoComplete="new-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPwd(v => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-xs"
                  >
                    {showPwd ? 'Masquer' : 'Voir'}
                  </button>
                </div>
                {password.length > 0 && (
                  <div className="flex gap-1 mt-1.5">
                    {[8, 12, 16].map((threshold, i) => (
                      <div
                        key={i}
                        className={`h-1 flex-1 rounded-full transition-all ${
                          password.length >= threshold
                            ? i === 0 ? 'bg-red-400' : i === 1 ? 'bg-yellow-400' : 'bg-green-500'
                            : 'bg-gray-200'
                        }`}
                      />
                    ))}
                    <span className="text-xs text-gray-400 ml-1">
                      {password.length < 8 ? 'Trop court' : password.length < 12 ? 'Faible' : password.length < 16 ? 'Correct' : 'Fort'}
                    </span>
                  </div>
                )}
              </div>
              <div>
                <label className={labelCls}>Confirmer le mot de passe</label>
                <div className="relative">
                  <input
                    type={showConfirmPwd ? 'text' : 'password'}
                    placeholder="Répétez le mot de passe"
                    value={confirmPassword}
                    onChange={e => setConfirmPassword(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && handleSignupStep3()}
                    className={`${inputCls} pr-12`}
                    autoComplete="new-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPwd(v => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-xs"
                  >
                    {showConfirmPwd ? 'Masquer' : 'Voir'}
                  </button>
                </div>
                {confirmPassword.length > 0 && password !== confirmPassword && (
                  <p className="text-xs text-red-400 mt-1">Les mots de passe ne correspondent pas.</p>
                )}
              </div>

              <button onClick={handleSignupStep3} className={btnPrimary}>
                Continuer →
              </button>
              <button onClick={() => { setStep(2); setError('') }} className={btnBack}>
                ← Retour
              </button>
            </div>
          )}

          {/* SIGNUP — Étape 4 : compétences + photo + langues + disponibilités */}
          {mode === 'signup' && step === 4 && (
            <div className="space-y-4">
              <div>
                <label className={labelCls}>Compétences offertes</label>
                <input
                  type="text"
                  placeholder="Ex : React, design graphique, comptabilité"
                  value={skillsOffered}
                  onChange={e => setSkillsOffered(e.target.value)}
                  className={inputCls}
                />
                <p className="text-xs text-gray-400 mt-1">Séparez par des virgules</p>
              </div>

              <div>
                <label className={labelCls}>Compétences recherchées</label>
                <input
                  type="text"
                  placeholder="Ex : Python, marketing digital, droit des affaires"
                  value={skillsSought}
                  onChange={e => setSkillsSought(e.target.value)}
                  className={inputCls}
                />
                <p className="text-xs text-gray-400 mt-1">Séparez par des virgules</p>
              </div>

              <div>
                <label className={labelCls}>Langues parlées</label>
                <div className="border border-gray-300 rounded-lg p-3 max-h-40 overflow-y-auto space-y-1.5">
                  {LANGUAGES.map(l => (
                    <label key={l} className={checkboxCls}>
                      <input
                        type="checkbox"
                        checked={selectedLanguages.includes(l)}
                        onChange={() => toggleArray(selectedLanguages, l, setSelectedLanguages)}
                        className="accent-blue-600 flex-shrink-0"
                      />
                      <span>{l}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className={labelCls}>Disponibilités</label>
                <div className="flex flex-wrap gap-2 mt-1">
                  {DISPONIBILITIES.map(d => (
                    <button
                      key={d}
                      type="button"
                      onClick={() => toggleArray(availability, d, setAvailability)}
                      className={`px-3 py-1.5 rounded-full text-xs font-medium border transition ${
                        availability.includes(d)
                          ? 'bg-blue-600 text-white border-blue-600'
                          : 'bg-white text-gray-600 border-gray-300 hover:border-blue-400'
                      }`}
                    >
                      {d}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className={labelCls}>Photo de profil</label>
                <div
                  onClick={() => photoRef.current?.click()}
                  className="border-2 border-dashed border-gray-300 rounded-lg p-5 text-center cursor-pointer hover:border-blue-400 transition"
                >
                  {photoPreview ? (
                    <img
                      src={photoPreview}
                      alt="Aperçu"
                      className="w-24 h-24 rounded-full mx-auto object-cover ring-2 ring-blue-200"
                    />
                  ) : (
                    <>
                      <p className="text-sm text-gray-400">Cliquer pour ajouter une photo</p>
                      <p className="text-xs text-gray-300 mt-1">JPG, PNG — max 5 Mo</p>
                    </>
                  )}
                </div>
                <input
                  ref={photoRef}
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoChange}
                  className="hidden"
                />
              </div>

              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={termsAccepted}
                  onChange={e => setTermsAccepted(e.target.checked)}
                  className="mt-0.5 accent-blue-600 flex-shrink-0"
                />
                <span className="text-sm text-gray-600">
                  J&apos;accepte les{' '}
                  <a href="/conditions" target="_blank" className="text-blue-600 hover:underline">
                    conditions d&apos;utilisation
                  </a>{' '}
                  et la{' '}
                  <a href="/confidentialite" target="_blank" className="text-blue-600 hover:underline">
                    politique de confidentialité
                  </a>.
                </span>
              </label>

              <button
                onClick={handleSignupFinish}
                disabled={loading || !termsAccepted}
                className={btnPrimary}
              >
                {loading ? 'Création du compte...' : 'Créer mon compte'}
              </button>
              <button onClick={() => { setStep(3); setError('') }} className={btnBack}>
                ← Retour
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
