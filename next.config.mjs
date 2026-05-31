/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    serverComponentsExternalPackages: ['pg', 'bcryptjs', 'jsonwebtoken', '@react-pdf/renderer'],
    serverActions: {
      bodySizeLimit: '10mb',
    },
  },
  transpilePackages: ['@livekit/components-react', '@livekit/components-core'],
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'i.postimg.cc' },
      { protocol: 'https', hostname: 'picsum.photos' },
      { protocol: 'https', hostname: 'res.cloudinary.com' },
    ],
  },
};
export default nextConfig;
