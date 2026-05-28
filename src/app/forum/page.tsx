// src/app/forum/page.tsx
'use client'

import { useState, useEffect } from 'react'
import Forum from '@/components/Forum'
import { ForumTopic } from '@/types'
import { useUser } from '@/components/UserProvider'

export default function ForumRoute() {
  const { user } = useUser()
  const [topics, setTopics] = useState<ForumTopic[]>([])

  useEffect(() => {
    fetch('/api/forumTopics')
      .then(r => r.json())
      .then(data => setTopics(Array.isArray(data) ? data : []))
      .catch(console.error)
  }, [])

  return (
    <Forum
      user={user}
      topics={topics}
      onAdd={t => setTopics(prev => [t, ...prev])}
    />
  )
}
