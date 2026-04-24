"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase-browser";

interface Inquiry {
  id: string;
  name: string;
  phone: string | null;
  message: string | null;
  created_at: string;
  vehicles: { brand: string; model: string; year: number }[] | null;
}

function timeAgo(dateStr: string) {
  const diff = Math.floor((Date.now() - new Date(dateStr).getTime()) / 1000);
  if (diff < 60) return "tani";
  if (diff < 3600) return `${Math.floor(diff / 60)} min më parë`;
  if (diff < 86400) return `${Math.floor(diff / 3600)} orë më parë`;
  return `${Math.floor(diff / 86400)} ditë më parë`;
}

export default function MesazhetPage() {
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(async ({ data: { user } }) => {
      if (!user) return;

      const { data } = await supabase
        .from("vehicle_inquiries")
        .select("id, name, phone, message, created_at, vehicles(brand, model, year)")
        .order("created_at", { ascending: false });

      setInquiries((data ?? []) as Inquiry[]);
      setLoading(false);

      await supabase
        .from("notifications")
        .update({ read: true })
        .eq("user_id", user.id)
        .eq("read", false);
    });
  }, []);

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Mesazhet</h1>
        <p className="text-gray-500 text-sm mt-1">
          {loading ? "Duke ngarkuar…" : `${inquiries.length} mesazhe të pranuara`}
        </p>
      </div>

      {loading ? (
        <div className="py-20 text-center text-gray-400 text-sm">Duke ngarkuar…</div>
      ) : inquiries.length === 0 ? (
        <div className="py-20 text-center bg-white border border-gray-100 rounded-2xl shadow-sm">
          <p className="text-4xl mb-3">✉️</p>
          <p className="text-gray-400 text-sm">Nuk ke mesazhe ende.</p>
          <p className="text-gray-300 text-xs mt-1">Kur dikush dërgon mesazh për makinën tënde, do të shfaqet këtu.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {inquiries.map((inq) => (
            <div key={inq.id} className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-700 font-bold text-sm shrink-0">
                    {inq.name[0]?.toUpperCase()}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 text-sm">{inq.name}</p>
                    {inq.phone && (
                      <a href={`tel:${inq.phone.replace(/\s/g, "")}`} className="text-xs text-green-600 hover:underline">
                        {inq.phone}
                      </a>
                    )}
                  </div>
                </div>
                <span className="text-xs text-gray-400 shrink-0">{timeAgo(inq.created_at)}</span>
              </div>

              {inq.vehicles?.[0] && (
                <div className="mt-3 bg-gray-50 rounded-xl px-3 py-2 text-xs text-gray-500">
                  🚗 {inq.vehicles[0].brand} {inq.vehicles[0].model} {inq.vehicles[0].year}
                </div>
              )}

              {inq.message && (
                <p className="mt-3 text-sm text-gray-700 bg-blue-50 rounded-xl px-4 py-3">
                  {inq.message}
                </p>
              )}

              {inq.phone && (
                <div className="mt-3 flex gap-2">
                  <a href={`tel:${inq.phone.replace(/\s/g, "")}`}
                    className="text-xs bg-green-50 text-green-700 hover:bg-green-100 font-semibold px-3 py-1.5 rounded-lg transition-colors">
                    📞 Telefono
                  </a>
                  <a href={`https://wa.me/${inq.phone.replace(/[\s+]/g, "")}`} target="_blank" rel="noopener noreferrer"
                    className="text-xs bg-[#e8fdf0] text-[#25D366] hover:bg-[#d0f8e0] font-semibold px-3 py-1.5 rounded-lg transition-colors">
                    WhatsApp
                  </a>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
