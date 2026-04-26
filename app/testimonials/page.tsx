"use client";

import React, { useState, useEffect } from 'react';
import PageLayout from '@/components/PageLayout';
import Testimonials from '@/components/pages-old/Testimonials';
import { Testimonial } from '@/types';
import { useUser } from '@/components/UserProvider';

export default function TestimonialsRoute() {
  const { user } = useUser();
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);

  useEffect(() => {
    fetch('/api/testimonials')
      .then(res => res.ok ? res.json() : [])
      .then(data => setTestimonials(data))
      .catch(() => setTestimonials([]));
  }, []);

  return (
    <PageLayout>
      <Testimonials testimonials={testimonials} onUpdate={setTestimonials} user={user} onAuthClick={() => {}} />
    </PageLayout>
  );
}
