"use client";

import { useState, useTransition } from "react";
import { deleteService, addService, updateService } from "./actions";

type Service = {
  id: number;
  name: string;
  category: string;
  city: string;
  address: string;
  phone: string;
  website: string;
  verified: boolean;
  logo: string;
  description: string;
};

const categories = [
  "Servis Mekanik",
  "Elektrik & Elektronikë",
  "Bojaxhi",
  "Veshje & Tapeçi",
  "Xhama",
  "Aksesore",
  "Tjetër",
];

const emptyForm = {
  name: "", category: "Servis Mekanik", city: "", address: "",
  phone: "", website: "", verified: "false", description: "",
};

function ServiceForm({
  initial,
  onSubmit,
  onCancel,
  pending,
}: {
  initial: typeof emptyForm;
  onSubmit: (fd: FormData) => void;
  onCancel: () => void;
  pending: boolean;
}) {
  const inputCls = "w-full bg-gray-800 border border-gray-700 text-white rounded-xl px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-green-500 placeholder:text-gray-600";
  const labelCls = "text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1 block";

  return (
    <form action={onSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <label htmlFor="sf-name" className={labelCls}>Emri *</label>
        <input id="sf-name" name="name" required defaultValue={initial.name} placeholder="Emri i servisit" className={inputCls} />
      </div>
      <div>
        <label htmlFor="sf-category" className={labelCls}>Kategoria *</label>
        <select id="sf-category" name="category" defaultValue={initial.category} className={inputCls}>
          {categories.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>
      <div>
        <label htmlFor="sf-city" className={labelCls}>Qyteti *</label>
        <input id="sf-city" name="city" required defaultValue={initial.city} placeholder="Tiranë" className={inputCls} />
      </div>
      <div>
        <label htmlFor="sf-address" className={labelCls}>Adresa</label>
        <input id="sf-address" name="address" defaultValue={initial.address} placeholder="Rruga, nr." className={inputCls} />
      </div>
      <div>
        <label htmlFor="sf-phone" className={labelCls}>Telefon</label>
        <input id="sf-phone" name="phone" defaultValue={initial.phone} placeholder="069 000 0000" className={inputCls} />
      </div>
      <div>
        <label htmlFor="sf-website" className={labelCls}>Website</label>
        <input id="sf-website" name="website" defaultValue={initial.website} placeholder="servis.al" className={inputCls} />
      </div>
      <div>
        <label htmlFor="sf-verified" className={labelCls}>Verifikuar</label>
        <select id="sf-verified" name="verified" defaultValue={initial.verified} className={inputCls}>
          <option value="true">Po — Partner i Verifikuar</option>
          <option value="false">Jo</option>
        </select>
      </div>
      <div className="md:col-span-2">
        <label htmlFor="sf-desc" className={labelCls}>Përshkrimi</label>
        <textarea id="sf-desc" name="description" rows={2} defaultValue={initial.description}
          placeholder="Përshkrim i shkurtër i shërbimit..." className={`${inputCls} resize-none`} />
      </div>
      <div className="md:col-span-2 flex gap-3 justify-end">
        <button type="button" onClick={onCancel}
          className="px-4 py-2 text-sm text-gray-400 hover:text-white transition-colors">
          Anulo
        </button>
        <button type="submit" disabled={pending}
          className="bg-green-500 hover:bg-green-600 disabled:opacity-60 text-white text-sm font-semibold px-5 py-2 rounded-xl transition-colors">
          {pending ? "Duke ruajtur..." : "Ruaj"}
        </button>
      </div>
    </form>
  );
}

export default function SherbimetClient({ initialServices }: { initialServices: Service[] }) {
  const [services, setServices] = useState(initialServices);
  const [showAdd, setShowAdd] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleDelete(id: number) {
    if (!confirm("Fshij këtë servis?")) return;
    startTransition(async () => {
      await deleteService(id);
      setServices((prev) => prev.filter((s) => s.id !== id));
    });
  }

  function handleAdd(fd: FormData) {
    startTransition(async () => {
      await addService(fd);
      setShowAdd(false);
      // refetch via server revalidation; optimistically hide form
    });
  }

  function handleUpdate(id: number, fd: FormData) {
    startTransition(async () => {
      await updateService(id, fd);
      setEditId(null);
    });
  }

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white">Servise Partnere</h1>
          <p className="text-gray-500 text-sm mt-1">{services.length} servise gjithsej</p>
        </div>
        {!showAdd && (
          <button onClick={() => setShowAdd(true)}
            className="bg-green-500 hover:bg-green-600 text-white text-sm font-semibold px-4 py-2.5 rounded-xl transition-colors">
            + Shto Servis
          </button>
        )}
      </div>

      {/* Forma e shtimit */}
      {showAdd && (
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 mb-6">
          <h2 className="text-white font-bold mb-5">Servis i Ri</h2>
          <ServiceForm
            initial={emptyForm}
            onSubmit={handleAdd}
            onCancel={() => setShowAdd(false)}
            pending={isPending}
          />
        </div>
      )}

      {/* Lista */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {services.map((s) => (
          <div key={s.id} className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
            {editId === s.id ? (
              <>
                <p className="text-white font-bold mb-4">Edito: {s.name}</p>
                <ServiceForm
                  initial={{
                    name: s.name, category: s.category, city: s.city,
                    address: s.address, phone: s.phone, website: s.website,
                    verified: String(s.verified), description: s.description,
                  }}
                  onSubmit={(fd) => handleUpdate(s.id, fd)}
                  onCancel={() => setEditId(null)}
                  pending={isPending}
                />
              </>
            ) : (
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-blue-600 text-white font-extrabold text-sm flex items-center justify-center shrink-0">
                  {s.logo}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-0.5">
                    <span className="font-bold text-white text-sm">{s.name}</span>
                    {s.verified && (
                      <span className="text-xs text-green-400 bg-green-500/10 px-2 py-0.5 rounded-full">★ Verifikuar</span>
                    )}
                    <span className="text-xs text-gray-500 bg-gray-800 px-2 py-0.5 rounded-full">{s.category}</span>
                  </div>
                  <p className="text-xs text-gray-500">{s.city}{s.address ? ` · ${s.address}` : ""}</p>
                  {s.description && (
                    <p className="text-xs text-gray-400 mt-1 italic line-clamp-2">{s.description}</p>
                  )}
                </div>
                <div className="flex flex-col gap-1 shrink-0">
                  <button onClick={() => setEditId(s.id)} className="text-xs text-blue-400 hover:underline">Edito</button>
                  <button onClick={() => handleDelete(s.id)} className="text-xs text-red-400 hover:underline">Fshij</button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
