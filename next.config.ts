import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    deviceSizes: [640, 768, 1024, 1280, 1536],
    imageSizes: [64, 88, 128, 256, 384],
    qualities: [62, 68, 72, 75],
    formats: ["image/webp"],
  },
};

export default nextConfig;
