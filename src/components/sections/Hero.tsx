"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ChevronDown } from "lucide-react";
import GoldButton from "@/components/ui/GoldButton";
import { imagePool } from "@/lib/images";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export default function Hero() {
  const imgWrapRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLDivElement>(null);
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const ctx = gsap.context(() => {
      if (prefersReduced) {
        gsap.set(
          [
            imgWrapRef.current,
            ".hero-label",
            ".hero-line > span",
            ".hero-sub",
            ".hero-cta",
            ".hero-scroll",
          ],
          { clipPath: "inset(0% 0% 0% 0%)", opacity: 1, y: 0, yPercent: 0 }
        );
        return;
      }

      const tl = gsap.timeline({ defaults: { ease: "power4.out" } });

      tl.set(imgWrapRef.current, { clipPath: "inset(100% 0% 0% 0%)" })
        .set(imgRef.current, { scale: 1.3 })
        .set(".hero-line > span", { yPercent: 115, opacity: 0 })
        .set([".hero-label", ".hero-sub", ".hero-cta", ".hero-scroll"], { opacity: 0, y: 16 })
        .to(imgWrapRef.current, { clipPath: "inset(0% 0% 0% 0%)", duration: 1.6 }, 0.1)
        .to(imgRef.current, { scale: 1, duration: 2.2, ease: "power3.out" }, 0.1)
        .to(".hero-label", { opacity: 1, y: 0, duration: 0.8 }, 0.5)
        .to(".hero-line > span", { yPercent: 0, opacity: 1, duration: 1.1, stagger: 0.12 }, 0.65)
        .to(".hero-sub", { opacity: 1, y: 0, duration: 0.8 }, "-=0.5")
        .to(".hero-cta", { opacity: 1, y: 0, duration: 0.8 }, "-=0.55")
        .to(".hero-scroll", { opacity: 1, y: 0, duration: 0.8 }, "-=0.5");

      // subtle continuous parallax on scroll
      gsap.to(imgRef.current, {
        yPercent: 12,
        ease: "none",
        scrollTrigger: {
          trigger: root.current,
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
      });
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={root} className="relative flex h-dvh min-h-[680px] w-full items-end overflow-hidden bg-black">
      <div ref={imgWrapRef} className="absolute inset-0">
        <div ref={imgRef} className="absolute inset-0">
          <Image
            src={imagePool.heroMain}
            alt="A minimalist concrete and glass residence by D Mimo Architects"
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/35 to-black/55" />
        <div className="absolute inset-0 bg-black/15" />
      </div>

      <div className="relative z-10 mx-auto w-full max-w-[1600px] px-6 pb-16 pt-32 md:px-10 md:pb-20">
        <div className="hero-label mb-6 flex items-center gap-3">
          <span className="h-px w-10 bg-gold" />
          <span className="text-xs font-medium uppercase tracking-[0.35em] text-champagne">
            D Mimo Architects — Architecture / Interiors / Design
          </span>
        </div>

        <h1 className="font-display text-[14vw] font-light leading-[0.95] text-ivory sm:text-[11vw] md:text-[8vw] lg:text-[7.2vw]">
          <span className="hero-line block overflow-hidden">
            <span className="inline-block">WE SHAPE</span>
          </span>
          <span className="hero-line block overflow-hidden">
            <span className="inline-block">
              SPACES INTO <span className="italic text-gold">EXPERIENCES.</span>
            </span>
          </span>
        </h1>

        <div className="mt-10 flex flex-col items-start justify-between gap-10 border-t border-ivory/15 pt-8 md:flex-row md:items-end xl:pr-28">
          <p className="hero-sub max-w-md text-base leading-relaxed text-ivory/70 md:text-lg">
            An international studio for architecture, interiors and master
            planning — designing buildings that are resolved in both idea
            and detail, from first sketch to final handover.
          </p>

          <div className="hero-cta flex items-center gap-8">
            <GoldButton href="/projects">Explore Projects</GoldButton>
            <div className="hidden text-right text-xs uppercase tracking-[0.2em] text-ivory/50 xl:block">
              <p>Based in India</p>
              <p>Projects Worldwide</p>
            </div>
          </div>
        </div>
      </div>

      <div className="hero-scroll absolute bottom-5 left-1/2 z-10 hidden -translate-x-1/2 text-ivory/60 xl:block">
        <ChevronDown className="h-5 w-5 animate-bounce" strokeWidth={1.5} />
      </div>
    </section>
  );
}
