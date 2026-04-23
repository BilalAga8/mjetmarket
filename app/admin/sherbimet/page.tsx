import { createClient } from "@/lib/supabase-server";
import SherbimetClient from "./SherbimetClient";

export const revalidate = 0;

export default async function AdminSherbimet() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("services")
    .select("*")
    .order("verified", { ascending: false })
    .order("name");

  return <SherbimetClient initialServices={data ?? []} />;
}
