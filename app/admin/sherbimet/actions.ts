"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase-server";

export async function deleteService(id: number) {
  const supabase = await createClient();
  await supabase.from("services").delete().eq("id", id);
  revalidatePath("/admin/sherbimet");
  revalidatePath("/servisi");
}

export async function addService(formData: FormData) {
  const supabase = await createClient();
  await supabase.from("services").insert({
    name:        formData.get("name")        as string,
    category:    formData.get("category")    as string,
    city:        formData.get("city")        as string,
    address:     formData.get("address")     as string,
    phone:       formData.get("phone")       as string,
    website:     formData.get("website")     as string,
    logo:        (formData.get("name") as string).slice(0, 2).toUpperCase(),
    verified:    formData.get("verified") === "true",
    description: formData.get("description") as string,
  });
  revalidatePath("/admin/sherbimet");
  revalidatePath("/servisi");
}

export async function updateService(id: number, formData: FormData) {
  const supabase = await createClient();
  await supabase.from("services").update({
    name:        formData.get("name")        as string,
    category:    formData.get("category")    as string,
    city:        formData.get("city")        as string,
    address:     formData.get("address")     as string,
    phone:       formData.get("phone")       as string,
    website:     formData.get("website")     as string,
    verified:    formData.get("verified") === "true",
    description: formData.get("description") as string,
  }).eq("id", id);
  revalidatePath("/admin/sherbimet");
  revalidatePath("/servisi");
}
