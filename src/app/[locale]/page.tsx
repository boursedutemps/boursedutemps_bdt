'use client'

// src/app/page.tsx
// Nouvelle page d'accueil — utilise GlobalShell (layout.tsx) pour la Navbar

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'

interface Stats {
  members:      number
  exchanges:    number
  services:     number
  institutions: number
}

interface RecentService {
  id:          number
  title:       string
  category:    string
  user_name:   string
  credit_cost: number
}

interface RecentTestimonial {
  id:            number
  author_name:   string
  author_avatar?: string
  content:       string
  rating?:       number
}

const CATEGORY_ICONS: Record<string, string> = {
  informatique: '💻', langues: '🌍', arts: '🎨', cuisine: '🍳',
  sport: '⚽', musique: '🎵', bricolage: '🔧', education: '📚',
  sante: '🏥', juridique: '⚖️', autre: '✨',
}

const FEATURES = [
  {
    icon: '⏱️',
    title: '1h donnée = 1h reçue',
    desc: 'Une heure de votre temps vaut autant que celle de n\'importe qui. Aucune hiérarchie, une égalité absolue.',
  },
  {
    icon: '🌍',
    title: 'Gratuit pour tous',
    desc: 'La plateforme est 100% gratuite pour les particuliers. Partagez vos compétences sans aucune barrière financière.',
  },
  {
    icon: '🏛️',
    title: 'Sous-plateformes institutions',
    desc: 'Universités, ONG et collectivités disposent de leur propre espace brandé au sein de la communauté.',
  },
  {
    icon: '🏆',
    title: 'Badges & réputation',
    desc: 'Chaque échange renforce votre profil. Débloquez des badges, montez en niveau, devenez un pilier de la communauté.',
  },
  {
    icon: '🎓',
    title: 'Ateliers collectifs',
    desc: 'Un expert partage son temps avec plusieurs apprenants simultanément. L\'apprentissage devient multiplicateur.',
  },
  {
    icon: '🚀',
    title: 'Projets collaboratifs',
    desc: 'Mobilisez la communauté autour d\'un objectif commun. Contribuez collectivement à des projets à impact.',
  },
]

const HOW_IT_WORKS = [
  { step: '1', icon: '👤', title: 'Créez votre profil',    desc: 'Inscrivez-vous gratuitement et ajoutez vos compétences en quelques minutes.' },
  { step: '2', icon: '🤝', title: 'Proposez ou demandez', desc: 'Publiez ce que vous savez faire ou trouvez quelqu\'un qui a la compétence qu\'il vous faut.' },
  { step: '3', icon: '⏱️', title: 'Échangez votre temps', desc: '1h que vous donnez = 1h que vous recevez. La monnaie, c\'est votre temps.' },
]

export default function HomePage() {
  const [stats, setStats]             = useState<Stats>({ members: 0, exchanges: 0, services: 0, institutions: 0 })
  const [services, setServices]       = useState<RecentService[]>([])
  const [testimonials, setTestimonials] = useState<RecentTestimonial[]>([])
  const [loading, setLoading]         = useState(true)

  useEffect(() => {
    Promise.allSettled([
      fetch('/api/users').then(r => r.ok ? r.json() : []),
      fetch('/api/services').then(r => r.ok ? r.json() : []),
      fetch('/api/transactions').then(r => r.ok ? r.json() : []),
      fetch('/api/testimonials?limit=3').then(r => r.ok ? r.json() : []),
      fetch('/api/institution').then(r => r.ok ? r.json() : []),
    ]).then(([usersRes, servicesRes, transRes, testimonialsRes, instRes]) => {
      const users   = usersRes.status   === 'fulfilled' ? (usersRes.value   || []) : []
      const svcs    = servicesRes.status === 'fulfilled' ? (servicesRes.value || []) : []
      const trans   = transRes.status   === 'fulfilled' ? (transRes.value   || []) : []
      const testims = testimonialsRes.status === 'fulfilled' ? (testimonialsRes.value || []) : []
      const insts   = instRes.status    === 'fulfilled' ? (instRes.value    || []) : []

      setStats({
        members:      Array.isArray(users)  ? users.length  : 0,
        services:     Array.isArray(svcs)   ? svcs.length   : 0,
        exchanges:    Array.isArray(trans)  ? trans.length  : 0,
        institutions: Array.isArray(insts)  ? insts.length  : 0,
      })
      setServices(Array.isArray(svcs)    ? svcs.slice(0, 6)    : [])
      setTestimonials(Array.isArray(testims) ? testims.slice(0, 3) : [])
    }).finally(() => setLoading(false))
  }, [])

  return (
    <div className="flex flex-col">

      {/* ══ HERO ══════════════════════════════════════════════════════════════ */}
      <section className="relative min-h-[92vh] flex flex-col items-center justify-center overflow-hidden px-4 bg-white">
        {/* Blobs */}
        <div className="absolute -top-32 -right-32 w-[500px] h-[500px] bg-blue-50 rounded-full blur-3xl opacity-60 pointer-events-none" />
        <div className="absolute -bottom-32 -left-32 w-[500px] h-[500px] bg-amber-50 rounded-full blur-3xl opacity-60 pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-purple-50 rounded-full blur-3xl opacity-30 pointer-events-none" />

        <div className="relative z-10 max-w-4xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 mb-8 rounded-full bg-amber-50 border border-amber-100">
            <span className="w-2 h-2 bg-amber-400 rounded-full animate-pulse" />
            <span className="text-xs font-bold text-amber-700 uppercase tracking-widest">
              Plateforme de solidarité & d'entraide
            </span>
          </div>

          {/* Titre */}
          <h1 className="font-heading text-5xl sm:text-7xl md:text-8xl font-bold text-slate-900 mb-6 leading-none uppercase tracking-tighter">
            BOURSE<br />
            <span className="text-transparent bg-clip-text"
              style={{ backgroundImage: 'linear-gradient(135deg, #2563EB 0%, #F59E0B 100%)' }}>
              DU TEMPS
            </span>
          </h1>

          <p className="text-lg sm:text-xl text-slate-500 mb-10 max-w-2xl mx-auto leading-relaxed">
            Échangez vos talents, apprenez gratuitement et construisez l'avenir.{' '}
            <strong className="text-slate-700">1 heure donnée = 1 heure reçue.</strong>
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            <Link href="/services"
              className="px-8 py-4 rounded-2xl text-base font-bold text-white shadow-2xl shadow-blue-200 hover:shadow-blue-300 transition-all hover:-translate-y-0.5"
              style={{ background: 'linear-gradient(135deg, #2563EB 0%, #7C3AED 100%)' }}>
              🛠️ Explorer les services
            </Link>
            <Link href="/workshops"
              className="px-8 py-4 rounded-2xl text-base font-bold text-slate-700 bg-white border border-slate-200 hover:border-blue-300 hover:shadow-md transition-all">
              🎓 Voir les ateliers →
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-2xl mx-auto">
            {[
              { value: stats.members,      label: 'Membres',      icon: '👥' },
              { value: stats.services,     label: 'Services',     icon: '🛠️' },
              { value: stats.exchanges,    label: 'Échanges',     icon: '🔄' },
              { value: stats.institutions, label: 'Institutions', icon: '🏛️' },
            ].map(s => (
              <div key={s.label} className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm text-center">
                <p className="text-xl mb-1">{s.icon}</p>
                <p className="text-2xl font-bold text-slate-800">
                  {loading ? '—' : s.value > 0 ? s.value.toLocaleString('fr-FR') : '0'}
                </p>
                <p className="text-xs text-slate-600 mt-0.5">{s.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Scroll hint */}
        <div aria-hidden="true" className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 text-slate-400 animate-bounce">
          <span className="text-xs font-medium">Découvrir</span>
          <div className="w-0.5 h-8 bg-gradient-to-b from-slate-300 to-transparent" />
        </div>
      </section>

      {/* ══ COMMENT ÇA MARCHE ════════════════════════════════════════════════ */}
      <section className="py-24 px-4 bg-slate-50">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-xs font-bold tracking-widest uppercase text-blue-700 mb-3">Simple & équitable</p>
            <h2 className="text-3xl font-bold text-slate-800">Comment ça marche ?</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            {HOW_IT_WORKS.map((step, i) => (
              <div key={step.step} className="relative">
                {/* Connecteur */}
                {i < HOW_IT_WORKS.length - 1 && (
                  <div className="hidden sm:block absolute top-8 left-full w-full h-0.5 bg-gradient-to-r from-blue-200 to-transparent -translate-y-0.5 z-0" />
                )}
                <div className="bg-white rounded-2xl p-6 border border-slate-100 text-center relative z-10">
                  <div className="absolute -top-3 -left-3 w-7 h-7 bg-blue-600 text-white text-xs font-bold rounded-full flex items-center justify-center shadow-lg">
                    {step.step}
                  </div>
                  <p className="text-4xl mb-4">{step.icon}</p>
                  <h3 className="font-bold text-slate-800 mb-2">{step.title}</h3>
                  <p className="text-sm text-slate-500 leading-relaxed">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="text-center mt-10">
            <Link href="/services"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold text-white transition-all"
              style={{ background: 'linear-gradient(135deg,#F59E0B,#EF4444)', boxShadow: '0 4px 14px rgba(245,158,11,0.3)' }}>
              Commencer maintenant →
            </Link>
          </div>
        </div>
      </section>

      {/* ══ SERVICES RÉCENTS ══════════════════════════════════════════════════ */}
      {services.length > 0 && (
        <section className="py-24 px-4 bg-white">
          <div className="max-w-5xl mx-auto">
            <div className="flex items-end justify-between mb-10">
              <div>
                <p className="text-xs font-bold tracking-widest uppercase text-amber-700 mb-2">Disponibles maintenant</p>
                <h2 className="text-3xl font-bold text-slate-800">Services proposés</h2>
              </div>
              <Link href="/services" className="text-sm font-bold text-blue-600 hover:text-blue-700 transition">
                Voir tout →
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {services.map(s => (
                <Link key={s.id} href="/services"
                  className="bg-white rounded-2xl p-5 border border-slate-100 hover:border-amber-200 hover:shadow-md transition-all duration-200 flex flex-col group">
                  <div className="flex items-start justify-between mb-3">
                    <span className="text-2xl">{CATEGORY_ICONS[s.category] || '✨'}</span>
                    <span className="text-xs font-bold bg-amber-50 text-amber-700 px-2.5 py-1 rounded-full">
                      {s.credit_cost} cr/h
                    </span>
                  </div>
                  <h3 className="font-bold text-slate-800 mb-1 leading-snug flex-1 group-hover:text-amber-700 transition-colors">
                    {s.title}
                  </h3>
                  <p className="text-xs text-slate-600 mt-3">par {s.user_name}</p>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ══ FONCTIONNALITÉS ═══════════════════════════════════════════════════ */}
      <section className="py-24 px-4 bg-slate-50">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-xs font-bold tracking-widest uppercase text-blue-700 mb-3">Une plateforme complète</p>
            <h2 className="text-3xl font-bold text-slate-800">Tout ce dont vous avez besoin</h2>
            <p className="text-slate-500 mt-3 max-w-xl mx-auto">
              Des outils pensés pour faciliter le partage, renforcer la confiance et créer du lien dans votre communauté.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {FEATURES.map(f => (
              <div key={f.title}
                className="bg-white rounded-2xl p-6 border border-slate-100 hover:border-blue-200 hover:shadow-sm transition-all duration-200">
                <p className="text-3xl mb-4">{f.icon}</p>
                <h3 className="font-bold text-slate-800 mb-2">{f.title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ TÉMOIGNAGES ═══════════════════════════════════════════════════════ */}
      {testimonials.length > 0 && (
        <section className="py-24 px-4 bg-white">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-14">
              <p className="text-xs font-bold tracking-widest uppercase text-amber-700 mb-3">Ils en parlent</p>
              <h2 className="text-3xl font-bold text-slate-800">Ce que dit la communauté</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              {testimonials.map(t => (
                <div key={t.id}
                  className="bg-gradient-to-b from-amber-50 to-white rounded-2xl p-6 border border-amber-100 flex flex-col">
                  {t.rating && (
                    <p className="text-amber-400 text-sm mb-3">{'★'.repeat(t.rating)}{'☆'.repeat(5 - t.rating)}</p>
                  )}
                  <p className="text-3xl text-amber-200 font-serif leading-none mb-2">"</p>
                  <p className="text-sm text-slate-600 italic leading-relaxed flex-1 line-clamp-4">{t.content}</p>
                  <div className="flex items-center gap-3 mt-5 pt-4 border-t border-amber-100">
                    <div className="w-9 h-9 rounded-xl bg-amber-100 flex items-center justify-center overflow-hidden flex-shrink-0">
                      {t.author_avatar ? (
                        <Image src={t.author_avatar} alt={t.author_name} width={36} height={36}
                          className="object-cover w-full h-full" />
                      ) : (
                        <span className="text-xs font-bold text-amber-700">{t.author_name?.[0]}</span>
                      )}
                    </div>
                    <p className="text-sm font-bold text-slate-700">{t.author_name}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="text-center mt-8">
              <Link href="/testimonials"
                className="text-sm font-bold text-blue-600 hover:text-blue-700 transition">
                Voir tous les témoignages →
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* ══ INSTITUTIONS ══════════════════════════════════════════════════════ */}
      <section className="py-24 px-4 bg-slate-50">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-xs font-bold tracking-widest uppercase text-violet-700 mb-3">Pour les organisations</p>
          <h2 className="text-3xl font-bold text-slate-800 mb-4">
            Vous êtes une institution ?
          </h2>
          <p className="text-slate-500 max-w-xl mx-auto mb-10 leading-relaxed">
            Universités, ONG, collectivités — créez votre propre espace brandé, invitez vos membres et accédez
            à des tableaux de bord KPIs en temps réel.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10 max-w-2xl mx-auto">
            {[
              { icon: '🎨', label: 'Branding personnalisé', desc: 'Logo, couleurs, domaine propre' },
              { icon: '📊', label: 'Dashboard KPIs', desc: 'Suivi en temps réel ESS' },
              { icon: '🔗', label: 'Liens d\'invitation', desc: 'Intégrez vos membres facilement' },
            ].map(item => (
              <div key={item.label} className="bg-white rounded-2xl p-5 border border-slate-100 text-center">
                <p className="text-2xl mb-2">{item.icon}</p>
                <p className="text-sm font-bold text-slate-700">{item.label}</p>
                <p className="text-xs text-slate-600 mt-1">{item.desc}</p>
              </div>
            ))}
          </div>
          <Link href="/contact"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl text-sm font-bold text-white transition-all"
            style={{ background: 'linear-gradient(135deg,#7C3AED,#2563EB)', boxShadow: '0 4px 20px rgba(124,58,237,0.3)' }}>
            🏛️ Demander un partenariat →
          </Link>
        </div>
      </section>

      {/* ══ CTA FINAL ═════════════════════════════════════════════════════════ */}
      <section className="py-28 px-4"
        style={{ background: 'linear-gradient(135deg, #1E40AF 0%, #7C3AED 50%, #B45309 100%)' }}>
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Prêt à rejoindre la communauté ?
          </h2>
          <p className="text-blue-100 mb-10 leading-relaxed text-lg">
            Des milliers de personnes échangent déjà leurs compétences.<br />
            Votre heure a de la valeur — partagez-la.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/services"
              className="px-8 py-4 rounded-2xl text-base font-bold bg-white text-blue-700 hover:bg-blue-50 transition-all shadow-xl hover:-translate-y-0.5">
              Commencer maintenant →
            </Link>
            <Link href="/about"
              className="px-8 py-4 rounded-2xl text-base font-bold text-white border border-white/30 hover:bg-white/10 transition-all">
              En savoir plus
            </Link>
          </div>
        </div>
      </section>

    </div>
  )
}
