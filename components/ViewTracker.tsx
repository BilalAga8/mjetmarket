"use client";

import { useEffect } from "react";
import { createClient } from "@/lib/supabase-browser";

export default function ViewTracker({ vehicleId }: Readonly<{ vehicleId: string }>) {
  useEffect(() => {
    const key = `viewed_${vehicleId}`;
    if (sessionStorage.getItem(key)) return;
    sessionStorage.setItem(key, "1");
    const supabase = createClient();
    supabase.from("vehicle_views").insert({ vehicle_id: vehicleId });
  }, [vehicleId]);

  return null;
}
