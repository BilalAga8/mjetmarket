import type { Metadata } from "next";
import PjeseKembimiClient from "./PjeseKembimiClient";
import { partCategories } from "../../data/partCategories";
import { createClient } from "@/lib/supabase-server";
import ServiceCard from "../../components/ServiceCard";

export const metadata: Metadata = {
  title: "Pjesë Këmbimi & Servise",
  description: "Porosit pjesë këmbimi dhe gjej servise të besuara për makinën tënde në Shqipëri.",
  keywords: ["pjese kembimi makine", "auto parts shqiperi", "servis makine shqiperi", "spare parts shqiperi"],
};

export const revalidate = 0;

export default async function PjeseKembimiPage() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("services")
    .select("id, name, category, city, phone, logo, verified")
    .order("verified", { ascending: false })
    .order("name");

  const services = data ?? [];

  return (
    <>
      <PjeseKembimiClient categories={partCategories} />

      {/* Seksioni i serviseve */}
      <div className="bg-gray-50 border-t border-gray-200 py-12 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center gap-3 mb-6">
            <div>
              <h2 className="text-2xl font-extrabold text-gray-900">Ku ta instalosh?</h2>
              <p className="text-gray-500 text-sm mt-0.5">
                Servise të besuara ku mund të çosh makinën pas porosisë
              </p>
            </div>
          </div>

          {services.length === 0 ? (
            <p className="text-gray-400 text-sm">Nuk ka servise të regjistruara ende.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {services.map((s) => (
                <ServiceCard key={s.id} service={s} />
              ))}
            </div>
          )}

        </div>
      </div>
    </>
  );
}
