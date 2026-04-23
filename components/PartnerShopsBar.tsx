import Link from "next/link";
import { partPartners } from "../data/partPartners";

const bgColors = ["bg-green-600", "bg-blue-600", "bg-orange-500", "bg-purple-600"];

export default function PartnerShopsBar() {
  return (
    <div className="w-full bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3">
        <div className="flex items-center gap-2 mb-2.5">
          <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Partnerë Pjesësh Këmbimi</span>
          <span className="flex-1 h-px bg-gray-100" />
          <Link href="/pjese-kembimi" className="text-xs text-green-600 font-semibold hover:underline">
            Shiko të gjitha →
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {partPartners.map((partner, i) => (
            <Link
              key={partner.id}
              href="/pjese-kembimi"
              className="flex items-center gap-3 bg-gray-50 hover:bg-green-50 border border-gray-200 hover:border-green-300 rounded-xl px-3 py-2.5 transition-all group"
            >
              {/* Logo */}
              <div className={`w-9 h-9 ${bgColors[i]} rounded-lg flex items-center justify-center text-white text-xs font-extrabold shrink-0`}>
                {partner.logo}
              </div>

              {/* Info */}
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-gray-800 truncate group-hover:text-green-700">{partner.name}</p>
                <p className="text-xs text-gray-400">{partner.city}</p>
              </div>

              {/* Discount */}
              <div className="shrink-0 bg-red-500 text-white text-xs font-extrabold px-2 py-0.5 rounded-lg">
                -{partner.discount}%
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
