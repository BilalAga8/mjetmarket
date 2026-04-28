"use server";

import { supabaseAdmin } from "@/lib/supabase-admin";
import { revalidatePath } from "next/cache";

export async function setUserRole(id: string, role: "user" | "admin") {
  await supabaseAdmin.from("profiles").update({ role }).eq("id", id);
  revalidatePath("/admin/perdoruesit");
}
