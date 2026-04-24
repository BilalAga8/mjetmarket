import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { createClient } from "@/lib/supabase-server";
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

  const supabase = await createClient();
  let query = supabase
    .from("vehicles")
    .select("id, brand, model, year, price, images, fuel, km, hp, color, transmission, city")
    .order("created_at", { ascending: false });

  if (q) query = query.or(`brand.ilike.%${q}%,model.ilike.%${q}%`);
  if (fuel) query = query.eq("fuel", fuel);
  if (transmission) query = query.eq("transmission", transmission);
  if (year) query = query.gte("year", Number(year));
  if (maxPrice) query = query.lte("price", Number(maxPrice));
  if (maxKm) query = query.lte("km", Number(maxKm));

  const { data: vehicles } = await query;
  const results = vehicles ?? [];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200 py-6 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          <Link href="/" className="text-sm text-gray-400 hover:text-green-600 transition-colors flex items-center gap-1 mb-3">
            ← Kthehu
          </Link>
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div>
              <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight">Kërko Mjete</h1>
              <p className="text-gray-500 text-sm mt-0.5">{results.length} rezultate u gjetën</p>
            </div>
            {q && (
              <span className="bg-green-100 text-green-700 text-sm font-semibold px-4 py-1.5 rounded-full">
                &ldquo;{q}&rdquo;
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 flex flex-col md:flex-row gap-6">
        <Suspense fallback={null}>
          <KerkoFilters />
        </Suspense>

        <div className="flex-1 min-w-0">
          {results.length === 0 ? (
            <div className="text-center py-24 text-gray-400 bg-white rounded-2xl border border-gray-200">
              <p className="text-2xl font-semibold mb-2 text-gray-700">Asnjë rezultat</p>
              <p className="text-sm mb-6">Provo të ndryshosh filtrat</p>
              <Link href="/kerko" className="bg-green-600 hover:bg-green-700 text-white font-semibold px-6 py-3 rounded-xl transition-colors">
                Pastro filtrat
              </Link>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {results.map((car) => (
                <CarListItem key={car.id} car={car} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
