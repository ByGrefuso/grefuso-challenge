import "./globals.css";

export const metadata = {
  title: "Grefuso Challenge",
  description: "Web oficial del Grefuso Challenge",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
import type { Metadata } from "next";

export const metadata: Metadata = {
  metadataBase: new URL("https://grefusochallenge.com"),
  title: {
    default: "Grefuso Challenge 2026 | SoloQ Challenge",
    template: "%s | Grefuso Challenge 2026",
  },
  description:
    "Grefuso Challenge 2026: SoloQ Challenge de League of Legends. Consulta participantes, clasificación en directo, normas y directos.",
  keywords: [
    "Grefuso Challenge",
    "Grefuso Challenge 2026",
    "SoloQ Challenge",
    "League of Legends",
    "LoL",
    "SoloQ",
    "Grefuso",
  ],
  alternates: {
    canonical: "https://grefusochallenge.com",
  },
  openGraph: {
    title: "Grefuso Challenge 2026 | SoloQ Challenge",
    description:
      "Toda la información del Grefuso Challenge 2026: participantes, clasificación, normas y directos.",
    url: "https://grefusochallenge.com",
    siteName: "Grefuso Challenge 2026",
    type: "website",
    locale: "es_ES",
    images: [
      {
        url: "/logo.png",
        width: 512,
        height: 512,
        alt: "Grefuso Challenge 2026",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Grefuso Challenge 2026 | SoloQ Challenge",
    description:
      "Toda la información del Grefuso Challenge 2026.",
    images: ["/logo.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
