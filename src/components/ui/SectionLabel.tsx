import { cn } from "@/lib/utils";

export default function SectionLabel({
  children,
  className,
  light,
}: {
  children: React.ReactNode;
  className?: string;
  light?: boolean;
}) {
  return (
    <div className={cn("flex items-center gap-3", className)}>
      <span className="h-px w-8 bg-gold" />
      <span
        className={cn(
          "text-xs font-medium uppercase tracking-[0.3em]",
          light ? "text-charcoal-2/70" : "text-gold"
        )}
      >
        {children}
      </span>
    </div>
  );
}
