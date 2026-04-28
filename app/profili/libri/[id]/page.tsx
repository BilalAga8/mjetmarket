"use client";

import { useEffect, useState, use } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase-browser";

const KATEGORITE = [
  "Mirëmbajtje", "Karburant", "Riparim", "Kontroll Teknik",
  "Larje", "Dokumentacion", "Aksident", "Tjetër",
];

const KATEGORIA_ICON: Record<string, string> = {
  "Mirëmbajtje":    "🔧",
  "Karburant":      "⛽",
  "Riparim":        "🔩",
  "Kontroll Teknik":"🔍",
  "Larje":          "💧",
  "Dokumentacion":  "📋",
  "Aksident":       "💥",
  "Tjetër":         "📝",
};

const KATEGORIA_COLOR: Record<string, string> = {
  "Mirëmbajtje":    "bg-blue-50 text-blue-700",
  "Karburant":      "bg-orange-50 text-orange-700",
  "Riparim":        "bg-red-50 text-red-700",
  "Kontroll Teknik":"bg-purple-50 text-purple-700",
  "Larje":          "bg-cyan-50 text-cyan-700",
  "Dokumentacion":  "bg-gray-100 text-gray-700",
  "Aksident":       "bg-red-100 text-red-800",
  "Tjetër":         "bg-gray-50 text-gray-600",
};

interface Makina {
  id: string; marka: string; modeli: string; viti: number;
  ngjyra: string | null; targa: string | null; vin: string | null;
  km_fillestare: number | null; blere_me: string | null; shenime: string | null;
}

interface Shenime {
  id: string; data: string; kategoria: string; titulli: string;
  pershkrimi: string | null; cmimi: number | null; kilometrat: number | null;
}

export default function LibriDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [makina, setMakina] = useState<Makina | null>(null);
  const [shenime, setShenime] = useState<Shenime[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    data: new Date().toISOString().split("T")[0],
    kategoria: "Mirëmbajtje",
    titulli: "",
    pershkrimi: "",
    cmimi: "",
    kilometrat: "",
  });

  async function load() {
    const supabase = createClient();
    const [{ data: car }, { data: entries }] = await Promise.all([
      supabase.from("libri_makina").select("*").eq("id", id).single(),
      supabase.from("libri_shenime").select("*").eq("makina_id", id).order("data", { ascending: false }),
    ]);
    setMakina(car);
    setShenime((entries ?? []) as Shenime[]);
    setLoading(false);
  }

  useEffect(() => { load(); }, [id]);

  async function handleShto(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    await supabase.from("libri_shenime").insert({
      makina_id: id,
      user_id: user.id,
      data: form.data,
      kategoria: form.kategoria,
      titulli: form.titulli,
      pershkrimi: form.pershkrimi || null,
      cmimi: form.cmimi ? Number(form.cmimi) : null,
      kilometrat: form.kilometrat ? Number(form.kilometrat) : null,
    });

    setForm({
      data: new Date().toISOString().split("T")[0],
      kategoria: "Mirëmbajtje", titulli: "", pershkrimi: "", cmimi: "", kilometrat: "",
    });
    setModalOpen(false);
    setSaving(false);
    load();
  }

  async function handleFshijShenimi(shenimi_id: string) {
    if (!confirm("Fshij këtë shënim?")) return;
    const supabase = createClient();
    await supabase.from("libri_shenime").delete().eq("id", shenimi_id);
    setShenime((p) => p.filter((s) => s.id !== shenimi_id));
  }

  if (loading) return <p className="p-8 text-sm text-gray-400">Duke ngarkuar…</p>;
  if (!makina) return <p className="p-8 text-sm text-red-400">Makina nuk u gjet.</p>;

  const totalShpenzuar = shenime.reduce((s, r) => s + (r.cmimi ?? 0), 0);
  const kms = shenime.map((r) => r.kilometrat).filter(Boolean) as number[];
  const kmMax = kms.length ? Math.max(...kms) : null;
  const kmMin = kms.length ? Math.min(...kms) : null;
  const kmBere = kmMax && (makina.km_fillestare ?? kmMin) ? kmMax - (makina.km_fillestare ?? kmMin!) : null;

  const shpenzimetPerKategori = KATEGORITE.map((k) => ({
    k,
    total: shenime.filter((s) => s.kategoria === k).reduce((s, r) => s + (r.cmimi ?? 0), 0),
    count: shenime.filter((s) => s.kategoria === k).length,
  })).filter((x) => x.count > 0).sort((a, b) => b.total - a.total);

  return (
    <div className="p-6 max-w-3xl">
      {/* Header */}
      <div className="mb-6">
        <Link href="/profili/libri" className="text-xs text-gray-400 hover:text-gray-600 flex items-center gap-1 mb-3">
          ← Kthehu te libri
        </Link>
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-extrabold text-gray-900">{makina.marka} {makina.modeli}</h1>
            <p className="text-sm text-gray-400 mt-0.5">
              {makina.viti}
              {makina.targa && ` · ${makina.targa}`}
              {makina.ngjyra && ` · ${makina.ngjyra}`}
              {makina.vin && ` · VIN: ${makina.vin}`}
            </p>
            {makina.blere_me && (
              <p className="text-xs text-gray-400 mt-0.5">
                Blerë: {new Date(makina.blere_me).toLocaleDateString("sq-AL", { day: "numeric", month: "long", year: "numeric" })}
              </p>
            )}
          </div>
          <button
            onClick={() => setModalOpen(true)}
            className="shrink-0 bg-green-500 hover:bg-green-600 text-white text-sm font-semibold px-4 py-2.5 rounded-xl transition-colors"
          >
            + Shto Shënim
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        <div className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm text-center">
          <p className="text-xl font-extrabold text-gray-900">{shenime.length}</p>
          <p className="text-xs text-gray-400 mt-0.5">Shënime</p>
        </div>
        <div className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm text-center">
          <p className="text-xl font-extrabold text-green-600">{totalShpenzuar ? `${totalShpenzuar.toLocaleString()}€` : "—"}</p>
          <p className="text-xs text-gray-400 mt-0.5">Total shpenzuar</p>
        </div>
        <div className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm text-center">
          <p className="text-xl font-extrabold text-gray-900">{kmMax ? kmMax.toLocaleString() : "—"}</p>
          <p className="text-xs text-gray-400 mt-0.5">km fundit</p>
        </div>
        <div className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm text-center">
          <p className="text-xl font-extrabold text-gray-900">{kmBere ? `+${kmBere.toLocaleString()}` : "—"}</p>
          <p className="text-xs text-gray-400 mt-0.5">km të bëra</p>
        </div>
      </div>

      {/* Shpenzime per kategori */}
      {shpenzimetPerKategori.length > 0 && (
        <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm mb-6">
          <h2 className="text-sm font-bold text-gray-900 mb-3">Shpenzime sipas kategorisë</h2>
          <div className="flex flex-col gap-2">
            {shpenzimetPerKategori.map(({ k, total, count }) => (
              <div key={k} className="flex items-center gap-3">
                <span className="text-base w-6 text-center">{KATEGORIA_ICON[k]}</span>
                <span className="text-sm text-gray-700 flex-1">{k}</span>
                <span className="text-xs text-gray-400">{count} shënime</span>
                <span className="text-sm font-bold text-gray-900 w-16 text-right">{total ? `${total.toLocaleString()}€` : "—"}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Historia */}
      <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
        <h2 className="text-sm font-bold text-gray-900 mb-4">Historia e plotë</h2>

        {shenime.length === 0 ? (
          <div className="py-10 text-center">
            <p className="text-gray-400 text-sm mb-3">Nuk ka shënime akoma.</p>
            <button
              onClick={() => setModalOpen(true)}
              className="text-sm text-green-600 font-semibold hover:underline"
            >
              + Shto shënimin e parë
            </button>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {shenime.map((s) => (
              <div key={s.id} className="flex gap-3 p-3 border border-gray-100 rounded-xl hover:bg-gray-50 transition-colors group">
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-base shrink-0 ${KATEGORIA_COLOR[s.kategoria]}`}>
                  {KATEGORIA_ICON[s.kategoria]}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <p className="font-semibold text-gray-900 text-sm">{s.titulli}</p>
                    <div className="flex items-center gap-2 shrink-0">
                      {s.cmimi != null && (
                        <span className="text-sm font-bold text-gray-900">{s.cmimi.toLocaleString()}€</span>
                      )}
                      <button
                        onClick={() => handleFshijShenimi(s.id)}
                        className="opacity-0 group-hover:opacity-100 text-gray-300 hover:text-red-400 transition-all text-xs"
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className={`text-xs font-medium px-1.5 py-0.5 rounded-md ${KATEGORIA_COLOR[s.kategoria]}`}>{s.kategoria}</span>
                    <span className="text-xs text-gray-400">
                      {new Date(s.data).toLocaleDateString("sq-AL", { day: "numeric", month: "short", year: "numeric" })}
                    </span>
                    {s.kilometrat && <span className="text-xs text-gray-400">{s.kilometrat.toLocaleString()} km</span>}
                  </div>
                  {s.pershkrimi && <p className="text-xs text-gray-500 mt-1">{s.pershkrimi}</p>}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal — Shto Shënim */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <h2 className="font-bold text-gray-900">Shto Shënim të Ri</h2>
              <button onClick={() => setModalOpen(false)} className="text-gray-400 hover:text-gray-700">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                  <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleShto} className="px-6 py-5 flex flex-col gap-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-gray-600">Data *</label>
                  <input
                    required
                    type="date"
                    value={form.data}
                    onChange={(e) => setForm((p) => ({ ...p, data: e.target.value }))}
                    className="border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-green-500"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-gray-600">Kategoria *</label>
                  <select
                    required
                    value={form.kategoria}
                    onChange={(e) => setForm((p) => ({ ...p, kategoria: e.target.value }))}
                    className="border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-green-500"
                  >
                    {KATEGORITE.map((k) => (
                      <option key={k} value={k}>{KATEGORIA_ICON[k]} {k}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-gray-600">Titulli *</label>
                <input
                  required
                  value={form.titulli}
                  onChange={(e) => setForm((p) => ({ ...p, titulli: e.target.value }))}
                  placeholder="p.sh. Ndërrimi i vajit të motorit"
                  className="border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-green-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-gray-600">Çmimi (€)</label>
                  <input
                    type="number"
                    min={0}
                    step="0.01"
                    value={form.cmimi}
                    onChange={(e) => setForm((p) => ({ ...p, cmimi: e.target.value }))}
                    placeholder="0.00"
                    className="border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-green-500"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-gray-600">Kilometra</label>
                  <input
                    type="number"
                    min={0}
                    value={form.kilometrat}
                    onChange={(e) => setForm((p) => ({ ...p, kilometrat: e.target.value }))}
                    placeholder="p.sh. 95000"
                    className="border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-green-500"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-gray-600">Përshkrim (opsional)</label>
                <textarea
                  rows={2}
                  value={form.pershkrimi}
                  onChange={(e) => setForm((p) => ({ ...p, pershkrimi: e.target.value }))}
                  placeholder="Detaje shtesë…"
                  className="border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-green-500 resize-none"
                />
              </div>

              <div className="flex gap-3 pt-1">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="flex-1 border border-gray-200 text-gray-600 text-sm font-semibold py-2.5 rounded-xl hover:bg-gray-50 transition-colors"
                >
                  Anulo
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 bg-green-500 hover:bg-green-600 disabled:opacity-60 text-white text-sm font-semibold py-2.5 rounded-xl transition-colors"
                >
                  {saving ? "Duke ruajtur…" : "Ruaj Shënimin"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
