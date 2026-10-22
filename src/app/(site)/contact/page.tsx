import type { Metadata } from "next";
import { Mail, Phone, MapPin, Instagram, Linkedin } from "lucide-react";
import SectionLabel from "@/components/ui/SectionLabel";
import ContactForm from "@/components/sections/ContactForm";
import RevealImage from "@/components/ui/RevealImage";
import { getSiteSettings } from "@/lib/data";
import { imagePool } from "@/lib/images";

export const metadata: Metadata = {
  title: "Contact",
  description: "Start a project with D Mimo Architects — architecture, interior design and master planning.",
};

export default async function ContactPage() {
  const settings = await getSiteSettings();

  return (
    <div className="bg-black pb-28 pt-40 md:pb-36 md:pt-48">
      <div className="mx-auto max-w-[1600px] px-6 md:px-10">
        <SectionLabel className="mb-8">Get in Touch</SectionLabel>
        <h1 className="max-w-3xl font-display text-5xl font-light leading-[1.05] text-ivory sm:text-6xl md:text-7xl">
          Let&apos;s start a <span className="italic text-gold">conversation.</span>
        </h1>
        <p className="mt-8 max-w-xl text-base leading-relaxed text-warm-grey md:text-lg">
          Tell us a little about your project and we&apos;ll be in touch
          within two working days to arrange an initial conversation.
        </p>
      </div>

      <div className="mx-auto mt-20 grid max-w-[1600px] grid-cols-1 gap-16 px-6 md:px-10 lg:grid-cols-12">
        <div className="lg:col-span-7">
          <ContactForm />
        </div>

        <div className="space-y-12 lg:col-span-4 lg:col-start-9">
          <div>
            <p className="mb-4 text-xs uppercase tracking-[0.2em] text-gold">Studio</p>
            <div className="space-y-4 text-ivory">
              <a href={`mailto:${settings.email}`} className="flex items-center gap-3 transition-colors hover:text-gold">
                <Mail className="h-4 w-4 shrink-0 text-gold" strokeWidth={1.5} />
                {settings.email}
              </a>
              <a href={`tel:${settings.phone.replace(/\s+/g, "")}`} className="flex items-center gap-3 transition-colors hover:text-gold">
                <Phone className="h-4 w-4 shrink-0 text-gold" strokeWidth={1.5} />
                {settings.phone}
              </a>
              <div className="flex items-start gap-3">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-gold" strokeWidth={1.5} />
                <span className="leading-relaxed">{settings.address}</span>
              </div>
            </div>
          </div>

          <div>
            <p className="mb-4 text-xs uppercase tracking-[0.2em] text-gold">Follow</p>
            <div className="flex gap-4">
              <a
                href={settings.instagramUrl}
                target="_blank"
                rel="noreferrer"
                aria-label="Instagram"
                className="flex h-10 w-10 items-center justify-center border border-charcoal-3 text-ivory/70 transition-colors hover:border-gold hover:text-gold"
              >
                <Instagram className="h-4 w-4" strokeWidth={1.5} />
              </a>
              <a
                href={settings.linkedinUrl}
                target="_blank"
                rel="noreferrer"
                aria-label="LinkedIn"
                className="flex h-10 w-10 items-center justify-center border border-charcoal-3 text-ivory/70 transition-colors hover:border-gold hover:text-gold"
              >
                <Linkedin className="h-4 w-4" strokeWidth={1.5} />
              </a>
            </div>
          </div>

          <RevealImage
            src={imagePool.contactVisual}
            alt="D Mimo Architects studio interior"
            fill
            sizes="(max-width: 1024px) 100vw, 30vw"
            containerClassName="aspect-[3/4] w-full"
          />
        </div>
      </div>
    </div>
  );
}
