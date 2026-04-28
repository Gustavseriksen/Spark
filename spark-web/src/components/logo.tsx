import Image from "next/image";

import { cn } from "@/lib/utils";

export function Logo({ className }: { className?: string }) {
  return (
    <Image
      src="/png/logo.png"
      alt="Spark"
      width={1181}
      height={295}
      className={cn(
        "block h-8 w-auto shrink-0 object-contain object-left",
        className
      )}
      priority
    />
  );
}
