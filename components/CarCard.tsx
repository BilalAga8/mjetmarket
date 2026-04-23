import Link from "next/link";
import { Vehicle } from "../data/vehicles";

export default function CarCard({ car }: { car: Vehicle }) {
  return (
    <Link href={`/makina/${(car as { slug?: string }).slug ?? car.id}`} className="group relative bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 block">
      <div className="relative overflow-hidden h-40">
        <img
          src={car.image}
          alt={car.model}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
        <span className="absolute top-3 left-3 bg-green-600 text-white text-xs font-semibold px-3 py-1 rounded-full">
          {car.year}
        </span>
        {car.sponsored && (
          <span className="absolute top-3 right-3 bg-yellow-400 text-yellow-900 text-xs font-bold px-2 py-0.5 rounded-full">
            ★ Sponsored
          </span>
        )}
      </div>

      <div className="p-4">
        <h2 className="text-base font-bold text-gray-900 leading-tight">
          {car.brand} {car.model}
        </h2>

        <div className="flex items-center gap-3 mt-1.5 text-xs text-gray-500">
          <span>{car.fuel}</span>
          <span className="w-1 h-1 rounded-full bg-gray-300" />
          <span>{car.hp} HP</span>
          <span className="w-1 h-1 rounded-full bg-gray-300" />
          <span>{car.color}</span>
        </div>

        <p className="text-xs text-gray-400 mt-1">{car.km.toLocaleString()} km</p>

        <div className="mt-3 flex items-center justify-between">
          <span className="text-xl font-extrabold text-green-600">
            {car.price.toLocaleString()} €
          </span>
          <span className="bg-green-600 group-hover:bg-green-700 text-white text-xs font-medium px-4 py-2 rounded-xl transition-colors duration-200">
            Detaje
          </span>
        </div>
      </div>
    </Link>
  );
}
