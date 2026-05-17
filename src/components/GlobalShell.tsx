"use client";

// src/components/GlobalShell.tsx
// Shell global — Navbar + Footer + AIChat + AuthModal
// Intégré dans layout.tsx, s'affiche sur TOUTES les pages automatiquement

import React, { useState, useEffect } from 'react';
import Navbar   from './Navbar';
import AIChat   from './AIChat';
import Footer   from './Footer';
import AuthModal from './AuthModal';
import OnboardingWrapper from './OnboardingWrapper';
import { useUser }    from './UserProvider';
import { useRouter, useSearchParams } from 'next/navigation';

export default function GlobalShell({ children }: { children: React.ReactNode }) {
  const { user, setUser, notifications, logout } = useUser();
  const [showAuthModal, setShowAuthModal] = useState<'login' | 'signup' | null>(null);
  const router = useRouter();

  // Ouvrir le modal auto si ?auth=login ou ?auth=signup dans l'URL
  const searchParams = useSearchParams();
  useEffect(() => {
    const auth = searchParams.get('auth');
    if (auth === 'login')  setShowAuthModal('login');
    if (auth === 'signup') setShowAuthModal('signup');
  }, [searchParams]);

  const handleMarkRead = async (id: string) => {
    try {
      await fetch(`/api/notifications/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ isRead: true }),
      });
    } catch (e) {
      console.error(e);
    }
  };

  const handleAuthSuccess = async (_token: string, userId: string, name: string, email: string) => {
    setUser({
      uid: userId,
      id: userId,
      firstName: name.split(' ')[0],
      lastName: name.split(' ').slice(1).join(' '),
      email,
      credits: 0,
      role: 'user',
      status: 'active',
    } as never);
    setShowAuthModal(null);

    // Rediriger si paramètre redirect dans l'URL
    const redirect = searchParams.get('redirect');
    if (redirect) router.push(redirect);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar
        user={user}
        notifications={notifications}
        onLogin={() => setShowAuthModal('login')}
        onSignup={() => setShowAuthModal('signup')}
        onLogout={logout}
        onMarkRead={handleMarkRead}
      />

      <main className="flex-grow pt-16">
        {children}
      </main>

      <Footer />

      <OnboardingWrapper />
      <AIChat />

      {showAuthModal && (
        <AuthModal
          onClose={() => setShowAuthModal(null)}
          onSuccess={handleAuthSuccess}
        />
      )}
    </div>
  );
}
