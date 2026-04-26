import { createClient } from "@/lib/supabase-server";
import { redirect } from "next/navigation";
import KerkestatClient from "./KerkestatClient";

export const revalidate = 0;

export default async function DyqaniKerkesat() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/dyqani/login");

  const [{ data: requests }, { data: profile }, { data: stats }] = await Promise.all([
    supabase
      .from("part_requests")
      .select("*, shop_offers(id, shop_id, status, price, delivery_days, notes)")
      .eq("status", "pritje")
      .order("created_at", { ascending: false }),
    supabase.from("shop_profiles").select("name").eq("id", user.id).single(),
    supabase
      .from("shop_offers")
      .select("id, status, created_at")
      .eq("shop_id", user.id),
  ]);

  const today = new Date().toISOString().split("T")[0];
  const offersToday   = (stats ?? []).filter((o) => o.created_at.startsWith(today)).length;
  const offersWon     = (stats ?? []).filter((o) => o.status === "zgjedhur").length;

  return (
    <KerkestatClient
      requests={requests ?? []}
      shopId={user.id}
      shopName={profile?.name ?? "Dyqani"}
      stats={{ open: (requests ?? []).length, today: offersToday, won: offersWon }}
    />
  );
}
