"use client";

import { useEffect, useState, useTransition } from "react";
import { createClient } from "@/lib/supabase-browser";
import { createShopAccount, toggleShopActive } from "./actions";

const supabase = createClient();

interface Partner {
  id: string; name: string; city: string; discount: number;
  phone: string; logo: string; type: string;
}

interface ShopProfile {
  id: string; name: string; city: string; phone: string;
  is_active: boolean; created_at: string;
}

interface ShopWithEmail extends ShopProfile { email?: string; }

const bgColors: Record<string, string> = {
  A: "bg-green-600", B: "bg-blue-600", C: "bg-orange-500", D: "bg-purple-600",
};
const empty: Omit<Partner, "id"> = { name: "", city: "", discount: 0, phone: "", logo: "", type: "dropshipping" };
const emptyShop = { name: "", email: "", password: "", city: "", phone: "" };

export default function AdminDyqanet() {
  const [partners, setPartners] = useState<Partner[]>([]);
  const [shops, setShops]       = useState<ShopWithEmail[]>([]);
  const [modal, setModal]       = useState<"add" | "edit" | "createShop" | null>(null);
  const [form, setForm]         = useState<Omit<Partner, "id"> & { id?: string }>(empty);
  const [shopForm, setShopForm] = useState(emptyShop);
  const [result, setResult]     = useState<{ email: string; password: string; name: string } | null>(null);
  const [shopError, setShopError] = useState("");
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    supabase.from("part_partners").select("*").order("id")
      .then(({ data }) => { if (data) setPartners(data as Partner[]); });
    supabase.from("shop_profiles").select("*").order("created_at", { ascending: false })
      .then(({ data }) => { if (data) setShops(data as ShopWithEmail[]); });
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
    setModal(null); setForm(empty);
  }

  async function remove(id: string) {
    if (!confirm("Fshij këtë partner?")) return;
    await supabase.from("part_partners").delete().eq("id", id);
    setPartners((p) => p.filter((x) => x.id !== id));
  }

  function handleCreateShop(fd: FormData) {
    setShopError("");
    startTransition(async () => {
      const res = await createShopAccount(fd);
      if (res.error) { setShopError(res.error); return; }
      if (res.success) {
        setResult({ email: res.email!, password: res.password!, name: res.name! });
        setShops((prev) => [{
          id: Date.now().toString(), name: res.name!, city: shopForm.city,
          phone: shopForm.phone, is_active: true, created_at: new Date().toISOString(),
        }, ...prev]);
        setShopForm(emptyShop);
      }
    });
  }

  function handleToggle(id: string, active: boolean) {
    startTransition(async () => {
      await toggleShopActive(id, active);
      setShops((p) => p.map((s) => s.id === id ? { ...s, is_active: !active } : s));
    });
  }

  const inputClass = "w-full bg-gray-800 border border-gray-700 text-white rounded-xl px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-green-500";
  const labelClass = "text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1 block";

  return (
    <div className="p-4 sm:p-6 text-white">

      {/* ── Partnerë Pjesësh ── */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-extrabold text-white">Partnerë Pjesësh Këmbimi</h1>
          <p className="text-gray-400 text-sm mt-0.5">{partners.length} partnerë gjithsej</p>
        </div>
        <button onClick={() => { setForm(empty); setModal("add"); }}
          className="bg-green-500 hover:bg-green-600 text-white text-sm font-semibold px-4 py-2.5 rounded-xl transition-colors">
          + Shto Partner
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-12">
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
            </div>
            <div className="flex flex-col gap-1 shrink-0">
              <button onClick={() => { setForm(p); setModal("edit"); }} className="text-xs text-blue-400 hover:underline">Edito</button>
              <button onClick={() => remove(p.id)} className="text-xs text-red-400 hover:underline">Fshij</button>
            </div>
          </div>
        ))}
      </div>

      {/* ── Llogaritë e Dyqaneve ── */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-extrabold text-white">Llogaritë e Dyqaneve</h2>
          <p className="text-gray-400 text-sm mt-0.5">{shops.length} dyqane të regjistruara</p>
        </div>
        <button onClick={() => { setResult(null); setShopError(""); setModal("createShop"); }}
          className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-4 py-2.5 rounded-xl transition-colors">
          + Krijo Llogari Dyqani
        </button>
      </div>

      <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
        {shops.length === 0 ? (
          <div className="py-10 text-center text-gray-500 text-sm">Nuk ka dyqane të regjistruara.</div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-800 text-gray-400 text-xs">
                <th className="text-left px-4 py-3">Emri</th>
                <th className="text-left px-4 py-3">Qyteti</th>
                <th className="text-left px-4 py-3">Telefon</th>
                <th className="text-left px-4 py-3">Aktiv</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody>
              {shops.map((s, i) => (
                <tr key={s.id} className={`border-b border-gray-800/50 ${i === shops.length - 1 ? "border-none" : ""}`}>
                  <td className="px-4 py-3 font-semibold text-white">{s.name}</td>
                  <td className="px-4 py-3 text-gray-400">{s.city || "—"}</td>
                  <td className="px-4 py-3 text-gray-400">{s.phone || "—"}</td>
                  <td className="px-4 py-3">
                    <span className={`text-xs font-semibold px-2 py-1 rounded-full ${s.is_active ? "bg-green-500/15 text-green-400" : "bg-gray-700 text-gray-500"}`}>
                      {s.is_active ? "● Aktiv" : "○ Joaktiv"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <button onClick={() => handleToggle(s.id, s.is_active)}
                      className="text-xs text-yellow-400 hover:underline">
                      {s.is_active ? "Çaktivizo" : "Aktivizo"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* ── Modal Partner ── */}
      {(modal === "add" || modal === "edit") && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ backgroundColor: "rgba(0,0,0,0.7)" }} onClick={() => setModal(null)}>
          <div className="bg-gray-900 border border-gray-700 rounded-2xl w-full max-w-md p-6" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-bold text-white">{modal === "add" ? "Shto Partner" : "Edito Partner"}</h2>
              <button onClick={() => setModal(null)} className="text-gray-500 hover:text-white text-xl">×</button>
            </div>
            <div className="flex flex-col gap-3">
              <div><label className={labelClass}>Emri</label><input name="name" value={form.name} onChange={onChange} className={inputClass} placeholder="AutoParts Tirana" /></div>
              <div className="grid grid-cols-2 gap-3">
                <div><label className={labelClass}>Qyteti</label><input name="city" value={form.city} onChange={onChange} className={inputClass} placeholder="Tiranë" /></div>
                <div><label className={labelClass}>Zbritja (%)</label><input name="discount" type="number" value={form.discount} onChange={onChange} className={inputClass} /></div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div><label className={labelClass}>Telefon</label><input name="phone" value={form.phone} onChange={onChange} className={inputClass} /></div>
                <div><label className={labelClass}>Logo (2 shkronja)</label><input name="logo" value={form.logo} onChange={onChange} className={inputClass} maxLength={2} /></div>
              </div>
              <div><label className={labelClass}>Lloji</label>
                <select name="type" value={form.type} onChange={onChange} className={inputClass}>
                  <option value="dropshipping">Dropshipping</option>
                  <option value="direct">Jo-Dropshipping</option>
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

      {/* ── Modal Krijo Llogari Dyqani ── */}
      {modal === "createShop" && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ backgroundColor: "rgba(0,0,0,0.7)" }} onClick={() => { if (!result) setModal(null); }}>
          <div className="bg-gray-900 border border-gray-700 rounded-2xl w-full max-w-md p-6" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-bold text-white">Krijo Llogari Dyqani</h2>
              <button onClick={() => setModal(null)} className="text-gray-500 hover:text-white text-xl">×</button>
            </div>

            {result ? (
              <div className="flex flex-col gap-4">
                <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-4">
                  <p className="text-green-400 font-bold text-sm mb-2">✓ Llogaria u krijua me sukses!</p>
                  <p className="text-xs text-gray-300 mb-1">Dërgo këto kredenciale te dyqani:</p>
                  <div className="bg-gray-800 rounded-lg p-3 text-xs font-mono text-white space-y-1">
                    <p>Dyqani: <strong>{result.name}</strong></p>
                    <p>Email: <strong>{result.email}</strong></p>
                    <p>Fjalëkalimi: <strong>{result.password}</strong></p>
                    <p>URL: <strong>mjetmarket.com/dyqani/login</strong></p>
                  </div>
                </div>
                <button onClick={() => { setResult(null); setModal(null); }}
                  className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-2.5 rounded-xl text-sm transition-colors">
                  Mbyll
                </button>
              </div>
            ) : (
              <form action={handleCreateShop} className="flex flex-col gap-3">
                <div><label className={labelClass}>Emri i dyqanit *</label><input name="name" required value={shopForm.name} onChange={(e) => setShopForm(p => ({ ...p, name: e.target.value }))} className={inputClass} placeholder="AutoParts Tirana" /></div>
                <div><label className={labelClass}>Email * (do jetë username)</label><input name="email" type="email" required value={shopForm.email} onChange={(e) => setShopForm(p => ({ ...p, email: e.target.value }))} className={inputClass} placeholder="dyqani@email.com" /></div>
                <div><label className={labelClass}>Fjalëkalimi *</label><input name="password" type="text" required value={shopForm.password} onChange={(e) => setShopForm(p => ({ ...p, password: e.target.value }))} className={inputClass} placeholder="min. 6 karaktere" minLength={6} /></div>
                <div className="grid grid-cols-2 gap-3">
                  <div><label className={labelClass}>Qyteti</label><input name="city" value={shopForm.city} onChange={(e) => setShopForm(p => ({ ...p, city: e.target.value }))} className={inputClass} placeholder="Tiranë" /></div>
                  <div><label className={labelClass}>Telefon</label><input name="phone" value={shopForm.phone} onChange={(e) => setShopForm(p => ({ ...p, phone: e.target.value }))} className={inputClass} placeholder="069..." /></div>
                </div>
                {shopError && <p className="text-red-400 text-xs">{shopError}</p>}
                <div className="flex gap-3 mt-2">
                  <button type="button" onClick={() => setModal(null)} className="flex-1 border border-gray-700 text-gray-400 py-2.5 rounded-xl text-sm hover:bg-gray-800 transition-colors">Anulo</button>
                  <button type="submit" disabled={isPending} className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white font-bold py-2.5 rounded-xl text-sm transition-colors">
                    {isPending ? "Duke krijuar..." : "Krijo Llogarinë"}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
