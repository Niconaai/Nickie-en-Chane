import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ['i.scdn.co'], // Spotify album images
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.ctfassets.net', // <-- Domain for Checkers product images
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'catalog.sixty60.co.za', // <-- The new hostname from the error
        port: '',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
