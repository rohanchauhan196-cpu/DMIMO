"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import ImageUploadField from "@/components/admin/ImageUploadField";
import { slugify } from "@/lib/utils";

type ServiceFormData = {
  title: string;
  slug: string;
  number: string;
  shortDescription: string;
  description: string;
  image: string;
  capabilities: string;
  order: number;
  published: boolean;
};

const inputClass = "w-full rounded-md border border-neutral-300 px-3 py-2 text-sm focus:border-neutral-900 focus:outline-none";
const labelClass = "mb-1.5 block text-xs font-medium uppercase tracking-wide text-neutral-500";

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className={labelClass}>{label}</label>
      {children}
    </div>
  );
}

export default function ServiceForm({
  initial,
  serviceId,
}: {
  initial?: Partial<ServiceFormData>;
  serviceId?: string;
}) {
  const router = useRouter();
  const [data, setData] = useState<ServiceFormData>({
    title: "",
    slug: "",
    number: "01",
    shortDescription: "",
    description: "",
    image: "",
    capabilities: "",
    order: 0,
    published: true,
    ...initial,
  });
  const [slugEdited, setSlugEdited] = useState(Boolean(initial?.slug));
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const set = <K extends keyof ServiceFormData>(key: K, value: ServiceFormData[K]) => setData((d) => ({ ...d, [key]: value }));

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");

    const payload = {
      ...data,
      capabilities: data.capabilities.split(",").map((s) => s.trim()).filter(Boolean),
    };
    const url = serviceId ? `/api/admin/services/${serviceId}` : "/api/admin/services";
    const method = serviceId ? "PUT" : "POST";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const json = await res.json();

    if (!res.ok) {
      setError(json.error ?? "Could not save service");
      setSaving(false);
      return;
    }

    router.push("/admin/services");
    router.refresh();
  };

  return (
    <form onSubmit={onSubmit} className="space-y-8">
      <section className="rounded-lg border border-neutral-200 bg-white p-6">
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <Field label="Title">
            <input
              className={inputClass}
              value={data.title}
              onChange={(e) => {
                set("title", e.target.value);
                if (!slugEdited) set("slug", slugify(e.target.value));
              }}
              required
            />
          </Field>
          <Field label="Slug">
            <input
              className={inputClass}
              value={data.slug}
              onChange={(e) => {
                setSlugEdited(true);
                set("slug", e.target.value);
              }}
              required
            />
          </Field>
          <Field label="Display Number">
            <input className={inputClass} value={data.number} onChange={(e) => set("number", e.target.value)} placeholder="01" />
          </Field>
          <Field label="Sort Order">
            <input type="number" className={inputClass} value={data.order} onChange={(e) => set("order", Number(e.target.value))} />
          </Field>
        </div>

        <div className="mt-5 space-y-5">
          <Field label="Short Description">
            <textarea className={inputClass} rows={2} value={data.shortDescription} onChange={(e) => set("shortDescription", e.target.value)} required />
          </Field>
          <Field label="Full Description">
            <textarea className={inputClass} rows={4} value={data.description} onChange={(e) => set("description", e.target.value)} required />
          </Field>
          <Field label="Capabilities (comma-separated)">
            <input className={inputClass} value={data.capabilities} onChange={(e) => set("capabilities", e.target.value)} placeholder="Concept Design, Documentation, Site Supervision" />
          </Field>
          <ImageUploadField label="Image" value={data.image} onChange={(url) => set("image", url)} />
        </div>

        <label className="mt-5 flex items-center gap-2 text-sm text-neutral-700">
          <input type="checkbox" checked={data.published} onChange={(e) => set("published", e.target.checked)} />
          Published
        </label>
      </section>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <div className="flex items-center gap-3">
        <button
          type="submit"
          disabled={saving}
          className="inline-flex items-center gap-2 rounded-md bg-neutral-900 px-5 py-2.5 text-sm font-medium text-white hover:bg-neutral-800 disabled:opacity-60"
        >
          {saving && <Loader2 className="h-4 w-4 animate-spin" />}
          {serviceId ? "Save Changes" : "Create Service"}
        </button>
        <button type="button" onClick={() => router.push("/admin/services")} className="text-sm text-neutral-500 hover:text-neutral-900">
          Cancel
        </button>
      </div>
    </form>
  );
}
