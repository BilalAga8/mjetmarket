import { Shop } from "../data/shops";
import ReviewSection from "./ReviewSection";
import { reviews } from "../data/reviews";

const packageConfig = {
  gold:   { label: "Gold",   medal: "🥇", bg: "bg-yellow-400",  text: "text-yellow-900", border: "border-yellow-300", logoBg: "bg-yellow-500" },
  silver: { label: "Silver", medal: "🥈", bg: "bg-gray-200",    text: "text-gray-700",   border: "border-gray-300",   logoBg: "bg-gray-500"   },
  bronze: { label: "Bronze", medal: "🥉", bg: "bg-orange-200",  text: "text-orange-800", border: "border-orange-300", logoBg: "bg-orange-500" },
};

export default function ShopCard({ shop }: { shop: Shop }) {
  const pkg = packageConfig[shop.package];

  return (
    <div className={`bg-white border-2 ${pkg.border} rounded-2xl px-5 py-4 shadow-sm hover:shadow-md transition-shadow duration-200`}>
      <div className="flex items-center gap-4">
        {/* Logo */}
        <div className={`w-12 h-12 rounded-xl ${pkg.logoBg} text-white font-extrabold text-sm flex items-center justify-center shrink-0`}>
          {shop.logo}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-bold text-gray-900 text-sm">{shop.name}</span>
            <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${pkg.bg} ${pkg.text}`}>
              {pkg.medal} {pkg.label}
            </span>
            {shop.verified && (
              <span className="flex items-center gap-1 text-xs text-green-600 font-semibold bg-green-50 px-2 py-0.5 rounded-full">
                ★ Verifikuar
              </span>
            )}
          </div>
          <p className="text-xs text-gray-500 mt-0.5 truncate">
            {shop.city} · {shop.address}
          </p>
          <div className="flex items-center gap-3 mt-1.5 text-xs">
            <a href={`tel:${shop.phone}`} className="text-green-600 font-medium hover:underline">
              📞 {shop.phone}
            </a>
            {shop.website && (
              <a href={`https://${shop.website}`} target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-green-600 transition-colors">
                🌐 {shop.website}
              </a>
            )}
          </div>
        </div>
      </div>

      <ReviewSection dealerId={shop.id} dealerType="shop" reviews={reviews} />
    </div>
  );
}
