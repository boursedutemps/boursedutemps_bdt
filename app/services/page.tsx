"use client";

import React, { useState, useEffect } from 'react';
import PageLayout from '@/components/PageLayout';
import ServicesPage from '@/components/pages-old/ServicesPage';
import { Service } from '@/types';
import { useUser } from '@/components/UserProvider';

export default function ServicesRoute() {
  const { user } = useUser();
  const [services, setServices] = useState<Service[]>([]);

  useEffect(() => {
    fetch('/api/services')
      .then(res => res.ok ? res.json() : [])
      .then(data => setServices(data))
      .catch(() => setServices([]));
  }, []);

  const handleUpdateStatus = async (type: 'service' | 'request', id: string, newStatus: string, partnerId?: string) => {
    const token = localStorage.getItem('token');
    await fetch(`/api/${type === 'service' ? 'services' : 'requests'}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ id, status: newStatus, partnerId }),
    });
  };

  const handleTransaction = async (item: Service, negotiatedAmount: number) => {
    if (!user) return;
    alert(`Transaction de ${negotiatedAmount} crédits pour ${item.title}`);
  };

  return (
    <PageLayout>
      <ServicesPage
        user={user}
        services={services}
        onUpdate={setServices}
        onBuy={handleTransaction}
        onUpdateStatus={handleUpdateStatus}
      />
    </PageLayout>
  );
}
