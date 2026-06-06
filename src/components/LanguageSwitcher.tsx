'use client';

// src/components/LanguageSwitcher.tsx
import { useLocale, useTranslations } from 'next-intl';
import { usePathname, useRouter } from '@/i18n/navigation';
import { useState, useRef, useEffect } from 'react';
import { locales, type Locale } from '@/i18n/routing';

const LOCALE_FLAGS: Record<Locale, string> = {
  fr: '🇫🇷', en: '🇬🇧', ht: '🇭🇹', es: '🇪🇸',
  ar: '🇸🇦', sw: '🇰🇪', wo: '🇸🇳', pt: '🇧🇷',
  de: '🇩🇪', it: '🇮🇹', zh: '🇨🇳', ru: '🇷🇺',
  ja: '🇯🇵', ko: '🇰🇷', nl: '🇳🇱', tr: '🇹🇷',
  hi: '🇮🇳',
};

export default function LanguageSwitcher() {
  const locale   = useLocale() as Locale;
  const t        = useTranslations('language');
  const router   = useRouter();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const ref             = useRef<HTMLDivElement>(null);

  // Fermer au clic extérieur
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  // ✅ next-intl gère automatiquement les préfixes d'URL
  const switchLocale = (newLocale: Locale) => {
    setOpen(false);
    router.replace(pathname, { locale: newLocale });
  };

  const isRTL = locale === 'ar';

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(v => !v)}
        aria-label={t('select')}
        aria-expanded={open}
        aria-haspopup="listbox"
        className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-full text-sm font-semibold text-slate-600 hover:bg-slate-100 transition-colors border border-slate-200"
      >
        <span>{LOCALE_FLAGS[locale]}</span>
        <span className="uppercase text-xs">{locale}</span>
        <svg
          className={`w-3 h-3 text-slate-400 transition-transform ${open ? 'rotate-180' : ''}`}
          fill="none" viewBox="0 0 24 24" stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {open && (
        <div
          role="listbox"
          aria-label={t('select')}
          className={`absolute top-full mt-2 bg-white border border-slate-100 rounded-2xl shadow-xl z-50 py-2 min-w-[190px] max-h-[320px] overflow-y-auto ${isRTL ? 'left-0' : 'right-0'}`}
        >
          {locales.map(loc => (
            <button
              key={loc}
              role="option"
              aria-selected={loc === locale}
              onClick={() => switchLocale(loc)}
              className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm text-left hover:bg-slate-50 transition-colors ${
                loc === locale
                  ? 'text-blue-600 font-bold bg-blue-50'
                  : 'text-slate-700'
              }`}
            >
              <span className="text-base flex-shrink-0">{LOCALE_FLAGS[loc]}</span>
              <span className="flex-1">{t(loc)}</span>
              {loc === locale && (
                <svg className="w-4 h-4 text-blue-600 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                </svg>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
