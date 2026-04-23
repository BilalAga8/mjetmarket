import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin/", "/profili/", "/auth/"],
    },
    sitemap: "https://www.mjetmarket.com/sitemap.xml",
  };
}
