"use client";

import { useEffect, useState } from "react";
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

const MARKAT = [
  "Alfa Romeo","Audi","BMW","Chevrolet","Citroën","Dacia","Fiat","Ford",
  "Honda","Hyundai","Jeep","Kia","Mazda","Mercedes-Benz","Mitsubishi",
  "Nissan","Opel","Peugeot","Renault","Seat","Škoda","Subaru","Suzuki",
  "Toyota","Volkswagen","Volvo","Tjetër",
];

interface Shenime {
  id: string; data: string; kategoria: string; titulli: string;
  pershkrimi: string | null; cmimi: number | null; kilometrat: number | null;
}

interface Makina {
  id: string; marka: string; modeli: string; viti: number;
  ngjyra: string | null; targa: string | null; vin: string | null;
  km_fillestare: number | null; blere_me: string | null; shenime_text: string | null;
  entries: Shenime[];
}

const KARBURANT_KAT = "Karburant";

const emptyMakinaForm = () => ({
  marka: "", modeli: "", viti: new Date().getFullYear(),
  ngjyra: "", targa: "", vin: "", km_fillestare: "", blere_me: "", shenime: "",
});

const emptyShenimi = () => ({
  data: new Date().toISOString().split("T")[0],
  kategoria: "Mirëmbajtje", titulli: "", pershkrimi: "", cmimi: "", kilometrat: "",
});

export default function LibriPage() {
  const [makina, setMakina] = useState<Makina[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal shto makinë
  const [makinaModal, setMakinaModal] = useState(false);
  const [makinaForm, setMakinaForm] = useState(emptyMakinaForm());
  const [savingMakina, setSavingMakina] = useState(false);

  // Modal shto shënim
  const [shenimiModal, setShenimiModal] = useState<string | null>(null); // makina_id
  const [shenimiForm, setShenimiForm] = useState(emptyShenimi());
  const [savingShenimi, setSavingShenimi] = useState(false);

  async function load() {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data: cars } = await supabase
      .from("libri_makina")
      .select("id, marka, modeli, viti, ngjyra, targa, vin, km_fillestare, blere_me, shenime")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (!cars) { setLoading(false); return; }

    const enriched = await Promise.all(cars.map(async (car) => {
      const { data: entries } = await supabase
        .from("libri_shenime")
        .select("id, data, kategoria, titulli, pershkrimi, cmimi, kilometrat")
        .eq("makina_id", car.id)
        .order("data", { ascending: true });
      return { ...car, shenime_text: car.shenime, entries: (entries ?? []) as Shenime[] };
    }));

    setMakina(enriched);
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  async function handleShtoMakina(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSavingMakina(true);
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    await supabase.from("libri_makina").insert({
      user_id: user.id,
      marka: makinaForm.marka, modeli: makinaForm.modeli,
      viti: Number(makinaForm.viti),
      ngjyra: makinaForm.ngjyra || null, targa: makinaForm.targa || null,
      vin: makinaForm.vin || null,
      km_fillestare: makinaForm.km_fillestare ? Number(makinaForm.km_fillestare) : null,
      blere_me: makinaForm.blere_me || null,
      shenime: makinaForm.shenime || null,
    });
    setMakinaForm(emptyMakinaForm());
    setMakinaModal(false);
    setSavingMakina(false);
    load();
  }

  async function handleShtoShenimi(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!shenimiModal) return;
    setSavingShenimi(true);
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    await supabase.from("libri_shenime").insert({
      makina_id: shenimiModal, user_id: user.id,
      data: shenimiForm.data, kategoria: shenimiForm.kategoria,
      titulli: shenimiForm.titulli,
      pershkrimi: shenimiForm.pershkrimi || null,
      cmimi: shenimiForm.cmimi ? Number(shenimiForm.cmimi) : null,
      kilometrat: shenimiForm.kilometrat ? Number(shenimiForm.kilometrat) : null,
    });
    setShenimiForm(emptyShenimi());
    setShenimiModal(null);
    setSavingShenimi(false);
    load();
  }

  async function handleFshijShenimi(shenimi_id: string) {
    if (!confirm("Fshij këtë shënim?")) return;
    const supabase = createClient();
    await supabase.from("libri_shenime").delete().eq("id", shenimi_id);
    load();
  }

  async function handleFshijMakina(id: string) {
    if (!confirm("Fshij këtë makinë dhe të gjitha shënimet e saj?")) return;
    const supabase = createClient();
    await supabase.from("libri_makina").delete().eq("id", id);
    setMakina((p) => p.filter((m) => m.id !== id));
  }

  return (
    <div className="p-6 max-w-3xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900">Libri Shënimesh</h1>
          <p className="text-sm text-gray-400 mt-0.5">Historiku i mirëmbajtjes së makinave tuaja</p>
        </div>
        <button
          onClick={() => setMakinaModal(true)}
          className="bg-green-500 hover:bg-green-600 text-white text-sm font-semibold px-4 py-2.5 rounded-xl transition-colors"
        >
          + Shto Makinë
        </button>
      </div>

      {loading ? (
        <p className="text-sm text-gray-400 py-12 text-center">Duke ngarkuar…</p>
      ) : makina.length === 0 ? (
        <div className="bg-white border border-gray-100 rounded-2xl p-12 text-center shadow-sm">
          <div className="text-5xl mb-4">📓</div>
          <p className="font-semibold text-gray-700 mb-1">Libri juaj është bosh</p>
          <p className="text-sm text-gray-400 mb-5">Shtoni makinën tuaj për të filluar historikun</p>
          <button
            onClick={() => setMakinaModal(true)}
            className="bg-green-500 hover:bg-green-600 text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition-colors"
          >
            + Shto Makinën e Parë
          </button>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {makina.map((m) => {
            const totalShpenzuar = m.entries.reduce((s, r) => s + (r.cmimi ?? 0), 0);
            const kms = m.entries.map((r) => r.kilometrat).filter(Boolean) as number[];
            const kmMax = kms.length ? Math.max(...kms) : null;

            return (
              <div key={m.id} className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
                {/* Car header */}
                <div className="flex items-center gap-4 px-5 py-4">
                  <div className="w-10 h-10 rounded-xl bg-green-50 flex items-center justify-center text-xl shrink-0">🚗</div>
                  <div className="flex-1 min-w-0">
                    <p className="font-extrabold text-gray-900">{m.marka} {m.modeli} <span className="font-normal text-gray-400">{m.viti}</span></p>
                    <p className="text-xs text-gray-400 mt-0.5">
                      {m.targa ?? "Pa targë"}
                      {m.ngjyra ? ` · ${m.ngjyra}` : ""}
                      {m.km_fillestare ? ` · ${m.km_fillestare.toLocaleString()} km fillestare` : ""}
                    </p>
                  </div>
                  <div className="flex items-center gap-4 shrink-0 text-right">
                    <div className="hidden sm:block">
                      <p className="text-sm font-bold text-gray-900">{totalShpenzuar ? `${totalShpenzuar.toLocaleString()}€` : "—"}</p>
                      <p className="text-xs text-gray-400">shpenzuar</p>
                    </div>
                    <div className="hidden sm:block">
                      <p className="text-sm font-bold text-gray-900">{kmMax ? kmMax.toLocaleString() : "—"}</p>
                      <p className="text-xs text-gray-400">km fundit</p>
                    </div>
                  </div>
                </div>

                {/* Content — gjithmonë i hapur */}
                <div className="border-t border-gray-100 px-5 py-4">
                    {/* Titulli + butonat */}
                    <div className="flex items-center justify-between mb-4">
                      <h2 className="text-sm font-bold text-gray-700">Libri i Makinës Time</h2>
                      <div className="flex gap-2">
                        <button
                          onClick={() => { setShenimiModal(m.id); setShenimiForm(emptyShenimi()); }}
                          className="text-xs bg-green-500 hover:bg-green-600 text-white font-semibold px-3 py-1.5 rounded-lg transition-colors"
                        >
                          + Shto Shërbime
                        </button>
                        <button
                          onClick={() => handleFshijMakina(m.id)}
                          className="text-xs border border-gray-200 text-gray-400 hover:text-red-500 hover:border-red-200 font-semibold px-3 py-1.5 rounded-lg transition-colors"
                        >
                          Fshij
                        </button>
                      </div>
                    </div>

                    {/* Lista e të gjitha shënimeve */}
                    {m.entries.length === 0 ? (
                      <p className="text-sm text-gray-400 py-4 text-center">Nuk ka shënime të regjistruara akoma.</p>
                    ) : (
                      <div className="flex flex-col gap-1">
                        {(() => {
                          let sherbimCount = 0;
                          return m.entries.map((s) => {
                            sherbimCount++;
                            return (
                              <div key={s.id} className="flex items-start gap-3 py-2 border-b border-gray-50 last:border-0 group">
                                <span className="text-xs font-bold text-gray-300 w-20 shrink-0 pt-0.5">
                                  Shërbimi {sherbimCount}
                                </span>
                                <div className="flex-1 flex flex-wrap items-center gap-x-2 gap-y-0.5">
                                  <span className="text-base">{KATEGORIA_ICON[s.kategoria]}</span>
                                  {s.kilometrat && (
                                    <span className="text-xs font-mono text-gray-500">{s.kilometrat.toLocaleString()} km</span>
                                  )}
                                  <span className="text-xs text-gray-300">·</span>
                                  <span className="text-sm font-medium text-gray-800">{s.titulli}</span>
                                  {s.pershkrimi && (
                                    <span className="text-xs text-gray-400 italic">{s.pershkrimi}</span>
                                  )}
                                </div>
                                <div className="flex items-center gap-2 shrink-0">
                                  {s.cmimi != null && (
                                    <span className="text-xs font-bold text-gray-700">{s.cmimi.toLocaleString()}€</span>
                                  )}
                                  <span className="text-xs text-gray-300">
                                    {new Date(s.data).toLocaleDateString("sq-AL", { day: "numeric", month: "short", year: "2-digit" })}
                                  </span>
                                  <button
                                    onClick={() => handleFshijShenimi(s.id)}
                                    className="opacity-0 group-hover:opacity-100 text-gray-300 hover:text-red-400 transition-all text-xs ml-1"
                                  >
                                    ✕
                                  </button>
                                </div>
                              </div>
                            );
                          });
                        })()}
                      </div>
                    )}
                  </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal — Shto Makinë */}
      {makinaModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 sticky top-0 bg-white">
              <h2 className="font-bold text-gray-900">Shto Makinë të Re</h2>
              <button onClick={() => setMakinaModal(false)} className="text-gray-400 hover:text-gray-700">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                  <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>
            <form onSubmit={handleShtoMakina} className="px-6 py-5 flex flex-col gap-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="m-marka" className="text-xs font-semibold text-gray-600">Marka *</label>
                  <select id="m-marka" required value={makinaForm.marka} onChange={(e) => setMakinaForm((p) => ({ ...p, marka: e.target.value }))}
                    className="border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-green-500">
                    <option value="">Zgjedh markën</option>
                    {MARKAT.map((mk) => <option key={mk} value={mk}>{mk}</option>)}
                  </select>
                </div>
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="m-modeli" className="text-xs font-semibold text-gray-600">Modeli *</label>
                  <input id="m-modeli" required value={makinaForm.modeli} onChange={(e) => setMakinaForm((p) => ({ ...p, modeli: e.target.value }))}
                    placeholder="p.sh. Golf, Corolla"
                    className="border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-green-500" />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="m-viti" className="text-xs font-semibold text-gray-600">Viti *</label>
                  <input id="m-viti" required type="number" min={1970} max={new Date().getFullYear() + 1}
                    value={makinaForm.viti} onChange={(e) => setMakinaForm((p) => ({ ...p, viti: Number(e.target.value) }))}
                    className="border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-green-500" />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="m-ngjyra" className="text-xs font-semibold text-gray-600">Ngjyra</label>
                  <input id="m-ngjyra" value={makinaForm.ngjyra} onChange={(e) => setMakinaForm((p) => ({ ...p, ngjyra: e.target.value }))}
                    placeholder="p.sh. E zezë"
                    className="border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-green-500" />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="m-targa" className="text-xs font-semibold text-gray-600">Targa</label>
                  <input id="m-targa" value={makinaForm.targa} onChange={(e) => setMakinaForm((p) => ({ ...p, targa: e.target.value.toUpperCase() }))}
                    placeholder="AA 000 BB"
                    className="border border-gray-200 rounded-xl px-3 py-2 text-sm font-mono focus:outline-none focus:border-green-500" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="m-vin" className="text-xs font-semibold text-gray-600">VIN</label>
                  <input id="m-vin" value={makinaForm.vin} onChange={(e) => setMakinaForm((p) => ({ ...p, vin: e.target.value.toUpperCase() }))}
                    placeholder="17 karaktere" maxLength={17}
                    className="border border-gray-200 rounded-xl px-3 py-2 text-sm font-mono focus:outline-none focus:border-green-500" />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="m-blere" className="text-xs font-semibold text-gray-600">Blerë më</label>
                  <input id="m-blere" type="date" value={makinaForm.blere_me} onChange={(e) => setMakinaForm((p) => ({ ...p, blere_me: e.target.value }))}
                    className="border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-green-500" />
                </div>
              </div>
              <div className="flex flex-col gap-1.5">
                <label htmlFor="m-km" className="text-xs font-semibold text-gray-600">Kilometra fillestare</label>
                <input id="m-km" type="number" min={0} value={makinaForm.km_fillestare}
                  onChange={(e) => setMakinaForm((p) => ({ ...p, km_fillestare: e.target.value }))}
                  placeholder="p.sh. 85000"
                  className="border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-green-500" />
              </div>
              <div className="flex flex-col gap-1.5">
                <label htmlFor="m-shenime" className="text-xs font-semibold text-gray-600">Shënime shtesë</label>
                <textarea id="m-shenime" rows={2} value={makinaForm.shenime} onChange={(e) => setMakinaForm((p) => ({ ...p, shenime: e.target.value }))}
                  placeholder="Çfarë duhet të dini për këtë makinë…"
                  className="border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-green-500 resize-none" />
              </div>
              <div className="flex gap-3 pt-1">
                <button type="button" onClick={() => setMakinaModal(false)}
                  className="flex-1 border border-gray-200 text-gray-600 text-sm font-semibold py-2.5 rounded-xl hover:bg-gray-50 transition-colors">
                  Anulo
                </button>
                <button type="submit" disabled={savingMakina}
                  className="flex-1 bg-green-500 hover:bg-green-600 disabled:opacity-60 text-white text-sm font-semibold py-2.5 rounded-xl transition-colors">
                  {savingMakina ? "Duke ruajtur…" : "Shto Makinën"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal — Shto Shënim */}
      {shenimiModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <h2 className="font-bold text-gray-900">Shto Shënim</h2>
              <button onClick={() => setShenimiModal(null)} className="text-gray-400 hover:text-gray-700">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                  <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>
            <form onSubmit={handleShtoShenimi} className="px-6 py-5 flex flex-col gap-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="s-data" className="text-xs font-semibold text-gray-600">Data *</label>
                  <input id="s-data" required type="date" value={shenimiForm.data}
                    onChange={(e) => setShenimiForm((p) => ({ ...p, data: e.target.value }))}
                    className="border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-green-500" />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="s-kat" className="text-xs font-semibold text-gray-600">Kategoria *</label>
                  <select id="s-kat" required value={shenimiForm.kategoria}
                    onChange={(e) => setShenimiForm((p) => ({ ...p, kategoria: e.target.value }))}
                    className="border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-green-500">
                    {KATEGORITE.map((k) => <option key={k} value={k}>{KATEGORIA_ICON[k]} {k}</option>)}
                  </select>
                </div>
              </div>
              <div className="flex flex-col gap-1.5">
                <label htmlFor="s-titulli" className="text-xs font-semibold text-gray-600">Titulli *</label>
                <input id="s-titulli" required value={shenimiForm.titulli}
                  onChange={(e) => setShenimiForm((p) => ({ ...p, titulli: e.target.value }))}
                  placeholder="p.sh. Ndërrimi i vajit të motorit"
                  className="border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-green-500" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="s-cmimi" className="text-xs font-semibold text-gray-600">Çmimi (€)</label>
                  <input id="s-cmimi" type="number" min={0} step="0.01" value={shenimiForm.cmimi}
                    onChange={(e) => setShenimiForm((p) => ({ ...p, cmimi: e.target.value }))}
                    placeholder="0.00"
                    className="border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-green-500" />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="s-km" className="text-xs font-semibold text-gray-600">Kilometra</label>
                  <input id="s-km" type="number" min={0} value={shenimiForm.kilometrat}
                    onChange={(e) => setShenimiForm((p) => ({ ...p, kilometrat: e.target.value }))}
                    placeholder="p.sh. 95000"
                    className="border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-green-500" />
                </div>
              </div>
              <div className="flex flex-col gap-1.5">
                <label htmlFor="s-pershkrimi" className="text-xs font-semibold text-gray-600">Përshkrim (opsional)</label>
                <textarea id="s-pershkrimi" rows={2} value={shenimiForm.pershkrimi}
                  onChange={(e) => setShenimiForm((p) => ({ ...p, pershkrimi: e.target.value }))}
                  placeholder="Detaje shtesë…"
                  className="border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-green-500 resize-none" />
              </div>
              <div className="flex gap-3 pt-1">
                <button type="button" onClick={() => setShenimiModal(null)}
                  className="flex-1 border border-gray-200 text-gray-600 text-sm font-semibold py-2.5 rounded-xl hover:bg-gray-50 transition-colors">
                  Anulo
                </button>
                <button type="submit" disabled={savingShenimi}
                  className="flex-1 bg-green-500 hover:bg-green-600 disabled:opacity-60 text-white text-sm font-semibold py-2.5 rounded-xl transition-colors">
                  {savingShenimi ? "Duke ruajtur…" : "Ruaj Shënimin"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
