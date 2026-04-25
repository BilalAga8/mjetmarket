"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase-browser";

interface Inquiry {
  id: string;
  name: string;
  phone: string | null;
  message: string | null;
  created_at: string;
  vehicles: { brand: string; model: string; year: number }[] | null;
}

interface Chat {
  id: string;
  buyer_id: string;
  seller_id: string;
  created_at: string;
  vehicles: { brand: string; model: string; year: number }[] | null;
}

function timeAgo(d: string) {
  const diff = Math.floor((Date.now() - new Date(d).getTime()) / 1000);
  if (diff < 60) return "tani";
  if (diff < 3600) return `${Math.floor(diff / 60)} min më parë`;
  if (diff < 86400) return `${Math.floor(diff / 3600)} orë më parë`;
  return `${Math.floor(diff / 86400)} ditë më parë`;
}

export default function MesazhetPage() {
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [chats, setChats] = useState<Chat[]>([]);
  const [userId, setUserId] = useState("");
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<"te_marra" | "chatet">("te_marra");
  const router = useRouter();

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(async ({ data: { user } }) => {
      if (!user) return;
      setUserId(user.id);

      const [{ data: inqData }, { data: chatData }] = await Promise.all([
        supabase
          .from("vehicle_inquiries")
          .select("id, name, phone, message, created_at, vehicles(brand, model, year, user_id)")
          .eq("vehicles.user_id", user.id)
          .order("created_at", { ascending: false }),
        supabase
          .from("chats")
          .select("id, buyer_id, seller_id, created_at, vehicles(brand, model, year)")
          .or(`buyer_id.eq.${user.id},seller_id.eq.${user.id}`)
          .order("created_at", { ascending: false }),
      ]);

      setInquiries((inqData ?? []) as Inquiry[]);
      setChats((chatData ?? []) as Chat[]);
      setLoading(false);

      await supabase
        .from("notifications")
        .update({ read: true })
        .eq("user_id", user.id)
        .eq("read", false);
    });
  }, [router]);

  const tabs = [
    { key: "te_marra" as const, label: `Të marra (${inquiries.length})` },
    { key: "chatet" as const, label: `Chat (${chats.length})` },
  ];

  return (
    <div className="p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Mesazhet</h1>
        <p className="text-gray-500 text-sm mt-1">Të gjitha komunikimet tua</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-gray-100 p-1 rounded-xl mb-6 w-fit">
        {tabs.map((t) => (
          <button key={t.key} onClick={() => setTab(t.key)}
            className={`px-4 py-2 text-sm font-semibold rounded-lg transition-colors ${
              tab === t.key ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"
            }`}>
            {t.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="text-gray-400 text-sm">Duke ngarkuar…</div>
      ) : tab === "te_marra" ? (
        inquiries.length === 0 ? (
          <div className="py-20 text-center bg-white border border-gray-100 rounded-2xl shadow-sm">
            <p className="text-4xl mb-3">✉️</p>
            <p className="text-gray-400 text-sm">Nuk ke mesazhe ende.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {inquiries.map((inq) => (
              <div key={inq.id} className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-700 font-bold text-sm shrink-0">
                      {inq.name[0]?.toUpperCase()}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900 text-sm">{inq.name}</p>
                      {inq.phone && (
                        <a href={`tel:${inq.phone.replaceAll(" ", "")}`} className="text-xs text-green-600 hover:underline">
                          {inq.phone}
                        </a>
                      )}
                    </div>
                  </div>
                  <span className="text-xs text-gray-400 shrink-0">{timeAgo(inq.created_at)}</span>
                </div>

                {inq.vehicles?.[0] && (
                  <div className="mt-3 bg-gray-50 rounded-xl px-3 py-2 text-xs text-gray-500">
                    🚗 {inq.vehicles[0].brand} {inq.vehicles[0].model} {inq.vehicles[0].year}
                  </div>
                )}

                {inq.message && (
                  <p className="mt-3 text-sm text-gray-700 bg-blue-50 rounded-xl px-4 py-3">{inq.message}</p>
                )}

                {inq.phone && (
                  <div className="mt-3 flex gap-2">
                    <a href={`tel:${inq.phone.replaceAll(" ", "")}`}
                      className="text-xs bg-green-50 text-green-700 hover:bg-green-100 font-semibold px-3 py-1.5 rounded-lg transition-colors">
                      📞 Telefono
                    </a>
                    <a href={`https://wa.me/${inq.phone.replaceAll(" ", "").replaceAll("+", "")}`} target="_blank" rel="noopener noreferrer"
                      className="text-xs bg-[#e8fdf0] text-[#25D366] hover:bg-[#d0f8e0] font-semibold px-3 py-1.5 rounded-lg transition-colors">
                      WhatsApp
                    </a>
                  </div>
                )}
              </div>
            ))}
          </div>
        )
      ) : (
        chats.length === 0 ? (
          <div className="py-20 text-center bg-white border border-gray-100 rounded-2xl shadow-sm">
            <p className="text-4xl mb-3">💬</p>
            <p className="text-gray-400 text-sm">Nuk ke biseda ende.</p>
            <p className="text-gray-300 text-xs mt-1">Kliko "Chat" te ndonjë makinë për të filluar.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {chats.map((chat) => {
              const veh = chat.vehicles?.[0];
              const isBuyer = chat.buyer_id === userId;
              return (
                <Link key={chat.id} href={`/profili/chat/${chat.id}`}
                  className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm hover:border-green-200 hover:shadow-md transition-all flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 font-bold text-sm shrink-0">
                    💬
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-900 text-sm">
                      {veh ? `${veh.brand} ${veh.model} ${veh.year}` : "Mjet"}
                    </p>
                    <p className="text-xs text-gray-400 mt-0.5">
                      {isBuyer ? "Ti kontaktove shitësin" : "Blerësi të kontaktoi"}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-xs text-gray-400">{timeAgo(chat.created_at)}</span>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-gray-300">
                      <path d="M9 18l6-6-6-6" />
                    </svg>
                  </div>
                </Link>
              );
            })}
          </div>
        )
      )}
    </div>
  );
}
