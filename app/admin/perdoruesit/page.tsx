import { supabaseAdmin } from "@/lib/supabase-admin";
import RoleToggle from "./RoleToggle";

export const revalidate = 0;

type UserRow = {
  id: string;
  emri: string;
  mbiemri: string;
  telefoni: string;
  role: string;
  created_at: string;
  email: string;
};

export default async function AdminPerdoruesit() {
  const { data: profiles } = await supabaseAdmin
    .from("profiles")
    .select("*")
    .order("created_at", { ascending: false });

  const { data: { users: authUsers } } = await supabaseAdmin.auth.admin.listUsers();
  const emailMap = Object.fromEntries((authUsers ?? []).map((u) => [u.id, u.email ?? ""]));

  const users: UserRow[] = (profiles ?? []).map((p) => ({
    ...p,
    email: emailMap[p.id] ?? "",
  }));

  return (
    <div className="p-4 sm:p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white">Përdoruesit</h1>
          <p className="text-gray-500 text-sm mt-1">{users.length} përdorues të regjistruar</p>
        </div>
      </div>

      <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
        {users.length === 0 ? (
          <div className="py-16 text-center text-gray-500 text-sm">Asnjë përdorues i regjistruar akoma.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-800 text-xs text-gray-500 uppercase tracking-wide">
                  <th className="px-4 py-3 text-left">Emri</th>
                  <th className="px-4 py-3 text-left">Email</th>
                  <th className="px-4 py-3 text-left">Telefoni</th>
                  <th className="px-4 py-3 text-left">Roli</th>
                  <th className="px-4 py-3 text-left">Regjistruar</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u.id} className="border-b border-gray-800 last:border-0 hover:bg-gray-800/50 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center text-green-400 text-xs font-bold shrink-0">
                          {(u.emri?.[0] ?? u.email?.[0] ?? "?").toUpperCase()}
                        </div>
                        <span className="font-medium text-white">
                          {u.emri || u.mbiemri ? `${u.emri} ${u.mbiemri}`.trim() : "—"}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-gray-400">{u.email || "—"}</td>
                    <td className="px-4 py-3 text-gray-400">{u.telefoni || "—"}</td>
                    <td className="px-4 py-3">
                      <RoleToggle userId={u.id} currentRole={u.role} />
                    </td>
                    <td className="px-4 py-3 text-gray-500 text-xs">
                      {new Date(u.created_at).toLocaleDateString("sq-AL")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
