"use client";

import { useState } from "react";
import { Link2, Linkedin, Twitter, Check } from "lucide-react";

export default function ShareButtons({ title, url }: { title: string; url: string }) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // clipboard unavailable — silently ignore
    }
  };

  return (
    <div className="flex items-center gap-3">
      <a
        href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`}
        target="_blank"
        rel="noreferrer"
        aria-label="Share on Twitter"
        className="flex h-10 w-10 items-center justify-center border border-charcoal-3 text-ivory/70 transition-colors hover:border-gold hover:text-gold"
      >
        <Twitter className="h-4 w-4" strokeWidth={1.5} />
      </a>
      <a
        href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`}
        target="_blank"
        rel="noreferrer"
        aria-label="Share on LinkedIn"
        className="flex h-10 w-10 items-center justify-center border border-charcoal-3 text-ivory/70 transition-colors hover:border-gold hover:text-gold"
      >
        <Linkedin className="h-4 w-4" strokeWidth={1.5} />
      </a>
      <button
        onClick={copy}
        aria-label="Copy link"
        className="flex h-10 w-10 items-center justify-center border border-charcoal-3 text-ivory/70 transition-colors hover:border-gold hover:text-gold"
      >
        {copied ? <Check className="h-4 w-4 text-gold" strokeWidth={1.5} /> : <Link2 className="h-4 w-4" strokeWidth={1.5} />}
      </button>
    </div>
  );
}
