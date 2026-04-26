"use client";

import React, { useState, useEffect } from 'react';
import PageLayout from '@/components/PageLayout';
import Moderation from '@/components/pages-old/Moderation';
import { User, Service, Request } from '@/types';
import { useUser } from '@/components/UserProvider';

export default function ModerationRoute() {
  const { user } = useUser();
  const [users, setUsers] = useState<User[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [requests, setRequests] = useState<Request[]>([]);

  useEffect(() => {
    if (!user || (user.role !== 'admin' && user.role !== 'moderator')) return;
    const token = localStorage.getItem('token');
    const headers = { Authorization: `Bearer ${token}` };

    fetch('/api/users', { headers })
      .then(res => res.ok ? res.json() : [])
      .then(data => setUsers(data))
      .catch(() => {});

    fetch('/api/services', { headers })
      .then(res => res.ok ? res.json() : [])
      .then(data => setServices(data))
      .catch(() => {});

    fetch('/api/requests', { headers })
      .then(res => res.ok ? res.json() : [])
      .then(data => setRequests(data))
      .catch(() => {});
  }, [user]);

  if (!user || (user.role !== 'admin' && user.role !== 'moderator')) {
    return (
      <PageLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <p className="text-slate-500">Accès restreint aux modérateurs.</p>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <Moderation
        users={users}
        onUpdateUsers={setUsers}
        services={services}
        onUpdateServices={setServices}
        requests={requests}
        onUpdateRequests={setRequests}
        currentUser={user}
      />
    </PageLayout>
  );
}
