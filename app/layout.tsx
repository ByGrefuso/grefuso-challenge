import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://grefusochallenge.com"),
  title: { default: "Grefuso Events", template: "%s | Grefuso Events" },
  description: "Grefuso Events — archivo de competiciones, challenges y próximos eventos de ByGrefuso.",
  keywords: ["Grefuso Events", "Grefuso Challenge", "Grefuso Challenge 2026", "Grefuso Cup", "ByGrefuso", "esports"],
  alternates: { canonical: "https://grefusochallenge.com" },
  openGraph: {
    title: "Grefuso Events",
    description: "Competiciones, retos y eventos de ByGrefuso.",
    url: "https://grefusochallenge.com",
    siteName: "Grefuso Events",
    type: "website",
    locale: "es_ES",
    images: [{ url: "/logo.png", width: 512, height: 512, alt: "Grefuso Events" }],
  },
  twitter: { card: "summary_large_image", title: "Grefuso Events", description: "Competiciones, retos y eventos de ByGrefuso.", images: ["/logo.png"] },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true } },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="es"><body>{children}</body></html>;
}
