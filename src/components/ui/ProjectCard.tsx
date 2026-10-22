import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";

type Project = {
  slug: string;
  title: string;
  location: string;
  year: number;
  coverImage: string;
  category: { name: string };
};

export default function ProjectCard({
  project,
  size = "medium",
  index,
  className,
}: {
  project: Project;
  size?: "large" | "medium" | "small";
  index?: number;
  className?: string;
}) {
  const aspect = {
    large: "aspect-[4/5] md:aspect-[16/11]",
    medium: "aspect-[4/5]",
    small: "aspect-[3/4]",
  }[size];

  return (
    <Link href={`/projects/${project.slug}`} className={cn("group block", className)}>
      <div className={cn("relative overflow-hidden bg-charcoal-2", aspect)}>
        <Image
          src={project.coverImage}
          alt={project.title}
          fill
          sizes="(max-width: 768px) 100vw, 50vw"
          className="object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-black/0 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
        {typeof index === "number" && (
          <span className="absolute left-5 top-5 font-display text-sm text-ivory/70">
            {String(index + 1).padStart(2, "0")}
          </span>
        )}
        <span className="absolute bottom-5 right-5 flex h-10 w-10 translate-y-2 items-center justify-center rounded-full border border-ivory/40 bg-black/30 text-ivory opacity-0 backdrop-blur-sm transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
          <ArrowUpRight className="h-4 w-4" strokeWidth={1.5} />
        </span>
      </div>

      <div className="mt-5 flex items-start justify-between gap-4 border-t border-charcoal-3 pt-4">
        <div>
          <h3 className="font-display text-xl text-ivory transition-colors duration-300 group-hover:text-gold sm:text-2xl">
            {project.title}
          </h3>
          <p className="mt-1 text-sm text-warm-grey">{project.location}</p>
        </div>
        <div className="shrink-0 text-right text-xs uppercase tracking-[0.2em] text-warm-grey">
          <p>{project.category.name}</p>
          <p className="mt-1 text-gold">{project.year}</p>
        </div>
      </div>
    </Link>
  );
}
