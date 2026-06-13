// src/app/not-found.tsx
// Page 404 globale — hors [locale], ne peut pas utiliser next-intl
// Redirige vers la home avec un message simple

import Link from 'next/link';

export default function NotFound() {
  return (
    <main className="min-h-screen bg-[#FFFCF7] flex items-center justify-center px-4">
      <div className="text-center">
        <p className="text-6xl mb-6">🕰️</p>
        <h1 className="text-4xl font-bold text-slate-800 mb-3">404</h1>
        <p className="text-slate-500 mb-8">
          Cette page n'existe pas ou a été déplacée.
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700 transition-colors"
        >
          ← Retour à l'accueil
        </Link>
      </div>
    </main>
  );
}
