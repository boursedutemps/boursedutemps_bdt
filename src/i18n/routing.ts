// src/i18n/routing.ts
import { defineRouting } from 'next-intl/routing';

export const locales = [
  'fr', 'en', 'ht', 'es', 'ar', 'sw', 'wo',
  'pt', 'de', 'it', 'zh', 'ru', 'ja', 'ko',
  'nl', 'tr', 'hi'
] as const;

export type Locale = (typeof locales)[number];

export const rtlLocales: Locale[] = ['ar'];

export const routing = defineRouting({
  locales,
  defaultLocale: 'fr',
  // Toutes les langues ont un préfixe explicite dans l'URL :
  // /fr/, /en/, /ht/, /es/... → pas d'ambiguïté pour le middleware
  localePrefix: 'always',
});
