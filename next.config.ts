import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Served as-is: images uploaded from the admin panel after a build are not
    // visible to Next's image optimizer, and resizing on a 1 GB server is slow.
    unoptimized: true,
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
    ],
  },
};

export default nextConfig;
