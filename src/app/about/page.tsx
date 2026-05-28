// src/app/about/page.tsx
import React from 'react'

const VALUES = [
  {
    icon: '⚖️',
    title: 'Égalité des temps',
    description: '1 heure donnée = 1 heure reçue. Peu importe la compétence, le statut ou l\'origine, chaque heure a la même valeur.',
    color: 'bg-amber-50 border-amber-100',
    accent: 'text-amber-600',
  },
  {
    icon: '🤝',
    title: 'Confiance mutuelle',
    description: 'Chaque échange repose sur la parole donnée. Nous cultivons une communauté où la réputation se construit par les actes.',
    color: 'bg-blue-50 border-blue-100',
    accent: 'text-blue-600',
  },
  {
    icon: '🌍',
    title: 'Inclusion & Diversité',
    description: 'Ouverte à tous, sans condition de diplôme, de revenu ou de localisation. La diversité des profils est notre plus grande richesse.',
    color: 'bg-green-50 border-green-100',
    accent: 'text-green-600',
  },
  {
    icon: '🔒',
    title: 'Solidarité',
    description: 'Nous croyons que les communautés les plus résilientes sont celles qui s\'entraident. Chaque service rendu renforce le tissu social.',
    color: 'bg-purple-50 border-purple-100',
    accent: 'text-purple-600',
  },
  {
    icon: '🌱',
    title: 'Économie non-monétaire',
    description: 'Le temps, pas l\'argent. Nous proposons une alternative à l\'économie marchande, accessible à tous et respectueuse de chacun.',
    color: 'bg-emerald-50 border-emerald-100',
    accent: 'text-emerald-600',
  },
  {
    icon: '🔍',
    title: 'Transparence',
    description: 'Plateforme à but non lucratif pour les particuliers. Chaque échange est tracé, chaque crédit est visible. Rien n\'est caché.',
    color: 'bg-orange-50 border-orange-100',
    accent: 'text-orange-600',
  },
]

const STEPS = [
  {
    num: 1,
    title: 'Inscrivez-vous',
    desc: 'Créez votre profil en mentionnant vos compétences et vos besoins. Recevez 5 crédits de bienvenue pour démarrer.',
  },
  {
    num: 2,
    title: 'Proposez & Échangez',
    desc: 'Mettez en ligne un service ou une demande. Contactez les membres, négociez et réalisez votre premier échange.',
  },
  {
    num: 3,
    title: 'Construisez votre réputation',
    desc: 'Après chaque échange, laissez un témoignage. Accumulez des badges, montez en niveau et devenez un pilier de la communauté.',
  },
  {
    num: 4,
    title: 'Rejoignez des projets',
    desc: 'Participez à des ateliers collectifs, des modules thématiques et des projets collaboratifs pour aller plus loin ensemble.',
  },
]

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-[#FFFCF7]">

      {/* Hero */}
      <section className="pt-32 pb-20 px-4 text-center">
        <div className="max-w-3xl mx-auto">
          <p className="text-xs font-bold tracking-widest uppercase text-amber-500 mb-4">
            Notre philosophie
          </p>
          <h1 className="text-5xl font-bold text-slate-900 leading-tight mb-6">
            Réinventer l'entraide<br />par le temps
          </h1>
          <p className="text-xl text-slate-500 leading-relaxed">
            La Bourse du Temps est une plateforme d'échange de compétences où 1 heure donnée vaut 1 heure reçue —
            sans argent, sans hiérarchie, ouverte à tous.
          </p>
        </div>
      </section>

      {/* Mission + Vision */}
      <section className="px-4 pb-20">
        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-100">
            <span className="text-4xl mb-6 block">🎯</span>
            <h2 className="text-2xl font-bold text-slate-900 mb-4">Notre Mission</h2>
            <p className="text-slate-500 leading-relaxed">
              Créer un écosystème d'échange où chaque personne peut valoriser ses compétences
              sans barrière financière. Nous croyons que le savoir partagé est la plus grande des richesses,
              et que chaque individu a quelque chose à offrir au monde.
            </p>
          </div>
          <div className="bg-blue-600 p-10 rounded-[2.5rem] text-white shadow-xl shadow-blue-200">
            <span className="text-4xl mb-6 block">💡</span>
            <h2 className="text-2xl font-bold mb-4">Notre Vision</h2>
            <p className="opacity-90 leading-relaxed">
              Bâtir la plus grande communauté d'entraide par les compétences, en favorisant
              les connexions entre les personnes, les cultures et les expertises — partout dans le monde,
              sans condition de revenu ni de statut.
            </p>
          </div>
        </div>
      </section>

      {/* Nos Valeurs */}
      <section className="px-4 pb-20 bg-white">
        <div className="max-w-5xl mx-auto pt-16">
          <div className="text-center mb-12">
            <p className="text-xs font-bold tracking-widest uppercase text-amber-500 mb-3">Ce qui nous guide</p>
            <h2 className="text-3xl font-bold text-slate-900">Nos valeurs</h2>
            <p className="text-slate-500 mt-3 max-w-xl mx-auto">
              Six principes fondamentaux qui définissent chaque décision que nous prenons et chaque fonctionnalité que nous construisons.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {VALUES.map(v => (
              <div key={v.title} className={`rounded-2xl border p-6 ${v.color} transition-all hover:shadow-md`}>
                <span className="text-3xl mb-4 block">{v.icon}</span>
                <h3 className={`text-lg font-bold mb-2 ${v.accent}`}>{v.title}</h3>
                <p className="text-slate-600 text-sm leading-relaxed">{v.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Comment ça marche */}
      <section className="px-4 py-20">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-xs font-bold tracking-widest uppercase text-amber-500 mb-3">Simple & concret</p>
            <h2 className="text-3xl font-bold text-slate-900">Comment ça marche ?</h2>
          </div>
          <div className="relative border-l-2 border-slate-100 pl-10 space-y-12 ml-4">
            {STEPS.map(s => (
              <div key={s.num} className="relative">
                <div className="absolute -left-[54px] top-0 w-8 h-8 rounded-full bg-blue-600 border-4 border-white flex items-center justify-center text-white font-bold text-xs">
                  {s.num}
                </div>
                <h3 className="font-bold text-xl text-slate-800 mb-2">{s.title}</h3>
                <p className="text-slate-500 leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-4 pb-24">
        <div className="max-w-2xl mx-auto text-center bg-gradient-to-br from-amber-50 to-orange-50 rounded-[2rem] border border-amber-100 p-12">
          <p className="text-4xl mb-4">⏱️</p>
          <h2 className="text-2xl font-bold text-slate-800 mb-3">Prêt à rejoindre la communauté ?</h2>
          <p className="text-slate-500 mb-8">
            Des milliers de compétences vous attendent. Votre prochaine rencontre enrichissante est à un échange de distance.
          </p>
          <a
            href="/services"
            className="inline-block px-8 py-3.5 rounded-xl text-sm font-bold text-white transition-all hover:opacity-90"
            style={{ background: 'linear-gradient(135deg,#F59E0B,#EF4444)' }}
          >
            Découvrir les services →
          </a>
        </div>
      </section>

    </main>
  )
}
