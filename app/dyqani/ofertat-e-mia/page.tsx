"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase-browser";

const supabase = createClient();

type OfferStatus = "pritje" | "zgjedhur" | "refuzuar";

interface MyOffer {
  id: string;
  price: number;
  delivery_days: number;
  notes: string | null;
  status: OfferStatus;
  created_at: string;
  part_requests: {
    vehicle_make: string; vehicle_model: string; vehicle_year: string;
    part_description: string; phone: string;
  } | null;
}

const STATUS_BADGE: Record<OfferStatus, { label: string; cls: string }> = {
  pritje:   { label: "Në Pritje", cls: "bg-yellow-500/15 text-yellow-600 border-yellow-300" },
  zgjedhur: { label: "✓ Zgjedhur", cls: "bg-green-500/15 text-green-700 border-green-300" },
  refuzuar: { label: "Refuzuar",  cls: "bg-gray-100 text-gray-500 border-gray-200" },
};

const DELIVERY_LABEL = (d: number) => d === 0 ? "Sot" : d <= 2 ? "1-2 ditë" : "3-5 ditë";

export default function OffertatEMia() {
  const [offers, setOffers]       = useState<MyOffer[]>([]);
  const [filter, setFilter]       = useState<OfferStatus | "te-gjitha">("te-gjitha");
  const [loading, setLoading]     = useState(true);

  useEffect(() => {
    supabase.auth.getUser().then(async ({ data: { user } }) => {
      if (!user) return;
      const { data } = await supabase
        .from("shop_offers")
        .select("*, part_requests(vehicle_make, vehicle_model, vehicle_year, part_description, phone)")
        .eq("shop_id", user.id)
        .order("created_at", { ascending: false });
      setOffers((data ?? []) as MyOffer[]);
      setLoading(false);
    });
  }, []);

  const filtered = filter === "te-gjitha" ? offers : offers.filter((o) => o.status === filter);

  if (loading) return <div className="p-8 text-gray-400 text-sm text-center">Duke ngarkuar...</div>;

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-lg font-extrabold text-gray-900 mb-6">Ofertat e Mia</h1>

      {/* Filters */}
      <div className="flex gap-2 mb-6 flex-wrap">
        {(["te-gjitha", "pritje", "zgjedhur", "refuzuar"] as const).map((s) => (
          <button key={s} onClick={() => setFilter(s)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
              filter === s ? "bg-green-500 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}>
            {s === "te-gjitha" ? "Të gjitha" : STATUS_BADGE[s].label}
            <span className="ml-1.5 opacity-60">
              {s === "te-gjitha" ? offers.length : offers.filter((o) => o.status === s).length}
            </span>
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-16 text-gray-400 text-sm">Nuk ka oferta.</div>
      ) : (
        <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 text-gray-400 text-xs">
                <th className="text-left px-4 py-3">Kërkesa</th>
                <th className="text-left px-4 py-3">Çmimi</th>
                <th className="text-left px-4 py-3">Dorëzimi</th>
                <th className="text-left px-4 py-3">Data</th>
                <th className="text-left px-4 py-3">Statusi</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((o, i) => {
                const req = o.part_requests;
                const badge = STATUS_BADGE[o.status];
                return (
                  <tr key={o.id} className={`border-b border-gray-50 ${i === filtered.length - 1 ? "border-none" : ""}`}>
                    <td className="px-4 py-3">
                      <p className="font-semibold text-gray-900">
                        {req ? `${req.vehicle_make} ${req.vehicle_model} ${req.vehicle_year}` : "—"}
                      </p>
                      <p className="text-xs text-gray-400">{req?.part_description}</p>
                      {o.status === "zgjedhur" && req?.phone && (
                        <a href={`tel:${req.phone}`} className="text-xs text-green-600 font-semibold hover:underline">
                          📞 {req.phone}
                        </a>
                      )}
                    </td>
                    <td className="px-4 py-3 font-bold text-gray-900">{o.price}€</td>
                    <td className="px-4 py-3 text-gray-500">{DELIVERY_LABEL(o.delivery_days)}</td>
                    <td className="px-4 py-3 text-gray-400 text-xs whitespace-nowrap">
                      {new Date(o.created_at).toLocaleDateString("sq-AL")}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`text-xs font-semibold px-2.5 py-1 rounded-lg border ${badge.cls}`}>
                        {badge.label}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
