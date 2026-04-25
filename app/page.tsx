"use client";

import React, { useState, useEffect } from 'react';
import PageLayout from '@/components/PageLayout';
import Home from '@/components/pages-old/Home';
import { BlogPost, Testimonial } from '@/types';
import { useRouter } from 'next/navigation';

export default function HomePage() {
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [stats, setStats] = useState({
    totalVisitors: 0,
    activeMembers: 0,
    offlineMembers: 0,
    exchangesInProgress: 0,
    exchangesProposed: 0,
    exchangesAccepted: 0,
  });
  const router = useRouter();

  useEffect(() => {
    const storedVisitors = localStorage.getItem('bdt_visitors');
    const visitorCount = storedVisitors ? parseInt(storedVisitors) : 0;
    setStats(prev => ({ ...prev, totalVisitors: visitorCount }));

    // Fetch blogs
    fetch('/api/blogs')
      .then(res => res.ok ? res.json() : [])
      .then(data => setBlogs(data))
      .catch(() => setBlogs([]));

    // Fetch testimonials
    fetch('/api/testimonials')
      .then(res => res.ok ? res.json() : [])
      .then(data => setTestimonials(data))
      .catch(() => setTestimonials([]));
  }, []);

  return (
    <PageLayout>
      <Home
        navigate={(p) => router.push(p === 'home' ? '/' : `/${p}`)}
        blogs={blogs}
        testimonials={testimonials}
        stats={stats}
      />
    </PageLayout>
  );
}
