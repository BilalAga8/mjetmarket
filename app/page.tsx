import CarBrowser from "../components/CarBrowser";
import { supabase } from "../lib/supabase";
import type { Vehicle } from "../data/vehicles";

export const revalidate = 0;

const websiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "MjetMarket",
  url: "https://www.mjetmarket.com",
  description: "Platforma kryesore për blerjen dhe shitjen e makinave në Shqipëri.",
  inLanguage: "sq",
  potentialAction: {
    "@type": "SearchAction",
    target: { "@type": "EntryPoint", urlTemplate: "https://www.mjetmarket.com/kerko?q={search_term_string}" },
    "query-input": "required name=search_term_string",
  },
};

const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "MjetMarket",
  url: "https://www.mjetmarket.com",
  logo: "https://www.mjetmarket.com/icon.svg",
  description: "Platforma kryesore për blerjen dhe shitjen e makinave në Shqipëri.",
  address: { "@type": "PostalAddress", addressCountry: "AL" },
  sameAs: [],
};

export default async function Home() {
  const [{ data: vehicleData }, { data: shopData }] = await Promise.all([
    supabase.from("vehicles").select("*").order("created_at", { ascending: false }),
    supabase.from("shops").select("*").order("package").order("name"),
  ]);

  const vehicles = (vehicleData ?? []).map((v) => ({
    ...v,
    image: v.images?.[0] ?? "",
    engineCC: v.engine_cc ?? 0,
    tireCondition: v.tire_condition ?? undefined,
    images: v.images ?? [],
    features: v.features ?? [],
  }));

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }} />
      <CarBrowser cars={vehicles as unknown as Vehicle[]} shops={shopData ?? []} />
    </>
  );
}
