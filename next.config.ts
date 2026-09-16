import type { NextConfig } from "next";

import { MAINTAINERS } from "./lib/maintainers";

const nextConfig: NextConfig = {
  images: {
    // Pinned to the maintainer avatars rendered on /requests. A wildcard such
    // as "/*.png" would let anyone make /_next/image fetch and transcode any
    // GitHub avatar, since the optimizer is public and unauthenticated.
    remotePatterns: MAINTAINERS.map((username) => ({
      protocol: "https" as const,
      hostname: "github.com",
      pathname: `/${username}.png`,
    })),
  },
  // Self-contained build output (.next/standalone + a minimal server.js) so the
  // production Docker image ships only traced runtime deps. The runner serves
  // with `node server.js` instead of `next start`.
  output: "standalone",
  experimental: {
    // forbidden() (used by AuthGuard for real 403s) requires this experimental
    // flag; pairs with app/forbidden.tsx.
    serverActions: {
      bodySizeLimit: "6mb",
    },
    authInterrupts: true,
  },
};

export default nextConfig;
