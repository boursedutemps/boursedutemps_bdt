'use client'

import { useState } from 'react'

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' })
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')

  const set = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }))

  const handleSubmit = async () => {
    if (!form.name || !form.email || !form.message) return
    setStatus('loading')
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      setStatus(res.ok ? 'success' : 'error')
    } catch {
      setStatus('error')
    }
  }

  const inputClass = "w-full px-4 py-3 rounded-xl text-sm border border-slate-200 bg-white outline-none focus:border-amber-400 transition-colors"

  return (
    <main className="min-h-screen bg-[#FFFCF7] pt-24 pb-16 px-4">
      <div className="max-w-xl mx-auto">

        <div className="mb-10">
          <p className="text-xs font-semibold tracking-widest uppercase text-amber-500 mb-2">
            On est là
          </p>
          <h1 className="text-3xl font-bold text-slate-800">Nous contacter</h1>
          <p className="text-slate-500 mt-2">
            Une question, un partenariat, un bug ? Écrivez-nous, on répond sous 48h.
          </p>
        </div>

        {status === 'success' ? (
          <div className="bg-green-50 border border-green-200 rounded-2xl p-8 text-center">
            <p className="text-4xl mb-3">✅</p>
            <h2 className="font-bold text-slate-800 mb-1">Message envoyé !</h2>
            <p className="text-sm text-slate-500">Nous reviendrons vers vous très vite.</p>
            <button
              onClick={() => { setStatus('idle'); setForm({ name: '', email: '', subject: '', message: '' }) }}
              className="mt-4 text-sm text-amber-600 hover:text-amber-700 underline underline-offset-2"
            >
              Envoyer un autre message
            </button>
          </div>
        ) : (
          <div className="bg-white rounded-2xl p-8 border border-slate-100 shadow-sm space-y-4">

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                  Nom <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  value={form.name}
                  onChange={e => set('name', e.target.value)}
                  placeholder="Votre nom"
                  className={inputClass}
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                  Email <span className="text-red-400">*</span>
                </label>
                <input
                  type="email"
                  value={form.email}
                  onChange={e => set('email', e.target.value)}
                  placeholder="votre@email.com"
                  className={inputClass}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Sujet</label>
              <input
                type="text"
                value={form.subject}
                onChange={e => set('subject', e.target.value)}
                placeholder="Ex : Partenariat institution, bug signalement…"
                className={inputClass}
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                Message <span className="text-red-400">*</span>
              </label>
              <textarea
                value={form.message}
                onChange={e => set('message', e.target.value)}
                placeholder="Décrivez votre demande…"
                rows={5}
                className={`${inputClass} resize-none`}
              />
            </div>

            {status === 'error' && (
              <p className="text-sm text-red-500">⚠️ Une erreur est survenue. Réessayez.</p>
            )}

            <button
              onClick={handleSubmit}
              disabled={status === 'loading' || !form.name || !form.email || !form.message}
              className="w-full py-3 rounded-xl text-sm font-bold transition-all duration-200"
              style={{
                background: form.name && form.email && form.message && status !== 'loading'
                  ? 'linear-gradient(135deg, #F59E0B 0%, #EF4444 100%)'
                  : '#E2E8F0',
                color: form.name && form.email && form.message && status !== 'loading' ? '#fff' : '#94A3B8',
                boxShadow: form.name && form.email && form.message ? '0 4px 14px rgba(245,158,11,0.3)' : 'none',
              }}
            >
              {status === 'loading' ? '⏳ Envoi…' : 'Envoyer le message →'}
            </button>
          </div>
        )}

        {/* Autres moyens de contact */}
        <div className="mt-8 grid grid-cols-3 gap-4 text-center">
          {[
            { icon: '📧', label: 'Email', value: 'contact@boursedutemps.fr' },
            { icon: '💬', label: 'Forum', value: 'Communauté' },
            { icon: '🤖', label: 'ALDÉA', value: 'Chat IA' },
          ].map(item => (
            <div key={item.label} className="bg-white rounded-2xl p-4 border border-slate-100">
              <p className="text-2xl mb-1">{item.icon}</p>
              <p className="text-xs font-semibold text-slate-700">{item.label}</p>
              <p className="text-xs text-slate-400 mt-0.5">{item.value}</p>
            </div>
          ))}
        </div>
      </div>
    </main>
  )
}
