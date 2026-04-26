"use server";

import { supabaseAdmin } from "@/lib/supabase-admin";
import { revalidatePath } from "next/cache";

export async function createShopAccount(formData: FormData) {
  const name     = formData.get("name")     as string;
  const email    = formData.get("email")    as string;
  const password = formData.get("password") as string;
  const city     = formData.get("city")     as string;
  const phone    = formData.get("phone")    as string;

  const { data, error } = await supabaseAdmin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
  });

  if (error || !data.user) {
    return { error: error?.message ?? "Gabim gjatë krijimit të llogarisë." };
  }

  await supabaseAdmin.from("shop_profiles").insert({
    id:    data.user.id,
    name,
    city,
    phone,
  });

  revalidatePath("/admin/dyqanet");
  return { success: true, email, password, name };
}

export async function toggleShopActive(id: string, current: boolean) {
  await supabaseAdmin.from("shop_profiles").update({ is_active: !current }).eq("id", id);
  revalidatePath("/admin/dyqanet");
}
