import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { supabase } from "../../../lib/supabase";

export async function generateMetadata({ params }: { readonly params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-/.test(id);
  const { data: car } = await (isUUID
    ? supabase.from("vehicles").select("brand,model,year,price,images,description").eq("id", id).single()
    : supabase.from("vehicles").select("brand,model,year,price,images,description").eq("slug", id).single());
  if (!car) return { title: "Mjet | MjetMarket" };
  const title = `${car.brand} ${car.model} ${car.year} — ${car.price.toLocaleString()} €`;
  const description = car.description || `${car.brand} ${car.model} ${car.year}, ${car.price.toLocaleString()} € në MjetMarket.`;
  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: car.images?.[0] ? [{ url: car.images[0] }] : [],
      type: "website",
    },
  };
}
import CarGallery from "../../../components/CarGallery";
import CarCard from "../../../components/CarCard";
import ContactButtons from "../../../components/ContactModal";
import LoanCalculator from "../../../components/LoanCalculator";
import Link from "next/link";

export const revalidate = 0;

export default async function CarPage({
  params,
}: {
  readonly params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-/.test(id);

  const { data: car } = await (isUUID
    ? supabase.from("vehicles").select("*").eq("id", id).single()
    : supabase.from("vehicles").select("*").eq("slug", id).single());

  if (!car) notFound();

  const { data: similarData } = await supabase
    .from("vehicles")
    .select("*")
    .eq("category", car.category)
    .neq("id", id)
    .limit(4);

  const similar = (similarData ?? []).map((v) => ({
    ...v,
    image: v.images?.[0] ?? "",
    engineCC: v.engine_cc ?? 0,
    tireCondition: v.tire_condition ?? undefined,
    images: v.images ?? [],
    features: v.features ?? [],
  }));

  const exchangeLabel: Record<string, string> = {
    "apartament":    "Me Apartament",
    "makine-madhe":  "Me Makinë të Madhe",
    "tjeter":        "Me Tjetër",
  };

  const stats = [
    { label: "Kilometrat",      value: `${car.km?.toLocaleString()} km` },
    { label: "Karburanti",      value: car.fuel },
    { label: "Fuqia",           value: `${car.hp} HP` },
    { label: "Motori",          value: `${car.engine_cc} cc` },
    { label: "Konsumi",         value: `${car.consumption} L/100km` },
    { label: "Kambio",          value: car.transmission },
    { label: "Dyert",           value: car.doors ? `${car.doors} dyer` : "—" },
    { label: "Viti",            value: String(car.year) },
    { label: "Origjina",        value: car.origin || "—" },
    { label: "Gjendja",         value: "Used" },
    { label: "Vendndodhja",     value: car.city || "—" },
    { label: "Goma",            value: car.tire_condition ? `${car.tire_condition}%` : "—" },
    { label: "Makina Ndrrohet", value: car.exchange ? exchangeLabel[car.exchange] ?? car.exchange : "Nuk Ndrrohet" },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        <Link href="/" className="inline-flex items-center gap-1 text-sm text-gray-400 hover:text-green-600 mb-6 transition-colors">
          ← Kthehu
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <CarGallery images={car.images ?? []} />

          <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
            <div className="flex items-start justify-between gap-3 mb-1">
              <h1 className="text-2xl font-extrabold text-gray-900 leading-tight">
                {car.brand} {car.model}
              </h1>
              {car.sponsored && (
                <span className="shrink-0 bg-yellow-100 text-yellow-700 text-xs font-bold px-2.5 py-1 rounded-full">
                  ★ Sponsored
                </span>
              )}
            </div>
            <p className="text-2xl font-bold text-green-600 mb-5">
              {car.price?.toLocaleString()} €
            </p>

            <div className="grid grid-cols-2 gap-2 mb-6">
              {stats.map((s) => (
                <div key={s.label} className="bg-gray-50 rounded-xl p-3 border border-gray-100">
                  <p className="text-xs text-gray-400 uppercase tracking-wide mb-0.5">{s.label}</p>
                  <p className="text-sm font-bold text-gray-800">{s.value}</p>
                </div>
              ))}
            </div>

            <ContactButtons brand={car.brand} model={car.model} vehicleId={car.id} />
          </div>
        </div>

        {/* Opsionet */}
        {car.features?.length > 0 && (
          <div className="mt-8 bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Opsionet & Pajisjet</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
              {car.features.map((f: string) => (
                <div key={f} className="flex items-center gap-2 bg-gray-50 border border-gray-100 rounded-xl px-3 py-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-500 shrink-0" />
                  <span className="text-sm text-gray-700">{f}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Përshkrimi */}
        {car.description && (
          <div className="mt-6 bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
            <h2 className="text-lg font-bold text-gray-900 mb-2">Përshkrimi</h2>
            <p className="text-sm text-gray-600 leading-relaxed">{car.description}</p>
          </div>
        )}

        <div id="kalkulator">
          <LoanCalculator price={car.price} />
        </div>

        {similar.length > 0 && (
          <div className="mt-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Mjete të Ngjashme</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {similar.map((v) => (
                <CarCard key={v.id} car={v as never} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
