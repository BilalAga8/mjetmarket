import type { MetadataRoute } from "next";
import { supabase } from "@/lib/supabase";

const BASE = "https://www.mjetmarket.com";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  let vehicleUrls: MetadataRoute.Sitemap = [];
  let blogUrls:    MetadataRoute.Sitemap = [];

  try {
    const { data: vehicles } = await supabase
      .from("vehicles")
      .select("id, slug, created_at");
    vehicleUrls = (vehicles ?? []).map((v) => ({
      url: `${BASE}/makina/${v.slug ?? v.id}`,
      lastModified: new Date(v.created_at),
      changeFrequency: "weekly" as const,
      priority: 0.8,
    }));
  } catch { /* vazhdo pa vehicle URLs */ }

  try {
    const { data: posts } = await supabase
      .from("blog_posts")
      .select("slug, date")
      .eq("published", true);
    blogUrls = (posts ?? []).map((p) => ({
      url: `${BASE}/blog/${p.slug}`,
      lastModified: new Date(p.date),
      changeFrequency: "monthly" as const,
      priority: 0.6,
    }));
  } catch { /* vazhdo pa blog URLs */ }

  return [
    { url: BASE,                         lastModified: new Date(), changeFrequency: "daily",   priority: 1.0 },
    { url: `${BASE}/kerko`,              lastModified: new Date(), changeFrequency: "daily",   priority: 0.9 },
    { url: `${BASE}/pjese-kembimi`,      lastModified: new Date(), changeFrequency: "weekly",  priority: 0.85 },
    { url: `${BASE}/kontrollo`,          lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE}/blog`,               lastModified: new Date(), changeFrequency: "weekly",  priority: 0.7 },
    { url: `${BASE}/faq`,                lastModified: new Date(), changeFrequency: "monthly", priority: 0.6 },
    { url: `${BASE}/kontakti`,           lastModified: new Date(), changeFrequency: "monthly", priority: 0.5 },
    ...blogUrls,
    ...vehicleUrls,
  ];
}
