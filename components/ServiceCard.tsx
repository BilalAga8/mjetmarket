import { Service } from "../data/services";
import ReviewSection from "./ReviewSection";
import { reviews } from "../data/reviews";

const categoryColors: Record<string, string> = {
  "Servis Mekanik":       "bg-blue-600",
  "Elektrik & Elektronikë": "bg-yellow-500",
  "Bojaxhi":              "bg-red-500",
  "Veshje & Tapeçi":      "bg-purple-600",
  "Xhama":                "bg-cyan-600",
  "Aksesore":             "bg-orange-500",
  "Tjetër":               "bg-gray-600",
};

export default function ServiceCard({ service }: { service: Service }) {
  const logoBg = categoryColors[service.category] ?? "bg-gray-600";

  return (
    <div className="flex items-start gap-4 bg-white border border-gray-100 rounded-2xl px-5 py-4 shadow-sm hover:shadow-md transition-shadow duration-200">
      {/* Logo */}
      <div className={`w-12 h-12 rounded-xl ${logoBg} text-white font-extrabold text-sm flex items-center justify-center shrink-0`}>
        {service.logo}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="font-bold text-gray-900 text-sm">{service.name}</span>
          {service.verified && (
            <span className="flex items-center gap-1 text-xs text-green-600 font-semibold bg-green-50 px-2 py-0.5 rounded-full">
              ★ Partner i Verifikuar
            </span>
          )}
          <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">
            {service.category}
          </span>
        </div>
        <p className="text-xs text-gray-500 mt-0.5">{service.city} · {service.address}</p>
        <p className="text-xs text-gray-400 mt-1 italic">{service.description}</p>
        <div className="flex items-center gap-3 mt-2 text-xs">
          <a href={`tel:${service.phone}`} className="text-green-600 font-medium hover:underline">
            📞 {service.phone}
          </a>
          {service.website && (
            <a
              href={`https://${service.website}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-500 hover:text-green-600 transition-colors"
            >
              🌐 {service.website}
            </a>
          )}
        </div>
      </div>

      <ReviewSection dealerId={service.id} dealerType="service" reviews={reviews} />
    </div>
  );
}
