import RevealText, { RevealLine } from "@/components/ui/RevealText";
import SectionLabel from "@/components/ui/SectionLabel";

export default function Introduction() {
  return (
    <section className="bg-ivory py-28 text-charcoal-1 md:py-36">
      <div className="mx-auto max-w-[1600px] px-6 md:px-10">
        <SectionLabel light className="mb-10">
          Our Philosophy
        </SectionLabel>

        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12">
          <RevealText
            as="h2"
            className="font-display text-[8.5vw] font-light leading-[1.15] sm:text-5xl md:text-6xl lg:col-span-8 lg:text-[4.2vw] lg:leading-[1.1]"
          >
            <RevealLine>Architecture is not simply</RevealLine>
            <RevealLine>about building spaces. It is</RevealLine>
            <RevealLine>
              about creating the <span className="italic text-gold">way</span>
            </RevealLine>
            <RevealLine>people experience them.</RevealLine>
          </RevealText>

          <div className="lg:col-span-4 lg:pt-4">
            <RevealText className="space-y-6 text-base leading-relaxed text-charcoal-2/80 md:text-lg">
              <RevealLine className="whitespace-normal">
                Every D Mimo project begins with the same question — not what
                will this building look like, but how will it feel to move
                through it, to live in it, to return to it.
              </RevealLine>
            </RevealText>
            <RevealText delay={0.15} className="mt-6 text-base leading-relaxed text-charcoal-2/80 md:text-lg">
              <RevealLine className="whitespace-normal">
                We work across architecture, interiors and master planning —
                treating each discipline as inseparable from the others.
              </RevealLine>
            </RevealText>
          </div>
        </div>
      </div>
    </section>
  );
}
