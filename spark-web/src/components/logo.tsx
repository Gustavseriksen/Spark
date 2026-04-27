import { cn } from "@/lib/utils";

export function Logo({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "font-satoshi text-2xl font-bold tracking-tight",
        className
      )}
    >
      Spark*
    </span>
  );
}