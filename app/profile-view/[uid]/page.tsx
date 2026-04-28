"use client";

import React, { useState, useEffect } from 'react';
import PageLayout from '@/components/PageLayout';
import Profile from '@/components/pages-old/Profile';
import { useUser } from '@/components/UserProvider';
import { supabase } from '@/lib/supabaseClient';
import { useParams } from 'next/navigation';
import { User, Transaction, Connection, ChatMessage } from '@/types';

export default function ProfileViewRoute() {
  const { user: currentUser } = useUser();
  const params = useParams();
  const viewingUserId = params.uid as string;

  const [targetUser, setTargetUser]     = useState<User | null>(null);
  const [allUsers, setAllUsers]         = useState<User[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [connections, setConnections]   = useState<Connection[]>([]);
  const [messages, setMessages]         = useState<ChatMessage[]>([]);

  useEffect(() => {
    if (!viewingUserId) return;

    // Utilisateur cible — route dédiée avec parse array correct
    fetch(`/api/users/${viewingUserId}`)
      .then(res => res.ok ? res.json() : null)
      .then(data => setTargetUser(data))
      .catch(() => {});

    // Tous les membres
    fetch('/api/users')
      .then(res => res.ok ? res.json() : [])
      .then(data => setAllUsers(Array.isArray(data) ? data : []))
      .catch(() => {});

    // Connexions — nécessite le token Supabase
    const fetchConnections = async () => {
      const token = supabase
        ? ((await supabase.auth.getSession()).data.session?.access_token ?? '')
        : '';
      if (!token) return; // pas connecté, on laisse vide
      fetch('/api/connections', {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then(res => res.ok ? res.json() : [])
        .then(data => setConnections(Array.isArray(data) ? data : []))
        .catch(() => {});
    };
    fetchConnections();

  }, [viewingUserId]);

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
        onSendConnection={async () => {}}
        onUpdateConnection={async () => {}}
        onSendMessage={async () => {}}
        onUpdateMessages={setMessages}
        readOnly
      />
    </PageLayout>
  );
}
