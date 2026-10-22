import Link from "next/link";
import { cn } from "@/lib/utils";
import { ArrowUpRight } from "lucide-react";

type Props = {
  children: React.ReactNode;
  className?: string;
  variant?: "outline" | "solid";
  tone?: "light" | "dark";
  icon?: boolean;
} & (
  | { href: string; onClick?: never; type?: never }
  | { href?: never; onClick?: () => void; type?: "button" | "submit" }
);

export default function GoldButton({ children, className, variant = "outline", tone = "light", icon = true, ...rest }: Props) {
  const base = cn(
    "group relative inline-flex items-center gap-3 overflow-hidden px-7 py-4 text-xs font-medium uppercase tracking-[0.25em] transition-colors duration-500",
    variant === "outline" &&
      (tone === "light"
        ? "border border-gold/60 text-ivory hover:text-charcoal-1"
        : "border border-charcoal-1/30 text-charcoal-1 hover:text-ivory"),
    variant === "solid" && "bg-gold text-charcoal-1",
    className
  );

  const fill = (
    <span
      className={cn(
        "absolute inset-0 -z-10 origin-left scale-x-0 transition-transform duration-500 ease-out group-hover:scale-x-100",
        tone === "light" ? "bg-gold" : "bg-charcoal-1"
      )}
    />
  );

  const content = (
    <>
      {variant === "outline" && fill}
      <span className="relative z-10">{children}</span>
      {icon && (
        <ArrowUpRight
          className="relative z-10 h-4 w-4 transition-transform duration-500 ease-out group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
          strokeWidth={1.5}
        />
      )}
    </>
  );

  if ("href" in rest && rest.href) {
    return (
      <Link href={rest.href} className={base}>
        {content}
      </Link>
    );
  }

  return (
    <button
      type={("type" in rest && rest.type) || "button"}
      onClick={"onClick" in rest ? rest.onClick : undefined}
      className={base}
    >
      {content}
    </button>
  );
}
