/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
          {
            protocol: 'https',
            hostname: 'filesystem.site',
          },
        ],
      },
};

export default nextConfig;
