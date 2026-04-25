import CarBrowser from "../components/CarBrowser";
import { supabase } from "../lib/supabase";
import type { Vehicle } from "../data/vehicles";

export const revalidate = 0;

export default async function Home() {
  const [{ data: vehicleData }, { data: shopData }, { data: serviceData }, { data: partnerData }] = await Promise.all([
    supabase.from("vehicles").select("*").order("created_at", { ascending: false }),
    supabase.from("shops").select("*").order("package").order("name"),
    supabase.from("services").select("id, name, category, city, phone, logo, verified").eq("verified", true).limit(4),
    supabase.from("part_partners").select("*").order("id").limit(4),
  ]);

  const vehicles = (vehicleData ?? []).map((v) => ({
    ...v,
    image: v.images?.[0] ?? "",
    engineCC: v.engine_cc ?? 0,
    tireCondition: v.tire_condition ?? undefined,
    images: v.images ?? [],
    features: v.features ?? [],
  }));

  return <CarBrowser cars={vehicles as unknown as Vehicle[]} shops={shopData ?? []} services={serviceData ?? []} partners={partnerData ?? []} />;
}
