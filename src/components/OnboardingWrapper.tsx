'use client'

// src/components/OnboardingWrapper.tsx

import { useOnboarding } from '@/hooks/useOnboarding'
import OnboardingModal   from '@/components/OnboardingModal'
import { useUser }       from '@/components/UserProvider'

export default function OnboardingWrapper() {
  const { user, isAuthReady } = useUser()

  // Normalise camelCase -> snake_case pour le hook et le modal
  const normalizedUser = user ? {
    uid:                     user.uid,
    name:                    user.name || [user.firstName, user.lastName].filter(Boolean).join(' ') || undefined,
    first_name:              user.first_name || user.firstName || undefined,
    avatar:                  user.avatar || undefined,
    bio:                     user.bio || undefined,
    country:                 user.country || undefined,
    onboarding_step:         user.onboarding_step,
    onboarding_completed_at: user.onboarding_completed_at,
  } : null

  const { showOnboarding, dismissOnboarding } = useOnboarding(
    isAuthReady ? normalizedUser : null
  )

  if (!isAuthReady || !showOnboarding || !normalizedUser) return null

  return (
    <OnboardingModal
      user={normalizedUser}
      onComplete={dismissOnboarding}
    />
  )
}
