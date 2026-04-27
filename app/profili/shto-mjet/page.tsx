"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase-browser";
import { albanianCities } from "../../../data/cities";
import BrandModelSelect from "@/components/BrandModelSelect";

const vehicleCategories: string[] = ["Makinë", "Kamion", "Motor", "Varkë", "Trailer", "Tjetër"];

const tireOptions = [10, 20, 30, 40, 50, 60, 70, 80, 90, 100];

interface FormState {
  category: string;
  brand: string;
  model: string;
  year: string;
  km: string;
  color: string;
  price: string;
  fuel: string;
  transmission: string;
  city: string;
  tire_condition: string;
  exchange: string;
  hp: string;
  engine_cc: string;
  consumption: string;
  description: string;
  images: string[];
}

const initialForm: FormState = {
  category: "", brand: "", model: "", year: "", km: "", color: "",
  price: "", fuel: "Naftë", transmission: "Automatik", city: "",
  tire_condition: "", exchange: "", hp: "", engine_cc: "", consumption: "",
  description: "", images: [],
};

export default function ShtoMjetPage() {
  const router = useRouter();
  const [form, setForm] = useState<FormState>(initialForm);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  const selectClass = "w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-green-500 bg-white";
  const inputClass  = "w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-green-500";
  const labelClass  = "text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1 block";

  function onChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
  }

  async function handleImageFiles(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []);
    if (!files.length) return;
    if (form.images.length + files.length > 10) {
      setError("Maksimumi 10 foto.");
      return;
    }
    setUploading(true);
    setError("");
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { setUploading(false); return; }

    const uploaded: string[] = [];
    for (const file of files) {
      const ext = file.name.split(".").pop() ?? "jpg";
      const path = `${user.id}/${Date.now()}_${Math.random().toString(36).slice(2)}.${ext}`;
      const { error: upErr } = await supabase.storage
        .from("vehicle-images")
        .upload(path, file);
      if (!upErr) {
        const { data: { publicUrl } } = supabase.storage
          .from("vehicle-images")
          .getPublicUrl(path);
        uploaded.push(publicUrl);
      }
    }

    setForm((p) => ({ ...p, images: [...p.images, ...uploaded].slice(0, 10) }));
    setUploading(false);
    e.target.value = "";
  }

  function removeImage(i: number) {
    setForm((p) => ({ ...p, images: p.images.filter((_, j) => j !== i) }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!form.category) {
      setError("Zgjidh llojin e mjetit.");
      return;
    }
    if (!form.brand.trim() || !form.model.trim() || !form.price || !form.year) {
      setError("Plotëso fushat: Marka, Modeli, Viti, Çmimi.");
      return;
    }

    setSaving(true);
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { setError("Nuk je i/e loguar."); setSaving(false); return; }

    const { error: dbError } = await supabase.from("vehicles").insert([{
      user_id:       user.id,
      category:      form.category,
      brand:         form.brand.trim(),
      model:         form.model.trim(),
      year:          Number(form.year),
      km:            Number(form.km) || 0,
      color:         form.color,
      price:         Number(form.price),
      fuel:          form.fuel,
      transmission:  form.transmission,
      city:          form.city || null,
      tire_condition: form.tire_condition ? Number(form.tire_condition) : null,
      exchange:      form.exchange || null,
      hp:            Number(form.hp) || 0,
      engine_cc:     Number(form.engine_cc) || 0,
      consumption:   Number(form.consumption) || 0,
      description:   form.description || null,
      images:        form.images,
    }]);

    setSaving(false);
    if (dbError) { setError("Gabim: " + dbError.message); return; }
    router.push("/profili");
  }

  return (
    <div className="p-6 max-w-2xl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Shto Mjet të Ri</h1>
        <p className="text-gray-500 text-sm mt-1">Plotëso të dhënat e mjetit për ta publikuar</p>
      </div>

      <form className="flex flex-col gap-5" onSubmit={handleSubmit}>

        {/* Lloji i Mjetit */}
        <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
          <h2 className="text-sm font-bold text-gray-900 mb-1">Lloji i Mjetit <span className="text-red-500">*</span></h2>
          <p className="text-xs text-gray-400 mb-4">Zgjidh një kategori para se të vazhdosh</p>
          <div className="grid grid-cols-3 gap-2">
            {vehicleCategories.map((label) => (
              <label key={label} className={`flex items-center gap-2 border rounded-xl px-3 py-2.5 cursor-pointer transition-colors ${form.category === label ? "border-green-500 bg-green-50" : "border-gray-200 hover:border-green-300"}`}>
                <input type="radio" name="category" value={label} checked={form.category === label} onChange={onChange} className="accent-green-500" required />
                <span className="text-sm font-medium">{label}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Informacioni Bazë */}
        <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
          <h2 className="text-sm font-bold text-gray-900 mb-4">Informacioni Bazë</h2>
          <div className="grid grid-cols-2 gap-4">
            <BrandModelSelect
              brand={form.brand}
              model={form.model}
              onBrandChange={(v) => setForm((p) => ({ ...p, brand: v, model: "" }))}
              onModelChange={(v) => setForm((p) => ({ ...p, model: v }))}
              selectClass={selectClass}
              inputClass={inputClass}
              labelClass={labelClass}
            />
            <div>
              <label htmlFor="year" className={labelClass}>Viti *</label>
              <input id="year" name="year" type="number" value={form.year} onChange={onChange} placeholder="p.sh. 2020" min="1950" max="2027" className={inputClass} />
            </div>
            <div>
              <label htmlFor="km" className={labelClass}>Kilometrat</label>
              <input id="km" name="km" type="number" value={form.km} onChange={onChange} placeholder="p.sh. 85000" className={inputClass} />
            </div>
            <div>
              <label htmlFor="price" className={labelClass}>Çmimi (€) *</label>
              <input id="price" name="price" type="number" value={form.price} onChange={onChange} placeholder="p.sh. 18500" className={inputClass} />
            </div>
            <div>
              <label htmlFor="color" className={labelClass}>Ngjyra</label>
              <select id="color" name="color" value={form.color} onChange={onChange} className={selectClass}>
                <option value="">Zgjidh ngjyrën</option>
                {["E zezë","E bardhë","E hirtë","Argjendtë","E kaltër","E kuqe","E gjelbër","E verdhë","Kafe","Portokalli","Bezhë","E artë"].map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="fuel" className={labelClass}>Karburanti</label>
              <select id="fuel" name="fuel" value={form.fuel} onChange={onChange} className={selectClass}>
                {["Naftë","Benzinë","Hibrid","Elektrik","Gas"].map((v) => <option key={v}>{v}</option>)}
              </select>
            </div>
            <div>
              <label htmlFor="transmission" className={labelClass}>Kambio</label>
              <select id="transmission" name="transmission" value={form.transmission} onChange={onChange} className={selectClass}>
                <option>Automatik</option>
                <option>Manual</option>
              </select>
            </div>
            <div>
              <label htmlFor="city" className={labelClass}>Qyteti</label>
              <select id="city" name="city" value={form.city} onChange={onChange} className={selectClass}>
                <option value="">Zgjidh qytetin</option>
                {albanianCities.map((c) => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label htmlFor="tire_condition" className={labelClass}>Gjendja e Gomave</label>
              <select id="tire_condition" name="tire_condition" value={form.tire_condition} onChange={onChange} className={selectClass}>
                <option value="">—</option>
                {tireOptions.map((v) => <option key={v} value={v}>{v}%</option>)}
              </select>
            </div>
            <div className="col-span-2">
              <label htmlFor="exchange" className={labelClass}>Mjeti Ndrrohet?</label>
              <select id="exchange" name="exchange" value={form.exchange} onChange={onChange} className={selectClass}>
                <option value="">Nuk Ndrrohet</option>
                <option value="apartament">Ndrrohet me Apartament</option>
                <option value="makine-madhe">Ndrrohet me Makinë të Madhe</option>
                <option value="tjeter">Ndrrohet me Tjetër</option>
              </select>
            </div>
          </div>
        </div>

        {/* Të dhëna teknike (opsionale) */}
        <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
          <h2 className="text-sm font-bold text-gray-900 mb-4">Të Dhëna Teknike <span className="font-normal text-gray-400">(opsionale)</span></h2>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label htmlFor="hp" className={labelClass}>Fuqia (HP)</label>
              <input id="hp" name="hp" type="number" value={form.hp} onChange={onChange} placeholder="190" className={inputClass} />
            </div>
            <div>
              <label htmlFor="engine_cc" className={labelClass}>Motori (cc)</label>
              <input id="engine_cc" name="engine_cc" type="number" value={form.engine_cc} onChange={onChange} placeholder="1995" className={inputClass} />
            </div>
            <div>
              <label htmlFor="consumption" className={labelClass}>Konsumi (L/100)</label>
              <input id="consumption" name="consumption" type="number" step="0.1" value={form.consumption} onChange={onChange} placeholder="5.4" className={inputClass} />
            </div>
          </div>
        </div>

        {/* Foto */}
        <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
          <h2 className="text-sm font-bold text-gray-900 mb-1">Foto <span className="font-normal text-gray-400">max 10</span></h2>
          <p className="text-xs text-gray-400 mb-4">PNG, JPG, WEBP — deri 5 MB secila</p>

          <label className={`flex flex-col items-center justify-center border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors ${uploading ? "border-green-300 bg-green-50" : "border-gray-200 hover:border-green-400"}`}>
            <input
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={handleImageFiles}
              disabled={uploading || form.images.length >= 10}
            />
            {uploading ? (
              <>
                <div className="text-2xl mb-2">⏳</div>
                <p className="text-sm font-medium text-green-600">Duke ngarkuar…</p>
              </>
            ) : (
              <>
                <div className="text-3xl mb-2">📷</div>
                <p className="text-sm font-medium text-gray-600">Kliko për të ngarkuar foto</p>
                <p className="text-xs text-gray-400 mt-1">{form.images.length}/10 foto</p>
              </>
            )}
          </label>

          {form.images.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-3">
              {form.images.map((img, i) => (
                <div key={i} className="relative">
                  <img src={img} alt="" className="w-20 h-14 object-cover rounded-xl" />
                  <button type="button" onClick={() => removeImage(i)} className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full text-white text-xs flex items-center justify-center">×</button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Përshkrimi */}
        <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
          <h2 className="text-sm font-bold text-gray-900 mb-4">Përshkrimi</h2>
          <textarea
            id="description"
            name="description"
            value={form.description}
            onChange={onChange}
            rows={4}
            placeholder="Shkruaj detaje shtesë për mjetin..."
            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-green-500 resize-none"
          />
        </div>

        {error && (
          <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl px-4 py-3">{error}</p>
        )}

        <button
          type="submit"
          disabled={saving || uploading}
          className="w-full bg-green-500 hover:bg-green-600 disabled:opacity-60 text-white font-semibold py-3.5 rounded-xl transition-colors duration-200 text-base"
        >
          {saving ? "Duke publikuar…" : uploading ? "Duke ngarkuar foto…" : "Publiko Njoftimin"}
        </button>
      </form>
    </div>
  );
}
