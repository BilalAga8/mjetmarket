import Link from "next/link";
import Image from "next/image";

export interface DbVehicle {
  id: string;
  brand: string;
  model: string;
  year: number;
  price: number;
  images: string[] | null;
  fuel: string | null;
  km: number | null;
  hp: number | null;
  color: string | null;
  transmission: string | null;
  city: string | null;
}

export default function CarListItem({ car }: Readonly<{ car: DbVehicle }>) {
  const image = car.images?.[0];

  return (
    <Link
      href={`/makina/${car.id}`}
      className="group flex items-center gap-4 bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden border border-gray-100 hover:border-green-200"
    >
      <div className="w-36 h-24 shrink-0 overflow-hidden bg-gray-100 flex items-center justify-center relative">
        {image ? (
          <Image
            src={image}
            alt={`${car.brand} ${car.model}`}
            fill
            sizes="144px"
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <span className="text-3xl">🚗</span>
        )}
      </div>

      <div className="flex-1 min-w-0 py-2">
        <p className="text-sm font-bold text-gray-900 truncate">
          {car.brand} {car.model}
        </p>
        <div className="flex items-center gap-2 mt-0.5 text-xs text-gray-500 flex-wrap">
          <span>{car.year}</span>
          {car.fuel && <><span className="w-1 h-1 rounded-full bg-gray-300" /><span>{car.fuel}</span></>}
          {car.hp != null && car.hp > 0 && <><span className="w-1 h-1 rounded-full bg-gray-300" /><span>{car.hp} HP</span></>}
          {car.km != null ? <><span className="w-1 h-1 rounded-full bg-gray-300" /><span>{car.km.toLocaleString()} km</span></> : null}
          {car.color && <><span className="w-1 h-1 rounded-full bg-gray-300" /><span>{car.color}</span></>}
        </div>
        {car.city && <p className="text-xs text-gray-400 mt-1">📍 {car.city}</p>}
      </div>

      <div className="shrink-0 pr-4 text-right">
        <p className="text-base font-extrabold text-green-600 whitespace-nowrap">
          {car.price.toLocaleString()} €
        </p>
        {car.transmission && <p className="text-xs text-gray-400 mt-0.5">{car.transmission}</p>}
      </div>
    </Link>
  );
}
