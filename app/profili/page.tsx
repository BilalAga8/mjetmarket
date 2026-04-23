"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase-browser";

interface Vehicle {
  id: string;
  brand: string;
  model: string;
  year: number;
  price: number;
  images: string[];
  city: string | null;
  created_at: string;
}

export default function ProfiliPage() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(async ({ data: { user } }) => {
      if (!user) return;
      const { data } = await supabase
        .from("vehicles")
        .select("id, brand, model, year, price, images, city, created_at")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });
      setVehicles((data ?? []) as Vehicle[]);
      setLoading(false);
    });
  }, []);

  async function deleteVehicle(id: string) {
    if (!confirm("Fshij këtë mjet nga lista?")) return;
    const supabase = createClient();
    await supabase.from("vehicles").delete().eq("id", id);
    setVehicles((p) => p.filter((v) => v.id !== id));
  }

  const stats = [
    { label: "Njoftimet Aktive", value: loading ? "…" : String(vehicles.length), icon: "🚗", color: "text-blue-600 bg-blue-50" },
    { label: "Shikime Totale",   value: "—",                                      icon: "👁️", color: "text-purple-600 bg-purple-50" },
    { label: "Kontaktime",       value: "—",                                      icon: "📞", color: "text-green-600 bg-green-50" },
    { label: "Të preferuara",    value: "—",                                      icon: "❤️", color: "text-red-500 bg-red-50" },
  ];

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Mirë se erdhe 👋</h1>
        <p className="text-gray-500 text-sm mt-1">Këtu mund të menaxhosh njoftimet dhe llogarinë tënde</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        {stats.map((s) => (
          <div key={s.label} className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
            <div className={`w-10 h-10 rounded-xl ${s.color} flex items-center justify-center text-lg mb-3`}>
              {s.icon}
            </div>
            <p className="text-2xl font-extrabold text-gray-900">{s.value}</p>
            <p className="text-xs text-gray-400 mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Njoftimet e mia */}
      <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm mb-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-base font-bold text-gray-900">Njoftimet e Mia</h2>
          <Link
            href="/profili/shto-mjet"
            className="text-sm bg-green-500 hover:bg-green-600 text-white font-semibold px-4 py-2 rounded-xl transition-colors"
          >
            + Shto Mjet
          </Link>
        </div>

        {loading ? (
          <p className="text-sm text-gray-400 py-6 text-center">Duke ngarkuar…</p>
        ) : vehicles.length === 0 ? (
          <div className="py-10 text-center">
            <p className="text-gray-400 text-sm mb-3">Nuk ke asnjë njoftim aktiv.</p>
            <Link href="/profili/shto-mjet" className="text-sm text-green-600 font-semibold hover:underline">
              + Posto makinën tënde tani
            </Link>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {vehicles.map((v) => (
              <div key={v.id} className="flex items-center gap-4 p-3 border border-gray-100 rounded-xl hover:bg-gray-50 transition-colors">
                {v.images?.[0] ? (
                  <img src={v.images[0]} alt={`${v.brand} ${v.model}`} className="w-20 h-14 rounded-xl object-cover shrink-0" />
                ) : (
                  <div className="w-20 h-14 rounded-xl bg-gray-100 flex items-center justify-center text-gray-400 text-2xl shrink-0">🚗</div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-gray-900 text-sm">{v.brand} {v.model} {v.year}</p>
                  <p className="text-green-600 font-bold text-sm">{v.price.toLocaleString()} €</p>
                  <p className="text-xs text-gray-400 mt-0.5">{v.city ?? "—"}</p>
                </div>
                <div className="flex flex-col items-end gap-2 shrink-0">
                  <span className="text-xs bg-green-100 text-green-700 font-semibold px-2 py-0.5 rounded-full">
                    Aktiv
                  </span>
                  <div className="flex gap-2 text-xs">
                    <Link href={`/makina/${v.id}`} className="text-blue-500 hover:underline">Shiko</Link>
                    <button onClick={() => deleteVehicle(v.id)} className="text-red-400 hover:underline">Fshij</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Paketa Sponsorizimi */}
      <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm mb-6">
        <div className="mb-5">
          <h2 className="text-base font-bold text-gray-900">Paketa Sponsorizimi</h2>
          <p className="text-xs text-gray-400 mt-0.5">Rrit dukshmërinë e njoftimeve tuaja</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="border-2 border-blue-200 rounded-2xl p-5 flex flex-col">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-2xl">⚡</span>
              <div>
                <p className="font-bold text-gray-900 text-sm">Boost</p>
                <p className="text-xs text-blue-600 font-semibold">2€ / ditë</p>
              </div>
            </div>
            <ul className="flex flex-col gap-1.5 text-xs text-gray-600 mb-5 flex-1">
              <li className="flex items-center gap-1.5"><span className="text-green-500">✓</span> Del i pari në rezultate</li>
              <li className="flex items-center gap-1.5"><span className="text-green-500">✓</span> Ripertëritje çdo ditë</li>
              <li className="flex items-center gap-1.5"><span className="text-green-500">✓</span> Ti zgjedh sa ditë</li>
            </ul>
            <button className="w-full border-2 border-blue-300 text-blue-600 hover:bg-blue-50 font-semibold py-2 rounded-xl text-sm transition-colors">Aktivizo</button>
          </div>

          <div className="border-2 border-orange-200 rounded-2xl p-5 flex flex-col">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-2xl">🥉</span>
              <div>
                <p className="font-bold text-gray-900 text-sm">Bronze</p>
                <p className="text-xs text-orange-600 font-semibold">5€ / muaj</p>
              </div>
            </div>
            <ul className="flex flex-col gap-1.5 text-xs text-gray-600 mb-5 flex-1">
              <li className="flex items-center gap-1.5"><span className="text-green-500">✓</span> Banner i vogël</li>
              <li className="flex items-center gap-1.5"><span className="text-green-500">✓</span> Pozicion fund listës</li>
              <li className="flex items-center gap-1.5 text-gray-300"><span>✗</span> Makina featured</li>
            </ul>
            <button className="w-full border-2 border-orange-300 text-orange-600 hover:bg-orange-50 font-semibold py-2 rounded-xl text-sm transition-colors">Fillo</button>
          </div>

          <div className="border-2 border-gray-300 rounded-2xl p-5 flex flex-col">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-2xl">🥈</span>
              <div>
                <p className="font-bold text-gray-900 text-sm">Silver</p>
                <p className="text-xs text-gray-500 font-semibold">15€ / muaj</p>
              </div>
            </div>
            <ul className="flex flex-col gap-1.5 text-xs text-gray-600 mb-5 flex-1">
              <li className="flex items-center gap-1.5"><span className="text-green-500">✓</span> Banner mesatar</li>
              <li className="flex items-center gap-1.5"><span className="text-green-500">✓</span> Pozicion mes listës</li>
              <li className="flex items-center gap-1.5"><span className="text-green-500">✓</span> 3 makina featured / muaj</li>
            </ul>
            <button className="w-full border-2 border-gray-300 text-gray-600 hover:bg-gray-50 font-semibold py-2 rounded-xl text-sm transition-colors">Fillo</button>
          </div>

          <div className="border-2 border-yellow-400 rounded-2xl p-5 flex flex-col relative overflow-hidden bg-yellow-50">
            <div className="absolute top-3 right-3 bg-yellow-400 text-yellow-900 text-xs font-bold px-2 py-0.5 rounded-full">Popullar</div>
            <div className="flex items-center gap-2 mb-3">
              <span className="text-2xl">🥇</span>
              <div>
                <p className="font-bold text-gray-900 text-sm">Gold</p>
                <p className="text-xs text-yellow-600 font-semibold">30€ / muaj</p>
              </div>
            </div>
            <ul className="flex flex-col gap-1.5 text-xs text-gray-600 mb-5 flex-1">
              <li className="flex items-center gap-1.5"><span className="text-green-500">✓</span> Banner i madh</li>
              <li className="flex items-center gap-1.5"><span className="text-green-500">✓</span> Pozicion krye listës</li>
              <li className="flex items-center gap-1.5"><span className="text-green-500">✓</span> 10 makina featured / muaj</li>
            </ul>
            <button className="w-full bg-yellow-400 hover:bg-yellow-500 text-yellow-900 font-bold py-2 rounded-xl text-sm transition-colors">Fillo</button>
          </div>
        </div>
      </div>

      {/* Veprime të shpejta */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Link href="/profili/shto-mjet" className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm hover:border-green-300 transition-colors text-center group">
          <div className="text-3xl mb-2">➕</div>
          <p className="font-semibold text-gray-900 text-sm group-hover:text-green-600">Shto Mjet të Ri</p>
          <p className="text-xs text-gray-400 mt-1">Publiko njoftimin tënd</p>
        </Link>
        <Link href="/profili/statistikat" className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm hover:border-green-300 transition-colors text-center group">
          <div className="text-3xl mb-2">📈</div>
          <p className="font-semibold text-gray-900 text-sm group-hover:text-green-600">Shiko Statistikat</p>
          <p className="text-xs text-gray-400 mt-1">Shikime dhe kontaktime</p>
        </Link>
        <Link href="/profili/cilesimet" className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm hover:border-green-300 transition-colors text-center group">
          <div className="text-3xl mb-2">⚙️</div>
          <p className="font-semibold text-gray-900 text-sm group-hover:text-green-600">Cilësimet</p>
          <p className="text-xs text-gray-400 mt-1">Ndrysho profilin tënd</p>
        </Link>
      </div>
    </div>
  );
}
