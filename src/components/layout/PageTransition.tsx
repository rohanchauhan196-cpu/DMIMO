"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

export default function PageTransition({ children }: { children: React.ReactNode }) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const overlay = overlayRef.current;
    const line = lineRef.current;
    if (!overlay || !line) return;

    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) {
      gsap.set(overlay, { autoAlpha: 0 });
      return;
    }

    window.scrollTo(0, 0);

    const tl = gsap.timeline();
    tl.set(overlay, { yPercent: 0, autoAlpha: 1 })
      .set(line, { scaleX: 0 })
      .to(line, { scaleX: 1, duration: 0.45, ease: "power2.inOut" })
      .to(overlay, { yPercent: -100, duration: 0.6, ease: "power4.inOut", delay: 0.05 })
      .set(overlay, { autoAlpha: 0 });
  }, []);

  return (
    <>
      <div
        ref={overlayRef}
        className="pointer-events-none fixed inset-0 z-[90] flex items-center justify-center bg-black"
        style={{ visibility: "hidden" }}
      >
        <div ref={lineRef} className="h-px w-32 origin-left bg-gold" />
      </div>
      {children}
    </>
  );
}
