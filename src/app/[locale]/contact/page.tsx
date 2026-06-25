'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'

export default function ContactPage() {
  const t = useTranslations('contact')
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
  const filled = form.name && form.email && form.message && status !== 'loading'

  return (
    <main className="min-h-screen bg-[#FFFCF7] pt-24 pb-16 px-4">
      <div className="max-w-xl mx-auto">

        <div className="mb-10">
          <p className="text-xs font-semibold tracking-widest uppercase text-amber-500 mb-2">{t('label')}</p>
          <h1 className="text-3xl font-bold text-slate-800">{t('title')}</h1>
          <p className="text-slate-500 mt-2">{t('subtitle')}</p>
        </div>

        {status === 'success' ? (
          <div className="bg-green-50 border border-green-200 rounded-2xl p-8 text-center">
            <p className="text-4xl mb-3">✅</p>
            <h2 className="font-bold text-slate-800 mb-1">{t('successTitle')}</h2>
            <p className="text-sm text-slate-500">{t('successMsg')}</p>
            <button
              onClick={() => { setStatus('idle'); setForm({ name: '', email: '', subject: '', message: '' }) }}
              className="mt-4 text-sm text-amber-600 hover:text-amber-700 underline underline-offset-2"
            >
              {t('sendAnother')}
            </button>
          </div>
        ) : (
          <div className="bg-white rounded-2xl p-8 border border-slate-100 shadow-sm space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                  {t('name')} <span className="text-red-400">*</span>
                </label>
                <input type="text" value={form.name} onChange={e => set('name', e.target.value)}
                  placeholder={t('namePlaceholder')} className={inputClass} />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                  {t('email')} <span className="text-red-400">*</span>
                </label>
                <input type="email" value={form.email} onChange={e => set('email', e.target.value)}
                  placeholder={t('emailPlaceholder')} className={inputClass} />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">{t('subject')}</label>
              <input type="text" value={form.subject} onChange={e => set('subject', e.target.value)}
                placeholder={t('subjectPlaceholder')} className={inputClass} />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                {t('message')} <span className="text-red-400">*</span>
              </label>
              <textarea value={form.message} onChange={e => set('message', e.target.value)}
                placeholder={t('messagePlaceholder')} rows={5} className={`${inputClass} resize-none`} />
            </div>

            {status === 'error' && <p className="text-sm text-red-500">{t('errorMsg')}</p>}

            <button
              onClick={handleSubmit}
              disabled={!filled}
              className="w-full py-3 rounded-xl text-sm font-bold transition-all duration-200"
              style={{
                background: filled ? 'linear-gradient(135deg, #F59E0B 0%, #EF4444 100%)' : '#E2E8F0',
                color: filled ? '#fff' : '#94A3B8',
                boxShadow: filled ? '0 4px 14px rgba(245,158,11,0.3)' : 'none',
              }}
            >
              {status === 'loading' ? t('sending') : t('submit')}
            </button>
          </div>
        )}

        <div className="mt-8 grid grid-cols-3 gap-4 text-center">
          {[
            { icon: '📧', label: t('channelEmail'), value: 'contact@boursedutemps.fr' },
            { icon: '💬', label: t('channelForum'), value: t('channelForumVal') },
            { icon: '🤖', label: t('channelAI'),    value: t('channelAIVal') },
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