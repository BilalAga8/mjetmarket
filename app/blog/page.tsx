import Link from "next/link";
import type { Metadata } from "next";
import { createClient } from "@/lib/supabase-server";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Blog — Këshilla Makine & Auto Tips",
  description:
    "Këshilla për blerjen dhe shitjen e makinave, mirëmbajtjen e mjetit dhe gjithçka rreth tregut auto shqiptar.",
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("sq-AL", {
    day: "numeric", month: "long", year: "numeric",
  });
}

export default async function BlogPage() {
  const supabase = await createClient();
  const { data: posts } = await supabase
    .from("blog_posts")
    .select("id, slug, title, excerpt, category, date, read_min, cover")
    .eq("published", true)
    .order("date", { ascending: false });

  const allPosts = posts ?? [];
  const [featured, ...rest] = allPosts;

  return (
    <main className="max-w-5xl mx-auto px-4 sm:px-6 py-14">
      <div className="mb-10">
        <span className="inline-block bg-green-50 text-green-600 text-xs font-semibold px-3 py-1 rounded-full mb-3 uppercase tracking-wide">
          Blog
        </span>
        <h1 className="text-3xl font-extrabold text-gray-900 mb-2">Këshilla & Udhëzime Auto</h1>
        <p className="text-gray-500 text-sm">
          Artikuj për blerës, shitës dhe çdokush që dëshiron të kujdeset mirë për mjetin e tij.
        </p>
      </div>

      {allPosts.length === 0 && (
        <p className="text-gray-400 text-sm text-center py-20">Asnjë artikull akoma. Kthehu shpejt!</p>
      )}

      {featured && (
        <Link
          href={`/blog/${featured.slug}`}
          className="group block rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-md transition-shadow mb-10"
        >
          <div className="relative h-56 sm:h-72 bg-gray-100 overflow-hidden">
            <img
              src={featured.cover || "/hero.jpg"}
              alt={featured.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <span className="absolute top-4 left-4 bg-green-500 text-white text-xs font-semibold px-3 py-1 rounded-full">
              {featured.category}
            </span>
          </div>
          <div className="p-6 bg-white">
            <p className="text-xs text-gray-400 mb-1">{formatDate(featured.date)} · {featured.read_min} min lexim</p>
            <h2 className="text-xl font-extrabold text-gray-900 group-hover:text-green-600 transition-colors mb-2">
              {featured.title}
            </h2>
            <p className="text-sm text-gray-500 leading-relaxed">{featured.excerpt}</p>
          </div>
        </Link>
      )}

      {rest.length > 0 && (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {rest.map((post) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="group flex flex-col rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-md transition-shadow bg-white"
            >
              <div className="relative h-44 bg-gray-100 overflow-hidden">
                <img
                  src={post.cover || "/hero.jpg"}
                  alt={post.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <span className="absolute top-3 left-3 bg-white text-green-600 text-xs font-semibold px-2.5 py-0.5 rounded-full border border-green-100">
                  {post.category}
                </span>
              </div>
              <div className="p-4 flex flex-col flex-1">
                <p className="text-xs text-gray-400 mb-1">{formatDate(post.date)} · {post.read_min} min</p>
                <h3 className="text-sm font-bold text-gray-900 group-hover:text-green-600 transition-colors leading-snug mb-2 flex-1">
                  {post.title}
                </h3>
                <p className="text-xs text-gray-500 line-clamp-2">{post.excerpt}</p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </main>
  );
}
