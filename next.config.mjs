/** @type {import('next').NextConfig} */
const nextConfig = {
  async headers() {
    return [{
      source: "/fonts/:family.:digest([a-f0-9]{16}).woff2",
      headers: [{ key: "Cache-Control", value: "public, max-age=31536000, immutable" }],
    }];
  },
  // Both routes read the editorial collections on the server after deployment.
  outputFileTracingIncludes: {
    "/meklet": ["./content/{articles,crops,flowers,kaitekli,recipes,tops}/*.json"],
    "/sitemap.xml": ["./content/{articles,crops,flowers,kaitekli,recipes,tops}/*.json"],
  },
  images: {
    remotePatterns: [{ protocol: "https", hostname: "**" }],
  },
};

export default nextConfig;
