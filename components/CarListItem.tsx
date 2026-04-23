import Link from "next/link";
import { Vehicle } from "../data/vehicles";

export default function CarListItem({ car }: { car: Vehicle }) {
  return (
    <Link
      href={`/makina/${(car as { slug?: string }).slug ?? car.id}`}
      className="group flex items-center gap-4 bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden border border-gray-100 hover:border-green-200"
    >
      {/* Foto */}
      <div className="w-36 h-24 shrink-0 overflow-hidden">
        <img
          src={car.image}
          alt={car.model}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
      </div>

      {/* Info kryesore */}
      <div className="flex-1 min-w-0 py-2">
        <div className="flex items-center gap-2">
          <p className="text-sm font-bold text-gray-900 truncate">
            {car.brand} {car.model}
          </p>
          {car.sponsored && (
            <span className="shrink-0 bg-yellow-400 text-yellow-900 text-xs font-bold px-2 py-0.5 rounded-full">
              ★ Sponsored
            </span>
          )}
        </div>
        <div className="flex items-center gap-2 mt-0.5 text-xs text-gray-500 flex-wrap">
          <span>{car.year}</span>
          <span className="w-1 h-1 rounded-full bg-gray-300" />
          <span>{car.fuel}</span>
          <span className="w-1 h-1 rounded-full bg-gray-300" />
          <span>{car.hp} HP</span>
          <span className="w-1 h-1 rounded-full bg-gray-300" />
          <span>{car.km.toLocaleString()} km</span>
          <span className="w-1 h-1 rounded-full bg-gray-300" />
          <span>{car.color}</span>
        </div>
      </div>

      {/* Çmimi */}
      <div className="shrink-0 pr-4 text-right">
        <p className="text-base font-extrabold text-green-600 whitespace-nowrap">
          {car.price.toLocaleString()} €
        </p>
        <p className="text-xs text-gray-400 mt-0.5">{car.transmission}</p>
      </div>
    </Link>
  );
}
