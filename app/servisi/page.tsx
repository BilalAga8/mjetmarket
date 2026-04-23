import type { Metadata } from "next";
import Link from "next/link";
import { createClient } from "@/lib/supabase-server";
import ServiceCard from "../../components/ServiceCard";

export const metadata: Metadata = {
  title: "Servise & Partnerë",
  description: "Gjej servise të besuara për makinën tënde në Shqipëri. Servis mekanik, elektrik, bojaxhi, xhama dhe aksesore.",
  keywords: ["servis makine shqiperi", "servis mekanik tirane", "riparim makine", "bojaxhi makine", "servis auto shqiperi"],
};

export const revalidate = 0;

const categories = [
  "Servis Mekanik",
  "Elektrik & Elektronikë",
  "Bojaxhi",
  "Veshje & Tapeçi",
  "Xhama",
  "Aksesore",
];

const categoryIcons: Record<string, string> = {
  "Servis Mekanik":         "🔧",
  "Elektrik & Elektronikë": "⚡",
  "Bojaxhi":                "🎨",
  "Veshje & Tapeçi":        "🪑",
  "Xhama":                  "🪟",
  "Aksesore":               "🛠️",
  "Tjetër":                 "📦",
};

export default async function ServisiPage() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("services")
    .select("*")
    .order("verified", { ascending: false })
    .order("name");

  const services = data ?? [];
  const verified   = services.filter((s) => s.verified);
  const unverified = services.filter((s) => !s.verified);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 py-10 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto">
          <Link href="/" className="text-sm text-gray-400 hover:text-green-600 transition-colors flex items-center gap-1 mb-4">
            ← Kthehu
          </Link>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight mb-1">
            Servise & Partnerë
          </h1>
          <p className="text-gray-500 text-sm">
            Gjej servise të besuara dhe partnerë profesionalë për makinën tënde
          </p>

          <div className="flex flex-wrap gap-2 mt-5">
            {categories.map((cat) => (
              <span key={cat}
                className="flex items-center gap-1.5 bg-gray-100 text-gray-600 text-xs font-medium px-3 py-1.5 rounded-full border border-gray-200">
                {categoryIcons[cat]} {cat}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-10">

        {/* Partnerë të verifikuar */}
        <div className="mb-10">
          <div className="flex items-center gap-3 mb-5">
            <h2 className="text-xl font-bold text-gray-900">Partnerë të Verifikuar</h2>
            <span className="h-px flex-1 bg-gray-200" />
            <span className="text-xs text-green-600 font-semibold bg-green-50 px-3 py-1 rounded-full">
              ★ {verified.length} partnerë
            </span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {verified.map((s) => (
              <ServiceCard key={s.id} service={s} />
            ))}
          </div>
        </div>

        {/* Të tjera */}
        {unverified.length > 0 && (
          <div>
            <div className="flex items-center gap-3 mb-5">
              <h2 className="text-xl font-bold text-gray-900">Servise të Tjera</h2>
              <span className="h-px flex-1 bg-gray-200" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {unverified.map((s) => (
                <ServiceCard key={s.id} service={s} />
              ))}
            </div>
          </div>
        )}

        {/* CTA */}
        <div className="mt-14 bg-green-600 rounded-2xl p-8 text-center">
          <h3 className="text-white text-xl font-bold mb-2">Ke një servis dhe dëshiron të bëhesh partner?</h3>
          <p className="text-green-100 text-sm mb-6 max-w-md mx-auto">
            Regjistro biznesin tënd dhe arrihu mijëra klientë që kërkojnë shërbime çdo ditë.
          </p>
          <Link href="/kontakti"
            className="bg-white text-green-700 font-bold px-6 py-3 rounded-xl hover:bg-green-50 transition-colors inline-block text-sm">
            Na Kontakto
          </Link>
        </div>

      </div>
    </div>
  );
}
