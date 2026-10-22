import SectionLabel from "@/components/ui/SectionLabel";
import PortfolioPreview from "@/components/sections/PortfolioPreview";
import { getProjects, getProjectCategories } from "@/lib/data";

export default async function PortfolioPreviewSection() {
  const [projects, categories] = await Promise.all([
    getProjects({ limit: 9 }),
    getProjectCategories(),
  ]);
  if (projects.length === 0) return null;

  return (
    <section className="bg-charcoal-1 py-28 md:py-36">
      <div className="mx-auto max-w-[1600px] px-6 md:px-10">
        <SectionLabel className="mb-6">The Portfolio</SectionLabel>
        <h2 className="mb-16 font-display text-4xl font-light leading-tight text-ivory sm:text-5xl md:text-6xl">
          Work Across <span className="italic text-gold">Disciplines.</span>
        </h2>

        <PortfolioPreview projects={projects} categories={categories} />
      </div>
    </section>
  );
}
