"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase-browser";

interface VehicleStat {
  id: string;
  brand: string;
  model: string;
  year: number;
  price: number;
  views: number;
}

export default function StatistikatPage() {
  const [vehicles, setVehicles] = useState<VehicleStat[]>([]);
  const [totalViews, setTotalViews] = useState(0);
  const [totalMessages, setTotalMessages] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(async ({ data: { user } }) => {
      if (!user) return;

      const [{ data: vehs }, { count: msgCount }] = await Promise.all([
        supabase
          .from("vehicles")
          .select("id, brand, model, year, price")
          .eq("user_id", user.id),
        supabase
          .from("vehicle_inquiries")
          .select("id, vehicles!inner(user_id)", { count: "exact", head: true })
          .eq("vehicles.user_id", user.id),
      ]);

      if (!vehs || vehs.length === 0) {
        setLoading(false);
        return;
      }

      const vehicleIds = vehs.map((v) => v.id);
      const { data: viewData } = await supabase
        .from("vehicle_views")
        .select("vehicle_id")
        .in("vehicle_id", vehicleIds);

      const viewCounts: Record<string, number> = {};
      (viewData ?? []).forEach((v) => {
        viewCounts[v.vehicle_id] = (viewCounts[v.vehicle_id] ?? 0) + 1;
      });

      const stats = vehs.map((v) => ({
        ...v,
        views: viewCounts[v.id] ?? 0,
      })).sort((a, b) => b.views - a.views);

      const total = Object.values(viewCounts).reduce((s, n) => s + n, 0);

      setVehicles(stats);
      setTotalViews(total);
      setTotalMessages(msgCount ?? 0);
      setLoading(false);
    });
  }, []);

  if (loading) return <div className="p-8 text-gray-400 text-sm">Duke ngarkuar…</div>;

  if (vehicles.length === 0) return (
    <div className="p-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-2">Statistikat</h1>
      <p className="text-gray-400 text-sm">Nuk ke asnjë njoftim aktiv ende.</p>
    </div>
  );

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Statistikat</h1>
        <p className="text-gray-500 text-sm mt-1">Performanca e njoftimeve tuaja</p>
      </div>

      {/* Karta kryesore */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
          <p className="text-3xl font-extrabold text-gray-900">{totalViews}</p>
          <p className="text-xs text-gray-400 mt-1">Shikime totale</p>
        </div>
        <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
          <p className="text-3xl font-extrabold text-green-600">{totalMessages}</p>
          <p className="text-xs text-gray-400 mt-1">Mesazhe të pranuara</p>
        </div>
        <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm col-span-2 lg:col-span-1">
          <p className="text-3xl font-extrabold text-blue-600">{vehicles.length}</p>
          <p className="text-xs text-gray-400 mt-1">Njoftime aktive</p>
        </div>
      </div>

      {/* Shikime sipas mjetit */}
      <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100">
          <h2 className="text-sm font-bold text-gray-900">Shikime sipas mjetit</h2>
        </div>
        <div className="flex flex-col">
          {vehicles.map((v, i) => {
            const pct = totalViews > 0 ? Math.round((v.views / totalViews) * 100) : 0;
            return (
              <div key={v.id} className="px-5 py-4 border-b border-gray-50 last:border-0">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <p className="text-sm font-semibold text-gray-900">
                      {i + 1}. {v.brand} {v.model} {v.year}
                    </p>
                    <p className="text-xs text-gray-400">{v.price.toLocaleString()} €</p>
                  </div>
                  <span className="text-sm font-bold text-gray-700">{v.views} shikime</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-1.5">
                  <div className="bg-green-500 h-1.5 rounded-full transition-all" style={{ width: `${pct}%` }} />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
