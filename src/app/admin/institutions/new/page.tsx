'use client'

// src/app/admin/institutions/new/page.tsx
// Formulaire de demande / création d'institution

import { useState } from 'react'
import { useRouter } from 'next/navigation'

const TYPES = [
  { value: 'universite',   label: '🎓 Université / Grande École' },
  { value: 'ong',          label: '🌍 ONG / Association internationale' },
  { value: 'collectivite', label: '🏛️ Collectivité territoriale' },
  { value: 'entreprise',   label: '🏢 Entreprise / Fondation' },
  { value: 'association',  label: '🤝 Association locale' },
  { value: 'autre',        label: '✨ Autre' },
]

export default function NewInstitutionPage() {
  const router = useRouter()

  const [form, setForm] = useState({
    slug:            '',
    name:            '',
    description:     '',
    type:            'universite',
    contact_email:   '',
    contact_phone:   '',
    website:         '',
    country:         '',
    address:         '',
    primary_color:   '#2563EB',
    secondary_color: '#F59E0B',
    custom_domain:   '',
  })

  const [loading, setLoading]   = useState(false)
  const [error, setError]       = useState<string | null>(null)
  const [success, setSuccess]   = useState(false)

  const set = (k: string, v: string) => {
    setForm(f => ({ ...f, [k]: v }))
    // Auto-générer le slug depuis le nom
    if (k === 'name') {
      const slug = v.toLowerCase()
        .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '')
        .slice(0, 40)
      setForm(f => ({ ...f, name: v, slug }))
    }
  }

  const handleSubmit = async () => {
    if (!form.name || !form.slug || !form.contact_email) {
      setError('Nom, slug et email de contact sont obligatoires')
      return
    }

    setLoading(true)
    setError(null)

    try {
      const token = localStorage.getItem('token')
      const meRes = await fetch('/api/auth/me', {
        headers: { Authorization: `Bearer ${token}` }
      })
      const me = await meRes.json()

      const res = await fetch('/api/institution', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, admin_uid: me.uid || me.id }),
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.error)

      setSuccess(true)
      setTimeout(() => router.push('/admin/institutions'), 2000)
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Erreur inattendue')
    } finally {
      setLoading(false)
    }
  }

  const inputClass = "w-full px-4 py-3 rounded-xl text-sm border border-slate-200 bg-white outline-none focus:border-blue-400 transition-colors"

  if (success) return (
    <main className="min-h-screen bg-slate-50 flex items-center justify-center">
      <div className="text-center">
        <p className="text-5xl mb-4">🎉</p>
        <h2 className="text-xl font-bold text-slate-800 mb-2">Institution créée !</h2>
        <p className="text-slate-500">Redirection vers la liste…</p>
      </div>
    </main>
  )

  return (
    <main className="min-h-screen bg-slate-50 pt-24 pb-16 px-4">
      <div className="max-w-2xl mx-auto">

        <div className="mb-8">
          <p className="text-xs font-semibold tracking-widest uppercase text-purple-500 mb-2">
            Super Admin
          </p>
          <h1 className="text-3xl font-bold text-slate-800">Nouvelle institution</h1>
          <p className="text-slate-500 mt-2">
            Créez un espace dédié pour une institution partenaire.
          </p>
        </div>

        <div className="bg-white rounded-2xl p-8 border border-slate-100 shadow-sm space-y-5">

          {/* Identité */}
          <div>
            <h2 className="font-bold text-slate-700 mb-4 text-sm uppercase tracking-widest">
              Identité
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                  Nom de l'institution <span className="text-red-400">*</span>
                </label>
                <input value={form.name} onChange={e => set('name', e.target.value)}
                  placeholder="Ex : Université Senghor" className={inputClass} />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                  Slug (URL) <span className="text-red-400">*</span>
                </label>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-400 flex-shrink-0">/i/</span>
                  <input value={form.slug} onChange={e => set('slug', e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))}
                    placeholder="universite-senghor" className={inputClass} />
                </div>
                <p className="text-[10px] text-slate-400 mt-1">
                  Uniquement lettres minuscules, chiffres et tirets
                </p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5">Type</label>
                <select value={form.type} onChange={e => set('type', e.target.value)} className={inputClass}>
                  {TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5">Description</label>
                <textarea value={form.description} onChange={e => set('description', e.target.value)}
                  placeholder="Présentation de l'institution, sa mission, ses objectifs…"
                  rows={3} className={`${inputClass} resize-none`} />
              </div>
            </div>
          </div>

          {/* Contact */}
          <div className="pt-4 border-t border-slate-50">
            <h2 className="font-bold text-slate-700 mb-4 text-sm uppercase tracking-widest">Contact</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                  Email <span className="text-red-400">*</span>
                </label>
                <input type="email" value={form.contact_email}
                  onChange={e => set('contact_email', e.target.value)}
                  placeholder="admin@institution.org" className={inputClass} />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5">Téléphone</label>
                <input value={form.contact_phone} onChange={e => set('contact_phone', e.target.value)}
                  placeholder="+212 6 00 00 00 00" className={inputClass} />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5">Site web</label>
                <input value={form.website} onChange={e => set('website', e.target.value)}
                  placeholder="https://www.institution.org" className={inputClass} />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5">Pays</label>
                <input value={form.country} onChange={e => set('country', e.target.value)}
                  placeholder="Maroc, France, Sénégal…" className={inputClass} />
              </div>
            </div>
          </div>

          {/* Branding */}
          <div className="pt-4 border-t border-slate-50">
            <h2 className="font-bold text-slate-700 mb-4 text-sm uppercase tracking-widest">
              Branding & Domaine
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                  Couleur principale
                </label>
                <div className="flex items-center gap-3">
                  <input type="color" value={form.primary_color}
                    onChange={e => set('primary_color', e.target.value)}
                    className="w-12 h-10 rounded-lg border border-slate-200 cursor-pointer p-1" />
                  <input value={form.primary_color} onChange={e => set('primary_color', e.target.value)}
                    className={`${inputClass} flex-1`} placeholder="#2563EB" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                  Couleur secondaire
                </label>
                <div className="flex items-center gap-3">
                  <input type="color" value={form.secondary_color}
                    onChange={e => set('secondary_color', e.target.value)}
                    className="w-12 h-10 rounded-lg border border-slate-200 cursor-pointer p-1" />
                  <input value={form.secondary_color} onChange={e => set('secondary_color', e.target.value)}
                    className={`${inputClass} flex-1`} placeholder="#F59E0B" />
                </div>
              </div>
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                  Domaine personnalisé
                  <span className="text-slate-400 font-normal ml-1">(optionnel)</span>
                </label>
                <input value={form.custom_domain} onChange={e => set('custom_domain', e.target.value)}
                  placeholder="bdt.universite-senghor.org" className={inputClass} />
                <p className="text-[10px] text-slate-400 mt-1">
                  L'institution devra ajouter un CNAME → cname.vercel-dns.com chez son hébergeur DNS.
                  Vous devrez ensuite ajouter ce domaine dans le dashboard Vercel.
                </p>
              </div>
            </div>
          </div>

          {error && (
            <p className="text-sm text-red-500 bg-red-50 px-4 py-3 rounded-xl">⚠️ {error}</p>
          )}

          {/* Aperçu */}
          <div className="pt-4 border-t border-slate-50">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-3">Aperçu URL</p>
            <div className="bg-slate-50 rounded-xl p-3 font-mono text-sm text-slate-600">
              boursedutemps.vercel.app/i/<span style={{ color: form.primary_color }}>{form.slug || 'slug'}</span>
            </div>
            {form.custom_domain && (
              <div className="bg-slate-50 rounded-xl p-3 font-mono text-sm text-slate-600 mt-2">
                <span style={{ color: form.primary_color }}>{form.custom_domain}</span>
                → /i/{form.slug || 'slug'}
              </div>
            )}
          </div>

          <div className="flex gap-3 pt-2">
            <button onClick={() => router.back()}
              className="flex-1 py-3 rounded-xl text-sm font-semibold text-slate-500 bg-slate-100 hover:bg-slate-200 transition">
              Annuler
            </button>
            <button onClick={handleSubmit} disabled={loading || !form.name || !form.slug || !form.contact_email}
              className="flex-2 px-8 py-3 rounded-xl text-sm font-bold text-white transition-all"
              style={{
                background: 'linear-gradient(135deg,#8B5CF6,#6366F1)',
                opacity: loading || !form.name ? 0.7 : 1,
                boxShadow: '0 4px 14px rgba(139,92,246,0.3)',
              }}>
              {loading ? '⏳ Création…' : '🚀 Créer l\'institution'}
            </button>
          </div>
        </div>
      </div>
    </main>
  )
}
