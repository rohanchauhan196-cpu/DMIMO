"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import ImageUploadField from "@/components/admin/ImageUploadField";
import TiptapEditor from "@/components/admin/TiptapEditor";
import { slugify, formatApiError } from "@/lib/utils";

type BlogFormData = {
  title: string;
  slug: string;
  categoryId: string;
  author: string;
  featuredImage: string;
  excerpt: string;
  content: string;
  published: boolean;
  publishedAt: string;
  seoTitle: string;
  seoDescription: string;
};

const EMPTY: BlogFormData = {
  title: "",
  slug: "",
  categoryId: "",
  author: "D Mimo Architects",
  featuredImage: "",
  excerpt: "",
  content: "<p></p>",
  published: true,
  publishedAt: new Date().toISOString().slice(0, 10),
  seoTitle: "",
  seoDescription: "",
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

export default function BlogForm({
  categories,
  initial,
  blogId,
}: {
  categories: { id: string; name: string }[];
  initial?: Partial<BlogFormData>;
  blogId?: string;
}) {
  const router = useRouter();
  const [data, setData] = useState<BlogFormData>({ ...EMPTY, ...initial, categoryId: initial?.categoryId || categories[0]?.id || "" });
  const [slugEdited, setSlugEdited] = useState(Boolean(initial?.slug));
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const set = <K extends keyof BlogFormData>(key: K, value: BlogFormData[K]) => setData((d) => ({ ...d, [key]: value }));

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");

    const payload = { ...data, publishedAt: new Date(data.publishedAt).toISOString() };
    const url = blogId ? `/api/admin/blogs/${blogId}` : "/api/admin/blogs";
    const method = blogId ? "PUT" : "POST";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const json = await res.json().catch(() => ({ error: `Server error (${res.status})` }));

    if (!res.ok) {
      setError(formatApiError(json, "Could not save blog post"));
      setSaving(false);
      return;
    }

    router.push("/admin/blogs");
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
          <Field label="Author">
            <input className={inputClass} value={data.author} onChange={(e) => set("author", e.target.value)} />
          </Field>
          <Field label="Published Date">
            <input type="date" className={inputClass} value={data.publishedAt} onChange={(e) => set("publishedAt", e.target.value)} />
          </Field>
        </div>
        <label className="mt-5 flex items-center gap-2 text-sm text-neutral-700">
          <input type="checkbox" checked={data.published} onChange={(e) => set("published", e.target.checked)} />
          Published
        </label>
      </section>

      <section className="rounded-lg border border-neutral-200 bg-white p-6">
        <h2 className="mb-5 text-sm font-semibold text-neutral-900">Content</h2>
        <div className="space-y-5">
          <ImageUploadField label="Featured Image" value={data.featuredImage} onChange={(url) => set("featuredImage", url)} />
          <Field label="Excerpt">
            <textarea className={inputClass} rows={2} value={data.excerpt} onChange={(e) => set("excerpt", e.target.value)} required />
          </Field>
          <Field label="Article Content">
            <TiptapEditor value={data.content} onChange={(html) => set("content", html)} />
          </Field>
        </div>
      </section>

      <section className="rounded-lg border border-neutral-200 bg-white p-6">
        <h2 className="mb-5 text-sm font-semibold text-neutral-900">SEO</h2>
        <div className="space-y-5">
          <Field label="SEO Title">
            <input className={inputClass} value={data.seoTitle} onChange={(e) => set("seoTitle", e.target.value)} placeholder={data.title} />
          </Field>
          <Field label="SEO Description">
            <textarea className={inputClass} rows={2} value={data.seoDescription} onChange={(e) => set("seoDescription", e.target.value)} placeholder={data.excerpt} />
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
          {blogId ? "Save Changes" : "Publish Post"}
        </button>
        <button type="button" onClick={() => router.push("/admin/blogs")} className="text-sm text-neutral-500 hover:text-neutral-900">
          Cancel
        </button>
      </div>
    </form>
  );
}
