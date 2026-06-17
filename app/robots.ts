import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/seo";

const PRIVATE = ["/api/", "/iestatijumi", "/diagnoze"];

// Major AI / generative-search crawlers. We explicitly WELCOME them so the site
// can be cited in ChatGPT, Claude, Perplexity, Google AI Overviews etc. — our
// factual, structured content (FAQ/HowTo JSON-LD) is exactly what they extract.
const AI_BOTS = [
  // OpenAI — index, search, and live user-query fetch
  "GPTBot",
  "OAI-SearchBot",
  "ChatGPT-User",
  // Anthropic / Claude — index, search, and live fetch
  "ClaudeBot",
  "anthropic-ai",
  "Claude-Web",
  "Claude-SearchBot",
  "Claude-User",
  // Perplexity — PerplexityBot indexes; Perplexity-User fetches live when answering
  "PerplexityBot",
  "Perplexity-User",
  // Google Gemini / Vertex (AI Overviews itself rides on Googlebot, already in "*")
  "Google-Extended",
  // Apple Intelligence / Siri
  "Applebot-Extended",
  // Amazon (Rufus / Alexa+), Meta AI, DuckDuckGo AI-assist, Allen Institute
  "Amazonbot",
  "Meta-ExternalAgent",
  "DuckAssistBot",
  "AI2Bot",
  // Common Crawl (feeds many open answer models)
  "CCBot",
];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: "*", allow: "/", disallow: PRIVATE },
      { userAgent: AI_BOTS, allow: "/", disallow: PRIVATE },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
