"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase-browser";

export default function LoginPage() {
  const router = useRouter();
  const [tab, setTab] = useState<"login" | "register">("login");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [loginData, setLoginData] = useState({ email: "", password: "" });
  const [regData, setRegData] = useState({
    emri: "",
    mbiemri: "",
    email: "",
    telefoni: "",
    password: "",
  });

  async function handleLogin(e: { preventDefault(): void }) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const supabase = createClient();
    const { error: err } = await supabase.auth.signInWithPassword({
      email: loginData.email,
      password: loginData.password,
    });
    if (err) {
      setError("Email ose fjalëkalimi është i gabuar.");
      setLoading(false);
      return;
    }
    router.push("/profili");
    router.refresh();
  }

  async function handleRegister(e: { preventDefault(): void }) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const supabase = createClient();
    const { error: err } = await supabase.auth.signUp({
      email: regData.email,
      password: regData.password,
      options: {
        data: {
          emri: regData.emri,
          mbiemri: regData.mbiemri,
          telefoni: regData.telefoni,
        },
      },
    });
    if (err) {
      setError(err.message);
      setLoading(false);
      return;
    }
    router.push("/profili");
    router.refresh();
  }

  const inputClass =
    "w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent";
  const labelClass =
    "text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1 block";

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-gray-50">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2">
            <div className="w-10 h-10 bg-green-500 rounded-xl flex items-center justify-center">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 17H3a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11a2 2 0 0 1 2 2v3" />
                <rect x="9" y="11" width="14" height="10" rx="2" />
                <circle cx="12" cy="21" r="1" />
                <circle cx="20" cy="21" r="1" />
              </svg>
            </div>
            <span className="text-xl font-extrabold text-gray-900 tracking-tight">
              Shitet<span className="text-green-500">Makina</span>
            </span>
          </Link>
          <p className="text-gray-500 text-sm mt-2">
            {tab === "login" ? "Hyr në llogarinë tënde" : "Krijo një llogari të re"}
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-md p-8">
          <div className="flex bg-gray-100 rounded-xl p-1 mb-6">
            <button
              onClick={() => { setTab("login"); setError(""); }}
              className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-colors duration-200 ${tab === "login" ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"}`}
            >
              Hyr
            </button>
            <button
              onClick={() => { setTab("register"); setError(""); }}
              className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-colors duration-200 ${tab === "register" ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"}`}
            >
              Regjistrohu
            </button>
          </div>

          {error && (
            <p className="text-red-500 text-xs bg-red-50 border border-red-200 rounded-lg px-3 py-2 mb-4">
              {error}
            </p>
          )}

          {tab === "login" ? (
            <form className="flex flex-col gap-4" onSubmit={handleLogin}>
              <div>
                <label htmlFor="login-email" className={labelClass}>Email</label>
                <input id="login-email" type="email" required placeholder="emri@email.com" className={inputClass}
                  value={loginData.email} onChange={(e) => setLoginData({ ...loginData, email: e.target.value })} />
              </div>
              <div>
                <label htmlFor="login-password" className={labelClass}>Fjalëkalimi</label>
                <input id="login-password" type="password" required placeholder="••••••••" className={inputClass}
                  value={loginData.password} onChange={(e) => setLoginData({ ...loginData, password: e.target.value })} />
              </div>
              <button type="submit" disabled={loading}
                className="w-full bg-green-500 hover:bg-green-600 disabled:opacity-60 text-white font-semibold py-3 rounded-xl transition-colors mt-1">
                {loading ? "Duke hyrë..." : "Hyr"}
              </button>
            </form>
          ) : (
            <form className="flex flex-col gap-4" onSubmit={handleRegister}>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label htmlFor="reg-emri" className={labelClass}>Emri</label>
                  <input id="reg-emri" type="text" required placeholder="Emri" className={inputClass}
                    value={regData.emri} onChange={(e) => setRegData({ ...regData, emri: e.target.value })} />
                </div>
                <div>
                  <label htmlFor="reg-mbiemri" className={labelClass}>Mbiemri</label>
                  <input id="reg-mbiemri" type="text" required placeholder="Mbiemri" className={inputClass}
                    value={regData.mbiemri} onChange={(e) => setRegData({ ...regData, mbiemri: e.target.value })} />
                </div>
              </div>
              <div>
                <label htmlFor="reg-email" className={labelClass}>Email</label>
                <input id="reg-email" type="email" required placeholder="emri@email.com" className={inputClass}
                  value={regData.email} onChange={(e) => setRegData({ ...regData, email: e.target.value })} />
              </div>
              <div>
                <label htmlFor="reg-telefoni" className={labelClass}>Numri i telefonit</label>
                <input id="reg-telefoni" type="tel" placeholder="+355 69 000 0000" className={inputClass}
                  value={regData.telefoni} onChange={(e) => setRegData({ ...regData, telefoni: e.target.value })} />
              </div>
              <div>
                <label htmlFor="reg-password" className={labelClass}>Fjalëkalimi</label>
                <input id="reg-password" type="password" required minLength={8} placeholder="Minimum 8 karaktere" className={inputClass}
                  value={regData.password} onChange={(e) => setRegData({ ...regData, password: e.target.value })} />
              </div>
              <div className="flex items-start gap-2 text-xs text-gray-500">
                <input id="reg-terms" type="checkbox" required className="accent-green-500 mt-0.5" />
                <label htmlFor="reg-terms">
                  Pranoj <Link href="/kushtet" className="text-green-600 hover:underline">Kushtet</Link> dhe <Link href="/privatesia" className="text-green-600 hover:underline">Privatësinë</Link>
                </label>
              </div>
              <button type="submit" disabled={loading}
                className="w-full bg-green-500 hover:bg-green-600 disabled:opacity-60 text-white font-semibold py-3 rounded-xl transition-colors mt-1">
                {loading ? "Duke u regjistruar..." : "Regjistrohu"}
              </button>
            </form>
          )}
        </div>

        <p className="text-center text-xs text-gray-400 mt-6">
          {tab === "login" ? (
            <><span>Nuk ke llogari? </span><button onClick={() => setTab("register")} className="text-green-600 hover:underline font-medium">Regjistrohu</button></>
          ) : (
            <><span>Ke llogari? </span><button onClick={() => setTab("login")} className="text-green-600 hover:underline font-medium">Hyr</button></>
          )}
        </p>
      </div>
    </div>
  );
}
