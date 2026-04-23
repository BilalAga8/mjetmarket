"use client";

import { useState, useMemo } from "react";

export default function LoanCalculator({ price }: { price: number }) {
  const [downPct, setDownPct] = useState(20);
  const [months, setMonths] = useState(48);
  const [rate, setRate] = useState(6.5);

  const { monthly, total, interest, principal } = useMemo(() => {
    const principal = price * (1 - downPct / 100);
    const r = rate / 100 / 12;
    const monthly =
      r === 0
        ? principal / months
        : (principal * (r * Math.pow(1 + r, months))) / (Math.pow(1 + r, months) - 1);
    const total = monthly * months;
    const interest = total - principal;
    return { monthly, total, interest, principal };
  }, [price, downPct, months, rate]);

  const fmt = (n: number) =>
    n.toLocaleString("sq-AL", { minimumFractionDigits: 0, maximumFractionDigits: 0 });

  const termOptions = [12, 24, 36, 48, 60, 72, 84];

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm mt-8">
      <h2 className="text-lg font-bold text-gray-900 mb-1">Kalkulator Kredie</h2>
      <p className="text-sm text-gray-400 mb-6">Llogarit këstin mujor për këtë mjet</p>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-6">
        {/* Paradhënia */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">Paradhënia</label>
            <span className="text-sm font-bold text-green-600">{downPct}%</span>
          </div>
          <input
            type="range"
            min={0}
            max={80}
            step={5}
            value={downPct}
            onChange={(e) => setDownPct(Number(e.target.value))}
            className="w-full accent-green-500"
          />
          <div className="flex justify-between text-xs text-gray-400 mt-1">
            <span>0%</span>
            <span className="font-medium text-gray-700">{fmt(price * downPct / 100)} €</span>
            <span>80%</span>
          </div>
        </div>

        {/* Norma interesit */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">Interesi vjetor</label>
            <span className="text-sm font-bold text-green-600">{rate}%</span>
          </div>
          <input
            type="range"
            min={1}
            max={20}
            step={0.5}
            value={rate}
            onChange={(e) => setRate(Number(e.target.value))}
            className="w-full accent-green-500"
          />
          <div className="flex justify-between text-xs text-gray-400 mt-1">
            <span>1%</span>
            <span>20%</span>
          </div>
        </div>

        {/* Afati */}
        <div>
          <label className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-2 block">Afati</label>
          <div className="grid grid-cols-4 gap-1.5">
            {termOptions.map((m) => (
              <button
                key={m}
                onClick={() => setMonths(m)}
                className={`py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                  months === m
                    ? "bg-green-500 text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {m}m
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Rezultati */}
      <div className="bg-gradient-to-br from-green-50 to-emerald-50 border border-green-100 rounded-2xl p-5">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <p className="text-xs text-gray-500 mb-1">Kësti mujor</p>
            <p className="text-4xl font-extrabold text-green-600">{fmt(monthly)} €</p>
          </div>
          <div className="flex gap-6 text-sm">
            <div className="text-right">
              <p className="text-xs text-gray-400 mb-0.5">Shuma e kredisë</p>
              <p className="font-bold text-gray-800">{fmt(principal)} €</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-gray-400 mb-0.5">Interesi total</p>
              <p className="font-bold text-gray-800">{fmt(interest)} €</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-gray-400 mb-0.5">Totali</p>
              <p className="font-bold text-gray-800">{fmt(total)} €</p>
            </div>
          </div>
        </div>
        <p className="text-xs text-gray-400 mt-4">* Llogaritja është orientuese. Kontaktoni bankën tuaj për kushtet reale.</p>
      </div>
    </div>
  );
}
