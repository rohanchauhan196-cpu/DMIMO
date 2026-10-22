import Link from "next/link";
import Image from "next/image";
import { Instagram, Linkedin, ArrowUpRight } from "lucide-react";
import { getSiteSettings } from "@/lib/data";

const COLUMNS = [
  {
    heading: "Navigate",
    links: [
      { label: "Projects", href: "/projects" },
      { label: "About", href: "/about" },
      { label: "Services", href: "/services" },
      { label: "Journal", href: "/blog" },
      { label: "Contact", href: "/contact" },
    ],
  },
  {
    heading: "Expertise",
    links: [
      { label: "Architecture", href: "/services#architecture" },
      { label: "Interior Design", href: "/services#interior-design" },
      { label: "Hospitality", href: "/services#hospitality" },
      { label: "Urban Planning", href: "/services#urban-planning" },
    ],
  },
];

export default async function Footer() {
  const settings = await getSiteSettings();

  return (
    <footer className="relative border-t border-charcoal-3 bg-black pt-24">
      <div className="mx-auto max-w-[1600px] px-6 md:px-10">
        <div className="grid grid-cols-1 gap-16 pb-20 lg:grid-cols-[1.3fr_0.7fr_0.7fr_1fr]">
          <div>
            <div className="mb-6 flex items-center gap-3">
              <Image src="/logo.png" alt="D Mimo Architects" width={40} height={40} className="h-9 w-9" />
              <span className="font-display text-xl tracking-[0.15em] text-ivory">
                D MIMO <span className="text-gold">ARCHITECTS</span>
              </span>
            </div>
            <p className="max-w-sm text-sm leading-relaxed text-warm-grey">{settings.footerNote}</p>
            <div className="mt-8 flex gap-4">
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
              <a
                href={settings.pinterestUrl}
                target="_blank"
                rel="noreferrer"
                aria-label="Pinterest"
                className="flex h-10 w-10 items-center justify-center border border-charcoal-3 text-xs font-medium text-ivory/70 transition-colors hover:border-gold hover:text-gold"
              >
                P
              </a>
              <a
                href={settings.behanceUrl}
                target="_blank"
                rel="noreferrer"
                aria-label="Behance"
                className="flex h-10 w-10 items-center justify-center border border-charcoal-3 text-xs font-medium text-ivory/70 transition-colors hover:border-gold hover:text-gold"
              >
                Be
              </a>
            </div>
          </div>

          {COLUMNS.map((col) => (
            <div key={col.heading}>
              <p className="mb-5 text-xs font-medium uppercase tracking-[0.25em] text-gold">{col.heading}</p>
              <ul className="space-y-3">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-warm-grey transition-colors hover:text-ivory"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div>
            <p className="mb-5 text-xs font-medium uppercase tracking-[0.25em] text-gold">Studio</p>
            <ul className="space-y-3 text-sm text-warm-grey">
              <li>
                <a href={`mailto:${settings.email}`} className="transition-colors hover:text-ivory">
                  {settings.email}
                </a>
              </li>
              <li>
                <a href={`tel:${settings.phone.replace(/\s+/g, "")}`} className="transition-colors hover:text-ivory">
                  {settings.phone}
                </a>
              </li>
              <li className="max-w-[220px] leading-relaxed">{settings.address}</li>
            </ul>
            <Link
              href="/contact"
              className="group mt-6 inline-flex items-center gap-2 text-xs font-medium uppercase tracking-[0.2em] text-ivory"
            >
              Start a Project
              <ArrowUpRight className="h-3.5 w-3.5 text-gold transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
            </Link>
          </div>
        </div>

        <div className="flex flex-col gap-4 border-t border-charcoal-3 py-8 text-xs text-warm-grey sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} D Mimo Architects. All Rights Reserved.</p>
          <div className="flex gap-6">
            <Link href="/privacy" className="transition-colors hover:text-ivory">
              Privacy Policy
            </Link>
            <Link href="/terms" className="transition-colors hover:text-ivory">
              Terms
            </Link>
          </div>
        </div>
      </div>

      <div className="overflow-hidden border-t border-charcoal-3 py-4">
        <p className="select-none whitespace-nowrap text-center font-display text-[16vw] leading-none tracking-tight text-charcoal-2 sm:text-[12vw]">
          D MIMO ARCHITECTS
        </p>
      </div>
    </footer>
  );
}
