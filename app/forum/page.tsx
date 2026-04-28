"use client";

import React, { useState, useEffect } from 'react';
import PageLayout from '@/components/PageLayout';
import Forum from '@/components/Forum';
import LiveSection from '@/components/LiveSection';
import { ForumTopic } from '@/types';
import { useUser } from '@/components/UserProvider';

export default function ForumRoute() {
  const { user } = useUser();
  const [topics, setTopics] = useState<ForumTopic[]>([]);

  useEffect(() => {
    fetch('/api/forumTopics')
      .then(res => res.ok ? res.json() : [])
      .then(data => setTopics(Array.isArray(data) ? data : []))
      .catch(() => setTopics([]));
  }, []);

  return (
    <PageLayout>
      {/* ── Sessions Live ─────────────────────────────────────────────── */}
      <LiveSection user={user} />

      {/* ── Forum ─────────────────────────────────────────────────────── */}
      <Forum user={user} topics={topics} onAdd={(t) => setTopics([t, ...topics])} />
    </PageLayout>
  );
}
