import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  turbopack: {
    root: path.join(__dirname)
  },
  devIndicators: false,
  // cacheComponents: true //! currently tries to run static content from edge causing compatability issues with prisma's generated client
}

export default nextConfig;
