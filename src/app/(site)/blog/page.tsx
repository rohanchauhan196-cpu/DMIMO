import type { Metadata } from "next";
import { Suspense } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import SectionLabel from "@/components/ui/SectionLabel";
import BlogCard from "@/components/ui/BlogCard";
import BlogFilterBar from "@/components/sections/BlogFilterBar";
import { getBlogs, getBlogCategories } from "@/lib/data";

export const metadata: Metadata = {
  title: "Journal",
  description: "Essays, project stories and studio notes from D Mimo Architects.",
};

type Props = { searchParams: Promise<{ category?: string; page?: string }> };

export default async function BlogPage({ searchParams }: Props) {
  const sp = await searchParams;
  const page = Number(sp.page ?? 1) || 1;
  const [{ items, totalPages }, categories] = await Promise.all([
    getBlogs({ category: sp.category, page }),
    getBlogCategories(),
  ]);

  const baseQuery = new URLSearchParams();
  if (sp.category) baseQuery.set("category", sp.category);

  const pageHref = (p: number) => {
    const params = new URLSearchParams(baseQuery);
    if (p > 1) params.set("page", String(p));
    const qs = params.toString();
    return qs ? `/blog?${qs}` : "/blog";
  };

  return (
    <div className="bg-ivory pb-28 pt-40 text-charcoal-1 md:pb-36 md:pt-48">
      <div className="mx-auto max-w-[1600px] px-6 md:px-10">
        <SectionLabel light className="mb-8">
          The Journal
        </SectionLabel>
        <h1 className="max-w-3xl font-display text-5xl font-light leading-[1.05] sm:text-6xl md:text-7xl">
          Essays, project stories <span className="italic text-gold">& studio notes.</span>
        </h1>
      </div>

      <div className="mx-auto mt-20 max-w-[1600px] px-6 md:px-10">
        <Suspense fallback={null}>
          <BlogFilterBar categories={categories} />
        </Suspense>

        {items.length === 0 ? (
          <p className="py-20 text-center text-charcoal-2/60">No articles in this category yet.</p>
        ) : (
          <div className="mt-14 grid grid-cols-1 gap-x-8 gap-y-16 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((blog) => (
              <BlogCard key={blog.slug} blog={blog} />
            ))}
          </div>
        )}

        {totalPages > 1 && (
          <div className="mt-20 flex items-center justify-center gap-6">
            <Link
              href={pageHref(Math.max(1, page - 1))}
              aria-disabled={page <= 1}
              className={`flex h-11 w-11 items-center justify-center border border-charcoal-1/20 text-charcoal-1 transition-colors hover:border-gold hover:text-gold ${page <= 1 ? "pointer-events-none opacity-30" : ""}`}
            >
              <ChevronLeft className="h-4 w-4" strokeWidth={1.5} />
            </Link>
            <span className="text-xs uppercase tracking-[0.2em] text-charcoal-2/60">
              Page {page} of {totalPages}
            </span>
            <Link
              href={pageHref(Math.min(totalPages, page + 1))}
              aria-disabled={page >= totalPages}
              className={`flex h-11 w-11 items-center justify-center border border-charcoal-1/20 text-charcoal-1 transition-colors hover:border-gold hover:text-gold ${page >= totalPages ? "pointer-events-none opacity-30" : ""}`}
            >
              <ChevronRight className="h-4 w-4" strokeWidth={1.5} />
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
