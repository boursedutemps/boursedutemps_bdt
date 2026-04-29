"use client";

import React, { useState, useEffect, useCallback, Suspense } from 'react';
import PageLayout from '@/components/PageLayout';
import Profile from '@/components/pages-old/Profile';
import { useUser } from '@/components/UserProvider';
import { supabase } from '@/lib/supabaseClient';
import { useSearchParams } from 'next/navigation';
import { User, Transaction, Connection, ChatMessage } from '@/types';

async function getToken(): Promise<string> {
  return supabase
    ? ((await supabase.auth.getSession()).data.session?.access_token ?? '')
    : '';
}

function ProfileContent() {
  const { user, setUser, logout } = useUser();
  const searchParams = useSearchParams();
  const initialChatPartner = searchParams.get('chat');

  const [allUsers, setAllUsers]         = useState<User[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [connections, setConnections]   = useState<Connection[]>([]);
  const [messages, setMessages]         = useState<ChatMessage[]>([]);

  const fetchAll = useCallback(async () => {
    if (!user) return;
    const token = await getToken();
    const h = { Authorization: `Bearer ${token}` };

    Promise.all([
      fetch('/api/users',        { headers: h }).then(r => r.ok ? r.json() : []),
      fetch('/api/connections',   { headers: h }).then(r => r.ok ? r.json() : []),
      fetch('/api/transactions',  { headers: h }).then(r => r.ok ? r.json() : []),
      fetch('/api/messages',      { headers: h }).then(r => r.ok ? r.json() : []),
    ]).then(([users, conns, txs, msgs]) => {
      setAllUsers(Array.isArray(users) ? users : []);
      setConnections(Array.isArray(conns) ? conns : []);
      setTransactions(Array.isArray(txs) ? txs : []);
      setMessages(Array.isArray(msgs) ? msgs : []);
    }).catch(() => {});
  }, [user]);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  // ── Envoyer un message ─────────────────────────────────────────────────────
  const handleSendMessage = useCallback(async (receiverId: string, content: string) => {
    if (!user || !content.trim()) return;
    const token = await getToken();
    const res = await fetch('/api/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ receiverId, content }),
    });
    if (res.ok) {
      const newMsg = await res.json();
      setMessages(prev => [...prev, newMsg]);
    }
  }, [user]);

  // ── Connexions ─────────────────────────────────────────────────────────────
  const handleSendConnection = useCallback(async (targetUid: string) => {
    if (!user) return;
    const token = await getToken();
    await fetch('/api/connections', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ senderId: user.uid, receiverId: targetUid, status: 'sent' }),
    });
    await fetchAll();
  }, [user, fetchAll]);

  const handleUpdateConnection = useCallback(async (connectionId: string, status: 'accepted' | 'refused' | 'cancelled') => {
    const token = await getToken();
    if (status === 'cancelled') {
      await fetch(`/api/connections/${connectionId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
    } else {
      await fetch(`/api/connections/${connectionId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ status }),
      });
    }
    await fetchAll();
  }, [fetchAll]);

  // ── Mise à jour profil ─────────────────────────────────────────────────────
  const handleUpdate = useCallback(async (updatedUser: User) => {
    const token = await getToken();
    await fetch('/api/profil', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({
        firstName:   updatedUser.firstName,
        lastName:    updatedUser.lastName,
        bio:         updatedUser.bio,
        avatar:      updatedUser.avatar,
        coverPhoto:  updatedUser.coverPhoto,
        whatsapp:    updatedUser.whatsapp,
        department:  updatedUser.department,
        gender:      updatedUser.gender,
        country:     updatedUser.country,
        availability: updatedUser.availability,
      }),
    });
    setUser(updatedUser);
  }, [setUser]);

  // ── Désactivation / Suppression ────────────────────────────────────────────
  const handleDeactivate = useCallback(async () => {
    const token = await getToken();
    await fetch(`/api/users/${user?.uid}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ status: 'inactive' }),
    });
    logout();
  }, [user, logout]);

  const handleDelete = useCallback(async () => {
    const token = await getToken();
    await fetch(`/api/users/${user?.uid}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    });
    logout();
  }, [user, logout]);

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <p className="text-slate-500">Veuillez vous connecter pour accéder à votre profil.</p>
      </div>
    );
  }

  return (
    <Profile
      user={user}
      allUsers={allUsers}
      transactions={transactions}
      connections={connections}
      messages={messages}
      onUpdate={handleUpdate}
      onSendConnection={handleSendConnection}
      onUpdateConnection={handleUpdateConnection}
      onSendMessage={handleSendMessage}
      onUpdateMessages={setMessages}
      onDeactivate={handleDeactivate}
      onDelete={handleDelete}
      initialTab={initialChatPartner ? 'messages' : 'info'}
      initialChatPartner={initialChatPartner}
    />
  );
}

export default function ProfileRoute() {
  return (
    <PageLayout>
      <Suspense fallback={
        <div className="flex items-center justify-center min-h-[60vh]">
          <p className="text-slate-500">Chargement...</p>
        </div>
      }>
        <ProfileContent />
      </Suspense>
    </PageLayout>
  );
}
