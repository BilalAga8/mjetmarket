import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { vehicles } from "../../data/vehicles";
import CarListItem from "../../components/CarListItem";
import KerkoFilters from "../../components/KerkoFilters";

export const metadata: Metadata = {
  title: "Kërko Makina",
  description: "Kërko dhe filtro mijëra makina të përdorura dhe të reja në Shqipëri. BMW, Mercedes, Audi, Toyota dhe shumë të tjera.",
  keywords: ["kërko makina shqiperi", "makina te perdorura", "auto okazion", "makina te lira shqiperi", "blej makine shqiperi"],
};

export default async function KerkoPage({
  searchParams,
}: {
  readonly searchParams: Promise<{ [key: string]: string | undefined }>;
}) {
  const { q, fuel, year, maxPrice, maxKm, transmission } = await searchParams;

  const filtered = vehicles.filter((c) => {
    if (q) {
      const search = q.toLowerCase();
      const match = `${c.brand} ${c.model}`.toLowerCase();
      if (!match.includes(search)) return false;
    }
    if (fuel && c.fuel !== fuel) return false;
    if (transmission && c.transmission !== transmission) return false;
    if (year && c.year < Number(year)) return false;
    if (maxPrice && c.price > Number(maxPrice)) return false;
    if (maxKm && c.km > Number(maxKm)) return false;
    return true;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 py-6 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          <Link href="/" className="text-sm text-gray-400 hover:text-green-600 transition-colors flex items-center gap-1 mb-3">
            ← Kthehu
          </Link>
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div>
              <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight">Kërko Mjete</h1>
              <p className="text-gray-500 text-sm mt-0.5">{filtered.length} rezultate u gjetën</p>
            </div>
            {q && (
              <span className="bg-green-100 text-green-700 text-sm font-semibold px-4 py-1.5 rounded-full">
                &ldquo;{q}&rdquo;
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 flex flex-col md:flex-row gap-6">
        {/* Filters sidebar */}
        <Suspense fallback={null}>
          <KerkoFilters />
        </Suspense>

        {/* Results */}
        <div className="flex-1 min-w-0">
          {filtered.length === 0 ? (
            <div className="text-center py-24 text-gray-400 bg-white rounded-2xl border border-gray-200">
              <p className="text-2xl font-semibold mb-2 text-gray-700">Asnjë rezultat</p>
              <p className="text-sm mb-6">Provo të ndryshosh filtrat</p>
              <Link href="/kerko" className="bg-green-600 hover:bg-green-700 text-white font-semibold px-6 py-3 rounded-xl transition-colors">
                Pastro filtrat
              </Link>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {filtered.map((car) => (
                <CarListItem key={car.id} car={car} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
