import SectionLabel from "@/components/ui/SectionLabel";
import ArrowLink from "@/components/ui/ArrowLink";
import ServicesInteractive from "@/components/sections/ServicesInteractive";
import { getServices } from "@/lib/data";

export default async function ServicesSection() {
  const services = await getServices();
  if (services.length === 0) return null;

  return (
    <section className="bg-black py-28 md:py-36">
      <div className="mx-auto max-w-[1600px] px-6 md:px-10">
        <div className="mb-16 flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
          <div>
            <SectionLabel className="mb-6">What We Do</SectionLabel>
            <h2 className="font-display text-4xl font-light leading-tight text-ivory sm:text-5xl md:text-6xl">
              Our <span className="italic text-gold">Services.</span>
            </h2>
          </div>
          <ArrowLink href="/services">All Services</ArrowLink>
        </div>

        <ServicesInteractive services={services} />
      </div>
    </section>
  );
}
