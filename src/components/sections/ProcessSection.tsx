"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import SectionLabel from "@/components/ui/SectionLabel";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const STEPS = [
  { number: "01", title: "Discover", desc: "We begin with the site, the brief and the client — multiple visits, research into context, climate and precedent, before a single line is drawn." },
  { number: "02", title: "Concept", desc: "A small number of strong spatial ideas are tested against the brief, budget and site constraints until one clear direction emerges." },
  { number: "03", title: "Develop", desc: "The concept is resolved into plans, sections and material decisions — structure, services and interiors developed in parallel, not sequence." },
  { number: "04", title: "Detail", desc: "Every junction, finish and fixture is drawn and specified. This is where a good concept either survives contact with reality, or doesn't." },
  { number: "05", title: "Deliver", desc: "Our team stays engaged through construction with regular site supervision, ensuring what gets built matches what was designed." },
];

export default function ProcessSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const track = trackRef.current;
    if (!section || !track) return;

    // Deliberately avoids ScrollTrigger's `pin: true`: pinning reparents the
    // trigger element into a GSAP-created spacer div, which fights React's
    // unmount (a client-side route change can try to remove a node that
    // GSAP has already moved, throwing a NotFoundError on removeChild).
    // CSS `position: sticky` gives the same "stays in view while scrolling"
    // effect natively, so GSAP only ever touches a transform — no DOM
    // reparenting, so navigation away from this section is always safe.
    const mm = gsap.matchMedia();

    mm.add("(min-width: 1024px) and (prefers-reduced-motion: no-preference)", () => {
      const scrollDistance = track.scrollWidth - window.innerWidth;
      gsap.set(section, { height: `calc(100vh + ${scrollDistance}px)` });

      const tween = gsap.to(track, {
        x: -scrollDistance,
        ease: "none",
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: "bottom bottom",
          scrub: 0.6,
        },
      });

      return () => {
        tween.scrollTrigger?.kill();
        tween.kill();
        gsap.set(section, { clearProps: "height" });
      };
    });

    return () => mm.revert();
  }, []);

  return (
    <section ref={sectionRef} className="relative overflow-hidden bg-ivory py-28 text-charcoal-1 lg:py-0">
      <div className="mx-auto max-w-[1600px] px-6 md:px-10 lg:sticky lg:top-0 lg:flex lg:h-screen lg:items-center lg:overflow-hidden lg:px-0">
        <div
          ref={trackRef}
          className="flex flex-col gap-16 lg:h-auto lg:w-max lg:flex-row lg:items-center lg:gap-0 lg:pl-10"
        >
          <div className="shrink-0 lg:w-[380px] lg:pr-16">
            <SectionLabel light className="mb-6">
              How We Work
            </SectionLabel>
            <h2 className="font-display text-4xl font-light leading-tight sm:text-5xl">
              Our <span className="italic text-gold">Process.</span>
            </h2>
            <p className="mt-6 max-w-xs text-sm leading-relaxed text-charcoal-2/70 lg:hidden">
              Five stages, from first site visit to final handover.
            </p>
          </div>

          {STEPS.map((step) => (
            <div
              key={step.number}
              className="flex shrink-0 flex-col border-t border-charcoal-1/15 pt-8 lg:h-[60vh] lg:w-[420px] lg:justify-center lg:border-l lg:border-t-0 lg:pl-16 lg:pt-0"
            >
              <span className="font-display text-6xl text-gold/70 lg:text-8xl">{step.number}</span>
              <h3 className="mt-4 font-display text-3xl lg:text-4xl">{step.title}</h3>
              <p className="mt-4 max-w-sm text-sm leading-relaxed text-charcoal-2/70 lg:text-base">{step.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
