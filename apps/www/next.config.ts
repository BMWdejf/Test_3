import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  transpilePackages: ["@neondatabase/auth-ui", "@daveyplate/better-auth-ui"],
};

export default nextConfig;
