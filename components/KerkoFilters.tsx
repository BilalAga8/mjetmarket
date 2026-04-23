"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useState } from "react";
import { albanianCities } from "../data/cities";

const fuels = ["Naftë", "Benzinë", "Hibrid", "Elektrik", "Gas"];
const transmissions = ["Automatik", "Manual"];
const years = Array.from({ length: 20 }, (_, i) => 2024 - i);
const priceOptions = [
  { label: "Pa limit", value: "" },
  { label: "deri 5,000 €", value: "5000" },
  { label: "deri 10,000 €", value: "10000" },
  { label: "deri 15,000 €", value: "15000" },
  { label: "deri 20,000 €", value: "20000" },
  { label: "deri 30,000 €", value: "30000" },
  { label: "deri 50,000 €", value: "50000" },
  { label: "deri 100,000 €", value: "100000" },
];
const kmOptions = [
  { label: "Pa limit", value: "" },
  { label: "deri 50,000 km", value: "50000" },
  { label: "deri 100,000 km", value: "100000" },
  { label: "deri 150,000 km", value: "150000" },
  { label: "deri 200,000 km", value: "200000" },
  { label: "deri 300,000 km", value: "300000" },
];

export default function KerkoFilters() {
  const router = useRouter();
  const params = useSearchParams();
  const [open, setOpen] = useState(false);

  const get = (key: string) => params.get(key) ?? "";

  const update = useCallback((key: string, value: string) => {
    const p = new URLSearchParams(params.toString());
    if (value) p.set(key, value); else p.delete(key);
    router.push(`/kerko?${p.toString()}`);
  }, [params, router]);

  const clearAll = () => router.push("/kerko");

  const hasFilters = ["fuel", "year", "maxPrice", "maxKm", "transmission", "city"].some((k) => params.get(k));

  const labelClass = "text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5 block";
  const selectClass = "w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-green-500 bg-white";

  const filterBody = (
    <div className="flex flex-col gap-4">
      {/* Qyteti */}
      <div>
        <label className={labelClass}>Qyteti</label>
        <select className={selectClass} value={get("city")} onChange={(e) => update("city", e.target.value)}>
          <option value="">Të gjitha</option>
          {albanianCities.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>

      {/* Karburanti */}
      <div>
        <label className={labelClass}>Karburanti</label>
        <select className={selectClass} value={get("fuel")} onChange={(e) => update("fuel", e.target.value)}>
          <option value="">Të gjitha</option>
          {fuels.map((f) => <option key={f} value={f}>{f}</option>)}
        </select>
      </div>

      {/* Kambio */}
      <div>
        <label className={labelClass}>Kambio</label>
        <select className={selectClass} value={get("transmission")} onChange={(e) => update("transmission", e.target.value)}>
          <option value="">Të gjitha</option>
          {transmissions.map((t) => <option key={t} value={t}>{t}</option>)}
        </select>
      </div>

      {/* Viti */}
      <div>
        <label className={labelClass}>Viti (nga)</label>
        <select className={selectClass} value={get("year")} onChange={(e) => update("year", e.target.value)}>
          <option value="">Të gjithë vitet</option>
          {years.map((y) => <option key={y} value={y}>{y}</option>)}
        </select>
      </div>

      {/* Çmimi max */}
      <div>
        <label className={labelClass}>Çmimi maksimal</label>
        <select className={selectClass} value={get("maxPrice")} onChange={(e) => update("maxPrice", e.target.value)}>
          {priceOptions.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
      </div>

      {/* Kilometrat max */}
      <div>
        <label className={labelClass}>Kilometrat max</label>
        <select className={selectClass} value={get("maxKm")} onChange={(e) => update("maxKm", e.target.value)}>
          {kmOptions.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
      </div>

      {/* Ndrrim */}
      <div>
        <label className={labelClass}>Ndrrim</label>
        <select className={selectClass} value={get("exchange")} onChange={(e) => update("exchange", e.target.value)}>
          <option value="">Të gjitha</option>
          <option value="po">Ndrrohet</option>
          <option value="apartament">Me Apartament</option>
          <option value="makine-madhe">Me Makinë të Madhe</option>
          <option value="tjeter">Me Tjetër</option>
        </select>
      </div>
    </div>
  );

  return (
    <aside className="w-full md:w-60 shrink-0">
      {/* Mobile toggle */}
      <button
        className="md:hidden w-full flex items-center justify-between bg-white border border-gray-200 rounded-2xl px-4 py-3 mb-2 text-sm font-bold text-gray-800 shadow-sm"
        onClick={() => setOpen((v) => !v)}
      >
        <span className="flex items-center gap-2">
          <svg className="w-4 h-4 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 4h18M7 8h10M11 12h4" />
          </svg>
          Filtrat
          {hasFilters && <span className="bg-green-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">!</span>}
        </span>
        <span className="text-gray-400 text-xs">{open ? "▲" : "▼"}</span>
      </button>

      {/* Desktop: always visible / Mobile: toggle */}
      <div className={`bg-white border border-gray-200 rounded-2xl p-5 shadow-sm ${open ? "block" : "hidden md:block"}`}>
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-sm font-bold text-gray-900">Filtrat</h2>
          {hasFilters && (
            <button onClick={clearAll} className="text-xs text-green-600 hover:underline font-medium">
              Pastro
            </button>
          )}
        </div>
        {filterBody}
      </div>
    </aside>
  );
}
