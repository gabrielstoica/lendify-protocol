/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "reneum.infura-ipfs.io",
      },
    ],
  },
};

export default nextConfig;
