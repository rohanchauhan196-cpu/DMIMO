import SectionLabel from "@/components/ui/SectionLabel";
import ArrowLink from "@/components/ui/ArrowLink";
import ProjectCard from "@/components/ui/ProjectCard";
import { getProjects } from "@/lib/data";

export default async function FeaturedProjects() {
  const projects = await getProjects({ featured: true, limit: 3 });
  if (projects.length === 0) return null;

  const [first, second, third] = projects;

  return (
    <section className="bg-black py-28 md:py-36">
      <div className="mx-auto max-w-[1600px] px-6 md:px-10">
        <div className="mb-16 flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
          <div>
            <SectionLabel className="mb-6">Selected Work</SectionLabel>
            <h2 className="font-display text-4xl font-light leading-tight text-ivory sm:text-5xl md:text-6xl">
              Featured <span className="italic text-gold">Projects.</span>
            </h2>
          </div>
          <ArrowLink href="/projects">View All Projects</ArrowLink>
        </div>

        <div className="grid grid-cols-1 gap-x-8 gap-y-16 md:grid-cols-12">
          {first && <ProjectCard project={first} size="large" index={0} className="md:col-span-7" />}
          <div className="flex flex-col gap-16 md:col-span-5 md:pt-16">
            {second && <ProjectCard project={second} size="medium" index={1} />}
          </div>
          {third && (
            <ProjectCard
              project={third}
              size="large"
              index={2}
              className="md:col-span-7 md:col-start-6 md:-mt-12"
            />
          )}
        </div>
      </div>
    </section>
  );
}
