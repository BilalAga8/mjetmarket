"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase-browser";

const supabase = createClient();

interface Inquiry {
  id: string;
  name: string;
  phone: string | null;
  message: string | null;
  created_at: string;
  vehicles: { brand: string; model: string; year: number; user_id: string }[] | null;
}

function timeAgo(d: string) {
  const diff = Math.floor((Date.now() - new Date(d).getTime()) / 1000);
  if (diff < 60) return "tani";
  if (diff < 3600) return `${Math.floor(diff / 60)} min`;
  if (diff < 86400) return `${Math.floor(diff / 3600)} orë`;
  return `${Math.floor(diff / 86400)} ditë`;
}

function isAppointment(msg: string | null) {
  return msg?.startsWith("TAKIM PËR KONTROLL") ?? false;
}

export default function AdminMesazhet() {
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "messages" | "appointments">("all");

  useEffect(() => {
    supabase
      .from("vehicle_inquiries")
      .select("id, name, phone, message, created_at, vehicles(brand, model, year, user_id)")
      .order("created_at", { ascending: false })
      .then(({ data }) => {
        setInquiries((data ?? []) as Inquiry[]);
        setLoading(false);
      });
  }, []);

  async function deleteInquiry(id: string) {
    if (!confirm("Fshij këtë mesazh?")) return;
    await supabase.from("vehicle_inquiries").delete().eq("id", id);
    setInquiries((prev) => prev.filter((i) => i.id !== id));
  }

  const filtered = inquiries.filter((i) => {
    if (filter === "appointments") return isAppointment(i.message);
    if (filter === "messages") return !isAppointment(i.message);
    return true;
  });

  const appointments = inquiries.filter((i) => isAppointment(i.message)).length;
  const messages = inquiries.filter((i) => !isAppointment(i.message)).length;

  return (
    <div className="p-6 text-white">
      <div className="mb-6">
        <h1 className="text-2xl font-extrabold text-white">Mesazhet & Takimet</h1>
        <p className="text-gray-400 text-sm mt-0.5">{inquiries.length} gjithsej</p>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2 mb-6">
        {([
          { key: "all", label: `Të gjitha (${inquiries.length})` },
          { key: "messages", label: `Mesazhe (${messages})` },
          { key: "appointments", label: `Takime (${appointments})` },
        ] as const).map((tab) => (
          <button key={tab.key} onClick={() => setFilter(tab.key)}
            className={`text-sm font-semibold px-4 py-2 rounded-xl transition-colors ${
              filter === tab.key ? "bg-green-500 text-white" : "bg-gray-800 text-gray-400 hover:bg-gray-700"
            }`}>
            {tab.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="text-gray-400 text-sm">Duke ngarkuar…</div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20 text-gray-500 text-sm">Nuk ka të dhëna.</div>
      ) : (
        <div className="flex flex-col gap-3">
          {filtered.map((inq) => {
            const appointment = isAppointment(inq.message);
            const veh = inq.vehicles?.[0];
            return (
              <div key={inq.id}
                className={`bg-gray-900 border rounded-2xl p-5 ${appointment ? "border-blue-800" : "border-gray-800"}`}>
                <div className="flex items-start justify-between gap-4 mb-3">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm shrink-0 ${
                      appointment ? "bg-blue-900 text-blue-300" : "bg-green-900 text-green-300"
                    }`}>
                      {inq.name[0]?.toUpperCase()}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-semibold text-white text-sm">{inq.name}</p>
                        <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                          appointment ? "bg-blue-900 text-blue-300" : "bg-green-900 text-green-300"
                        }`}>
                          {appointment ? "📅 Takim" : "✉️ Mesazh"}
                        </span>
                      </div>
                      {inq.phone && (
                        <a href={`tel:${inq.phone.replace(/\s/g, "")}`}
                          className="text-xs text-green-400 hover:underline">{inq.phone}</a>
                      )}
                    </div>
                  </div>
                  <span className="text-xs text-gray-500 shrink-0">{timeAgo(inq.created_at)} më parë</span>
                </div>

                {veh && (
                  <div className="bg-gray-800 rounded-xl px-3 py-2 text-xs text-gray-300 mb-3">
                    🚗 {veh.brand} {veh.model} {veh.year}
                  </div>
                )}

                {inq.message && (
                  <p className={`text-sm rounded-xl px-4 py-3 mb-3 ${
                    appointment ? "bg-blue-950 text-blue-200" : "bg-gray-800 text-gray-300"
                  }`}>
                    {inq.message}
                  </p>
                )}

                <div className="flex gap-2 flex-wrap">
                  {inq.phone && (
                    <>
                      <a href={`tel:${inq.phone.replaceAll(" ", "")}`}
                        className="text-xs bg-green-900 text-green-300 hover:bg-green-800 font-semibold px-3 py-1.5 rounded-lg transition-colors">
                        📞 Telefono
                      </a>
                      <a href={`https://wa.me/${inq.phone.replaceAll(" ", "").replaceAll("+", "")}`} target="_blank" rel="noopener noreferrer"
                        className="text-xs bg-[#1a3a2a] text-[#25D366] hover:bg-[#1f4a33] font-semibold px-3 py-1.5 rounded-lg transition-colors">
                        WhatsApp
                      </a>
                    </>
                  )}
                  <button onClick={() => deleteInquiry(inq.id)}
                    className="text-xs bg-red-900 text-red-300 hover:bg-red-800 font-semibold px-3 py-1.5 rounded-lg transition-colors ml-auto">
                    Fshij
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
