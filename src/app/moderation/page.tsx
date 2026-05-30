'use client'
// src/app/moderation/page.tsx — migré Firebase → REST

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useUser } from '@/components/UserProvider'
import { User, Service, Request } from '@/types'
import dynamic from 'next/dynamic'

const ModerationComponent = dynamic(() => import('@/components/pages-old/Moderation'), { ssr: false })

export default function ModerationRoute() {
  const { user, isAuthReady } = useUser()
  const router = useRouter()
  const [users, setUsers]       = useState<User[]>([])
  const [services, setServices] = useState<Service[]>([])
  const [requests, setRequests] = useState<Request[]>([])
  const [loading, setLoading]   = useState(true)

  const isAuthorized = user?.role === 'admin' || user?.role === 'moderator'

  const fetchAll = async () => {
    if (!user) return
    const token = localStorage.getItem('token') || ''
    const headers = { Authorization: `Bearer ${token}` }
    setLoading(true)
    try {
      const [usersRes, servicesRes, requestsRes] = await Promise.all([
        fetch('/api/users',    { headers }).then(r => r.ok ? r.json() : []),
        fetch('/api/services', { headers }).then(r => r.ok ? r.json() : []),
        fetch('/api/requests', { headers }).then(r => r.ok ? r.json() : []),
      ])
      setUsers(Array.isArray(usersRes)    ? usersRes    : [])
      setServices(Array.isArray(servicesRes) ? servicesRes : [])
      setRequests(Array.isArray(requestsRes) ? requestsRes : [])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (!isAuthReady) return
    if (!user || !isAuthorized) { setLoading(false); return }
    fetchAll()
  }, [user, isAuthReady])

  // Attendre que l'auth soit prête
  if (!isAuthReady || loading) return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="w-8 h-8 border-2 border-amber-400 border-t-transparent rounded-full animate-spin" />
    </div>
  )

  // Accès refusé
  if (!user || !isAuthorized) return (
    <div className="flex items-center justify-center min-h-[60vh] flex-col gap-3">
      <p className="text-4xl">🔒</p>
      <p className="text-slate-500 font-medium">Accès restreint aux modérateurs et administrateurs.</p>
    </div>
  )

  return (
    <ModerationComponent
      users={users}
      onUpdateUsers={setUsers}
      services={services}
      onUpdateServices={setServices}
      requests={requests}
      onUpdateRequests={setRequests}
      currentUser={user}
      onRefresh={fetchAll}
    />
  )
}
