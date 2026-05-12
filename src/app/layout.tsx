import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Traveloop — Plan Your Perfect Trip",
  description: "Plan multi-city trips with ease.",
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}
