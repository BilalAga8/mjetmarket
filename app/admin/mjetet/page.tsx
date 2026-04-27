"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase-browser";
const supabase = createClient();
import { albanianCities } from "../../../data/cities";
import BrandModelSelect from "@/components/BrandModelSelect";

interface Vehicle {
  id: string;
  user_id: string | null;
  category: string;
  brand: string;
  model: string;
  year: number;
  price: number;
  km: number;
  fuel: string;
  transmission: string;
  hp: number;
  engine_cc: number;
  consumption: number;
  origin: string;
  color: string;
  doors: number | null;
  tire_condition: number | null;
  city: string | null;
  exchange: string | null;
  sponsored: boolean;
  featured: boolean;
  images: string[];
  description: string | null;
  created_at: string;
}

const emptyForm = {
  category: "Makinë", brand: "", model: "", year: 0,
  price: 0, km: 0, fuel: "Naftë", transmission: "Automatik",
  hp: 0, engine_cc: 0, consumption: 0, origin: "", color: "",
  doors: 4 as number | null, tire_condition: null as number | null, city: "", exchange: "",
  sponsored: false, featured: false, images: [] as string[], description: "",
};

export default function AdminMjetet() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [modal, setModal] = useState<"add" | "edit" | null>(null);
  const [form, setForm] = useState<typeof emptyForm & { id?: string }>(emptyForm);
  const [imgInput, setImgInput] = useState("");
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    supabase.from("vehicles").select("*").order("created_at", { ascending: false })
      .then(({ data }) => { if (data) setVehicles(data as Vehicle[]); });
  }, []);

  function onChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) {
    const { name, value, type } = e.target;
    const val = type === "checkbox" ? (e.target as HTMLInputElement).checked
      : ["year","price","km","hp","engine_cc","doors"].includes(name) ? Number(value)
      : ["consumption","tire_condition"].includes(name) ? (value === "" ? null : Number(value))
      : value;
    setForm((p) => ({ ...p, [name]: val }));
  }

  async function save() {
    const { id, ...fields } = form as typeof emptyForm & { id?: string };
    if (modal === "add") {
      const { data } = await supabase.from("vehicles").insert([fields]).select().single();
      if (data) setVehicles((p) => [data as Vehicle, ...p]);
    } else if (id) {
      await supabase.from("vehicles").update(fields).eq("id", id);
      setVehicles((p) => p.map((v) => v.id === id ? { ...v, ...fields } as Vehicle : v));
    }
    setModal(null);
    setForm(emptyForm);
  }

  async function remove(id: string) {
    if (!confirm("Fshij këtë mjet?")) return;
    await supabase.from("vehicles").delete().eq("id", id);
    setVehicles((p) => p.filter((v) => v.id !== id));
  }

  function addImage() {
    if (imgInput.trim()) {
      setForm((p) => ({ ...p, images: [...p.images, imgInput.trim()] }));
      setImgInput("");
    }
  }

  async function handleImageFiles(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []);
    if (!files.length) return;
    setUploading(true);
    const uploaded: string[] = [];
    for (const file of files) {
      const ext = file.name.split(".").pop() ?? "jpg";
      const path = `admin/${Date.now()}_${Math.random().toString(36).slice(2)}.${ext}`;
      const { error } = await supabase.storage.from("vehicle-images").upload(path, file);
      if (!error) {
        const { data: { publicUrl } } = supabase.storage.from("vehicle-images").getPublicUrl(path);
        uploaded.push(publicUrl);
      }
    }
    setForm((p) => ({ ...p, images: [...p.images, ...uploaded].slice(0, 20) }));
    setUploading(false);
    e.target.value = "";
  }

  const inputClass = "w-full bg-gray-800 border border-gray-700 text-white rounded-xl px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-green-500";
  const labelClass = "text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1 block";

  return (
    <div className="p-4 sm:p-6 text-white">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-extrabold text-white">Mjetet</h1>
          <p className="text-gray-400 text-sm mt-0.5">{vehicles.length} mjete gjithsej</p>
        </div>
        <button onClick={() => { setForm(emptyForm); setModal("add"); }} className="bg-green-500 hover:bg-green-600 text-white text-sm font-semibold px-4 py-2.5 rounded-xl transition-colors">
          + Shto Mjet
        </button>
      </div>

      <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
        {vehicles.length === 0 ? (
          <div className="py-16 text-center text-gray-500 text-sm">Nuk ka mjete. Shto të parin!</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-800 text-xs text-gray-500 uppercase tracking-wide">
                  <th className="px-4 py-3 text-left">Mjeti</th>
                  <th className="px-4 py-3 text-left">Kategoria</th>
                  <th className="px-4 py-3 text-left">Viti</th>
                  <th className="px-4 py-3 text-left">Km</th>
                  <th className="px-4 py-3 text-left">Çmimi</th>
                  <th className="px-4 py-3 text-left">Qyteti</th>
                  <th className="px-4 py-3 text-left">Sponsored</th>
                  <th className="px-4 py-3" />
                </tr>
              </thead>
              <tbody>
                {vehicles.map((v) => (
                  <tr key={v.id} className="border-b border-gray-800 last:border-0 hover:bg-gray-800/50 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        {v.images?.[0] ? (
                          <img src={v.images[0]} alt={v.model} className="w-12 h-8 rounded-lg object-cover shrink-0" />
                        ) : (
                          <div className="w-12 h-8 rounded-lg bg-gray-700 flex items-center justify-center text-gray-500 text-xs shrink-0">📷</div>
                        )}
                        <span className="font-medium text-white">{v.brand} {v.model}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-gray-400">{v.category}</td>
                    <td className="px-4 py-3 text-gray-400">{v.year}</td>
                    <td className="px-4 py-3 text-gray-400">{v.km.toLocaleString()}</td>
                    <td className="px-4 py-3 font-semibold text-green-400">{v.price.toLocaleString()} €</td>
                    <td className="px-4 py-3 text-gray-400">{v.city ?? "—"}</td>
                    <td className="px-4 py-3">
                      {v.sponsored
                        ? <span className="text-xs bg-yellow-500/10 text-yellow-400 px-2 py-0.5 rounded-full">★ Po</span>
                        : <span className="text-xs text-gray-600">Jo</span>}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        <button onClick={() => { setForm({ ...emptyForm, ...v, doors: v.doors ?? 4, tire_condition: v.tire_condition ?? null, city: v.city ?? "", exchange: v.exchange ?? "", description: v.description ?? "" }); setModal("edit"); }} className="text-xs text-blue-400 hover:underline">Edito</button>
                        <button onClick={() => remove(v.id)} className="text-xs text-red-400 hover:underline">Fshij</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal shto/edito */}
      {modal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ backgroundColor: "rgba(0,0,0,0.7)" }} onClick={() => setModal(null)}>
          <div className="bg-gray-900 border border-gray-700 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="sticky top-0 bg-gray-900 border-b border-gray-800 px-6 py-4 flex items-center justify-between">
              <h2 className="text-lg font-bold text-white">{modal === "add" ? "Shto Mjet" : "Edito Mjet"}</h2>
              <button onClick={() => setModal(null)} className="text-gray-500 hover:text-white text-xl">×</button>
            </div>

            <div className="p-6 flex flex-col gap-4">
              {/* Kategoria */}
              <div className="grid grid-cols-3 gap-2">
                {[["🚗","Makinë"],["🚛","Kamion"],["🏍️","Motor"],["⛵","Varkë"],["🚜","Trailer"],["🚌","Tjetër"]].map(([icon, label]) => (
                  <button key={label} type="button" onClick={() => setForm((p) => ({ ...p, category: label }))}
                    className={`flex items-center gap-2 px-3 py-2 rounded-xl border text-sm font-medium transition-all ${form.category === label ? "border-green-500 bg-green-500/10 text-green-400" : "border-gray-700 text-gray-400 hover:border-gray-500"}`}>
                    {icon} {label}
                  </button>
                ))}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <BrandModelSelect
                  brand={form.brand}
                  model={form.model}
                  onBrandChange={(v) => setForm((p) => ({ ...p, brand: v, model: "" }))}
                  onModelChange={(v) => setForm((p) => ({ ...p, model: v }))}
                  selectClass={inputClass}
                  inputClass={inputClass}
                  labelClass={labelClass}
                />
                {/* Viti — dropdown */}
                <div>
                  <label className={labelClass}>Viti i Prodhimit</label>
                  <select name="year" value={form.year || ""} onChange={onChange} className={inputClass}>
                    <option value="">Zgjidh vitin</option>
                    <option value="retro">Retro (para 1990)</option>
                    {Array.from({ length: 2027 - 1990 + 1 }, (_, i) => 2027 - i).map((y) => (
                      <option key={y} value={y}>{y}</option>
                    ))}
                  </select>
                </div>

                {[
                  { label: "Çmimi (€)", name: "price", placeholder: "18500" },
                  { label: "Kilometrat", name: "km", placeholder: "85000" },
                  { label: "Fuqia (HP)", name: "hp", placeholder: "190" },
                  { label: "Motori (cc)", name: "engine_cc", placeholder: "1995" },
                  { label: "Konsumi (L/100km)", name: "consumption", placeholder: "5.4" },
                ].map((f) => (
                  <div key={f.name}>
                    <label className={labelClass}>{f.label}</label>
                    <input
                      name={f.name}
                      type="number"
                      value={((form as Record<string, unknown>)[f.name] as number) || ""}
                      onChange={onChange}
                      placeholder={f.placeholder}
                      className={inputClass}
                    />
                  </div>
                ))}

                <div>
                  <label className={labelClass}>Ngjyra</label>
                  <select name="color" value={form.color} onChange={onChange} className={inputClass}>
                    <option value="">Zgjidh ngjyrën</option>
                    {["E zezë","E bardhë","E hirtë","Argjendtë","E kaltër","E kuqe","E gjelbër","E verdhë","Kafe","Portokalli","Vjollcë","Rozë","Bezhë","E artë"].map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className={labelClass}>Origjina</label>
                  <select name="origin" value={form.origin} onChange={onChange} className={inputClass}>
                    <option value="">Zgjidh origjinën</option>
                    <option value="Europe">Europë</option>
                    <option value="USA/Canada">USA / Kanada</option>
                    <option value="China">Kinë</option>
                    <option value="South Korea">Kore e Jugut</option>
                    <option value="Other">Tjetër</option>
                  </select>
                </div>

                <div>
                  <label className={labelClass}>Karburanti</label>
                  <select name="fuel" value={form.fuel} onChange={onChange} className={inputClass}>
                    {["Naftë","Benzinë","Hibrid","Elektrik","Gas"].map((v) => <option key={v}>{v}</option>)}
                  </select>
                </div>
                <div>
                  <label className={labelClass}>Kambio</label>
                  <select name="transmission" value={form.transmission} onChange={onChange} className={inputClass}>
                    <option>Automatik</option><option>Manual</option>
                  </select>
                </div>
                <div>
                  <label className={labelClass}>Qyteti</label>
                  <select name="city" value={form.city ?? ""} onChange={onChange} className={inputClass}>
                    <option value="">Zgjidh qytetin</option>
                    {albanianCities.map((c) => <option key={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className={labelClass}>Gjendja e Gomave</label>
                  <select name="tire_condition" value={form.tire_condition ?? ""} onChange={onChange} className={inputClass}>
                    <option value="">—</option>
                    {[10,20,30,40,50,60,70,80,90,100].map((v) => <option key={v} value={v}>{v}%</option>)}
                  </select>
                </div>
                <div className="col-span-2">
                  <label className={labelClass}>Mjeti Ndrrohet?</label>
                  <select name="exchange" value={form.exchange ?? ""} onChange={onChange} className={inputClass}>
                    <option value="">Nuk Ndrrohet</option>
                    <option value="apartament">Me Apartament</option>
                    <option value="makine-madhe">Me Makinë të Madhe</option>
                    <option value="tjeter">Me Tjetër</option>
                  </select>
                </div>
              </div>

              {/* Foto */}
              <div>
                <label className={labelClass}>Foto ({form.images.length}/20)</label>
                {/* Upload skedar */}
                <label className={`flex items-center justify-center gap-2 w-full border border-dashed border-gray-600 rounded-xl px-3 py-2.5 mb-2 cursor-pointer text-sm transition-colors ${uploading ? "text-green-400 border-green-500" : "text-gray-400 hover:border-gray-400"}`}>
                  <input type="file" accept="image/*" multiple className="hidden" onChange={handleImageFiles} disabled={uploading} />
                  {uploading ? "⏳ Duke ngarkuar…" : "📷 Ngarko foto nga kompjuteri"}
                </label>
                {/* Ose URL */}
                <div className="flex gap-2 mb-2">
                  <input value={imgInput} onChange={(e) => setImgInput(e.target.value)} onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addImage())} placeholder="ose shto URL…" className={inputClass} />
                  <button type="button" onClick={addImage} className="bg-green-600 hover:bg-green-700 text-white px-3 rounded-xl text-sm font-bold transition-colors">+</button>
                </div>
                {form.images.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {form.images.map((img, i) => (
                      <div key={i} className="relative">
                        <img src={img} className="w-16 h-12 object-cover rounded-lg" />
                        <button onClick={() => setForm((p) => ({ ...p, images: p.images.filter((_, j) => j !== i) }))} className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-white text-xs flex items-center justify-center">×</button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Përshkrimi */}
              <div>
                <label className={labelClass}>Përshkrimi</label>
                <textarea name="description" value={form.description ?? ""} onChange={onChange} rows={3} placeholder="Detaje shtesë..." className={inputClass + " resize-none"} />
              </div>

              {/* Sponsored / Featured */}
              <div className="flex gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" name="sponsored" checked={form.sponsored} onChange={onChange} className="accent-yellow-500 w-4 h-4" />
                  <span className="text-sm text-gray-300">★ Sponsored</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" name="featured" checked={form.featured} onChange={onChange} className="accent-green-500 w-4 h-4" />
                  <span className="text-sm text-gray-300">⭐ Featured</span>
                </label>
              </div>
            </div>

            <div className="sticky bottom-0 bg-gray-900 border-t border-gray-800 px-6 py-4 flex gap-3">
              <button onClick={() => setModal(null)} className="flex-1 border border-gray-700 text-gray-400 font-semibold py-2.5 rounded-xl text-sm hover:bg-gray-800 transition-colors">Anulo</button>
              <button onClick={save} className="flex-1 bg-green-600 hover:bg-green-700 text-white font-bold py-2.5 rounded-xl text-sm transition-colors">Ruaj Mjetin</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
