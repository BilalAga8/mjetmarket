import type { Metadata } from "next";
import { Suspense } from "react";
import PjeseKembimiClient from "./PjeseKembimiClient";
import { partCategories } from "../../data/partCategories";
import { createClient } from "@/lib/supabase-server";
import ServiceCard from "../../components/ServiceCard";

const BASE = "https://www.mjetmarket.com";

interface PageProps {
  searchParams: Promise<{ category?: string; quality?: string; make?: string }>;
}

export async function generateMetadata({ searchParams }: PageProps): Promise<Metadata> {
  const { category, quality, make } = await searchParams;

  const qualityLabel: Record<string, string> = {
    oem: "OEM Origjinale", ekuivalente: "Ekuivalente", ekonomike: "Ekonomike",
  };

  let title = "Pjesë Këmbimi & Servise Auto | MjetMarket";
  let description =
    "Porosit pjesë këmbimi dhe gjej servise të besuara për makinën tënde në Shqipëri. Filtra OEM, ekuivalente dhe ekonomike.";

  if (category && make) {
    title = `${category} për ${make} — Çmimi dhe Oferta | MjetMarket`;
    description = `Gjej ${category.toLowerCase()} të përshtatshme për ${make} me çmimin më të mirë në Shqipëri. OEM dhe ekuivalente.`;
  } else if (category) {
    title = `${category} — Çmimi dhe Oferta | MjetMarket`;
    description = `Porosit ${category.toLowerCase()} cilësor për makinën tënde. Oferta nga dyqane të besuara në Shqipëri.`;
  } else if (quality) {
    title = `Pjesë Këmbimi ${qualityLabel[quality] ?? quality} | MjetMarket`;
    description = `Blen pjesë këmbimi ${(qualityLabel[quality] ?? quality).toLowerCase()} për makinën tënde. Çmime konkurruese, dërgesë në të gjithë Shqipërinë.`;
  }

  const canonical = category
    ? `${BASE}/pjese-kembimi?category=${encodeURIComponent(category)}`
    : `${BASE}/pjese-kembimi`;

  return {
    title,
    description,
    keywords: [
      "pjese kembimi makine", "auto parts shqiperi", "servis makine shqiperi",
      "spare parts shqiperi", "filtro vaji", "cubeta frenash", "amortizatore",
      ...(category ? [category.toLowerCase(), `${category.toLowerCase()} shqiperi`] : []),
      ...(make ? [`${make.toLowerCase()} pjese kembimi`, `${make.toLowerCase()} servis shqiperi`] : []),
    ],
    openGraph: {
      title,
      description,
      url: canonical,
      type: "website",
      siteName: "MjetMarket",
      locale: "sq_AL",
      images: [{ url: `${BASE}/hero.jpg`, width: 1200, height: 630, alt: title }],
    },
    alternates: { canonical },
  };
}

export const revalidate = 0;

interface Service { id: number; name: string; city: string; phone: string; category: string; }

export default async function PjeseKembimiPage({ searchParams }: PageProps) {
  const { category, quality } = await searchParams;
  const supabase = await createClient();

  const [{ data: servicesData }, { data: productsData }] = await Promise.all([
    supabase.from("services").select("*").order("verified", { ascending: false }).order("name"),
    supabase.from("products").select("*").eq("is_active", true).order("created_at", { ascending: false }),
  ]);

  const services = servicesData ?? [];
  const products = productsData ?? [];

  // JSON-LD: BreadcrumbList
  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Kreu", item: BASE },
      { "@type": "ListItem", position: 2, name: "Pjesë Këmbimi", item: `${BASE}/pjese-kembimi` },
      ...(category ? [{ "@type": "ListItem", position: 3, name: category, item: `${BASE}/pjese-kembimi?category=${encodeURIComponent(category)}` }] : []),
    ],
  };

  // JSON-LD: ItemList for products
  const productJsonLd = products.length > 0 ? {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: category ? `${category} — MjetMarket` : "Pjesë Këmbimi — MjetMarket",
    url: `${BASE}/pjese-kembimi`,
    numberOfItems: products.length,
    itemListElement: products.slice(0, 20).map((p, i) => ({
      "@type": "ListItem",
      position: i + 1,
      item: {
        "@type": "Product",
        name: p.name,
        description: `${p.category}${p.oem_code ? ` — Kodi OEM: ${p.oem_code}` : ""}`,
        brand: p.compatible_makes?.length ? { "@type": "Brand", name: p.compatible_makes[0] } : undefined,
        offers: (p.price_from || p.price_to) ? {
          "@type": "AggregateOffer",
          lowPrice: p.price_from ?? p.price_to,
          highPrice: p.price_to ?? p.price_from,
          priceCurrency: "EUR",
          offerCount: p.shops_count ?? 1,
          availability: "https://schema.org/InStock",
        } : undefined,
      },
    })),
  } : null;

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      {productJsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }}
        />
      )}

      <Suspense fallback={
        <PjeseKembimiClient
          categories={partCategories}
          services={services as Service[]}
          products={[]}
          initialCategory={category}
          initialQuality={quality}
        />
      }>
        <PjeseKembimiClient
          categories={partCategories}
          services={services as Service[]}
          products={products}
          initialCategory={category}
          initialQuality={quality}
        />
      </Suspense>

      {/* Seksioni i serviseve */}
      <div className="bg-gray-50 border-t border-gray-200 py-12 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center gap-3 mb-6">
            <div>
              <h2 className="text-2xl font-extrabold text-gray-900">Ku ta instalosh?</h2>
              <p className="text-gray-500 text-sm mt-0.5">
                Servise të besuara ku mund të çosh makinën pas porosisë
              </p>
            </div>
          </div>
          {services.length === 0 ? (
            <p className="text-gray-400 text-sm">Nuk ka servise të regjistruara ende.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {services.map((s) => (
                <ServiceCard key={s.id} service={s} />
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
