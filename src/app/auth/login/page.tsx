'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

/**
 * /auth/login — Redirige vers la page d'accueil avec le modal de connexion ouvert.
 * Le modal AuthModal est déjà géré dans le layout principal.
 * On passe ?auth=login comme signal pour l'ouvrir automatiquement.
 */
export default function LoginPage() {
  const router = useRouter()

  useEffect(() => {
    router.replace('/?auth=login')
  }, [router])

  return (
    <main className="min-h-screen bg-[#FFFCF7] flex items-center justify-center">
      <div className="text-center">
        <p className="text-4xl mb-3 animate-pulse">⏳</p>
        <p className="text-sm text-slate-500">Redirection en cours…</p>
      </div>
    </main>
  )
}
