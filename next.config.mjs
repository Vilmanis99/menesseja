/** @type {import('next').NextConfig} */
const nextConfig = {
  // Sitemap regeneration reads these collections from disk after the build.
  outputFileTracingIncludes: {
    "/sitemap.xml": ["./content/{articles,crops,flowers,kaitekli,recipes,tops}/*.json"],
  },
  images: {
    remotePatterns: [{ protocol: "https", hostname: "**" }],
  },
};

export default nextConfig;
