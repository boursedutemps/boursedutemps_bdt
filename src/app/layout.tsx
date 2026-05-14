import { Inter, Outfit } from 'next/font/google';
import './globals.css';
import { UserProvider } from '@/components/UserProvider';
import { ThemeProvider } from '@/components/ThemeProvider';
import OnboardingWrapper from '@/components/OnboardingWrapper';
import { Metadata, Viewport } from 'next';

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' });
const outfit = Outfit({ subsets: ['latin'], variable: '--font-heading' });

const BASE_URL = 'https://boursedutemps.vercel.app';
const DESCRIPTION = "Échangez vos talents, apprenez gratuitement et construisez l'avenir au sein de notre banque de temps solidaire.";

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#2563eb' },
    { media: '(prefers-color-scheme: dark)',  color: '#1e40af' },
  ],
  width: 'device-width',
  initialScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: 'Bourse du Temps — Échangez vos talents',
    template: '%s | Bourse du Temps',
  },
  description: DESCRIPTION,
  keywords: ['bourse du temps', 'échange de services', 'crédits temps', 'solidarité', 'entraide', 'université senghor'],
  authors: [{ name: 'Bourse du Temps', url: BASE_URL }],
  creator: 'Bourse du Temps',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Bourse du Temps',
  },
  openGraph: {
    title: 'Bourse du Temps — Échangez vos talents',
    description: DESCRIPTION,
    url: BASE_URL,
    siteName: 'Bourse du Temps',
    locale: 'fr_FR',
    type: 'website',
    images: [{ url: 'https://i.postimg.cc/5Y3Rg6zs/image-1.jpg', width: 1200, height: 630, alt: 'Bourse du Temps' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Bourse du Temps',
    description: DESCRIPTION,
    images: ['https://i.postimg.cc/5Y3Rg6zs/image-1.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
  alternates: {
    canonical: BASE_URL,
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className={`${inter.variable} ${outfit.variable}`} suppressHydrationWarning>
      <head>
        <link rel="icon" href="https://i.postimg.cc/5Y3Rg6zs/image-1.jpg" />
        <link rel="apple-touch-icon" href="https://i.postimg.cc/5Y3Rg6zs/image-1.jpg" />
      </head>
      <body className="font-sans antialiased bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-300">
        <ThemeProvider>
          <UserProvider>
            {children}
            <OnboardingWrapper />
          </UserProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
