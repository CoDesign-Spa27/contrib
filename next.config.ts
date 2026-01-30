import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { hostname: "avatars.githubusercontent.com", pathname: "/u/**", protocol: "https" },
      { hostname: "github.com", pathname: "/**", protocol: "https" },
    ],
  },
};

export default nextConfig;
