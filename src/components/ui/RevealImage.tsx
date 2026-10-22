"use client";

import { useEffect, useRef } from "react";
import Image, { type ImageProps } from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { cn } from "@/lib/utils";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

type Props = Omit<ImageProps, "className"> & {
  containerClassName?: string;
  imageClassName?: string;
  parallax?: boolean;
};

export default function RevealImage({
  containerClassName,
  imageClassName,
  parallax = false,
  alt,
  ...imgProps
}: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    const img = imgRef.current;
    if (!container || !img) return;

    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) {
      gsap.set(container, { clipPath: "inset(0% 0% 0% 0%)" });
      gsap.set(img, { scale: 1 });
      return;
    }

    gsap.set(container, { clipPath: "inset(0% 0% 100% 0%)" });
    gsap.set(img, { scale: 1.25, yPercent: parallax ? -8 : 0 });

    const trigger = ScrollTrigger.create({
      trigger: container,
      start: "top 88%",
      once: true,
      onEnter: () => {
        gsap.to(container, { clipPath: "inset(0% 0% 0% 0%)", duration: 1.4, ease: "power4.out" });
        gsap.to(img, { scale: 1, duration: 1.6, ease: "power3.out" });
      },
    });

    let parallaxTrigger: ScrollTrigger | undefined;
    if (parallax) {
      parallaxTrigger = ScrollTrigger.create({
        trigger: container,
        start: "top bottom",
        end: "bottom top",
        scrub: true,
        onUpdate: (self) => {
          gsap.set(img, { yPercent: -8 + self.progress * 16 });
        },
      });
    }

    return () => {
      trigger.kill();
      parallaxTrigger?.kill();
    };
  }, [parallax]);

  return (
    <div ref={containerRef} className={cn("relative overflow-hidden", containerClassName)}>
      <div ref={imgRef} className="absolute inset-0">
        <Image
          {...imgProps}
          alt={alt}
          className={cn("h-full w-full object-cover", imageClassName)}
        />
      </div>
    </div>
  );
}
