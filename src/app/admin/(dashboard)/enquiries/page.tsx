"use client";

import { useEffect, useState, useCallback } from "react";
import { Trash2, Mail, MailOpen } from "lucide-react";
import { formatDate } from "@/lib/utils";

type Enquiry = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  company: string | null;
  projectType: string | null;
  location: string | null;
  budgetRange: string | null;
  message: string;
  read: boolean;
  createdAt: string;
};

export default function EnquiriesPage() {
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/admin/enquiries");
    if (res.ok) {
      const json = await res.json();
      setEnquiries(json.data ?? []);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const toggleRead = async (id: string, read: boolean) => {
    setEnquiries((prev) => prev.map((e) => (e.id === id ? { ...e, read } : e)));
    await fetch(`/api/admin/enquiries/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ read }),
    });
  };

  const remove = async (id: string) => {
    if (!confirm("Delete this enquiry?")) return;
    await fetch(`/api/admin/enquiries/${id}`, { method: "DELETE" });
    setEnquiries((prev) => prev.filter((e) => e.id !== id));
  };

  return (
    <div>
      <h1 className="text-2xl font-semibold text-neutral-900">Contact Enquiries</h1>
      <p className="mt-1 text-sm text-neutral-500">Messages submitted through the website contact form.</p>

      <div className="mt-8 rounded-lg border border-neutral-200 bg-white">
        {loading ? (
          <p className="px-6 py-8 text-sm text-neutral-400">Loading…</p>
        ) : enquiries.length === 0 ? (
          <p className="px-6 py-8 text-sm text-neutral-400">No enquiries yet.</p>
        ) : (
          <ul className="divide-y divide-neutral-100">
            {enquiries.map((e) => {
              const isOpen = expanded === e.id;
              return (
                <li key={e.id}>
                  <button
                    onClick={() => {
                      setExpanded(isOpen ? null : e.id);
                      if (!e.read) toggleRead(e.id, true);
                    }}
                    className="flex w-full items-center justify-between gap-4 px-6 py-4 text-left hover:bg-neutral-50"
                  >
                    <div className="flex items-center gap-3">
                      {e.read ? (
                        <MailOpen className="h-4 w-4 shrink-0 text-neutral-300" strokeWidth={1.75} />
                      ) : (
                        <Mail className="h-4 w-4 shrink-0 text-amber-500" strokeWidth={1.75} />
                      )}
                      <div>
                        <p className={`text-sm ${e.read ? "font-medium text-neutral-700" : "font-semibold text-neutral-900"}`}>
                          {e.name} <span className="font-normal text-neutral-400">— {e.email}</span>
                        </p>
                        <p className="mt-0.5 line-clamp-1 text-xs text-neutral-400">{e.message}</p>
                      </div>
                    </div>
                    <span className="shrink-0 text-xs text-neutral-400">{formatDate(e.createdAt)}</span>
                  </button>

                  {isOpen && (
                    <div className="border-t border-neutral-100 bg-neutral-50 px-6 py-5">
                      <div className="grid grid-cols-2 gap-4 text-sm sm:grid-cols-4">
                        {e.phone && (
                          <div>
                            <p className="text-xs text-neutral-400">Phone</p>
                            <p>{e.phone}</p>
                          </div>
                        )}
                        {e.company && (
                          <div>
                            <p className="text-xs text-neutral-400">Company</p>
                            <p>{e.company}</p>
                          </div>
                        )}
                        {e.projectType && (
                          <div>
                            <p className="text-xs text-neutral-400">Project Type</p>
                            <p>{e.projectType}</p>
                          </div>
                        )}
                        {e.location && (
                          <div>
                            <p className="text-xs text-neutral-400">Location</p>
                            <p>{e.location}</p>
                          </div>
                        )}
                        {e.budgetRange && (
                          <div>
                            <p className="text-xs text-neutral-400">Budget</p>
                            <p>{e.budgetRange}</p>
                          </div>
                        )}
                      </div>
                      <p className="mt-4 whitespace-pre-wrap text-sm text-neutral-700">{e.message}</p>
                      <div className="mt-4 flex items-center gap-4">
                        <a href={`mailto:${e.email}`} className="text-xs font-medium text-neutral-900 underline underline-offset-2">
                          Reply by Email
                        </a>
                        <button
                          onClick={() => remove(e.id)}
                          className="inline-flex items-center gap-1 text-xs font-medium text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-3.5 w-3.5" /> Delete
                        </button>
                      </div>
                    </div>
                  )}
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}
