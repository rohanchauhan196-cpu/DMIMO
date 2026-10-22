import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";

export default function ArrowLink({
  href,
  children,
  className,
  variant = "light",
}: {
  href: string;
  children: React.ReactNode;
  className?: string;
  variant?: "light" | "dark";
}) {
  return (
    <Link
      href={href}
      className={cn(
        "group inline-flex items-center gap-2 text-xs font-medium uppercase tracking-[0.25em]",
        variant === "light" ? "text-ivory" : "text-charcoal-1",
        className
      )}
    >
      <span className="relative pb-1">
        {children}
        <span
          className={cn(
            "absolute bottom-0 left-0 h-px w-full origin-left scale-x-0 bg-gold transition-transform duration-500 ease-out group-hover:scale-x-100"
          )}
        />
      </span>
      <ArrowUpRight
        className="h-4 w-4 shrink-0 text-gold transition-transform duration-500 ease-out group-hover:translate-x-1 group-hover:-translate-y-1"
        strokeWidth={1.5}
      />
    </Link>
  );
}
