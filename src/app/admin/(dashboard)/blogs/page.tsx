"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { Plus, Pencil, Trash2, Eye, EyeOff } from "lucide-react";
import { formatDate } from "@/lib/utils";

type Blog = {
  id: string;
  title: string;
  featuredImage: string;
  published: boolean;
  publishedAt: string;
  category: { name: string };
};

export default function AdminBlogsPage() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/admin/blogs");
    if (res.ok) {
      const json = await res.json();
      setBlogs(json.data ?? []);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const remove = async (id: string, title: string) => {
    if (!confirm(`Delete "${title}"? This cannot be undone.`)) return;
    await fetch(`/api/admin/blogs/${id}`, { method: "DELETE" });
    setBlogs((prev) => prev.filter((b) => b.id !== id));
  };

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-neutral-900">Blog Posts</h1>
          <p className="mt-1 text-sm text-neutral-500">{blogs.length} total</p>
        </div>
        <Link
          href="/admin/blogs/new"
          className="inline-flex items-center gap-2 rounded-md bg-neutral-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-neutral-800"
        >
          <Plus className="h-4 w-4" /> New Post
        </Link>
      </div>

      <div className="mt-8 overflow-hidden rounded-lg border border-neutral-200 bg-white">
        {loading ? (
          <p className="px-6 py-8 text-sm text-neutral-400">Loading…</p>
        ) : blogs.length === 0 ? (
          <p className="px-6 py-8 text-sm text-neutral-400">No blog posts yet.</p>
        ) : (
          <table className="w-full text-left text-sm">
            <thead className="border-b border-neutral-200 text-xs uppercase tracking-wide text-neutral-400">
              <tr>
                <th className="px-6 py-3 font-medium">Post</th>
                <th className="px-6 py-3 font-medium">Category</th>
                <th className="px-6 py-3 font-medium">Date</th>
                <th className="px-6 py-3 font-medium">Status</th>
                <th className="px-6 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {blogs.map((b) => (
                <tr key={b.id} className="hover:bg-neutral-50">
                  <td className="px-6 py-3">
                    <div className="flex items-center gap-3">
                      <div className="relative h-12 w-16 shrink-0 overflow-hidden rounded bg-neutral-100">
                        <Image src={b.featuredImage} alt={b.title} fill sizes="64px" className="object-cover" />
                      </div>
                      <p className="font-medium text-neutral-900">{b.title}</p>
                    </div>
                  </td>
                  <td className="px-6 py-3 text-neutral-600">{b.category.name}</td>
                  <td className="px-6 py-3 text-neutral-600">{formatDate(b.publishedAt)}</td>
                  <td className="px-6 py-3">
                    {b.published ? (
                      <span className="inline-flex items-center gap-1 text-xs text-green-700">
                        <Eye className="h-3.5 w-3.5" /> Published
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-xs text-neutral-400">
                        <EyeOff className="h-3.5 w-3.5" /> Draft
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-3">
                    <div className="flex items-center justify-end gap-3">
                      <Link href={`/admin/blogs/${b.id}`} className="text-neutral-400 hover:text-neutral-900" aria-label="Edit">
                        <Pencil className="h-4 w-4" strokeWidth={1.75} />
                      </Link>
                      <button onClick={() => remove(b.id, b.title)} className="text-neutral-300 hover:text-red-600" aria-label="Delete">
                        <Trash2 className="h-4 w-4" strokeWidth={1.75} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
