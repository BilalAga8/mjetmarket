"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase-browser";

interface Service {
  id: number;
  name: string;
  city: string;
  phone: string;
  category: string;
}

interface Props {
  vehicleId: string;
  brand: string;
  model: string;
  year: number;
  services: Service[];
}

export default function AppointmentModal({ vehicleId, brand, model, year, services }: Readonly<Props>) {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ name: "", phone: "", date: "", serviceId: "", note: "" });
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  function close() { setOpen(false); setSent(false); setForm({ name: "", phone: "", date: "", serviceId: "", note: "" }); }

  const selectedService = services.find((s) => String(s.id) === form.serviceId);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSending(true);
    const supabase = createClient();
    const servicePart = selectedService
      ? ` | Servisi: ${selectedService.name}, ${selectedService.city} (${selectedService.phone})`
      : "";
    await supabase.from("vehicle_inquiries").insert({
      vehicle_id: vehicleId,
      name: form.name.trim(),
      phone: form.phone.trim() || null,
      message: `TAKIM PËR KONTROLL — Data: ${form.date}${servicePart}${form.note ? ` | Shënim: ${form.note}` : ""}`,
    });
    setSending(false);
    setSent(true);
  }

  const inputClass = "w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-500";

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="w-full border-2 border-blue-500 text-blue-600 hover:bg-blue-50 font-semibold py-3 rounded-xl transition-colors duration-200 text-sm flex items-center justify-center gap-2"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="4" width="18" height="18" rx="2" />
          <line x1="16" y1="2" x2="16" y2="6" />
          <line x1="8" y1="2" x2="8" y2="6" />
          <line x1="3" y1="10" x2="21" y2="10" />
        </svg>
        Lër takim për kontroll
      </button>

      {open && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4" onClick={close}>
          <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-sm max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-lg font-bold text-gray-900">Takim për Kontroll</h2>
                <p className="text-xs text-gray-400">{brand} {model} {year}</p>
              </div>
              <button onClick={close} className="w-8 h-8 rounded-xl bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-500">✕</button>
            </div>

            {sent ? (
              <div className="text-center py-4">
                <div className="text-4xl mb-3">✅</div>
                <p className="font-semibold text-gray-900 mb-1">Kërkesa u dërgua!</p>
                <p className="text-sm text-gray-400">Shitësi do ju kontaktojë për të konfirmuar takimin.</p>
                {selectedService && (
                  <div className="mt-4 bg-blue-50 rounded-xl p-3 text-left">
                    <p className="text-xs text-blue-700 font-semibold">Servisi i zgjedhur:</p>
                    <p className="text-sm font-bold text-blue-900">{selectedService.name}</p>
                    <p className="text-xs text-blue-600">{selectedService.city} · {selectedService.phone}</p>
                  </div>
                )}
                <button onClick={close} className="mt-4 text-sm text-blue-600 font-semibold hover:underline">Mbyll</button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col gap-3">
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1 block">Emri juaj *</label>
                  <input required value={form.name} onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
                    placeholder="Emri Mbiemri" className={inputClass} />
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1 block">Telefoni *</label>
                  <input required type="tel" value={form.phone} onChange={(e) => setForm((p) => ({ ...p, phone: e.target.value }))}
                    placeholder="+355 69 000 0000" className={inputClass} />
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1 block">Data e preferuar *</label>
                  <input required type="date" value={form.date} onChange={(e) => setForm((p) => ({ ...p, date: e.target.value }))}
                    min={new Date().toISOString().split("T")[0]} className={inputClass} />
                </div>

                {services.length > 0 && (
                  <div>
                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1 block">Zgjidh Servisin</label>
                    <select value={form.serviceId} onChange={(e) => setForm((p) => ({ ...p, serviceId: e.target.value }))}
                      className={inputClass + " bg-white"}>
                      <option value="">— Pa preferencë —</option>
                      {services.map((s) => (
                        <option key={s.id} value={String(s.id)}>
                          {s.name} · {s.city}
                        </option>
                      ))}
                    </select>
                    {selectedService && (
                      <a href={`tel:${selectedService.phone.replace(/\s/g, "")}`}
                        className="text-xs text-green-600 font-semibold mt-1 block hover:underline">
                        📞 {selectedService.phone}
                      </a>
                    )}
                  </div>
                )}

                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1 block">Shënim (opsional)</label>
                  <input value={form.note} onChange={(e) => setForm((p) => ({ ...p, note: e.target.value }))}
                    placeholder="p.sh. pasdite pas orës 15:00" className={inputClass} />
                </div>

                <button type="submit" disabled={sending}
                  className="w-full bg-blue-500 hover:bg-blue-600 disabled:opacity-60 text-white font-semibold py-3 rounded-xl transition-colors text-sm mt-1">
                  {sending ? "Duke dërguar…" : "Dërgo Kërkesën"}
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  );
}
