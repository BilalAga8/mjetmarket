"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase-browser";
const supabase = createClient();

interface Message {
  id: string;
  full_name: string;
  phone: string;
  message: string;
  seen: boolean;
  created_at: string;
}

export default function AdminKontaktet() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [selected, setSelected] = useState<Message | null>(null);

  useEffect(() => {
    supabase
      .from("contact_messages")
      .select("*")
      .order("created_at", { ascending: false })
      .then(({ data }) => { if (data) setMessages(data as Message[]); });
  }, []);

  async function markSeen(msg: Message) {
    await supabase.from("contact_messages").update({ seen: true }).eq("id", msg.id);
    const updated = { ...msg, seen: true };
    setMessages((prev) => prev.map((m) => m.id === msg.id ? updated : m));
    setSelected(updated);
  }

  const unseen = messages.filter((m) => !m.seen).length;

  return (
    <div className="p-4 sm:p-6 text-white">
      <h1 className="text-2xl font-extrabold text-white mb-1">Mesazhet e Kontaktit</h1>
      <p className="text-gray-400 text-sm mb-6">
        {messages.length} gjithsej
        {unseen > 0 && <span className="ml-2 bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">{unseen} të reja</span>}
      </p>

      <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
        {messages.length === 0 ? (
          <div className="py-16 text-center text-gray-500 text-sm">Nuk ka mesazhe</div>
        ) : (
          <div className="divide-y divide-gray-800">
            {messages.map((msg) => (
              <div
                key={msg.id}
                onClick={() => { setSelected(msg); if (!msg.seen) markSeen(msg); }}
                className={`flex items-start gap-4 px-5 py-4 cursor-pointer hover:bg-gray-800/50 transition-colors ${!msg.seen ? "bg-green-500/5" : ""}`}
              >
                <div className="w-9 h-9 rounded-full bg-gray-700 flex items-center justify-center text-sm font-bold text-white shrink-0">
                  {msg.full_name.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-semibold text-white">{msg.full_name}</p>
                    {!msg.seen && <span className="w-2 h-2 bg-green-400 rounded-full shrink-0" />}
                  </div>
                  <p className="text-xs text-gray-400">{msg.phone}</p>
                  <p className="text-xs text-gray-500 truncate mt-0.5">{msg.message}</p>
                </div>
                <p className="text-xs text-gray-600 shrink-0">
                  {new Date(msg.created_at).toLocaleDateString("sq-AL")}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Detail modal */}
      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ backgroundColor: "rgba(0,0,0,0.7)" }} onClick={() => setSelected(null)}>
          <div className="bg-gray-900 border border-gray-700 rounded-2xl w-full max-w-md p-6" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-start justify-between mb-4">
              <div>
                <h2 className="text-lg font-extrabold text-white">{selected.full_name}</h2>
                <p className="text-sm text-gray-400">{selected.phone}</p>
              </div>
              <button onClick={() => setSelected(null)} className="text-gray-500 hover:text-white text-xl">×</button>
            </div>
            <div className="bg-gray-800 rounded-xl p-4 text-sm text-gray-300 leading-relaxed">
              {selected.message}
            </div>
            <p className="text-xs text-gray-600 mt-3">{new Date(selected.created_at).toLocaleString("sq-AL")}</p>
            <a
              href={`tel:${selected.phone}`}
              className="mt-4 w-full flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white font-semibold py-2.5 rounded-xl text-sm transition-colors"
            >
              📞 Kontakto {selected.full_name}
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
