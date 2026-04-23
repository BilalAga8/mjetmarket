"use client";

import { useState } from "react";

export default function CarGallery({ images }: { images: string[] }) {
  const [active, setActive] = useState(0);

  return (
    <div className="flex flex-col gap-3">
      <div className="rounded-2xl overflow-hidden aspect-[4/3] bg-gray-100">
        <img
          src={images[active]}
          alt="foto kryesore"
          className="w-full h-full object-cover transition-all duration-300"
        />
      </div>
      <div className="grid grid-cols-4 gap-2">
        {images.map((img, i) => (
          <button
            key={i}
            onClick={() => setActive(i)}
            className={`rounded-xl overflow-hidden aspect-[4/3] border-2 transition-all duration-200 ${
              active === i ? "border-green-500 scale-95" : "border-transparent opacity-60 hover:opacity-100"
            }`}
          >
            <img src={img} alt={`foto ${i + 1}`} className="w-full h-full object-cover" />
          </button>
        ))}
      </div>
    </div>
  );
}
