import type { Metadata } from "next";
import Link from "next/link";
import RevealImage from "@/components/ui/RevealImage";
import RevealText, { RevealLine } from "@/components/ui/RevealText";
import SectionLabel from "@/components/ui/SectionLabel";
import ArrowLink from "@/components/ui/ArrowLink";
import { getServices, getProjectCategories } from "@/lib/data";

export const metadata: Metadata = {
  title: "Services",
  description:
    "Architecture, interior design, residential and commercial design, hospitality, urban planning, renovation and project consultancy services from D Mimo Architects.",
};

export default async function ServicesPage() {
  const [services, categories] = await Promise.all([getServices(), getProjectCategories()]);
  const categorySlugs = new Set(categories.map((c) => c.slug));

  return (
    <div className="bg-black pb-10 pt-40 md:pt-48">
      <div className="mx-auto max-w-[1600px] px-6 md:px-10">
        <SectionLabel className="mb-8">What We Do</SectionLabel>
        <h1 className="max-w-3xl font-display text-5xl font-light leading-[1.05] text-ivory sm:text-6xl md:text-7xl">
          Full-service design, from <span className="italic text-gold">concept</span> to completion.
        </h1>
        <p className="mt-8 max-w-xl text-base leading-relaxed text-warm-grey md:text-lg">
          Eight disciplines, one integrated studio. We scale our involvement
          to the project — from a single consultancy engagement to full
          architectural delivery.
        </p>
      </div>

      <div className="mt-24 md:mt-32">
        {services.map((service, i) => {
          const matchesCategory = categorySlugs.has(service.slug);
          const reversed = i % 2 === 1;

          return (
            <section
              key={service.id}
              id={service.slug}
              className="scroll-mt-28 border-t border-charcoal-3 py-20 md:py-28"
            >
              <div className="mx-auto max-w-[1600px] px-6 md:px-10">
                <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-16">
                  <div className={`lg:col-span-5 ${reversed ? "lg:order-2" : ""}`}>
                    <RevealImage
                      src={service.image}
                      alt={service.title}
                      fill
                      sizes="(max-width: 1024px) 100vw, 40vw"
                      containerClassName="aspect-[4/5] w-full"
                    />
                  </div>

                  <div className={`lg:col-span-7 ${reversed ? "lg:order-1" : ""}`}>
                    <span className="font-display text-2xl text-gold">{service.number}</span>
                    <RevealText as="h2" className="mt-3 font-display text-4xl font-light text-ivory sm:text-5xl">
                      <RevealLine>{service.title}</RevealLine>
                    </RevealText>
                    <p className="mt-6 max-w-xl text-base leading-relaxed text-warm-grey md:text-lg">
                      {service.description}
                    </p>

                    {service.capabilities.length > 0 && (
                      <ul className="mt-8 grid grid-cols-1 gap-x-8 gap-y-3 sm:grid-cols-2">
                        {service.capabilities.map((cap) => (
                          <li key={cap} className="flex items-center gap-3 text-sm text-ivory/80">
                            <span className="h-1 w-1 shrink-0 rounded-full bg-gold" />
                            {cap}
                          </li>
                        ))}
                      </ul>
                    )}

                    <div className="mt-10 flex flex-wrap gap-8">
                      {matchesCategory && (
                        <ArrowLink href={`/projects?category=${service.slug}`}>Related Projects</ArrowLink>
                      )}
                      <ArrowLink href="/contact">Enquire About This Service</ArrowLink>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          );
        })}
      </div>

      <section className="border-t border-charcoal-3 bg-charcoal-1 py-24 text-center md:py-32">
        <div className="mx-auto max-w-2xl px-6 md:px-10">
          <h2 className="font-display text-4xl font-light text-ivory sm:text-5xl">
            Have a brief in mind?
          </h2>
          <p className="mt-6 text-base leading-relaxed text-warm-grey">
            Tell us about your project and the discipline you need — we&apos;ll
            get back to you within two working days.
          </p>
          <Link
            href="/contact"
            className="mt-10 inline-block border border-gold/60 px-8 py-4 text-xs font-medium uppercase tracking-[0.25em] text-ivory transition-colors hover:bg-gold hover:text-charcoal-1"
          >
            Start a Project
          </Link>
        </div>
      </section>
    </div>
  );
}
