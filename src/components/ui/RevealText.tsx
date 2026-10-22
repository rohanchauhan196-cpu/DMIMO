"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { cn } from "@/lib/utils";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

type Props = {
  children: React.ReactNode;
  as?: "h1" | "h2" | "h3" | "p" | "div" | "span";
  className?: string;
  delay?: number;
  /** Trigger immediately on mount instead of on scroll (for hero headlines). */
  onLoad?: boolean;
  stagger?: number;
};

/**
 * Splits text content into lines (one <span> per top-level child already
 * line-broken by the author via <br/> or separate elements) and reveals
 * them with a clip + translateY animation. For single-line use, wrap the
 * whole string as children — it still reveals as one block.
 */
export default function RevealText({
  children,
  as = "div",
  className,
  delay = 0,
  onLoad = false,
  stagger = 0.08,
}: Props) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const lines = el.querySelectorAll<HTMLElement>(".reveal-line > span");

    if (prefersReduced) {
      gsap.set(lines, { yPercent: 0, opacity: 1 });
      return;
    }

    gsap.set(lines, { yPercent: 110, opacity: 0 });

    const anim = () =>
      gsap.to(lines, {
        yPercent: 0,
        opacity: 1,
        duration: 1.1,
        ease: "power4.out",
        stagger,
        delay,
      });

    if (onLoad) {
      const t = setTimeout(anim, 50);
      return () => clearTimeout(t);
    }

    const trigger = ScrollTrigger.create({
      trigger: el,
      start: "top 85%",
      once: true,
      onEnter: anim,
    });

    return () => trigger.kill();
  }, [delay, onLoad, stagger]);

  const Tag = as;

  return (
    <Tag ref={ref as never} className={cn(className)}>
      {children}
    </Tag>
  );
}

export function RevealLine({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <span className={cn("reveal-line", className)}>
      <span>{children}</span>
    </span>
  );
}
