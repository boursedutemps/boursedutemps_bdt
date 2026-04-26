"use client";

import React, { useState, useEffect } from 'react';
import PageLayout from '@/components/PageLayout';
import Profile from '@/components/pages-old/Profile';
import { useUser } from '@/components/UserProvider';
import { useParams } from 'next/navigation';
import { User, Transaction, Connection, ChatMessage } from '@/types';

export default function ProfileViewRoute() {
  const { user: currentUser } = useUser();
  const params = useParams();
  const viewingUserId = params.uid as string;

  const [targetUser, setTargetUser] = useState<User | null>(null);
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [connections, setConnections] = useState<Connection[]>([]);
  const [messages, setMessages] = useState<ChatMessage[]>([]);

  useEffect(() => {
    if (!viewingUserId) return;

    fetch(`/api/users/${viewingUserId}`)
      .then(res => res.ok ? res.json() : null)
      .then(data => setTargetUser(data))
      .catch(() => {});

    fetch('/api/users')
      .then(res => res.ok ? res.json() : [])
      .then(data => setAllUsers(data))
      .catch(() => {});

    fetch('/api/connections')
      .then(res => res.ok ? res.json() : [])
      .then(data => setConnections(data))
      .catch(() => {});
  }, [viewingUserId]);

  if (!targetUser) {
    return (
      <PageLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
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
