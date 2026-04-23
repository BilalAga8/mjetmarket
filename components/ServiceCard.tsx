const categoryColors: Record<string, string> = {
  "Servis Mekanik":          "bg-blue-600",
  "Elektrik & Elektronikë":  "bg-yellow-500",
  "Bojaxhi":                 "bg-red-500",
  "Veshje & Tapeçi":         "bg-purple-600",
  "Xhama":                   "bg-cyan-600",
  "Aksesore":                "bg-orange-500",
  "Tjetër":                  "bg-gray-600",
};

interface Service {
  id: number;
  name: string;
  category: string;
  city: string;
  address: string;
  phone: string;
  website: string;
  verified: boolean;
  logo: string;
  description: string;
}

export default function ServiceCard({ service }: { readonly service: Service }) {
  const logoBg = categoryColors[service.category] ?? "bg-gray-600";
  const tags = service.description
    ? service.description.split(",").map((t) => t.trim()).filter(Boolean)
    : [];

  return (
    <div className="flex items-start gap-4 bg-white border border-gray-100 rounded-2xl px-5 py-4 shadow-sm hover:shadow-md transition-shadow duration-200">
      <div className={`w-12 h-12 rounded-xl ${logoBg} text-white font-extrabold text-sm flex items-center justify-center shrink-0`}>
        {service.logo}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="font-bold text-gray-900 text-sm">{service.name}</span>
          {service.verified && (
            <span className="text-xs text-green-600 font-semibold bg-green-50 px-2 py-0.5 rounded-full">
              ✓ Partner i Verifikuar
            </span>
          )}
          <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">
            {service.category}
          </span>
        </div>
        <p className="text-xs text-gray-500 mt-0.5">{service.city} · {service.address}</p>

        {tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-2">
            {tags.map((tag) => (
              <span key={tag} className="text-xs bg-gray-50 border border-gray-200 text-gray-600 px-2.5 py-1 rounded-lg">
                {tag}
              </span>
            ))}
          </div>
        )}

        <div className="flex items-center gap-3 mt-2.5 text-xs">
          <a href={`tel:${service.phone}`} className="text-green-600 font-medium hover:underline">
            📞 {service.phone}
          </a>
          {service.website && (
            <a href={`https://${service.website}`} target="_blank" rel="noopener noreferrer"
              className="text-gray-500 hover:text-green-600 transition-colors">
              🌐 {service.website}
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
