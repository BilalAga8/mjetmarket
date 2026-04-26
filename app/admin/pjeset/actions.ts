"use server";

import { supabaseAdmin } from "@/lib/supabase-admin";
import { revalidatePath } from "next/cache";

export async function selectOffer(offerId: string, requestId: string, shopName: string, price: number) {
  // 1. Zgjedh ofertën e fituesit
  await supabaseAdmin.from("shop_offers").update({ status: "zgjedhur" }).eq("id", offerId);

  // 2. Refuzo të tjerat
  await supabaseAdmin
    .from("shop_offers")
    .update({ status: "refuzuar" })
    .eq("request_id", requestId)
    .neq("id", offerId);

  // 3. Update kërkesën
  await supabaseAdmin.from("part_requests").update({
    status:           "proces",
    assigned_partner: shopName,
    client_price:     String(price),
    updated_at:       new Date().toISOString(),
  }).eq("id", requestId);

  revalidatePath("/admin/pjeset");
}
