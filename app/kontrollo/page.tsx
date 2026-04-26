import type { Metadata } from "next";
import { createClient } from "@/lib/supabase-server";
import VinClient from "./VinClient";

const BASE = "https://www.mjetmarket.com";

export const metadata: Metadata = {
  title: "Kontrollo Makinën me VIN — Falas | MjetMarket",
  description:
    "Fut numrin e shasisë (VIN) dhe merr menjëherë rekomandimet e vajit, filtrave dhe servisit për makinën tënde. Falas, pa regjistrim.",
  keywords: [
    "kontrollo makinen vin", "vin decoder shqiperi", "cfar vaji i duhet makines",
    "rekomandime servis makine", "vin shqiperi", "numri i shasise makine",
    "ndërrimi vajit makine", "filtri vaji makine shqiperi", "intervali servisit",
    "vin checker shqiperi", "kontrollo shasisin", "mjetmarket vin tool",
  ],
  openGraph: {
    title: "Kontrollo Makinën me VIN — Falas | MjetMarket",
    description:
      "Fut VIN-in dhe merr rekomandimet e plota: vaji, filtrat, intervali i servisit. Falas për çdo makinë.",
    url: `${BASE}/kontrollo`,
    type: "website",
    siteName: "MjetMarket",
    locale: "sq_AL",
    images: [{ url: `${BASE}/hero.jpg`, width: 1200, height: 630, alt: "MjetMarket VIN Tool" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Kontrollo Makinën me VIN — Falas | MjetMarket",
    description: "Fut VIN-in dhe merr rekomandimet e vajit, filtrave dhe servisit. Falas.",
    images: [`${BASE}/hero.jpg`],
  },
  alternates: { canonical: `${BASE}/kontrollo` },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebApplication",
      "@id": `${BASE}/kontrollo#app`,
      name: "VIN Checker — MjetMarket",
      description:
        "Kontrollo makinën tënde me numrin e shasisë dhe merr rekomandimet e plota të servisit falas.",
      url: `${BASE}/kontrollo`,
      applicationCategory: "AutomotiveApplication",
      operatingSystem: "Web Browser",
      inLanguage: "sq",
      offers: {
        "@type": "Offer",
        price: "0",
        priceCurrency: "EUR",
        availability: "https://schema.org/InStock",
      },
      provider: {
        "@type": "Organization",
        name: "MjetMarket",
        url: BASE,
      },
    },
    {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Kreu", item: BASE },
        { "@type": "ListItem", position: 2, name: "Kontrollo VIN", item: `${BASE}/kontrollo` },
      ],
    },
    {
      "@type": "FAQPage",
      mainEntity: [
        {
          "@type": "Question",
          name: "Çfarë është numri VIN i makinës?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "VIN (Vehicle Identification Number) është numri unik 17-karakterësh i makinës. Gjendet në kartën gri të regjistrimit ose brenda derës së shoferit.",
          },
        },
        {
          "@type": "Question",
          name: "Çfarë vaji i duhet makinës sime?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Fut VIN-in e makinës tënde dhe MjetMarket VIN Tool tregon automatikisht llojin dhe viskozitetin e duhur të vajit sipas specifikimeve të prodhuesit.",
          },
        },
        {
          "@type": "Question",
          name: "Sa kushton kontrolli VIN?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Kontrolli VIN në MjetMarket është plotësisht falas, pa regjistrim dhe pa limit kërkimesh.",
          },
        },
      ],
    },
  ],
};

export default async function KontrolloPage() {
  const supabase = await createClient();
  const { data: services } = await supabase
    .from("services")
    .select("id, name, city, phone")
    .order("name");

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <VinClient services={services ?? []} />
    </>
  );
}
