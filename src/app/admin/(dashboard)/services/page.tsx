"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { Plus, Pencil, Trash2 } from "lucide-react";

type Service = {
  id: string;
  title: string;
  number: string;
  image: string;
  published: boolean;
};

export default function AdminServicesPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/admin/services");
    if (res.ok) {
      const json = await res.json();
      setServices(json.data ?? []);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const remove = async (id: string, title: string) => {
    if (!confirm(`Delete "${title}"?`)) return;
    await fetch(`/api/admin/services/${id}`, { method: "DELETE" });
    setServices((prev) => prev.filter((s) => s.id !== id));
  };

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-neutral-900">Services</h1>
          <p className="mt-1 text-sm text-neutral-500">{services.length} total</p>
        </div>
        <Link
          href="/admin/services/new"
          className="inline-flex items-center gap-2 rounded-md bg-neutral-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-neutral-800"
        >
          <Plus className="h-4 w-4" /> New Service
        </Link>
      </div>

      <div className="mt-8 overflow-hidden rounded-lg border border-neutral-200 bg-white">
        {loading ? (
          <p className="px-6 py-8 text-sm text-neutral-400">Loading…</p>
        ) : (
          <ul className="divide-y divide-neutral-100">
            {services.map((s) => (
              <li key={s.id} className="flex items-center justify-between px-6 py-3 hover:bg-neutral-50">
                <div className="flex items-center gap-3">
                  <div className="relative h-12 w-16 shrink-0 overflow-hidden rounded bg-neutral-100">
                    <Image src={s.image} alt={s.title} fill sizes="64px" className="object-cover" />
                  </div>
                  <p className="font-medium text-neutral-900">
                    <span className="mr-2 text-neutral-400">{s.number}</span>
                    {s.title}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <Link href={`/admin/services/${s.id}`} className="text-neutral-400 hover:text-neutral-900" aria-label="Edit">
                    <Pencil className="h-4 w-4" strokeWidth={1.75} />
                  </Link>
                  <button onClick={() => remove(s.id, s.title)} className="text-neutral-300 hover:text-red-600" aria-label="Delete">
                    <Trash2 className="h-4 w-4" strokeWidth={1.75} />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
