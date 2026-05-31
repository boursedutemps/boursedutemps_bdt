/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    serverComponentsExternalPackages: ['pg', 'bcryptjs', 'jsonwebtoken', '@react-pdf/renderer'],
  },
  transpilePackages: ['@livekit/components-react', '@livekit/components-core'],
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'i.postimg.cc' },
      { protocol: 'https', hostname: 'picsum.photos' },
      { protocol: 'https', hostname: 'res.cloudinary.com' },
      { protocol: 'https', hostname: 'livekit.io' },
    ],
  },

  // ── En-têtes de sécurité ─────────────────────────────────────────────
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          // Clickjacking protection
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
          // XSS protection
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          // HTTPS only
          { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },
          // Referrer
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          // Permissions
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
          // Cross-Origin Opener Policy
          { key: 'Cross-Origin-Opener-Policy', value: 'same-origin-allow-popups' },
          // Cross-Origin Resource Policy
          { key: 'Cross-Origin-Resource-Policy', value: 'cross-origin' },
          // Content Security Policy
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://cdn.jsdelivr.net",
              "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
              "font-src 'self' https://fonts.gstatic.com",
              "img-src 'self' data: blob: https: http:",
              "media-src 'self' https: blob:",
              "connect-src 'self' https: wss:",
              "frame-src 'self' https:",
              "worker-src 'self' blob:",
            ].join('; '),
          },
        ],
      },
      // Cache statique long pour les assets
      {
        source: '/static/(.*)',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
        ],
      },
      {
        source: '/_next/static/(.*)',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
        ],
      },
    ];
  },
};

export default nextConfig;
