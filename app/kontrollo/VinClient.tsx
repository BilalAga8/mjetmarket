"use client";

import { useState } from "react";
import Link from "next/link";

interface Service { id: number; name: string; city: string; phone: string; }

interface VinData {
  make: string;
  model: string;
  year: number;
  engine: string;
  fuel: string;
  transmission: string;
  displacement: string;
}

interface Recommendations {
  engineOil: { type: string; viscosity: string; liters: number };
  oilFilter: string;
  airFilter: string;
  tireSize: string;
  serviceInterval: string;
  gearboxOil: string;
}

const oilMap: Record<string, { viscosity: string; liters: number; type: string }> = {
  "BMW_diesel":         { viscosity: "5W-30 Longlife",  liters: 4.5, type: "LL-04" },
  "BMW_benzine":        { viscosity: "5W-30 Longlife",  liters: 5.0, type: "LL-01" },
  "MERCEDES_diesel":    { viscosity: "5W-30 229.51",    liters: 6.5, type: "MB 229.51" },
  "MERCEDES_benzine":   { viscosity: "5W-40 229.5",     liters: 7.0, type: "MB 229.5" },
  "VOLKSWAGEN_diesel":  { viscosity: "5W-30 504/507",   liters: 4.3, type: "VW 507.00" },
  "VOLKSWAGEN_benzine": { viscosity: "5W-40 502",       liters: 4.5, type: "VW 502.00" },
  "AUDI_diesel":        { viscosity: "5W-30 504/507",   liters: 4.5, type: "VW 507.00" },
  "AUDI_benzine":       { viscosity: "5W-40 502",       liters: 5.0, type: "VW 502.00" },
  "TOYOTA_diesel":      { viscosity: "5W-30",           liters: 4.5, type: "ACEA A5/B5" },
  "TOYOTA_benzine":     { viscosity: "0W-20",           liters: 4.2, type: "Toyota WS" },
  "HONDA_benzine":      { viscosity: "0W-20",           liters: 3.7, type: "Honda HTO" },
  "HONDA_diesel":       { viscosity: "5W-30",           liters: 4.0, type: "ACEA B5" },
  "HYUNDAI_diesel":     { viscosity: "5W-30",           liters: 4.5, type: "ACEA C3" },
  "HYUNDAI_benzine":    { viscosity: "5W-20",           liters: 4.0, type: "ACEA A5" },
  "KIA_diesel":         { viscosity: "5W-30",           liters: 4.5, type: "ACEA C3" },
  "KIA_benzine":        { viscosity: "5W-20",           liters: 4.0, type: "ACEA A5" },
  "DEFAULT":            { viscosity: "5W-40",           liters: 4.5, type: "ACEA A3/B4" },
};

const longIntervalMakes = ["BMW", "MERCEDES", "AUDI", "VOLKSWAGEN"];

function normalizeMake(make: string): string {
  if (!make) return "DEFAULT";
  const m = make.toUpperCase();
  if (m.includes("MERCEDES")) return "MERCEDES";
  if (m.includes("VOLKSWAGEN") || m === "VW") return "VOLKSWAGEN";
  return m.split("-")[0].split(" ")[0];
}

function getRecommendations(make: string, fuel: string, year: number): Recommendations {
  const norm = normalizeMake(make);
  const fuelKey = fuel.toLowerCase().includes("diesel") ? "diesel" : "benzine";
  const oilKey = `${norm}_${fuelKey}`;
  const oil = oilMap[oilKey] || oilMap["DEFAULT"];

  const longInterval = longIntervalMakes.includes(norm);
  const interval = longInterval ? "Çdo 15,000 km ose 1 vit" : "Çdo 10,000 km ose 1 vit";

  const gearboxOil = fuelKey === "diesel"
    ? "75W-90 GL-4 (ndërrimi çdo 60,000 km)"
    : "ATF Dexron VI ose MTF 75W-80 GL-4";

  return {
    engineOil: { type: oil.type, viscosity: oil.viscosity, liters: oil.liters },
    oilFilter: `${norm} ${norm === "DEFAULT" ? "Universal" : ""} OEM`,
    airFilter: `${norm} OEM ${year > 2010 ? "/ Mann Filter" : ""}`,
    tireSize: "Shih kartonin brenda derës ose dokumenteve",
    serviceInterval: interval,
    gearboxOil,
  };
}

function getField(results: { Variable: string; Value: string | null }[], variable: string): string {
  return results.find((r) => r.Variable === variable)?.Value || "";
}

export default function VinClient({ services }: { services: Service[] }) {
  const [vin, setVin] = useState("");
  const [vinData, setVinData] = useState<VinData | null>(null);
  const [recs, setRecs] = useState<Recommendations | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showServices, setShowServices] = useState(false);
  const [copied, setCopied] = useState(false);

  // Manual fallback state
  const [showManual, setShowManual] = useState(false);
  const [manual, setManual] = useState({ make: "", model: "", year: "", fuel: "benzine" });

  async function handleCheck() {
    const v = vin.trim().toUpperCase();
    if (v.length !== 17) {
      setError("VIN-i duhet të ketë saktësisht 17 karaktere.");
      return;
    }
    setError("");
    setLoading(true);
    setVinData(null);
    setRecs(null);

    try {
      const res = await fetch(
        `https://vpic.nhtsa.dot.gov/api/vehicles/decodevin/${v}?format=json`
      );
      const json = await res.json();
      const results = json.Results ?? [];

      const make  = getField(results, "Make");
      const model = getField(results, "Model");
      const yearStr = getField(results, "Model Year");
      const year  = parseInt(yearStr) || 0;
      const engine = getField(results, "Engine Configuration");
      const fuel   = getField(results, "Fuel Type - Primary") || "Benzinë";
      const transmission = getField(results, "Transmission Style");
      const displacement = getField(results, "Displacement (L)");

      if (!make || !model || !year) {
        setError("VIN-i nuk u njoh. Kontrollo nëse e ke shtypur saktë ose plotëso të dhënat manualisht.");
        setShowManual(true);
        setLoading(false);
        return;
      }

      const data: VinData = { make, model, year, engine, fuel, transmission, displacement };
      setVinData(data);
      setRecs(getRecommendations(make, fuel, year));
    } catch {
      setError("Gabim gjatë lidhjes me server-in. Provo përsëri.");
    } finally {
      setLoading(false);
    }
  }

  function handleManualSubmit(e: React.FormEvent) {
    e.preventDefault();
    const year = parseInt(manual.year) || new Date().getFullYear();
    const data: VinData = {
      make: manual.make, model: manual.model, year,
      engine: "", fuel: manual.fuel === "diesel" ? "Diesel" : "Benzinë",
      transmission: "", displacement: "",
    };
    setVinData(data);
    setRecs(getRecommendations(manual.make, manual.fuel, year));
    setShowManual(false);
    setError("");
  }

  function handleShare() {
    if (!vinData) return;
    const url = `${window.location.origin}/kontrollo?vin=${vin}`;
    if (navigator.share) {
      navigator.share({ title: `${vinData.make} ${vinData.model} — Raport VIN`, url });
    } else {
      navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }

  const inputCls = "w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500";

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Hero */}
      <div className="bg-white border-b border-gray-200 py-14 px-4 sm:px-6">
        <div className="max-w-2xl mx-auto text-center">
          <span className="inline-block bg-green-50 text-green-600 text-xs font-semibold px-3 py-1 rounded-full mb-4 uppercase tracking-wide">
            Falas — pa regjistrim
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-3">
            Kontrollo Makinën Tënde
          </h1>
          <p className="text-gray-500 text-sm mb-8 max-w-md mx-auto">
            Fut numrin e shasisë dhe merr rekomandimet e plota të servisit, pa pagesë.
          </p>

          <div className="flex gap-2 max-w-lg mx-auto">
            <input
              value={vin}
              onChange={(e) => setVin(e.target.value.toUpperCase())}
              onKeyDown={(e) => e.key === "Enter" && handleCheck()}
              placeholder="p.sh. WBA3A5G5XDNN12345"
              maxLength={17}
              className="flex-1 border border-gray-200 rounded-xl px-4 py-3 text-sm font-mono focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100"
            />
            <button
              onClick={handleCheck}
              disabled={loading}
              className="bg-green-500 hover:bg-green-600 disabled:opacity-60 text-white font-semibold px-6 py-3 rounded-xl transition-colors text-sm whitespace-nowrap"
            >
              {loading ? "Duke kontrolluar..." : "Kontrollo"}
            </button>
          </div>
          <p className="text-xs text-gray-400 mt-2">
            Gjendet në kartën gri të regjistrimit ose brenda derës së shoferit
          </p>

          {error && (
            <div className="mt-4 bg-red-50 border border-red-100 text-red-600 text-sm rounded-xl px-4 py-3 text-left">
              {error}
            </div>
          )}
        </div>
      </div>

      {/* Manual fallback form */}
      {showManual && (
        <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8">
          <div className="bg-white border border-gray-200 rounded-2xl p-6">
            <h2 className="font-bold text-gray-900 mb-4">Plotëso të dhënat manualisht</h2>
            <form onSubmit={handleManualSubmit} className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-gray-500 mb-1 block">Marka *</label>
                <input required value={manual.make} onChange={(e) => setManual(p => ({ ...p, make: e.target.value }))}
                  placeholder="BMW" className={inputCls} />
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-500 mb-1 block">Modeli *</label>
                <input required value={manual.model} onChange={(e) => setManual(p => ({ ...p, model: e.target.value }))}
                  placeholder="320d" className={inputCls} />
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-500 mb-1 block">Viti *</label>
                <input required value={manual.year} onChange={(e) => setManual(p => ({ ...p, year: e.target.value }))}
                  placeholder="2015" maxLength={4} className={inputCls} />
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-500 mb-1 block">Karburanti *</label>
                <select value={manual.fuel} onChange={(e) => setManual(p => ({ ...p, fuel: e.target.value }))}
                  className={inputCls}>
                  <option value="benzine">Benzinë</option>
                  <option value="diesel">Diesel</option>
                </select>
              </div>
              <div className="col-span-2 flex gap-3">
                <button type="button" onClick={() => setShowManual(false)}
                  className="flex-1 border border-gray-200 text-gray-600 text-sm font-semibold py-2.5 rounded-xl hover:bg-gray-50 transition-colors">
                  Anulo
                </button>
                <button type="submit"
                  className="flex-1 bg-green-500 hover:bg-green-600 text-white text-sm font-semibold py-2.5 rounded-xl transition-colors">
                  Merr Rekomandimet
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Results */}
      {vinData && recs && (
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
          {/* Vehicle badge */}
          <div className="flex items-center gap-2 mb-6">
            <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 17H3a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11a2 2 0 0 1 2 2v3"/>
                <rect x="9" y="11" width="14" height="10" rx="2"/>
                <circle cx="12" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
              </svg>
            </div>
            <span className="font-extrabold text-gray-900">{vinData.make} {vinData.model}</span>
            <span className="text-sm text-gray-500">{vinData.year}</span>
            <span className="ml-auto text-xs text-gray-400 font-mono">{vin || "manual"}</span>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Vehicle data */}
            <div className="bg-white border border-gray-100 rounded-2xl p-6">
              <h2 className="font-bold text-gray-900 text-sm uppercase tracking-wide mb-4">Të dhënat e mjetit</h2>
              <div className="divide-y divide-gray-50">
                {[
                  ["Marka", vinData.make],
                  ["Modeli", vinData.model],
                  ["Viti", vinData.year],
                  ["Motori", vinData.engine || "—"],
                  ["Karburanti", vinData.fuel || "—"],
                  ["Kambja", vinData.transmission || "—"],
                  ["Cilindrata", vinData.displacement ? `${vinData.displacement}L` : "—"],
                ].map(([label, value]) => (
                  <div key={label as string} className="flex justify-between py-2.5 text-sm">
                    <span className="text-gray-500">{label}</span>
                    <span className="font-semibold text-gray-900">{value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Recommendations */}
            <div className="flex flex-col gap-3">
              <h2 className="font-bold text-gray-900 text-sm uppercase tracking-wide">Rekomandimet falas</h2>

              <div className="bg-white border border-gray-100 rounded-2xl p-4 flex gap-3 items-start">
                <div className="w-9 h-9 bg-amber-50 rounded-xl flex items-center justify-center text-lg shrink-0">🛢️</div>
                <div>
                  <p className="text-xs font-bold text-gray-800">Vaji i motorrit</p>
                  <p className="text-sm text-green-600 font-semibold">{recs.engineOil.viscosity}</p>
                  <p className="text-xs text-gray-500">Spec: {recs.engineOil.type} · {recs.engineOil.liters}L</p>
                </div>
              </div>

              <div className="bg-white border border-gray-100 rounded-2xl p-4 flex gap-3 items-start">
                <div className="w-9 h-9 bg-blue-50 rounded-xl flex items-center justify-center text-lg shrink-0">🔩</div>
                <div>
                  <p className="text-xs font-bold text-gray-800">Filtri i vajit</p>
                  <p className="text-sm text-gray-700">{recs.oilFilter}</p>
                </div>
              </div>

              <div className="bg-white border border-gray-100 rounded-2xl p-4 flex gap-3 items-start">
                <div className="w-9 h-9 bg-sky-50 rounded-xl flex items-center justify-center text-lg shrink-0">💨</div>
                <div>
                  <p className="text-xs font-bold text-gray-800">Filtri i ajrit</p>
                  <p className="text-sm text-gray-700">{recs.airFilter}</p>
                </div>
              </div>

              <div className="bg-white border border-gray-100 rounded-2xl p-4 flex gap-3 items-start">
                <div className="w-9 h-9 bg-gray-100 rounded-xl flex items-center justify-center text-lg shrink-0">🛞</div>
                <div>
                  <p className="text-xs font-bold text-gray-800">Kanta e gomave</p>
                  <p className="text-sm text-gray-500">{recs.tireSize}</p>
                </div>
              </div>

              <div className="bg-white border border-gray-100 rounded-2xl p-4 flex gap-3 items-start">
                <div className="w-9 h-9 bg-green-50 rounded-xl flex items-center justify-center text-lg shrink-0">📅</div>
                <div>
                  <p className="text-xs font-bold text-gray-800">Intervali i servisit</p>
                  <p className="text-sm text-green-600 font-semibold">{recs.serviceInterval}</p>
                  <p className="text-xs text-gray-500">Vaji i kambjes: {recs.gearboxOil}</p>
                </div>
              </div>
            </div>
          </div>

          {/* CTAs */}
          <div className="grid sm:grid-cols-3 gap-4 mt-8">
            <Link
              href={`/pjese-kembimi?vin=${vin}&make=${encodeURIComponent(vinData.make)}&model=${encodeURIComponent(vinData.model)}&year=${vinData.year}`}
              className="flex flex-col items-center gap-2 bg-green-500 hover:bg-green-600 text-white rounded-2xl px-5 py-5 transition-colors text-center"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/>
                <path d="M16 10a4 4 0 0 1-8 0"/>
              </svg>
              <span className="font-bold text-sm">Porosit Pjesë</span>
              <span className="text-xs text-green-100">Filtruara për {vinData.make} {vinData.model}</span>
            </Link>

            <button
              onClick={() => setShowServices((v) => !v)}
              className="flex flex-col items-center gap-2 bg-white hover:bg-gray-50 border border-gray-200 rounded-2xl px-5 py-5 transition-colors text-center"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/>
              </svg>
              <span className="font-bold text-sm text-gray-900">Gjej Servis</span>
              <span className="text-xs text-gray-400">Servis pranë teje</span>
            </button>

            <button
              onClick={handleShare}
              className="flex flex-col items-center gap-2 bg-white hover:bg-gray-50 border border-gray-200 rounded-2xl px-5 py-5 transition-colors text-center"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#6366f1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/>
                <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/>
              </svg>
              <span className="font-bold text-sm text-gray-900">
                {copied ? "U kopjua!" : "Shpërnda Raportin"}
              </span>
              <span className="text-xs text-gray-400">Kopjo link-un</span>
            </button>
          </div>

          {/* Services list */}
          {showServices && (
            <div className="mt-6 bg-white border border-gray-100 rounded-2xl p-5">
              <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-3">Servise të besuara</p>
              {services.length === 0 ? (
                <p className="text-sm text-gray-400">Nuk ka servise të listuara akoma.</p>
              ) : (
                <div className="grid sm:grid-cols-2 gap-3">
                  {services.map((s) => (
                    <div key={s.id} className="flex items-center justify-between bg-gray-50 rounded-xl px-4 py-3">
                      <div>
                        <p className="text-sm font-semibold text-gray-900">{s.name}</p>
                        <p className="text-xs text-gray-400">{s.city}</p>
                      </div>
                      <a href={`tel:${s.phone.replace(/\s/g, "")}`}
                        className="text-xs bg-green-50 text-green-700 font-semibold px-3 py-1.5 rounded-lg hover:bg-green-100 transition-colors shrink-0">
                        Telefono
                      </a>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Empty state */}
      {!vinData && !loading && !showManual && !error && (
        <div className="max-w-2xl mx-auto px-4 sm:px-6 py-16 text-center">
          <p className="text-gray-400 text-sm">Fut VIN-in e makinës tënde dhe kliko "Kontrollo" për të parë rekomandimet.</p>
        </div>
      )}
    </main>
  );
}
