"use client";

import { useRef } from "react";
import gsap from "gsap";
import { cn } from "@/lib/utils";

export default function MagneticButton({
  children,
  className,
  strength = 0.35,
  as: Tag = "div",
}: {
  children: React.ReactNode;
  className?: string;
  strength?: number;
  as?: "div" | "span";
}) {
  const ref = useRef<HTMLDivElement>(null);

  const handleMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(pointer: coarse)").matches) return;
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    gsap.to(el, { x: x * strength, y: y * strength, duration: 0.6, ease: "power3.out" });
  };

  const handleLeave = () => {
    const el = ref.current;
    if (!el) return;
    gsap.to(el, { x: 0, y: 0, duration: 0.6, ease: "elastic.out(1, 0.4)" });
  };

  return (
    <Tag
      ref={ref as never}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      className={cn("inline-block will-change-transform", className)}
    >
      {children}
    </Tag>
  );
}
