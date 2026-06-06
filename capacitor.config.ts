import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'org.boursedutemps.app',
  appName: 'Bourse du Temps',
  webDir: 'out',

  // Charge directement la production Vercel dans le WebView.
  // Tous les appels /api/* fonctionnent sans aucune modification du code.
  server: {
    url: 'https://boursedutemps.vercel.app',
    cleartext: false,
    androidScheme: 'https',
  },

  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      launchAutoHide: true,
      backgroundColor: '#FFFCF7',
      showSpinner: false,
    },
  },
};

export default config;
