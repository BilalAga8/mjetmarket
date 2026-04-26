import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { createClient } from "@/lib/supabase-server";

export const revalidate = 60;

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const supabase = await createClient();
  const { data } = await supabase
    .from("blog_posts")
    .select("title, excerpt, cover")
    .eq("slug", slug)
    .single();

  if (!data) return {};
  return {
    title: data.title,
    description: data.excerpt,
    openGraph: {
      title: data.title,
      description: data.excerpt,
      images: [{ url: data.cover || "/hero.jpg" }],
    },
  };
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("sq-AL", {
    day: "numeric", month: "long", year: "numeric",
  });
}

function renderContent(content: string) {
  const lines = content.split("\n");
  const elements: React.ReactNode[] = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];

    if (line.startsWith("## ")) {
      elements.push(
        <h2 key={i} className="text-xl font-bold text-gray-900 mt-8 mb-3">
          {line.replace("## ", "")}
        </h2>
      );
    } else if (line.startsWith("| ")) {
      const tableLines: string[] = [];
      while (i < lines.length && lines[i].startsWith("|")) {
        tableLines.push(lines[i]);
        i++;
      }
      const [header, , ...rows] = tableLines;
      const headers = header.split("|").filter(Boolean).map((h) => h.trim());
      elements.push(
        <div key={i} className="overflow-x-auto my-4">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-green-50">
                {headers.map((h, hi) => (
                  <th key={hi} className="border border-gray-200 px-4 py-2 text-left font-semibold text-gray-700">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row, ri) => (
                <tr key={ri} className="even:bg-gray-50">
                  {row.split("|").filter(Boolean).map((cell, ci) => (
                    <td key={ci} className="border border-gray-200 px-4 py-2 text-gray-600">{cell.trim()}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
      continue;
    } else if (line.startsWith("- ")) {
      const items: string[] = [];
      while (i < lines.length && lines[i].startsWith("- ")) {
        items.push(lines[i].replace(/^- /, ""));
        i++;
      }
      elements.push(
        <ul key={i} className="list-disc list-inside space-y-1 my-3 text-gray-600 text-sm">
          {items.map((item, ii) => {
            const parts = item.split(/\*\*(.+?)\*\*/);
            return (
              <li key={ii}>
                {parts.map((p, pi) => pi % 2 === 1 ? <strong key={pi}>{p}</strong> : p)}
              </li>
            );
          })}
        </ul>
      );
      continue;
    } else if (line.match(/^\d+\. /)) {
      const items: string[] = [];
      while (i < lines.length && lines[i].match(/^\d+\. /)) {
        items.push(lines[i].replace(/^\d+\. /, ""));
        i++;
      }
      elements.push(
        <ol key={i} className="list-decimal list-inside space-y-1 my-3 text-gray-600 text-sm">
          {items.map((item, ii) => {
            const parts = item.split(/\*\*(.+?)\*\*/);
            return (
              <li key={ii}>
                {parts.map((p, pi) => pi % 2 === 1 ? <strong key={pi}>{p}</strong> : p)}
              </li>
            );
          })}
        </ol>
      );
      continue;
    } else if (line.startsWith("---")) {
      elements.push(<hr key={i} className="my-8 border-gray-200" />);
    } else if (line.trim() !== "") {
      const parts = line.split(/\*\*(.+?)\*\*/);
      elements.push(
        <p key={i} className="text-gray-600 text-sm leading-relaxed my-2">
          {parts.map((p, pi) => pi % 2 === 1 ? <strong key={pi} className="text-gray-800">{p}</strong> : p)}
        </p>
      );
    }
    i++;
  }

  return elements;
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const supabase = await createClient();

  const { data: post } = await supabase
    .from("blog_posts")
    .select("*")
    .eq("slug", slug)
    .eq("published", true)
    .single();

  if (!post) notFound();

  const { data: related } = await supabase
    .from("blog_posts")
    .select("slug, title, category, cover")
    .eq("published", true)
    .neq("slug", slug)
    .limit(2);

  return (
    <main className="max-w-3xl mx-auto px-4 sm:px-6 py-14">
      <Link href="/blog" className="inline-flex items-center gap-1.5 text-xs text-gray-400 hover:text-gray-700 transition-colors mb-8">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <polyline points="15 18 9 12 15 6" />
        </svg>
        Kthehu te Blogu
      </Link>

      <span className="inline-block bg-green-50 text-green-600 text-xs font-semibold px-3 py-1 rounded-full mb-4">
        {post.category}
      </span>
      <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 leading-tight mb-3">
        {post.title}
      </h1>
      <p className="text-xs text-gray-400 mb-6">{formatDate(post.date)} · {post.read_min} min lexim</p>

      <div className="rounded-2xl overflow-hidden mb-8 h-56 sm:h-72 bg-gray-100">
        <img src={post.cover || "/hero.jpg"} alt={post.title} className="w-full h-full object-cover" />
      </div>

      <article>{renderContent(post.content)}</article>

      {related && related.length > 0 && (
        <div className="mt-14 pt-10 border-t border-gray-100">
          <h2 className="text-sm font-semibold text-gray-900 mb-5">Lexo gjithashtu</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {related.map((r) => (
              <Link key={r.slug} href={`/blog/${r.slug}`}
                className="group flex gap-3 p-4 rounded-xl border border-gray-100 hover:border-green-200 hover:bg-green-50 transition-colors">
                <div className="w-16 h-16 rounded-xl bg-gray-100 overflow-hidden shrink-0">
                  <img src={r.cover || "/hero.jpg"} alt={r.title} className="w-full h-full object-cover" />
                </div>
                <div className="flex flex-col justify-center">
                  <p className="text-xs text-green-600 font-semibold mb-0.5">{r.category}</p>
                  <p className="text-xs font-bold text-gray-800 group-hover:text-green-700 transition-colors leading-snug line-clamp-2">{r.title}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      <div className="mt-12 bg-green-50 rounded-2xl p-6 text-center">
        <p className="text-sm font-bold text-gray-900 mb-1">Gati për të vepruar?</p>
        <p className="text-xs text-gray-500 mb-4">Kërko mjetin tënd ideal ose publiko njoftimin tënd sot.</p>
        <div className="flex justify-center gap-3 flex-wrap">
          <Link href="/kerko" className="bg-green-500 hover:bg-green-600 text-white text-xs font-semibold px-5 py-2.5 rounded-xl transition-colors">
            Kërko Makina
          </Link>
          <Link href="/profili/shto-mjet" className="bg-white border border-gray-200 hover:border-green-400 text-gray-700 text-xs font-semibold px-5 py-2.5 rounded-xl transition-colors">
            Shto Njoftim
          </Link>
        </div>
      </div>
    </main>
  );
}
