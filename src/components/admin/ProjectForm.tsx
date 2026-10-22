"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Loader2, Plus, Trash2, GripVertical } from "lucide-react";
import ImageUploadField from "@/components/admin/ImageUploadField";
import { slugify } from "@/lib/utils";

type GalleryItem = { url: string; caption: string; layout: "full" | "half" | "large" | "small" };

type ProjectFormData = {
  title: string;
  slug: string;
  categoryId: string;
  location: string;
  year: number;
  client: string;
  architect: string;
  area: string;
  status: "COMPLETED" | "ONGOING" | "CONCEPT";
  shortDescription: string;
  story: string;
  coverImage: string;
  featured: boolean;
  published: boolean;
  order: number;
  seoTitle: string;
  seoDescription: string;
  gallery: GalleryItem[];
};

const EMPTY: ProjectFormData = {
  title: "",
  slug: "",
  categoryId: "",
  location: "",
  year: new Date().getFullYear(),
  client: "",
  architect: "D Mimo Architects",
  area: "",
  status: "COMPLETED",
  shortDescription: "",
  story: "",
  coverImage: "",
  featured: false,
  published: true,
  order: 0,
  seoTitle: "",
  seoDescription: "",
  gallery: [],
};

const inputClass = "w-full rounded-md border border-neutral-300 px-3 py-2 text-sm focus:border-neutral-900 focus:outline-none";
const labelClass = "mb-1.5 block text-xs font-medium uppercase tracking-wide text-neutral-500";

function Field({ label, children, className }: { label: string; children: React.ReactNode; className?: string }) {
  return (
    <div className={className}>
      <label className={labelClass}>{label}</label>
      {children}
    </div>
  );
}

export default function ProjectForm({
  categories,
  initial,
  projectId,
}: {
  categories: { id: string; name: string }[];
  initial?: Partial<ProjectFormData>;
  projectId?: string;
}) {
  const router = useRouter();
  const [data, setData] = useState<ProjectFormData>({ ...EMPTY, ...initial, categoryId: initial?.categoryId || categories[0]?.id || "" });
  const [slugEdited, setSlugEdited] = useState(Boolean(initial?.slug));
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const set = <K extends keyof ProjectFormData>(key: K, value: ProjectFormData[K]) => setData((d) => ({ ...d, [key]: value }));

  const updateGallery = (index: number, patch: Partial<GalleryItem>) => {
    setData((d) => ({ ...d, gallery: d.gallery.map((g, i) => (i === index ? { ...g, ...patch } : g)) }));
  };

  const addGalleryItem = () => {
    setData((d) => ({ ...d, gallery: [...d.gallery, { url: "", caption: "", layout: "half" }] }));
  };

  const removeGalleryItem = (index: number) => {
    setData((d) => ({ ...d, gallery: d.gallery.filter((_, i) => i !== index) }));
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");

    const payload = { ...data, gallery: data.gallery.filter((g) => g.url) };
    const url = projectId ? `/api/admin/projects/${projectId}` : "/api/admin/projects";
    const method = projectId ? "PUT" : "POST";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const json = await res.json();

    if (!res.ok) {
      setError(json.error ?? "Could not save project");
      setSaving(false);
      return;
    }

    router.push("/admin/projects");
    router.refresh();
  };

  return (
    <form onSubmit={onSubmit} className="space-y-8">
      <section className="rounded-lg border border-neutral-200 bg-white p-6">
        <h2 className="mb-5 text-sm font-semibold text-neutral-900">Basic Information</h2>
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
          <Field label="Category">
            <select className={inputClass} value={data.categoryId} onChange={(e) => set("categoryId", e.target.value)} required>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </Field>
          <Field label="Status">
            <select className={inputClass} value={data.status} onChange={(e) => set("status", e.target.value as ProjectFormData["status"])}>
              <option value="COMPLETED">Completed</option>
              <option value="ONGOING">Under Construction</option>
              <option value="CONCEPT">Concept</option>
            </select>
          </Field>
          <Field label="Location">
            <input className={inputClass} value={data.location} onChange={(e) => set("location", e.target.value)} required />
          </Field>
          <Field label="Year">
            <input type="number" className={inputClass} value={data.year} onChange={(e) => set("year", Number(e.target.value))} required />
          </Field>
          <Field label="Client">
            <input className={inputClass} value={data.client} onChange={(e) => set("client", e.target.value)} />
          </Field>
          <Field label="Architect">
            <input className={inputClass} value={data.architect} onChange={(e) => set("architect", e.target.value)} />
          </Field>
          <Field label="Area">
            <input className={inputClass} value={data.area} onChange={(e) => set("area", e.target.value)} placeholder="e.g. 4,200 sq.ft." />
          </Field>
          <Field label="Sort Order">
            <input type="number" className={inputClass} value={data.order} onChange={(e) => set("order", Number(e.target.value))} />
          </Field>
        </div>

        <div className="mt-5 flex items-center gap-6">
          <label className="flex items-center gap-2 text-sm text-neutral-700">
            <input type="checkbox" checked={data.featured} onChange={(e) => set("featured", e.target.checked)} />
            Featured on homepage
          </label>
          <label className="flex items-center gap-2 text-sm text-neutral-700">
            <input type="checkbox" checked={data.published} onChange={(e) => set("published", e.target.checked)} />
            Published
          </label>
        </div>
      </section>

      <section className="rounded-lg border border-neutral-200 bg-white p-6">
        <h2 className="mb-5 text-sm font-semibold text-neutral-900">Content</h2>
        <div className="space-y-5">
          <Field label="Short Description">
            <textarea className={inputClass} rows={2} value={data.shortDescription} onChange={(e) => set("shortDescription", e.target.value)} required />
          </Field>
          <Field label="Project Story (use a blank line between paragraphs)">
            <textarea className={inputClass} rows={8} value={data.story} onChange={(e) => set("story", e.target.value)} required />
          </Field>
          <ImageUploadField label="Cover Image" value={data.coverImage} onChange={(url) => set("coverImage", url)} />
        </div>
      </section>

      <section className="rounded-lg border border-neutral-200 bg-white p-6">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-neutral-900">Gallery</h2>
          <button type="button" onClick={addGalleryItem} className="inline-flex items-center gap-1 text-xs font-medium text-neutral-700 hover:text-neutral-900">
            <Plus className="h-3.5 w-3.5" /> Add Image
          </button>
        </div>
        {data.gallery.length === 0 ? (
          <p className="text-sm text-neutral-400">No gallery images yet.</p>
        ) : (
          <div className="space-y-5">
            {data.gallery.map((item, i) => (
              <div key={i} className="flex gap-4 rounded-md border border-neutral-200 p-4">
                <GripVertical className="mt-2 h-4 w-4 shrink-0 text-neutral-300" />
                <div className="flex-1 space-y-3">
                  <ImageUploadField label={`Image ${i + 1}`} value={item.url} onChange={(url) => updateGallery(i, { url })} />
                  <div className="grid grid-cols-2 gap-3">
                    <Field label="Caption (optional)">
                      <input className={inputClass} value={item.caption} onChange={(e) => updateGallery(i, { caption: e.target.value })} />
                    </Field>
                    <Field label="Layout">
                      <select
                        className={inputClass}
                        value={item.layout}
                        onChange={(e) => updateGallery(i, { layout: e.target.value as GalleryItem["layout"] })}
                      >
                        <option value="full">Full width</option>
                        <option value="half">Half width</option>
                        <option value="large">Large (7/12)</option>
                        <option value="small">Small (5/12)</option>
                      </select>
                    </Field>
                  </div>
                </div>
                <button type="button" onClick={() => removeGalleryItem(i)} className="h-fit text-neutral-300 hover:text-red-600" aria-label="Remove image">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="rounded-lg border border-neutral-200 bg-white p-6">
        <h2 className="mb-5 text-sm font-semibold text-neutral-900">SEO</h2>
        <div className="space-y-5">
          <Field label="SEO Title">
            <input className={inputClass} value={data.seoTitle} onChange={(e) => set("seoTitle", e.target.value)} placeholder={data.title} />
          </Field>
          <Field label="SEO Description">
            <textarea className={inputClass} rows={2} value={data.seoDescription} onChange={(e) => set("seoDescription", e.target.value)} placeholder={data.shortDescription} />
          </Field>
        </div>
      </section>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <div className="flex items-center gap-3">
        <button
          type="submit"
          disabled={saving}
          className="inline-flex items-center gap-2 rounded-md bg-neutral-900 px-5 py-2.5 text-sm font-medium text-white hover:bg-neutral-800 disabled:opacity-60"
        >
          {saving && <Loader2 className="h-4 w-4 animate-spin" />}
          {projectId ? "Save Changes" : "Create Project"}
        </button>
        <button type="button" onClick={() => router.push("/admin/projects")} className="text-sm text-neutral-500 hover:text-neutral-900">
          Cancel
        </button>
      </div>
    </form>
  );
}
