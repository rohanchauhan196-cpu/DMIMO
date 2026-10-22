"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import GoldButton from "@/components/ui/GoldButton";
import RevealText, { RevealLine } from "@/components/ui/RevealText";
import { imagePool } from "@/lib/images";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export default function CTASection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const img = imgRef.current;
    if (!section || !img) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const trigger = ScrollTrigger.create({
      trigger: section,
      start: "top bottom",
      end: "bottom top",
      scrub: true,
      onUpdate: (self) => gsap.set(img, { yPercent: -10 + self.progress * 20 }),
    });
    return () => trigger.kill();
  }, []);

  return (
    <section ref={sectionRef} className="relative overflow-hidden bg-black py-36 md:py-48">
      <div ref={imgRef} className="absolute inset-0 scale-110">
        <Image
          src={imagePool.ctaBg}
          alt="A dusk view of a D Mimo Architects building facade"
          fill
          sizes="100vw"
          className="object-cover"
        />
      </div>
      <div className="absolute inset-0 bg-black/70" />

      <div className="relative mx-auto max-w-[1600px] px-6 text-center md:px-10">
        <RevealText
          as="h2"
          className="font-display text-5xl font-light leading-[1.05] text-ivory sm:text-6xl md:text-7xl lg:text-8xl"
        >
          <RevealLine>LET&apos;S CREATE</RevealLine>
          <RevealLine>
            SOMETHING <span className="italic text-gold">TIMELESS.</span>
          </RevealLine>
        </RevealText>

        <div className="mt-12 flex justify-center">
          <GoldButton href="/contact" variant="solid">
            Start a Project
          </GoldButton>
        </div>
      </div>
    </section>
  );
}
