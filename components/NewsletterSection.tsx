"use client";

import { useState } from "react";

export default function NewsletterSection() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.includes("@")) { setStatus("error"); return; }

    const existing = JSON.parse(localStorage.getItem("newsletter_subscribers") || "[]");
    if (existing.includes(email)) { setStatus("success"); return; }
    localStorage.setItem("newsletter_subscribers", JSON.stringify([...existing, email]));
    setStatus("success");
    setEmail("");
  }

  return (
    <section className="bg-green-600 py-14 px-4">
      <div className="max-w-2xl mx-auto text-center">
        <p className="text-green-200 text-sm font-semibold uppercase tracking-widest mb-2">Newsletter</p>
        <h2 className="text-3xl font-extrabold text-white mb-3">
          Merr ofertat e para ti!
        </h2>
        <p className="text-green-100 text-sm mb-8 max-w-md mx-auto">
          Regjistrohu dhe merr njoftim kur shtohen makina të reja, oferta speciale dhe lajme nga tregu.
        </p>

        {status === "success" ? (
          <div className="bg-white/20 rounded-2xl px-6 py-4 inline-flex items-center gap-2 text-white font-semibold">
            ✅ Faleminderit! U regjistrove me sukses.
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <input
              type="email"
              value={email}
              onChange={(e) => { setEmail(e.target.value); setStatus("idle"); }}
              placeholder="emri@email.com"
              className={`flex-1 bg-white text-gray-800 placeholder-gray-400 text-sm font-medium rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-white/50 ${status === "error" ? "ring-2 ring-red-300" : ""}`}
            />
            <button
              type="submit"
              className="bg-gray-900 hover:bg-gray-800 text-white font-semibold px-6 py-3 rounded-xl transition-colors whitespace-nowrap"
            >
              Regjistrohu
            </button>
          </form>
        )}

        {status === "error" && (
          <p className="text-red-200 text-xs mt-2">Ju lutemi shkruani një email të vlefshëm.</p>
        )}

        <p className="text-green-200/60 text-xs mt-4">Pa spam. Mund të çregjistohesh kurdo.</p>
      </div>
    </section>
  );
}
