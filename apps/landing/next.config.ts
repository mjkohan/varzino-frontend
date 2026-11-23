import path from "node:path";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Self-contained server for the Docker image (see Dockerfile).
  output: "standalone",
  // Trace workspace packages from the monorepo root.
  outputFileTracingRoot: path.join(process.cwd(), "../../"),
  transpilePackages: ["@varzino/ui", "@varzino/shared", "@varzino/demo-data", "@varzino/utils"],
  reactStrictMode: true,
};

export default nextConfig;
