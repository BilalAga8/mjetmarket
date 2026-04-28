"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase-browser";
import { useLanguage } from "@/lib/lang";

type Profile = { emri: string; mbiemri: string; email: string };

export default function ProfiliLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const router = useRouter();
  const pathname = usePathname();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [unread, setUnread] = useState(0);
  const { lang, setLang, t } = useLanguage();
  const tp = t.profili;

  const navItems = [
    { href: "/profili",             label: tp.panel,    icon: "📊", exact: true },
    { href: "/profili/njoftimet",   label: tp.listings, icon: "🚗" },
    { href: "/profili/libri",       label: tp.logbook,  icon: "📓" },
    { href: "/profili/mesazhet",    label: tp.messages, icon: "✉️" },
    { href: "/profili/shto-mjet",   label: tp.add,      icon: "➕" },
    { href: "/profili/statistikat", label: tp.stats,    icon: "📈" },
    { href: "/profili/cilesimet",   label: tp.settings, icon: "⚙️" },
  ];

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(async ({ data: { user } }) => {
      if (!user) { router.replace("/login"); return; }
      const [{ data: prof }, { count }] = await Promise.all([
        supabase.from("profiles").select("emri, mbiemri").eq("id", user.id).single(),
        supabase.from("notifications").select("*", { count: "exact", head: true }).eq("user_id", user.id).eq("read", false),
      ]);
      setProfile({ emri: prof?.emri ?? "", mbiemri: prof?.mbiemri ?? "", email: user.email ?? "" });
      setUnread(count ?? 0);
    });
  }, [router]);

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  }

  if (!profile) return null;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row">
      {/* Sidebar — desktop only */}
      <aside className="hidden md:flex w-60 shrink-0 bg-white border-r border-gray-200 flex-col shadow-sm">
        <div className="px-5 py-5 border-b border-gray-100">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 17H3a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11a2 2 0 0 1 2 2v3" />
                <rect x="9" y="11" width="14" height="10" rx="2" />
                <circle cx="12" cy="21" r="1" />
                <circle cx="20" cy="21" r="1" />
              </svg>
            </div>
            <span className="text-sm font-extrabold text-gray-900 tracking-tight">
              Mjet<span className="text-green-500">Market</span>
            </span>
          </Link>
          <p className="text-xs text-gray-400 mt-1 ml-10">{tp.panel}</p>
        </div>

        <nav className="flex-1 px-3 py-4 flex flex-col gap-1">
          {navItems.map((item) => {
            const active = item.exact ? pathname === item.href : pathname.startsWith(item.href);
            return (
              <Link key={item.href} href={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors duration-150 ${
                  active ? "bg-green-50 text-green-700" : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
                }`}>
                <span>{item.icon}</span>
                <span className="flex-1">{item.label}</span>
                {item.href === "/profili/mesazhet" && unread > 0 && (
                  <span className="bg-green-500 text-white text-xs font-bold px-1.5 py-0.5 rounded-full min-w-[20px] text-center">
                    {unread}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        <div className="px-3 py-4 border-t border-gray-100">
          <div className="flex items-center gap-3 px-3 py-2 mb-2">
            <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-green-700 text-sm font-bold">
              {profile.emri?.[0]?.toUpperCase() ?? "U"}
            </div>
            <div className="min-w-0">
              <p className="text-xs font-semibold text-gray-900 truncate">{profile.emri || "Përdorues"}</p>
              <p className="text-xs text-gray-400 truncate">{profile.email}</p>
            </div>
          </div>
          <div className="flex items-center justify-between px-3 py-2 mb-1">
            <button
              onClick={() => setLang(lang === "sq" ? "en" : "sq")}
              className="text-xs font-bold text-gray-400 hover:text-gray-700 transition-colors"
            >
              <span className={lang === "sq" ? "text-green-600" : ""}>SQ</span>
              <span className="mx-0.5">/</span>
              <span className={lang === "en" ? "text-green-600" : ""}>EN</span>
            </button>
          </div>
          <button onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-gray-500 hover:bg-red-50 hover:text-red-500 transition-colors duration-150">
            <span>🚪</span> {tp.logout}
          </button>
        </div>
      </aside>

      {/* Mobile top bar */}
      <div className="md:hidden bg-white border-b border-gray-200 px-4 h-14 flex items-center justify-between shrink-0">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-7 h-7 bg-green-500 rounded-lg flex items-center justify-center">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 17H3a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11a2 2 0 0 1 2 2v3" />
              <rect x="9" y="11" width="14" height="10" rx="2" />
              <circle cx="12" cy="21" r="1" />
              <circle cx="20" cy="21" r="1" />
            </svg>
          </div>
          <span className="text-sm font-extrabold text-gray-900">Mjet<span className="text-green-500">Market</span></span>
        </Link>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-green-700 text-sm font-bold">
            {profile.emri?.[0]?.toUpperCase() ?? "U"}
          </div>
          <button
            onClick={() => setLang(lang === "sq" ? "en" : "sq")}
            className="text-xs font-bold text-gray-400 hover:text-gray-700 transition-colors"
          >
            <span className={lang === "sq" ? "text-green-600" : ""}>SQ</span>
            <span className="mx-0.5">/</span>
            <span className={lang === "en" ? "text-green-600" : ""}>EN</span>
          </button>
          <button onClick={handleLogout} className="text-xs text-gray-400 hover:text-red-500 transition-colors px-2">{tp.logout}</button>
        </div>
      </div>

      <main className="flex-1 overflow-auto pb-20 md:pb-0">
        {children}
      </main>

      {/* Bottom nav — mobile only */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 flex z-40">
        {navItems.map((item) => {
          const active = item.exact ? pathname === item.href : pathname.startsWith(item.href);
          return (
            <Link key={item.href} href={item.href}
              className={`flex-1 flex flex-col items-center justify-center py-2 gap-0.5 text-xs font-medium transition-colors ${
                active ? "text-green-600" : "text-gray-400"
              }`}>
              <span className="text-lg leading-none">{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
