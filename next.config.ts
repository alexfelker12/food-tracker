import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  turbopack: {
    root: path.join(__dirname)
  },
  devIndicators: false,
  cacheComponents: true, // enables ppr
  reactCompiler: true,
  allowedDevOrigins: ['192.168.178.71'],
}

export default nextConfig;
