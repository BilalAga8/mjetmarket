"use client";

import { useEffect, useState, useTransition } from "react";
import { createClient } from "@/lib/supabase-browser";
import { partCategories } from "@/data/partCategories";

const supabase = createClient();

type Quality = "oem" | "ekuivalente" | "ekonomike";

type Product = {
  id: string;
  name: string;
  oem_code: string | null;
  category: string;
  quality: Quality;
  photo_key: string | null;
  compatible_makes: string[];
  compatible_models: string[];
  year_from: number | null;
  year_to: number | null;
  price_from: number | null;
  price_to: number | null;
  shops_count: number;
  is_active: boolean;
};

const qualityLabels: Record<Quality, { label: string; cls: string }> = {
  oem:        { label: "OEM",         cls: "bg-blue-500/15 text-blue-400" },
  ekuivalente:{ label: "Ekuivalente", cls: "bg-orange-500/15 text-orange-400" },
  ekonomike:  { label: "Ekonomike",   cls: "bg-gray-500/15 text-gray-400" },
};

const POPULAR_MAKES = ["BMW", "Mercedes-Benz", "Volkswagen", "Audi", "Toyota", "Honda", "Hyundai", "Kia", "Ford", "Opel", "Fiat", "Renault", "Peugeot"];

const emptyForm = {
  name: "", oem_code: "", category: partCategories[0]?.name ?? "",
  quality: "oem" as Quality, photo_key: "",
  compatible_makes: [] as string[], compatible_models: [] as string[],
  year_from: "", year_to: "", price_from: "", price_to: "",
  shops_count: "1", is_active: true,
};

function TagInput({ values, onChange, placeholder, suggestions }: {
  values: string[]; onChange: (v: string[]) => void;
  placeholder: string; suggestions?: string[];
}) {
  const [input, setInput] = useState("");

  function add(val: string) {
    const v = val.trim();
    if (v && !values.includes(v)) onChange([...values, v]);
    setInput("");
  }

  return (
    <div className="flex flex-wrap gap-1.5 bg-gray-800 border border-gray-700 rounded-xl p-2 min-h-[42px]">
      {values.map((v) => (
        <span key={v} className="inline-flex items-center gap-1 bg-gray-700 text-white text-xs px-2 py-1 rounded-lg">
          {v}
          <button type="button" onClick={() => onChange(values.filter((x) => x !== v))} className="text-gray-400 hover:text-red-400">×</button>
        </span>
      ))}
      <input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={(e) => { if (e.key === "Enter" || e.key === ",") { e.preventDefault(); add(input); } }}
        onBlur={() => input && add(input)}
        placeholder={values.length === 0 ? placeholder : ""}
        list={`sugg-${placeholder}`}
        className="bg-transparent text-white text-xs outline-none flex-1 min-w-[100px] placeholder:text-gray-600"
      />
      {suggestions && (
        <datalist id={`sugg-${placeholder}`}>
          {suggestions.map((s) => <option key={s} value={s} />)}
        </datalist>
      )}
    </div>
  );
}

function ProductForm({ initial, onSave, onCancel, pending }: {
  initial: typeof emptyForm;
  onSave: (data: Omit<Product, "id" | "is_active"> & { is_active: boolean }) => void;
  onCancel: () => void;
  pending: boolean;
}) {
  const [form, setForm] = useState(initial);
  const inputCls = "w-full bg-gray-800 border border-gray-700 text-white rounded-xl px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-green-500 placeholder:text-gray-600";
  const labelCls = "text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1 block";

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    onSave({
      name:               form.name,
      oem_code:           form.oem_code || null,
      category:           form.category,
      quality:            form.quality,
      photo_key:          form.photo_key || null,
      compatible_makes:   form.compatible_makes,
      compatible_models:  form.compatible_models,
      year_from:          form.year_from ? parseInt(form.year_from) : null,
      year_to:            form.year_to   ? parseInt(form.year_to)   : null,
      price_from:         form.price_from ? parseFloat(form.price_from) : null,
      price_to:           form.price_to   ? parseFloat(form.price_to)   : null,
      shops_count:        parseInt(form.shops_count) || 1,
      is_active:          form.is_active,
    });
  }

  return (
    <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="md:col-span-2">
        <label className={labelCls}>Emri i produktit *</label>
        <input required value={form.name} onChange={(e) => setForm(p => ({ ...p, name: e.target.value }))}
          placeholder="p.sh. Filtro Vaji — BMW N47" className={inputCls} />
      </div>
      <div>
        <label className={labelCls}>Kodi OEM</label>
        <input value={form.oem_code} onChange={(e) => setForm(p => ({ ...p, oem_code: e.target.value }))}
          placeholder="11427788450" className={inputCls} />
      </div>
      <div>
        <label className={labelCls}>Kategoria *</label>
        <select required value={form.category} onChange={(e) => setForm(p => ({ ...p, category: e.target.value }))} className={inputCls}>
          {partCategories.map((c) => (
            <option key={c.id} value={c.name}>{c.icon} {c.name}</option>
          ))}
        </select>
      </div>
      <div>
        <label className={labelCls}>Cilësia *</label>
        <select value={form.quality} onChange={(e) => setForm(p => ({ ...p, quality: e.target.value as Quality }))} className={inputCls}>
          <option value="oem">OEM — Origjinal</option>
          <option value="ekuivalente">Ekuivalente</option>
          <option value="ekonomike">Ekonomike</option>
        </select>
      </div>
      <div>
        <label className={labelCls}>Foto (URL ose lër bosh)</label>
        <input value={form.photo_key ?? ""} onChange={(e) => setForm(p => ({ ...p, photo_key: e.target.value }))}
          placeholder="https://... ose /parts/oil-filter.jpg" className={inputCls} />
      </div>
      <div className="md:col-span-2">
        <label className={labelCls}>Marka të përshtatshme (Enter ose , për të shtuar · bosh = të gjitha)</label>
        <TagInput values={form.compatible_makes}
          onChange={(v) => setForm(p => ({ ...p, compatible_makes: v }))}
          placeholder="BMW, Mercedes-Benz..."
          suggestions={POPULAR_MAKES} />
      </div>
      <div className="md:col-span-2">
        <label className={labelCls}>Modele të përshtatshme (bosh = të gjitha)</label>
        <TagInput values={form.compatible_models}
          onChange={(v) => setForm(p => ({ ...p, compatible_models: v }))}
          placeholder="320d, C220, Golf..." />
      </div>
      <div className="grid grid-cols-2 gap-3 md:col-span-1">
        <div>
          <label className={labelCls}>Viti nga</label>
          <input type="number" value={form.year_from} onChange={(e) => setForm(p => ({ ...p, year_from: e.target.value }))}
            placeholder="2005" className={inputCls} />
        </div>
        <div>
          <label className={labelCls}>Viti deri</label>
          <input type="number" value={form.year_to} onChange={(e) => setForm(p => ({ ...p, year_to: e.target.value }))}
            placeholder="2023" className={inputCls} />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3 md:col-span-1">
        <div>
          <label className={labelCls}>Çmimi nga (€)</label>
          <input type="number" step="0.01" value={form.price_from} onChange={(e) => setForm(p => ({ ...p, price_from: e.target.value }))}
            placeholder="12.00" className={inputCls} />
        </div>
        <div>
          <label className={labelCls}>Çmimi deri (€)</label>
          <input type="number" step="0.01" value={form.price_to} onChange={(e) => setForm(p => ({ ...p, price_to: e.target.value }))}
            placeholder="28.00" className={inputCls} />
        </div>
      </div>
      <div>
        <label className={labelCls}>Dyqane që ofertojnë</label>
        <input type="number" min={0} value={form.shops_count} onChange={(e) => setForm(p => ({ ...p, shops_count: e.target.value }))}
          className={inputCls} />
      </div>
      <div className="flex items-center gap-3 pt-5">
        <input type="checkbox" id="is_active" checked={form.is_active}
          onChange={(e) => setForm(p => ({ ...p, is_active: e.target.checked }))}
          className="w-4 h-4 rounded accent-green-500" />
        <label htmlFor="is_active" className="text-sm text-gray-400">Aktiv (i dukshëm në dyqan)</label>
      </div>
      <div className="md:col-span-2 flex gap-3 justify-end pt-2">
        <button type="button" onClick={onCancel} className="px-4 py-2 text-sm text-gray-400 hover:text-white transition-colors">
          Anulo
        </button>
        <button type="submit" disabled={pending}
          className="bg-green-500 hover:bg-green-600 disabled:opacity-60 text-white text-sm font-semibold px-5 py-2 rounded-xl transition-colors">
          {pending ? "Duke ruajtur..." : "Ruaj Produktin"}
        </button>
      </div>
    </form>
  );
}

export default function AdminProduktet() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    supabase.from("products").select("*").order("created_at", { ascending: false })
      .then(({ data }) => { setProducts(data ?? []); setLoading(false); });
  }, []);

  function handleAdd(data: Omit<Product, "id">) {
    startTransition(async () => {
      const { data: row } = await supabase.from("products").insert(data).select().single();
      if (row) setProducts((prev) => [row, ...prev]);
      setShowAdd(false);
    });
  }

  function handleUpdate(id: string, data: Omit<Product, "id">) {
    startTransition(async () => {
      const { data: row } = await supabase.from("products").update(data).eq("id", id).select().single();
      if (row) setProducts((prev) => prev.map((p) => p.id === id ? row : p));
      setEditId(null);
    });
  }

  function handleDelete(id: string, name: string) {
    if (!confirm(`Fshij "${name}"?`)) return;
    startTransition(async () => {
      await supabase.from("products").delete().eq("id", id);
      setProducts((prev) => prev.filter((p) => p.id !== id));
    });
  }

  async function handleToggle(id: string, current: boolean) {
    await supabase.from("products").update({ is_active: !current }).eq("id", id);
    setProducts((prev) => prev.map((p) => p.id === id ? { ...p, is_active: !current } : p));
  }

  if (loading) return <div className="p-8 text-gray-500 text-sm">Duke ngarkuar...</div>;

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white">Produktet</h1>
          <p className="text-gray-500 text-sm mt-1">{products.length} produkte gjithsej</p>
        </div>
        {!showAdd && (
          <button onClick={() => setShowAdd(true)}
            className="bg-green-500 hover:bg-green-600 text-white text-sm font-semibold px-4 py-2.5 rounded-xl transition-colors">
            + Produkt i Ri
          </button>
        )}
      </div>

      {showAdd && (
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 mb-6">
          <h2 className="text-white font-bold mb-5">Produkt i Ri</h2>
          <ProductForm initial={emptyForm} onSave={(d) => handleAdd(d as Omit<Product, "id">)}
            onCancel={() => setShowAdd(false)} pending={isPending} />
        </div>
      )}

      {products.length === 0 && !showAdd && (
        <div className="text-center py-16 text-gray-600 text-sm">
          Nuk ka produkte akoma. Shto të parin!
        </div>
      )}

      <div className="flex flex-col gap-3">
        {products.map((p) => (
          <div key={p.id} className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
            {editId === p.id ? (
              <div className="p-5">
                <p className="text-white font-bold mb-5">Edito: {p.name}</p>
                <ProductForm
                  initial={{
                    name: p.name, oem_code: p.oem_code ?? "", category: p.category,
                    quality: p.quality, photo_key: p.photo_key ?? "",
                    compatible_makes: p.compatible_makes, compatible_models: p.compatible_models,
                    year_from: p.year_from?.toString() ?? "", year_to: p.year_to?.toString() ?? "",
                    price_from: p.price_from?.toString() ?? "", price_to: p.price_to?.toString() ?? "",
                    shops_count: p.shops_count.toString(), is_active: p.is_active,
                  }}
                  onSave={(d) => handleUpdate(p.id, d as Omit<Product, "id">)}
                  onCancel={() => setEditId(null)}
                  pending={isPending}
                />
              </div>
            ) : (
              <div className="flex items-center gap-4 p-4">
                {/* Thumbnail */}
                <div className="w-10 h-10 rounded-xl bg-gray-800 flex items-center justify-center shrink-0 overflow-hidden">
                  {p.photo_key && p.photo_key.startsWith("http")
                    ? <img src={p.photo_key} alt="" className="w-full h-full object-cover" />
                    : <span className="text-xl">{partCategories.find(c => c.name === p.category)?.icon ?? "⚙️"}</span>
                  }
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-0.5">
                    <span className="font-bold text-white text-sm">{p.name}</span>
                    {p.oem_code && <span className="text-xs text-gray-500 font-mono">{p.oem_code}</span>}
                    <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${qualityLabels[p.quality].cls}`}>
                      {qualityLabels[p.quality].label}
                    </span>
                    <span className="text-xs text-gray-600 bg-gray-800 px-2 py-0.5 rounded-full">{p.category}</span>
                  </div>
                  <p className="text-xs text-gray-500">
                    {p.compatible_makes.length > 0 ? p.compatible_makes.join(", ") : "Të gjitha markat"}
                    {(p.year_from || p.year_to) && ` · ${p.year_from ?? ""}–${p.year_to ?? ""}`}
                    {(p.price_from || p.price_to) && ` · ${p.price_from ?? "?"} – ${p.price_to ?? "?"}€`}
                    {` · ${p.shops_count} dyqane`}
                  </p>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-3 shrink-0">
                  <button onClick={() => handleToggle(p.id, p.is_active)}
                    className={`text-xs px-2.5 py-1 rounded-lg font-semibold transition-colors ${
                      p.is_active ? "bg-green-500/10 text-green-400 hover:bg-red-500/10 hover:text-red-400" : "bg-gray-800 text-gray-500 hover:bg-green-500/10 hover:text-green-400"
                    }`}>
                    {p.is_active ? "● Aktiv" : "○ Joaktiv"}
                  </button>
                  <button onClick={() => setEditId(p.id)} className="text-xs text-blue-400 hover:underline">Edito</button>
                  <button onClick={() => handleDelete(p.id, p.name)} className="text-xs text-red-400 hover:underline">Fshij</button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
