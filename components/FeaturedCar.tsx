import Link from "next/link";
import Image from "next/image";
import { Vehicle } from "../data/vehicles";

export default function FeaturedCar({ car }: { car: Vehicle }) {
  return (
    <div className="px-4 sm:px-14 pt-10 pb-4">
      <div className="flex items-center gap-3 mb-4">
        <span className="text-yellow-500 text-lg">⭐</span>
        <h2 className="text-xl font-bold text-gray-900">Makina e Javës</h2>
        <span className="h-px flex-1 bg-gray-200" />
        <span className="text-xs text-yellow-600 font-semibold bg-yellow-50 border border-yellow-200 px-3 py-1 rounded-full">
          Featured
        </span>
      </div>

      <Link
        href={`/makina/${(car as { slug?: string }).slug ?? car.id}`}
        className="group relative flex flex-col sm:flex-row overflow-hidden rounded-2xl border-2 border-yellow-400 shadow-lg hover:shadow-xl transition-all duration-300 bg-white"
      >
        {/* Badge */}
        <div className="absolute top-4 left-4 z-10 flex items-center gap-1.5 bg-yellow-400 text-yellow-900 text-xs font-extrabold px-3 py-1.5 rounded-full shadow">
          ⭐ Makina e Javës
        </div>

        {/* Foto */}
        <div className="relative sm:w-1/2 h-56 sm:h-72 overflow-hidden shrink-0 sm:self-center sm:rounded-xl sm:m-3">
          <Image
            src={car.image}
            alt={`${car.brand} ${car.model}`}
            fill
            sizes="(max-width: 640px) 100vw, 50vw"
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />
        </div>

        {/* Info */}
        <div className="flex-1 p-4 flex flex-col justify-between">
          <div>
            <p className="text-xs font-bold text-yellow-500 uppercase tracking-widest mb-0.5">{car.category}</p>
            <h3 className="text-xl font-extrabold text-gray-900 mb-0.5">
              {car.brand} {car.model}
            </h3>
            <p className="text-2xl font-extrabold text-green-600 mb-3">
              {car.price.toLocaleString()} €
            </p>

            <div className="grid grid-cols-2 gap-1.5 mb-3">
              {[
                { label: "Viti", value: car.year },
                { label: "Karburanti", value: car.fuel },
                { label: "Kilometrat", value: `${car.km.toLocaleString()} km` },
                { label: "Fuqia", value: `${car.hp} HP` },
                { label: "Kambio", value: car.transmission },
                { label: "Ngjyra", value: car.color },
              ].map((s) => (
                <div key={s.label} className="bg-gray-50 rounded-xl px-3 py-1.5">
                  <p className="text-xs text-gray-400">{s.label}</p>
                  <p className="text-sm font-bold text-gray-800">{s.value}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="flex-1 bg-yellow-400 group-hover:bg-yellow-500 text-yellow-900 font-bold py-2.5 rounded-xl text-center transition-colors text-sm">
              Shiko Detajet →
            </span>
          </div>
        </div>
      </Link>
    </div>
  );
}
