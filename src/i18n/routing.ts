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
  // Le français garde des URLs propres (/services)
  // Les autres langues sont préfixées (/en/services, /es/services)
  localePrefix: 'as-needed',
});
