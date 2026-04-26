"use client";

import { useState, useEffect, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import type { PartCategory } from "../../data/partCategories";
import { partPartners } from "../../data/partPartners";
import PartRequestForm from "../../components/PartRequestForm";

const bgColors = ["bg-green-600", "bg-blue-600", "bg-orange-500", "bg-purple-600"];

interface Service { id: number; name: string; city: string; phone: string; category: string; }

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
  services?: Service[];
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

export default function PjeseKembimiClient({ categories, services = [], products = [], initialCategory = "", initialQuality = "" }: Props) {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [modalOpen, setModalOpen] = useState(false);
  const [selectedPart, setSelectedPart] = useState("");
  const [selectedVin, setSelectedVin]   = useState("");
  const [selectedMake, setSelectedMake] = useState("");
  const [selectedModel, setSelectedModel] = useState("");
  const [selectedYear, setSelectedYear]  = useState("");

  const [search, setSearch] = useState("");

  // VIN bar state
  const [vinInput, setVinInput]     = useState("");
  const [vinMake, setVinMake]       = useState("");
  const [vinModel, setVinModel]     = useState("");
  const [vinYear, setVinYear]       = useState(0);
  const [vinLoading, setVinLoading] = useState(false);
  const [vinError, setVinError]     = useState("");
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
    const vin   = searchParams.get("vin")   ?? "";
    const make  = searchParams.get("make")  ?? "";
    const model = searchParams.get("model") ?? "";
    const year  = parseInt(searchParams.get("year") ?? "0");

    if (vin && make && model && year) {
      setVinInput(vin);
      setVinMake(make);
      setVinModel(model);
      setVinYear(year);
      setVinConfirmed(true);
    }
  }, [searchParams]);

  async function handleVinCheck() {
    const v = vinInput.trim().toUpperCase();
    if (v.length !== 17) { setVinError("VIN-i duhet të ketë 17 karaktere."); return; }
    setVinError("");
    setVinLoading(true);
    try {
      const res  = await fetch(`https://vpic.nhtsa.dot.gov/api/vehicles/decodevin/${v}?format=json`);
      const json = await res.json();
      const get  = (field: string) => json.Results?.find((r: { Variable: string }) => r.Variable === field)?.Value ?? "";
      const make  = get("Make");
      const model = get("Model");
      const year  = parseInt(get("Model Year")) || 0;
      if (!make || !model || !year) {
        setVinError("VIN-i nuk u njoh. Provo /kontrollo për kërkimin e plotë.");
        setVinLoading(false);
        return;
      }
      setVinMake(make); setVinModel(model); setVinYear(year);
      setVinConfirmed(true);
    } catch {
      setVinError("Gabim. Provo përsëri.");
    } finally {
      setVinLoading(false);
    }
  }

  function clearVin() {
    setVinInput(""); setVinMake(""); setVinModel(""); setVinYear(0);
    setVinConfirmed(false); setVinError("");
  }

  function openForm(partName: string) {
    setSelectedPart(partName);
    setSelectedVin(vinInput);
    setSelectedMake(vinMake);
    setSelectedModel(vinModel);
    setSelectedYear(vinYear ? String(vinYear) : "");
    setModalOpen(true);
  }

  // Filter products
  const filteredProducts = products.filter((p) => {
    const makeMatch = p.compatible_makes.length === 0 ||
      (vinMake && p.compatible_makes.some((m) => m.toLowerCase().includes(vinMake.toLowerCase())));
    const yearMatch = (!p.year_from || !vinYear || vinYear >= p.year_from) &&
      (!p.year_to   || !vinYear || vinYear <= p.year_to);
    const catMatch  = !filterCategory || p.category === filterCategory;
    const qualMatch = !filterQuality  || p.quality  === filterQuality;

    if (vinConfirmed) return makeMatch && yearMatch && catMatch && qualMatch;
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
        <div className="max-w-5xl mx-auto">
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
          <p className="text-gray-500 text-sm mb-6">
            Fut VIN-in e makinës për pjesë të përshtatshme, ose kërko sipas kategorisë.
          </p>

          {/* VIN Bar */}
          {!vinConfirmed ? (
            <div className="max-w-2xl">
              <div className="flex gap-2">
                <input
                  value={vinInput}
                  onChange={(e) => setVinInput(e.target.value.toUpperCase())}
                  onKeyDown={(e) => e.key === "Enter" && handleVinCheck()}
                  maxLength={17}
                  placeholder="Fut VIN-in (17 karaktere) për filtrimin e pjesëve..."
                  className="flex-1 border border-gray-200 rounded-xl px-4 py-2.5 text-sm font-mono focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500"
                />
                <button
                  onClick={handleVinCheck}
                  disabled={vinLoading}
                  className="bg-green-500 hover:bg-green-600 disabled:opacity-60 text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition-colors whitespace-nowrap"
                >
                  {vinLoading ? "..." : "Kontrollo makinën time"}
                </button>
              </div>
              {vinError && <p className="text-xs text-red-500 mt-1.5">{vinError}</p>}
              <p className="text-xs text-gray-400 mt-1.5">
                Ose <Link href="/kontrollo" className="text-green-600 hover:underline">hap VIN Tool-in e plotë</Link> për analiza të detajuara
              </p>
            </div>
          ) : (
            <div className="flex items-center gap-3 flex-wrap">
              <div className="flex items-center gap-2 bg-green-50 border border-green-200 rounded-xl px-4 py-2">
                <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center shrink-0">
                  <svg width="10" height="10" viewBox="0 0 12 12" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round">
                    <polyline points="2 6 5 9 10 3"/>
                  </svg>
                </div>
                <span className="text-sm font-bold text-green-800">{vinMake} {vinModel} {vinYear}</span>
                <span className="text-xs text-green-600 font-mono ml-1">{vinInput}</span>
              </div>
              <button onClick={clearVin} className="text-xs text-gray-400 hover:text-red-500 transition-colors">
                × Fshi
              </button>
              <span className="text-xs text-gray-500">
                {filteredProducts.length} pjesë të përshtatshme
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Partners */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 pt-8">
        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Partnerët tanë</p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {partPartners.map((partner, i) => (
            <div key={partner.id} className="flex items-center gap-3 bg-white border border-gray-200 rounded-xl px-3 py-3">
              <div className={`w-10 h-10 ${bgColors[i]} rounded-xl flex items-center justify-center text-white text-xs font-extrabold shrink-0`}>
                {partner.logo}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-gray-800 truncate">{partner.name}</p>
                <p className="text-xs text-gray-400">{partner.city}</p>
              </div>
              <div className="shrink-0 bg-red-500 text-white text-xs font-extrabold px-2 py-0.5 rounded-lg">
                -{partner.discount}%
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Products or Categories */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
        {showProducts ? (
          <>
            {/* Filters + Grid */}
            <div className="flex flex-col sm:flex-row gap-6">
              {/* Sidebar filters */}
              <aside className="sm:w-48 shrink-0 flex flex-col gap-3">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Filtro</p>
                <div>
                  <label className="text-xs text-gray-500 mb-1 block">Kategoria</label>
                  <select value={filterCategory} onChange={(e) => { setFilterCategory(e.target.value); syncUrl(e.target.value, filterQuality); }}
                    className="w-full border border-gray-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-green-500 bg-white">
                    <option value="">Të gjitha</option>
                    {categories.map((c) => <option key={c.id} value={c.name}>{c.icon} {c.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-xs text-gray-500 mb-1 block">Cilësia</label>
                  <select value={filterQuality} onChange={(e) => { setFilterQuality(e.target.value); syncUrl(filterCategory, e.target.value); }}
                    className="w-full border border-gray-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-green-500 bg-white">
                    <option value="">Të gjitha</option>
                    <option value="oem">OEM</option>
                    <option value="ekuivalente">Ekuivalente</option>
                    <option value="ekonomike">Ekonomike</option>
                  </select>
                </div>
                {(filterCategory || filterQuality || vinConfirmed) && (
                  <button onClick={() => { setFilterCategory(""); setFilterQuality(""); clearVin(); syncUrl("", ""); }}
                    className="text-xs text-green-600 hover:underline text-left">
                    × Pastro filtrat
                  </button>
                )}
              </aside>

              {/* Product grid */}
              <div className="flex-1">
                {filteredProducts.length === 0 ? (
                  <div className="text-center py-12">
                    <p className="text-gray-400 text-sm mb-2">
                      {vinConfirmed
                        ? `Nuk u gjetën pjesë për ${vinMake} ${vinModel} ${vinYear} me filtrat e zgjedhur.`
                        : "Nuk u gjetën produkte."}
                    </p>
                    <button onClick={() => openForm("")} className="text-green-600 text-sm font-semibold hover:underline">
                      Kërko manualisht →
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    {filteredProducts.map((p) => (
                      <div key={p.id} className="bg-white border border-gray-200 rounded-2xl overflow-hidden flex flex-col hover:shadow-md transition-shadow">
                        {/* Photo */}
                        <div className="relative h-28 bg-gray-50 flex items-center justify-center">
                          {p.photo_key && p.photo_key.startsWith("http")
                            ? <img src={p.photo_key} alt={p.name} className="h-full w-full object-cover" />
                            : <span className="text-4xl">{getCategoryIcon(p.category, categories)}</span>
                          }
                          {vinConfirmed && (
                            <span className="absolute top-2 left-2 bg-green-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                              ✓ Përshtatet
                            </span>
                          )}
                        </div>
                        {/* Info */}
                        <div className="p-3 flex flex-col flex-1">
                          <div className="flex items-center gap-1.5 mb-1 flex-wrap">
                            {p.oem_code && <span className="text-xs text-gray-400 font-mono">{p.oem_code}</span>}
                            <span className={`text-xs px-1.5 py-0.5 rounded border font-semibold ${qualityColors[p.quality]}`}>
                              {qualityLabels[p.quality]}
                            </span>
                          </div>
                          <p className="text-sm font-bold text-gray-900 leading-tight mb-1 flex-1">{p.name}</p>
                          {p.shops_count > 0 && (
                            <p className="text-xs text-gray-400 mb-2">⭐ {p.shops_count} dyqane ofertojnë</p>
                          )}
                          {(p.price_from || p.price_to) && (
                            <p className="text-sm font-bold text-green-600 mb-2">
                              nga {p.price_from ?? "?"} – {p.price_to ?? "?"}€
                            </p>
                          )}
                          <button
                            onClick={() => openForm(p.name)}
                            className="w-full bg-green-500 hover:bg-green-600 text-white text-xs font-bold py-2 rounded-xl transition-colors"
                          >
                            Kërko Ofertë
                          </button>
                        </div>
                      </div>
                    ))}

                    {/* Last card — manual request */}
                    <button
                      onClick={() => openForm("")}
                      className="bg-white border-2 border-dashed border-gray-200 hover:border-green-400 rounded-2xl flex flex-col items-center justify-center gap-2 p-4 min-h-[200px] transition-colors group"
                    >
                      <span className="text-2xl text-gray-300 group-hover:text-green-400 transition-colors">+</span>
                      <p className="text-xs text-gray-400 group-hover:text-green-600 text-center font-semibold transition-colors">
                        Nuk gjen pjesën?<br />Kërko manualisht →
                      </p>
                    </button>
                  </div>
                )}

                <p className="text-xs text-gray-400 mt-4 text-center">Produktet po shtohen vazhdimisht</p>
              </div>
            </div>
          </>
        ) : (
          <>
            {/* Fallback: category icons */}
            <div className="relative max-w-md mb-6">
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
              </svg>
              <input type="text" value={search} onChange={(e) => setSearch(e.target.value)}
                placeholder="Kërko pjesën..."
                className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500" />
            </div>

            <p className="text-xs text-gray-400 mb-4">Produktet po shtohen së shpejti — kërko tani sipas kategorisë:</p>

            {filteredCategories.length === 0 ? (
              <div className="text-center py-20">
                <p className="text-gray-400 text-sm">Nuk u gjet asnjë kategori për &quot;{search}&quot;</p>
                <button onClick={() => openForm(search)} className="mt-4 text-green-600 text-sm font-semibold hover:underline">
                  Kërko &quot;{search}&quot; si pjesë të posaçme →
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                {filteredCategories.map((cat) => (
                  <button key={cat.id} onClick={() => openForm(cat.name)}
                    className="bg-white border border-gray-200 rounded-2xl p-4 text-center hover:border-green-400 hover:shadow-md transition-all duration-150 group">
                    <div className="text-3xl mb-2">{cat.icon}</div>
                    <p className="text-sm font-semibold text-gray-800 group-hover:text-green-700 leading-tight">{cat.name}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{cat.nameEn}</p>
                  </button>
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
              services={services}
            />
          </div>
        </div>
      )}
    </div>
  );
}
