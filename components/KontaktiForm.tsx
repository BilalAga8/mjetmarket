"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase-browser";

const supabase = createClient();

export default function KontaktiForm() {
  const [form, setForm] = useState({ full_name: "", phone: "", message: "" });
  const [sent, setSent] = useState(false);

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    await supabase.from("contact_messages").insert([form]);
    setSent(true);
  }

  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-6">
      {sent ? (
        <div className="h-full flex flex-col items-center justify-center text-center py-10">
          <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">Mesazhi u dërgua!</h3>
          <p className="text-gray-500 text-sm mb-6">Do ju kthejmë përgjigje sa më shpejt.</p>
          <button
            onClick={() => { setSent(false); setForm({ full_name: "", phone: "", message: "" }); }}
            className="text-sm text-green-600 font-semibold hover:underline"
          >
            Dërgo mesazh tjetër
          </button>
        </div>
      ) : (
        <>
          <h2 className="text-lg font-bold text-gray-900 mb-1">Dërgo Mesazh</h2>
          <p className="text-sm text-gray-400 mb-5">Do t'ju kthejmë përgjigje brenda ditës.</p>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Emri i plotë *</label>
              <input
                name="full_name"
                value={form.full_name}
                onChange={handleChange}
                required
                placeholder="Emri juaj"
                className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Telefon *</label>
              <input
                name="phone"
                value={form.phone}
                onChange={handleChange}
                required
                placeholder="+355 6X XXX XXXX"
                className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Mesazhi *</label>
              <textarea
                name="message"
                value={form.message}
                onChange={handleChange}
                required
                rows={5}
                placeholder="Si mund t'ju ndihmojmë?"
                className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 resize-none"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-xl transition-colors text-sm"
            >
              Dërgo Mesazhin
            </button>
          </form>
        </>
      )}
    </div>
  );
}
