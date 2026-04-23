"use client";

import { useState, useEffect, useCallback } from "react";
import { Shop } from "../data/shops";

const packageColors: Record<string, string> = {
  gold:   "bg-yellow-500",
  silver: "bg-gray-400",
  bronze: "bg-orange-400",
};

const packageLabel: Record<string, string> = {
  gold:   "🥇 Gold Partner",
  silver: "🥈 Silver Partner",
  bronze: "🥉 Bronze Partner",
};

export default function BannerSlideshow({ shops }: { readonly shops: Shop[] }) {
  const [current, setCurrent] = useState(0);
  const [visible, setVisible] = useState(true);

  const goTo = useCallback((index: number) => {
    setVisible(false);
    setTimeout(() => {
      setCurrent(index);
      setVisible(true);
    }, 400);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => {
        const next = (prev + 1) % shops.length;
        goTo(next);
        return prev;
      });
    }, 5000);
    return () => clearInterval(interval);
  }, [shops.length, goTo]);

  const shop = shops[current];

  return (
    <div className="w-full bg-gray-100 border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-14 py-2.5 flex items-center justify-between gap-4">

        <div className="flex items-center gap-2 shrink-0">
          <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Sponsor</span>
          <span className="w-px h-4 bg-gray-300" />
        </div>

        <div
          className="flex items-center gap-3 flex-1 min-w-0 transition-opacity duration-400"
          style={{ opacity: visible ? 1 : 0 }}
        >
          <div className={`w-8 h-8 rounded-lg ${packageColors[shop.package]} text-white font-extrabold text-xs flex items-center justify-center shrink-0`}>
            {shop.logo}
          </div>
          <div className="flex flex-col min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-semibold text-gray-800 text-sm truncate">{shop.name}</span>
              <span className="text-xs font-semibold text-gray-500 shrink-0">{packageLabel[shop.package]}</span>
            </div>
            <div className="flex items-center gap-3 text-xs mt-0.5">
              <a href={`tel:${shop.phone}`} className="text-green-600 font-medium hover:underline shrink-0">
                📞 {shop.phone}
              </a>
              {shop.website && (
                <a href={`https://${shop.website}`} target="_blank" rel="noopener noreferrer"
                  className="text-gray-400 hover:text-gray-700 transition-colors hidden md:inline">
                  🌐 {shop.website}
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Dots */}
        <div className="flex items-center gap-1.5 shrink-0">
          {shops.map((s, i) => (
            <button
              key={s.id}
              onClick={() => goTo(i)}
              className={`rounded-full transition-all duration-300 ${i === current ? "w-4 h-1.5 bg-green-500" : "w-1.5 h-1.5 bg-gray-300 hover:bg-gray-400"}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
