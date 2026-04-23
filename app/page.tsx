import CarBrowser from "../components/CarBrowser";
import { supabase } from "../lib/supabase";

export const revalidate = 0;

export default async function Home() {
  const [{ data: vehicleData }, { data: shopData }] = await Promise.all([
    supabase.from("vehicles").select("*").order("created_at", { ascending: false }),
    supabase.from("shops").select("*").order("package").order("name"),
  ]);

  const vehicles = (vehicleData ?? []).map((v) => ({
    ...v,
    image: v.images?.[0] ?? "",
    engineCC: v.engine_cc ?? 0,
    tireCondition: v.tire_condition ?? undefined,
    images: v.images ?? [],
    features: v.features ?? [],
  }));

  return <CarBrowser cars={vehicles as never} shops={shopData ?? []} />;
}
