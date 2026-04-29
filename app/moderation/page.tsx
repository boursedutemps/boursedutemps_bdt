"use client";

import React, { useState, useEffect, useCallback } from 'react';
import PageLayout from '@/components/PageLayout';
import Moderation from '@/components/pages-old/Moderation';
import { User, Service, Request } from '@/types';
import { useUser } from '@/components/UserProvider';
import { supabase } from '@/lib/supabaseClient';

async function getToken(): Promise<string> {
  return supabase
    ? ((await supabase.auth.getSession()).data.session?.access_token ?? '')
    : '';
}

export default function ModerationRoute() {
  const { user } = useUser();
  const [users, setUsers]       = useState<User[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [requests, setRequests] = useState<Request[]>([]);

  const fetchAll = useCallback(async () => {
    if (!user || (user.role !== 'admin' && user.role !== 'moderator')) return;
    const token = await getToken();
    const h = { Authorization: `Bearer ${token}` };
    Promise.all([
      fetch('/api/users',    { headers: h }).then(r => r.ok ? r.json() : []),
      fetch('/api/services', { headers: h }).then(r => r.ok ? r.json() : []),
      fetch('/api/requests', { headers: h }).then(r => r.ok ? r.json() : []),
    ]).then(([u, s, r]) => {
      setUsers(Array.isArray(u) ? u : []);
      setServices(Array.isArray(s) ? s : []);
      setRequests(Array.isArray(r) ? r : []);
    }).catch(() => {});
  }, [user]);

  useEffect(() => { fetchAll(); }, [fetchAll]);

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
        onRefresh={fetchAll}
      />
    </PageLayout>
  );
}
