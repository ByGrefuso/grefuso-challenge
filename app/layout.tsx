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
