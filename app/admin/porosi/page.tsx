"use client";

import { useEffect, useState, useTransition } from "react";
import { createClient } from "@/lib/supabase-browser";

const supabase = createClient();

type Status = "pritje" | "konfirmuar" | "anuluar";

type Order = {
  id: string;
  product_name: string;
  product_price_from: number | null;
  product_price_to: number | null;
  vehicle_make: string | null;
  vehicle_model: string | null;
  vehicle_year: string | null;
  full_name: string;
  phone: string;
  notes: string | null;
  status: Status;
  created_at: string;
};

const statusCfg: Record<Status, { label: string; cls: string }> = {
  pritje:      { label: "Në Pritje",   cls: "bg-yellow-500/15 text-yellow-400" },
  konfirmuar:  { label: "Konfirmuar",  cls: "bg-green-500/15 text-green-400" },
  anuluar:     { label: "Anuluar",     cls: "bg-red-500/15 text-red-400" },
};

function priceLabel(from: number | null, to: number | null) {
  if (from && to) return `${from} – ${to}€`;
  if (from) return `${from}€`;
  if (to) return `${to}€`;
  return "Çmim me kërkesë";
}

function whatsappUrl(phone: string, order: Order) {
  const vehicle = [order.vehicle_year, order.vehicle_make, order.vehicle_model].filter(Boolean).join(" ");
  const price = priceLabel(order.product_price_from, order.product_price_to);
  const msg = `Përshëndetje ${order.full_name}! 👋\n\nKemi konfirmuar porosinë tuaj për:\n🔧 *${order.product_name}*\n💰 Çmimi: ${price}${vehicle ? `\n🚗 Mjeti: ${vehicle}` : ""}\n\nDo ju kontaktojmë së shpejti me detajet e dërgimit. Faleminderit!`;
  const clean = phone.replace(/\s/g, "");
  return `https://wa.me/${clean.startsWith("+") ? clean.slice(1) : clean}?text=${encodeURIComponent(msg)}`;
}

export default function AdminPorosi() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<Status | "te_gjitha">("te_gjitha");
  const [, startTransition] = useTransition();

  useEffect(() => {
    supabase
      .from("product_orders")
      .select("*")
      .order("created_at", { ascending: false })
      .then(({ data }) => { setOrders(data ?? []); setLoading(false); });
  }, []);

  function updateStatus(id: string, status: Status) {
    startTransition(async () => {
      await supabase.from("product_orders").update({ status }).eq("id", id);
      setOrders(prev => prev.map(o => o.id === id ? { ...o, status } : o));
    });
  }

  const filtered = filter === "te_gjitha" ? orders : orders.filter(o => o.status === filter);
  const counts = {
    te_gjitha: orders.length,
    pritje: orders.filter(o => o.status === "pritje").length,
    konfirmuar: orders.filter(o => o.status === "konfirmuar").length,
    anuluar: orders.filter(o => o.status === "anuluar").length,
  };

  if (loading) return <div className="p-8 text-gray-500 text-sm">Duke ngarkuar...</div>;

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">Porositë</h1>
        <p className="text-gray-500 text-sm mt-1">{orders.length} porosi gjithsej</p>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2 mb-6 flex-wrap">
        {([["te_gjitha", "Të gjitha"], ["pritje", "Në Pritje"], ["konfirmuar", "Konfirmuara"], ["anuluar", "Anuluara"]] as const).map(([val, label]) => (
          <button
            key={val}
            onClick={() => setFilter(val)}
            className={`text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors ${
              filter === val ? "bg-green-500 text-white" : "bg-gray-800 text-gray-400 hover:bg-gray-700"
            }`}
          >
            {label} ({counts[val]})
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-16 text-gray-600 text-sm">
          Nuk ka porosi {filter !== "te_gjitha" ? `me status "${statusCfg[filter as Status]?.label}"` : ""}.
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {filtered.map((order) => (
            <div key={order.id} className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
              <div className="flex items-start justify-between gap-4 flex-wrap">
                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <span className="font-bold text-white text-sm">{order.product_name}</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${statusCfg[order.status].cls}`}>
                      {statusCfg[order.status].label}
                    </span>
                  </div>

                  <p className="text-green-400 font-bold text-base mb-2">
                    {priceLabel(order.product_price_from, order.product_price_to)}
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1 text-xs text-gray-400">
                    <span>👤 <span className="text-gray-200">{order.full_name}</span></span>
                    <span>📱 <span className="text-gray-200 font-mono">{order.phone}</span></span>
                    {(order.vehicle_make || order.vehicle_model) && (
                      <span>🚗 <span className="text-gray-200">{[order.vehicle_year, order.vehicle_make, order.vehicle_model].filter(Boolean).join(" ")}</span></span>
                    )}
                    <span>🕐 <span className="text-gray-200">{new Date(order.created_at).toLocaleString("sq-AL")}</span></span>
                  </div>

                  {order.notes && (
                    <p className="mt-2 text-xs text-gray-500 italic">&quot;{order.notes}&quot;</p>
                  )}
                </div>

                {/* Actions */}
                <div className="flex flex-col gap-2 shrink-0">
                  {/* WhatsApp */}
                  <a
                    href={whatsappUrl(order.phone, order)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 bg-[#25D366] text-white text-xs font-bold px-4 py-2 rounded-xl hover:bg-[#1ebe5d] transition-colors"
                  >
                    <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 fill-white shrink-0">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
                      <path d="M12 0C5.373 0 0 5.373 0 12c0 2.123.554 4.116 1.528 5.845L.057 23.18a.75.75 0 0 0 .915.915l5.335-1.471A11.94 11.94 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22.5A10.44 10.44 0 0 1 6.31 20.9l-.38-.225-3.934 1.085 1.085-3.934-.225-.38A10.44 10.44 0 0 1 1.5 12C1.5 6.201 6.201 1.5 12 1.5S22.5 6.201 22.5 12 17.799 22.5 12 22.5z"/>
                    </svg>
                    WhatsApp
                  </a>

                  {/* Status actions */}
                  {order.status === "pritje" && (
                    <div className="flex gap-2">
                      <button
                        onClick={() => updateStatus(order.id, "konfirmuar")}
                        className="flex-1 bg-green-500/10 text-green-400 hover:bg-green-500/20 text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors"
                      >
                        ✓ Konfirmo
                      </button>
                      <button
                        onClick={() => updateStatus(order.id, "anuluar")}
                        className="flex-1 bg-red-500/10 text-red-400 hover:bg-red-500/20 text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors"
                      >
                        × Anulo
                      </button>
                    </div>
                  )}
                  {order.status === "konfirmuar" && (
                    <button
                      onClick={() => updateStatus(order.id, "anuluar")}
                      className="bg-red-500/10 text-red-400 hover:bg-red-500/20 text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors"
                    >
                      × Anulo
                    </button>
                  )}
                  {order.status === "anuluar" && (
                    <button
                      onClick={() => updateStatus(order.id, "pritje")}
                      className="bg-gray-700 text-gray-300 hover:bg-gray-600 text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors"
                    >
                      ↩ Rihap
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
