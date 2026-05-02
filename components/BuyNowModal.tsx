"use client";

import { useState } from "react";
import { createClient } from "../lib/supabase-browser";

const supabase = createClient();

interface Product {
  id: string;
  name: string;
  price_from: number | null;
  price_to: number | null;
  oem_code: string | null;
  quality: string;
}

interface Props {
  product: Product;
  vehicleMake?: string;
  vehicleModel?: string;
  vehicleYear?: string;
  onClose: () => void;
}

export default function BuyNowModal({ product, vehicleMake = "", vehicleModel = "", vehicleYear = "", onClose }: Props) {
  const [step, setStep] = useState<"confirm" | "form" | "done">("confirm");
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    full_name: "",
    phone: "",
    notes: "",
  });

  const priceLabel = product.price_from && product.price_to
    ? `${product.price_from} – ${product.price_to}€`
    : product.price_from
    ? `${product.price_from}€`
    : product.price_to
    ? `${product.price_to}€`
    : "Çmim me kërkesë";

  const qualityLabel: Record<string, string> = {
    oem: "OEM — Origjinal",
    ekuivalente: "Ekuivalente",
    ekonomike: "Ekonomike",
  };

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    await supabase.from("product_orders").insert([{
      product_id:        product.id,
      product_name:      product.name,
      product_price_from: product.price_from,
      product_price_to:   product.price_to,
      vehicle_make:  vehicleMake || null,
      vehicle_model: vehicleModel || null,
      vehicle_year:  vehicleYear || null,
      full_name: form.full_name,
      phone:     form.phone,
      notes:     form.notes || null,
      status:    "pritje",
    }]);
    setLoading(false);
    setStep("done");
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">

        {/* Hapi 1 — Konfirmim produkti */}
        {step === "confirm" && (
          <div className="p-6">
            <div className="flex items-start justify-between mb-5">
              <h2 className="text-lg font-bold text-gray-900">Konfirmo Porosinë</h2>
              <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-xl leading-none">×</button>
            </div>

            <div className="bg-gray-50 rounded-xl p-4 mb-5 border border-gray-100">
              <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">Produkti</p>
              <p className="font-bold text-gray-900 text-base mb-1">{product.name}</p>
              {product.oem_code && (
                <p className="text-xs text-gray-400 font-mono mb-1">OEM: {product.oem_code}</p>
              )}
              <p className="text-xs text-gray-500 mb-2">{qualityLabel[product.quality] ?? product.quality}</p>
              <p className="text-xl font-extrabold text-green-600">{priceLabel}</p>
            </div>

            {(vehicleMake || vehicleModel) && (
              <div className="bg-green-50 border border-green-100 rounded-xl px-4 py-3 mb-5">
                <p className="text-xs text-green-600 font-semibold mb-0.5">Mjeti juaj</p>
                <p className="text-sm font-bold text-green-800">
                  {vehicleYear} {vehicleMake} {vehicleModel}
                </p>
              </div>
            )}

            <div className="flex gap-3">
              <button onClick={onClose}
                className="flex-1 border border-gray-200 text-gray-600 font-semibold px-4 py-2.5 rounded-xl text-sm hover:bg-gray-50 transition-colors">
                Anulo
              </button>
              <button onClick={() => setStep("form")}
                className="flex-1 bg-green-600 text-white font-bold px-4 py-2.5 rounded-xl text-sm hover:bg-green-700 transition-colors">
                Po, Vazhdo →
              </button>
            </div>
          </div>
        )}

        {/* Hapi 2 — Të dhënat e blerësit */}
        {step === "form" && (
          <form onSubmit={handleSubmit} className="p-6">
            <div className="flex items-center justify-between mb-5">
              <div>
                <button onClick={() => setStep("confirm")} className="text-xs text-gray-400 hover:text-gray-600 mb-1">
                  ← Kthehu
                </button>
                <h2 className="text-lg font-bold text-gray-900">Të Dhënat Tuaja</h2>
              </div>
              <button type="button" onClick={onClose} className="text-gray-400 hover:text-gray-600 text-xl leading-none">×</button>
            </div>

            <div className="text-sm text-gray-500 bg-gray-50 rounded-xl px-4 py-2.5 mb-5 font-medium">
              {product.name} · <span className="text-green-600 font-bold">{priceLabel}</span>
            </div>

            <div className="flex flex-col gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Emri i plotë *</label>
                <input
                  required
                  value={form.full_name}
                  onChange={(e) => setForm(p => ({ ...p, full_name: e.target.value }))}
                  placeholder="p.sh. Arben Krasniqi"
                  className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Numri i WhatsApp *</label>
                <input
                  required
                  value={form.phone}
                  onChange={(e) => setForm(p => ({ ...p, phone: e.target.value }))}
                  placeholder="+355 6X XXX XXXX"
                  className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500"
                />
                <p className="text-xs text-gray-400 mt-1">Do ju kontaktojmë në këtë numër.</p>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Shënime (opsionale)</label>
                <textarea
                  value={form.notes}
                  onChange={(e) => setForm(p => ({ ...p, notes: e.target.value }))}
                  rows={2}
                  placeholder="Ndonjë detaj shtesë..."
                  className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 resize-none"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-5 bg-green-600 disabled:opacity-60 text-white font-bold px-4 py-3 rounded-xl text-sm hover:bg-green-700 transition-colors"
            >
              {loading ? "Duke dërguar..." : "Konfirmo Porosinë"}
            </button>
          </form>
        )}

        {/* Hapi 3 — Sukses */}
        {step === "done" && (
          <div className="p-8 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Porosia u dërgua!</h3>
            <p className="text-sm text-gray-500 mb-6">
              Do ju kontaktojmë në <strong>{form.phone}</strong> sa më shpejt për të konfirmuar dhe finalizuar porosinë.
            </p>
            <button onClick={onClose}
              className="w-full bg-green-600 text-white font-bold px-4 py-3 rounded-xl text-sm hover:bg-green-700 transition-colors">
              Mbyll
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
