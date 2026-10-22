"use client";

import { useEffect, useState } from "react";
import { ArrowLeft, ArrowRight, Quote } from "lucide-react";
import { cn } from "@/lib/utils";

type Testimonial = {
  id: string;
  quote: string;
  clientName: string;
  project: string;
  location: string;
};

export default function TestimonialsCarousel({ testimonials }: { testimonials: Testimonial[] }) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setIndex((i) => (i + 1) % testimonials.length), 7000);
    return () => clearInterval(t);
  }, [testimonials.length]);

  if (testimonials.length === 0) return null;
  const current = testimonials[index];

  return (
    <div className="relative mx-auto max-w-4xl text-center">
      <Quote className="mx-auto mb-8 h-10 w-10 text-gold/60" strokeWidth={1} />

      <div className="relative min-h-[340px] sm:min-h-[220px] md:min-h-[180px] lg:min-h-[150px]">
        {testimonials.map((t, i) => (
          <blockquote
            key={t.id}
            className={cn(
              "absolute inset-0 transition-opacity duration-700 ease-out",
              i === index ? "opacity-100" : "pointer-events-none opacity-0"
            )}
          >
            <p className="font-display text-2xl font-light leading-snug text-ivory sm:text-3xl md:text-4xl">
              “{t.quote}”
            </p>
          </blockquote>
        ))}
      </div>

      <div className="mt-10 text-sm uppercase tracking-[0.2em] text-warm-grey">
        <span className="text-ivory">{current.clientName}</span>
        <span className="mx-2 text-gold">—</span>
        <span>{current.project}, {current.location}</span>
      </div>

      <div className="mt-10 flex items-center justify-center gap-6">
        <button
          aria-label="Previous testimonial"
          onClick={() => setIndex((i) => (i - 1 + testimonials.length) % testimonials.length)}
          className="flex h-10 w-10 items-center justify-center border border-charcoal-3 text-ivory/70 transition-colors hover:border-gold hover:text-gold"
        >
          <ArrowLeft className="h-4 w-4" strokeWidth={1.5} />
        </button>
        <div className="flex gap-2">
          {testimonials.map((t, i) => (
            <button
              key={t.id}
              aria-label={`Go to testimonial ${i + 1}`}
              onClick={() => setIndex(i)}
              className={cn("h-1.5 w-1.5 rounded-full transition-all", i === index ? "w-6 bg-gold" : "bg-charcoal-3")}
            />
          ))}
        </div>
        <button
          aria-label="Next testimonial"
          onClick={() => setIndex((i) => (i + 1) % testimonials.length)}
          className="flex h-10 w-10 items-center justify-center border border-charcoal-3 text-ivory/70 transition-colors hover:border-gold hover:text-gold"
        >
          <ArrowRight className="h-4 w-4" strokeWidth={1.5} />
        </button>
      </div>
    </div>
  );
}
