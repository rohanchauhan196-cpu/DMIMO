"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

type Service = {
  id: string;
  title: string;
  slug: string;
  number: string;
  shortDescription: string;
  image: string;
};

export default function ServicesInteractive({ services }: { services: Service[] }) {
  const [active, setActive] = useState(0);
  const [openMobile, setOpenMobile] = useState<number | null>(0);

  return (
    <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-8">
      {/* Desktop interactive list */}
      <div className="hidden lg:col-span-7 lg:block">
        {services.map((service, i) => (
          <Link
            key={service.id}
            href={`/services#${service.slug}`}
            onMouseEnter={() => setActive(i)}
            className="group relative flex items-center justify-between gap-6 border-b border-charcoal-3 py-7 transition-colors first:border-t hover:pl-4"
          >
            <div className="flex items-baseline gap-6">
              <span
                className={cn(
                  "font-display text-lg transition-colors duration-300",
                  active === i ? "text-gold" : "text-warm-grey"
                )}
              >
                {service.number}
              </span>
              <h3
                className={cn(
                  "font-display text-3xl transition-colors duration-300 xl:text-4xl",
                  active === i ? "text-gold" : "text-ivory"
                )}
              >
                {service.title}
              </h3>
            </div>
            <ArrowUpRight
              className={cn(
                "h-6 w-6 shrink-0 text-gold transition-all duration-300",
                active === i ? "opacity-100 translate-x-0" : "-translate-x-2 opacity-0"
              )}
              strokeWidth={1.25}
            />
          </Link>
        ))}
      </div>

      <div className="relative hidden aspect-[4/5] overflow-hidden bg-charcoal-2 lg:col-span-5 lg:block">
        {services.map((service, i) => (
          <div
            key={service.id}
            className={cn(
              "absolute inset-0 transition-opacity duration-700 ease-out",
              active === i ? "opacity-100" : "opacity-0"
            )}
          >
            <Image src={service.image} alt={service.title} fill sizes="40vw" className="object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />
            <p className="absolute bottom-8 left-8 right-8 text-sm leading-relaxed text-ivory/90">
              {service.shortDescription}
            </p>
          </div>
        ))}
      </div>

      {/* Mobile accordion */}
      <div className="col-span-1 lg:hidden">
        {services.map((service, i) => {
          const isOpen = openMobile === i;
          return (
            <div key={service.id} className="border-b border-charcoal-3 first:border-t">
              <button
                onClick={() => setOpenMobile(isOpen ? null : i)}
                className="flex w-full items-center justify-between gap-4 py-6 text-left"
              >
                <div className="flex items-baseline gap-4">
                  <span className="font-display text-base text-gold">{service.number}</span>
                  <h3 className="font-display text-2xl text-ivory">{service.title}</h3>
                </div>
                <Plus className={cn("h-5 w-5 shrink-0 text-gold transition-transform duration-300", isOpen && "rotate-45")} strokeWidth={1.5} />
              </button>
              <div
                className={cn(
                  "grid overflow-hidden transition-all duration-500 ease-out",
                  isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                )}
              >
                <div className="min-h-0">
                  <div className="relative mb-5 aspect-[16/10] overflow-hidden">
                    <Image src={service.image} alt={service.title} fill sizes="100vw" className="object-cover" />
                  </div>
                  <p className="pb-6 text-sm leading-relaxed text-warm-grey">{service.shortDescription}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
