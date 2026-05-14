'use client'

// src/hooks/useOnboarding.ts
// Détecte si l'onboarding doit s'afficher et gère la complétion

import { useState, useEffect, useCallback } from 'react'

interface User {
  uid: string
  onboarding_step?: number
  onboarding_completed_at?: string | null
  [key: string]: unknown
}

interface UseOnboardingReturn {
  showOnboarding: boolean
  dismissOnboarding: () => void
  isLoading: boolean
}

/**
 * Hook principal à appeler dans le layout ou les pages protégées.
 *
 * Règle d'affichage :
 *   - L'utilisateur est connecté (user != null)
 *   - ET onboarding_completed_at est null/undefined
 *   - ET il n'a pas ignoré le modal dans cette session (localStorage)
 *
 * Usage :
 *   const { showOnboarding, dismissOnboarding } = useOnboarding(user)
 */
export function useOnboarding(user: User | null): UseOnboardingReturn {
  const [showOnboarding, setShowOnboarding] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (!user?.uid) {
      setIsLoading(false)
      return
    }

    // Déjà complété côté client (colonne présente dans l'objet user)
    if (user.onboarding_completed_at) {
      setIsLoading(false)
      return
    }

    // Vérification via API (au cas où l'objet user serait incomplet)
    const checkOnboarding = async () => {
      try {
        // Ignorer si l'utilisateur a fermé le modal dans les dernières 24h
        const dismissedAt = localStorage.getItem(`onboarding_dismissed_${user.uid}`)
        if (dismissedAt) {
          const elapsed = Date.now() - parseInt(dismissedAt, 10)
          if (elapsed < 24 * 60 * 60 * 1000) {
            setIsLoading(false)
            return
          }
        }

        const res = await fetch(`/api/onboarding?uid=${user.uid}`)
        if (!res.ok) {
          setIsLoading(false)
          return
        }
        const data = await res.json()

        if (!data.onboarding_completed) {
          setShowOnboarding(true)
        }
      } catch {
        // En cas d'erreur réseau, on n'affiche pas l'onboarding
        // pour ne pas bloquer l'utilisateur
      } finally {
        setIsLoading(false)
      }
    }

    checkOnboarding()
  }, [user?.uid, user?.onboarding_completed_at])

  const dismissOnboarding = useCallback(() => {
    setShowOnboarding(false)
    // Mémoriser la fermeture pendant 24h (pour les utilisateurs qui ferment sans finir)
    if (user?.uid) {
      localStorage.setItem(`onboarding_dismissed_${user.uid}`, Date.now().toString())
    }
  }, [user?.uid])

  return { showOnboarding, dismissOnboarding, isLoading }
}
