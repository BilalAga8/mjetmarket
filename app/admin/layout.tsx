"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase-browser";

type Profile = { emri: string; email: string };

const navItems = [
  { href: "/admin/dashboard",   label: "Dashboard",   icon: "📊" },
  { href: "/admin/mjetet",      label: "Mjetet",      icon: "🚗" },
  { href: "/admin/sallone",     label: "Sallone",     icon: "🏪" },
  { href: "/admin/dyqanet",     label: "Dyqanet",     icon: "🔧" },
  { href: "/admin/pjeset",      label: "Pjesët",      icon: "⚙️" },
  { href: "/admin/kontaktet",   label: "Kontaktet",   icon: "✉️" },
  { href: "/admin/sherbimet",   label: "Sherbimet",   icon: "⚡" },
  { href: "/admin/perdoruesit", label: "Përdoruesit", icon: "👤" },
];

export default function AdminLayout({ children }: { readonly children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [profile, setProfile] = useState<Profile | null>(null);

  useEffect(() => {
    if (pathname === "/admin/login") return;
    const supabase = createClient();
    supabase.auth.getUser().then(async ({ data: { user } }) => {
      if (!user) { router.replace("/admin/login"); return; }
      if (user.app_metadata?.role !== "admin") { router.replace("/admin/login"); return; }
      const { data } = await supabase
        .from("profiles")
        .select("emri")
        .eq("id", user.id)
        .single();
      setProfile({ emri: data?.emri ?? "Admin", email: user.email ?? "" });
    });
  }, [pathname, router]);

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/admin/login");
    router.refresh();
  }

  if (pathname === "/admin/login") return <>{children}</>;
  if (!profile) return null;

  return (
    <div className="min-h-screen bg-gray-950 flex flex-col md:flex-row">
      {/* Sidebar — desktop only */}
      <aside className="hidden md:flex w-60 shrink-0 bg-gray-900 border-r border-gray-800 flex-col">
        <div className="px-5 py-5 border-b border-gray-800">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 17H3a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11a2 2 0 0 1 2 2v3" />
                <rect x="9" y="11" width="14" height="10" rx="2" />
                <circle cx="12" cy="21" r="1" />
                <circle cx="20" cy="21" r="1" />
              </svg>
            </div>
            <span className="text-sm font-extrabold text-white tracking-tight">
              Mjet<span className="text-green-500">Market</span>
            </span>
          </Link>
          <p className="text-xs text-gray-500 mt-1 ml-10">Admin Panel</p>
        </div>

        <nav className="flex-1 px-3 py-4 flex flex-col gap-1">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors duration-150 ${
                pathname === item.href
                  ? "bg-green-500/15 text-green-400"
                  : "text-gray-400 hover:bg-gray-800 hover:text-white"
              }`}>
              <span>{item.icon}</span>
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="px-3 py-4 border-t border-gray-800">
          <div className="flex items-center gap-3 px-3 py-2 mb-2">
            <div className="w-7 h-7 rounded-full bg-green-500/20 flex items-center justify-center text-green-400 text-xs font-bold">
              {profile.emri?.[0]?.toUpperCase() ?? "A"}
            </div>
            <div>
              <p className="text-xs font-semibold text-white">{profile.emri}</p>
              <p className="text-xs text-gray-500">{profile.email}</p>
            </div>
          </div>
          <button onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-gray-400 hover:bg-gray-800 hover:text-red-400 transition-colors duration-150">
            <span>🚪</span> Dil nga llogaria
          </button>
        </div>
      </aside>

      {/* Mobile top bar */}
      <div className="md:hidden bg-gray-900 border-b border-gray-800 px-4 h-14 flex items-center justify-between shrink-0">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-7 h-7 bg-green-500 rounded-lg flex items-center justify-center">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 17H3a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11a2 2 0 0 1 2 2v3" />
              <rect x="9" y="11" width="14" height="10" rx="2" />
              <circle cx="12" cy="21" r="1" />
              <circle cx="20" cy="21" r="1" />
            </svg>
          </div>
          <span className="text-sm font-extrabold text-white">Mjet<span className="text-green-500">Market</span> <span className="text-gray-500 font-normal text-xs">Admin</span></span>
        </Link>
        <button onClick={handleLogout} className="text-xs text-gray-500 hover:text-red-400 transition-colors">Dil</button>
      </div>

      <main className="flex-1 overflow-auto pb-20 md:pb-0">
        {children}
      </main>

      {/* Bottom nav — mobile only */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-gray-900 border-t border-gray-800 flex z-40">
        {navItems.map((item) => {
          const active = pathname === item.href;
          return (
            <Link key={item.href} href={item.href}
              className={`flex-1 flex flex-col items-center justify-center py-2 gap-0.5 text-xs font-medium transition-colors ${
                active ? "text-green-400" : "text-gray-500"
              }`}>
              <span className="text-lg leading-none">{item.icon}</span>
              <span className="truncate w-full text-center px-1">{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
