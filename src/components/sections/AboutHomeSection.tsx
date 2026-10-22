import RevealText, { RevealLine } from "@/components/ui/RevealText";
import RevealImage from "@/components/ui/RevealImage";
import SectionLabel from "@/components/ui/SectionLabel";
import ArrowLink from "@/components/ui/ArrowLink";
import { getSiteSettings } from "@/lib/data";
import { imagePool } from "@/lib/images";

const DISCIPLINES = ["Architecture", "Interior Design", "Planning", "Urban Design", "Project Management"];

export default async function AboutHomeSection() {
  const settings = await getSiteSettings();

  const stats = [
    { value: settings.statProjects, label: "Projects Delivered" },
    { value: settings.statYears, label: "Years of Practice" },
    { value: settings.statCities, label: "Cities" },
    { value: settings.statAwards, label: "Design Awards" },
  ];

  return (
    <section className="bg-ivory py-28 text-charcoal-1 md:py-36">
      <div className="mx-auto max-w-[1600px] px-6 md:px-10">
        <div className="grid grid-cols-1 gap-16 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <SectionLabel light className="mb-8">
              About the Studio
            </SectionLabel>
            <RevealText
              as="h2"
              className="font-display text-4xl font-light leading-[1.05] sm:text-5xl md:text-6xl lg:text-[4.4vw]"
            >
              <RevealLine>DESIGNING WITH</RevealLine>
              <RevealLine>
                <span className="italic text-gold">PURPOSE.</span>
              </RevealLine>
            </RevealText>

            <p className="mt-8 max-w-xl text-base leading-relaxed text-charcoal-2/80 md:text-lg">
              D Mimo Architects is an independent studio practising across
              architecture, interiors and master planning. We work on a
              deliberately small number of projects at any time, so that
              every one of them receives the attention of our full design
              team, end to end.
            </p>

            <ul className="mt-10 grid grid-cols-2 gap-x-6 gap-y-3 sm:flex sm:flex-wrap sm:gap-x-8">
              {DISCIPLINES.map((d) => (
                <li key={d} className="flex items-center gap-2 text-sm uppercase tracking-[0.15em] text-charcoal-2/70">
                  <span className="h-1 w-1 rounded-full bg-gold" />
                  {d}
                </li>
              ))}
            </ul>

            <div className="mt-12">
              <ArrowLink href="/about" variant="dark">
                More About Us
              </ArrowLink>
            </div>

            <div className="mt-16 grid grid-cols-2 gap-x-8 gap-y-10 border-t border-charcoal-1/10 pt-10 sm:grid-cols-4">
              {stats.map((s) => (
                <div key={s.label}>
                  <p className="font-display text-4xl text-charcoal-1 md:text-5xl">{s.value}</p>
                  <p className="mt-2 text-xs uppercase tracking-[0.15em] text-charcoal-2/60">{s.label}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-5">
            <RevealImage
              src={imagePool.aboutStudio}
              alt="D Mimo Architects studio model-making table"
              fill
              sizes="(max-width: 1024px) 100vw, 40vw"
              containerClassName="aspect-[4/5] w-full"
              parallax
            />
          </div>
        </div>
      </div>
    </section>
  );
}
