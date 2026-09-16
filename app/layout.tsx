import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://grefusochallenge.com"),
  title: {
    default: "Grefuso Challenge",
    template: "%s | Grefuso Challenge",
  },
  description:
    "Grefuso Challenge 2026 — competición, clasificación, participantes, clips y toda la información del evento de ByGrefuso.",
  keywords: [
    "Grefuso Challenge",
    "Grefuso Challenge 2026",
    "Grefuso Cup",
    "ByGrefuso",
    "esports",
    "League of Legends",
  ],
  alternates: { canonical: "https://grefusochallenge.com" },
  icons: {
    icon: "/logo.png",
    shortcut: "/logo.png",
    apple: "/logo.png",
  },
  openGraph: {
    title: "Grefuso Challenge",
    description: "Grefuso Challenge 2026 — competición y eventos de ByGrefuso.",
    url: "https://grefusochallenge.com",
    siteName: "Grefuso Challenge",
    type: "website",
    locale: "es_ES",
    images: [{ url: "/logo.png", width: 512, height: 512, alt: "Grefuso Challenge" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Grefuso Challenge",
    description: "Grefuso Challenge 2026 — competición y eventos de ByGrefuso.",
    images: ["/logo.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="es"><body>{children}</body></html>;
}
