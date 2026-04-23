"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase-browser";

export default function CilësimetPage() {
  const [profile, setProfile] = useState({ emri: "", mbiemri: "", telefoni: "" });
  const [email, setEmail] = useState("");
  const [passwords, setPasswords] = useState({ current: "", next: "", confirm: "" });
  const [saving, setSaving] = useState(false);
  const [savingPass, setSavingPass] = useState(false);
  const [msg, setMsg] = useState("");
  const [msgPass, setMsgPass] = useState("");

  const inputClass = "w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-green-500";

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(async ({ data: { user } }) => {
      if (!user) return;
      setEmail(user.email ?? "");
      const { data } = await supabase
        .from("profiles")
        .select("emri, mbiemri, telefoni")
        .eq("id", user.id)
        .single();
      if (data) setProfile({ emri: data.emri ?? "", mbiemri: data.mbiemri ?? "", telefoni: data.telefoni ?? "" });
    });
  }, []);

  async function saveProfile(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setMsg("");
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { setSaving(false); return; }
    const { error } = await supabase
      .from("profiles")
      .update({ emri: profile.emri, mbiemri: profile.mbiemri, telefoni: profile.telefoni })
      .eq("id", user.id);
    setSaving(false);
    setMsg(error ? "Gabim: " + error.message : "✓ Të dhënat u ruajtën.");
  }

  async function changePassword(e: React.FormEvent) {
    e.preventDefault();
    setMsgPass("");
    if (passwords.next !== passwords.confirm) { setMsgPass("Fjalëkalimet nuk përputhen."); return; }
    if (passwords.next.length < 6) { setMsgPass("Fjalëkalimi duhet të ketë min. 6 karaktere."); return; }
    setSavingPass(true);
    const supabase = createClient();
    const { error } = await supabase.auth.updateUser({ password: passwords.next });
    setSavingPass(false);
    setMsgPass(error ? "Gabim: " + error.message : "✓ Fjalëkalimi u ndryshua.");
    if (!error) setPasswords({ current: "", next: "", confirm: "" });
  }

  return (
    <div className="p-8 max-w-xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Cilësimet</h1>
        <p className="text-gray-500 text-sm mt-1">Ndrysho informacionin e profilit tënd</p>
      </div>

      <form className="flex flex-col gap-5" onSubmit={saveProfile}>
        <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
          <h2 className="text-sm font-bold text-gray-900 mb-4">Të dhënat personale</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="emri" className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1 block">Emri</label>
              <input id="emri" value={profile.emri} onChange={(e) => setProfile((p) => ({ ...p, emri: e.target.value }))} placeholder="Emri juaj" className={inputClass} />
            </div>
            <div>
              <label htmlFor="mbiemri" className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1 block">Mbiemri</label>
              <input id="mbiemri" value={profile.mbiemri} onChange={(e) => setProfile((p) => ({ ...p, mbiemri: e.target.value }))} placeholder="Mbiemri juaj" className={inputClass} />
            </div>
          </div>
          <div className="grid grid-cols-1 gap-4 mt-4">
            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1 block">Email</label>
              <input type="email" value={email} disabled className="w-full border border-gray-100 bg-gray-50 text-gray-400 rounded-xl px-4 py-2.5 text-sm cursor-not-allowed" />
            </div>
            <div>
              <label htmlFor="telefoni" className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1 block">Telefoni</label>
              <input id="telefoni" type="tel" value={profile.telefoni} onChange={(e) => setProfile((p) => ({ ...p, telefoni: e.target.value }))} placeholder="+355 69 000 0000" className={inputClass} />
            </div>
          </div>
          {msg && <p className={`mt-3 text-sm ${msg.startsWith("✓") ? "text-green-600" : "text-red-500"}`}>{msg}</p>}
          <button type="submit" disabled={saving} className="mt-5 bg-green-500 hover:bg-green-600 disabled:opacity-60 text-white font-semibold px-6 py-2.5 rounded-xl transition-colors text-sm">
            {saving ? "Duke ruajtur…" : "Ruaj Ndryshimet"}
          </button>
        </div>
      </form>

      <form className="mt-5" onSubmit={changePassword}>
        <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
          <h2 className="text-sm font-bold text-gray-900 mb-4">Ndrysho Fjalëkalimin</h2>
          <div className="flex flex-col gap-3">
            <input type="password" placeholder="Fjalëkalimi i ri" value={passwords.next} onChange={(e) => setPasswords((p) => ({ ...p, next: e.target.value }))} className={inputClass} />
            <input type="password" placeholder="Konfirmo fjalëkalimin e ri" value={passwords.confirm} onChange={(e) => setPasswords((p) => ({ ...p, confirm: e.target.value }))} className={inputClass} />
          </div>
          {msgPass && <p className={`mt-3 text-sm ${msgPass.startsWith("✓") ? "text-green-600" : "text-red-500"}`}>{msgPass}</p>}
          <button type="submit" disabled={savingPass} className="mt-4 bg-gray-900 hover:bg-gray-800 disabled:opacity-60 text-white font-semibold px-6 py-2.5 rounded-xl transition-colors text-sm">
            {savingPass ? "Duke ndryshuar…" : "Ndrysho Fjalëkalimin"}
          </button>
        </div>
      </form>

      <div className="mt-5 bg-white border border-red-100 rounded-2xl p-6 shadow-sm">
        <h2 className="text-sm font-bold text-red-600 mb-2">Zona e Rrezikut</h2>
        <p className="text-xs text-gray-400 mb-4">Fshirja e llogarisë është e pakthyeshme dhe do të fshijë të gjitha njoftimet.</p>
        <button type="button" className="border border-red-300 text-red-500 hover:bg-red-50 font-semibold px-6 py-2.5 rounded-xl transition-colors text-sm">
          Fshi Llogarinë
        </button>
      </div>
    </div>
  );
}
