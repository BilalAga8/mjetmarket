"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase-browser";

interface Stats {
  total: number;
  avgPrice: number;
  newest: string | null;
  oldest: string | null;
}

export default function StatistikatPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(async ({ data: { user } }) => {
      if (!user) return;
      const { data } = await supabase
        .from("vehicles")
        .select("price, created_at")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (!data || data.length === 0) {
        setStats({ total: 0, avgPrice: 0, newest: null, oldest: null });
        setLoading(false);
        return;
      }

      const avg = Math.round(data.reduce((s, v) => s + v.price, 0) / data.length);
      setStats({
        total: data.length,
        avgPrice: avg,
        newest: data[0].created_at,
        oldest: data[data.length - 1].created_at,
      });
      setLoading(false);
    });
  }, []);

  function formatDate(d: string) {
    return new Date(d).toLocaleDateString("sq-AL", { day: "numeric", month: "long", year: "numeric" });
  }

  if (loading) return <div className="p-8 text-gray-400 text-sm">Duke ngarkuar…</div>;

  if (!stats || stats.total === 0) return (
    <div className="p-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-2">Statistikat</h1>
      <p className="text-gray-400 text-sm">Nuk ke asnjë njoftim aktiv ende.</p>
    </div>
  );

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Statistikat</h1>
        <p className="text-gray-500 text-sm mt-1">Të dhëna reale nga njoftimet e tua</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
          <p className="text-3xl font-extrabold text-gray-900">{stats.total}</p>
          <p className="text-xs text-gray-400 mt-1">Njoftime aktive</p>
        </div>

        <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
          <p className="text-3xl font-extrabold text-green-600">{stats.avgPrice.toLocaleString()} €</p>
          <p className="text-xs text-gray-400 mt-1">Çmim mesatar</p>
        </div>

        {stats.newest && (
          <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm col-span-2 lg:col-span-1">
            <p className="text-sm font-bold text-gray-900">{formatDate(stats.newest)}</p>
            <p className="text-xs text-gray-400 mt-1">Njoftimi i fundit</p>
          </div>
        )}
      </div>

      <div className="mt-6 bg-blue-50 border border-blue-100 rounded-2xl p-5">
        <p className="text-sm text-blue-700 font-medium">
          Statistika të avancuara (shikime, kontaktime) do të shtohen së shpejti.
        </p>
      </div>
    </div>
  );
}
