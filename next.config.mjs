/** @type {import('next').NextConfig} */
const nextConfig = {
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
