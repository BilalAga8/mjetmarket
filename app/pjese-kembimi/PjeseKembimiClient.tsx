"use client";

import { useState, useEffect, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import type { PartCategory } from "../../data/partCategories";

import PartRequestForm from "../../components/PartRequestForm";
import { MAKES } from "../../data/makes";


type Quality = "oem" | "ekuivalente" | "ekonomike";

interface Product {
  id: string;
  name: string;
  oem_code: string | null;
  category: string;
  quality: Quality;
  photo_key: string | null;
  compatible_makes: string[];
  compatible_models: string[];
  year_from: number | null;
  year_to: number | null;
  price_from: number | null;
  price_to: number | null;
  shops_count: number;
}

interface Props {
  categories: PartCategory[];
  products?: Product[];
  initialCategory?: string;
  initialQuality?: string;
}

const qualityColors: Record<Quality, string> = {
  oem:         "bg-blue-50 text-blue-600 border-blue-100",
  ekuivalente: "bg-orange-50 text-orange-600 border-orange-100",
  ekonomike:   "bg-gray-100 text-gray-500 border-gray-200",
};

const qualityLabels: Record<Quality, string> = {
  oem: "OEM", ekuivalente: "Ekuivalente", ekonomike: "Ekonomike",
};

function getCategoryIcon(category: string, categories: PartCategory[]): string {
  return categories.find((c) => c.name === category)?.icon ?? "⚙️";
}

export default function PjeseKembimiClient({ categories, products = [], initialCategory = "", initialQuality = "" }: Props) {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [modalOpen, setModalOpen] = useState(false);
  const [selectedPart, setSelectedPart] = useState("");
  const [selectedVin, setSelectedVin]   = useState("");
  const [selectedMake, setSelectedMake] = useState("");
  const [selectedModel, setSelectedModel] = useState("");
  const [selectedYear, setSelectedYear]  = useState("");

  const [search, setSearch] = useState("");

  // Vehicle selector state
  const [yearInput,   setYearInput]   = useState("");
  const [makeInput,   setMakeInput]   = useState("");
  const [modelInput,  setModelInput]  = useState("");
  const [trimInput,   setTrimInput]   = useState("");
  const [engineInput, setEngineInput] = useState("");

  // VIN bar state
  const [vinInput,   setVinInput]   = useState("");
  const [vinLoading, setVinLoading] = useState(false);
  const [vinError,   setVinError]   = useState("");

  // Confirmed vehicle (used for product filtering)
  const [vinMake, setVinMake]   = useState("");
  const [vinModel, setVinModel] = useState("");
  const [vinYear, setVinYear]   = useState(0);
  const [vinConfirmed, setVinConfirmed] = useState(false);

  // Filters — initialized from server searchParams
  const [filterCategory, setFilterCategory] = useState(initialCategory);
  const [filterQuality, setFilterQuality]   = useState(initialQuality);

  // Sync filters to URL so generateMetadata works + breadcrumbs update
  const syncUrl = useCallback((cat: string, qual: string) => {
    const params = new URLSearchParams();
    if (cat)  params.set("category", cat);
    if (qual) params.set("quality",  qual);
    const qs = params.toString();
    router.replace(qs ? `/pjese-kembimi?${qs}` : "/pjese-kembimi", { scroll: false });
  }, [router]);

  // Read URL params from /kontrollo redirect
  useEffect(() => {
    const make  = searchParams.get("make")  ?? "";
    const model = searchParams.get("model") ?? "";
    const year  = parseInt(searchParams.get("year") ?? "0");
    if (make && model && year) {
      setMakeInput(make); setModelInput(model); setYearInput(String(year));
      setVinMake(make); setVinModel(model); setVinYear(year);
      setVinConfirmed(true);
    }
  }, [searchParams]);

  function handleAddVehicle() {
    if (!yearInput || !makeInput || !modelInput) return;
    setVinMake(makeInput);
    setVinModel(modelInput);
    setVinYear(parseInt(yearInput));
    setVinConfirmed(true);
  }

  async function handleVinCheck() {
    const v = vinInput.trim().toUpperCase();
    if (v.length !== 17) { setVinError("VIN-i duhet të ketë 17 karaktere."); return; }
    setVinError(""); setVinLoading(true);
    try {
      const res  = await fetch(`https://vpic.nhtsa.dot.gov/api/vehicles/decodevin/${v}?format=json`);
      const json = await res.json();
      const get  = (field: string) => json.Results?.find((r: { Variable: string }) => r.Variable === field)?.Value ?? "";
      const make  = get("Make"); const model = get("Model");
      const year  = parseInt(get("Model Year")) || 0;
      if (!make || !model || !year) { setVinError("VIN-i nuk u njoh."); setVinLoading(false); return; }
      setMakeInput(make); setModelInput(model); setYearInput(String(year));
      setVinMake(make); setVinModel(model); setVinYear(year);
      setVinConfirmed(true);
    } catch { setVinError("Gabim. Provo përsëri."); }
    finally { setVinLoading(false); }
  }

  function clearVehicle() {
    setYearInput(""); setMakeInput(""); setModelInput("");
    setTrimInput(""); setEngineInput("");
    setVinInput(""); setVinError("");
    setVinMake(""); setVinModel(""); setVinYear(0);
    setVinConfirmed(false);
  }

  function openForm(partName: string) {
    setSelectedPart(partName);
    setSelectedVin("");
    setSelectedMake(vinMake);
    setSelectedModel(vinModel);
    setSelectedYear(vinYear ? String(vinYear) : "");
    setModalOpen(true);
  }

  // Filter products
  const filteredProducts = products.filter((p) => {
    const makeMatch = p.compatible_makes.length === 0 ||
      (vinMake && p.compatible_makes.some((m) => m.toLowerCase() === vinMake.toLowerCase()));
    const modelMatch = p.compatible_models.length === 0 ||
      (vinModel && p.compatible_models.some((m) => m.toLowerCase().includes(vinModel.toLowerCase())));
    const yearMatch = (!p.year_from || !vinYear || vinYear >= p.year_from) &&
      (!p.year_to   || !vinYear || vinYear <= p.year_to);
    const catMatch  = !filterCategory || p.category === filterCategory;
    const qualMatch = !filterQuality  || p.quality  === filterQuality;

    if (vinConfirmed) return makeMatch && modelMatch && yearMatch && catMatch && qualMatch;
    return catMatch && qualMatch;
  });

  const filteredCategories = categories.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.nameEn.toLowerCase().includes(search.toLowerCase())
  );

  const showProducts = products.length > 0;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 py-10 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          {/* Breadcrumbs */}
          <nav aria-label="breadcrumb" className="flex items-center gap-1.5 text-xs text-gray-400 mb-4 flex-wrap">
            <Link href="/" className="hover:text-green-600 transition-colors">Kreu</Link>
            <span>›</span>
            <Link href="/pjese-kembimi" className="hover:text-green-600 transition-colors">Pjesë Këmbimi</Link>
            {filterCategory && (
              <>
                <span>›</span>
                <span className="text-gray-600 font-medium">{filterCategory}</span>
              </>
            )}
          </nav>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight mb-1">Pjesë Këmbimi</h1>
          <p className="text-gray-500 text-sm mb-6">Shto mjetin tënd për të parë pjesët e përshtatshme.</p>

          {/* Vehicle Selector */}
          {!vinConfirmed ? (
            <div>
              <div className="flex flex-col sm:flex-row gap-2 items-stretch sm:items-center flex-wrap">
                {/* Year */}
                <div className="border border-gray-300 rounded-lg px-3 py-1.5 bg-white min-w-[100px]">
                  <label className="text-[10px] text-gray-400 block leading-none mb-0.5">Viti</label>
                  <select value={yearInput} onChange={(e) => setYearInput(e.target.value)}
                    className="w-full text-sm font-semibold text-gray-900 outline-none bg-transparent leading-tight">
                    <option value="">--</option>
                    {Array.from({ length: 36 }, (_, i) => 2025 - i).map((y) => (
                      <option key={y} value={y}>{y}</option>
                    ))}
                  </select>
                </div>
                {/* Make */}
                <div className="border border-gray-300 rounded-lg px-3 py-1.5 bg-white min-w-[130px]">
                  <label className="text-[10px] text-gray-400 block leading-none mb-0.5">Marka</label>
                  <select value={makeInput} onChange={(e) => setMakeInput(e.target.value)}
                    className="w-full text-sm font-semibold text-gray-900 outline-none bg-transparent leading-tight">
                    <option value="">--</option>
                    {MAKES.map((m) => (
                      <option key={m} value={m}>{m}</option>
                    ))}
                  </select>
                </div>
                {/* Model */}
                <div className="border border-gray-300 rounded-lg px-3 py-1.5 bg-white min-w-[130px]">
                  <label className="text-[10px] text-gray-400 block leading-none mb-0.5">Modeli</label>
                  <input value={modelInput} onChange={(e) => setModelInput(e.target.value)}
                    placeholder="p.sh. 320d"
                    className="w-full text-sm font-semibold text-gray-900 outline-none bg-transparent leading-tight placeholder:font-normal placeholder:text-gray-400" />
                </div>
                {/* Trim */}
                <div className="border border-gray-300 rounded-lg px-3 py-1.5 bg-white min-w-[110px]">
                  <label className="text-[10px] text-gray-400 block leading-none mb-0.5">Trim</label>
                  <input value={trimInput} onChange={(e) => setTrimInput(e.target.value)}
                    placeholder="p.sh. Sport"
                    className="w-full text-sm font-semibold text-gray-900 outline-none bg-transparent leading-tight placeholder:font-normal placeholder:text-gray-400" />
                </div>
                {/* Engine */}
                <div className="border border-gray-300 rounded-lg px-3 py-1.5 bg-white min-w-[110px]">
                  <label className="text-[10px] text-gray-400 block leading-none mb-0.5">Motori</label>
                  <input value={engineInput} onChange={(e) => setEngineInput(e.target.value)}
                    placeholder="p.sh. 2.0L"
                    className="w-full text-sm font-semibold text-gray-900 outline-none bg-transparent leading-tight placeholder:font-normal placeholder:text-gray-400" />
                </div>
                {/* Button */}
                <button
                  onClick={handleAddVehicle}
                  disabled={!yearInput || !makeInput || !modelInput}
                  className="bg-green-600 disabled:opacity-40 text-white font-bold px-6 py-2 rounded-full whitespace-nowrap text-sm"
                >
                  Shto mjetin
                </button>
              </div>

              {/* VIN opsion dytësor */}
              <div className="mt-3 flex flex-col sm:flex-row items-start sm:items-center gap-2">
                <span className="text-xs text-gray-400 shrink-0">Ose kërko me VIN:</span>
                <div className="flex gap-2 flex-1 max-w-sm">
                  <input
                    value={vinInput}
                    onChange={(e) => setVinInput(e.target.value.toUpperCase())}
                    onKeyDown={(e) => e.key === "Enter" && handleVinCheck()}
                    maxLength={17}
                    placeholder="17 karaktere..."
                    className="flex-1 border border-gray-200 rounded-lg px-3 py-1.5 text-xs font-mono focus:outline-none focus:border-green-500"
                  />
                  <button
                    onClick={handleVinCheck}
                    disabled={vinLoading}
                    className="bg-gray-800 disabled:opacity-60 text-white text-xs font-semibold px-4 py-1.5 rounded-lg"
                  >
                    {vinLoading ? "..." : "Kontrollo"}
                  </button>
                </div>
                {vinError && <p className="text-xs text-red-500">{vinError}</p>}
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-3 flex-wrap">
              <div className="flex items-center gap-2 bg-green-50 border border-green-200 rounded-xl px-4 py-2.5">
                <svg className="w-4 h-4 text-green-600 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-sm font-bold text-green-800">{vinYear} {vinMake} {vinModel}</span>
                {trimInput && <span className="text-xs text-green-600">{trimInput}</span>}
              </div>
              <button onClick={clearVehicle} className="text-sm text-gray-400 underline">
                Ndrysho mjetin
              </button>
              <span className="text-sm text-gray-500">{filteredProducts.length} pjesë të përshtatshme</span>
            </div>
          )}
        </div>
      </div>

      {/* Products or Categories */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {showProducts ? (
          <>
            <div className="flex gap-8">
              {/* ── Sidebar filtrat (eBay stil) ── */}
              <aside className="hidden sm:block w-44 shrink-0">
                {/* Kategoria */}
                <div className="mb-6">
                  <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Kategoria</p>
                  <div className="flex flex-col">
                    <button
                      onClick={() => { setFilterCategory(""); syncUrl("", filterQuality); }}
                      className={`text-left text-sm py-1.5 px-2 rounded-lg ${filterCategory === "" ? "font-bold text-green-600 bg-green-50" : "text-gray-600"}`}
                    >
                      Të gjitha
                    </button>
                    {categories.map((c) => (
                      <button
                        key={c.id}
                        onClick={() => { setFilterCategory(c.name); syncUrl(c.name, filterQuality); }}
                        className={`text-left text-sm py-1.5 px-2 rounded-lg flex items-center gap-2 ${filterCategory === c.name ? "font-bold text-green-600 bg-green-50" : "text-gray-600"}`}
                      >
                        <span className="text-base">{c.icon}</span>
                        <span className="truncate">{c.name}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Cilësia */}
                <div>
                  <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Cilësia</p>
                  <div className="flex flex-col">
                    {[{ val: "", label: "Të gjitha" }, { val: "oem", label: "OEM" }, { val: "ekuivalente", label: "Ekuivalente" }, { val: "ekonomike", label: "Ekonomike" }].map((q) => (
                      <button
                        key={q.val}
                        onClick={() => { setFilterQuality(q.val); syncUrl(filterCategory, q.val); }}
                        className={`text-left text-sm py-1.5 px-2 rounded-lg ${filterQuality === q.val ? "font-bold text-green-600 bg-green-50" : "text-gray-600"}`}
                      >
                        {q.label}
                      </button>
                    ))}
                  </div>
                </div>

                {(filterCategory || filterQuality) && (
                  <button
                    onClick={() => { setFilterCategory(""); setFilterQuality(""); syncUrl("", ""); }}
                    className="mt-4 text-xs text-red-400 underline"
                  >
                    × Pastro filtrat
                  </button>
                )}
              </aside>

              {/* ── Lista e produkteve ── */}
              <div className="flex-1 min-w-0">
                <p className="text-sm text-gray-400 mb-4">{filteredProducts.length} produkte</p>

                {filteredProducts.length === 0 ? (
                  <div className="py-16 text-center">
                    <p className="text-gray-400 text-sm mb-3">
                      {vinConfirmed
                        ? `Nuk u gjetën pjesë për ${vinMake} ${vinModel} ${vinYear}.`
                        : "Nuk u gjetën produkte."}
                    </p>
                    <button onClick={() => openForm("")} className="text-green-600 text-sm font-semibold underline">
                      Kërko manualisht →
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-col divide-y divide-gray-200">
                    {filteredProducts.map((p) => (
                      <div key={p.id} className="flex gap-5 sm:gap-8 py-5 first:pt-0">
                        {/* Foto */}
                        <div className="w-28 h-28 sm:w-40 sm:h-40 shrink-0 bg-gray-50 border border-gray-100 rounded-xl overflow-hidden flex items-center justify-center">
                          {p.photo_key && p.photo_key.startsWith("http") ? (
                            <img src={p.photo_key} alt={p.name} className="w-full h-full object-cover" />
                          ) : (
                            <span className="text-4xl sm:text-5xl opacity-40">{getCategoryIcon(p.category, categories)}</span>
                          )}
                        </div>

                        {/* Info */}
                        <div className="flex-1 min-w-0 flex flex-col justify-between">
                          <div>
                            <p className="text-base sm:text-lg font-bold text-gray-900 leading-snug mb-1">{p.name}</p>
                            <div className="flex items-center gap-2 mb-2 flex-wrap">
                              <span className={`text-xs px-2 py-0.5 rounded border font-semibold ${qualityColors[p.quality]}`}>
                                {qualityLabels[p.quality]}
                              </span>
                              {vinConfirmed && (
                                <span className="text-xs bg-green-50 border border-green-200 text-green-700 font-semibold px-2 py-0.5 rounded">
                                  ✓ Përshtatet
                                </span>
                              )}
                            </div>
                            {p.oem_code && <p className="text-sm text-gray-400 font-mono mb-1">Kodi OEM: {p.oem_code}</p>}
                            {p.compatible_makes.length > 0 && (
                              <p className="text-sm text-gray-500 mb-1">
                                Për: {p.compatible_makes.slice(0, 4).join(", ")}
                                {p.compatible_makes.length > 4 && ` +${p.compatible_makes.length - 4}`}
                              </p>
                            )}
                            {(p.year_from || p.year_to) && (
                              <p className="text-sm text-gray-400">Vitet: {p.year_from ?? "?"} – {p.year_to ?? "sot"}</p>
                            )}
                          </div>
                          <div className="flex items-end justify-between mt-3 gap-3">
                            <div>
                              {(p.price_from || p.price_to) ? (
                                <p className="text-xl sm:text-2xl font-extrabold text-gray-900">
                                  {p.price_from && p.price_to ? `${p.price_from} – ${p.price_to}€` : `${p.price_from ?? p.price_to}€`}
                                </p>
                              ) : (
                                <p className="text-sm text-gray-400">Çmim me kërkesë</p>
                              )}
                              {p.shops_count > 0 && <p className="text-sm text-gray-400 mt-0.5">{p.shops_count} dyqane ofertojnë</p>}
                            </div>
                            <button onClick={() => openForm(p.name)}
                              className="bg-green-600 text-white text-sm font-bold px-6 py-2.5 rounded-full shrink-0">
                              Kërko Ofertë
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}

                    <div className="py-5 flex items-center justify-between">
                      <p className="text-sm text-gray-400">Nuk gjen pjesën që kërkon?</p>
                      <button onClick={() => openForm("")}
                        className="border border-green-600 text-green-600 text-sm font-bold px-5 py-2 rounded-full">
                        Kërko manualisht
                      </button>
                    </div>
                  </div>
                )}

                <p className="text-xs text-gray-400 mt-6 text-center">Produktet po shtohen vazhdimisht</p>
              </div>
            </div>
          </>
        ) : (
          <>
            {/* Search bar */}
            <div className="relative max-w-md mb-4">
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
              </svg>
              <input type="text" value={search} onChange={(e) => setSearch(e.target.value)}
                placeholder="Kërko kategori pjesësh..."
                className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500" />
            </div>

            {filteredCategories.length === 0 ? (
              <div className="text-center py-20">
                <p className="text-gray-400 text-sm">Nuk u gjet asnjë kategori për &quot;{search}&quot;</p>
                <button onClick={() => openForm(search)} className="mt-4 text-green-600 text-sm font-semibold underline">
                  Kërko &quot;{search}&quot; si pjesë të posaçme →
                </button>
              </div>
            ) : (
              <div className="flex flex-col divide-y divide-gray-200">
                {filteredCategories.map((cat) => (
                  <div key={cat.id} className="bg-white flex items-center gap-4 py-3.5 px-1 first:pt-0">
                    {/* Ikona */}
                    <div className="w-12 h-12 sm:w-16 sm:h-16 shrink-0 bg-gray-50 border border-gray-100 rounded-xl flex items-center justify-center">
                      <span className="text-2xl sm:text-3xl">{cat.icon}</span>
                    </div>
                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm sm:text-base font-bold text-gray-900">{cat.name}</p>
                      <p className="text-xs sm:text-sm text-gray-400">{cat.nameEn}</p>
                    </div>
                    {/* Butoni */}
                    <button onClick={() => openForm(cat.name)}
                      className="shrink-0 bg-green-600 text-white text-xs sm:text-sm font-bold px-4 sm:px-6 py-2 sm:py-2.5 rounded-full">
                      Kërko
                    </button>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {/* CTA Banner */}
        <div className="mt-12 bg-green-600 rounded-2xl p-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h3 className="text-white text-lg font-bold mb-1">Nuk gjen çfarë kërkon?</h3>
            <p className="text-green-100 text-sm">Na trego çfarë të duhet dhe ne gjejmë për ty.</p>
          </div>
          <button onClick={() => openForm("")}
            className="bg-white text-green-700 font-bold px-6 py-3 rounded-xl hover:bg-green-50 transition-colors text-sm whitespace-nowrap">
            Kërko Pjesën →
          </button>
        </div>
      </div>

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <PartRequestForm
              preselectedPart={selectedPart}
              preselectedVin={selectedVin}
              preselectedMake={selectedMake}
              preselectedModel={selectedModel}
              preselectedYear={selectedYear}
              onClose={() => setModalOpen(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
}
