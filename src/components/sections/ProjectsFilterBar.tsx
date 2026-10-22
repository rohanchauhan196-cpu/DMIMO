"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

export default function ProjectsFilterBar({
  categories,
}: {
  categories: { slug: string; name: string }[];
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const active = searchParams.get("category") ?? "all";

  const setCategory = (slug: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (slug === "all") {
      params.delete("category");
    } else {
      params.set("category", slug);
    }
    const qs = params.toString();
    router.push(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
  };

  return (
    <div className="flex flex-wrap items-center gap-x-8 gap-y-3 border-b border-charcoal-3 pb-8">
      <button
        onClick={() => setCategory("all")}
        className={cn(
          "relative pb-1 text-xs font-medium uppercase tracking-[0.2em] transition-colors",
          active === "all" ? "text-gold" : "text-warm-grey hover:text-ivory"
        )}
      >
        All
        {active === "all" && <span className="absolute -bottom-[1px] left-0 h-px w-full bg-gold" />}
      </button>
      {categories.map((c) => (
        <button
          key={c.slug}
          onClick={() => setCategory(c.slug)}
          className={cn(
            "relative pb-1 text-xs font-medium uppercase tracking-[0.2em] transition-colors",
            active === c.slug ? "text-gold" : "text-warm-grey hover:text-ivory"
          )}
        >
          {c.name}
          {active === c.slug && <span className="absolute -bottom-[1px] left-0 h-px w-full bg-gold" />}
        </button>
      ))}
    </div>
  );
}
