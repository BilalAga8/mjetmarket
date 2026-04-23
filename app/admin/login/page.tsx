"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase-browser";

export default function AdminLogin() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [forgot, setForgot] = useState(false);
  const [resetSent, setResetSent] = useState(false);

  async function handleForgot(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    const supabase = createClient();
    await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/confirm`,
    });
    setLoading(false);
    setResetSent(true);
  }

  async function handleLogin(e: { preventDefault(): void }) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const supabase = createClient();
    const { error: err } = await supabase.auth.signInWithPassword({ email, password });
    if (err) {
      setError("Email ose fjalëkalimi është i gabuar.");
      setLoading(false);
      return;
    }

    // Middleware kontrollon rolin — nëse nuk është admin, ridrejton prapa
    router.push("/admin/dashboard");
    router.refresh();
  }

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-6">
            <div className="w-10 h-10 bg-green-500 rounded-xl flex items-center justify-center">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 17H3a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11a2 2 0 0 1 2 2v3" />
                <rect x="9" y="11" width="14" height="10" rx="2" />
                <circle cx="12" cy="21" r="1" />
                <circle cx="20" cy="21" r="1" />
              </svg>
            </div>
            <span className="text-xl font-extrabold text-white tracking-tight">
              Mjet<span className="text-green-500">Market</span>
            </span>
          </Link>
          <h1 className="text-2xl font-bold text-white">Paneli i Adminit</h1>
          <p className="text-gray-500 text-sm mt-1">Hyr me kredencialet e adminit</p>
        </div>

        <form onSubmit={handleLogin} className="bg-gray-900 rounded-2xl p-6 border border-gray-800 flex flex-col gap-4">
          <div>
            <label htmlFor="admin-email" className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1.5 block">Email</label>
            <input
              id="admin-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@shitetmakina.al"
              className="w-full bg-gray-800 border border-gray-700 text-white rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent placeholder:text-gray-600"
              required
            />
          </div>
          <div>
            <label htmlFor="admin-password" className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1.5 block">Fjalëkalimi</label>
            <input
              id="admin-password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full bg-gray-800 border border-gray-700 text-white rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent placeholder:text-gray-600"
              required
            />
          </div>

          {error && (
            <p className="text-red-400 text-xs bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">{error}</p>
          )}

          <button type="submit" disabled={loading}
            className="w-full bg-green-500 hover:bg-green-600 disabled:opacity-60 text-white font-semibold py-3 rounded-xl transition-colors duration-200 mt-1">
            {loading ? "Duke hyrë..." : "Hyr në Panel"}
          </button>
          <button type="button" onClick={() => { setForgot(true); setError(""); }}
            className="w-full text-center text-xs text-gray-500 hover:text-green-500 transition-colors mt-1">
            Harrove fjalëkalimin?
          </button>
        </form>

        {forgot && (
          <form onSubmit={handleForgot} className="bg-gray-900 rounded-2xl p-6 border border-gray-800 flex flex-col gap-4 mt-4">
            {resetSent ? (
              <p className="text-green-400 text-sm text-center">✓ Email u dërgua — kontrollo kutinë hyrëse.</p>
            ) : (
              <>
                <p className="text-xs text-gray-400">Fut emailin e adminit dhe do dërgojmë linkun e resetimit.</p>
                <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@email.com"
                  className="w-full bg-gray-800 border border-gray-700 text-white rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-green-500 placeholder:text-gray-600" />
                <button type="submit" disabled={loading}
                  className="w-full bg-green-500 hover:bg-green-600 disabled:opacity-60 text-white font-semibold py-3 rounded-xl transition-colors text-sm">
                  {loading ? "Duke dërguar…" : "Dërgo Linkun"}
                </button>
              </>
            )}
          </form>
        )}
      </div>
    </div>
  );
}
