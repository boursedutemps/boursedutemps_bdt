import { useTranslations } from 'next-intl'

const VALUE_KEYS = [
  { icon: '⚖️', key: 'equality',     color: 'bg-amber-50 border-amber-100',   accent: 'text-amber-600' },
  { icon: '🤝', key: 'trust',        color: 'bg-blue-50 border-blue-100',     accent: 'text-blue-600' },
  { icon: '🌍', key: 'inclusion',    color: 'bg-green-50 border-green-100',   accent: 'text-green-600' },
  { icon: '🔗', key: 'solidarity',   color: 'bg-purple-50 border-purple-100', accent: 'text-purple-600' },
  { icon: '🌱', key: 'economy',      color: 'bg-emerald-50 border-emerald-100',accent: 'text-emerald-600' },
  { icon: '🔍', key: 'transparency', color: 'bg-orange-50 border-orange-100', accent: 'text-orange-600' },
]

export default function AboutPage() {
  const t = useTranslations('about')

  return (
    <main className="min-h-screen bg-[#FFFCF7]">

      {/* Hero */}
      <section className="pt-32 pb-20 px-4 text-center">
        <div className="max-w-3xl mx-auto">
          <p className="text-xs font-bold tracking-widest uppercase text-amber-500 mb-4">
            {t('label')}
          </p>
          <h1 className="text-5xl font-bold text-slate-900 leading-tight mb-6">
            {t('titleLine1')}<br />{t('titleLine2')}
          </h1>
          <p className="text-xl text-slate-500 leading-relaxed">{t('subtitle')}</p>
        </div>
      </section>

      {/* Mission + Vision */}
      <section className="px-4 pb-20">
        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-100">
            <span className="text-4xl mb-6 block">🎯</span>
            <h2 className="text-2xl font-bold text-slate-900 mb-4">{t('mission.label')}</h2>
            <p className="text-slate-500 leading-relaxed">{t('mission.text')}</p>
          </div>
          <div className="bg-blue-600 p-10 rounded-[2.5rem] text-white shadow-xl shadow-blue-200">
            <span className="text-4xl mb-6 block">💡</span>
            <h2 className="text-2xl font-bold mb-4">{t('vision.label')}</h2>
            <p className="opacity-90 leading-relaxed">{t('vision.text')}</p>
          </div>
        </div>
      </section>

      {/* Nos Valeurs */}
      <section className="px-4 pb-20 bg-white">
        <div className="max-w-5xl mx-auto pt-16">
          <div className="text-center mb-12">
            <p className="text-xs font-bold tracking-widest uppercase text-amber-500 mb-3">{t('values.label')}</p>
            <h2 className="text-3xl font-bold text-slate-900">{t('values.title')}</h2>
            <p className="text-slate-500 mt-3 max-w-xl mx-auto">{t('values.subtitle')}</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {VALUE_KEYS.map(v => (
              <div key={v.key} className={`rounded-2xl border p-6 ${v.color} transition-all hover:shadow-md`}>
                <span className="text-3xl mb-4 block">{v.icon}</span>
                <h3 className={`text-lg font-bold mb-2 ${v.accent}`}>{t(`values.${v.key}.title`)}</h3>
                <p className="text-slate-600 text-sm leading-relaxed">{t(`values.${v.key}.desc`)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Comment ça marche */}
      <section className="px-4 py-20">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-xs font-bold tracking-widest uppercase text-amber-500 mb-3">{t('howItWorks.label')}</p>
            <h2 className="text-3xl font-bold text-slate-900">{t('howItWorks.title')}</h2>
          </div>
          <div className="relative border-l-2 border-slate-100 pl-10 space-y-12 ml-4">
            {([1, 2, 3, 4] as const).map(n => (
              <div key={n} className="relative">
                <div className="absolute -left-[54px] top-0 w-8 h-8 rounded-full bg-blue-600 border-4 border-white flex items-center justify-center text-white font-bold text-xs">
                  {n}
                </div>
                <h3 className="font-bold text-xl text-slate-800 mb-2">{t(`howItWorks.step${n}.title`)}</h3>
                <p className="text-slate-500 leading-relaxed">{t(`howItWorks.step${n}.desc`)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-4 pb-24">
        <div className="max-w-2xl mx-auto text-center bg-gradient-to-br from-amber-50 to-orange-50 rounded-[2rem] border border-amber-100 p-12">
          <p className="text-4xl mb-4">⏱️</p>
          <h2 className="text-2xl font-bold text-slate-800 mb-3">{t('cta.title')}</h2>
          <p className="text-slate-500 mb-8">{t('cta.subtitle')}</p>
          
            href="/services"
            className="inline-block px-8 py-3.5 rounded-xl text-sm font-bold text-white transition-all hover:opacity-90"
            style={{ background: 'linear-gradient(135deg,#F59E0B,#EF4444)' }}
          >
            {t('cta.btn')}
          </a>
        </div>
      </section>

    </main>
  )
}