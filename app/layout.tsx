import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Tro-Tro Route Finder — Kumasi's Informal Transit Search Engine",
  description:
    "Find tro-tro routes and transfer options in Kumasi instantly. Search by stations, landmarks, or describe your trip in Twi, Pidgin, or English.",
  keywords: [
    "trotro",
    "tro-tro",
    "Kumasi",
    "Ghana",
    "transit",
    "route finder",
    "Kejetia",
    "KNUST",
    "Adum",
    "informal transport",
  ],
  authors: [{ name: "Tro-Tro Route Finder Team" }],
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  viewportFit: "cover",
  themeColor: "#0f172a",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <body className="h-full w-full overflow-hidden bg-slate-950 text-slate-100 antialiased selection:bg-amber-500/30 selection:text-amber-300">
        {children}
      </body>
    </html>
  );
}
