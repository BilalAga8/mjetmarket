"use client";

import { useState } from "react";
import { partCategories } from "../data/partCategories";
import { supabase } from "../lib/supabase";

interface Service {
  id: number;
  name: string;
  city: string;
  phone: string;
}

interface Props {
  preselectedPart?: string;
  onClose?: () => void;
  services?: Service[];
}

export default function PartRequestForm({ preselectedPart = "", onClose, services = [] }: Props) {
  const [submitted, setSubmitted] = useState(false);
  const [showServices, setShowServices] = useState(false);
  const [form, setForm] = useState({
    full_name: "",
    phone: "",
    vin: "",
    vehicle_make: "",
    vehicle_model: "",
    vehicle_year: "",
    part_description: preselectedPart,
    product_quality: "",
    extra_notes: "",
  });

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    await supabase.from("part_requests").insert([{ ...form, status: "pritje" }]);
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <div className="py-8 px-6">
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-green-500/15 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">Kërkesa u dërgua!</h3>
          <p className="text-gray-500 text-sm">
            Do t'ju kontaktojmë në numrin <strong>{form.phone}</strong> sa më shpejt.
          </p>
        </div>

        {services.length > 0 && !showServices && (
          <div className="bg-blue-50 border border-blue-100 rounded-2xl p-5 mb-4 text-center">
            <p className="text-sm font-bold text-gray-900 mb-1">Ju duhet instalim?</p>
            <p className="text-xs text-gray-500 mb-4">Gjej një servis afër jush ku mund të instaloni pjesën.</p>
            <div className="flex gap-2 justify-center">
              <button onClick={() => setShowServices(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-5 py-2 rounded-xl transition-colors">
                Po, gjej servis
              </button>
              <button onClick={onClose}
                className="border border-gray-200 text-gray-500 text-sm font-semibold px-5 py-2 rounded-xl hover:bg-gray-50 transition-colors">
                Jo, faleminderit
              </button>
            </div>
          </div>
        )}

        {showServices && (
          <div className="flex flex-col gap-2 mb-4 max-h-64 overflow-y-auto">
            <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-1">Servise të disponueshme</p>
            {services.map((s) => (
              <div key={s.id} className="flex items-center justify-between bg-white border border-gray-100 rounded-xl px-4 py-3">
                <div>
                  <p className="text-sm font-semibold text-gray-900">{s.name}</p>
                  <p className="text-xs text-gray-400">{s.city}</p>
                </div>
                <a href={`tel:${s.phone.replace(/\s/g, "")}`}
                  className="text-xs bg-green-50 text-green-700 font-semibold px-3 py-1.5 rounded-lg hover:bg-green-100 transition-colors shrink-0">
                  📞 Telefono
                </a>
              </div>
            ))}
          </div>
        )}

        {(!services.length || showServices) && (
          <button onClick={onClose}
            className="w-full bg-green-600 text-white font-semibold px-6 py-2.5 rounded-xl hover:bg-green-700 transition-colors text-sm">
            Mbyll
          </button>
        )}
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 p-6">
      <h2 className="text-xl font-bold text-gray-900 mb-1">Kërko Pjesën</h2>
      <p className="text-sm text-gray-500 -mt-2 mb-1">
        Plotëso formularin dhe do të të kontaktojmë me çmimin brenda pak orësh.
      </p>

      {/* Të dhënat e klientit */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1">Emri i plotë *</label>
          <input
            name="full_name"
            value={form.full_name}
            onChange={handleChange}
            required
            placeholder="p.sh. Arben Krasniqi"
            className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1">Numri i telefonit *</label>
          <input
            name="phone"
            value={form.phone}
            onChange={handleChange}
            required
            placeholder="+355 6X XXX XXXX"
            className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500"
          />
        </div>
      </div>

      {/* Të dhënat e mjetit */}
      <div>
        <label className="block text-xs font-semibold text-gray-700 mb-1">Numri i shasisë (VIN) *</label>
        <input
          name="vin"
          value={form.vin}
          onChange={handleChange}
          required
          placeholder="p.sh. WBA3A5G5XDNN12345"
          className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm font-mono focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500"
        />
        <p className="text-xs text-gray-400 mt-1">Gjendet në dokumentet e mjetit ose brenda derës së shoferit.</p>
      </div>

      <div className="grid grid-cols-3 gap-3">
        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1">Marka *</label>
          <input
            name="vehicle_make"
            value={form.vehicle_make}
            onChange={handleChange}
            required
            placeholder="BMW"
            className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1">Modeli *</label>
          <input
            name="vehicle_model"
            value={form.vehicle_model}
            onChange={handleChange}
            required
            placeholder="320d"
            className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1">Viti *</label>
          <input
            name="vehicle_year"
            value={form.vehicle_year}
            onChange={handleChange}
            required
            placeholder="2015"
            maxLength={4}
            className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500"
          />
        </div>
      </div>

      {/* Pjesa */}
      <div>
        <label className="block text-xs font-semibold text-gray-700 mb-1">Pjesa e kërkuar *</label>
        <select
          name="part_description"
          value={form.part_description}
          onChange={handleChange}
          required
          className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 bg-white"
        >
          <option value="">-- Zgjidh kategorinë --</option>
          {partCategories.map((cat) => (
            <option key={cat.id} value={cat.name}>
              {cat.icon} {cat.name}
            </option>
          ))}
          <option value="Tjeter">Tjetër (shkruaj në shënime)</option>
        </select>
      </div>

      {/* Cilësia e produktit */}
      <div>
        <label className="block text-xs font-semibold text-gray-700 mb-1">Cilësia e Produktit</label>
        <select
          name="product_quality"
          value={form.product_quality}
          onChange={handleChange}
          className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 bg-white"
        >
          <option value="">-- Zgjidh cilësinë --</option>
          <option value="1">Cilësia 1 — Origjinale (OEM)</option>
          <option value="2">Cilësia 2 — Ekuivalente</option>
          <option value="3">Cilësia 3 — Ekonomike</option>
        </select>
      </div>

      <div>
        <label className="block text-xs font-semibold text-gray-700 mb-1">Shënime shtesë</label>
        <textarea
          name="extra_notes"
          value={form.extra_notes}
          onChange={handleChange}
          rows={3}
          placeholder="p.sh. duhet kit i plotë, urgjent, çdo informacion tjetër..."
          className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 resize-none"
        />
      </div>

      <div className="flex gap-3 pt-1">
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="flex-1 border border-gray-200 text-gray-600 font-semibold px-4 py-2.5 rounded-xl hover:bg-gray-50 transition-colors text-sm"
          >
            Anulo
          </button>
        )}
        <button
          type="submit"
          className="flex-1 bg-green-600 text-white font-bold px-4 py-2.5 rounded-xl hover:bg-green-700 transition-colors text-sm"
        >
          Dërgo Kërkesën
        </button>
      </div>
    </form>
  );
}
