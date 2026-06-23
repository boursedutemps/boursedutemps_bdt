'use client'

import { useEffect } from 'react'
import { useTranslations } from 'next-intl'
import { useRouter } from '@/i18n/navigation'

/**
 * /auth/login — Redirige vers la page d'accueil avec le modal de connexion ouvert.
 * Le modal AuthModal est déjà géré dans le layout principal.
 * On passe ?auth=login comme signal pour l'ouvrir automatiquement.
 */
export default function LoginPage() {
  const router = useRouter()
  const tc = useTranslations('common')

  useEffect(() => {
    router.replace('/?auth=login')
  }, [router])

  return (
    <main className="min-h-screen bg-[#FFFCF7] flex items-center justify-center">
      <div className="text-center">
        <p className="text-4xl mb-3 animate-pulse">⏳</p>
        <p className="text-sm text-slate-500">{tc('loading')}</p>
      </div>
    </main>
  )
}
