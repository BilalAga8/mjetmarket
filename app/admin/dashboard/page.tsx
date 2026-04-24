import { createClient } from "@/lib/supabase-server";
import Image from "next/image";

export const revalidate = 0;

export default async function Dashboard() {
  const supabase = await createClient();

  const [
    { count: vehicleCount },
    { count: shopCount },
    { count: serviceCount },
    { count: userCount },
    { count: messageCount },
    { count: chatCount },
    { data: recentVehicles },
  ] = await Promise.all([
    supabase.from("vehicles").select("*", { count: "exact", head: true }),
    supabase.from("shops").select("*", { count: "exact", head: true }),
    supabase.from("services").select("*", { count: "exact", head: true }),
    supabase.from("profiles").select("*", { count: "exact", head: true }),
    supabase.from("vehicle_inquiries").select("*", { count: "exact", head: true }),
    supabase.from("chats").select("*", { count: "exact", head: true }),
    supabase.from("vehicles").select("id, brand, model, year, price, images, category").order("created_at", { ascending: false }).limit(5),
  ]);

  const stats = [
    { label: "Mjete Totale",     value: vehicleCount ?? 0, icon: "🚗", color: "bg-blue-500/10 text-blue-400" },
    { label: "Dyqane Pjesësh",   value: shopCount ?? 0,    icon: "🔧", color: "bg-green-500/10 text-green-400" },
    { label: "Servise Partnere", value: serviceCount ?? 0, icon: "⚡", color: "bg-purple-500/10 text-purple-400" },
    { label: "Përdorues",        value: userCount ?? 0,    icon: "👤", color: "bg-orange-500/10 text-orange-400" },
    { label: "Mesazhe",          value: messageCount ?? 0, icon: "✉️", color: "bg-cyan-500/10 text-cyan-400" },
    { label: "Biseda Chat",      value: chatCount ?? 0,    icon: "💬", color: "bg-pink-500/10 text-pink-400" },
  ];

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">Dashboard</h1>
        <p className="text-gray-500 text-sm mt-1">Statistika reale nga DB</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-10">
        {stats.map((s) => (
          <div key={s.label} className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
            <div className={`w-10 h-10 rounded-xl ${s.color} flex items-center justify-center text-lg mb-3`}>
              {s.icon}
            </div>
            <p className="text-2xl font-extrabold text-white">{s.value}</p>
            <p className="text-xs text-gray-500 mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-base font-bold text-white">Mjetet e Fundit</h2>
          <a href="/admin/mjetet" className="text-xs text-green-400 hover:underline">Shiko të gjitha →</a>
        </div>
        <div className="flex flex-col gap-2">
          {(recentVehicles ?? []).map((v) => (
            <div key={v.id} className="flex items-center gap-4 py-2 border-b border-gray-800 last:border-0">
              <div className="w-12 h-8 rounded-lg overflow-hidden bg-gray-800 shrink-0 relative">
                {v.images?.[0] ? (
                  <Image src={v.images[0]} alt={v.model} fill sizes="48px" className="object-cover" />
                ) : (
                  <span className="flex items-center justify-center h-full text-xs text-gray-500">🚗</span>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-white truncate">{v.brand} {v.model}</p>
                <p className="text-xs text-gray-500">{v.category} · {v.year}</p>
              </div>
              <p className="text-sm font-bold text-green-400 shrink-0">{v.price?.toLocaleString()} €</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
