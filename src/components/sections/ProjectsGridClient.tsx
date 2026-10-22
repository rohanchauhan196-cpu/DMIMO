"use client";

import { useMemo, useRef, useState } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import gsap from "gsap";
import ProjectCard from "@/components/ui/ProjectCard";
import { cn } from "@/lib/utils";

type Project = {
  id: string;
  slug: string;
  title: string;
  location: string;
  year: number;
  coverImage: string;
  category: { slug: string; name: string };
};

export default function ProjectsGridClient({
  projects,
  categories,
}: {
  projects: Project[];
  categories: { slug: string; name: string }[];
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const initial = searchParams.get("category") ?? "all";
  const [active, setActive] = useState(initial);
  const gridRef = useRef<HTMLDivElement>(null);

  const filtered = useMemo(
    () => (active === "all" ? projects : projects.filter((p) => p.category.slug === active)),
    [projects, active]
  );

  const handleFilter = (slug: string) => {
    if (slug === active) return;

    const params = new URLSearchParams(searchParams.toString());
    if (slug === "all") params.delete("category");
    else params.set("category", slug);
    const qs = params.toString();
    router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });

    const el = gridRef.current;
    if (!el) {
      setActive(slug);
      return;
    }
    const cards = el.querySelectorAll(".portfolio-card");
    gsap.to(cards, {
      opacity: 0,
      y: 16,
      scale: 0.97,
      duration: 0.35,
      ease: "power2.in",
      stagger: 0.02,
      onComplete: () => {
        setActive(slug);
        requestAnimationFrame(() => {
          const newCards = el.querySelectorAll(".portfolio-card");
          gsap.fromTo(
            newCards,
            { opacity: 0, y: 16, scale: 0.97 },
            { opacity: 1, y: 0, scale: 1, duration: 0.5, ease: "power3.out", stagger: 0.05 }
          );
        });
      },
    });
  };

  return (
    <div>
      <div className="mb-14 flex flex-wrap items-center gap-x-8 gap-y-3 border-b border-charcoal-3 pb-8">
        <button
          onClick={() => handleFilter("all")}
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
            onClick={() => handleFilter(c.slug)}
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

      <p className="mb-10 text-xs uppercase tracking-[0.2em] text-warm-grey">
        {filtered.length} {filtered.length === 1 ? "Project" : "Projects"}
      </p>

      <div ref={gridRef} className="grid grid-cols-1 gap-x-8 gap-y-16 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((project, i) => (
          <ProjectCard key={project.id} project={project} size="small" index={i} className="portfolio-card" />
        ))}
      </div>

      {filtered.length === 0 && (
        <p className="py-20 text-center text-warm-grey">No projects in this category yet.</p>
      )}
    </div>
  );
}
