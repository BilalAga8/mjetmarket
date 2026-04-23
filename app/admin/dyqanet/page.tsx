"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../../lib/supabase";

interface Partner {
  id: string;
  name: string;
  city: string;
  discount: number;
  phone: string;
  logo: string;
  type: string;
}

const bgColors: Record<string, string> = {
  A: "bg-green-600", B: "bg-blue-600", C: "bg-orange-500", D: "bg-purple-600",
};

const empty: Omit<Partner, "id"> = { name: "", city: "", discount: 0, phone: "", logo: "", type: "dropshipping" };

export default function AdminDyqanet() {
  const [partners, setPartners] = useState<Partner[]>([]);
  const [modal, setModal] = useState<"add" | "edit" | null>(null);
  const [form, setForm] = useState<Omit<Partner, "id"> & { id?: string }>(empty);

  useEffect(() => {
    supabase.from("part_partners").select("*").order("id")
      .then(({ data }) => { if (data) setPartners(data as Partner[]); });
  }, []);

  function onChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    setForm((p) => ({ ...p, [e.target.name]: e.target.name === "discount" ? Number(e.target.value) : e.target.value }));
  }

  async function save() {
    if (modal === "add") {
      const { data } = await supabase.from("part_partners").insert([form]).select().single();
      if (data) setPartners((p) => [...p, data as Partner]);
    } else {
      const { id, ...fields } = form as Partner;
      await supabase.from("part_partners").update(fields).eq("id", id);
      setPartners((p) => p.map((x) => x.id === id ? { ...x, ...fields } : x));
    }
    setModal(null);
    setForm(empty);
  }

  async function remove(id: string) {
    if (!confirm("Fshij këtë partner?")) return;
    await supabase.from("part_partners").delete().eq("id", id);
    setPartners((p) => p.filter((x) => x.id !== id));
  }

  const inputClass = "w-full bg-gray-800 border border-gray-700 text-white rounded-xl px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-green-500";
  const labelClass = "text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1 block";

  return (
    <div className="p-4 sm:p-6 text-white">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-extrabold text-white">Partnerë Pjesësh Këmbimi</h1>
          <p className="text-gray-400 text-sm mt-0.5">{partners.length} partnerë gjithsej</p>
        </div>
        <button onClick={() => { setForm(empty); setModal("add"); }} className="bg-green-500 hover:bg-green-600 text-white text-sm font-semibold px-4 py-2.5 rounded-xl transition-colors">
          + Shto Partner
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {partners.map((p) => (
          <div key={p.id} className="bg-gray-900 border border-gray-800 rounded-2xl p-5 flex items-start gap-4">
            <div className={`w-12 h-12 rounded-xl ${bgColors[p.id] ?? "bg-gray-600"} text-white font-extrabold text-sm flex items-center justify-center shrink-0`}>
              {p.logo || p.id}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-0.5">
                <span className="font-bold text-white">{p.name}</span>
                <span className="bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-lg">-{p.discount}%</span>
              </div>
              <p className="text-xs text-gray-400">{p.city}</p>
              <p className="text-xs text-gray-400 mt-0.5">📞 {p.phone}</p>
              <p className="text-xs text-gray-500 mt-0.5">{p.type === "dropshipping" ? "Dropshipping" : "Jo-Dropshipping"}</p>
            </div>
            <div className="flex flex-col gap-1 shrink-0">
              <button onClick={() => { setForm(p); setModal("edit"); }} className="text-xs text-blue-400 hover:underline">Edito</button>
              <button onClick={() => remove(p.id)} className="text-xs text-red-400 hover:underline">Fshij</button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal shto/edito */}
      {modal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ backgroundColor: "rgba(0,0,0,0.7)" }} onClick={() => setModal(null)}>
          <div className="bg-gray-900 border border-gray-700 rounded-2xl w-full max-w-md p-6" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-bold text-white">{modal === "add" ? "Shto Partner" : "Edito Partner"}</h2>
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
                  <input name="city" value={form.city} onChange={onChange} className={inputClass} placeholder="Tiranë" />
                </div>
                <div>
                  <label className={labelClass}>Zbritja (%)</label>
                  <input name="discount" type="number" value={form.discount} onChange={onChange} className={inputClass} placeholder="10" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={labelClass}>Telefon</label>
                  <input name="phone" value={form.phone} onChange={onChange} className={inputClass} placeholder="+355 69..." />
                </div>
                <div>
                  <label className={labelClass}>Logo (shkronja)</label>
                  <input name="logo" value={form.logo} onChange={onChange} className={inputClass} placeholder="AP" maxLength={2} />
                </div>
              </div>
              <div>
                <label className={labelClass}>Lloji</label>
                <select name="type" value={form.type} onChange={onChange} className={inputClass}>
                  <option value="dropshipping">Dropshipping (ti dërgon)</option>
                  <option value="direct">Jo-Dropshipping (partneri dërgon)</option>
                </select>
              </div>
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
