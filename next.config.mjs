/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
      remotePatterns: [
        {
          protocol: 'https',
          hostname: 'media.discordapp.net',
        },
        {
          protocol: 'https',
          hostname: 'www.pexels.com',
        },
        {
          protocol: 'https',
          hostname: 'images.pexels.com',
        },
        {
          protocol: 'https',
          hostname: 'via.placeholder.com',
        },
        {
          protocol: 'https',
          hostname: 'instagram.fbog7-1.fna.fbcdn.net',
        },
        {
          protocol: 'https',
          hostname: 'images.ctfassets.net',
        },

        {
          protocol: 'https',
          hostname: 'videos.ctfassets.net',
        },
        {
          protocol: 'https',
          hostname: 'undefined',
        }



      ],
    },
  };
  
  export default nextConfig;
  