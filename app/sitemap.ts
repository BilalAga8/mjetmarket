import type { MetadataRoute } from "next";
import { supabase } from "@/lib/supabase";

const BASE = "https://www.mjetmarket.com";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const { data: vehicles } = await supabase
    .from("vehicles")
    .select("id, slug, created_at");

  const vehicleUrls = (vehicles ?? []).map((v) => ({
    url: `${BASE}/makina/${v.slug ?? v.id}`,
    lastModified: new Date(v.created_at),
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  return [
    { url: BASE,                          lastModified: new Date(), changeFrequency: "daily",   priority: 1.0 },
    { url: `${BASE}/kerko`,               lastModified: new Date(), changeFrequency: "daily",   priority: 0.9 },
    { url: `${BASE}/servisi`,             lastModified: new Date(), changeFrequency: "weekly",  priority: 0.7 },
    { url: `${BASE}/pjese-kembimi`,       lastModified: new Date(), changeFrequency: "weekly",  priority: 0.7 },
    { url: `${BASE}/kontakti`,            lastModified: new Date(), changeFrequency: "monthly", priority: 0.5 },
    ...vehicleUrls,
  ];
}
