import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { locales, rtlLocales, type Locale } from '@/i18n/routing';
import { UserProvider }  from '@/components/UserProvider';
import { ThemeProvider } from '@/components/ThemeProvider';
import GlobalShell       from '@/components/GlobalShell';
import { Suspense } from 'react';

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  const { locale } = params;

  if (!locales.includes(locale as Locale)) {
    notFound();
  }

  const messages = await getMessages();
  const isRTL    = rtlLocales.includes(locale as Locale);

  return (
    <html lang={locale} dir={isRTL ? 'rtl' : 'ltr'}>
      <body>
        <NextIntlClientProvider locale={locale} messages={messages}>
          <ThemeProvider>
            <UserProvider>
              <Suspense fallback={null}>
                <GlobalShell>
                  {children}
                </GlobalShell>
              </Suspense>
            </UserProvider>
          </ThemeProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
