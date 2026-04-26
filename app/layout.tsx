import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import ClientLayout from "@/components/ClientLayout";
import { Analytics } from "@vercel/analytics/next";
import Script from "next/script";

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
  keywords: [
    "makina shqiperi", "shitet makina", "blej makina", "auto shqiperi", "mjet market",
    "makina te perdorura", "auto okazion", "kerko makina", "makina te lira shqiperi",
    "servis makine shqiperi", "servis mekanik tirane", "riparim makine",
    "pjese kembimi makine", "auto parts shqiperi", "spare parts shqiperi",
    "makina tirane", "makina durres", "shes makine shqiperi",
  ],
  metadataBase: new URL("https://www.mjetmarket.com"),
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "32x32", type: "image/x-icon" },
      { url: "/icon.svg", type: "image/svg+xml" },
    ],
    shortcut: "/favicon.ico",
    apple: "/favicon.ico",
  },
  openGraph: {
    title: "MjetMarket — Blen dhe Shit Makina në Shqipëri",
    description: "Platforma kryesore për blerjen dhe shitjen e makinave në Shqipëri.",
    url: "https://www.mjetmarket.com",
    siteName: "MjetMarket",
    locale: "sq_AL",
    type: "website",
    images: [{ url: "/hero.jpg", width: 1200, height: 630, alt: "MjetMarket" }],
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
        <Analytics />
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-3K12SSHYKV"
          strategy="lazyOnload"
        />
        <Script id="google-analytics" strategy="lazyOnload">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-3K12SSHYKV');
          `}
        </Script>
      </body>
    </html>
  );
}
