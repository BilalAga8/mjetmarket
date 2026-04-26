"use client";

import { useState, useTransition } from "react";
import { createClient } from "@/lib/supabase-browser";

const supabase = createClient();

interface ShopOffer {
  id: string; shop_id: string; status: string;
  price: number; delivery_days: number; notes: string | null;
}

interface Request {
  id: string; full_name: string; phone: string; vin: string;
  vehicle_make: string; vehicle_model: string; vehicle_year: string;
  part_description: string; product_quality: string | null; extra_notes: string;
  created_at: string;
  shop_offers: ShopOffer[];
}

interface Props {
  requests: Request[];
  shopId: string;
  shopName: string;
  stats: { open: number; today: number; won: number };
}

const DELIVERY_OPTIONS = [
  { value: 0, label: "Sot" },
  { value: 2, label: "1-2 ditë" },
  { value: 5, label: "3-5 ditë" },
];

const BADGE: Record<string, { label: string; cls: string }> = {
  new:      { label: "E re",    cls: "bg-blue-500/15 text-blue-400 border-blue-400/30" },
  offered:  { label: "Ofertuar",cls: "bg-yellow-500/15 text-yellow-400 border-yellow-400/30" },
  selected: { label: "Fituar ✓",cls: "bg-green-500/15 text-green-400 border-green-400/30" },
  refused:  { label: "Refuzuar",cls: "bg-gray-500/15 text-gray-400 border-gray-400/30" },
};

function getStatus(offer: ShopOffer | undefined) {
  if (!offer) return "new";
  if (offer.status === "zgjedhur") return "selected";
  if (offer.status === "refuzuar") return "refused";
  return "offered";
}

export default function KerkestatClient({ requests, shopId, shopName, stats }: Props) {
  const [items, setItems]       = useState(requests);
  const [modal, setModal]       = useState<{ req: Request; offer: ShopOffer | undefined } | null>(null);
  const [offerForm, setOfferForm] = useState({ price: "", delivery_days: 2, notes: "" });
  const [isPending, startTransition] = useTransition();

  function openModal(req: Request) {
    const offer = req.shop_offers.find((o) => o.shop_id === shopId);
    setOfferForm({
      price:         offer ? String(offer.price) : "",
      delivery_days: offer ? offer.delivery_days : 2,
      notes:         offer?.notes ?? "",
    });
    setModal({ req, offer });
  }

  function handleSubmitOffer(e: React.FormEvent) {
    e.preventDefault();
    if (!modal) return;
    startTransition(async () => {
      const payload = {
        request_id:    modal.req.id,
        shop_id:       shopId,
        shop_name:     shopName,
        price:         parseFloat(offerForm.price),
        delivery_days: offerForm.delivery_days,
        notes:         offerForm.notes || null,
        status:        "pritje",
      };

      if (modal.offer) {
        await supabase.from("shop_offers").update(payload).eq("id", modal.offer.id);
      } else {
        await supabase.from("shop_offers").insert(payload);
      }

      // Refresh items locally
      const { data } = await supabase
        .from("part_requests")
        .select("*, shop_offers(id, shop_id, status, price, delivery_days, notes)")
        .eq("status", "pritje")
        .order("created_at", { ascending: false });
      if (data) setItems(data as Request[]);
      setModal(null);
    });
  }

  const deliveryLabel = (days: number) => DELIVERY_OPTIONS.find((o) => o.value === days)?.label ?? `${days} ditë`;

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        {[
          { label: "Kërkesa të hapura", value: stats.open, cls: "text-blue-500" },
          { label: "Ofertat e mia sot", value: stats.today, cls: "text-yellow-500" },
          { label: "Ofertat e pranuara", value: stats.won,  cls: "text-green-500" },
        ].map((s) => (
          <div key={s.label} className="bg-white border border-gray-200 rounded-2xl p-4 text-center shadow-sm">
            <p className={`text-3xl font-extrabold ${s.cls}`}>{s.value}</p>
            <p className="text-xs text-gray-500 mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      <h1 className="text-lg font-extrabold text-gray-900 mb-4">Kërkesat e Hapura</h1>

      {items.length === 0 && (
        <div className="text-center py-16 text-gray-400 text-sm">Nuk ka kërkesa të hapura akoma.</div>
      )}

      <div className="flex flex-col gap-4">
        {items.map((req) => {
          const myOffer = req.shop_offers.find((o) => o.shop_id === shopId);
          const status  = getStatus(myOffer);
          const badge   = BADGE[status];
          const date    = new Date(req.created_at).toLocaleDateString("sq-AL", { day: "numeric", month: "long" });

          return (
            <div key={req.id} className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">
              <div className="flex items-start justify-between gap-2 mb-3">
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-extrabold text-gray-900">{req.vehicle_make} {req.vehicle_model} · {req.vehicle_year}</span>
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full border ${badge.cls}`}>
                      {badge.label}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mt-0.5">
                    {req.part_description}
                    {req.product_quality && <span className="text-gray-400 ml-1">· {req.product_quality}</span>}
                  </p>
                </div>
              </div>

              <div className="border-t border-gray-100 pt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-400 mb-3">
                {req.vin && <span>VIN: {req.vin.slice(0, 8)}...</span>}
                <span>📅 {date}</span>
                {req.extra_notes && <span className="text-gray-500 italic">"{req.extra_notes}"</span>}
              </div>

              {myOffer ? (
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-green-600">{myOffer.price}€</span>
                    <span className="text-xs text-gray-400">· {deliveryLabel(myOffer.delivery_days)}</span>
                    {myOffer.notes && <span className="text-xs text-gray-400 italic">"{myOffer.notes}"</span>}
                  </div>
                  {status === "offered" && (
                    <button onClick={() => openModal(req)}
                      className="text-xs text-blue-500 font-semibold hover:underline">
                      Ndrysho Ofertën
                    </button>
                  )}
                </div>
              ) : (
                <button onClick={() => openModal(req)}
                  className="w-full bg-green-500 hover:bg-green-600 text-white text-sm font-bold py-2.5 rounded-xl transition-colors">
                  Dërgo Ofertën →
                </button>
              )}
            </div>
          );
        })}
      </div>

      {/* Offer Modal */}
      {modal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-extrabold text-gray-900 text-base">
                Oferto — {modal.req.vehicle_make} {modal.req.vehicle_model}
              </h2>
              <button onClick={() => setModal(null)} className="text-gray-400 hover:text-gray-700 text-xl leading-none">×</button>
            </div>
            <p className="text-xs text-gray-500 mb-4">{modal.req.part_description}</p>

            <form onSubmit={handleSubmitOffer} className="flex flex-col gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5">Çmimi (€) *</label>
                <input type="number" required step="0.01" min="1" value={offerForm.price}
                  onChange={(e) => setOfferForm(p => ({ ...p, price: e.target.value }))}
                  placeholder="28.00"
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500" />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5">Koha e dorëzimit *</label>
                <div className="grid grid-cols-3 gap-2">
                  {DELIVERY_OPTIONS.map((opt) => (
                    <button key={opt.value} type="button"
                      onClick={() => setOfferForm(p => ({ ...p, delivery_days: opt.value }))}
                      className={`py-2 rounded-xl text-xs font-semibold border transition-colors ${
                        offerForm.delivery_days === opt.value
                          ? "bg-green-500 text-white border-green-500"
                          : "border-gray-200 text-gray-600 hover:border-green-300"
                      }`}>
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5">Shënim (opsional)</label>
                <input type="text" value={offerForm.notes}
                  onChange={(e) => setOfferForm(p => ({ ...p, notes: e.target.value }))}
                  placeholder="p.sh. kam në stok, OEM origjinale..."
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500" />
              </div>

              <div className="flex gap-3 pt-1">
                <button type="button" onClick={() => setModal(null)}
                  className="flex-1 border border-gray-200 text-gray-600 text-sm font-semibold py-2.5 rounded-xl hover:bg-gray-50 transition-colors">
                  Anulo
                </button>
                <button type="submit" disabled={isPending}
                  className="flex-1 bg-green-500 hover:bg-green-600 disabled:opacity-60 text-white text-sm font-bold py-2.5 rounded-xl transition-colors">
                  {isPending ? "Duke dërguar..." : modal.offer ? "Ndrysho Ofertën" : "Dërgo Ofertën →"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
