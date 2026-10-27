"use client";

import { useEffect, useState, useCallback } from "react";
import { Plus, Trash2, Loader2 } from "lucide-react";
import { slugify, formatApiError } from "@/lib/utils";

type Category = {
  id: string;
  name: string;
  slug: string;
  type: "PROJECT" | "BLOG";
  order: number;
  _count?: { projects: number; blogs: number };
};

const inputClass = "w-full rounded-md border border-neutral-300 px-3 py-2 text-sm focus:border-neutral-900 focus:outline-none";

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState("");
  const [type, setType] = useState<"PROJECT" | "BLOG">("PROJECT");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/admin/categories");
    const json = await res.json().catch(() => ({ error: `Server error (${res.status})` }));
    setCategories(json.data ?? []);
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const addCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    setSubmitting(true);
    setError("");
    const res = await fetch("/api/admin/categories", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, slug: slugify(name), type, order: categories.length }),
    });
    const json = await res.json();
    if (!res.ok) {
      setError(formatApiError(json, "Could not create category"));
    } else {
      setName("");
      await load();
    }
    setSubmitting(false);
  };

  const deleteCategory = async (id: string) => {
    if (!confirm("Delete this category? This cannot be undone.")) return;
    const res = await fetch(`/api/admin/categories/${id}`, { method: "DELETE" });
    const json = await res.json();
    if (!res.ok) {
      alert(json.error ?? "Could not delete category");
      return;
    }
    await load();
  };

  const projectCats = categories.filter((c) => c.type === "PROJECT");
  const blogCats = categories.filter((c) => c.type === "BLOG");

  return (
    <div>
      <h1 className="text-2xl font-semibold text-neutral-900">Categories</h1>
      <p className="mt-1 text-sm text-neutral-500">Manage project and blog categories used for filtering.</p>

      <form onSubmit={addCategory} className="mt-8 flex flex-wrap items-end gap-3 rounded-lg border border-neutral-200 bg-white p-5">
        <div className="min-w-[200px] flex-1">
          <label className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-neutral-500">Category Name</label>
          <input value={name} onChange={(e) => setName(e.target.value)} className={inputClass} placeholder="e.g. Landscape" />
        </div>
        <div>
          <label className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-neutral-500">Applies To</label>
          <select value={type} onChange={(e) => setType(e.target.value as "PROJECT" | "BLOG")} className={inputClass}>
            <option value="PROJECT">Projects</option>
            <option value="BLOG">Blog</option>
          </select>
        </div>
        <button
          type="submit"
          disabled={submitting}
          className="inline-flex items-center gap-2 rounded-md bg-neutral-900 px-4 py-2 text-sm font-medium text-white hover:bg-neutral-800 disabled:opacity-60"
        >
          {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
          Add Category
        </button>
      </form>
      {error && <p className="mt-2 text-sm text-red-600">{error}</p>}

      {loading ? (
        <p className="mt-10 text-sm text-neutral-400">Loading…</p>
      ) : (
        <div className="mt-10 grid grid-cols-1 gap-8 lg:grid-cols-2">
          {[{ title: "Project Categories", items: projectCats }, { title: "Blog Categories", items: blogCats }].map(
            (group) => (
              <div key={group.title} className="rounded-lg border border-neutral-200 bg-white">
                <div className="border-b border-neutral-200 px-5 py-4">
                  <h2 className="text-sm font-semibold text-neutral-900">{group.title}</h2>
                </div>
                {group.items.length === 0 ? (
                  <p className="px-5 py-6 text-sm text-neutral-400">No categories yet.</p>
                ) : (
                  <ul className="divide-y divide-neutral-100">
                    {group.items.map((c) => (
                      <li key={c.id} className="flex items-center justify-between px-5 py-3">
                        <div>
                          <p className="text-sm font-medium text-neutral-900">{c.name}</p>
                          <p className="text-xs text-neutral-400">
                            /{c.slug} · {(c._count?.projects ?? 0) + (c._count?.blogs ?? 0)} items
                          </p>
                        </div>
                        <button
                          onClick={() => deleteCategory(c.id)}
                          className="text-neutral-300 hover:text-red-600"
                          aria-label={`Delete ${c.name}`}
                        >
                          <Trash2 className="h-4 w-4" strokeWidth={1.75} />
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )
          )}
        </div>
      )}
    </div>
  );
}
