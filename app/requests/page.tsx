"use client";

import React, { useState, useEffect } from 'react';
import PageLayout from '@/components/PageLayout';
import RequestsPage from '@/components/pages-old/RequestsPage';
import { Request } from '@/types';
import { useUser } from '@/components/UserProvider';

export default function RequestsRoute() {
  const { user } = useUser();
  const [requests, setRequests] = useState<Request[]>([]);

  useEffect(() => {
    fetch('/api/requests')
      .then(res => res.ok ? res.json() : [])
      .then(data => setRequests(data))
      .catch(() => setRequests([]));
  }, []);

  const handleUpdateStatus = async (type: 'service' | 'request', id: string, newStatus: string, partnerId?: string) => {
    const token = localStorage.getItem('token');
    await fetch(`/api/${type === 'service' ? 'services' : 'requests'}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ id, status: newStatus, partnerId }),
    });
  };

  return (
    <PageLayout>
      <RequestsPage
        user={user}
        requests={requests}
        onUpdate={setRequests}
        onFulfill={(r, amt) => alert(`Fulfillment de ${amt} crédits`)}
        onUpdateStatus={handleUpdateStatus}
      />
    </PageLayout>
  );
}
