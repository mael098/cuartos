import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  cacheComponents: true,
  reactCompiler: true,
  allowedDevOrigins: ['io.eliyya.dev']
};

export default nextConfig;
