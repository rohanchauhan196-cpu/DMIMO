import type { Metadata } from "next";
import { Suspense } from "react";
import SectionLabel from "@/components/ui/SectionLabel";
import ProjectsGridClient from "@/components/sections/ProjectsGridClient";
import { getProjects, getProjectCategories } from "@/lib/data";

export const metadata: Metadata = {
  title: "Projects",
  description: "Selected work in architecture, interiors and design by D Mimo Architects.",
};

export default async function ProjectsPage() {
  const [projects, categories] = await Promise.all([getProjects(), getProjectCategories()]);

  return (
    <div className="bg-black pb-28 pt-40 md:pb-36 md:pt-48">
      <div className="mx-auto max-w-[1600px] px-6 md:px-10">
        <SectionLabel className="mb-8">Our Portfolio</SectionLabel>
        <h1 className="max-w-3xl font-display text-5xl font-light leading-[1.05] text-ivory sm:text-6xl md:text-7xl">
          Selected work in architecture, <span className="italic text-gold">interiors</span> and design.
        </h1>
        <p className="mt-8 max-w-xl text-base leading-relaxed text-warm-grey md:text-lg">
          A cross-section of completed, ongoing and conceptual projects
          across residential, commercial and hospitality architecture.
        </p>
      </div>

      <div className="mx-auto mt-20 max-w-[1600px] px-6 md:px-10">
        <Suspense fallback={null}>
          <ProjectsGridClient projects={projects} categories={categories} />
        </Suspense>
      </div>
    </div>
  );
}
