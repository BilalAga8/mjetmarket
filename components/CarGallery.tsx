"use client";

import { useState } from "react";
import Image from "next/image";

export default function CarGallery({ images }: Readonly<{ images: string[] }>) {
  const [active, setActive] = useState(0);

  if (!images.length) return null;

  return (
    <div className="flex flex-col gap-3">
      <div className="rounded-2xl overflow-hidden aspect-[4/3] bg-gray-100 relative">
        <Image
          src={images[active]}
          alt="foto kryesore"
          fill
          sizes="(max-width: 1024px) 100vw, 50vw"
          className="object-cover transition-all duration-300"
          priority
        />
      </div>
      {images.length > 1 && (
        <div className="grid grid-cols-4 gap-2">
          {images.map((img, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              className={`rounded-xl overflow-hidden aspect-[4/3] border-2 transition-all duration-200 relative ${
                active === i ? "border-green-500 scale-95" : "border-transparent opacity-60 hover:opacity-100"
              }`}
            >
              <Image
                src={img}
                alt={`foto ${i + 1}`}
                fill
                sizes="25vw"
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
