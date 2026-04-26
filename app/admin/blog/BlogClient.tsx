"use client";

import { useState, useTransition } from "react";
import { addPost, updatePost, deletePost } from "./actions";
import { createClient } from "@/lib/supabase-browser";

const supabase = createClient();

async function uploadCover(file: File): Promise<string> {
  const ext  = file.name.split(".").pop();
  const path = `blog/${Date.now()}.${ext}`;
  const { error } = await supabase.storage.from("vehicle-images").upload(path, file, { upsert: true });
  if (error) throw new Error(error.message);
  const { data: { publicUrl } } = supabase.storage.from("vehicle-images").getPublicUrl(path);
  return publicUrl;
}

type Post = {
  id: number;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  cover: string;
  read_min: number;
  published: boolean;
  date: string;
};

const categories = [
  "Këshilla Blerësi",
  "Këshilla Shitësi",
  "Mirëmbajtje",
  "Lajme Auto",
  "Udhëzues",
];

const emptyForm = {
  title: "", excerpt: "", content: "", category: "Këshilla Blerësi",
  cover: "", read_min: "4", published: "true",
};

function PostForm({
  initial,
  onSubmit,
  onCancel,
  pending,
}: {
  initial: typeof emptyForm;
  onSubmit: (fd: FormData) => void;
  onCancel: () => void;
  pending: boolean;
}) {
  const inputCls = "w-full bg-gray-800 border border-gray-700 text-white rounded-xl px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-green-500 placeholder:text-gray-600";
  const labelCls = "text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1 block";

  const [coverUrl, setCoverUrl]       = useState(initial.cover);
  const [uploading, setUploading]     = useState(false);
  const [uploadError, setUploadError] = useState("");

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true); setUploadError("");
    try {
      const url = await uploadCover(file);
      setCoverUrl(url);
    } catch {
      setUploadError("Gabim gjatë ngarkimit. Provo përsëri.");
    } finally {
      setUploading(false);
    }
  }

  return (
    <form action={onSubmit} className="flex flex-col gap-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="md:col-span-2">
          <label className={labelCls}>Titulli *</label>
          <input name="title" required defaultValue={initial.title}
            placeholder="Titulli i artikullit..." className={inputCls} />
        </div>
        <div>
          <label className={labelCls}>Kategoria *</label>
          <select name="category" defaultValue={initial.category} className={inputCls}>
            {categories.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className={labelCls}>Min Lexim</label>
            <input name="read_min" type="number" min={1} max={30} defaultValue={initial.read_min} className={inputCls} />
          </div>
          <div>
            <label className={labelCls}>Publikuar</label>
            <select name="published" defaultValue={initial.published} className={inputCls}>
              <option value="true">Po — Publik</option>
              <option value="false">Jo — Draft</option>
            </select>
          </div>
        </div>

        {/* Cover photo upload */}
        <div className="md:col-span-2">
          <label className={labelCls}>Foto Cover</label>
          <input type="hidden" name="cover" value={coverUrl} />
          <div className="flex gap-3 items-start">
            {coverUrl && (
              <div className="w-24 h-16 rounded-xl overflow-hidden shrink-0 bg-gray-800">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={coverUrl} alt="cover" className="w-full h-full object-cover" />
              </div>
            )}
            <div className="flex-1">
              <label className={`flex items-center gap-2 cursor-pointer px-4 py-2.5 rounded-xl border border-dashed border-gray-600 hover:border-green-500 transition-colors text-sm ${uploading ? "opacity-50" : ""}`}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/>
                </svg>
                <span className="text-gray-400">{uploading ? "Duke ngarkuar..." : coverUrl ? "Ndrysho foton" : "Ngarko foto nga PC"}</span>
                <input type="file" accept="image/*" onChange={handleFileChange} disabled={uploading} className="hidden" />
              </label>
              {uploadError && <p className="text-red-400 text-xs mt-1">{uploadError}</p>}
              {coverUrl && !uploading && <p className="text-green-400 text-xs mt-1">✓ Foto u ngarkua</p>}
            </div>
          </div>
        </div>
        <div className="md:col-span-2">
          <label className={labelCls}>Përmbledhja (excerpt) *</label>
          <textarea name="excerpt" required rows={2} defaultValue={initial.excerpt}
            placeholder="1-2 fjali që përshkruajnë artikullin..." className={`${inputCls} resize-none`} />
        </div>
        <div className="md:col-span-2">
          <label className={labelCls}>Contenuti *</label>
          <textarea name="content" required rows={18} defaultValue={initial.content}
            placeholder={`Shkruaj artikullin këtu. Mbështet formatim:\n## Titulli i seksionit\n**tekst bold**\n- listë\n---`}
            className={`${inputCls} resize-y font-mono text-xs leading-relaxed`} />
          <p className="text-xs text-gray-600 mt-1">Përdor ## për tituj, **bold**, - për lista, --- për ndarje</p>
        </div>
      </div>
      <div className="flex gap-3 justify-end pt-2">
        <button type="button" onClick={onCancel}
          className="px-4 py-2 text-sm text-gray-400 hover:text-white transition-colors">
          Anulo
        </button>
        <button type="submit" disabled={pending}
          className="bg-green-500 hover:bg-green-600 disabled:opacity-60 text-white text-sm font-semibold px-5 py-2 rounded-xl transition-colors">
          {pending ? "Duke ruajtur..." : "Ruaj Artikullin"}
        </button>
      </div>
    </form>
  );
}

export default function BlogClient({ initialPosts }: { initialPosts: Post[] }) {
  const [posts, setPosts] = useState(initialPosts);
  const [showAdd, setShowAdd] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleAdd(fd: FormData) {
    startTransition(async () => {
      await addPost(fd);
      setShowAdd(false);
      window.location.reload();
    });
  }

  function handleUpdate(id: number, fd: FormData) {
    startTransition(async () => {
      await updatePost(id, fd);
      setEditId(null);
      window.location.reload();
    });
  }

  function handleDelete(id: number, title: string) {
    if (!confirm(`Fshij "${title}"?`)) return;
    startTransition(async () => {
      await deletePost(id);
      setPosts((prev) => prev.filter((p) => p.id !== id));
    });
  }

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white">Blog</h1>
          <p className="text-gray-500 text-sm mt-1">{posts.length} artikuj gjithsej</p>
        </div>
        {!showAdd && (
          <button onClick={() => setShowAdd(true)}
            className="bg-green-500 hover:bg-green-600 text-white text-sm font-semibold px-4 py-2.5 rounded-xl transition-colors">
            + Artikull i Ri
          </button>
        )}
      </div>

      {showAdd && (
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 mb-6">
          <h2 className="text-white font-bold mb-5">Artikull i Ri</h2>
          <PostForm initial={emptyForm} onSubmit={handleAdd} onCancel={() => setShowAdd(false)} pending={isPending} />
        </div>
      )}

      <div className="flex flex-col gap-4">
        {posts.length === 0 && (
          <div className="text-center py-16 text-gray-600 text-sm">
            Nuk ka artikuj akoma. Shto të parin!
          </div>
        )}
        {posts.map((post) => (
          <div key={post.id} className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
            {editId === post.id ? (
              <>
                <p className="text-white font-bold mb-5">Edito: {post.title}</p>
                <PostForm
                  initial={{
                    title: post.title, excerpt: post.excerpt, content: post.content,
                    category: post.category, cover: post.cover,
                    read_min: String(post.read_min), published: String(post.published),
                  }}
                  onSubmit={(fd) => handleUpdate(post.id, fd)}
                  onCancel={() => setEditId(null)}
                  pending={isPending}
                />
              </>
            ) : (
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 rounded-xl bg-gray-800 overflow-hidden shrink-0">
                  <img src={post.cover || "/hero.jpg"} alt="" className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <span className="font-bold text-white text-sm">{post.title}</span>
                    <span className="text-xs text-gray-500 bg-gray-800 px-2 py-0.5 rounded-full">{post.category}</span>
                    {post.published
                      ? <span className="text-xs text-green-400 bg-green-500/10 px-2 py-0.5 rounded-full">● Publik</span>
                      : <span className="text-xs text-yellow-400 bg-yellow-500/10 px-2 py-0.5 rounded-full">○ Draft</span>
                    }
                  </div>
                  <p className="text-xs text-gray-500 line-clamp-1">{post.excerpt}</p>
                  <p className="text-xs text-gray-600 mt-1">{post.date} · {post.read_min} min · /blog/{post.slug}</p>
                </div>
                <div className="flex gap-3 shrink-0">
                  <button onClick={() => setEditId(post.id)} className="text-xs text-blue-400 hover:underline">Edito</button>
                  <button onClick={() => handleDelete(post.id, post.title)} className="text-xs text-red-400 hover:underline">Fshij</button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
