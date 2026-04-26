"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase-browser";

export default function DyqaniLayout({ children }: { children: React.ReactNode }) {
  const router   = useRouter();
  const pathname = usePathname();
  const [shopName, setShopName] = useState<string | null>(null);

  useEffect(() => {
    if (pathname === "/dyqani/login") return;
    const supabase = createClient();
    supabase.auth.getUser().then(async ({ data: { user } }) => {
      if (!user) { router.replace("/dyqani/login"); return; }
      if (user.app_metadata?.role === "admin") { router.replace("/admin"); return; }
      const { data } = await supabase
        .from("shop_profiles")
        .select("name")
        .eq("id", user.id)
        .single();
      setShopName(data?.name ?? "Dyqani");
    });
  }, [pathname, router]);

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/dyqani/login");
  }

  if (pathname === "/dyqani/login") return <>{children}</>;
  if (!shopName) return null;

  const navLinks = [
    { href: "/dyqani/kerkesat",     label: "Kërkesat" },
    { href: "/dyqani/ofertat-e-mia", label: "Ofertat e Mia" },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between gap-6">
          <Link href="/dyqani/kerkesat" className="flex items-center gap-2 shrink-0">
            <div className="w-7 h-7 bg-green-500 rounded-lg flex items-center justify-center">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 17H3a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11a2 2 0 0 1 2 2v3"/>
                <rect x="9" y="11" width="14" height="10" rx="2"/>
                <circle cx="12" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
              </svg>
            </div>
            <span className="text-sm font-extrabold text-gray-900">
              Mjet<span className="text-green-500">Market</span>
              <span className="text-gray-400 font-normal ml-1 text-xs">Panel</span>
            </span>
          </Link>

          <div className="flex items-center gap-4 flex-1">
            {navLinks.map((l) => (
              <Link key={l.href} href={l.href}
                className={`text-sm font-medium transition-colors ${pathname === l.href ? "text-green-600" : "text-gray-500 hover:text-gray-900"}`}>
                {l.label}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <span className="text-xs text-gray-500 hidden sm:block">{shopName}</span>
            <button onClick={handleLogout}
              className="text-xs text-gray-400 hover:text-red-500 transition-colors">
              Dil
            </button>
          </div>
        </div>
      </nav>

      <main className="flex-1">{children}</main>
    </div>
  );
}
