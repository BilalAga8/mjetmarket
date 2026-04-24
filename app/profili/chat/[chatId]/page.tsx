"use client";

import { useEffect, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase-browser";
import Link from "next/link";

interface Message {
  id: string;
  body: string;
  sender_id: string;
  created_at: string;
  read: boolean;
}

interface ChatInfo {
  vehicle_id: string;
  buyer_id: string;
  seller_id: string;
  vehicles: { brand: string; model: string; year: number }[] | null;
}

export default function ChatPage() {
  const { chatId } = useParams<{ chatId: string }>();
  const router = useRouter();
  const [messages, setMessages] = useState<Message[]>([]);
  const [chat, setChat] = useState<ChatInfo | null>(null);
  const [userId, setUserId] = useState<string>("");
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const supabase = createClient();

    supabase.auth.getUser().then(async ({ data: { user } }) => {
      if (!user) { router.replace("/login"); return; }
      setUserId(user.id);

      const { data: chatData } = await supabase
        .from("chats")
        .select("vehicle_id, buyer_id, seller_id, vehicles(brand, model, year)")
        .eq("id", chatId)
        .single();

      if (!chatData) { router.replace("/profili/mesazhet"); return; }
      setChat(chatData as ChatInfo);

      const { data: msgs } = await supabase
        .from("chat_messages")
        .select("*")
        .eq("chat_id", chatId)
        .order("created_at", { ascending: true });

      setMessages((msgs ?? []) as Message[]);

      await supabase
        .from("chat_messages")
        .update({ read: true })
        .eq("chat_id", chatId)
        .neq("sender_id", user.id);

      const channel = supabase
        .channel(`chat-${chatId}`)
        .on("postgres_changes", {
          event: "INSERT",
          schema: "public",
          table: "chat_messages",
          filter: `chat_id=eq.${chatId}`,
        }, (payload) => {
          setMessages((prev) => [...prev, payload.new as Message]);
        })
        .subscribe();

      return () => { supabase.removeChannel(channel); };
    });
  }, [chatId, router]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function sendMessage(e: React.FormEvent) {
    e.preventDefault();
    if (!input.trim() || !chat) return;
    setSending(true);
    const supabase = createClient();
    await supabase.from("chat_messages").insert({
      chat_id: chatId,
      sender_id: userId,
      body: input.trim(),
    });
    setInput("");
    setSending(false);
  }

  const veh = chat?.vehicles?.[0];

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-3 flex items-center gap-3 shrink-0">
        <Link href="/profili/mesazhet" className="text-gray-400 hover:text-green-600 text-sm">←</Link>
        <div>
          <p className="text-sm font-bold text-gray-900">
            {veh ? `${veh.brand} ${veh.model} ${veh.year}` : "Chat"}
          </p>
          <p className="text-xs text-gray-400">
            {chat && userId === chat.buyer_id ? "Flet me shitësin" : "Flet me blerësin"}
          </p>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 flex flex-col gap-2">
        {messages.length === 0 && (
          <p className="text-center text-gray-400 text-sm mt-10">Asnjë mesazh ende. Fillo bisedën!</p>
        )}
        {messages.map((msg) => {
          const mine = msg.sender_id === userId;
          return (
            <div key={msg.id} className={`flex ${mine ? "justify-end" : "justify-start"}`}>
              <div className={`max-w-[75%] px-4 py-2.5 rounded-2xl text-sm ${
                mine ? "bg-green-500 text-white rounded-br-sm" : "bg-white border border-gray-200 text-gray-800 rounded-bl-sm"
              }`}>
                {msg.body}
                <span className={`text-xs block mt-0.5 ${mine ? "text-green-100" : "text-gray-400"}`}>
                  {new Date(msg.created_at).toLocaleTimeString("sq-AL", { hour: "2-digit", minute: "2-digit" })}
                </span>
              </div>
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <form onSubmit={sendMessage} className="bg-white border-t border-gray-200 px-4 py-3 flex gap-2 shrink-0">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Shkruaj një mesazh…"
          className="flex-1 border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-green-500"
          disabled={sending}
        />
        <button type="submit" disabled={sending || !input.trim()}
          className="bg-green-500 hover:bg-green-600 disabled:opacity-50 text-white font-semibold px-4 py-2.5 rounded-xl transition-colors text-sm">
          Dërgo
        </button>
      </form>
    </div>
  );
}
