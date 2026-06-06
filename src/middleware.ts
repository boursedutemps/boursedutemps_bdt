// src/middleware.ts
import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';

export default createMiddleware(routing);

export const config = {
  // Applique le middleware à toutes les routes sauf API, _next, fichiers statiques
  matcher: [
    '/((?!api|_next|_vercel|.*\\..*).*)',
    '/(fr|en|ht|es|ar|sw|wo|pt|de|it|zh|ru|ja|ko|nl|tr|hi)/:path*',
  ],
};
