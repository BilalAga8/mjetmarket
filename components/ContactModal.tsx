"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase-browser";

interface Props {
  brand: string;
  model: string;
  phone?: string;
  vehicleId?: string;
}

export default function ContactButtons({ brand, model, phone = "+355 69 123 4567", vehicleId }: Readonly<Props>) {
  const [mode, setMode] = useState<"idle" | "call" | "message">("idle");
  const [form, setForm] = useState({ name: "", phone: "", message: "" });
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const router = useRouter();

  async function openChat() {
    if (!vehicleId) return;
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { router.push("/login"); return; }

    const { data: vehicle } = await supabase
      .from("vehicles").select("user_id").eq("id", vehicleId).single();
    if (!vehicle) return;

    const { data: existing } = await supabase
      .from("chats").select("id").eq("vehicle_id", vehicleId).eq("buyer_id", user.id).single();

    if (existing) { router.push(`/profili/chat/${existing.id}`); return; }

    const { data: newChat } = await supabase
      .from("chats").insert({ vehicle_id: vehicleId, buyer_id: user.id, seller_id: vehicle.user_id }).select("id").single();

    if (newChat) router.push(`/profili/chat/${newChat.id}`);
  }

  function close() {
    setMode("idle");
    setSent(false);
    setForm({ name: "", phone: "", message: "" });
  }

  async function handleSend(e: React.FormEvent) {
    e.preventDefault();
    if (!vehicleId || !form.name.trim()) return;
    setSending(true);
    const supabase = createClient();
    await supabase.from("vehicle_inquiries").insert({
      vehicle_id: vehicleId,
      name: form.name.trim(),
      phone: form.phone.trim() || null,
      message: form.message.trim() || null,
    });
    setSending(false);
    setSent(true);
  }

  const inputClass = "w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-green-500";

  return (
    <>
      <div className="flex gap-3">
        <button
          onClick={() => setMode("call")}
          className="flex-1 bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-xl transition-colors duration-200 text-sm"
        >
          Kontakto
        </button>
        <button
          onClick={() => setMode("message")}
          className="flex-1 border-2 border-green-600 text-green-600 hover:bg-green-50 font-semibold py-3 rounded-xl transition-colors duration-200 text-sm"
        >
          Mesazh
        </button>
        {vehicleId && (
          <button
            onClick={openChat}
            className="flex-1 border-2 border-purple-500 text-purple-600 hover:bg-purple-50 font-semibold py-3 rounded-xl transition-colors duration-200 text-sm"
          >
            Chat
          </button>
        )}
        <button
          onClick={() => document.getElementById("kalkulator")?.scrollIntoView({ behavior: "smooth" })}
          title="Kalkulator Kredie"
          className="shrink-0 w-12 border-2 border-orange-400 hover:border-orange-500 text-orange-400 hover:text-orange-500 rounded-xl transition-colors duration-200 flex items-center justify-center"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="4" y="2" width="16" height="20" rx="2" />
            <line x1="8" y1="6" x2="16" y2="6" />
            <line x1="8" y1="10" x2="10" y2="10" />
            <line x1="14" y1="10" x2="16" y2="10" />
            <line x1="8" y1="14" x2="10" y2="14" />
            <line x1="14" y1="14" x2="16" y2="14" />
            <line x1="8" y1="18" x2="10" y2="18" />
            <line x1="14" y1="18" x2="16" y2="18" />
          </svg>
        </button>
      </div>

      {mode !== "idle" && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4" onClick={close}>
          <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-sm" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-bold text-gray-900">
                {mode === "call" ? "Kontakto Shitësin" : "Dërgo Mesazh"}
              </h2>
              <button onClick={close} className="w-8 h-8 rounded-xl bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-500 transition-colors">✕</button>
            </div>

            <div className="bg-gray-50 rounded-xl p-4 mb-5">
              <p className="text-xs text-gray-400 mb-0.5">Mjeti</p>
              <p className="font-semibold text-gray-900">{brand} {model}</p>
            </div>

            {mode === "call" ? (
              <div className="flex flex-col gap-3">
                <a href={`tel:${phone.replace(/\s/g, "")}`}
                  className="flex items-center gap-3 bg-green-500 hover:bg-green-600 text-white font-semibold px-5 py-3.5 rounded-xl transition-colors">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.64 3.45 2 2 0 0 1 3.6 1.27h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L7.91 9a16 16 0 0 0 6 6l1.06-1.06a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 21.73 16z" />
                  </svg>
                  <span>{phone}</span>
                </a>
                <a href={`https://wa.me/${phone.replace(/[\s+]/g, "")}`} target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-3 bg-[#25D366] hover:bg-[#20ba58] text-white font-semibold px-5 py-3.5 rounded-xl transition-colors">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
                    <path d="M12 0C5.373 0 0 5.373 0 12c0 2.123.555 4.116 1.528 5.849L.057 23.5l5.798-1.522A11.95 11.95 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.898 0-3.677-.52-5.2-1.426L3.5 21.5l.95-3.2A9.96 9.96 0 0 1 2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z" />
                  </svg>
                  <span>WhatsApp</span>
                </a>
                <p className="text-xs text-gray-400 text-center mt-2">Kontakto direkt me shitësin</p>
              </div>
            ) : sent ? (
              <div className="text-center py-4">
                <div className="text-4xl mb-3">✅</div>
                <p className="font-semibold text-gray-900 mb-1">Mesazhi u dërgua!</p>
                <p className="text-sm text-gray-400">Shitësi do të njoftohet dhe do të kontaktojë së shpejti.</p>
                <button onClick={close} className="mt-4 text-sm text-green-600 font-semibold hover:underline">Mbyll</button>
              </div>
            ) : (
              <form onSubmit={handleSend} className="flex flex-col gap-3">
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1 block">Emri juaj *</label>
                  <input required value={form.name} onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
                    placeholder="Emri Mbiemri" className={inputClass} />
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1 block">Telefoni</label>
                  <input type="tel" value={form.phone} onChange={(e) => setForm((p) => ({ ...p, phone: e.target.value }))}
                    placeholder="+355 69 000 0000" className={inputClass} />
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1 block">Mesazhi</label>
                  <textarea value={form.message} onChange={(e) => setForm((p) => ({ ...p, message: e.target.value }))}
                    placeholder="Kam interes për këtë mjet..." rows={3}
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-green-500 resize-none" />
                </div>
                <button type="submit" disabled={sending || !form.name.trim()}
                  className="w-full bg-green-500 hover:bg-green-600 disabled:opacity-60 text-white font-semibold py-3 rounded-xl transition-colors text-sm">
                  {sending ? "Duke dërguar…" : "Dërgo Mesazhin"}
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  );
}
