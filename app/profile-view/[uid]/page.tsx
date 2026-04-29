"use client";

import React, { useState, useEffect, useCallback } from 'react';
import PageLayout from '@/components/PageLayout';
import Profile from '@/components/pages-old/Profile';
import { useUser } from '@/components/UserProvider';
import { supabase } from '@/lib/supabaseClient';
import { useParams } from 'next/navigation';
import { User, Transaction, Connection, ChatMessage } from '@/types';

async function getToken(): Promise<string> {
  return supabase
    ? ((await supabase.auth.getSession()).data.session?.access_token ?? '')
    : '';
}

export default function ProfileViewRoute() {
  const { user: currentUser } = useUser();
  const params = useParams();
  const viewingUserId = params.uid as string;

  const [targetUser, setTargetUser]     = useState<User | null>(null);
  const [allUsers, setAllUsers]         = useState<User[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [connections, setConnections]   = useState<Connection[]>([]);
  const [messages, setMessages]         = useState<ChatMessage[]>([]);

  const fetchConnections = useCallback(async () => {
    const token = await getToken();
    if (!token) return;
    fetch('/api/connections', { headers: { Authorization: `Bearer ${token}` } })
      .then(res => res.ok ? res.json() : [])
      .then(data => setConnections(Array.isArray(data) ? data : []))
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (!viewingUserId) return;
    fetch(`/api/users/${viewingUserId}`)
      .then(res => res.ok ? res.json() : null)
      .then(data => setTargetUser(data))
      .catch(() => {});
    fetch('/api/users')
      .then(res => res.ok ? res.json() : [])
      .then(data => setAllUsers(Array.isArray(data) ? data : []))
      .catch(() => {});
    fetchConnections();
  }, [viewingUserId, fetchConnections]);

  const handleSendConnection = useCallback(async (targetUid: string) => {
    if (!currentUser) return alert('Connectez-vous pour envoyer une demande');
    const token = await getToken();
    await fetch('/api/connections', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ senderId: currentUser.uid, receiverId: targetUid, status: 'sent' }),
    });
    await fetchConnections();
  }, [currentUser, fetchConnections]);

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
    await fetchConnections();
  }, [fetchConnections]);

  if (!targetUser) {
    return (
      <PageLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <Profile
        user={targetUser}
        currentUser={currentUser || undefined}
        allUsers={allUsers}
        transactions={transactions}
        connections={connections}
        messages={messages}
        onUpdate={() => {}}
        onSendConnection={handleSendConnection}
        onUpdateConnection={handleUpdateConnection}
        onSendMessage={async () => {}}
        onUpdateMessages={setMessages}
        readOnly
      />
    </PageLayout>
  );
}
