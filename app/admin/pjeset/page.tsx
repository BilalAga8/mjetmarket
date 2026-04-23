"use client";

import { useEffect, useState } from "react";
import { STATUS_LABELS, STATUS_COLORS } from "../../../data/partRequests";
import type { PartRequest, OrderStatus, PartnerType } from "../../../data/partRequests";
import { createClient } from "@/lib/supabase-browser";
const supabase = createClient();

const PARTNERS: { value: PartnerType; label: string; type: string }[] = [
  { value: "A", label: "Partner A", type: "Dropshipping" },
  { value: "B", label: "Partner B", type: "Dropshipping" },
  { value: "C", label: "Partner C", type: "Jo-Dropshipping" },
  { value: "D", label: "Partner D", type: "Jo-Dropshipping" },
];

export default function AdminPjeset() {
  const [requests, setRequests] = useState<PartRequest[]>([]);
  const [filterStatus, setFilterStatus] = useState<OrderStatus | "te-gjitha">("te-gjitha");
  const [selected, setSelected] = useState<PartRequest | null>(null);

  useEffect(() => {
    supabase
      .from("part_requests")
      .select("*")
      .order("created_at", { ascending: false })
      .then(({ data }) => { if (data) setRequests(data as PartRequest[]); });
  }, []);

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
                        <span className="text-green-400 font-semibold">
                          {PARTNERS.find((p) => p.value === req.assigned_partner)?.label}
                        </span>
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

              {/* Partneri */}
              <div>
                <label className="block text-xs font-semibold text-gray-400 mb-1.5">Partneri i caktuar</label>
                <div className="flex flex-wrap gap-2">
                  {PARTNERS.map((p) => (
                    <button
                      key={p.value}
                      onClick={() => save({ ...selected, assigned_partner: p.value })}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                        selected.assigned_partner === p.value
                          ? "bg-green-500/20 text-green-400 border-green-500/40"
                          : "border-gray-700 text-gray-500 hover:border-gray-500"
                      }`}
                    >
                      {p.label}
                      <span className="ml-1 text-gray-500 font-normal">({p.type})</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Çmimi + Shënime */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-400 mb-1.5">Çmimi për klientin (€)</label>
                  <input
                    type="number"
                    value={selected.client_price}
                    onChange={(e) => setSelected({ ...selected, client_price: e.target.value })}
                    onBlur={() => save(selected)}
                    placeholder="0"
                    className="w-full bg-gray-800 border border-gray-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-green-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-400 mb-1.5">Shënime private</label>
                  <input
                    type="text"
                    value={selected.admin_notes}
                    onChange={(e) => setSelected({ ...selected, admin_notes: e.target.value })}
                    onBlur={() => save(selected)}
                    placeholder="p.sh. blerje 30€"
                    className="w-full bg-gray-800 border border-gray-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-green-500"
                  />
                </div>
              </div>

            </div>
          </div>
        </div>
      )}
    </div>
  );
}
