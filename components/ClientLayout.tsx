"use client";

import { usePathname } from "next/navigation";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { LanguageProvider } from "@/lib/lang";

export default function ClientLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith("/admin") || pathname.startsWith("/profili");

  if (isAdmin) return <LanguageProvider>{children}</LanguageProvider>;

  return (
    <LanguageProvider>
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
    </LanguageProvider>
  );
}
