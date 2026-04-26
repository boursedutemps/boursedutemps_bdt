"use client";

import React, { useState, useEffect } from 'react';
import PageLayout from '@/components/PageLayout';
import Members from '@/components/pages-old/Members';
import { User } from '@/types';
import { useRouter } from 'next/navigation';

export default function MembersRoute() {
  const [users, setUsers] = useState<User[]>([]);
  const router = useRouter();

  useEffect(() => {
    fetch('/api/users')
      .then(res => res.ok ? res.json() : [])
      .then(data => setUsers(data))
      .catch(() => setUsers([]));
  }, []);

  return (
    <PageLayout>
      <Members
        users={users}
        onViewProfile={(uid) => router.push(`/profile-view/${uid}`)}
        onContact={(uid) => router.push(`/profile?chat=${uid}`)}
      />
    </PageLayout>
  );
}
