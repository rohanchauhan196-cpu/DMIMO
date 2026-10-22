import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import SectionLabel from "@/components/ui/SectionLabel";
import ProjectGallery from "@/components/sections/ProjectGallery";
import { getProjectBySlug, getAdjacentProjects, getProjects } from "@/lib/data";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  const projects = await getProjects();
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);
  if (!project) return {};
  return {
    title: project.seoTitle ?? `${project.title} — ${project.location}`,
    description: project.seoDescription ?? project.shortDescription,
    openGraph: {
      title: project.seoTitle ?? project.title,
      description: project.seoDescription ?? project.shortDescription,
      images: [{ url: project.coverImage }],
      type: "article",
    },
  };
}

const INFO_LABEL = "text-xs uppercase tracking-[0.2em] text-warm-grey";
const INFO_VALUE = "mt-2 font-display text-xl text-ivory sm:text-2xl";

export default async function ProjectDetailPage({ params }: Props) {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);
  if (!project) notFound();

  const { prev, next } = await getAdjacentProjects(project.order);

  const statusLabel = { COMPLETED: "Completed", ONGOING: "Under Construction", CONCEPT: "Concept" }[
    project.status
  ];

  return (
    <div className="bg-black">
      {/* Hero */}
      <section className="relative flex h-[75vh] min-h-[480px] w-full items-end overflow-hidden">
        <Image
          src={project.coverImage}
          alt={project.title}
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-black/40" />
        <div className="relative z-10 mx-auto w-full max-w-[1600px] px-6 pb-14 md:px-10">
          <SectionLabel className="mb-6">
            {project.category.name} — {statusLabel}
          </SectionLabel>
          <h1 className="font-display text-5xl font-light leading-[1.02] text-ivory sm:text-6xl md:text-7xl lg:text-8xl">
            {project.title}
          </h1>
          <p className="mt-4 text-base uppercase tracking-[0.2em] text-champagne md:text-lg">
            {project.location} — {project.year}
          </p>
        </div>
      </section>

      {/* Info bar */}
      <section className="border-b border-charcoal-3 bg-black py-14">
        <div className="mx-auto grid max-w-[1600px] grid-cols-2 gap-10 px-6 sm:grid-cols-3 md:px-10 lg:grid-cols-6">
          <div>
            <p className={INFO_LABEL}>Location</p>
            <p className={INFO_VALUE}>{project.location}</p>
          </div>
          {project.area && (
            <div>
              <p className={INFO_LABEL}>Area</p>
              <p className={INFO_VALUE}>{project.area}</p>
            </div>
          )}
          <div>
            <p className={INFO_LABEL}>Category</p>
            <p className={INFO_VALUE}>{project.category.name}</p>
          </div>
          <div>
            <p className={INFO_LABEL}>Year</p>
            <p className={INFO_VALUE}>{project.year}</p>
          </div>
          {project.client && (
            <div>
              <p className={INFO_LABEL}>Client</p>
              <p className={INFO_VALUE}>{project.client}</p>
            </div>
          )}
          <div>
            <p className={INFO_LABEL}>Status</p>
            <p className={INFO_VALUE}>{statusLabel}</p>
          </div>
        </div>
      </section>

      {/* Story */}
      <section className="bg-black py-24 md:py-32">
        <div className="mx-auto grid max-w-[1600px] grid-cols-1 gap-12 px-6 md:px-10 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <SectionLabel className="mb-4">The Project</SectionLabel>
            <h2 className="font-display text-4xl font-light text-ivory">Story</h2>
          </div>
          <div className="space-y-6 text-lg leading-relaxed text-warm-grey lg:col-span-7 lg:col-start-6">
            {project.story.split("\n\n").map((para, i) => (
              <p key={i}>{para}</p>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery */}
      {project.gallery.length > 0 && (
        <section className="bg-black pb-24 md:pb-32">
          <div className="mx-auto max-w-[1600px] px-6 md:px-10">
            <ProjectGallery images={project.gallery} projectTitle={project.title} />
          </div>
        </section>
      )}

      {/* Prev / Next */}
      <section className="border-t border-charcoal-3 bg-black">
        <div className="mx-auto grid max-w-[1600px] grid-cols-1 sm:grid-cols-2">
          {prev ? (
            <Link
              href={`/projects/${prev.slug}`}
              className="group flex items-center gap-4 border-r border-charcoal-3 px-6 py-14 md:px-10"
            >
              <ArrowLeft className="h-5 w-5 shrink-0 text-gold transition-transform duration-300 group-hover:-translate-x-1" strokeWidth={1.5} />
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-warm-grey">Previous Project</p>
                <p className="mt-2 font-display text-2xl text-ivory transition-colors group-hover:text-gold">{prev.title}</p>
              </div>
            </Link>
          ) : (
            <div className="hidden sm:block" />
          )}
          {next ? (
            <Link
              href={`/projects/${next.slug}`}
              className="group flex items-center justify-end gap-4 px-6 py-14 text-right md:px-10"
            >
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-warm-grey">Next Project</p>
                <p className="mt-2 font-display text-2xl text-ivory transition-colors group-hover:text-gold">{next.title}</p>
              </div>
              <ArrowRight className="h-5 w-5 shrink-0 text-gold transition-transform duration-300 group-hover:translate-x-1" strokeWidth={1.5} />
            </Link>
          ) : (
            <div className="hidden sm:block" />
          )}
        </div>
      </section>
    </div>
  );
}
