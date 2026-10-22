"use client";

import { useState } from "react";
import Image from "next/image";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import RevealImage from "@/components/ui/RevealImage";
import { cn } from "@/lib/utils";

type GalleryImage = { id: string; url: string; caption: string | null; layout: string };

const SPAN: Record<string, string> = {
  full: "sm:col-span-12 aspect-[16/9]",
  half: "sm:col-span-6 aspect-[4/5]",
  large: "sm:col-span-7 aspect-[4/5]",
  small: "sm:col-span-5 aspect-[4/5]",
};

export default function ProjectGallery({ images, projectTitle }: { images: GalleryImage[]; projectTitle: string }) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-12">
      {images.map((img, i) => (
        <div key={img.id} className={cn("relative", SPAN[img.layout] ?? SPAN.half)}>
          <button
            type="button"
            onClick={() => setLightboxIndex(i)}
            className="block h-full w-full cursor-zoom-in"
            aria-label="Open image fullscreen"
          >
            <RevealImage
              src={img.url}
              alt={img.caption ?? `${projectTitle} — image ${i + 1}`}
              fill
              sizes="(max-width: 640px) 100vw, 60vw"
              containerClassName="h-full w-full"
            />
          </button>
          {img.caption && <p className="mt-3 text-xs uppercase tracking-[0.15em] text-warm-grey">{img.caption}</p>}
        </div>
      ))}

      {lightboxIndex !== null && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black p-4 sm:p-10">
          <button
            onClick={() => setLightboxIndex(null)}
            aria-label="Close"
            className="absolute right-5 top-5 z-10 flex h-11 w-11 items-center justify-center border border-ivory/20 text-ivory transition-colors hover:border-gold hover:text-gold"
          >
            <X className="h-5 w-5" strokeWidth={1.5} />
          </button>
          <button
            onClick={() => setLightboxIndex((i) => (i === null ? 0 : (i - 1 + images.length) % images.length))}
            aria-label="Previous image"
            className="absolute left-4 z-10 flex h-11 w-11 items-center justify-center border border-ivory/20 text-ivory transition-colors hover:border-gold hover:text-gold sm:left-8"
          >
            <ChevronLeft className="h-5 w-5" strokeWidth={1.5} />
          </button>
          <div className="relative h-full w-full max-w-6xl">
            <Image
              src={images[lightboxIndex].url}
              alt={images[lightboxIndex].caption ?? projectTitle}
              fill
              sizes="90vw"
              className="object-contain"
            />
          </div>
          <button
            onClick={() => setLightboxIndex((i) => (i === null ? 0 : (i + 1) % images.length))}
            aria-label="Next image"
            className="absolute right-4 z-10 flex h-11 w-11 items-center justify-center border border-ivory/20 text-ivory transition-colors hover:border-gold hover:text-gold sm:right-8"
          >
            <ChevronRight className="h-5 w-5" strokeWidth={1.5} />
          </button>
        </div>
      )}
    </div>
  );
}
