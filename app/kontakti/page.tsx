"use client";

import { useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase-browser";
const supabase = createClient();

export default function KontaktiPage() {
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
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 py-10 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto">
          <Link href="/" className="text-sm text-gray-400 hover:text-green-600 transition-colors flex items-center gap-1 mb-4">
            ← Kthehu
          </Link>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight mb-1">Na Kontaktoni</h1>
          <p className="text-gray-500 text-sm">Jemi këtu për t'ju ndihmuar çdo ditë të javës.</p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10 grid grid-cols-1 md:grid-cols-2 gap-8">

        {/* Info Card */}
        <div className="flex flex-col gap-4">

          {/* Telefon */}
          <a
            href="tel:+355690000000"
            className="bg-white border border-gray-200 rounded-2xl p-5 flex items-center gap-4 hover:border-green-400 hover:shadow-sm transition-all group"
          >
            <div className="w-12 h-12 bg-green-500/10 rounded-xl flex items-center justify-center shrink-0 group-hover:bg-green-500/20 transition-colors">
              <svg className="w-5 h-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.64 3.45 2 2 0 0 1 3.6 1.27h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L7.91 9a16 16 0 0 0 6 6l1.06-1.06a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 21.73 16z" />
              </svg>
            </div>
            <div>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-0.5">Telefon</p>
              <p className="text-gray-900 font-bold">+355 69 000 0000</p>
            </div>
          </a>

          {/* WhatsApp */}
          <a
            href="https://wa.me/355690000000"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-white border border-gray-200 rounded-2xl p-5 flex items-center gap-4 hover:border-green-400 hover:shadow-sm transition-all group"
          >
            <div className="w-12 h-12 bg-[#25D366]/10 rounded-xl flex items-center justify-center shrink-0 group-hover:bg-[#25D366]/20 transition-colors">
              <svg className="w-5 h-5 text-[#25D366]" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
                <path d="M12 0C5.373 0 0 5.373 0 12c0 2.123.555 4.116 1.528 5.849L.057 23.5l5.798-1.522A11.95 11.95 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.898 0-3.677-.52-5.2-1.426L3.5 21.5l.95-3.2A9.96 9.96 0 0 1 2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z" />
              </svg>
            </div>
            <div>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-0.5">WhatsApp</p>
              <p className="text-gray-900 font-bold">+355 69 000 0000</p>
            </div>
          </a>

          {/* Email */}
          <a
            href="mailto:info@shitetmakina.al"
            className="bg-white border border-gray-200 rounded-2xl p-5 flex items-center gap-4 hover:border-green-400 hover:shadow-sm transition-all group"
          >
            <div className="w-12 h-12 bg-green-500/10 rounded-xl flex items-center justify-center shrink-0 group-hover:bg-green-500/20 transition-colors">
              <svg className="w-5 h-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <div>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-0.5">Email</p>
              <p className="text-gray-900 font-bold">info@shitetmakina.al</p>
            </div>
          </a>

          {/* Adresa */}
          <div className="bg-white border border-gray-200 rounded-2xl p-5 flex items-center gap-4">
            <div className="w-12 h-12 bg-green-500/10 rounded-xl flex items-center justify-center shrink-0">
              <svg className="w-5 h-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <div>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-0.5">Adresa</p>
              <p className="text-gray-900 font-bold">Lagjja Lezha, Tiranë</p>
            </div>
          </div>

          {/* Orari */}
          <div className="bg-white border border-gray-200 rounded-2xl p-5 flex items-center gap-4">
            <div className="w-12 h-12 bg-green-500/10 rounded-xl flex items-center justify-center shrink-0">
              <svg className="w-5 h-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <circle cx="12" cy="12" r="10" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6l4 2" />
              </svg>
            </div>
            <div>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-0.5">Orari</p>
              <p className="text-gray-900 font-bold">E Hënë – E Diel</p>
              <p className="text-gray-500 text-sm">Çdo ditë të javës</p>
            </div>
          </div>
        </div>

        {/* Contact Form */}
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
      </div>
    </div>
  );
}
