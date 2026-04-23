"use client";

import { useState } from "react";
import Link from "next/link";
import type { PartCategory } from "../../data/partCategories";
import { partPartners } from "../../data/partPartners";
import PartRequestForm from "../../components/PartRequestForm";

const bgColors = ["bg-green-600", "bg-blue-600", "bg-orange-500", "bg-purple-600"];

interface Props {
  categories: PartCategory[];
}

export default function PjeseKembimiClient({ categories }: Props) {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedPart, setSelectedPart] = useState("");
  const [search, setSearch] = useState("");

  const filtered = categories.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.nameEn.toLowerCase().includes(search.toLowerCase())
  );

  function openForm(partName: string) {
    setSelectedPart(partName);
    setModalOpen(true);
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 py-10 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto">
          <Link href="/" className="text-sm text-gray-400 hover:text-green-600 transition-colors flex items-center gap-1 mb-4">
            ← Kthehu
          </Link>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight mb-1">
            Pjesë Këmbimi
          </h1>
          <p className="text-gray-500 text-sm mb-6">
            Zgjidh kategorinë, dërgo numrin e shasisë dhe ne gjejmë pjesën për ty.
          </p>

          {/* Search */}
          <div className="relative max-w-md">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
            </svg>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Kërko pjesën..."
              className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500"
            />
          </div>
        </div>
      </div>

      {/* Partner Cards */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 pt-8">
        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Partnerët tanë</p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {partPartners.map((partner, i) => (
            <div
              key={partner.id}
              className="flex items-center gap-3 bg-white border border-gray-200 rounded-xl px-3 py-3"
            >
              <div className={`w-10 h-10 ${bgColors[i]} rounded-xl flex items-center justify-center text-white text-xs font-extrabold shrink-0`}>
                {partner.logo}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-gray-800 truncate">{partner.name}</p>
                <p className="text-xs text-gray-400">{partner.city}</p>
              </div>
              <div className="shrink-0 bg-red-500 text-white text-xs font-extrabold px-2 py-0.5 rounded-lg">
                -{partner.discount}%
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Categories Grid */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
        {filtered.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-400 text-sm">Nuk u gjet asnjë kategori për "{search}"</p>
            <button
              onClick={() => openForm(search)}
              className="mt-4 text-green-600 text-sm font-semibold hover:underline"
            >
              Kërko "{search}" si pjesë të posaçme →
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
            {filtered.map((cat) => (
              <button
                key={cat.id}
                onClick={() => openForm(cat.name)}
                className="bg-white border border-gray-200 rounded-2xl p-4 text-center hover:border-green-400 hover:shadow-md transition-all duration-150 group"
              >
                <div className="text-3xl mb-2">{cat.icon}</div>
                <p className="text-sm font-semibold text-gray-800 group-hover:text-green-700 leading-tight">{cat.name}</p>
                <p className="text-xs text-gray-400 mt-0.5">{cat.nameEn}</p>
              </button>
            ))}
          </div>
        )}

        {/* CTA Banner */}
        <div className="mt-12 bg-green-600 rounded-2xl p-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h3 className="text-white text-lg font-bold mb-1">Nuk gjen çfarë kërkon?</h3>
            <p className="text-green-100 text-sm">Na trego çfarë të duhet dhe ne gjejmë për ty.</p>
          </div>
          <button
            onClick={() => openForm("")}
            className="bg-white text-green-700 font-bold px-6 py-3 rounded-xl hover:bg-green-50 transition-colors text-sm whitespace-nowrap"
          >
            Kërko Pjesën →
          </button>
        </div>
      </div>

      {/* Modal */}
      {modalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <PartRequestForm
              preselectedPart={selectedPart}
              onClose={() => setModalOpen(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
}
