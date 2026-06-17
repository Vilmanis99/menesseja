import type { Metadata, Viewport } from "next";
import { Literata, Hanken_Grotesk } from "next/font/google";
import { AppShell } from "@/components/app-shell";
import { PwaRegister } from "@/components/pwa-register";
import { JsonLd } from "@/components/json-ld";
import { SITE_URL } from "@/lib/seo";
import "./globals.css";

const ORG_JSONLD = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Mēness Sēja",
  url: SITE_URL,
  logo: `${SITE_URL}/icon.svg`,
  description:
    "Latviešu Mēness sējas un biodinamiskais dārza kalendārs — sēj saskaņā ar Mēnesi, laikapstākļiem un senču gudrību.",
  // Entity/trust signals — marks this as the Latvia-specific authority for answer engines.
  areaServed: { "@type": "Country", name: "Latvija" },
  knowsLanguage: "lv",
  knowsAbout: [
    "Mēness sēja",
    "biodinamiskā dārzkopība",
    "dārzeņu audzēšana Latvijā",
    "puķu kopšana",
    "kaitēkļu un slimību dabīga apkarošana",
    "Mēness kalendārs",
  ],
  sameAs: ["https://www.globalverticalgardening.net"],
};

const WEBSITE_JSONLD = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "Mēness Sēja",
  url: SITE_URL,
  inLanguage: "lv",
  publisher: { "@type": "Organization", name: "Mēness Sēja", url: SITE_URL },
};

const literata = Literata({
  subsets: ["latin", "latin-ext"],
  display: "swap",
  variable: "--font-literata",
  weight: ["400", "600", "700"],
});

const hanken = Hanken_Grotesk({
  subsets: ["latin", "latin-ext"],
  display: "swap",
  variable: "--font-hanken",
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Mēness Sēja — Latviešu Mēness sējas kalendārs",
    template: "%s · Mēness Sēja",
  },
  description:
    "Sēj un stādi saskaņā ar Mēness cikliem un latviešu senču gudrību. Reģionālais mikroklimats, kaimiņaugi un dārza dienasgrāmata.",
  manifest: "/manifest.webmanifest",
  appleWebApp: { capable: true, statusBarStyle: "black-translucent", title: "Mēness Sēja" },
  icons: { icon: "/icon.svg", apple: "/icon.svg" },
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "lv_LV",
    siteName: "Mēness Sēja",
    title: "Mēness Sēja — Latviešu Mēness sējas kalendārs",
    description:
      "Sēj un stādi saskaņā ar Mēness cikliem un latviešu senču gudrību — Latvijas klimatam.",
  },
  twitter: { card: "summary_large_image" },
};

export const viewport: Viewport = {
  themeColor: "#0b1326",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="lv" className={`${literata.variable} ${hanken.variable}`}>
      <head>
        {/* Material Symbols — variable axes for fill/weight toggles */}
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&display=swap"
        />
      </head>
      <body className="min-h-screen">
        <JsonLd data={ORG_JSONLD} />
        <JsonLd data={WEBSITE_JSONLD} />
        <AppShell>{children}</AppShell>
        <PwaRegister />
      </body>
    </html>
  );
}
