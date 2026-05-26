"use client";
import React, { useState, useEffect, Suspense } from 'react';
import Profile from '@/components/profile/Profile';
import { useUser } from '@/components/UserProvider';
import { useSearchParams } from 'next/navigation';
import { User, Transaction, Connection, ChatMessage } from '@/types';

function ProfileContent() {
  const { user, setUser } = useUser();
  const searchParams = useSearchParams();
  const initialChatPartner = searchParams.get('chat');
  const viewUid = searchParams.get('uid');
  const [profileUser, setProfileUser] = useState<User | null>(null)
  const [allUsers, setAllUsers] = useState<User[]>([])
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [connections, setConnections] = useState<Connection[]>([])
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [loading, setLoading] = useState(true)
  const isOwnProfile = !viewUid || viewUid === user?.uid

  useEffect(() => {
    if (!user) { setLoading(false); return }
    const token = localStorage.getItem('token') || ''
    const headers = { Authorization: `Bearer ${token}` }
    const targetUid = viewUid || user.uid
    Promise.allSettled([
      viewUid && viewUid !== user.uid
        ? fetch(`/api/profil?uid=${viewUid}`, { headers }).then(r => r.ok ? r.json() : null)
        : Promise.resolve(user),
      fetch('/api/users', { headers }).then(r => r.ok ? r.json() : []),
      fetch(`/api/transactions?user_id=${targetUid}`, { headers }).then(r => r.ok ? r.json() : []),
      fetch(`/api/connections?user_id=${targetUid}`, { headers }).then(r => r.ok ? r.json() : []),
      fetch(`/api/messages?user_id=${user.uid}`, { headers }).then(r => r.ok ? r.json() : []),
    ]).then(([profileRes, usersRes, transRes, connRes, msgRes]) => {
      setProfileUser(profileRes.status === 'fulfilled' ? (profileRes.value || user) : user)
      setAllUsers(usersRes.status === 'fulfilled' ? (Array.isArray(usersRes.value) ? usersRes.value : []) : [])
      setTransactions(transRes.status === 'fulfilled' ? (Array.isArray(transRes.value) ? transRes.value : []) : [])
      setConnections(connRes.status === 'fulfilled' ? (Array.isArray(connRes.value) ? connRes.value : []) : [])
      setMessages(msgRes.status === 'fulfilled' ? (Array.isArray(msgRes.value) ? msgRes.value : []) : [])
    }).finally(() => setLoading(false))
  }, [user, viewUid])

  if (!user) return <div className="flex items-center justify-center min-h-[60vh]"><p className="text-slate-500">Connectez-vous pour accéder à votre profil.</p></div>
  if (loading || !profileUser) return <div className="flex items-center justify-center min-h-[60vh]"><div className="w-8 h-8 border-2 border-blue-400 border-t-transparent rounded-full animate-spin" /></div>

  return (
    <Profile
      user={profileUser}
      currentUser={user}
      allUsers={allUsers}
      transactions={transactions}
      connections={connections}
      messages={messages}
      onUpdate={(u) => { setProfileUser(u); if (isOwnProfile) setUser(u) }}
      onSendConnection={async (uid) => { const t = localStorage.getItem('token')||''; await fetch('/api/connections',{method:'POST',headers:{'Content-Type':'application/json',Authorization:`Bearer ${t}`},body:JSON.stringify({receiver_id:uid})}) }}
      onUpdateConnection={async (id, s) => { const t = localStorage.getItem('token')||''; await fetch('/api/connections',{method:'PATCH',headers:{'Content-Type':'application/json',Authorization:`Bearer ${t}`},body:JSON.stringify({connection_id:id,status:s})}) }}
      onSendMessage={async (rid, c) => { const t = localStorage.getItem('token')||''; const r = await fetch('/api/messages',{method:'POST',headers:{'Content-Type':'application/json',Authorization:`Bearer ${t}`},body:JSON.stringify({receiver_id:rid,content:c})}); if(r.ok){const m=await r.json();setMessages(p=>[...p,m])} }}
      onUpdateMessages={setMessages}
      onDeactivate={async () => {}}
      onDelete={async () => {}}
      readOnly={!isOwnProfile}
      initialTab={initialChatPartner ? 'messages' : 'info'}
      initialChatPartner={initialChatPartner}
    />
  )
}

export default function ProfileRoute() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-[60vh]"><div className="w-8 h-8 border-2 border-blue-400 border-t-transparent rounded-full animate-spin" /></div>}>
      <ProfileContent />
    </Suspense>
  )
}