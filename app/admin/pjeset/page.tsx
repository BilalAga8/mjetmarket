"use client";

import { useEffect, useState, useTransition } from "react";
import { STATUS_LABELS, STATUS_COLORS } from "../../../data/partRequests";
import type { PartRequest, OrderStatus } from "../../../data/partRequests";
import { createClient } from "@/lib/supabase-browser";
import { selectOffer } from "./actions";

const supabase = createClient();

interface ShopOffer {
  id: string; shop_id: string; shop_name: string;
  price: number; delivery_days: number; notes: string | null; status: string;
}

const DELIVERY_LABEL = (d: number) => d === 0 ? "Sot" : d <= 2 ? "1-2 ditë" : "3-5 ditë";

export default function AdminPjeset() {
  const [requests, setRequests]   = useState<PartRequest[]>([]);
  const [filterStatus, setFilterStatus] = useState<OrderStatus | "te-gjitha">("te-gjitha");
  const [selected, setSelected]   = useState<PartRequest | null>(null);
  const [offers, setOffers]       = useState<ShopOffer[]>([]);
  const [offerConfirm, setOfferConfirm] = useState<{ offer: ShopOffer; waLink: string } | null>(null);
  const [isPending, startTransition] = useTransition();

  function buildWaLink(req: PartRequest, offer: ShopOffer) {
    const phone = req.phone.replace(/\s+/g, "").replace(/^\+/, "").replace(/^0/, "355");
    const delivery = DELIVERY_LABEL(offer.delivery_days);
    const msg = `Përshëndetje ${req.full_name}! 👋\n\nGjetëm ofertën për *${req.part_description}* (${req.vehicle_make} ${req.vehicle_model} ${req.vehicle_year}):\n\n✅ Çmimi: *${offer.price}€*\n🚚 Dërgesa: *${delivery}*${offer.notes ? `\n📝 ${offer.notes}` : ""}\n\nNa kontaktoni për të konfirmuar porosinë. Faleminderit!`;
    return `https://wa.me/${phone}?text=${encodeURIComponent(msg)}`;
  }

  useEffect(() => {
    supabase
      .from("part_requests")
      .select("*")
      .order("created_at", { ascending: false })
      .then(({ data }) => { if (data) setRequests(data as PartRequest[]); });
  }, []);

  useEffect(() => {
    if (!selected) { setOffers([]); setOfferConfirm(null); return; }
    supabase.from("shop_offers").select("*").eq("request_id", selected.id)
      .order("price", { ascending: true })
      .then(({ data }) => setOffers((data ?? []) as ShopOffer[]));
  }, [selected]);

  function handleSelectOffer(offer: ShopOffer) {
    if (!selected) return;
    if (!confirm(`Zgjidh ofertën e "${offer.shop_name}" — ${offer.price}€?`)) return;
    startTransition(async () => {
      await selectOffer(offer.id, selected.id, offer.shop_name, offer.price);
      const updated = { ...selected, status: "proces" as OrderStatus, assigned_partner: offer.shop_name, client_price: String(offer.price) };
      setRequests((prev) => prev.map((r) => r.id === selected.id ? updated : r));
      setSelected(updated);
      setOfferConfirm({ offer, waLink: buildWaLink(selected, offer) });
      setOffers((prev) => prev.map((o) => ({ ...o, status: o.id === offer.id ? "zgjedhur" : "refuzuar" })));
    });
  }

  async function save(updated: PartRequest) {
    const { id, created_at, ...fields } = updated;
    await supabase.from("part_requests").update({ ...fields, updated_at: new Date().toISOString() }).eq("id", id);
    setRequests((prev) => prev.map((r) => (r.id === id ? updated : r)));
    setSelected(updated);
  }

  const filtered = filterStatus === "te-gjitha"
    ? requests
    : requests.filter((r) => r.status === filterStatus);

  const counts = {
    pritje:  requests.filter((r) => r.status === "pritje").length,
    proces:  requests.filter((r) => r.status === "proces").length,
    derguar: requests.filter((r) => r.status === "derguar").length,
    mbyllur: requests.filter((r) => r.status === "mbyllur").length,
  };

  return (
    <div className="p-4 sm:p-6 text-white">
      <h1 className="text-2xl font-extrabold text-white mb-1">Porositë — Pjesë Këmbimi</h1>
      <p className="text-gray-400 text-sm mb-6">{requests.length} kërkesa gjithsej</p>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        {(["pritje", "proces", "derguar", "mbyllur"] as OrderStatus[]).map((s) => (
          <button
            key={s}
            onClick={() => setFilterStatus(filterStatus === s ? "te-gjitha" : s)}
            className={`rounded-xl p-4 border text-left transition-all ${
              filterStatus === s ? "ring-2 ring-green-500" : ""
            } ${STATUS_COLORS[s]}`}
          >
            <p className="text-2xl font-extrabold">{counts[s]}</p>
            <p className="text-xs font-semibold mt-0.5">{STATUS_LABELS[s]}</p>
          </button>
        ))}
      </div>

      {/* Filter bar */}
      <div className="flex items-center gap-2 mb-4">
        <button
          onClick={() => setFilterStatus("te-gjitha")}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
            filterStatus === "te-gjitha"
              ? "bg-green-500/20 text-green-400"
              : "text-gray-400 hover:bg-gray-800"
          }`}
        >
          Të gjitha
        </button>
        {(["pritje", "proces", "derguar", "mbyllur"] as OrderStatus[]).map((s) => (
          <button
            key={s}
            onClick={() => setFilterStatus(s)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
              filterStatus === s
                ? "bg-green-500/20 text-green-400"
                : "text-gray-400 hover:bg-gray-800"
            }`}
          >
            {STATUS_LABELS[s]}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="bg-gray-900 rounded-2xl border border-gray-800 overflow-hidden">
        {filtered.length === 0 ? (
          <div className="py-16 text-center text-gray-500 text-sm">Nuk ka kërkesa</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-800 text-gray-400 text-xs">
                  <th className="text-left px-4 py-3 font-semibold">Klienti</th>
                  <th className="text-left px-4 py-3 font-semibold">Mjeti</th>
                  <th className="text-left px-4 py-3 font-semibold">Pjesa</th>
                  <th className="text-left px-4 py-3 font-semibold">Partneri</th>
                  <th className="text-left px-4 py-3 font-semibold">Statusi</th>
                  <th className="text-left px-4 py-3 font-semibold">Data</th>
                  <th className="px-4 py-3" />
                </tr>
              </thead>
              <tbody>
                {filtered.map((req, i) => (
                  <tr
                    key={req.id}
                    className={`border-b border-gray-800/50 hover:bg-gray-800/40 transition-colors ${
                      i === filtered.length - 1 ? "border-none" : ""
                    }`}
                  >
                    <td className="px-4 py-3">
                      <p className="font-semibold text-white">{req.full_name}</p>
                      <p className="text-gray-400 text-xs">{req.phone}</p>
                    </td>
                    <td className="px-4 py-3">
                      <p className="text-white">{req.vehicle_make} {req.vehicle_model}</p>
                      <p className="text-gray-400 text-xs">{req.vehicle_year} · {req.vin.slice(0, 8)}…</p>
                    </td>
                    <td className="px-4 py-3 text-gray-300">{req.part_description}</td>
                    <td className="px-4 py-3">
                      {req.assigned_partner ? (
                        <span className="text-green-400 font-semibold text-xs">{req.assigned_partner}</span>
                      ) : (
                        <span className="text-gray-600 text-xs">—</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`text-xs font-semibold px-2.5 py-1 rounded-lg border ${STATUS_COLORS[req.status]}`}>
                        {STATUS_LABELS[req.status]}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-400 text-xs whitespace-nowrap">
                      {new Date(req.created_at).toLocaleDateString("sq-AL")}
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => setSelected(req)}
                        className="text-xs text-green-400 hover:text-green-300 font-semibold"
                      >
                        Detaje
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Detail Modal */}
      {selected && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ backgroundColor: "rgba(0,0,0,0.7)" }}
          onClick={() => setSelected(null)}
        >
          <div
            className="bg-gray-900 border border-gray-700 rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6 flex flex-col gap-5">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-lg font-extrabold text-white">{selected.full_name}</h2>
                  <p className="text-gray-400 text-sm">{selected.phone}</p>
                </div>
                <button onClick={() => setSelected(null)} className="text-gray-500 hover:text-white text-xl leading-none">×</button>
              </div>

              {/* Info mjeti */}
              <div className="bg-gray-800 rounded-xl p-4 grid grid-cols-2 gap-3 text-sm">
                <div>
                  <p className="text-gray-400 text-xs mb-0.5">Mjeti</p>
                  <p className="text-white font-semibold">{selected.vehicle_make} {selected.vehicle_model} {selected.vehicle_year}</p>
                </div>
                <div>
                  <p className="text-gray-400 text-xs mb-0.5">VIN</p>
                  <p className="text-white font-mono text-xs">{selected.vin}</p>
                </div>
                <div>
                  <p className="text-gray-400 text-xs mb-0.5">Pjesa</p>
                  <p className="text-white font-semibold">{selected.part_description}</p>
                </div>
                {selected.extra_notes && (
                  <div>
                    <p className="text-gray-400 text-xs mb-0.5">Shënime klienti</p>
                    <p className="text-gray-300 text-xs">{selected.extra_notes}</p>
                  </div>
                )}
              </div>

              {/* Statusi */}
              <div>
                <label className="block text-xs font-semibold text-gray-400 mb-1.5">Statusi</label>
                <div className="flex flex-wrap gap-2">
                  {(["pritje", "proces", "derguar", "mbyllur"] as OrderStatus[]).map((s) => (
                    <button
                      key={s}
                      onClick={() => save({ ...selected, status: s })}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                        selected.status === s
                          ? STATUS_COLORS[s] + " ring-1 ring-current"
                          : "border-gray-700 text-gray-500 hover:border-gray-500"
                      }`}
                    >
                      {STATUS_LABELS[s]}
                    </button>
                  ))}
                </div>
              </div>

              {/* Partneri i caktuar — vendoset automatikisht kur zgjidhet oferta */}
              {selected.assigned_partner && (
                <div>
                  <label className="block text-xs font-semibold text-gray-400 mb-1.5">Dyqani i zgjedhur</label>
                  <div className="bg-green-500/10 border border-green-500/30 rounded-xl px-3 py-2 text-sm text-green-400 font-semibold">
                    ✓ {selected.assigned_partner}
                    {selected.client_price && <span className="ml-2 text-green-300">· {selected.client_price}€</span>}
                  </div>
                </div>
              )}

              {/* Çmimi + Shënime */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-400 mb-1.5">Çmimi për klientin (€)</label>
                  <input type="number" value={selected.client_price}
                    onChange={(e) => setSelected({ ...selected, client_price: e.target.value })}
                    onBlur={() => save(selected)} placeholder="0"
                    className="w-full bg-gray-800 border border-gray-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-green-500" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-400 mb-1.5">Shënime private</label>
                  <input type="text" value={selected.admin_notes}
                    onChange={(e) => setSelected({ ...selected, admin_notes: e.target.value })}
                    onBlur={() => save(selected)} placeholder="p.sh. blerje 30€"
                    className="w-full bg-gray-800 border border-gray-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-green-500" />
                </div>
              </div>

              {/* Ofertat e dyqaneve */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-semibold text-gray-400 uppercase tracking-wide">
                    Ofertat e Dyqaneve
                    {offers.length > 0 && (
                      <span className="ml-2 bg-green-500/20 text-green-400 text-xs px-2 py-0.5 rounded-full">
                        {offers.length} {offers.length === 1 ? "ofertë" : "oferta"}
                      </span>
                    )}
                  </label>
                </div>

                {offerConfirm && (
                  <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-4 mb-3">
                    <p className="text-xs text-green-400 font-semibold mb-3">
                      ✓ Oferta e &quot;{offerConfirm.offer.shop_name}&quot; ({offerConfirm.offer.price}€) u zgjodh.
                    </p>
                    <a
                      href={offerConfirm.waLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#1ebe5d] text-white text-sm font-bold px-4 py-2.5 rounded-xl transition-colors w-full"
                    >
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
                        <path d="M12 0C5.373 0 0 5.373 0 12c0 2.126.555 4.126 1.526 5.868L0 24l6.322-1.496A11.934 11.934 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.808 9.808 0 01-5.002-1.37l-.36-.214-3.726.882.937-3.618-.235-.372A9.796 9.796 0 012.182 12C2.182 6.57 6.57 2.182 12 2.182S21.818 6.57 21.818 12 17.43 21.818 12 21.818z"/>
                      </svg>
                      Dërgo te Klienti — WhatsApp
                    </a>
                  </div>
                )}

                {offers.length === 0 ? (
                  <div className="bg-gray-800 rounded-xl p-3 text-center text-gray-500 text-xs">
                    Nuk ka oferta ende — prit dyqanet të ofertojnë...
                  </div>
                ) : (
                  <div className="flex flex-col gap-2">
                    {offers.map((offer, i) => (
                      <div key={offer.id} className={`flex items-center gap-3 rounded-xl p-3 ${
                        offer.status === "zgjedhur" ? "bg-green-500/10 border border-green-500/30" :
                        offer.status === "refuzuar" ? "bg-gray-800/50 opacity-50" : "bg-gray-800"
                      }`}>
                        <span className="text-yellow-400 text-sm shrink-0">{i === 0 && offer.status === "pritje" ? "🥇" : ""}</span>
                        <div className="flex-1 min-w-0">
                          <p className="text-white text-sm font-bold">{offer.shop_name}</p>
                          <p className="text-gray-400 text-xs">
                            {DELIVERY_LABEL(offer.delivery_days)}
                            {offer.notes && <span className="ml-2 italic">"{offer.notes}"</span>}
                          </p>
                        </div>
                        <span className="text-green-400 font-extrabold text-sm">{offer.price}€</span>
                        {offer.status === "pritje" && (
                          <button onClick={() => handleSelectOffer(offer)} disabled={isPending}
                            className="bg-green-500 hover:bg-green-600 disabled:opacity-60 text-white text-xs font-bold px-3 py-1.5 rounded-lg transition-colors shrink-0">
                            Zgjidh
                          </button>
                        )}
                        {offer.status === "zgjedhur" && (
                          <span className="text-green-400 text-xs font-bold shrink-0">✓ Zgjedhur</span>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>

            </div>
          </div>
        </div>
      )}
    </div>
  );
}
