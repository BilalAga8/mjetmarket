"use client";

const weekData = [40, 65, 30, 80, 55, 90, 70];
const days = ["Hën", "Mar", "Mër", "Enj", "Pre", "Sht", "Die"];
const max = Math.max(...weekData);

export default function StatistikatPage() {
  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Statistikat</h1>
        <p className="text-gray-500 text-sm mt-1">Si performojnë njoftimet e tua</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { label: "Shikime këtë javë", value: "430", change: "+12%", up: true },
          { label: "Kontaktime",         value: "12",  change: "+3",   up: true },
          { label: "Të preferuara",      value: "5",   change: "-1",   up: false },
          { label: "Shikime mesatare/ditë", value: "61", change: "+8%", up: true },
        ].map((s) => (
          <div key={s.label} className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
            <p className="text-2xl font-extrabold text-gray-900">{s.value}</p>
            <p className="text-xs text-gray-400 mt-0.5 mb-2">{s.label}</p>
            <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${s.up ? "bg-green-100 text-green-700" : "bg-red-100 text-red-500"}`}>
              {s.change}
            </span>
          </div>
        ))}
      </div>

      {/* Grafiku i thjeshtë */}
      <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
        <h2 className="text-sm font-bold text-gray-900 mb-6">Shikime — 7 ditët e fundit</h2>
        <div className="flex items-end gap-3 h-40">
          {weekData.map((val, i) => (
            <div key={i} className="flex-1 flex flex-col items-center gap-2">
              <span className="text-xs text-gray-400">{val}</span>
              <div
                className="w-full bg-green-500 rounded-t-lg transition-all duration-300 hover:bg-green-600"
                style={{ height: `${(val / max) * 100}%` }}
              />
              <span className="text-xs text-gray-400">{days[i]}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
