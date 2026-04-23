import { vehicles } from "../../../data/vehicles";
import { shops } from "../../../data/shops";
import { services } from "../../../data/services";

const stats = [
  { label: "Mjete Totale",      value: vehicles.length,                         icon: "🚗", color: "bg-blue-500/10 text-blue-400" },
  { label: "Sponsored",         value: vehicles.filter((v) => v.sponsored).length, icon: "★",  color: "bg-yellow-500/10 text-yellow-400" },
  { label: "Dyqane Pjesësh",    value: shops.length,                            icon: "🔧", color: "bg-green-500/10 text-green-400" },
  { label: "Servise Partnere",  value: services.length,                         icon: "⚡", color: "bg-purple-500/10 text-purple-400" },
  { label: "Përdorues",         value: 0,                                       icon: "👤", color: "bg-orange-500/10 text-orange-400" },
  { label: "Kërkime sot",       value: 0,                                       icon: "🔍", color: "bg-cyan-500/10 text-cyan-400" },
];

export default function Dashboard() {
  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">Dashboard</h1>
        <p className="text-gray-500 text-sm mt-1">Mirë se erdhe, Admin</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-10">
        {stats.map((s) => (
          <div key={s.label} className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
            <div className={`w-10 h-10 rounded-xl ${s.color} flex items-center justify-center text-lg mb-3`}>
              {s.icon}
            </div>
            <p className="text-2xl font-extrabold text-white">{s.value}</p>
            <p className="text-xs text-gray-500 mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Mjetet e fundit */}
      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 mb-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-base font-bold text-white">Mjetet e Fundit</h2>
          <a href="/admin/mjetet" className="text-xs text-green-400 hover:underline">Shiko të gjitha →</a>
        </div>
        <div className="flex flex-col gap-2">
          {vehicles.slice(0, 5).map((v) => (
            <div key={v.id} className="flex items-center gap-4 py-2 border-b border-gray-800 last:border-0">
              <img src={v.image} alt={v.model} className="w-12 h-8 rounded-lg object-cover shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-white truncate">{v.brand} {v.model}</p>
                <p className="text-xs text-gray-500">{v.category} · {v.year}</p>
              </div>
              <div className="text-right shrink-0">
                <p className="text-sm font-bold text-green-400">{v.price.toLocaleString()} €</p>
                {v.sponsored && <span className="text-xs text-yellow-400">★ Sponsored</span>}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Dyqane + Servise */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-bold text-white">Dyqane Pjesësh</h2>
            <a href="/admin/dyqanet" className="text-xs text-green-400 hover:underline">Shiko →</a>
          </div>
          {shops.map((s) => (
            <div key={s.id} className="flex items-center gap-3 py-2 border-b border-gray-800 last:border-0">
              <div className="w-8 h-8 rounded-lg bg-green-600 text-white text-xs font-bold flex items-center justify-center shrink-0">{s.logo}</div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white truncate">{s.name}</p>
                <p className="text-xs text-gray-500">{s.city}</p>
              </div>
              {s.verified && <span className="text-xs text-green-400">★</span>}
            </div>
          ))}
        </div>

        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-bold text-white">Servise Partnere</h2>
            <a href="/admin/sherbimet" className="text-xs text-green-400 hover:underline">Shiko →</a>
          </div>
          {services.map((s) => (
            <div key={s.id} className="flex items-center gap-3 py-2 border-b border-gray-800 last:border-0">
              <div className="w-8 h-8 rounded-lg bg-blue-600 text-white text-xs font-bold flex items-center justify-center shrink-0">{s.logo}</div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white truncate">{s.name}</p>
                <p className="text-xs text-gray-500">{s.category}</p>
              </div>
              {s.verified && <span className="text-xs text-green-400">★</span>}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
