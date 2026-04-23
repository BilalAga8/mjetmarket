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

function daysSince(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  return Math.floor(diff / (1000 * 60 * 60 * 24));
}

export default function NjoftiметPage() {
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
    if (!confirm("Fshij këtë njoftim?")) return;
    const supabase = createClient();
    await supabase.from("vehicles").delete().eq("id", id);
    setVehicles((p) => p.filter((v) => v.id !== id));
  }

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Njoftimet e Mia</h1>
          <p className="text-gray-500 text-sm mt-1">
            {loading ? "Duke ngarkuar…" : `${vehicles.length} njoftime aktive`}
          </p>
        </div>
        <Link
          href="/profili/shto-mjet"
          className="bg-green-500 hover:bg-green-600 text-white text-sm font-semibold px-4 py-2.5 rounded-xl transition-colors"
        >
          + Shto Mjet
        </Link>
      </div>

      {loading ? (
        <div className="py-20 text-center text-gray-400 text-sm">Duke ngarkuar…</div>
      ) : vehicles.length === 0 ? (
        <div className="py-20 text-center bg-white border border-gray-100 rounded-2xl shadow-sm">
          <p className="text-gray-400 text-sm mb-3">Nuk ke asnjë njoftim aktiv.</p>
          <Link href="/profili/shto-mjet" className="text-sm text-green-600 font-semibold hover:underline">
            + Posto makinën tënde tani
          </Link>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {vehicles.map((v) => (
            <div key={v.id} className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm flex items-center gap-5">
              {v.images?.[0] ? (
                <img src={v.images[0]} alt={`${v.brand} ${v.model}`} className="w-28 h-20 rounded-xl object-cover shrink-0" />
              ) : (
                <div className="w-28 h-20 rounded-xl bg-gray-100 flex items-center justify-center text-3xl shrink-0">🚗</div>
              )}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <p className="font-bold text-gray-900">{v.brand} {v.model} {v.year}</p>
                  <span className="text-xs bg-green-100 text-green-700 font-semibold px-2 py-0.5 rounded-full">Aktiv</span>
                </div>
                <p className="text-green-600 font-extrabold text-lg">{v.price.toLocaleString()} €</p>
                <div className="flex items-center gap-4 mt-2 text-xs text-gray-400 flex-wrap">
                  {v.city && <span>📍 {v.city}</span>}
                  <span>📅 Publikuar {daysSince(v.created_at)} ditë më parë</span>
                </div>
              </div>
              <div className="flex flex-col gap-2 shrink-0">
                <Link
                  href={`/profili/edito-mjet/${v.id}`}
                  className="text-sm bg-blue-50 text-blue-600 hover:bg-blue-100 font-semibold px-4 py-2 rounded-xl transition-colors text-center"
                >
                  Edito
                </Link>
                <Link
                  href={`/makina/${v.id}`}
                  className="text-sm bg-gray-50 text-gray-600 hover:bg-gray-100 font-semibold px-4 py-2 rounded-xl transition-colors text-center"
                >
                  Shiko
                </Link>
                <button
                  onClick={() => deleteVehicle(v.id)}
                  className="text-sm bg-red-50 text-red-500 hover:bg-red-100 font-semibold px-4 py-2 rounded-xl transition-colors"
                >
                  Fshij
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
