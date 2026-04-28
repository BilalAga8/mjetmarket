"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { setUserRole } from "./actions";

export default function RoleToggle({ userId, currentRole }: { userId: string; currentRole: string }) {
  const [role, setRole] = useState(currentRole);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  function toggle() {
    const newRole = role === "admin" ? "user" : "admin";
    startTransition(async () => {
      await setUserRole(userId, newRole as "user" | "admin");
      setRole(newRole);
      router.refresh();
    });
  }

  return (
    <button
      onClick={toggle}
      disabled={isPending}
      className={`text-xs px-3 py-1 rounded-full font-semibold transition-colors disabled:opacity-50 ${
        role === "admin"
          ? "bg-green-500/15 text-green-400 hover:bg-red-500/15 hover:text-red-400"
          : "bg-gray-700 text-gray-400 hover:bg-green-500/15 hover:text-green-400"
      }`}
    >
      {isPending ? "..." : role === "admin" ? "Admin" : "User"}
    </button>
  );
}
