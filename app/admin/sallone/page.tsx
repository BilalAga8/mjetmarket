"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase-browser";
const supabase = createClient();
import { albanianCities } from "../../../data/cities";

type PackageType = "bronze" | "silver" | "gold";

interface Shop {
  id: number;
  name: string;
  city: string;
  address: string;
  phone: string;
  website: string;
  verified: boolean;
  logo: string;
  package: PackageType;
}

const packageColors: Record<PackageType, string> = {
  gold:   "bg-yellow-500",
  silver: "bg-gray-400",
  bronze: "bg-orange-400",
};

const packageLabel: Record<PackageType, string> = {
  gold:   "🥇 Gold",
  silver: "🥈 Silver",
  bronze: "🥉 Bronze",
};

const empty: Omit<Shop, "id"> = {
  name: "", city: "", address: "", phone: "", website: "",
  verified: false, logo: "", package: "bronze",
};

export default function AdminSallone() {
  const [shops, setShops] = useState<Shop[]>([]);
  const [modal, setModal] = useState<"add" | "edit" | null>(null);
  const [form, setForm] = useState<Omit<Shop, "id"> & { id?: number }>(empty);

  useEffect(() => {
    supabase.from("shops").select("*").order("package").order("name")
      .then(({ data }) => { if (data) setShops(data as Shop[]); });
  }, []);

  function onChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    const { name, value, type } = e.target;
    const val = type === "checkbox" ? (e.target as HTMLInputElement).checked : value;
    setForm((p) => ({ ...p, [name]: val }));
  }

  async function save() {
    const { id, ...fields } = form as Shop;
    if (modal === "add") {
      const { data } = await supabase.from("shops").insert([fields]).select().single();
      if (data) setShops((p) => [...p, data as Shop]);
    } else {
      await supabase.from("shops").update(fields).eq("id", id);
      setShops((p) => p.map((s) => s.id === id ? { ...s, ...fields } : s));
    }
    setModal(null);
    setForm(empty);
  }

  async function remove(id: number) {
    if (!confirm("Fshij këtë dyqan?")) return;
    await supabase.from("shops").delete().eq("id", id);
    setShops((p) => p.filter((s) => s.id !== id));
  }

  const inputClass = "w-full bg-gray-800 border border-gray-700 text-white rounded-xl px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-green-500";
  const labelClass = "text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1 block";

  return (
    <div className="p-4 sm:p-6 text-white">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-extrabold text-white">Sallone & Sponsorë</h1>
          <p className="text-gray-400 text-sm mt-0.5">{shops.length} dyqane gjithsej</p>
        </div>
        <button
          onClick={() => { setForm(empty); setModal("add"); }}
          className="bg-green-500 hover:bg-green-600 text-white text-sm font-semibold px-4 py-2.5 rounded-xl transition-colors"
        >
          + Shto Dyqan
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {shops.map((s) => (
          <div key={s.id} className="bg-gray-900 border border-gray-800 rounded-2xl p-5 flex items-start gap-4">
            <div className={`w-12 h-12 rounded-xl ${packageColors[s.package]} text-white font-extrabold text-sm flex items-center justify-center shrink-0`}>
              {s.logo || s.name[0]}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                <span className="font-bold text-white">{s.name}</span>
                <span className="text-xs font-semibold text-gray-400">{packageLabel[s.package]}</span>
                {s.verified && <span className="text-xs bg-green-500/10 text-green-400 px-2 py-0.5 rounded-full">✓ Verifikuar</span>}
              </div>
              <p className="text-xs text-gray-400">{s.city}{s.address && ` · ${s.address}`}</p>
              {s.phone && <p className="text-xs text-gray-400 mt-0.5">📞 {s.phone}</p>}
              {s.website && <p className="text-xs text-gray-500 mt-0.5">🌐 {s.website}</p>}
            </div>
            <div className="flex flex-col gap-1 shrink-0">
              <button onClick={() => { setForm(s); setModal("edit"); }} className="text-xs text-blue-400 hover:underline">Edito</button>
              <button onClick={() => remove(s.id)} className="text-xs text-red-400 hover:underline">Fshij</button>
            </div>
          </div>
        ))}
        {shops.length === 0 && (
          <div className="col-span-2 py-16 text-center text-gray-500 text-sm bg-gray-900 border border-gray-800 rounded-2xl">
            Nuk ka dyqane. Shto të parin!
          </div>
        )}
      </div>

      {modal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ backgroundColor: "rgba(0,0,0,0.7)" }} onClick={() => setModal(null)}>
          <div className="bg-gray-900 border border-gray-700 rounded-2xl w-full max-w-md p-6" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-bold text-white">{modal === "add" ? "Shto Dyqan" : "Edito Dyqan"}</h2>
              <button onClick={() => setModal(null)} className="text-gray-500 hover:text-white text-xl">×</button>
            </div>

            <div className="flex flex-col gap-3">
              <div>
                <label className={labelClass}>Emri</label>
                <input name="name" value={form.name} onChange={onChange} className={inputClass} placeholder="p.sh. AutoParts Tirana" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={labelClass}>Qyteti</label>
                  <select name="city" value={form.city} onChange={onChange} className={inputClass}>
                    <option value="">Zgjidh</option>
                    {albanianCities.map((c) => <option key={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className={labelClass}>Logo (2 shkronja)</label>
                  <input name="logo" value={form.logo} onChange={onChange} className={inputClass} placeholder="AP" maxLength={2} />
                </div>
              </div>
              <div>
                <label className={labelClass}>Adresa</label>
                <input name="address" value={form.address} onChange={onChange} className={inputClass} placeholder="Rruga e Kavajës, nr. 142" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={labelClass}>Telefon</label>
                  <input name="phone" value={form.phone} onChange={onChange} className={inputClass} placeholder="069 123 4567" />
                </div>
                <div>
                  <label className={labelClass}>Website</label>
                  <input name="website" value={form.website} onChange={onChange} className={inputClass} placeholder="autoparts.al" />
                </div>
              </div>
              <div>
                <label className={labelClass}>Paketa</label>
                <select name="package" value={form.package} onChange={onChange} className={inputClass}>
                  <option value="gold">🥇 Gold</option>
                  <option value="silver">🥈 Silver</option>
                  <option value="bronze">🥉 Bronze</option>
                </select>
              </div>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" name="verified" checked={form.verified} onChange={onChange} className="accent-green-500 w-4 h-4" />
                <span className="text-sm text-gray-300">✓ Verifikuar</span>
              </label>
            </div>

            <div className="flex gap-3 mt-5">
              <button onClick={() => setModal(null)} className="flex-1 border border-gray-700 text-gray-400 font-semibold py-2.5 rounded-xl text-sm hover:bg-gray-800 transition-colors">Anulo</button>
              <button onClick={save} className="flex-1 bg-green-600 hover:bg-green-700 text-white font-bold py-2.5 rounded-xl text-sm transition-colors">Ruaj</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
