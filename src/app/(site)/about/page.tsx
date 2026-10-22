import type { Metadata } from "next";
import Image from "next/image";
import RevealImage from "@/components/ui/RevealImage";
import RevealText, { RevealLine } from "@/components/ui/RevealText";
import SectionLabel from "@/components/ui/SectionLabel";
import GoldButton from "@/components/ui/GoldButton";
import { imagePool } from "@/lib/images";
import { getSiteSettings } from "@/lib/data";

export const metadata: Metadata = {
  title: "About",
  description:
    "D Mimo Architects is an architecture and interior design consultancy dedicated to creating thoughtful, functional, and aesthetically refined spaces.",
};

// Placeholder leadership — replace with real studio bios.
const TEAM = [
  { name: "Arjun Mehra", role: "Founding Principal", image: imagePool.aboutPortrait },
  { name: "Nadia Qureshi", role: "Design Director", image: imagePool.services.interiorDesign },
  { name: "Leo D'Souza", role: "Director, Planning", image: imagePool.services.urbanPlanning },
  { name: "Priya Varkey", role: "Director, Interiors", image: imagePool.services.residential },
];

const WHY_US = [
  {
    number: "01",
    title: "Client-Centric Approach",
    desc: "Every project begins with understanding your needs, vision, lifestyle, and objectives.",
  },
  {
    number: "02",
    title: "Design Excellence",
    desc: "A thoughtful balance of aesthetics, functionality, and practicality.",
  },
  {
    number: "03",
    title: "Integrated Consultancy",
    desc: "Architectural design, interiors, visualization, and coordination under a unified design approach.",
  },
  {
    number: "04",
    title: "Attention to Detail",
    desc: "Careful consideration of space, materials, lighting, proportions, and usability.",
  },
  {
    number: "05",
    title: "Visualization Before Execution",
    desc: "Realistic 3D views and walkthroughs to help communicate design intent.",
  },
  {
    number: "06",
    title: "Project-Specific Solutions",
    desc: "Tailored design strategies based on the project's requirements, site, and budget.",
  },
];

export default async function AboutPage() {
  const settings = await getSiteSettings();
  const stats = [
    { value: settings.statProjects, label: "Projects Delivered" },
    { value: settings.statYears, label: "Years of Practice" },
    { value: settings.statCities, label: "Cities" },
    { value: settings.statAwards, label: "Design Awards" },
  ];

  return (
    <div className="bg-black">
      {/* Hero */}
      <section className="relative flex h-[70vh] min-h-[460px] items-end overflow-hidden">
        <Image src={imagePool.aboutStudio} alt="D Mimo Architects studio" fill priority sizes="100vw" className="object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-black/40" />
        <div className="relative z-10 mx-auto w-full max-w-[1600px] px-6 pb-16 md:px-10">
          <SectionLabel className="mb-6">About D Mimo Architects</SectionLabel>
          <h1 className="max-w-3xl font-display text-5xl font-light leading-[1.05] text-ivory sm:text-6xl md:text-7xl">
            Design that goes <span className="italic text-gold">beyond appearance.</span>
          </h1>
        </div>
      </section>

      {/* Intro */}
      <section className="bg-black py-24 md:py-32">
        <div className="mx-auto grid max-w-[1600px] grid-cols-1 gap-12 px-6 md:px-10 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <SectionLabel className="mb-4">Who We Are</SectionLabel>
          </div>
          <div className="space-y-6 text-lg leading-relaxed text-warm-grey lg:col-span-7 lg:col-start-6">
            <p>
              D Mimo Architects is an architecture and interior design
              consultancy dedicated to creating thoughtful, functional, and
              aesthetically refined spaces. We believe that great design goes
              beyond appearance — it is about understanding people, their
              aspirations, and the way they experience the spaces around
              them.
            </p>
            <p>
              Our approach combines creative design thinking, technical
              expertise, practical planning, and attention to detail to
              deliver solutions that balance aesthetics, functionality,
              sustainability, and efficiency.
            </p>
            <p>
              We provide comprehensive consultancy services across
              residential, commercial, institutional, healthcare, retail,
              and mixed-use developments. From architectural planning and
              interior design to 3D visualization, walkthroughs, and
              construction coordination, we help clients transform their
              ideas into well-planned and thoughtfully designed spaces.
            </p>
            <p>
              At D Mimo Architects, every project is an opportunity to
              create something meaningful — spaces that reflect
              individuality, respond to their context, and stand the test
              of time.
            </p>
          </div>
        </div>
      </section>

      {/* Vision & Mission */}
      <section className="bg-ivory py-24 text-charcoal-1 md:py-32">
        <div className="mx-auto max-w-[1600px] px-6 md:px-10">
          <div className="grid grid-cols-1 gap-16 lg:grid-cols-2 lg:gap-24">
            <div className="border-t border-charcoal-1/15 pt-8">
              <SectionLabel light className="mb-6">
                Our Vision
              </SectionLabel>
              <p className="font-display text-3xl font-light leading-[1.25] sm:text-4xl">
                To create inspiring, purposeful, and{" "}
                <span className="italic text-gold">enduring spaces</span>{" "}
                through innovative design and thoughtful architecture.
              </p>
            </div>
            <div className="border-t border-charcoal-1/15 pt-8">
              <SectionLabel light className="mb-6">
                Our Mission
              </SectionLabel>
              <p className="font-display text-3xl font-light leading-[1.25] sm:text-4xl">
                To deliver client-focused design solutions that bring
                together <span className="italic text-gold">creativity, practicality,</span>{" "}
                quality, and attention to detail at every stage of a project.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Why choose us */}
      <section className="bg-black py-24 md:py-32">
        <div className="mx-auto max-w-[1600px] px-6 md:px-10">
          <RevealText as="h2" className="max-w-2xl font-display text-4xl font-light leading-[1.1] text-ivory sm:text-5xl">
            <RevealLine>Why choose</RevealLine>
            <RevealLine>
              <span className="italic text-gold">D Mimo Architects?</span>
            </RevealLine>
          </RevealText>

          <div className="mt-16 grid grid-cols-1 gap-x-10 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
            {WHY_US.map((p) => (
              <div key={p.number} className="border-t border-ivory/15 pt-6">
                <span className="font-display text-3xl text-gold">{p.number}</span>
                <h3 className="mt-4 font-display text-2xl text-ivory">{p.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-warm-grey">{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Approach with image */}
      <section className="bg-ivory py-24 text-charcoal-1 md:py-32">
        <div className="mx-auto grid max-w-[1600px] grid-cols-1 gap-16 px-6 md:px-10 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <RevealImage
              src={imagePool.aboutPrinciple}
              alt="D Mimo Architects material and model studies"
              fill
              sizes="(max-width: 1024px) 100vw, 40vw"
              containerClassName="aspect-[4/5] w-full"
              parallax
            />
          </div>
          <div className="lg:col-span-6 lg:col-start-7 lg:pt-10">
            <SectionLabel light className="mb-6">
              Scope of Work
            </SectionLabel>
            <h2 className="font-display text-4xl font-light leading-tight sm:text-5xl">
              Consultancy across every <span className="italic text-gold">project type.</span>
            </h2>
            <p className="mt-6 text-base leading-relaxed text-charcoal-2/80 md:text-lg">
              We provide comprehensive consultancy services across
              residential, commercial, institutional, healthcare, retail,
              and mixed-use developments — carrying each project from
              architectural planning through to construction coordination.
            </p>
            <ul className="mt-8 space-y-3">
              {["Architectural Planning", "Interior Design", "3D Visualization & Walkthroughs", "Construction Coordination"].map((c) => (
                <li key={c} className="flex items-center gap-3 border-b border-charcoal-1/10 pb-3 text-charcoal-1">
                  <span className="h-1 w-1 rounded-full bg-gold" />
                  {c}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="border-y border-charcoal-3 bg-charcoal-1 py-20">
        <div className="mx-auto grid max-w-[1600px] grid-cols-2 gap-10 px-6 sm:grid-cols-4 md:px-10">
          {stats.map((s) => (
            <div key={s.label} className="text-center">
              <p className="font-display text-5xl text-gold md:text-6xl">{s.value}</p>
              <p className="mt-3 text-xs uppercase tracking-[0.2em] text-warm-grey">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Team */}
      <section className="bg-black py-24 md:py-32">
        <div className="mx-auto max-w-[1600px] px-6 md:px-10">
          <SectionLabel className="mb-6">Studio Leadership</SectionLabel>
          <h2 className="max-w-xl font-display text-4xl font-light leading-tight text-ivory sm:text-5xl">
            The people behind <span className="italic text-gold">the practice.</span>
          </h2>

          <div className="mt-16 grid grid-cols-1 gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-4">
            {TEAM.map((member) => (
              <div key={member.name}>
                <div className="relative aspect-[4/5] overflow-hidden bg-charcoal-2 grayscale transition-all duration-500 hover:grayscale-0">
                  <Image src={member.image} alt={member.name} fill sizes="25vw" className="object-cover" />
                </div>
                <h3 className="mt-5 font-display text-xl text-ivory">{member.name}</h3>
                <p className="mt-1 text-xs uppercase tracking-[0.15em] text-gold">{member.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-charcoal-3 bg-ivory py-24 text-center text-charcoal-1 md:py-32">
        <div className="mx-auto max-w-2xl px-6 md:px-10">
          <h2 className="font-display text-4xl font-light sm:text-5xl">Work with us.</h2>
          <p className="mt-6 text-base leading-relaxed text-charcoal-2/70">
            We take on a limited number of new projects each year. Reach out
            to discuss yours.
          </p>
          <div className="mt-10 flex justify-center">
            <GoldButton href="/contact" tone="dark">
              Start a Project
            </GoldButton>
          </div>
        </div>
      </section>
    </div>
  );
}
