import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import ClientLayout from "@/components/ClientLayout";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "MjetMarket — Blen dhe Shit Makina në Shqipëri",
    template: "%s | MjetMarket",
  },
  description: "Platforma kryesore për blerjen dhe shitjen e makinave në Shqipëri. Mijëra oferta makinash, servise dhe pjesë këmbimi.",
  keywords: ["makina shqiperi", "shitet makina", "blej makina", "auto shqiperi", "mjet market"],
  metadataBase: new URL("https://www.mjetmarket.com"),
  openGraph: {
    title: "MjetMarket — Blen dhe Shit Makina në Shqipëri",
    description: "Platforma kryesore për blerjen dhe shitjen e makinave në Shqipëri.",
    url: "https://www.mjetmarket.com",
    siteName: "MjetMarket",
    locale: "sq_AL",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="sq"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}
