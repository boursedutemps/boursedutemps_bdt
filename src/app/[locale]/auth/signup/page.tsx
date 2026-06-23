'use client'

import { useEffect } from 'react'
import { useTranslations } from 'next-intl'
import { useRouter } from '@/i18n/navigation'

export default function SignupPage() {
  const router = useRouter()
  const tc = useTranslations('common')

  useEffect(() => { router.replace('/?auth=signup') }, [router])

  return (
    <main className="min-h-screen bg-[#FFFCF7] flex items-center justify-center">
      <div className="text-center">
        <p className="text-4xl mb-3 animate-pulse">⏳</p>
        <p className="text-sm text-slate-500">{tc('loading')}</p>
      </div>
    </main>
  )
}
