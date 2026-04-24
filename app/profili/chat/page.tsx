"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase-browser";

interface Chat {
  id: string;
  buyer_id: string;
  seller_id: string;
  created_at: string;
  vehicles: { brand: string; model: string; year: number }[] | null;
  last_message?: string;
  unread?: number;
}

export default function ChatListPage() {
  const [chats, setChats] = useState<Chat[]>([]);
  const [userId, setUserId] = useState("");
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(async ({ data: { user } }) => {
      if (!user) { router.replace("/login"); return; }
      setUserId(user.id);

      const { data } = await supabase
        .from("chats")
        .select("id, buyer_id, seller_id, created_at, vehicles(brand, model, year)")
        .or(`buyer_id.eq.${user.id},seller_id.eq.${user.id}`)
        .order("created_at", { ascending: false });

      setChats((data ?? []) as Chat[]);
      setLoading(false);
    });
  }, [router]);

  if (loading) return <div className="p-8 text-gray-400 text-sm">Duke ngarkuar…</div>;

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Chat</h1>
        <p className="text-gray-500 text-sm mt-1">{chats.length} biseda</p>
      </div>

      {chats.length === 0 ? (
        <div className="py-20 text-center bg-white border border-gray-100 rounded-2xl shadow-sm">
          <p className="text-4xl mb-3">💬</p>
          <p className="text-gray-400 text-sm">Nuk ke biseda ende.</p>
          <p className="text-gray-300 text-xs mt-1">Kur të kontaktosh një shitës me Chat, do të shfaqet këtu.</p>
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
                    {veh ? `${veh.brand} ${veh.model} ${veh.year}` : "Mjet i panjohur"}
                  </p>
                  <p className="text-xs text-gray-400 mt-0.5">
                    {isBuyer ? "Ti (blerës)" : "Ti (shitës)"}
                  </p>
                </div>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-gray-300 shrink-0">
                  <path d="M9 18l6-6-6-6" />
                </svg>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
