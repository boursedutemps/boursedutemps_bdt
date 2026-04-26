"use client";

import React, { useState, useEffect } from 'react';
import PageLayout from '@/components/PageLayout';
import Blog from '@/components/pages-old/Blog';
import { BlogPost } from '@/types';
import { useUser } from '@/components/UserProvider';

export default function BlogRoute() {
  const { user } = useUser();
  const [blogs, setBlogs] = useState<BlogPost[]>([]);

  useEffect(() => {
    fetch('/api/blogs')
      .then(res => res.ok ? res.json() : [])
      .then(data => setBlogs(data))
      .catch(() => setBlogs([]));
  }, []);

  return (
    <PageLayout>
      <Blog blogs={blogs} onUpdate={setBlogs} user={user} onAuthClick={() => {}} />
    </PageLayout>
  );
}
