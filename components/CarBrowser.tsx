"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Vehicle, Category, categoryIcons } from "../data/vehicles";
import { Shop } from "../data/shops";
import CarCard from "./CarCard";
import PartnerShopsBar from "./PartnerShopsBar";
import BannerSlideshow from "./BannerSlideshow";
import FeaturedCar from "./FeaturedCar";
import NewsletterSection from "./NewsletterSection";

const partnerBg = ["bg-green-600", "bg-blue-600", "bg-orange-500", "bg-purple-600"];

interface Service { id: number; name: string; category: string; city: string; phone: string; logo: string; verified: boolean; }
interface Partner { id: string; name: string; city: string; discount: number; phone: string; logo: string; type: string; }

export default function CarBrowser({ cars, shops, services, partners }: { readonly cars: Vehicle[]; readonly shops: Shop[]; readonly services: Service[]; readonly partners: Partner[] }) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [fuel, setFuel] = useState("");
  const [year, setYear] = useState("");
  const [category, setCategory] = useState<Category | "Të gjitha">("Të gjitha");
  const [maxPrice, setMaxPrice] = useState("");
  const [advanced, setAdvanced] = useState(false);

  const fuels = useMemo(() => [...new Set(cars.map((c) => c.fuel))], [cars]);
  const years = useMemo(() => [...new Set(cars.map((c) => c.year))].sort((a, b) => b - a), [cars]);

  function handleSearch() {
    const params = new URLSearchParams();
    if (query.trim()) params.set("q", query.trim());
    if (fuel) params.set("fuel", fuel);
    if (year) params.set("year", year);
    if (maxPrice) params.set("maxPrice", maxPrice);
    router.push(`/kerko?${params.toString()}`);
  }

  const selectClass =
    "bg-white text-gray-800 text-sm font-medium rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-green-500 cursor-pointer w-full";

  return (
    <>
      {/* Hero */}
      <section
        className="relative flex flex-col justify-end"
        style={{
          backgroundImage: "url('https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=1600&q=80')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-black/20" />

        {/* Content */}
        <div className="relative z-10 max-w-3xl mx-auto w-full px-4 pb-8 pt-24 text-center">
          <h1 className="text-3xl md:text-5xl font-extrabold text-white mb-2 leading-tight tracking-tight">
            Gjej makinën e ëndrrave tënde
          </h1>
          <p className="text-gray-300 text-sm md:text-base mb-6">
            Mijëra oferta makinash në Shqipëri — blej dhe shit me besim
          </p>

          {/* Search bar — row në desktop, kolonë në mobile */}
          <div className="flex flex-col sm:flex-row gap-2">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              placeholder="Kërko p.sh. Audi A7, BMW..."
              className="flex-1 bg-white text-gray-800 text-sm font-medium rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-green-500 shadow-lg"
            />
            <div className="flex gap-2">
              <button
                onClick={handleSearch}
                className="flex-1 sm:flex-none bg-green-500 hover:bg-green-600 text-white font-semibold px-6 py-3 rounded-xl transition-colors duration-200 whitespace-nowrap shadow-lg"
              >
                Search
              </button>
              <button
                onClick={() => setAdvanced((v) => !v)}
                className={`flex-1 sm:flex-none border-2 font-semibold px-4 py-3 rounded-xl transition-colors duration-200 text-sm shadow-lg ${
                  advanced
                    ? "border-green-500 text-green-400 bg-green-500/10"
                    : "border-white/30 text-white hover:border-white/60 bg-white/10"
                }`}
              >
                Advanced {advanced ? "▲" : "▼"}
              </button>
            </div>
          </div>

          {advanced && (
            <div className="mt-3 bg-black/70 backdrop-blur-sm rounded-2xl p-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-left">
              <div>
                <label htmlFor="filter-fuel" className="text-xs text-gray-300 mb-1 block">Karburanti</label>
                <select id="filter-fuel" className={selectClass} value={fuel} onChange={(e) => setFuel(e.target.value)}>
                  <option value="">Të gjitha</option>
                  {fuels.map((f) => <option key={f} value={f}>{f}</option>)}
                </select>
              </div>
              <div>
                <label htmlFor="filter-year" className="text-xs text-gray-300 mb-1 block">Viti</label>
                <select id="filter-year" className={selectClass} value={year} onChange={(e) => setYear(e.target.value)}>
                  <option value="">Të gjithë vitet</option>
                  {years.map((y) => <option key={y} value={y}>{y}</option>)}
                </select>
              </div>
              <div>
                <label htmlFor="filter-price" className="text-xs text-gray-300 mb-1 block">Çmimi max (€)</label>
                <select id="filter-price" className={selectClass} value={maxPrice} onChange={(e) => setMaxPrice(e.target.value)}>
                  <option value="">Pa limit</option>
                  <option value="10000">10,000 €</option>
                  <option value="15000">15,000 €</option>
                  <option value="20000">20,000 €</option>
                  <option value="25000">25,000 €</option>
                  <option value="30000">30,000 €</option>
                </select>
              </div>
              <div>
                <label htmlFor="filter-exchange" className="text-xs text-gray-300 mb-1 block">Ndrrim</label>
                <select id="filter-exchange" className={selectClass}>
                  <option value="">Të gjitha</option>
                  <option value="po">Ndrrohet</option>
                  <option value="apartament">Me Apartament</option>
                  <option value="makine-madhe">Me Makinë të Madhe</option>
                  <option value="tjeter">Me Tjetër</option>
                </select>
              </div>
            </div>
          )}
        </div>
      </section>

      <PartnerShopsBar services={services} />
      {shops.length > 0 && <BannerSlideshow shops={shops} />}

      {/* Makina e Javës */}
      {(() => { const f = cars.find((c) => c.featured); return f ? <FeaturedCar car={f} /> : null; })()}

      {/* Kategoritë */}
      <div className="px-4 sm:px-14 pt-8 pb-2">
        <div className="flex items-center gap-2 flex-wrap">
          {(["Të gjitha", "Makinë", "Kamion", "Motor", "Varkë", "Trailer", "Tjetër"] as const).map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold transition-colors duration-200 ${
                category === cat
                  ? "bg-green-600 text-white"
                  : "bg-white text-gray-600 hover:bg-gray-100 border border-gray-200"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Oferta */}
      <div className="px-4 sm:px-14 py-6">
        <div className="flex items-center gap-3 mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Oferta Speciale</h2>
          <span className="h-px flex-1 bg-gray-200" />
          <span className="text-sm text-gray-400">★ Të sponsorizuara</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {cars
            .filter((v) => category === "Të gjitha" || v.category === category)
            .map((car) => (
              <CarCard key={car.id} car={car} />
            ))}
        </div>
      </div>

      <NewsletterSection />

      {/* Dyqane pjesësh këmbimi */}
      <div className="px-4 sm:px-14 pb-12 border-t border-gray-100 pt-10">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Dyqane Pjesësh Këmbimi</h2>
            <p className="text-sm text-gray-500 mt-0.5">Partnerët tanë të verifikuar — porositni direkt online</p>
          </div>
          <a href="/pjese-kembimi" className="text-sm text-green-600 font-semibold hover:underline hidden sm:block">
            Shiko të gjitha →
          </a>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {partners.map((partner, i) => (
            <a
              key={partner.id}
              href="/pjese-kembimi"
              className="bg-white border border-gray-200 rounded-2xl p-5 flex flex-col gap-4 hover:border-green-400 hover:shadow-md transition-all group"
            >
              {/* Header */}
              <div className="flex items-center justify-between">
                <div className={`w-12 h-12 ${partnerBg[i]} rounded-xl flex items-center justify-center text-white text-sm font-extrabold shrink-0`}>
                  {partner.logo}
                </div>
                <span className="bg-red-500 text-white text-xs font-extrabold px-2.5 py-1 rounded-lg">
                  -{partner.discount}%
                </span>
              </div>

              {/* Info */}
              <div>
                <p className="font-bold text-gray-900 group-hover:text-green-700 transition-colors">{partner.name}</p>
                <p className="text-sm text-gray-400 mt-0.5">{partner.city}, Shqipëri</p>
              </div>

              {/* Phone */}
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <svg className="w-4 h-4 text-green-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.64 3.45 2 2 0 0 1 3.6 1.27h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L7.91 9a16 16 0 0 0 6 6l1.06-1.06a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 21.73 16z" />
                </svg>
                {partner.phone}
              </div>

              {/* CTA */}
              <div className="mt-auto pt-1 border-t border-gray-100">
                <span className="text-sm font-semibold text-green-600 group-hover:text-green-700">
                  Kërko Pjesën →
                </span>
              </div>
            </a>
          ))}
        </div>
      </div>
    </>
  );
}
