"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import gsap from "gsap";
import { Menu, X, Instagram, Linkedin } from "lucide-react";
import { cn } from "@/lib/utils";

const NAV_LINKS = [
  { label: "About", href: "/about" },
  { label: "Projects", href: "/projects" },
  { label: "Services", href: "/services" },
  { label: "Journal", href: "/blog" },
  { label: "Contact", href: "/contact" },
];

// Only these routes open on a full-bleed dark hero image, so only they get
// a genuinely transparent navbar at scroll position 0. Every other page
// starts on a solid (ivory or black) background and needs the solid navbar
// from the first frame, or nav text has no reliable contrast to sit against.
function hasDarkHero(pathname: string) {
  return pathname === "/" || /^\/projects\/[^/]+$/.test(pathname);
}

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const menuRef = useRef<HTMLDivElement>(null);
  const linksRef = useRef<HTMLDivElement>(null);
  const transparentCapable = hasDarkHero(pathname);

  useEffect(() => {
    if (!transparentCapable) {
      setScrolled(true);
      return;
    }
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [transparentCapable]);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.documentElement.style.overflow = open ? "hidden" : "";
    if (open && menuRef.current && linksRef.current) {
      gsap.fromTo(
        menuRef.current,
        { clipPath: "inset(0% 0% 100% 0%)" },
        { clipPath: "inset(0% 0% 0% 0%)", duration: 0.7, ease: "power4.out" }
      );
      gsap.fromTo(
        linksRef.current.children,
        { yPercent: 110, opacity: 0 },
        { yPercent: 0, opacity: 1, duration: 0.8, stagger: 0.07, delay: 0.25, ease: "power4.out" }
      );
    }
  }, [open]);

  const solid = scrolled || open;

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-colors duration-500",
        solid ? "bg-black/95 backdrop-blur-sm" : "bg-transparent"
      )}
    >
      <div
        className={cn(
          "mx-auto flex max-w-[1600px] items-center justify-between px-6 transition-all duration-500 md:px-10",
          solid ? "py-4" : "py-6 md:py-8"
        )}
      >
        <Link href="/" className="group flex items-center gap-3">
          <Image src="/logo.png" alt="D Mimo Architects" width={36} height={36} className="h-8 w-8 md:h-9 md:w-9" priority />
          <span className="font-display text-lg tracking-[0.15em] text-ivory md:text-xl">
            D MIMO <span className="text-gold">ARCHITECTS</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-10 lg:flex">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "group relative text-xs font-medium uppercase tracking-[0.2em] transition-colors",
                pathname === link.href ? "text-gold" : "text-ivory/80 hover:text-ivory"
              )}
            >
              {link.label}
              <span
                className={cn(
                  "absolute -bottom-1.5 left-0 h-px bg-gold transition-all duration-300",
                  pathname === link.href ? "w-full" : "w-0 group-hover:w-full"
                )}
              />
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-6">
          <Link
            href="/contact"
            className="hidden border border-gold/50 px-5 py-2.5 text-xs font-medium uppercase tracking-[0.2em] text-ivory transition-colors hover:border-gold hover:bg-gold hover:text-charcoal-1 lg:inline-block"
          >
            Start a Project
          </Link>
          <button
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen((v) => !v)}
            className="relative z-[60] flex h-10 w-10 items-center justify-center text-ivory lg:hidden"
          >
            {open ? <X size={24} strokeWidth={1.5} /> : <Menu size={24} strokeWidth={1.5} />}
          </button>
        </div>
      </div>

      {open && (
        <div
          ref={menuRef}
          className="fixed inset-0 top-0 z-50 flex h-dvh flex-col justify-between bg-black px-6 pb-10 pt-28 md:px-10"
        >
          <div ref={linksRef} className="flex flex-col gap-2">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="reveal-line border-b border-charcoal-3 py-4 font-display text-4xl text-ivory transition-colors hover:text-gold sm:text-5xl"
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="flex flex-col gap-6 text-sm text-warm-grey sm:flex-row sm:items-end sm:justify-between">
            <div className="space-y-1">
              <p className="text-xs uppercase tracking-[0.25em] text-gold">Studio</p>
              <p>studio@dmimoarchitects.com</p>
              <p>+91 98100 00000</p>
            </div>
            <div className="flex gap-4">
              <Instagram className="h-5 w-5" strokeWidth={1.5} />
              <Linkedin className="h-5 w-5" strokeWidth={1.5} />
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
