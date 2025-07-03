import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: '/hls/:path*',
        destination: 'http://localhost:5000/hls/:path*', // Proxy vers ton backend HLS
      },
      {
        source: '/api/videos',
        destination: 'http://localhost:5000/videos', // Proxy direct pour la liste
      },
      {
        source: '/api/videos/:id',
        destination: 'http://localhost:5000/videos/:id', // Proxy pour une vidéo précise (si tu ajoutes cette route côté Flask)
      },
    ];
  },
};

export default nextConfig;
